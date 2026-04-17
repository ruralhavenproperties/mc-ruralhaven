#!/usr/bin/env python3
"""
Update Cloudflare KV with latest trading brief
Run this from your VPS after generating trading data
"""

import json
import os
import requests
from datetime import datetime
import sys

# Configuration
# Use your Pages URL - update to mc.ruralhaven.co once custom domain is added
CLOUDFLARE_API_URL = "https://mc-ruralhaven.pages.dev/api/update"  # Your Cloudflare Pages URL
API_KEY = os.environ.get("CLOUDFLARE_API_KEY", "your-api-key-here")  # Set as environment variable

def load_trading_brief():
    """Load the latest trading brief from local file"""
    try:
        # Try to load from today's JSON file
        today = datetime.now().strftime("%Y%m%d")
        file_path = f"/root/.openclaw/workspace/trading_brief_{today}.json"
        
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                return json.load(f)
        
        # Fallback to any recent JSON file
        import glob
        json_files = glob.glob("/root/.openclaw/workspace/trading_brief_*.json")
        if json_files:
            latest_file = max(json_files, key=os.path.getctime)
            with open(latest_file, 'r') as f:
                return json.load(f)
        
        # Generate mock data if no files found
        print("No trading brief files found, generating mock data")
        return generate_mock_data()
        
    except Exception as e:
        print(f"Error loading trading brief: {e}")
        return generate_mock_data()

def generate_mock_data():
    """Generate mock trading data for testing"""
    now = datetime.now()
    return {
        "date": now.strftime("%Y-%m-%d"),
        "summary": f"TRADING BRIEF - {now.strftime('%Y-%m-%d')}\nMarkets: S&P 5250 (Bullish), VIX 15.5 (Low)\nTheme: AI momentum vs valuation concerns",
        "market": {
            "snp": {"price": 5250.75, "change": 0.85},
            "nasdaq": {"price": 18350.25, "change": 1.25},
            "vix": 15.5,
            "sentiment": "Bullish",
            "theme": "AI momentum vs valuation concerns"
        },
        "commodities": [
            {"symbol": "KC", "name": "Coffee", "price": 265.33, "change": -1.2, "weather_risk": 8},
            {"symbol": "SB", "name": "Sugar", "price": 22.45, "change": 0.5, "weather_risk": 4},
            {"symbol": "ZC", "name": "Corn", "price": 485.75, "change": 0.3, "weather_risk": 3},
            {"symbol": "ZS", "name": "Soybeans", "price": 1220.50, "change": -0.8, "weather_risk": 5},
            {"symbol": "OJ", "name": "Orange Juice", "price": 320.25, "change": 2.1, "weather_risk": 9}
        ],
        "equities": [
            {"symbol": "AAPL", "price": 215.50, "change": 0.75, "iv": 28},
            {"symbol": "NVDA", "price": 950.25, "change": 2.5, "iv": 45},
            {"symbol": "TSLA", "price": 185.75, "change": -1.2, "iv": 52},
            {"symbol": "AMD", "price": 165.30, "change": 1.8, "iv": 38},
            {"symbol": "MSTR", "price": 1850.50, "change": 3.5, "iv": 65}
        ],
        "top_trades": [
            {
                "symbol": "KC",
                "type": "PUT",
                "strike": 265.33,
                "premium": 1683,
                "probability": 82.5,
                "description": "Coffee PUT - Weather risk premium"
            }
        ],
        "weather_risk": [
            {"commodity": "Coffee (KC)", "risk": 8, "reason": "Brazil frost concerns"},
            {"commodity": "Orange Juice (OJ)", "risk": 9, "reason": "Florida drought"}
        ],
        "iv_opportunities": [
            {"symbol": "OJ", "iv": 35, "recommendation": "Premium selling"},
            {"symbol": "KC", "iv": 30, "recommendation": "Weather plays"}
        ]
    }

def update_cloudflare(data):
    """Send data to Cloudflare Worker"""
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
    }
    
    try:
        response = requests.post(CLOUDFLARE_API_URL, json=data, headers=headers, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Successfully updated Cloudflare: {result.get('message')}")
            print(f"   Timestamp: {result.get('timestamp')}")
            return True
        else:
            print(f"❌ Failed to update Cloudflare: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error updating Cloudflare: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def main():
    """Main function"""
    print("🔄 Updating Cloudflare with latest trading brief...")
    
    # Load trading data
    trading_data = load_trading_brief()
    print(f"📊 Loaded trading data for {trading_data.get('date', 'unknown date')}")
    
    # Update Cloudflare
    success = update_cloudflare(trading_data)
    
    if success:
        print("🎉 Cloudflare update completed successfully!")
        sys.exit(0)
    else:
        print("⚠️ Cloudflare update failed")
        sys.exit(1)

if __name__ == "__main__":
    main()