#!/bin/bash

# GreyBrain AI Pulse Discord Setup Script
# Automated Discord server configuration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emojis
ROCKET="🚀"
CHECK="✅"
CROSS="❌"
INFO="ℹ️"
WARNING="⚠️"
ROBOT="🤖"

echo -e "${CYAN}${ROBOT} GreyBrain AI Pulse Discord Setup${NC}"
echo -e "${CYAN}======================================${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${CROSS} ${RED}Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${CROSS} ${RED}Please run this script from the project root directory.${NC}"
    exit 1
fi

echo -e "${INFO} ${BLUE}This script will help you set up a professional Discord server for GreyBrain AI Pulse.${NC}\n"

echo -e "${YELLOW}Prerequisites:${NC}"
echo "1. Discord account"
echo "2. Discord application created at https://discord.com/developers/applications"
echo "3. Bot token from your Discord application"
echo "4. Discord server where you have admin permissions"
echo ""

read -p "Do you have all prerequisites ready? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${WARNING} ${YELLOW}Please complete the prerequisites first.${NC}"
    echo ""
    echo "Quick setup guide:"
    echo "1. Go to https://discord.com/developers/applications"
    echo "2. Click 'New Application'"
    echo "3. Name it 'GreyBrain AI Pulse Bot'"
    echo "4. Go to 'Bot' section"
    echo "5. Click 'Add Bot'"
    echo "6. Copy the bot token"
    echo "7. Go to OAuth2 > URL Generator"
    echo "8. Select 'bot' scope and 'Administrator' permission"
    echo "9. Use the generated URL to invite bot to your server"
    exit 0
fi

echo ""
echo -e "${ROCKET} ${GREEN}Starting Discord setup...${NC}\n"

# Get bot token
echo -e "${INFO} ${BLUE}Enter your Discord bot token:${NC}"
read -s BOT_TOKEN
echo ""

if [ -z "$BOT_TOKEN" ]; then
    echo -e "${CROSS} ${RED}Bot token is required!${NC}"
    exit 1
fi

# Get guild ID
echo -e "${INFO} ${BLUE}Enter your Discord server (guild) ID:${NC}"
echo -e "${YELLOW}(Enable Developer Mode in Discord, right-click your server, Copy ID)${NC}"
read GUILD_ID

if [ -z "$GUILD_ID" ]; then
    echo -e "${CROSS} ${RED}Guild ID is required!${NC}"
    exit 1
fi

# Update .env file
echo -e "\n${INFO} ${BLUE}Updating environment variables...${NC}"

ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${WARNING} ${YELLOW}.env file not found, creating one...${NC}"
    touch "$ENV_FILE"
fi

# Add Discord configuration to .env
if ! grep -q "VITE_DISCORD_BOT_TOKEN" "$ENV_FILE"; then
    echo "VITE_DISCORD_BOT_TOKEN=$BOT_TOKEN" >> "$ENV_FILE"
    echo -e "${CHECK} ${GREEN}Added Discord bot token to .env${NC}"
fi

if ! grep -q "VITE_DISCORD_GUILD_ID" "$ENV_FILE"; then
    echo "VITE_DISCORD_GUILD_ID=$GUILD_ID" >> "$ENV_FILE"
    echo -e "${CHECK} ${GREEN}Added Discord guild ID to .env${NC}"
fi

# Install dependencies if needed
echo -e "\n${INFO} ${BLUE}Checking dependencies...${NC}"
if ! npm list discord.js &> /dev/null; then
    echo -e "${INFO} ${BLUE}Installing Discord.js...${NC}"
    npm install discord.js
fi

# Run the Node.js setup script
echo -e "\n${ROCKET} ${GREEN}Running automated server setup...${NC}"
export DISCORD_BOT_TOKEN="$BOT_TOKEN"
export DISCORD_GUILD_ID="$GUILD_ID"

node scripts/discord-setup.js

# Create invite link
echo -e "\n${INFO} ${BLUE}Creating invite link...${NC}"
INVITE_URL="https://discord.gg/greybrain-ai-pulse"
echo -e "${CHECK} ${GREEN}Default invite URL: $INVITE_URL${NC}"
echo -e "${WARNING} ${YELLOW}Please create a custom invite link in your Discord server and update the .env file${NC}"

# Update .env with invite link
if ! grep -q "VITE_DISCORD_SERVER_INVITE" "$ENV_FILE"; then
    echo "VITE_DISCORD_SERVER_INVITE=$INVITE_URL" >> "$ENV_FILE"
    echo -e "${CHECK} ${GREEN}Added Discord invite URL to .env${NC}"
fi

echo -e "\n${ROCKET} ${GREEN}Discord setup complete!${NC}\n"

echo -e "${CYAN}Next Steps:${NC}"
echo "1. ${CHECK} Create a custom invite link in Discord"
echo "2. ${CHECK} Update VITE_DISCORD_SERVER_INVITE in .env"
echo "3. ${CHECK} Test the webhook integration"
echo "4. ${CHECK} Invite your first members"
echo "5. ${CHECK} Start your development server: npm run dev"

echo -e "\n${INFO} ${BLUE}Your Discord server now has:${NC}"
echo "• Professional healthcare-focused channels"
echo "• Role-based access control"
echo "• Community guidelines"
echo "• Welcome messages"
echo "• Webhook for newsletter integration"

echo -e "\n${PURPLE}Happy community building! ${ROBOT}${NC}"
