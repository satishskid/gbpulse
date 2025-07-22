# 🧠 GreyBrain AI Pulse

> **The Ultimate AI-Powered Newsletter Platform for LLM Health Insights**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://llm-healthcare-insights.web.app)
[![Firebase](https://img.shields.io/badge/Powered%20by-Firebase-orange)](https://firebase.google.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🌟 Overview

GreyBrain AI Pulse is a cutting-edge newsletter platform that delivers curated insights on AI in healthcare, LLM safety, and emerging technologies. Built with modern web technologies and powered by AI, it provides automated content generation, multi-platform distribution, and real-time analytics.

### 🎯 Key Features

- 🤖 **AI-Powered Content Generation** - Automated newsletter creation using Google Gemini
- 📧 **Multi-Platform Distribution** - Email and Discord integration
- 📊 **Real-time Analytics** - Track engagement and performance metrics
- 📱 **Responsive Design** - Seamless experience across all devices
- 🔥 **Firebase Integration** - Scalable backend with real-time database
- 🚀 **One-Click Deployment** - Automated deployment to Firebase Hosting
- 💬 **Discord Integration** - Automated posting to Discord channels
- 🔍 **Source Transparency** - Full list of sources and visual word cloud
- 📚 **Bookmark System** - Save articles for later viewing
- 🔄 **Auto-Refresh** - Content updates every 30 minutes

## 🚀 Live Demo

- **Website**: [https://llm-healthcare-insights.web.app](https://llm-healthcare-insights.web.app)

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS + Custom Components |
| **Backend** | Firebase (Firestore, Hosting, Analytics) |
| **AI/ML** | Google Gemini API |
| **Communication** | Discord API |
| **Deployment** | Firebase Hosting + GitHub Actions |
| **Analytics** | Firebase Analytics + Custom Metrics |

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase CLI
- Git

### 1. Clone & Install
```bash
git clone https://github.com/satishskid/gbpulse.git
cd greybrain-ai-pulse
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your API keys (see Environment Variables section)
```

### 3. Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### 4. Deploy
```bash
npm run deploy       # Deploy to Firebase Hosting
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration (auto-configured)
VITE_FIREBASE_API_KEY=auto_configured
VITE_FIREBASE_PROJECT_ID=llm-healthcare-insights

# Discord Integration
VITE_DISCORD_WEBHOOK_URL=your_discord_webhook_url
VITE_DISCORD_CHANNEL_GENERAL=your_general_channel_id

# Email Configuration (optional)
VITE_EMAIL_SERVICE_API_KEY=your_email_service_key
```

## 📚 Documentation

- 📖 **[User Manual](USER_MANUAL.md)** - Complete guide for end users
- 👨‍💻 **[Developer Manual](DEVELOPER_MANUAL.md)** - Technical documentation for developers
- 💬 **[Discord Setup](DISCORD_SETUP.md)** - Discord integration guide
- 🔥 **[Firebase Setup](FIREBASE_SETUP.md)** - Hosting and database setup

## 🎯 Use Cases

### For Healthcare Professionals
- Stay updated on AI healthcare developments
- Access curated research insights
- Track LLM safety in medical applications

### For AI Researchers
- Monitor latest LLM health research
- Access industry analysis and trends
- Connect with healthcare AI community

### For Organizations
- White-label newsletter solution
- Automated content distribution
- Community engagement tools

## 🚀 Deployment Options

### Firebase Hosting (Recommended)
```bash
npm run deploy
```

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Submit a Pull Request

## 📊 Project Structure

```
greybrain-ai-pulse/
├── components/          # React components
├── services/           # API services (Discord, etc.)
├── scripts/           # Automation scripts
├── dist/              # Production build
├── docs/              # Documentation
├── firebase.json      # Firebase configuration
├── package.json       # Dependencies and scripts
└── README.md         # This file
```

## 🔐 Security

- All API keys stored in environment variables
- Firebase security rules implemented
- Rate limiting on API endpoints
- Input validation and sanitization

## 📈 Performance

- Lighthouse Score: 95+
- First Contentful Paint: <1.5s
- Time to Interactive: <2.5s
- Bundle size optimized with code splitting

## 🆘 Support

- 📧 **Email**: support@greybrain.ai
- 💬 **Discord**: [Join our community](https://discord.gg/greybrain)
- 🐛 **Issues**: [GitHub Issues](https://github.com/satishskid/gbpulse/issues)
- 📖 **Docs**: [Documentation](https://docs.greybrain.ai)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Firebase for hosting and backend services
- Tailwind CSS for styling framework
- React community for excellent tooling

---

<div align="center">
  <strong>Built with ❤️ by the GreyBrain Team</strong>
  <br>
  <a href="https://llm-healthcare-insights.web.app">🌐 Visit Live Site</a> •
  <a href="#contributing">🤝 Contribute</a>
</div>
