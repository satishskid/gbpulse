#!/usr/bin/env node

/**
 * Discord Server Setup Automation Script
 * Automatically creates channels, roles, and configures your GreyBrain AI Pulse Discord server
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Discord API configuration
let DISCORD_BOT_TOKEN = '';
let GUILD_ID = '';

const DISCORD_API_BASE = 'https://discord.com/api/v10';

// Server configuration
const SERVER_CONFIG = {
  channels: [
    // Information Category
    { name: 'INFORMATION', type: 4, position: 0 },
    { name: 'welcome', type: 0, parent: 'INFORMATION', topic: 'Welcome to GreyBrain AI Pulse Community!' },
    { name: 'announcements', type: 0, parent: 'INFORMATION', topic: 'Newsletter updates and important news' },
    { name: 'community-guidelines', type: 0, parent: 'INFORMATION', topic: 'Professional conduct rules and guidelines' },

    // GreyBrain AI Pulse Newsletter Topics Category
    { name: 'GREYBRAIN AI PULSE TOPICS', type: 4, position: 1 },
    { name: 'llm-announcements', type: 0, parent: 'GREYBRAIN AI PULSE TOPICS', topic: '🚀 New LLM Announcements & Releases - Latest model releases and updates' },
    { name: 'productivity-hacks', type: 0, parent: 'GREYBRAIN AI PULSE TOPICS', topic: '⚡ LLM Productivity Hacks & Tips - Practical tips for using LLMs effectively' },
    { name: 'ai-tool-of-the-day', type: 0, parent: 'GREYBRAIN AI PULSE TOPICS', topic: '🛠️ AI Tool/Tip of the Day - Daily spotlight on useful AI tools and tips' },
    { name: 'deep-agents-tools', type: 0, parent: 'GREYBRAIN AI PULSE TOPICS', topic: '🤖 Emerging Deep Agents & AI Tools - Advanced AI agents and automation tools' },
    { name: 'academic-research', type: 0, parent: 'GREYBRAIN AI PULSE TOPICS', topic: '📚 Academic Research & Papers - Latest research, papers, and academic tools' },
    { name: 'healthcare-llm', type: 0, parent: 'GREYBRAIN AI PULSE TOPICS', topic: '🏥 Healthcare LLM Advancements - AI developments in medicine and healthcare' },

    // Community Category
    { name: 'COMMUNITY', type: 4, position: 2 },
    { name: 'general-discussion', type: 0, parent: 'COMMUNITY', topic: 'General discussions about AI and healthcare' },
    { name: 'introductions', type: 0, parent: 'COMMUNITY', topic: 'Introduce yourself to the community' },
    { name: 'networking', type: 0, parent: 'COMMUNITY', topic: 'Professional networking and connections' },
    { name: 'feedback', type: 0, parent: 'COMMUNITY', topic: 'Community feedback and suggestions' }
  ],
  
  roles: [
    { name: 'Healthcare Professional', color: 0x00ff00, permissions: '0', mentionable: true },
    { name: 'Researcher', color: 0x0099ff, permissions: '0', mentionable: true },
    { name: 'AI Specialist', color: 0xff6600, permissions: '0', mentionable: true },
    { name: 'Student', color: 0xffff00, permissions: '0', mentionable: true },
    { name: 'Industry', color: 0x9900ff, permissions: '0', mentionable: true },
    { name: 'Moderator', color: 0xff0000, permissions: '8', mentionable: true }
  ]
};

// API helper functions
async function discordAPI(endpoint, method = 'GET', data = null) {
  const url = `${DISCORD_API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Discord API Error: ${response.status} - ${error}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Request failed: ${error.message}`);
    throw error;
  }
}

// Setup functions
async function createChannels() {
  console.log('🏗️  Creating channels...');
  const createdChannels = {};
  
  // Create categories first
  for (const channel of SERVER_CONFIG.channels.filter(c => c.type === 4)) {
    try {
      const created = await discordAPI(`/guilds/${GUILD_ID}/channels`, 'POST', {
        name: channel.name,
        type: channel.type,
        position: channel.position
      });
      createdChannels[channel.name] = created.id;
      console.log(`✅ Created category: ${channel.name}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit
    } catch (error) {
      console.error(`❌ Failed to create category ${channel.name}:`, error.message);
    }
  }
  
  // Create text channels
  for (const channel of SERVER_CONFIG.channels.filter(c => c.type === 0)) {
    try {
      const parentId = createdChannels[channel.parent];
      const created = await discordAPI(`/guilds/${GUILD_ID}/channels`, 'POST', {
        name: channel.name,
        type: channel.type,
        parent_id: parentId,
        topic: channel.topic
      });
      createdChannels[channel.name] = created.id;
      console.log(`✅ Created channel: #${channel.name}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit
    } catch (error) {
      console.error(`❌ Failed to create channel ${channel.name}:`, error.message);
    }
  }
  
  return createdChannels;
}

async function createRoles() {
  console.log('👥 Creating roles...');
  const createdRoles = {};
  
  for (const role of SERVER_CONFIG.roles) {
    try {
      const created = await discordAPI(`/guilds/${GUILD_ID}/roles`, 'POST', {
        name: role.name,
        color: role.color,
        permissions: role.permissions,
        mentionable: role.mentionable
      });
      createdRoles[role.name] = created.id;
      console.log(`✅ Created role: @${role.name}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit
    } catch (error) {
      console.error(`❌ Failed to create role ${role.name}:`, error.message);
    }
  }
  
  return createdRoles;
}

async function createWelcomeMessage(channelId) {
  const welcomeMessage = `🧠 **Welcome to GreyBrain AI Pulse Community!**

Hello! Welcome to our professional community of healthcare professionals exploring AI in medicine.

**🎯 Get Started:**
1. Read our community guidelines in <#community-guidelines>
2. Introduce yourself in <#introductions>
3. Get verified for full access (DM a @Moderator)
4. Join discussions in relevant channels

**📰 Stay Updated:**
• Newsletter updates in <#announcements>
• Latest articles automatically posted
• Weekly digest discussions

**🔗 Quick Links:**
• [Latest Newsletter](http://localhost:3700/)
• [Subscribe for Updates](http://localhost:3700/)

**💬 Popular Channels:**
• <#general-discussion> - General AI healthcare chat
• <#clinical-implementation> - Real-world experiences
• <#research-papers> - Academic discussions

We're excited to have you in our community! 🎉`;

  try {
    await discordAPI(`/channels/${channelId}/messages`, 'POST', {
      content: welcomeMessage
    });
    console.log('✅ Posted welcome message');
  } catch (error) {
    console.error('❌ Failed to post welcome message:', error.message);
  }
}

async function createGuidelines(channelId) {
  const guidelines = `🏥 **GreyBrain AI Pulse Community Guidelines**

Welcome to our professional community of healthcare professionals exploring AI in medicine.

**🎯 Our Purpose:**
• Discuss latest AI healthcare developments
• Share clinical implementation experiences
• Collaborate on research and best practices
• Network with like-minded professionals

**📋 Community Rules:**

**1. Professional Conduct**
• Maintain respectful, professional communication
• Use appropriate medical terminology
• Respect diverse opinions and experiences

**2. Privacy & Confidentiality**
• NO patient health information (PHI)
• Anonymize all case discussions
• Follow HIPAA and local privacy laws

**3. Content Guidelines**
• Stay on-topic (AI in healthcare)
• Share evidence-based information
• Cite sources for research claims
• No promotional content without permission

**4. Channel Usage**
• Use appropriate channels for discussions
• Search before asking duplicate questions
• Use threads for detailed discussions

**5. Verification**
• Healthcare professionals: DM moderators for verification
• Include credentials and LinkedIn profile
• Verified members get special roles and access

**🚫 Prohibited:**
• Patient information sharing
• Medical advice for specific cases
• Spam or promotional content
• Harassment or discrimination
• Off-topic discussions

**📞 Contact Moderators:**
For questions, verification, or issues, DM @Moderator

*By participating, you agree to these guidelines and applicable laws.*`;

  try {
    await discordAPI(`/channels/${channelId}/messages`, 'POST', {
      content: guidelines
    });
    console.log('✅ Posted community guidelines');
  } catch (error) {
    console.error('❌ Failed to post guidelines:', error.message);
  }
}

async function setupWebhook(channelId) {
  try {
    const webhook = await discordAPI(`/channels/${channelId}/webhooks`, 'POST', {
      name: 'GreyBrain AI Pulse Bot',
      avatar: null // You can add a base64 encoded image here
    });
    
    console.log('✅ Created webhook for newsletter integration');
    console.log(`📝 Add this to your .env file:`);
    console.log(`VITE_DISCORD_WEBHOOK_URL=${webhook.url}`);
    
    return webhook.url;
  } catch (error) {
    console.error('❌ Failed to create webhook:', error.message);
    return null;
  }
}

// Main setup function
async function setupDiscordServer() {
  console.log('🚀 Starting Discord server setup...\n');

  // Use environment variables if available (for automated setup)
  if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_GUILD_ID) {
    DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    GUILD_ID = process.env.DISCORD_GUILD_ID;
    console.log('✅ Using environment variables for bot token and guild ID');
  }

  if (!DISCORD_BOT_TOKEN || !GUILD_ID) {
    console.error('❌ Bot token and guild ID are required!');
    console.log('Set DISCORD_BOT_TOKEN and DISCORD_GUILD_ID environment variables or run interactively.');
    return;
  }

  try {
    // Create channels
    const channels = await createChannels();
    
    // Create roles
    const roles = await createRoles();
    
    // Post welcome message
    if (channels['welcome']) {
      await createWelcomeMessage(channels['welcome']);
    }
    
    // Post guidelines
    if (channels['community-guidelines']) {
      await createGuidelines(channels['community-guidelines']);
    }
    
    // Setup webhook
    let webhookUrl = null;
    if (channels['announcements']) {
      webhookUrl = await setupWebhook(channels['announcements']);
    }
    
    console.log('\n🎉 Discord server setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your .env file with the webhook URL above');
    console.log('2. Create an invite link for your community');
    console.log('3. Test the newsletter integration');
    console.log('4. Invite your first members');
    
    // Save configuration
    const config = {
      guildId: GUILD_ID,
      channels,
      roles,
      webhookUrl,
      setupDate: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(__dirname, '../discord-config.json'),
      JSON.stringify(config, null, 2)
    );
    
    console.log('\n💾 Configuration saved to discord-config.json');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

// Interactive setup
async function promptUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('🤖 GreyBrain AI Pulse Discord Setup Tool\n');
  
  console.log('📋 Prerequisites:');
  console.log('1. Create a Discord application at https://discord.com/developers/applications');
  console.log('2. Create a bot and get the bot token');
  console.log('3. Invite the bot to your server with Administrator permissions');
  console.log('4. Get your server (guild) ID\n');
  
  DISCORD_BOT_TOKEN = await promptUser('🔑 Enter your Discord bot token: ');
  GUILD_ID = await promptUser('🏠 Enter your Discord server (guild) ID: ');
  
  if (!DISCORD_BOT_TOKEN || !GUILD_ID) {
    console.log('❌ Bot token and guild ID are required!');
    process.exit(1);
  }
  
  const confirm = await promptUser('\n🚀 Ready to set up your Discord server? (y/N): ');
  
  if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
    await setupDiscordServer();
  } else {
    console.log('Setup cancelled.');
  }
  
  rl.close();
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { setupDiscordServer, SERVER_CONFIG };
