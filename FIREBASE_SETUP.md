# Firebase Hosting Setup for GreyBrain AI Pulse

## 🔥 Firebase Configuration Complete!

Your GreyBrain AI Pulse project is now configured for Firebase Hosting with the following setup:

### Project Details
- **Firebase Project**: `llm-health-79ff6`
- **Hosting URL**: https://llm-health-79ff6.web.app
- **Console**: https://console.firebase.google.com/project/llm-health-79ff6

### Files Created
- ✅ `firebase.json` - Hosting configuration
- ✅ `firestore.rules` - Database security rules
- ✅ `firestore.indexes.json` - Database indexes
- ✅ `.firebaserc` - Project configuration
- ✅ `deploy-firebase.sh` - Deployment script

## 🚀 Quick Deployment

### Option 1: One-Command Deploy
```bash
npm run deploy
```

### Option 2: Manual Steps
```bash
# 1. Build the project
npm run build

# 2. Deploy to Firebase
firebase deploy --only hosting
```

### Option 3: Firebase CLI Direct
```bash
firebase deploy
```

## 📋 Pre-Deployment Checklist

### 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Verify Project Connection
```bash
firebase projects:list
```

### 4. Test Local Build
```bash
npm run build
npm run preview
```

## 🔧 Configuration Details

### Hosting Configuration (`firebase.json`)
- **Public Directory**: `dist` (Vite build output)
- **SPA Routing**: All routes redirect to `index.html`
- **Caching**: Optimized for static assets
- **Firestore**: Rules and indexes configured

### Security Rules (`firestore.rules`)
- **Newsletters**: Public read access
- **Subscribers**: Write-only for new subscriptions
- **Analytics**: Public read access
- **Discord**: Public read access

### Database Indexes (`firestore.indexes.json`)
- **Newsletters**: Sorted by timestamp (descending)
- **Subscribers**: Sorted by subscription date (descending)

## 🌐 Post-Deployment Steps

### 1. Verify Deployment
Visit your live site:
- Primary: https://llm-health-79ff6.web.app
- Alternative: https://llm-health-79ff6.firebaseapp.com

### 2. Test Core Features
- [ ] Newsletter display
- [ ] Email subscription form
- [ ] Discord community links
- [ ] Responsive design
- [ ] Performance metrics

### 3. Set Up Custom Domain (Optional)
1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter your domain (e.g., `pulse.greybrain.ai`)
4. Follow DNS configuration steps

### 4. Configure Environment Variables
For production environment variables:
1. Go to Firebase Console → Project Settings
2. Add configuration for:
   - Discord webhook URLs
   - Email service credentials
   - Analytics tracking IDs

### 5. Enable Firestore Database
1. Go to Firebase Console → Firestore Database
2. Create database in production mode
3. Deploy security rules: `firebase deploy --only firestore:rules`

## 🔄 Continuous Deployment

### GitHub Actions (Recommended)
Create `.github/workflows/firebase-hosting.yml`:

```yaml
name: Deploy to Firebase Hosting
on:
  push:
    branches: [ main ]
jobs:
  build_and_deploy:
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
          projectId: llm-health-79ff6
```

### Manual Deployment Workflow
1. Make changes to your code
2. Test locally: `npm run dev`
3. Build: `npm run build`
4. Deploy: `npm run deploy`

## 🛠 Troubleshooting

### Common Issues

**Build Fails**
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

**Firebase Login Issues**
```bash
firebase logout
firebase login
```

**Deployment Permissions**
- Ensure you have Editor/Owner role in Firebase project
- Check project ID in `.firebaserc` matches your Firebase console

**404 Errors on Refresh**
- Verify `rewrites` configuration in `firebase.json`
- Check that `dist/index.html` exists after build

### Performance Optimization
- Enable compression in Firebase Hosting
- Optimize images and assets
- Use Firebase Performance Monitoring
- Set up proper caching headers

## 📊 Monitoring & Analytics

### Firebase Analytics
- Automatically configured in `firebase.ts`
- View metrics in Firebase Console → Analytics

### Performance Monitoring
```bash
npm install firebase
# Add to your app initialization
```

### Hosting Metrics
- View in Firebase Console → Hosting
- Monitor bandwidth, requests, and errors

## 🔐 Security Best Practices

1. **Firestore Rules**: Regularly review and update
2. **API Keys**: Use environment variables for sensitive data
3. **CORS**: Configure for your domain only
4. **SSL**: Firebase provides automatic HTTPS
5. **Content Security Policy**: Add CSP headers if needed

## 📞 Support

- **Firebase Documentation**: https://firebase.google.com/docs/hosting
- **Firebase Console**: https://console.firebase.google.com/project/llm-health-79ff6
- **Community Support**: https://firebase.google.com/support

---

🎉 **Your GreyBrain AI Pulse is ready for the world!**

Run `npm run deploy` to go live in minutes!
