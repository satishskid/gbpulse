#!/bin/bash

# GreyBrain AI Pulse - Firebase Deployment Script
echo "🔥 Deploying GreyBrain AI Pulse to Firebase..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Check if user is logged in
echo "🔐 Checking Firebase authentication..."
firebase login:list > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "🔑 Please log in to Firebase..."
    firebase login
fi

# Build the project
echo "🔨 Building project for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Firebase
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "📋 Your GreyBrain AI Pulse is now live at:"
    echo "🌐 https://llm-healthcare-insights.web.app"
    echo "🌐 https://llm-healthcare-insights.firebaseapp.com"
    echo ""
    echo "📊 Next steps:"
    echo "1. Test the live site"
    echo "2. Set up custom domain (optional):"
    echo "   - Go to Firebase Console → Hosting → Add custom domain"
    echo "   - Add pulse.greybrain.ai"
    echo "3. Configure environment variables in Firebase"
    echo "4. Test Discord auto-posting"
    echo "5. Verify email subscriptions"
    echo ""
    echo "🔗 Firebase Console: https://console.firebase.google.com/project/llm-healthcare-insights"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi
