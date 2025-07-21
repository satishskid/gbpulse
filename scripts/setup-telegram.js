#!/usr/bin/env node

/**
 * Telegram Bot Setup Script
 * Helps configure Telegram bot for GreyBrain AI Pulse newsletter
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`
🤖 GreyBrain AI Pulse - Telegram Bot Setup

This script will help you configure your Telegram bot for automatic newsletter posting.

📋 Prerequisites:
1. Create a Telegram bot via @BotFather
2. Get your bot token
3. Add the bot to your channel/group
4. Get the chat ID

Let's get started!
`);

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(`
Usage: node scripts/setup-telegram.js <BOT_TOKEN> <CHAT_ID>

Example: node scripts/setup-telegram.js "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" "-1001234567890"

📝 How to get these values:

1. 🤖 Bot Token:
   • Message @BotFather on Telegram
   • Send /newbot
   • Follow instructions to create your bot
   • Copy the bot token (looks like: 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11)

2. 📱 Chat ID:
   • Add your bot to a channel or group
   • Send a test message in the channel/group
   • Visit: https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   • Look for "chat":{"id":-1001234567890} in the response
   • Copy the chat ID (negative number for groups/channels)

Need help? Check TELEGRAM_SETUP.md for detailed instructions.
`);
  process.exit(1);
}

const [botToken, chatId] = args;

console.log('🚀 Setting up Telegram bot...\n');

// Update .env file
const envPath = path.join(process.cwd(), '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Remove existing Telegram config if present
envContent = envContent.replace(/# Telegram Configuration[\s\S]*?(?=\n[A-Z]|\n$|$)/g, '');

// Add new Telegram config
const telegramConfig = `
# Telegram Configuration
VITE_TELEGRAM_BOT_TOKEN=${botToken}
VITE_TELEGRAM_CHAT_ID=${chatId}
`;

envContent += telegramConfig;

fs.writeFileSync(envPath, envContent);
console.log('✅ Updated .env file with Telegram configuration');

// Test the bot
console.log('\n🧪 Testing Telegram bot...');

async function testTelegramBot() {
  try {
    const testMessage = `🧠 GreyBrain AI Pulse - Bot Test
    
✅ Your Telegram bot is now configured!

This is a test message to confirm your bot can send messages to this chat.

🚀 Your newsletter will now automatically post here when new content is generated.

Time: ${new Date().toLocaleString()}`;

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: testMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const result = await response.json();
    
    if (result.ok) {
      console.log('✅ Test message sent successfully!');
      console.log('📱 Check your Telegram channel/group for the test message.');
    } else {
      console.error('❌ Test failed:', result.description);
      console.log('\n💡 Common issues:');
      console.log('   • Bot not added to the channel/group');
      console.log('   • Incorrect chat ID');
      console.log('   • Bot doesn\'t have permission to send messages');
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

await testTelegramBot();

console.log(`
🎉 Telegram setup complete!

📋 Configuration saved:
   • Bot Token: ${botToken.substring(0, 20)}...
   • Chat ID: ${chatId}

🚀 Next steps:
1. Start your dev server: npm run dev -- --port 3700
2. Your newsletter will now automatically post to Telegram!
3. Test manual posting from the website interface

Happy broadcasting! 📡
`);
