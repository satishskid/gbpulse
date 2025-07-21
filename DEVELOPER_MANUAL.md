# 👨‍💻 GreyBrain AI Pulse - Developer Manual

> **Technical Documentation for Developers**

This manual provides comprehensive technical documentation for developers working on or integrating with GreyBrain AI Pulse.

## 🏗️ Architecture Overview

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Firebase      │    │   External      │
│   React + TS    │◄──►│   Backend       │◄──►│   APIs          │
│   + Vite        │    │   + Firestore   │    │   (Gemini, etc) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Hosting       │    │   Database      │    │   Integrations  │
│   Firebase      │    │   Firestore     │    │   Discord/      │
│   + CDN         │    │   + Rules       │    │   Telegram      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | UI components and logic |
| **Build Tool** | Vite | Fast development and building |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Backend** | Firebase Functions | Serverless backend logic |
| **Database** | Firestore | NoSQL document database |
| **Hosting** | Firebase Hosting | Static site hosting + CDN |
| **AI/ML** | Google Gemini API | Content generation |
| **Communication** | Discord/Telegram APIs | Multi-platform distribution |
| **Analytics** | Firebase Analytics | Usage tracking |

## 🚀 Development Setup

### Prerequisites

```bash
# Required software
Node.js >= 18.0.0
npm >= 8.0.0
Git >= 2.0.0

# Optional but recommended
Firebase CLI >= 12.0.0
VS Code with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - Firebase
```

### Environment Configuration

#### 1. Clone Repository
```bash
git clone https://github.com/satishskid/gbpulse.git
cd greybrain-ai-pulse
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Environment Variables
Create `.env` file:
```env
# AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key

# Firebase (auto-configured from firebase.ts)
VITE_FIREBASE_API_KEY=auto_configured
VITE_FIREBASE_PROJECT_ID=llm-healthcare-insights

# Discord Integration
VITE_DISCORD_WEBHOOK_URL=your_webhook_url
VITE_DISCORD_CHANNEL_GENERAL=channel_id
VITE_DISCORD_CHANNEL_HEALTH=channel_id

# Telegram Integration
VITE_TELEGRAM_BOT_TOKEN=bot_token
VITE_TELEGRAM_CHANNEL_MAIN=@channel_name

# Development
VITE_DEV_MODE=true
VITE_LOG_LEVEL=debug
```

#### 4. Firebase Setup
```bash
# Login to Firebase
firebase login

# Initialize project (if not already done)
firebase init

# Deploy rules and indexes
firebase deploy --only firestore:rules,firestore:indexes
```

### Development Commands

```bash
# Development server
npm run dev                 # Start dev server at http://localhost:5173

# Building
npm run build              # Build for production
npm run preview            # Preview production build

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run end-to-end tests
npm run test:coverage      # Generate coverage report

# Linting and Formatting
npm run lint               # ESLint check
npm run lint:fix           # Fix ESLint issues
npm run format             # Prettier formatting

# Deployment
npm run deploy             # Deploy to Firebase
npm run deploy:staging     # Deploy to staging environment

# Bot Setup
npm run setup-bot          # Configure Telegram bot
npm run setup-discord      # Configure Discord integration
```

## 📁 Project Structure

```
greybrain-ai-pulse/
├── components/                 # React components
│   ├── DiscordCommunity.tsx   # Discord integration UI
│   ├── ErrorDisplay.tsx       # Error handling component
│   ├── LoadingSpinner.tsx     # Loading states
│   ├── RSSFeedManager.tsx     # RSS feed management
│   ├── SourceWordCloud.tsx    # Word cloud visualization
│   └── SubscriptionForm.tsx   # Email subscription form
├── services/                   # API services and utilities
│   ├── brevoService.ts        # Email service integration
│   ├── discordService.ts      # Discord API wrapper
│   ├── geminiService.ts       # AI content generation
│   ├── rssService.ts          # RSS feed processing
│   ├── telegramService.ts     # Telegram bot service
│   └── weeklyDigestService.ts # Newsletter compilation
├── scripts/                    # Automation and setup scripts
│   ├── discord-setup.js       # Discord configuration
│   ├── quick-setup.js         # Quick project setup
│   ├── setup-discord.sh       # Discord shell script
│   ├── setup-telegram-bot.js  # Telegram bot setup
│   ├── setup-telegram.js      # Telegram configuration
│   └── test-discord-channels.js # Discord testing
├── dist/                       # Production build output
├── firebase.json              # Firebase configuration
├── firestore.rules           # Database security rules
├── firestore.indexes.json    # Database indexes
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── types.ts                  # TypeScript type definitions
```

## 🔧 Core Components

### 1. Main Application (App.tsx)

```typescript
// Key features of App.tsx
interface AppState {
  newsletterData: NewsletterData | null;
  loading: boolean;
  error: string | null;
  bookmarkedItems: Set<string>;
}

// Main data fetching logic
const fetchData = useCallback(async () => {
  try {
    setLoading(true);
    const data = await fetchNewsletterContent();
    setNewsletterData(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
}, []);
```

### 2. Gemini Service (services/geminiService.ts)

```typescript
// AI content generation
export const fetchNewsletterContent = async (): Promise<NewsletterData> => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `Generate a comprehensive newsletter about LLM health insights...`;
  
  const result = await model.generateContent(prompt);
  return parseAndValidateResponse(result.response.text());
};
```

### 3. Firebase Integration

#### Firestore Rules (firestore.rules)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Newsletter data - read only for public
    match /newsletters/{document} {
      allow read: if true;
      allow write: if false; // Only server-side writes
    }
    
    // Subscriber data - write only for subscriptions
    match /subscribers/{document} {
      allow read: if false; // Private data
      allow create: if true; // Allow new subscriptions
      allow update, delete: if false;
    }
  }
}
```

#### Database Indexes (firestore.indexes.json)
```json
{
  "indexes": [
    {
      "collectionGroup": "newsletters",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "timestamp", "order": "DESCENDING"}
      ]
    }
  ]
}
```

## 🤖 AI Integration

### Gemini API Configuration

```typescript
// services/geminiService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Content generation with error handling
export const generateContent = async (prompt: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate content');
  }
};
```

### Prompt Engineering

```typescript
// Structured prompt for consistent output
const NEWSLETTER_PROMPT = `
Generate a comprehensive newsletter about LLM health insights with the following structure:

{
  "newsletter": [
    {
      "categoryTitle": "Category Name",
      "items": [
        {
          "title": "Article Title",
          "summary": "Brief summary",
          "sourceUrl": "https://example.com",
          "sourceType": "Academic Paper|News Article|Blog Post"
        }
      ]
    }
  ],
  "sources": ["url1", "url2"],
  "timestamp": "ISO date string"
}

Focus on: AI safety, healthcare applications, research developments, industry trends.
Ensure all URLs are valid and accessible.
`;
```

## 📡 API Integrations

### Discord Integration

```typescript
// services/discordService.ts
export const sendToDiscord = async (content: string, webhookUrl: string) => {
  const payload = {
    content,
    embeds: [{
      title: "GreyBrain AI Pulse",
      description: content,
      color: 0x00ff00,
      timestamp: new Date().toISOString()
    }]
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return response.ok;
};
```

### Telegram Bot Integration

```typescript
// services/telegramService.ts
export const sendTelegramMessage = async (chatId: string, text: string) => {
  const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML'
    })
  });

  return response.ok;
};
```

## 🔒 Security Implementation

### Environment Variables
- All sensitive data stored in environment variables
- Different configurations for development/production
- API keys never committed to version control

### Firebase Security Rules
- Read-only access for public data
- Write restrictions on sensitive collections
- User authentication for admin functions

### Input Validation
```typescript
// Type-safe input validation
interface NewsletterItem {
  title: string;
  summary: string;
  sourceUrl: string;
  sourceType: 'Academic Paper' | 'News Article' | 'Blog Post';
}

const validateNewsletterItem = (item: any): NewsletterItem => {
  if (!item.title || !item.summary || !item.sourceUrl) {
    throw new Error('Invalid newsletter item structure');
  }
  return item as NewsletterItem;
};
```

## 🧪 Testing Strategy

### Unit Tests
```typescript
// Example test for geminiService
import { describe, it, expect, vi } from 'vitest';
import { fetchNewsletterContent } from '../services/geminiService';

describe('GeminiService', () => {
  it('should fetch and parse newsletter content', async () => {
    const mockResponse = { /* mock data */ };
    vi.mocked(fetch).mockResolvedValueOnce(mockResponse);
    
    const result = await fetchNewsletterContent();
    expect(result).toHaveProperty('newsletter');
    expect(result.newsletter).toBeInstanceOf(Array);
  });
});
```

### Integration Tests
```typescript
// Test Discord integration
describe('Discord Integration', () => {
  it('should send message to Discord webhook', async () => {
    const result = await sendToDiscord('Test message', TEST_WEBHOOK_URL);
    expect(result).toBe(true);
  });
});
```

### E2E Tests
```typescript
// Playwright/Cypress tests for user flows
describe('User Journey', () => {
  it('should load newsletter and allow bookmarking', () => {
    cy.visit('/');
    cy.get('[data-testid="newsletter-item"]').first().click();
    cy.get('[data-testid="bookmark-button"]').click();
    cy.get('[data-testid="bookmark-count"]').should('contain', '1');
  });
});
```

## 🚀 Deployment

### Firebase Hosting
```bash
# Build and deploy
npm run build
firebase deploy --only hosting

# Deploy with functions
firebase deploy --only hosting,functions

# Deploy to specific project
firebase use production
firebase deploy
```

### Environment-Specific Deployments
```bash
# Staging
firebase use staging
npm run deploy:staging

# Production
firebase use production
npm run deploy:production
```

### CI/CD Pipeline (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: llm-healthcare-insights
```

## 📊 Monitoring and Analytics

### Firebase Analytics
```typescript
// Track user interactions
import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

export const trackNewsletterView = () => {
  logEvent(analytics, 'newsletter_view', {
    timestamp: new Date().toISOString()
  });
};

export const trackBookmark = (articleId: string) => {
  logEvent(analytics, 'article_bookmark', {
    article_id: articleId
  });
};
```

### Performance Monitoring
```typescript
// Monitor API response times
const monitorApiCall = async (apiCall: () => Promise<any>) => {
  const startTime = performance.now();
  try {
    const result = await apiCall();
    const duration = performance.now() - startTime;
    console.log(`API call completed in ${duration}ms`);
    return result;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};
```

## 🔧 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npx tsc --noEmit
```

#### Firebase Deployment Issues
```bash
# Check Firebase CLI version
firebase --version

# Re-authenticate
firebase logout
firebase login

# Check project configuration
firebase projects:list
firebase use --add
```

#### API Integration Problems
```bash
# Test API endpoints
curl -X POST "https://api.telegram.org/bot<TOKEN>/getMe"

# Check environment variables
echo $VITE_GEMINI_API_KEY
```

### Debug Mode
```typescript
// Enable debug logging
if (import.meta.env.VITE_DEV_MODE === 'true') {
  console.log('Debug mode enabled');
  window.debugApp = {
    newsletterData,
    bookmarkedItems,
    // ... other debug info
  };
}
```

## 📚 API Reference

### Internal APIs

#### Newsletter Service
```typescript
interface NewsletterData {
  newsletter: NewsletterSection[];
  sources: string[];
  timestamp: string;
}

interface NewsletterSection {
  categoryTitle: string;
  items: NewsletterItem[];
}

interface NewsletterItem {
  title: string;
  summary: string;
  sourceUrl: string;
  sourceType: string;
}
```

#### Bookmark Service
```typescript
class BookmarkService {
  static add(itemId: string): void;
  static remove(itemId: string): void;
  static getAll(): string[];
  static clear(): void;
}
```

### External API Integrations

#### Gemini API
- **Endpoint**: Google Generative AI
- **Model**: gemini-pro
- **Rate Limits**: 60 requests/minute
- **Authentication**: API Key

#### Discord API
- **Endpoint**: Webhook URLs
- **Rate Limits**: 30 requests/minute per webhook
- **Authentication**: Webhook URL

#### Telegram API
- **Endpoint**: https://api.telegram.org/bot{token}
- **Rate Limits**: 30 messages/second
- **Authentication**: Bot Token

## 🤝 Contributing

### Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write tests for new features
- Document public APIs

### Pull Request Process
1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and add tests
4. Run linting: `npm run lint`
5. Run tests: `npm test`
6. Commit with conventional commits
7. Push and create pull request

### Commit Convention
```
feat: add new newsletter category
fix: resolve Discord webhook timeout
docs: update API documentation
test: add unit tests for gemini service
refactor: improve error handling
```

---

## 📞 Developer Support

- 📧 **Email**: dev@greybrain.ai
- 💬 **Discord**: [Developer Channel](https://discord.gg/greybrain-dev)
- 📖 **Docs**: [API Documentation](https://docs.greybrain.ai)
- 🐛 **Issues**: [GitHub Issues](https://github.com/satishskid/gbpulse/issues)

---

<div align="center">
  <strong>Happy Coding! 🚀</strong>
  <br>
  <em>Build the future of AI healthcare communication</em>
</div>
