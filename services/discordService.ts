import type { NewsletterData, NewsletterItem } from '../types';

// Discord Webhook configuration
const DISCORD_WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
const DISCORD_SERVER_INVITE = import.meta.env.VITE_DISCORD_SERVER_INVITE || 'https://discord.gg/greybrain-ai-pulse';

interface DiscordEmbed {
  title: string;
  description: string;
  url?: string;
  color: number;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  footer?: {
    text: string;
    icon_url?: string;
  };
  timestamp?: string;
  thumbnail?: {
    url: string;
  };
}

interface DiscordMessage {
  content?: string;
  embeds?: DiscordEmbed[];
  username?: string;
  avatar_url?: string;
}

/**
 * Send message to Discord via webhook
 */
export const sendDiscordMessage = async (message: DiscordMessage): Promise<boolean> => {
  try {
    if (!DISCORD_WEBHOOK_URL) {
      console.warn('Discord webhook URL not configured');
      return false;
    }

    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending Discord message:', error);
    return false;
  }
};

/**
 * Get color for different categories
 */
const getCategoryColor = (categoryTitle: string): number => {
  const title = categoryTitle.toLowerCase();
  
  if (title.includes('announcement') || title.includes('release')) return 0x00ff00; // Green
  if (title.includes('productivity') || title.includes('hack') || title.includes('tip')) return 0xffff00; // Yellow
  if (title.includes('tool') || title.includes('tip of the day')) return 0xff8c00; // Orange
  if (title.includes('agent') || title.includes('emerging')) return 0x9932cc; // Purple
  if (title.includes('research') || title.includes('academic') || title.includes('paper')) return 0x4169e1; // Blue
  if (title.includes('healthcare') || title.includes('medical')) return 0xff1493; // Pink
  
  return 0x06b6d4; // Cyan (default)
};

/**
 * Get emoji for category
 */
const getCategoryEmoji = (categoryTitle: string): string => {
  const title = categoryTitle.toLowerCase();
  
  if (title.includes('announcement') || title.includes('release')) return '🚀';
  if (title.includes('productivity') || title.includes('hack') || title.includes('tip')) return '⚡';
  if (title.includes('tool') || title.includes('tip of the day')) return '🛠️';
  if (title.includes('agent') || title.includes('emerging')) return '🤖';
  if (title.includes('research') || title.includes('academic') || title.includes('paper')) return '📚';
  if (title.includes('healthcare') || title.includes('medical')) return '🏥';
  
  return '📰';
};

/**
 * Format newsletter item for Discord
 */
export const formatNewsletterItemForDiscord = (item: NewsletterItem, category: string): DiscordEmbed => {
  const emoji = getCategoryEmoji(category);
  const color = getCategoryColor(category);

  return {
    title: `${emoji} ${item.title}`,
    description: item.summary,
    url: item.sourceUrl,
    color: color,
    fields: [
      {
        name: '📱 Source',
        value: item.sourceType,
        inline: true,
      },
      {
        name: '🏷️ Category',
        value: category,
        inline: true,
      },
    ],
    footer: {
      text: 'GreyBrain AI Pulse • Click title to read full article',
    },
    timestamp: new Date().toISOString(),
  };
};

/**
 * Map newsletter categories to Discord channel names
 */
const CATEGORY_TO_CHANNEL_MAP: Record<string, string> = {
  'New LLM Announcements & Releases': 'llm-announcements',
  'LLM Productivity Hacks & Tips': 'productivity-hacks',
  'AI Tool/Tip of the Day': 'ai-tool-of-the-day',
  'Emerging Deep Agents & AI Tools': 'deep-agents-tools',
  'Academic Research & Papers': 'academic-research',
  'Healthcare LLM Advancements': 'healthcare-llm'
};

/**
 * Send newsletter content to specific Discord channels based on category
 */
export const sendNewsletterToChannels = async (
  newsletterData: NewsletterData,
  botToken: string,
  guildId: string
): Promise<boolean> => {
  try {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Get all channels in the guild
    const channelsResponse = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!channelsResponse.ok) {
      throw new Error(`Failed to fetch channels: ${channelsResponse.statusText}`);
    }

    const channels = await channelsResponse.json();
    const channelMap = new Map();

    // Create a map of channel names to IDs
    channels.forEach((channel: any) => {
      if (channel.type === 0) { // Text channels only
        channelMap.set(channel.name, channel.id);
      }
    });

    // Send content to each appropriate channel
    for (const section of newsletterData.newsletter) {
      const channelName = CATEGORY_TO_CHANNEL_MAP[section.categoryTitle];
      const channelId = channelMap.get(channelName);

      if (!channelId) {
        console.warn(`Channel not found for category: ${section.categoryTitle} (looking for: ${channelName})`);
        continue;
      }

      // Send section header
      const headerMessage = {
        content: `🧠 **GreyBrain AI Pulse** - ${dateStr}\n📋 **${section.categoryTitle}**\n`,
        username: 'GreyBrain AI Pulse',
        avatar_url: 'https://via.placeholder.com/128x128/06b6d4/ffffff?text=GB',
      };

      await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bot ${botToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(headerMessage)
      });

      // Send each item in the section
      for (const item of section.items) {
        const embed = formatNewsletterItemForDiscord(item, section.categoryTitle);

        const message = {
          embeds: [embed],
          username: 'GreyBrain AI Pulse',
          avatar_url: 'https://via.placeholder.com/128x128/06b6d4/ffffff?text=GB',
        };

        await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bot ${botToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(message)
        });

        // Small delay between messages to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return true;
  } catch (error) {
    console.error('Error sending newsletter to Discord channels:', error);
    return false;
  }
};

/**
 * Send newsletter digest to Discord (legacy webhook method)
 */
export const sendNewsletterDigestToDiscord = async (
  newsletterData: NewsletterData,
  maxItemsPerSection: number = 2
): Promise<boolean> => {
  try {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Send header message
    const headerMessage: DiscordMessage = {
      content: `🧠 **GreyBrain AI Pulse** - ${dateStr}\n*Your daily dose of AI healthcare intelligence*\n\n📊 **Today's Highlights:**`,
      username: 'GreyBrain AI Pulse',
      avatar_url: 'https://via.placeholder.com/128x128/06b6d4/ffffff?text=GB',
    };

    await sendDiscordMessage(headerMessage);

    // Send each section with limited items
    for (const section of newsletterData.newsletter) {
      const itemsToShow = section.items.slice(0, maxItemsPerSection);
      
      for (const item of itemsToShow) {
        const embed = formatNewsletterItemForDiscord(item, section.categoryTitle);
        
        const message: DiscordMessage = {
          embeds: [embed],
          username: 'GreyBrain AI Pulse',
          avatar_url: 'https://via.placeholder.com/128x128/06b6d4/ffffff?text=GB',
        };

        await sendDiscordMessage(message);
        
        // Small delay between messages to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Show remaining count if there are more items
      if (section.items.length > maxItemsPerSection) {
        const remaining = section.items.length - maxItemsPerSection;
        const remainingMessage: DiscordMessage = {
          content: `*... and ${remaining} more article${remaining > 1 ? 's' : ''} in ${section.categoryTitle}*\n\n🌐 [View all updates on GreyBrain AI Pulse](http://localhost:3700/)`,
          username: 'GreyBrain AI Pulse',
        };
        await sendDiscordMessage(remainingMessage);
      }
    }

    // Send footer with links
    const footerMessage: DiscordMessage = {
      embeds: [{
        title: '🔗 Quick Links',
        description: '• [View Full Newsletter](http://localhost:3700/)\n• [Subscribe for Updates](http://localhost:3700/)\n• [Join Our Community](https://discord.gg/greybrain-ai-pulse)',
        color: 0x06b6d4,
        footer: {
          text: `Powered by GreyBrain AI • ${newsletterData.groundingSources?.length || 0} sources analyzed`,
        },
      }],
      username: 'GreyBrain AI Pulse',
    };

    await sendDiscordMessage(footerMessage);

    return true;
  } catch (error) {
    console.error('Error sending newsletter digest to Discord:', error);
    return false;
  }
};

/**
 * Send single article to Discord for discussion
 */
export const sendArticleForDiscussion = async (
  item: NewsletterItem, 
  category: string,
  discussionPrompt?: string
): Promise<boolean> => {
  try {
    const embed = formatNewsletterItemForDiscord(item, category);
    
    // Add discussion prompt
    if (discussionPrompt) {
      embed.fields?.push({
        name: '💭 Discussion',
        value: discussionPrompt,
        inline: false,
      });
    }

    const message: DiscordMessage = {
      content: discussionPrompt ? '💬 **New Discussion Topic**' : '📰 **New Article**',
      embeds: [embed],
      username: 'GreyBrain AI Pulse',
      avatar_url: 'https://via.placeholder.com/128x128/06b6d4/ffffff?text=GB',
    };

    return await sendDiscordMessage(message);
  } catch (error) {
    console.error('Error sending article for discussion:', error);
    return false;
  }
};

/**
 * Send welcome message for new members
 */
export const sendWelcomeMessage = async (): Promise<boolean> => {
  const welcomeMessage: DiscordMessage = {
    embeds: [{
      title: '🏥 Welcome to GreyBrain AI Pulse Community!',
      description: `Welcome to our professional community of healthcare professionals exploring AI in medicine.

**🎯 What we discuss:**
• Latest AI healthcare breakthroughs
• Clinical AI implementation
• Research insights and papers
• Productivity tools for healthcare
• Case studies and best practices

**📋 Community Guidelines:**
• Keep discussions professional and respectful
• Share evidence-based insights
• Maintain patient confidentiality (no PHI)
• Use appropriate channels for different topics

**🔗 Quick Links:**
• [Latest Newsletter](http://localhost:3700/)
• [Subscribe for Updates](http://localhost:3700/)
• [Community Guidelines](http://localhost:3700/guidelines)`,
      color: 0x06b6d4,
      footer: {
        text: 'GreyBrain AI Pulse • Professional AI Healthcare Community',
      },
    }],
    username: 'GreyBrain AI Pulse',
    avatar_url: 'https://via.placeholder.com/128x128/06b6d4/ffffff?text=GB',
  };

  return await sendDiscordMessage(welcomeMessage);
};

/**
 * Get Discord server invite link
 */
export const getDiscordInviteLink = (): string => {
  return DISCORD_SERVER_INVITE;
};

export default {
  sendDiscordMessage,
  formatNewsletterItemForDiscord,
  sendNewsletterDigestToDiscord,
  sendArticleForDiscussion,
  sendWelcomeMessage,
  getDiscordInviteLink,
};
