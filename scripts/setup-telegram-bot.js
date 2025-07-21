#!/usr/bin/env node

/**
 * GreyBrain AI Pulse - Telegram Bot Setup Script
 * Sets up bot commands, description, and tests the connection
 */

const BOT_TOKEN = '8010638207:AAFfbXNgD9Y8AFJ1FTcv_IhJeLZ0EvZk9EA';
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

/**
 * Make API request to Telegram
 */
async function telegramRequest(method, data = {}) {
  try {
    const response = await fetch(`${API_URL}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    log(`❌ Error making request to ${method}: ${error.message}`, 'red');
    return { ok: false, error: error.message };
  }
}

/**
 * Test bot connection
 */
async function testBotConnection() {
  log('\n🔍 Testing bot connection...', 'blue');
  
  const result = await telegramRequest('getMe');
  
  if (result.ok) {
    const bot = result.result;
    log(`✅ Bot connected successfully!`, 'green');
    log(`   Username: @${bot.username}`, 'green');
    log(`   Name: ${bot.first_name}`, 'green');
    log(`   ID: ${bot.id}`, 'green');
    log(`   Can join groups: ${bot.can_join_groups}`, 'green');
    log(`   Can read messages: ${bot.can_read_all_group_messages}`, 'green');
    return true;
  } else {
    log(`❌ Failed to connect to bot: ${result.description}`, 'red');
    return false;
  }
}

/**
 * Set up bot commands
 */
async function setupBotCommands() {
  log('\n⚙️ Setting up bot commands...', 'blue');
  
  const commands = [
    { command: 'start', description: 'Welcome message and subscription info' },
    { command: 'latest', description: 'Get the latest newsletter' },
    { command: 'subscribe', description: 'Subscribe to newsletter updates' },
    { command: 'categories', description: 'View available newsletter categories' },
    { command: 'help', description: 'Show available commands' }
  ];

  const result = await telegramRequest('setMyCommands', { commands });
  
  if (result.ok) {
    log(`✅ Bot commands set successfully!`, 'green');
    commands.forEach(cmd => {
      log(`   /${cmd.command} - ${cmd.description}`, 'green');
    });
    return true;
  } else {
    log(`❌ Failed to set commands: ${result.description}`, 'red');
    return false;
  }
}

/**
 * Set bot description
 */
async function setBotDescription() {
  log('\n📝 Setting bot description...', 'blue');
  
  const description = `🧠 GreyBrain AI Pulse - Your source for LLM health insights and AI healthcare updates.

Get the latest newsletters on:
🏥 Healthcare AI developments
🤖 LLM safety and reliability
📊 Industry analysis and trends

Visit: https://llm-healthcare-insights.web.app`;

  const result = await telegramRequest('setMyDescription', { description });
  
  if (result.ok) {
    log(`✅ Bot description set successfully!`, 'green');
    return true;
  } else {
    log(`❌ Failed to set description: ${result.description}`, 'red');
    return false;
  }
}

/**
 * Set bot short description
 */
async function setBotShortDescription() {
  log('\n📄 Setting bot short description...', 'blue');
  
  const shortDescription = "🧠 GreyBrain AI Pulse - LLM health insights and AI healthcare updates";
  
  const result = await telegramRequest('setMyShortDescription', { 
    short_description: shortDescription 
  });
  
  if (result.ok) {
    log(`✅ Bot short description set successfully!`, 'green');
    return true;
  } else {
    log(`❌ Failed to set short description: ${result.description}`, 'red');
    return false;
  }
}

/**
 * Test sending a message (to yourself)
 */
async function testMessage() {
  log('\n💬 Testing message sending...', 'blue');
  log('   Note: This will only work if you have started a chat with the bot', 'yellow');
  
  // This is just a demonstration - in practice, you'd need a chat ID
  log('   To test messaging:', 'blue');
  log('   1. Go to https://t.me/GreyBrainPulseBot', 'blue');
  log('   2. Send /start to the bot', 'blue');
  log('   3. The bot will respond with a welcome message', 'blue');
}

/**
 * Display bot information
 */
function displayBotInfo() {
  log('\n🤖 GreyBrain AI Pulse Bot Information:', 'bold');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log(`   Bot Username: @GreyBrainPulseBot`, 'green');
  log(`   Bot URL: https://t.me/GreyBrainPulseBot`, 'green');
  log(`   Website: https://llm-healthcare-insights.web.app`, 'green');
  log(`   Purpose: LLM health insights and AI healthcare updates`, 'green');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
}

/**
 * Main setup function
 */
async function main() {
  log('🚀 GreyBrain AI Pulse - Telegram Bot Setup', 'bold');
  log('═══════════════════════════════════════════════', 'blue');
  
  displayBotInfo();
  
  // Test connection first
  const connected = await testBotConnection();
  if (!connected) {
    log('\n❌ Cannot proceed without bot connection. Please check your token.', 'red');
    process.exit(1);
  }
  
  // Set up bot features
  const commandsSet = await setupBotCommands();
  const descriptionSet = await setBotDescription();
  const shortDescSet = await setBotShortDescription();
  
  // Test messaging
  await testMessage();
  
  // Summary
  log('\n📊 Setup Summary:', 'bold');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log(`   Bot Connection: ${connected ? '✅ Success' : '❌ Failed'}`, connected ? 'green' : 'red');
  log(`   Commands Setup: ${commandsSet ? '✅ Success' : '❌ Failed'}`, commandsSet ? 'green' : 'red');
  log(`   Description: ${descriptionSet ? '✅ Success' : '❌ Failed'}`, descriptionSet ? 'green' : 'red');
  log(`   Short Description: ${shortDescSet ? '✅ Success' : '❌ Failed'}`, shortDescSet ? 'green' : 'red');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  
  if (connected && commandsSet && descriptionSet && shortDescSet) {
    log('\n🎉 Bot setup completed successfully!', 'green');
    log('\n📱 Next steps:', 'bold');
    log('   1. Go to https://t.me/GreyBrainPulseBot', 'blue');
    log('   2. Send /start to test the bot', 'blue');
    log('   3. Try other commands like /latest, /subscribe, /help', 'blue');
    log('   4. Set up automatic newsletter posting', 'blue');
    log('   5. Configure channels for different categories', 'blue');
    log('\n🔗 Useful links:', 'bold');
    log('   • Bot: https://t.me/GreyBrainPulseBot', 'green');
    log('   • Website: https://llm-healthcare-insights.web.app', 'green');
    log('   • Telegram Bot API: https://core.telegram.org/bots/api', 'green');
  } else {
    log('\n⚠️ Setup completed with some errors. Please check the logs above.', 'yellow');
  }
}

// Run the setup
main().catch(error => {
  log(`\n💥 Setup failed with error: ${error.message}`, 'red');
  process.exit(1);
});
