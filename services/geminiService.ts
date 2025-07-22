
import { GoogleGenAI } from "@google/genai";
import type { NewsletterData, NewsletterSectionData } from '../types';
import { cacheService } from './cacheService';
import { APIRetryService } from './apiRetryService';

// Initialize the Gemini client. Uses Vite environment variable.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// Rate limiting
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests = 50; // Gemini API limit
  private readonly windowMs = 60 * 1000; // 1 minute

  async checkLimit(): Promise<void> {
    const now = Date.now();
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.windowMs - (now - oldestRequest) + 100; // Add small buffer
      console.log(`Rate limit reached. Waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.checkLimit(); // Recheck after waiting
    }
    
    this.requests.push(now);
  }
}

const rateLimiter = new RateLimiter();

const PROMPT = `
You are an AI assistant for GreyBrain AI, generating a curated newsletter called "GreyBrain AI Pulse" on Large Language Models (LLMs) and healthcare.
Your task is to find recent information using Google Search and format it into a single, valid JSON object.

**IMPORTANT**: Your entire response MUST be ONLY the JSON object. Do not include any introductory text, closing remarks, or markdown formatting like \`\`\`json.

Use the following strict JSON structure. Pay very close attention to comma placement, especially for the last item in any array.

**JSON OUTPUT EXAMPLE:**
{
  "newsletter": [
    {
      "categoryTitle": "New LLM Announcements & Releases",
      "items": [
        {
          "title": "Example AI Model X Released by Tech Giant",
          "summary": "Tech Giant has just announced the release of their new flagship model, AI Model X, which promises groundbreaking performance in natural language understanding.",
          "sourceUrl": "https://example.com/news/ai-model-x",
          "sourceType": "Web",
          "imageUrl": "https://example.com/images/ai-model-x-thumbnail.jpg"
        }
      ]
    }
  ]
}

**NEWSLETTER REQUIREMENTS:**
1.  **Recency:** All information must be from the last 7 days.
2.  **Sources:** Use a mix of YouTube, X, LinkedIn, academic journals (like NPJ Digital Medicine), and reputable web news.
3.  **Categories:** Generate content for the following six categories:
    - "New LLM Announcements & Releases"
    - "LLM Productivity Hacks & Tips": Cover various practical tips, tricks, and hacks for using LLMs more effectively in daily tasks.
    - "AI Tool/Tip of the Day": Spotlight a single, practical productivity hack, tip, or a useful AI tool. This should be concise and highly actionable for the reader.
    - "Emerging Deep Agents & AI Tools"
    - "Academic Research & Papers": Include recent papers and insights, but also cover news and updates on popular academic research and writing tools like Consensus, Paperpal, Geni, Research Rabbit, and Semantic Scholar.
    - "Healthcare LLM Advancements"
4.  **Content:**
    - \`title\`: The original title of the source article/post.
    - \`summary\`: A concise 1-2 sentence summary.
    - \`sourceUrl\`: The direct URL to the content.
    - \`sourceType\`: Must be one of: 'YouTube', 'X', 'LinkedIn', 'Journal', 'Web'.
    - \`imageUrl\`: A relevant thumbnail URL. If none is found, this MUST be \`null\`.

Now, generate the JSON for today's "GreyBrain AI Pulse" based on these requirements.
`;

const addIdsToNewsletter = (newsletter: any[]): NewsletterSectionData[] => {
    return newsletter.map(section => ({
        ...section,
        items: section.items.map((item: any) => ({
            ...item,
            // Use the sourceUrl as a unique ID. It's a stable identifier for a piece of content.
            id: item.sourceUrl 
        })),
    }));
};

const extractJsonString = (text: string): string | null => {
    let jsonString = text.trim();
    
    // Extracts content from ```json ... ``` or ``` ... ```
    const markdownMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
      jsonString = markdownMatch[1].trim();
    }

    // Find the first '{' and the last '}' to handle cases where the model
    // adds conversational text before or after the JSON object.
    const startIndex = jsonString.indexOf('{');
    const endIndex = jsonString.lastIndexOf('}');

    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
        return null;
    }
    
    // Extract the JSON string.
    return jsonString.substring(startIndex, endIndex + 1);
}

const tryParseAndHeal = async (jsonStringToParse: string, originalResult: any): Promise<NewsletterData> => {
    try {
        // First attempt to parse
        const parsedData = JSON.parse(jsonStringToParse);
        
        const groundingChunks = originalResult.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        const groundingSources = groundingChunks
            .map(chunk => chunk.web)
            .filter(web => web?.uri && web.title)
            .map(web => ({ uri: web.uri, title: web.title }))
            .filter((source, index, self) => index === self.findIndex(s => s.uri === source.uri));

        return {
            newsletter: addIdsToNewsletter(parsedData.newsletter),
            groundingSources: groundingSources,
        };

    } catch (error) {
        if (error instanceof SyntaxError) {
            console.warn("Initial JSON parsing failed. Attempting to self-heal.", error.message);
            
            // Self-healing attempt
            const repairPrompt = `The following JSON string is invalid. Please fix it and return only the corrected JSON object. Do not add any commentary or markdown formatting. Broken JSON: ${jsonStringToParse}`;
            
            try {
                const repairResult = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: repairPrompt,
                });
                const repairedText = repairResult.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!repairedText) {
                    throw new Error("AI repair attempt returned no text.");
                }
                
                const repairedJsonString = extractJsonString(repairedText);
                if (!repairedJsonString) {
                    throw new Error("Could not extract JSON from repaired text.");
                }

                // Second attempt to parse
                const parsedRepairedData = JSON.parse(repairedJsonString);
                console.log("Successfully self-healed and parsed JSON.");

                // Reuse the original grounding sources
                const groundingChunks = originalResult.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
                const groundingSources = groundingChunks
                    .map(chunk => chunk.web)
                    .filter(web => web?.uri && web.title)
                    .map(web => ({ uri: web.uri, title: web.title }))
                    .filter((source, index, self) => index === self.findIndex(s => s.uri === source.uri));

                return {
                    newsletter: addIdsToNewsletter(parsedRepairedData.newsletter),
                    groundingSources: groundingSources,
                };

            } catch (repairError) {
                console.error("Self-healing failed.", repairError);
                throw new Error("The AI analyst returned a report with a formatting issue. The automatic repair failed. Please try refreshing the page.");
            }
        }
        // Re-throw other non-SyntaxError errors
        throw error;
    }
}

export const fetchNewsletterContent = async (): Promise<NewsletterData> => {
  try {
    // Check cache first
    const cached = cacheService.getNewsletterData();
    if (cached) {
      console.log('📋 Returning cached newsletter data');
      return cached;
    }

    console.log('🤖 Generating fresh newsletter content...');
    
    // Rate limiting check
    await rateLimiter.checkLimit();

    const result = await APIRetryService.execute(
      async () => {
        const model = 'gemini-2.5-flash';
        return await ai.models.generateContent({
          model: model,
          contents: PROMPT,
          config: {
            tools: [{ googleSearch: {} }],
          }
        });
      },
      {
        serviceName: 'Gemini API',
        maxAttempts: 2, // Reduce attempts to save API costs
        timeoutMs: 45000 // 45 second timeout
      }
    );

    // Handle cases where the prompt itself might be blocked
    if (!result.candidates || result.candidates.length === 0) {
      const blockReason = result.promptFeedback?.blockReason;
      const safetyRatings = result.promptFeedback?.safetyRatings;
      console.error("AI response has no candidates. The prompt was likely blocked.", { blockReason, safetyRatings });
      
      let errorMessage = "The AI analyst did not produce a report.";
      if (blockReason) {
        errorMessage = `The request was blocked. Reason: ${blockReason}.`;
        if (safetyRatings && safetyRatings.length > 0) {
          const ratingDetails = safetyRatings.map((r: any) => `${r.category?.replace('HARM_CATEGORY_', '') || 'Unknown'}: ${r.probability}`).join(', ');
          errorMessage += ` Details: ${ratingDetails}`;
        }
      }
      throw new Error(errorMessage);
    }

    const candidate = result.candidates[0];
    const textContent = candidate.content?.parts?.[0]?.text;

    // Handle cases where a candidate exists but has no text (e.g. response blocked)
    if (!textContent) {
        const finishReason = candidate.finishReason;
        const safetyRatings = candidate.safetyRatings;
        console.error("AI response did not contain text.", { finishReason, safetyRatings });

        let errorMessage = "The AI response was empty.";
        if (finishReason && finishReason !== 'STOP') {
            errorMessage = `The AI response was incomplete. Reason: ${finishReason}.`;
             if (safetyRatings && safetyRatings.length > 0) {
                const ratingDetails = safetyRatings.map((r: any) => `${r.category?.replace('HARM_CATEGORY_', '') || 'Unknown'}: ${r.probability}`).join(', ');
                errorMessage += ` Details: ${ratingDetails}`;
            }
        }
        throw new Error(errorMessage);
    }
    
    const jsonString = extractJsonString(textContent);
    if (!jsonString) {
        console.error("Could not find a valid JSON object in the AI response:", textContent);
        throw new Error("Failed to find a valid JSON object in the AI response.");
    }

    // Call the parse-and-heal function
    const newsletterData = await tryParseAndHeal(jsonString, result);
    
    // Cache the successful result
    cacheService.setNewsletterData(newsletterData);
    
    return newsletterData;

  } catch (error) {
    console.error("Error in fetchNewsletterContent:", error);
    if (error instanceof Error) {
        // Pre-format some common errors for user-friendliness
        const message = (error.message.includes('INTERNAL')) 
            ? 'The AI analyst is having trouble reaching its sources. Please try again in a moment.'
            : error.message;
        throw new Error(message);
    }
    throw new Error("An unknown error occurred while generating the report.");
  }
};
