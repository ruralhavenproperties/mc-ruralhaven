# Mission Control - Cloudflare Deployment

Dynamic trading dashboard hosted on Cloudflare Pages with Workers API.

## 🚀 Quick Start

### 1. Push to GitHub
```bash
# Clone your repository
git clone https://github.com/yourusername/mc-ruralhaven.git
cd mc-ruralhaven

# Copy all files from this folder
cp -r /root/.openclaw/workspace/cloudflare_mc/* .

# Commit and push
git add .
git commit -m "Initial Mission Control deployment"
git push origin main
```

### 2. Cloudflare Setup

#### A. Create KV Namespace
1. Go to **Workers & Pages** → **KV**
2. Click **Create namespace**
3. Name: `TRADING_KV`
4. Copy the **Namespace ID**

#### B. Update Configuration
Edit `wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "TRADING_KV"
id = "YOUR_NAMESPACE_ID_HERE"  # ← Paste here

[vars]
API_KEY = "generate-a-secure-key-here"  # ← Change this
```

#### C. Deploy to Cloudflare Pages
1. Go to **Pages**
2. Select your repository
3. Build command: (leave empty)
4. Build output directory: `public`
5. Click **Deploy**

### 3. Custom Domain
1. Go to **Pages** → your project → **Custom domains**
2. Add `mc.ruralhaven.co`
3. Update DNS at your registrar

## 🔧 VPS Integration

### 1. Set API Key on VPS
```bash
# Add to ~/.bashrc or environment
export CLOUDFLARE_API_KEY="your-secure-key-from-wrangler.toml"
```

### 2. Test Connection
```bash
cd /root/.openclaw/workspace
python3 cloudflare_mc/update_cloudflare.py
```

### 3. Add to Cron (Daily Brief)
```bash
# Edit crontab
crontab -e

# Add after daily brief generation
0 11 * * * /usr/bin/python3 /root/.openclaw/workspace/simple_trading_dashboard.py && /usr/bin/python3 /root/.openclaw/workspace/cloudflare_mc/update_cloudflare.py
```

## 📁 Project Structure

```
mc-ruralhaven/
├── public/                    # Static website
│   ├── index.html            # Main dashboard
│   ├── trading.html          # Trading system
│   └── assets/               # CSS, JS, images
├── functions/                # Cloudflare Workers
│   └── api/
│       ├── trading-brief.js  # Get trading data
│       ├── status.js         # System status
│       └── update.js         # Update from VPS
├── wrangler.toml            # Cloudflare config
├── update_cloudflare.py     # VPS update script
└── README.md               # This file
```

## 🔌 API Endpoints

### GET `/api/trading-brief`
Returns latest trading data from KV storage.

**Response:**
```json
{
  "date": "2026-04-16",
  "market": { ... },
  "commodities": [ ... ],
  "top_trades": [ ... ]
}
```

### GET `/api/status`
Returns system status and limits.

### POST `/api/update`
Update trading data from VPS (requires API key).

**Headers:**
```
X-API-Key: your-secure-key
Content-Type: application/json
```

## 🛠️ Development

### Local Testing
```bash
# Install wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Start local dev server
wrangler pages dev public --kv TRADING_KV
```

### Update Website
1. Edit files in `public/`
2. Push to GitHub
3. Cloudflare auto-deploys

## 🔒 Security

### API Key Protection
- Store API key in `wrangler.toml` (not in repo)
- Use environment variables on VPS
- Rotate keys periodically

### CORS Configuration
- API allows all origins (`*`)
- For production, restrict to your domain

## 🚨 Troubleshooting

### KV Not Working
1. Check namespace ID in `wrangler.toml`
2. Verify KV is bound to Pages project
3. Check Worker logs in Cloudflare dashboard

### API Connection Failed
1. Verify `CLOUDFLARE_API_KEY` is set on VPS
2. Check if Worker is deployed
3. Test with curl:
   ```bash
   curl -X POST https://mc.ruralhaven.co/api/update \
     -H "X-API-Key: your-key" \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```

### Domain Not Working
1. Check DNS propagation (5-60 minutes)
2. Verify SSL certificate issued
3. Check Cloudflare proxy status (should be orange cloud)

## 📞 Support

For issues:
1. Check Cloudflare dashboard logs
2. Test API endpoints directly
3. Review Worker code in `functions/`

## 🎯 Features

- ✅ Real-time trading data
- ✅ Cloudflare KV storage
- ✅ Free hosting (Workers + Pages)
- ✅ Custom domain with SSL
- ✅ VPS automation integration
- ✅ Responsive design
- ✅ API endpoints

## 💰 Cost: $0/month

- Cloudflare Pages: Free
- Workers: 100K requests/day free
- KV: 1GB storage free
- Bandwidth: Unlimited free