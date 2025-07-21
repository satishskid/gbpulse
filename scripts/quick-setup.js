#!/usr/bin/env node

/**
 * Quick Discord Setup - One-click Discord server configuration
 * Just provide bot token and guild ID, everything else is automated
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple CLI interface
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(`
🤖 GreyBrain AI Pulse - Quick Discord Setup

Usage: node scripts/quick-setup.js <BOT_TOKEN> <GUILD_ID>

Example:
  node scripts/quick-setup.js "YOUR_BOT_TOKEN_HERE" "123456789012345678"

Prerequisites:
1. Create Discord application: https://discord.com/developers/applications
2. Create bot and get token
3. Invite bot to your server with Administrator permissions
4. Get your server ID (right-click server name → Copy ID)

Need help? Check DISCORD_SETUP.md for detailed instructions.
`);
  process.exit(1);
}

const [botToken, guildId] = args;

async function main() {
console.log('🚀 Starting quick Discord setup...\n');

// Update .env file
const envPath = path.join(process.cwd(), '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Add or update Discord configuration
const discordConfig = `
# Discord Configuration
VITE_DISCORD_BOT_TOKEN=${botToken}
VITE_DISCORD_GUILD_ID=${guildId}
VITE_DISCORD_WEBHOOK_URL=your_discord_webhook_url_here
VITE_DISCORD_SERVER_INVITE=https://discord.gg/greybrain-ai-pulse
`;

// Remove existing Discord config if present
envContent = envContent.replace(/# Discord Configuration[\s\S]*?(?=\n[A-Z]|\n$|$)/g, '');

// Add new Discord config
envContent += discordConfig;

fs.writeFileSync(envPath, envContent);
console.log('✅ Updated .env file with Discord configuration');

// Install Discord.js if not present
try {
  await import('discord.js');
  console.log('✅ Discord.js already installed');
} catch (error) {
  console.log('📦 Installing Discord.js...');
  execSync('npm install discord.js --legacy-peer-deps', { stdio: 'inherit' });
  console.log('✅ Discord.js installed');
}

// Run the main setup script
console.log('\n🏗️  Setting up Discord server...');
process.env.DISCORD_BOT_TOKEN = botToken;
process.env.DISCORD_GUILD_ID = guildId;

try {
  const { setupDiscordServer } = await import('./discord-setup.js');

  // Set the environment variables that the discord-setup script expects
  process.env.DISCORD_BOT_TOKEN = botToken;
  process.env.DISCORD_GUILD_ID = guildId;

  // Call the setup function directly
  await setupDiscordServer();
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  console.log('\n💡 Try the manual setup instead:');
  console.log('   bash scripts/setup-discord.sh');
  process.exit(1);
}

console.log(`
🎉 Quick setup complete!

Your Discord server is now configured with:
• Professional healthcare channels
• Role-based access control  
• Community guidelines
• Newsletter integration webhook

Next steps:
1. Create a custom invite link in Discord
2. Update VITE_DISCORD_SERVER_INVITE in .env
3. Start your dev server: npm run dev -- --port 3700
4. Test the integration!

Happy community building! 🤖
`);
}

// Run the main function
main().catch(console.error);
