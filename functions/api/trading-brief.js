export async function onRequest(context) {
  // Get data from KV storage
  const kv = context.env.TRADING_KV;
  
  try {
    // Try to get latest trading brief from KV
    const latestBrief = await kv.get('latest_brief', 'json');
    
    if (latestBrief) {
      return new Response(JSON.stringify(latestBrief, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'max-age=300' // Cache for 5 minutes
        }
      });
    }
    
    // If no data in KV, return mock data
    return new Response(JSON.stringify(getMockData(), null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=60' // Cache for 1 minute
      }
    });
    
  } catch (error) {
    console.error('Error fetching trading brief:', error);
    
    // Return mock data on error
    return new Response(JSON.stringify(getMockData(), null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      status: 200
    });
  }
}

// Mock data for initial setup
function getMockData() {
  const now = new Date();
  return {
    date: now.toISOString().split('T')[0],
    generated: now.toISOString(),
    summary: "TRADING BRIEF - Mock Data\nMarkets: S&P 5250 (Bullish), VIX 15.5 (Low)\nTheme: AI momentum vs valuation concerns",
    market: {
      snp: { price: 5250.75, change: 0.85 },
      nasdaq: { price: 18350.25, change: 1.25 },
      vix: 15.5,
      sentiment: "Bullish",
      theme: "AI momentum vs valuation concerns"
    },
    commodities: [
      { symbol: "KC", name: "Coffee", price: 265.33, change: -1.2, weather_risk: 8 },
      { symbol: "SB", name: "Sugar", price: 22.45, change: 0.5, weather_risk: 4 },
      { symbol: "ZC", name: "Corn", price: 485.75, change: 0.3, weather_risk: 3 },
      { symbol: "ZS", name: "Soybeans", price: 1220.50, change: -0.8, weather_risk: 5 },
      { symbol: "OJ", name: "Orange Juice", price: 320.25, change: 2.1, weather_risk: 9 }
    ],
    equities: [
      { symbol: "AAPL", price: 215.50, change: 0.75, iv: 28 },
      { symbol: "NVDA", price: 950.25, change: 2.5, iv: 45 },
      { symbol: "TSLA", price: 185.75, change: -1.2, iv: 52 },
      { symbol: "AMD", price: 165.30, change: 1.8, iv: 38 },
      { symbol: "MSTR", price: 1850.50, change: 3.5, iv: 65 }
    ],
    top_trades: [
      {
        symbol: "KC",
        type: "PUT",
        strike: 265.33,
        premium: 1683,
        probability: 82.5,
        description: "Coffee PUT - Weather risk premium"
      },
      {
        symbol: "AMD",
        type: "CALL",
        strike: 170,
        premium: 850,
        probability: 65,
        description: "AMD CALL - AI momentum play"
      },
      {
        symbol: "OJ",
        type: "IRON_CONDOR",
        premium: 420,
        probability: 70,
        description: "Orange Juice - High IV premium sell"
      }
    ],
    weather_risk: [
      { commodity: "Coffee (KC)", risk: 8, reason: "Brazil frost concerns" },
      { commodity: "Orange Juice (OJ)", risk: 9, reason: "Florida drought" },
      { commodity: "Corn (ZC)", risk: 3, reason: "Normal conditions" },
      { commodity: "Sugar (SB)", risk: 4, reason: "Mild dryness" }
    ],
    iv_opportunities: [
      { symbol: "OJ", iv: 35, recommendation: "Premium selling" },
      { symbol: "KC", iv: 30, recommendation: "Weather plays" },
      { symbol: "NVDA", iv: 45, recommendation: "Wait for drop" }
    ],
    automation: {
      next_brief: "06:00 AM Central",
      last_scan: now.toISOString(),
      status: "active"
    }
  };
}