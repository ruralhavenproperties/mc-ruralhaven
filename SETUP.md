# Mission Control Cloudflare Setup Guide

## Prerequisites

1. **Cloudflare Account** with access to:
   - Workers & Pages
   - KV (Key-Value Store)
   - DNS (for custom domain)

2. **GitHub Account** with repository access

3. **VPS** with:
   - Python 3.8+
   - `requests` library (`pip install requests`)
   - OpenClaw trading system (for data generation)

## Step 1: Cloudflare Configuration

### A. Create KV Namespace
1. Go to **Workers & Pages** → **KV**
2. Click **Create namespace**
3. Name: `TRADING_KV`
4. Copy the **Namespace ID** (format: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### B. Get Zone ID
1. Go to **DNS** → **Records**
2. Copy the **Zone ID** from the right sidebar

### C. Generate API Key
Generate a secure random string for API authentication:
```bash
openssl rand -hex 32
# or use: python3 -c "import secrets; print(secrets.token_hex(32))"
```

## Step 2: Update Configuration

Edit `wrangler.toml` with your values:

```toml
[[kv_namespaces]]
binding = "TRADING_KV"
id = "YOUR_NAMESPACE_ID_HERE"  # ← Paste here

[vars]
API_KEY = "your-secure-api-key-here"  # ← Change this

[env.production]
zone_id = "your-zone-id-here"  # Your Cloudflare zone ID
routes = [
  { pattern = "mc.ruralhaven.co", custom_domain = true }
]
```

## Step 3: Deploy to Cloudflare Pages

1. Go to **Pages**
2. Select **Create project** → **Connect to Git**
3. Select your repository
4. Configure:
   - **Build command**: (leave empty)
   - **Build output directory**: `public`
5. Click **Save and Deploy**

## Step 4: VPS Setup

### A. Set Environment Variable
```bash
# Add to ~/.bashrc
export CLOUDFLARE_API_KEY="your-secure-api-key-here"

# Reload
source ~/.bashrc
```

### B. Test Connection
```bash
cd /path/to/mc-ruralhaven
python3 update_cloudflare.py
```

### C. Add to Cron (After Daily Brief)
Edit crontab: `crontab -e`
```bash
# Run after daily market brief generation (adjust timing as needed)
0 11 * * * /usr/bin/python3 /root/.openclaw/workspace/simple_trading_dashboard.py && /usr/bin/python3 /path/to/mc-ruralhaven/update_cloudflare.py
```

## Step 5: Custom Domain

1. Go to **Pages** → your project → **Custom domains**
2. Add `mc.ruralhaven.co`
3. Update DNS at your registrar:
   - Type: CNAME
   - Name: mc.ruralhaven.co
   - Target: your-project.pages.dev
   - Proxy: Enabled (orange cloud)

## Verification

1. **Check website**: https://mc.ruralhaven.co
2. **Check API**: https://mc.ruralhaven.co/api/status
3. **Test update**: Run `python3 update_cloudflare.py` on VPS
4. **Verify data**: Visit https://mc.ruralhaven.co/api/trading-brief

## Troubleshooting

### KV Not Working
- Check namespace ID in `wrangler.toml`
- Verify KV is bound to Pages project
- Check Worker logs in Cloudflare dashboard

### API Connection Failed
- Verify `CLOUDFLARE_API_KEY` is set on VPS
- Check if Worker is deployed
- Test with curl:
  ```bash
  curl -X POST https://mc.ruralhaven.co/api/update \
    -H "X-API-Key: your-key" \
    -H "Content-Type: application/json" \
    -d '{"test": true}'
  ```

### Domain Not Working
- Check DNS propagation (5-60 minutes)
- Verify SSL certificate issued
- Check Cloudflare proxy status (should be orange cloud)

## Security Notes

1. **API Key**: Rotate periodically
2. **KV Access**: Only this Worker can access
3. **CORS**: Configured for all origins (`*`); restrict for production
4. **Environment Variables**: Store secrets in `wrangler.toml` or environment

## Support

For issues:
1. Check Cloudflare dashboard logs
2. Test API endpoints directly
3. Review Worker code in `functions/`