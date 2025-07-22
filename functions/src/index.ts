/**
 * GreyBrain AI Pulse - Firebase Functions
 * Newsletter Generation
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import {onSchedule} from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import {GoogleGenerativeAI} from "@google/generative-ai";

// Global options for cost control
setGlobalOptions({maxInstances: 10});

// Initialize Gemini AI
const geminiApiKey = functions.config().gemini?.api_key ||
  process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(geminiApiKey);

// Types
interface NewsletterData {
  newsletter: NewsletterSection[];
  sources: string[];
  timestamp: string;
}

interface NewsletterSection {
  categoryTitle: string;
  items: NewsletterItem[];
}

interface NewsletterItem {
  title: string;
  summary: string;
  sourceUrl: string;
  sourceType: string;
}

/**
 * Generate newsletter content using Gemini AI
 * @return {Promise<NewsletterData>} Generated newsletter data
 */
async function fetchNewsletterContent(): Promise<NewsletterData> {
  try {
    const model = genAI.getGenerativeModel({model: "gemini-pro"});

    const prompt = `Generate a comprehensive newsletter about LLM health
insights and AI healthcare updates.

Please provide a JSON response with the following structure:
{
  "newsletter": [
    {
      "categoryTitle": "Healthcare AI Developments",
      "items": [
        {
          "title": "Article title",
          "summary": "Brief summary of the article",
          "sourceUrl": "https://example.com/article",
          "sourceType": "Academic Paper"
        }
      ]
    },
    {
      "categoryTitle": "LLM Safety Research",
      "items": [...]
    },
    {
      "categoryTitle": "Industry Analysis",
      "items": [...]
    },
    {
      "categoryTitle": "Research Highlights",
      "items": [...]
    }
  ],
  "sources": ["url1", "url2", "url3"],
  "timestamp": "${new Date().toISOString()}"
}

Focus on:
- AI safety in healthcare applications
- Large Language Model reliability and safety
- Healthcare AI developments and breakthroughs
- Industry trends and analysis
- Research findings from academic institutions

Ensure all URLs are realistic examples.
Provide 2-3 items per category.
Make summaries informative and engaging.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON response
    const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, "")
      .trim();
    const newsletterData = JSON.parse(cleanedResponse);

    logger.info("Newsletter content generated successfully");
    return newsletterData;
  } catch (error) {
    logger.error("Error generating newsletter content:", error);

    // Return fallback content
    return {
      newsletter: [
        {
          categoryTitle: "Healthcare AI Developments",
          items: [
            {
              title: "AI-Powered Diagnostic Tools Show Promise in " +
                "Clinical Trials",
              summary: "Recent studies demonstrate significant improvements " +
                "in diagnostic accuracy using AI-powered medical imaging " +
                "tools.",
              sourceUrl: "https://llm-healthcare-insights.web.app",
              sourceType: "Academic Paper",
            },
          ],
        },
        {
          categoryTitle: "LLM Safety Research",
          items: [
            {
              title: "New Framework for Evaluating LLM Safety in Healthcare",
              summary: "Researchers propose comprehensive safety evaluation " +
                "metrics for large language models in medical applications.",
              sourceUrl: "https://llm-healthcare-insights.web.app",
              sourceType: "Research Paper",
            },
          ],
        },
      ],
      sources: ["https://llm-healthcare-insights.web.app"],
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Test function for manual newsletter generation
 */
export const generateNewsletter = onRequest(async (req, res) => {
  try {
    logger.info("Manual newsletter generation requested");
    const newsletterData = await fetchNewsletterContent();

    res.status(200).json({
      success: true,
      newsletter: newsletterData,
    });
  } catch (error) {
    logger.error("Error generating newsletter:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate newsletter",
    });
  }
});

/**
 * Health check function
 */
export const healthCheck = onRequest((req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "GreyBrain AI Pulse Functions",
  });
});
