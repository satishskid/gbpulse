# 🚀 GreyBrain AI Pulse - Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ **Current Features Ready for Production:**
- 🧠 **AI-Powered Newsletter Generation** (Gemini API with Google Search)
- 📧 **Email Newsletter Automation** (Brevo integration)
- 🤖 **Discord Community Integration** (Auto-posting to topic channels)
- 📊 **RSS Feed Generation** 
- 🔖 **Bookmark System**
- 📱 **Responsive Design**
- 🔄 **Auto-refresh every 30 minutes**

### 🔧 **Environment Variables Required:**
```env
# API Keys
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_BREVO_API_KEY=your_brevo_api_key

# Discord Configuration
VITE_DISCORD_BOT_TOKEN=your_discord_bot_token
VITE_DISCORD_GUILD_ID=your_discord_guild_id
VITE_DISCORD_WEBHOOK_URL=your_discord_webhook_url
VITE_DISCORD_SERVER_INVITE=https://discord.gg/your-invite

# Telegram (Optional - can be added later)
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
VITE_TELEGRAM_CHAT_ID=your_telegram_chat_id
```

## 🌐 Deployment Options

### **Option 1: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# vercel.com → Project → Settings → Environment Variables
```

### **Option 2: Netlify**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### **Option 3: GitHub Pages**
```bash
# Build for production
npm run build

# Deploy to gh-pages branch
npm i -g gh-pages
gh-pages -d dist
```

## 🔗 Embedding in GreyBrain.ai

### **Option 1: Full Page Integration**
Add a new page/route to your main website:
```html
<!-- Add to your main site -->
<iframe 
  src="https://your-deployed-pulse.vercel.app" 
  width="100%" 
  height="100vh" 
  frameborder="0">
</iframe>
```

### **Option 2: Widget Integration**
Create a newsletter widget for your homepage:
```html
<!-- Newsletter widget -->
<div id="greybrain-pulse-widget"></div>
<script>
  // Embed latest newsletter content
  fetch('https://your-deployed-pulse.vercel.app/api/latest')
    .then(response => response.json())
    .then(data => {
      // Render newsletter preview
    });
</script>
```

### **Option 3: Subdomain**
Set up a subdomain: `pulse.greybrain.ai`
- Point DNS to your deployment
- Update CNAME records

## 📧 Email Newsletter Automation

### **Current Setup:**
- ✅ **Subscription Form** (Brevo integration)
- ✅ **Weekly Digest Generation** (HTML + Text)
- ✅ **Automated Campaigns** (Brevo API)
- ✅ **RSS Feed** for email clients

### **To Enable Auto-Sending:**
1. **Set up Brevo Campaign Automation**
2. **Configure Weekly Schedule** (Sundays at 9 AM)
3. **Test with Small List** first

## 🤖 Discord Integration Status

### **✅ Fully Configured:**
- Professional Discord server created
- 6 topic-specific channels matching newsletter categories
- Auto-posting when new content is generated
- Professional roles and community guidelines
- Webhook integration for manual posting

### **Channels Created:**
- `#llm-announcements` → "New LLM Announcements & Releases"
- `#productivity-hacks` → "LLM Productivity Hacks & Tips"
- `#ai-tool-of-the-day` → "AI Tool/Tip of the Day"
- `#deep-agents-tools` → "Emerging Deep Agents & AI Tools"
- `#academic-research` → "Academic Research & Papers"
- `#healthcare-llm` → "Healthcare LLM Advancements"

## 🔄 Automation Features

### **Auto-Posting (Every 30 minutes):**
1. **Generate Newsletter** (Gemini API + Google Search)
2. **Post to Discord Channels** (Topic-specific routing)
3. **Update RSS Feed**
4. **Refresh Website Content**

### **Weekly Email Digest:**
- Automated HTML email generation
- Subscriber management via Brevo
- Professional email templates

## 📱 Mobile & Performance

### **Optimizations:**
- ✅ Responsive design for all devices
- ✅ Lazy loading for images
- ✅ Optimized bundle size
- ✅ Fast loading with Vite

## 🔐 Security & Privacy

### **Implemented:**
- ✅ Environment variable protection
- ✅ API key security
- ✅ CORS configuration
- ✅ No sensitive data in client

## 📊 Analytics & Monitoring

### **Ready for:**
- Google Analytics integration
- Newsletter engagement tracking
- Discord community metrics
- Email open/click rates (Brevo)

## 🚀 Quick Deploy Commands

```bash
# 1. Build for production
npm run build

# 2. Test production build locally
npm run preview

# 3. Deploy to Vercel
vercel --prod

# 4. Set environment variables in Vercel dashboard
```

## 🔧 Post-Deployment Tasks

1. **Update Discord Invite Link** in .env
2. **Test Email Subscriptions**
3. **Verify Auto-Posting**
4. **Set up Custom Domain** (if needed)
5. **Configure Analytics**

## 📞 Support & Maintenance

### **Monitoring:**
- Check Discord auto-posting daily
- Monitor email delivery rates
- Review API usage limits
- Update content categories as needed

### **Future Enhancements:**
- 📱 Telegram integration
- 🔍 Search functionality
- 📈 Analytics dashboard
- 🎨 Custom themes
- 🔔 Push notifications

Ready to deploy! 🚀
