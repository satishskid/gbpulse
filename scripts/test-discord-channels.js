#!/usr/bin/env node

/**
 * Test Discord Channel Integration
 * Tests sending newsletter content to specific Discord channels
 */

// Category to channel mapping
const CATEGORY_TO_CHANNEL_MAP = {
  'New LLM Announcements & Releases': 'llm-announcements',
  'LLM Productivity Hacks & Tips': 'productivity-hacks',
  'AI Tool/Tip of the Day': 'ai-tool-of-the-day',
  'Emerging Deep Agents & AI Tools': 'deep-agents-tools',
  'Academic Research & Papers': 'academic-research',
  'Healthcare LLM Advancements': 'healthcare-llm'
};

// Simple Discord API helper
async function sendToDiscordChannel(channelId, message, botToken) {
  const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bot ${botToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  });

  if (!response.ok) {
    throw new Error(`Discord API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Mock newsletter data for testing
const mockNewsletterData = {
  newsletter: [
    {
      categoryTitle: "New LLM Announcements & Releases",
      items: [
        {
          id: "test-1",
          title: "GPT-5 Released with Healthcare Focus",
          summary: "OpenAI announces GPT-5 with specialized medical training data and HIPAA compliance features.",
          sourceUrl: "https://example.com/gpt5-healthcare",
          sourceType: "Web",
          imageUrl: null
        }
      ]
    },
    {
      categoryTitle: "Healthcare LLM Advancements", 
      items: [
        {
          id: "test-2",
          title: "AI Diagnoses Rare Diseases with 95% Accuracy",
          summary: "New study shows LLM-powered diagnostic tool outperforms human specialists in rare disease identification.",
          sourceUrl: "https://example.com/ai-rare-diseases",
          sourceType: "Journal",
          imageUrl: null
        }
      ]
    },
    {
      categoryTitle: "AI Tool/Tip of the Day",
      items: [
        {
          id: "test-3", 
          title: "Claude Projects for Medical Research",
          summary: "How to use Claude Projects to organize and analyze medical literature efficiently.",
          sourceUrl: "https://example.com/claude-medical-research",
          sourceType: "Web",
          imageUrl: null
        }
      ]
    }
  ],
  groundingSources: []
};

async function testChannelIntegration() {
  const botToken = process.env.VITE_DISCORD_BOT_TOKEN || "YOUR_BOT_TOKEN_HERE";
  const guildId = process.env.VITE_DISCORD_GUILD_ID || "YOUR_GUILD_ID_HERE";

  console.log('🧪 Testing Discord channel integration...');
  console.log(`📡 Bot Token: ${botToken.substring(0, 20)}...`);
  console.log(`🏠 Guild ID: ${guildId}`);

  try {
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
    channels.forEach((channel) => {
      if (channel.type === 0) { // Text channels only
        channelMap.set(channel.name, channel.id);
        console.log(`📋 Found channel: #${channel.name} (${channel.id})`);
      }
    });

    // Test sending to each newsletter category channel
    for (const section of mockNewsletterData.newsletter) {
      const channelName = CATEGORY_TO_CHANNEL_MAP[section.categoryTitle];
      const channelId = channelMap.get(channelName);

      if (!channelId) {
        console.warn(`⚠️  Channel not found for category: ${section.categoryTitle} (looking for: ${channelName})`);
        continue;
      }

      console.log(`📤 Sending to #${channelName}...`);

      // Send test message
      const message = {
        content: `🧪 **Test Message** - ${new Date().toLocaleString()}\n📋 **${section.categoryTitle}**\n\n${section.items[0].title}\n${section.items[0].summary}`,
        username: 'GreyBrain AI Pulse',
        avatar_url: 'https://via.placeholder.com/128x128/06b6d4/ffffff?text=GB',
      };

      await sendToDiscordChannel(channelId, message, botToken);
      console.log(`✅ Sent test message to #${channelName}`);

      // Small delay between messages
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n🎉 Test completed! Check your Discord channels for the test messages.');
    console.log('\n📋 Messages should appear in:');
    console.log('   • #llm-announcements');
    console.log('   • #healthcare-llm');
    console.log('   • #ai-tool-of-the-day');

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Run the test
testChannelIntegration();
