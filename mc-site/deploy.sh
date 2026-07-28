#!/bin/bash

# Mission Control Cloudflare Deployment Script
# Deploys complete site to mc.ruralhaven.co

set -e

echo "🚀 Mission Control Cloudflare Deployment"
echo "========================================"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "📦 Installing Wrangler CLI..."
    npm install -g wrangler
fi

# Check login
echo "🔐 Checking Cloudflare login..."
if ! wrangler whoami &> /dev/null; then
    echo "⚠️ Please login to Cloudflare first:"
    echo ""
    echo "   wrangler login"
    echo ""
    exit 1
fi

echo "✅ Logged into Cloudflare"

# Create project if it doesn't exist
echo "📁 Creating Cloudflare Pages project..."
PROJECT_NAME="mc-ruralhaven-co"

# Check if project exists
if ! wrangler pages project list 2>/dev/null | grep -q "$PROJECT_NAME"; then
    echo "🆕 Creating new project: $PROJECT_NAME"
    wrangler pages project create "$PROJECT_NAME" --production-branch main
else
    echo "✅ Project already exists: $PROJECT_NAME"
fi

# Deploy to Cloudflare Pages
echo "🚀 Deploying to Cloudflare Pages..."
DEPLOY_OUTPUT=$(wrangler pages deploy . --project-name="$PROJECT_NAME" 2>&1)

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo ""
    
    # Extract URL from output
    URL=$(echo "$DEPLOY_OUTPUT" | grep -o 'https://[^ ]*\.pages\.dev' | head -1)
    
    if [ -n "$URL" ]; then
        echo "🌐 Your Mission Control is live at:"
        echo "   $URL"
        echo ""
        echo "🔗 Available Pages:"
        echo "   $URL/                    - Home Dashboard"
        echo "   $URL/trading             - Trading Dashboard"
        echo "   $URL/property-calculator - Property Calculator"
        echo "   $URL/alpha-vantage       - Market Data"
        echo "   $URL/dividends           - Dividend Analysis"
        echo "   $URL/mission-control     - Full Dashboard"
        echo ""
        echo "🔌 API Endpoints:"
        echo "   $URL/api/alpha/quote?symbol=SPY"
        echo "   $URL/api/massive/dividends"
        echo "   $URL/api/market/overview"
        echo "   $URL/api/system/status"
        echo "   $URL/api/docs"
        echo ""
        echo "⚙️ Next Steps:"
        echo "   1. Set custom domain: mc.ruralhaven.co"
        echo "   2. Set environment variables in Cloudflare Dashboard:"
        echo "      - ALPHA_VANTAGE_KEY"
        echo "      - MASSIVE_API_KEY"
        echo "   3. Test all features"
        echo "   4. Share with your team"
    else
        echo "📋 Deployment output:"
        echo "$DEPLOY_OUTPUT"
    fi
    
else
    echo "❌ Deployment failed!"
    echo ""
    echo "📋 Error output:"
    echo "$DEPLOY_OUTPUT"
    echo ""
    echo "💡 Troubleshooting:"
    echo "   1. Check Cloudflare login: wrangler whoami"
    echo "   2. Check project exists: wrangler pages project list"
    echo "   3. Try manual deploy: wrangler pages deploy . --project-name=$PROJECT_NAME"
fi

echo ""
echo "📁 Project files are in: $(pwd)"
echo "🔄 To redeploy: wrangler pages deploy . --project-name=$PROJECT_NAME"