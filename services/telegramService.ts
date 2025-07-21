import type { NewsletterData, NewsletterItem } from '../types';

// Telegram Bot configuration
const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '8010638207:AAFfbXNgD9Y8AFJ1FTcv_IhJeLZ0EvZk9EA';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Bot Information
export const BOT_INFO = {
  username: 'GreyBrainPulseBot',
  url: 'https://t.me/GreyBrainPulseBot',
  token: TELEGRAM_BOT_TOKEN
};

interface TelegramMessage {
  chat_id: string | number;
  text: string;
  parse_mode?: 'HTML' | 'Markdown';
  disable_web_page_preview?: boolean;
}

/**
 * Send a message to a Telegram chat
 */
export const sendTelegramMessage = async (chatId: string | number, message: string, parseMode: 'HTML' | 'Markdown' = 'HTML'): Promise<boolean> => {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      console.warn('Telegram bot token not configured');
      return false;
    }

    const payload: TelegramMessage = {
      chat_id: chatId,
      text: message,
      parse_mode: parseMode,
      disable_web_page_preview: true,
    };

    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return result.ok;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
};

/**
 * Format newsletter data for Telegram
 */
export const formatNewsletterForTelegram = (newsletterData: NewsletterData, maxItemsPerSection: number = 3): string => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  let message = `🧠 <b>GreyBrain AI Pulse</b> - ${dateStr}\n\n`;
  message += `<i>Your daily dose of AI healthcare intelligence</i>\n\n`;

  newsletterData.newsletter.forEach((section, sectionIndex) => {
    if (sectionIndex > 0) message += '\n';
    
    // Section header with emoji
    const sectionEmoji = getSectionEmoji(section.categoryTitle);
    message += `${sectionEmoji} <b>${section.categoryTitle}</b>\n`;
    message += '━━━━━━━━━━━━━━━━━━━━\n\n';

    // Limit items per section for Telegram
    const itemsToShow = section.items.slice(0, maxItemsPerSection);
    
    itemsToShow.forEach((item, itemIndex) => {
      message += `${itemIndex + 1}. <b>${item.title}</b>\n`;
      message += `${item.summary}\n`;
      message += `📱 <i>${item.sourceType}</i> | <a href="${item.sourceUrl}">Read More</a>\n\n`;
    });

    // Show count if there are more items
    if (section.items.length > maxItemsPerSection) {
      const remaining = section.items.length - maxItemsPerSection;
      message += `<i>... and ${remaining} more article${remaining > 1 ? 's' : ''}</i>\n\n`;
    }
  });

  message += '🌐 <a href="https://llm-healthcare-insights.web.app/">View Full Newsletter</a>\n';
  message += '📧 <a href="https://llm-healthcare-insights.web.app/">Subscribe for Updates</a>\n\n';
  message += '<i>Powered by GreyBrain AI</i>';

  return message;
};

/**
 * Get emoji for section category
 */
const getSectionEmoji = (categoryTitle: string): string => {
  const title = categoryTitle.toLowerCase();
  
  if (title.includes('announcement') || title.includes('release')) return '🚀';
  if (title.includes('productivity') || title.includes('hack') || title.includes('tip')) return '⚡';
  if (title.includes('tool') || title.includes('tip of the day')) return '🛠️';
  if (title.includes('agent') || title.includes('emerging')) return '🤖';
  if (title.includes('research') || title.includes('academic') || title.includes('paper')) return '📚';
  if (title.includes('healthcare') || title.includes('medical')) return '🏥';
  
  return '📰'; // Default emoji
};

/**
 * Format a single newsletter item for Telegram
 */
export const formatNewsletterItemForTelegram = (item: NewsletterItem, category: string): string => {
  const emoji = getSectionEmoji(category);
  
  let message = `${emoji} <b>New in ${category}</b>\n\n`;
  message += `<b>${item.title}</b>\n\n`;
  message += `${item.summary}\n\n`;
  message += `📱 <i>Source: ${item.sourceType}</i>\n`;
  message += `🔗 <a href="${item.sourceUrl}">Read Full Article</a>\n\n`;
  message += '🌐 <a href="https://llm-healthcare-insights.web.app/">View All Updates</a>';
  
  return message;
};

/**
 * Send newsletter digest to Telegram channel/chat
 */
export const sendNewsletterToTelegram = async (
  chatId: string | number, 
  newsletterData: NewsletterData,
  maxItemsPerSection: number = 3
): Promise<boolean> => {
  try {
    const message = formatNewsletterForTelegram(newsletterData, maxItemsPerSection);
    
    // Telegram has a 4096 character limit, so we might need to split
    if (message.length > 4000) {
      // Send in parts
      const parts = splitTelegramMessage(message);
      for (const part of parts) {
        const success = await sendTelegramMessage(chatId, part);
        if (!success) return false;
        // Small delay between messages
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      return true;
    } else {
      return await sendTelegramMessage(chatId, message);
    }
  } catch (error) {
    console.error('Error sending newsletter to Telegram:', error);
    return false;
  }
};

/**
 * Split long messages for Telegram
 */
const splitTelegramMessage = (message: string, maxLength: number = 4000): string[] => {
  if (message.length <= maxLength) return [message];
  
  const parts: string[] = [];
  const sections = message.split('\n\n');
  let currentPart = '';
  
  for (const section of sections) {
    if ((currentPart + section).length > maxLength) {
      if (currentPart) {
        parts.push(currentPart.trim());
        currentPart = section + '\n\n';
      } else {
        // Section itself is too long, force split
        parts.push(section.substring(0, maxLength));
        currentPart = section.substring(maxLength) + '\n\n';
      }
    } else {
      currentPart += section + '\n\n';
    }
  }
  
  if (currentPart.trim()) {
    parts.push(currentPart.trim());
  }
  
  return parts;
};

/**
 * Get bot info (for testing connection)
 */
export const getBotInfo = async (): Promise<any> => {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      throw new Error('Telegram bot token not configured');
    }

    const response = await fetch(`${TELEGRAM_API_URL}/getMe`);
    const result = await response.json();

    if (result.ok) {
      return result.result;
    } else {
      throw new Error(result.description || 'Failed to get bot info');
    }
  } catch (error) {
    console.error('Error getting bot info:', error);
    throw error;
  }
};

/**
 * Set up bot commands and description
 */
export const setupBot = async (): Promise<boolean> => {
  try {
    // Set bot commands
    const commands = [
      { command: 'start', description: 'Welcome message and subscription info' },
      { command: 'latest', description: 'Get the latest newsletter' },
      { command: 'subscribe', description: 'Subscribe to newsletter updates' },
      { command: 'categories', description: 'View available newsletter categories' },
      { command: 'help', description: 'Show available commands' }
    ];

    const commandsResponse = await fetch(`${TELEGRAM_API_URL}/setMyCommands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commands })
    });

    // Set bot description
    const description = `🧠 GreyBrain AI Pulse - Your source for LLM health insights and AI healthcare updates.

Get the latest newsletters on:
🏥 Healthcare AI developments
🤖 LLM safety and reliability
📊 Industry analysis and trends

Visit: https://llm-healthcare-insights.web.app`;

    const descResponse = await fetch(`${TELEGRAM_API_URL}/setMyDescription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description })
    });

    // Set short description
    const shortDescription = "🧠 GreyBrain AI Pulse - LLM health insights and AI healthcare updates";

    const shortDescResponse = await fetch(`${TELEGRAM_API_URL}/setMyShortDescription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ short_description: shortDescription })
    });

    const commandsResult = await commandsResponse.json();
    const descResult = await descResponse.json();
    const shortDescResult = await shortDescResponse.json();

    console.log('Bot setup results:', {
      commands: commandsResult.ok,
      description: descResult.ok,
      shortDescription: shortDescResult.ok
    });

    return commandsResult.ok && descResult.ok && shortDescResult.ok;
  } catch (error) {
    console.error('Error setting up bot:', error);
    return false;
  }
};

/**
 * Handle bot commands and messages
 */
export const handleBotMessage = async (chatId: string | number, text: string): Promise<boolean> => {
  try {
    let responseMessage = '';

    switch (text.toLowerCase()) {
      case '/start':
        responseMessage = `🧠 <b>Welcome to GreyBrain AI Pulse!</b>

Your trusted source for LLM health insights and AI healthcare updates.

🔔 <b>What you'll get:</b>
• Latest AI healthcare developments
• LLM safety and reliability insights
• Industry analysis and trends
• Expert commentary and research

🌐 <b>Visit our website:</b> https://llm-healthcare-insights.web.app
📧 <b>Subscribe:</b> /subscribe
📱 <b>Categories:</b> /categories

Ready to stay informed about the future of AI in healthcare? 🚀`;
        break;

      case '/latest':
        responseMessage = `📰 <b>Latest Newsletter</b>

Visit our website to read the most recent GreyBrain AI Pulse newsletter:

🌐 https://llm-healthcare-insights.web.app

You can also subscribe to receive updates directly in your email!`;
        break;

      case '/subscribe':
        responseMessage = `📧 <b>Subscribe to GreyBrain AI Pulse</b>

Get our newsletters delivered directly to your inbox!

🌐 <b>Subscribe at:</b> https://llm-healthcare-insights.web.app

<b>What you'll receive:</b>
• Weekly AI healthcare insights
• LLM safety updates
• Industry trend analysis
• Expert research summaries

📱 <b>Stay connected:</b>
• Follow this bot for instant updates
• Join our community discussions
• Get notified of new releases`;
        break;

      case '/categories':
        responseMessage = `📂 <b>Newsletter Categories</b>

🏥 <b>Healthcare AI</b>
Latest developments in AI applications for healthcare

🤖 <b>LLM Safety</b>
Research and insights on large language model reliability

📊 <b>Industry Analysis</b>
Market trends, company updates, and strategic insights

🔬 <b>Research Highlights</b>
Key findings from academic and industry research

Visit https://llm-healthcare-insights.web.app to explore all categories!`;
        break;

      case '/help':
        responseMessage = `❓ <b>GreyBrain AI Pulse Bot Help</b>

<b>Available Commands:</b>
/start - Welcome message and overview
/latest - Get the latest newsletter
/subscribe - Subscription information
/categories - View newsletter categories
/help - Show this help message

<b>About GreyBrain AI Pulse:</b>
We provide curated insights on AI in healthcare, focusing on LLM safety, reliability, and industry developments.

🌐 Website: https://llm-healthcare-insights.web.app
📧 Subscribe for email updates
💬 Follow this bot for instant notifications

Questions? Visit our website for more information!`;
        break;

      default:
        responseMessage = `🤖 I'm here to help with GreyBrain AI Pulse updates!

Try these commands:
/latest - Get the latest newsletter
/subscribe - Subscribe to updates
/help - See all available commands

Or visit our website: https://llm-healthcare-insights.web.app`;
    }

    return await sendTelegramMessage(chatId, responseMessage);
  } catch (error) {
    console.error('Error handling bot message:', error);
    return false;
  }
};

export default {
  sendTelegramMessage,
  formatNewsletterForTelegram,
  formatNewsletterItemForTelegram,
  sendNewsletterToTelegram,
  getBotInfo,
  setupBot,
  handleBotMessage,
  BOT_INFO,
};
