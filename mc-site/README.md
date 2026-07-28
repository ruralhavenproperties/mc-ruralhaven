# Mission Control - Rural Haven

Professional trading, property analysis, and market intelligence dashboard deployed to Cloudflare Pages.

## **🌐 Live Site**
**URL:** `https://mc.ruralhaven.co` (after domain setup)
**Cloudflare Pages:** `https://mc-ruralhaven-co.pages.dev`

## **🚀 Features**

### **1. Home Dashboard**
- Market overview with real-time data
- Quick access to all tools
- System status monitoring
- Responsive design

### **2. Trading Dashboard**
- Real-time market data via Alpha Vantage
- Technical analysis (RSI, MACD, Bollinger Bands)
- Clickable symbol analysis
- Position tracking
- Trade scanning

### **3. Property Calculator**
- 8 investment strategies
- Full financial analysis (ROI, cash flow, cap rate)
- Save and compare deals
- Professional reports

### **4. Alpha Vantage Integration**
- Real-time stock quotes
- 50+ technical indicators
- Symbol search
- Rate limit aware

### **5. Dividend Analysis**
- Dividend stock research via Massive API
- Yield sorting and filtering
- Ex-date tracking
- Monthly payer identification

### **6. Full Mission Control**
- Sidebar navigation dashboard
- All tools integrated
- Professional layout
- System monitoring

### **7. API Documentation**
- Complete API reference
- Live endpoint testing
- Integration examples
- Rate limit information

## **🔧 Technology Stack**

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Cloudflare Workers (serverless)
- **APIs:** Alpha Vantage, Massive API
- **Hosting:** Cloudflare Pages (global CDN)
- **Domain:** `mc.ruralhaven.co`

## **🚀 Deployment**

### **Quick Deploy**
```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### **Manual Deployment**
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Cloudflare Pages
wrangler pages deploy . --project-name=mc-ruralhaven-co
```

### **Environment Variables**
Set in Cloudflare Dashboard → Pages → mc-ruralhaven-co → Settings → Environment variables:

1. `ALPHA_VANTAGE_KEY` = `7ZGPKCFPEHANTCLI`
2. `MASSIVE_API_KEY` = `IH6bmGOfgGSiiJBLuyCNWp5pMMX5d5NT`

## **📁 Project Structure**

```
mc_ruralhaven_co/
├── index.html                 # Home dashboard
├── trading/                   # Trading dashboard
│   └── index.html
├── property-calculator/       # Property calculator
│   └── index.html
├── alpha-vantage/            # Market data
│   └── index.html
├── dividends/                # Dividend analysis
│   └── index.html
├── mission-control/          # Full dashboard
│   └── index.html
├── api-docs/                 # API documentation
│   └── index.html
├── _worker.js                # Cloudflare Worker (API proxy)
├── wrangler.toml             # Cloudflare configuration
├── package.json              # Node.js dependencies
├── deploy.sh                 # Deployment script
└── README.md                 # This file
```

## **🔌 API Endpoints**

All APIs are accessible at `/api/*`:

- `GET /api/alpha/quote?symbol=SPY` - Stock quotes
- `GET /api/alpha/technical?symbol=SPY&indicator=RSI` - Technical indicators
- `GET /api/massive/dividends` - Dividend data
- `GET /api/market/overview` - Market overview
- `GET /api/system/status` - System status
- `GET /api/docs` - API documentation

## **🎯 Usage**

### **For Traders**
1. Open Trading Dashboard for real-time data
2. Use technical analysis tools
3. Track positions and scan for setups

### **For Property Investors**
1. Open Property Calculator
2. Analyze deals across 8 strategies
3. Save and compare multiple scenarios

### **For Researchers**
1. Use Alpha Vantage for market data
2. Analyze dividend stocks
3. Access all tools via Mission Control

### **For Developers**
1. Check API documentation
2. Integrate with your applications
3. Extend functionality with Cloudflare Workers

## **⚡ Performance**

- **Global CDN:** Cloudflare's 300+ locations
- **SSL/TLS:** Automatic HTTPS
- **DDoS Protection:** Built-in Cloudflare protection
- **Cache:** Edge caching for fast loads
- **Uptime:** 99.9%+ SLA

## **💰 Cost**

- **Cloudflare Pages:** Free (100k requests/day, 10GB bandwidth)
- **Alpha Vantage:** Free (5 calls/minute, 500/day)
- **Massive API:** Free tier
- **Total:** $0/month for current usage

## **🔒 Security**

- API keys stored server-side (Cloudflare environment variables)
- CORS enabled for web integration
- Rate limiting on Alpha Vantage endpoints
- HTTPS enforced
- No user data storage (stateless)

## **🚀 Roadmap**

### **Phase 1 (Complete)**
- [x] Basic dashboard structure
- [x] Trading dashboard integration
- [x] Property calculator
- [x] API proxy setup
- [x] Cloudflare deployment

### **Phase 2 (Next)**
- [ ] User authentication
- [ ] Data persistence (Supabase integration)
- [ ] Real-time alerts
- [ ] Mobile app (PWA)
- [ ] Advanced charting

### **Phase 3 (Future)**
- [ ] Trading automation
- [ ] Property deal pipeline
- [ ] Portfolio tracking
- [ ] Machine learning signals
- [ ] Team collaboration

## **🛠️ Development**

### **Local Development**
```bash
# Install dependencies
npm install

# Run local server
python3 -m http.server 8000
# Open http://localhost:8000
```

### **Testing APIs**
```bash
# Test Alpha Vantage
curl "https://mc.ruralhaven.co/api/alpha/quote?symbol=SPY"

# Test system status
curl "https://mc.ruralhaven.co/api/system/status"
```

### **Adding New Features**
1. Create new directory under root
2. Add `index.html` with your feature
3. Update navigation in main dashboard
4. Deploy with `./deploy.sh`

## **📞 Support**

- **Issues:** GitHub repository
- **Email:** nathan@ruralhaven.co
- **Documentation:** `/api-docs` page
- **Community:** Discord/Telegram (coming soon)

## **📄 License**

Proprietary - All rights reserved.

---

**Built with ❤️ for Rural Haven by Mission Control**