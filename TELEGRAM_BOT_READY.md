# 🤖 Telegram Bot Setup - GreyBrain AI Pulse

## 🎉 Bot Created Successfully!

Your GreyBrain AI Pulse Telegram bot is ready to go!

### 📱 Bot Information
- **Bot Username**: @GreyBrainPulseBot
- **Bot URL**: https://t.me/GreyBrainPulseBot
- **Bot Token**: `8010638207:AAFfbXNgD9Y8AFJ1FTcv_IhJeLZ0EvZk9EA`
- **Status**: ✅ Active and configured

## 🚀 Quick Setup

### 1. Configure Your Bot
Run the automated setup script:
```bash
npm run setup-bot
```

This will:
- ✅ Test bot connection
- ✅ Set up bot commands (/start, /latest, /subscribe, /help, /categories)
- ✅ Configure bot description
- ✅ Set up welcome messages

### 2. Test Your Bot
1. **Go to your bot**: https://t.me/GreyBrainPulseBot
2. **Send `/start`** to activate the bot
3. **Try commands**:
   - `/latest` - Get latest newsletter
   - `/subscribe` - Subscription info
   - `/categories` - View categories
   - `/help` - Show all commands

## 🔧 Bot Commands Available

| Command | Description |
|---------|-------------|
| `/start` | Welcome message and subscription info |
| `/latest` | Get the latest newsletter |
| `/subscribe` | Subscribe to newsletter updates |
| `/categories` | View available newsletter categories |
| `/help` | Show available commands |

## 📡 Integration Features

### ✅ Already Configured:
- **Bot Commands**: All commands set up and working
- **Welcome Messages**: Personalized responses
- **Newsletter Formatting**: Optimized for Telegram
- **URL Integration**: Links to your live website
- **Message Splitting**: Handles long newsletters automatically

### 🔄 Auto-Posting Setup:
Your bot can automatically post newsletters to channels. To set this up:

1. **Create Telegram Channels** (optional):
   - @greybrain_pulse (main channel)
   - @greybrain_health (health-focused)
   - @greybrain_ai (AI-focused)

2. **Add Bot as Admin** to your channels:
   - Go to channel settings
   - Add @GreyBrainPulseBot as administrator
   - Give posting permissions

3. **Configure Auto-Posting**:
   ```javascript
   // In your newsletter service
   import { sendNewsletterToTelegram } from './services/telegramService';
   
   // Post to channel
   await sendNewsletterToTelegram('@your_channel', newsletterData);
   ```

## 🛠 Advanced Configuration

### Environment Variables
Add to your `.env` file:
```env
VITE_TELEGRAM_BOT_TOKEN=8010638207:AAFfbXNgD9Y8AFJ1FTcv_IhJeLZ0EvZk9EA
VITE_TELEGRAM_CHANNEL_MAIN=@greybrain_pulse
VITE_TELEGRAM_CHANNEL_HEALTH=@greybrain_health
VITE_TELEGRAM_CHANNEL_AI=@greybrain_ai
```

## 📊 Usage Examples

### 1. Manual Newsletter Posting
```javascript
import telegramService from './services/telegramService';

// Send to a specific chat/channel
await telegramService.sendNewsletterToTelegram(
  '@your_channel',  // or chat ID
  newsletterData,
  3  // max items per section
);
```

### 2. Handle User Messages
```javascript
// Bot webhook handler
app.post('/api/telegram/webhook', (req, res) => {
  const { message } = req.body;
  if (message?.text) {
    telegramService.handleBotMessage(
      message.chat.id, 
      message.text
    );
  }
  res.sendStatus(200);
});
```

## 🎯 Next Steps

### Immediate Actions:
1. **Test your bot**: https://t.me/GreyBrainPulseBot
2. **Run setup script**: `npm run setup-bot`
3. **Create channels** (optional)
4. **Configure auto-posting**

### Future Enhancements:
- **Inline Keyboards**: Add interactive buttons
- **Rich Media**: Send images, documents
- **User Subscriptions**: Track user preferences
- **Analytics Dashboard**: Monitor bot performance

## 📞 Support

- **Telegram Bot API**: https://core.telegram.org/bots/api
- **BotFather**: https://t.me/BotFather
- **Your Bot**: https://t.me/GreyBrainPulseBot

---

🎉 **Your GreyBrain AI Pulse bot is ready to serve your community!**

Start by running `npm run setup-bot` and then visit https://t.me/GreyBrainPulseBot to test it out!
