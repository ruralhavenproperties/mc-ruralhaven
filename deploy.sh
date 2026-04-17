#!/bin/bash
# Deployment script for Mission Control Cloudflare setup

echo "🚀 Mission Control Cloudflare Deployment"
echo "========================================"

# Check if in git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository"
    echo "Please run this from your GitHub repository directory"
    exit 1
fi

echo "📁 Copying files..."
cp -r /root/.openclaw/workspace/cloudflare_mc/* .
cp -r /root/.openclaw/workspace/cloudflare_mc/.* . 2>/dev/null || true

echo "🔧 Setting permissions..."
chmod +x deploy.sh
chmod +x update_cloudflare.py

echo "📝 Creating .gitignore..."
cat > .gitignore << EOF
# Cloudflare
wrangler.toml
.env
node_modules/

# Python
__pycache__/
*.pyc
.python-version

# Environment
.env.local
.env.development
.env.production
EOF

echo "📦 Committing files..."
git add .
git commit -m "Deploy Mission Control to Cloudflare" || echo "No changes to commit"

echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Files pushed to GitHub!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Go to Cloudflare Dashboard → Workers & Pages → Pages"
echo "2. Select your repository"
echo "3. Build command: (leave empty)"
echo "4. Build output directory: 'public'"
echo "5. Click 'Save and Deploy'"
echo ""
echo "🔧 After deployment:"
echo "1. Create KV namespace in Cloudflare"
echo "2. Update wrangler.toml with namespace ID"
echo "3. Set API_KEY in wrangler.toml"
echo "4. Add custom domain: mc.ruralhaven.co"
echo ""
echo "💻 VPS setup:"
echo "1. Set environment variable:"
echo "   export CLOUDFLARE_API_KEY='your-key'"
echo "2. Test: python3 update_cloudflare.py"
echo "3. Add to cron after daily brief generation"
echo ""
echo "🌐 Your site will be at: https://mc.ruralhaven.co"
echo ""
echo "📚 See README.md for detailed instructions"