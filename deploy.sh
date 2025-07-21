#!/bin/bash

# GreyBrain AI Pulse - Deployment Script
echo "🚀 Deploying GreyBrain AI Pulse..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set environment variables in Vercel dashboard:"
echo "   - VITE_GEMINI_API_KEY"
echo "   - VITE_BREVO_API_KEY" 
echo "   - VITE_DISCORD_BOT_TOKEN"
echo "   - VITE_DISCORD_GUILD_ID"
echo "   - VITE_DISCORD_WEBHOOK_URL"
echo "   - VITE_DISCORD_SERVER_INVITE"
echo ""
echo "2. Configure custom domain (optional):"
echo "   - Add pulse.greybrain.ai in Vercel dashboard"
echo "   - Update DNS CNAME record"
echo ""
echo "3. Test the deployment:"
echo "   - Verify newsletter generation works"
echo "   - Test Discord auto-posting"
echo "   - Check email subscriptions"
echo ""
echo "🔗 Your GreyBrain AI Pulse is now live!"
