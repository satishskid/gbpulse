# 🚀 Discord Quick Start - Automated Setup

Set up your professional Discord community in **under 5 minutes** with our automated scripts!

## ⚡ Super Quick Setup (1 command)

```bash
npm run quick-discord YOUR_BOT_TOKEN YOUR_GUILD_ID
```

**Example:**
```bash
npm run quick-discord "YOUR_BOT_TOKEN_HERE" "YOUR_GUILD_ID_HERE"
```

## 🛠️ Interactive Setup

```bash
npm run setup-discord
```

This will guide you through the setup process step by step.

## 📋 Prerequisites (2 minutes)

### 1. Create Discord Application
1. Go to https://discord.com/developers/applications
2. Click **"New Application"**
3. Name it **"GreyBrain AI Pulse Bot"**
4. Click **"Create"**

### 2. Create Bot
1. Go to **"Bot"** section in left sidebar
2. Click **"Add Bot"**
3. Click **"Yes, do it!"**
4. **Copy the bot token** (keep it secret!)

### 3. Invite Bot to Your Server
1. Go to **"OAuth2"** → **"URL Generator"**
2. Select **"bot"** scope
3. Select **"Administrator"** permission
4. **Copy the generated URL**
5. **Open URL** and invite bot to your server

### 4. Get Server ID
1. **Enable Developer Mode** in Discord (User Settings → Advanced → Developer Mode)
2. **Right-click your server name**
3. **Click "Copy ID"**

## 🎯 What Gets Created Automatically

### **Professional Channels:**
- 📋 **INFORMATION**
  - `#welcome` - Welcome messages
  - `#announcements` - Newsletter updates
  - `#community-guidelines` - Professional rules

- 🏥 **HEALTHCARE AI DISCUSSIONS**
  - `#general-discussion` - General AI healthcare chat
  - `#clinical-implementation` - Real-world experiences
  - `#research-papers` - Academic discussions
  - `#case-studies` - Anonymized case studies

- 🎯 **SPECIALIZED TOPICS**
  - `#radiology-ai` - Medical imaging
  - `#pathology-ai` - Digital pathology
  - `#drug-discovery` - Pharmaceutical AI
  - `#diagnostics-ai` - Diagnostic tools
  - `#workflow-optimization` - Productivity tools

- 💬 **COMMUNITY**
  - `#introductions` - Member introductions
  - `#networking` - Professional networking
  - `#events` - Webinars and conferences
  - `#feedback` - Community feedback

### **Professional Roles:**
- 👩‍⚕️ `@Healthcare Professional` - Verified doctors, nurses
- 🔬 `@Researcher` - Academic researchers
- 🤖 `@AI Specialist` - AI/ML engineers
- 🎓 `@Student` - Medical/AI students
- 🏢 `@Industry` - Healthcare industry
- 🛡️ `@Moderator` - Community moderators

### **Automated Content:**
- ✅ Welcome message with community info
- ✅ Professional community guidelines
- ✅ Webhook for newsletter integration
- ✅ HIPAA-compliant discussion rules

## 🔧 Manual Setup (if scripts fail)

If the automated scripts don't work, follow the detailed guide in `DISCORD_SETUP.md`.

## 🎉 After Setup

1. **Create Custom Invite Link:**
   - Right-click your server → "Invite People"
   - Set to never expire
   - Update `.env` file with your custom link

2. **Test Integration:**
   - Start your dev server: `npm run dev -- --port 3700`
   - Check the Discord community section
   - Test the "Join Discord Community" button

3. **Invite Members:**
   - Share your invite link
   - Verify healthcare professionals
   - Start discussions!

## 🆘 Troubleshooting

### Bot Token Issues
- Make sure token is correct and not expired
- Bot must have Administrator permissions
- Check if bot is online in your server

### Permission Errors
- Bot needs Administrator permissions
- Make sure bot role is above other roles
- Check server permissions

### Webhook Not Working
- Webhook URL should be in `.env` file
- Test webhook with a simple message
- Check channel permissions

## 📞 Need Help?

1. Check the detailed `DISCORD_SETUP.md` guide
2. Verify all prerequisites are met
3. Try the interactive setup: `npm run setup-discord`
4. Check Discord Developer Portal for bot status

## 🎯 Quick Commands Reference

```bash
# Quick automated setup
npm run quick-discord BOT_TOKEN GUILD_ID

# Interactive setup with prompts
npm run setup-discord

# Start development server
npm run dev -- --port 3700

# Build for production
npm run build
```

Your professional Discord community will be ready in minutes! 🚀
