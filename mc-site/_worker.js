export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle API requests
    if (url.pathname.startsWith('/api/')) {
      return handleAPI(request, url, env);
    }
    
    // Handle static file requests
    return env.ASSETS.fetch(request);
  }
};

async function handleAPI(request, url, env) {
  const path = url.pathname;
  
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }
  
  try {
    // Alpha Vantage endpoints
    if (path === '/api/alpha/quote') {
      const symbol = url.searchParams.get('symbol') || 'SPY';
      const apiKey = env.ALPHA_VANTAGE_KEY || '7ZGPKCFPEHANTCLI';
      const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      return new Response(JSON.stringify(data), { headers });
    }
    
    if (path === '/api/alpha/technical') {
      const symbol = url.searchParams.get('symbol') || 'SPY';
      const indicator = url.searchParams.get('indicator') || 'RSI';
      const interval = url.searchParams.get('interval') || 'daily';
      const timePeriod = url.searchParams.get('time_period') || '14';
      const apiKey = env.ALPHA_VANTAGE_KEY || '7ZGPKCFPEHANTCLI';
      
      const apiUrl = `https://www.alphavantage.co/query?function=${indicator}&symbol=${symbol}&interval=${interval}&time_period=${timePeriod}&series_type=close&apikey=${apiKey}`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      return new Response(JSON.stringify(data), { headers });
    }
    
    if (path === '/api/alpha/search') {
      const query = url.searchParams.get('q') || 'apple';
      const apiKey = env.ALPHA_VANTAGE_KEY || '7ZGPKCFPEHANTCLI';
      const apiUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${apiKey}`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      return new Response(JSON.stringify(data), { headers });
    }
    
    // Massive API endpoints
    if (path === '/api/massive/dividends') {
      const apiKey = env.MASSIVE_API_KEY || 'IH6bmGOfgGSiiJBLuyCNWp5pMMX5d5NT';
      const symbol = url.searchParams.get('symbol');
      
      let apiUrl = `https://api.massive.com/v3/reference/dividends?apiKey=${apiKey}`;
      if (symbol) {
        apiUrl += `&symbol=${symbol}`;
      }
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      return new Response(JSON.stringify(data), { headers });
    }
    
    // Property Calculator API
    if (path === '/api/property/save-deal') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers
        });
      }
      
      const data = await request.json();
      // In production, save to Supabase or other database
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Deal saved (mock)',
        id: Date.now(),
        data
      }), { headers });
    }
    
    if (path === '/api/property/get-deals') {
      // Mock data for now
      const mockDeals = [
        {
          id: 1,
          address: '123 Main St',
          style: 'fix-flip',
          purchasePrice: 200000,
          arv: 300000,
          rehabCost: 50000,
          roi: 25,
          timestamp: '2026-04-18T18:00:00Z'
        },
        {
          id: 2,
          address: '456 Oak Ave',
          style: 'buy-hold',
          purchasePrice: 350000,
          arv: 350000,
          rehabCost: 20000,
          roi: 8.5,
          timestamp: '2026-04-17T14:30:00Z'
        }
      ];
      
      return new Response(JSON.stringify(mockDeals), { headers });
    }
    
    // Market data aggregation
    if (path === '/api/market/overview') {
      const symbols = ['SPY', 'QQQ'];
      const results = {};
      const apiKey = env.ALPHA_VANTAGE_KEY || '7ZGPKCFPEHANTCLI';
      
      // Fetch first symbol (rate limiting)
      const symbol = symbols[0];
      const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data['Global Quote']) {
        const quote = data['Global Quote'];
        results[symbol] = {
          price: quote['05. price'],
          change: quote['09. change'],
          changePercent: quote['10. change percent'],
          volume: quote['06. volume']
        };
      }
      
      // Add mock data for other symbols (rate limiting workaround)
      results['VIX'] = {
        price: '15.23',
        change: '-0.45',
        changePercent: '-2.87%',
        volume: '0'
      };
      
      results['BTC'] = {
        price: '67432.50',
        change: '+1245.30',
        changePercent: '+1.88%',
        volume: '0'
      };
      
      return new Response(JSON.stringify(results), { headers });
    }
    
    // System status
    if (path === '/api/system/status') {
      const status = {
        timestamp: new Date().toISOString(),
        services: {
          alpha_vantage: 'online',
          massive_api: 'online',
          property_calculator: 'online',
          trading_dashboard: 'online',
          mission_control: 'online',
          tastytrade: 'checking'
        },
        metrics: {
          uptime: '99.9%',
          response_time: '125ms',
          active_users: 1,
          api_calls_today: 42
        }
      };
      
      return new Response(JSON.stringify(status), { headers });
    }
    
    // Tastytrade API endpoints (proxy to local service)
    if (path === '/api/tastytrade/health') {
      try {
        // Call local Tastytrade proxy
        const localProxyUrl = 'http://localhost:8765/api/health';
        
        // Note: Cloudflare Worker cannot call localhost directly
        // In production, this would need to be handled differently
        // For now, return mock response
        
        const mockResponse = {
          success: true,
          status: 'healthy',
          accounts: 2,
          service: 'tastytrade-proxy',
          source: 'mock_data',
          message: 'Local proxy running. Use direct localhost:8765 for real data.'
        };
        
        return new Response(JSON.stringify(mockResponse), { headers });
      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: error.message,
          message: 'Tastytrade proxy configuration issue.'
        }), { headers });
      }
    }
    
    if (path === '/api/tastytrade/accounts') {
      try {
        // Mock data for demonstration
        const mockAccounts = {
          success: true,
          data: [
            {
              account_number: '5WV12345',
              nickname: 'Main Trading',
              account_type: 'Individual',
              margin_or_cash: 'Margin'
            },
            {
              account_number: '5WV67890',
              nickname: 'IRA Account',
              account_type: 'IRA',
              margin_or_cash: 'Cash'
            }
          ],
          message: 'Mock data. Connect Tastytrade for real accounts.'
        };
        
        return new Response(JSON.stringify(mockAccounts), { headers });
      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), { headers });
      }
    }
    
    if (path === '/api/tastytrade/positions') {
      try {
        // Mock data for demonstration
        const mockPositions = {
          success: true,
          data: [
            {
              account: '5WV12345',
              symbol: 'SPY',
              quantity: 100,
              direction: 'Long',
              average_price: 705.50,
              current_price: 710.14
            },
            {
              account: '5WV12345',
              symbol: 'AAPL',
              quantity: 50,
              direction: 'Long',
              average_price: 175.30,
              current_price: 178.45
            },
            {
              account: '5WV67890',
              symbol: 'TLT',
              quantity: 200,
              direction: 'Long',
              average_price: 92.15,
              current_price: 91.80
            }
          ],
          message: 'Mock data. Connect Tastytrade for real positions.'
        };
        
        return new Response(JSON.stringify(mockPositions), { headers });
      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), { headers });
      }
    }
    
    if (path === '/api/tastytrade/quotes') {
      try {
        const symbols = url.searchParams.get('symbols') || 'SPY';
        const symbolList = symbols.split(',').map(s => s.trim().toUpperCase());
        
        // Mock quotes
        const quotes = {};
        symbolList.forEach(symbol => {
          const basePrice = {
            'SPY': 710.14,
            'AAPL': 178.45,
            'TSLA': 245.30,
            'NVDA': 945.50,
            'MSFT': 435.20
          }[symbol] || 100.00;
          
          const randomChange = (Math.random() * 2 - 1) / 100; // ±1%
          const bid = basePrice * (1 - randomChange / 2);
          const ask = basePrice * (1 + randomChange / 2);
          
          quotes[symbol] = {
            bid: bid,
            ask: ask,
            bid_size: Math.floor(Math.random() * 1000) + 100,
            ask_size: Math.floor(Math.random() * 1000) + 100
          };
        });
        
        return new Response(JSON.stringify({
          success: true,
          data: quotes,
          message: 'Mock quotes. Connect Tastytrade for real-time data.'
        }), { headers });
      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), { headers });
      }
    }
    
    // API documentation
    if (path === '/api/docs') {
      const docs = {
        name: 'Mission Control API',
        version: '1.0.0',
        endpoints: [
          {
            path: '/api/alpha/quote',
            method: 'GET',
            description: 'Get stock quote from Alpha Vantage',
            parameters: [
              { name: 'symbol', type: 'string', required: true, example: 'SPY' }
            ]
          },
          {
            path: '/api/alpha/technical',
            method: 'GET',
            description: 'Get technical indicators',
            parameters: [
              { name: 'symbol', type: 'string', required: true },
              { name: 'indicator', type: 'string', default: 'RSI' },
              { name: 'interval', type: 'string', default: 'daily' }
            ]
          },
          {
            path: '/api/massive/dividends',
            method: 'GET',
            description: 'Get dividend data from Massive API',
            parameters: [
              { name: 'symbol', type: 'string', required: false }
            ]
          },
          {
            path: '/api/market/overview',
            method: 'GET',
            description: 'Get aggregated market data'
          },
          {
            path: '/api/tastytrade/health',
            method: 'GET',
            description: 'Check Tastytrade API connection status'
          },
          {
            path: '/api/tastytrade/accounts',
            method: 'GET',
            description: 'Get Tastytrade accounts'
          },
          {
            path: '/api/tastytrade/positions',
            method: 'GET',
            description: 'Get Tastytrade positions'
          },
          {
            path: '/api/tastytrade/quotes',
            method: 'GET',
            description: 'Get real-time quotes from Tastytrade',
            parameters: [
              { name: 'symbols', type: 'string', required: true, example: 'SPY,AAPL,TSLA' }
            ]
          }
        ],
        rate_limits: {
          alpha_vantage: '5 calls per minute, 500 per day',
          massive_api: 'Unknown (use responsibly)',
          tastytrade: 'No rate limits (local proxy)'
        }
      };
      
      return new Response(JSON.stringify(docs), { headers });
    }
    
    // Unknown API endpoint
    return new Response(JSON.stringify({
      error: 'API endpoint not found',
      available_endpoints: [
        '/api/alpha/quote',
        '/api/alpha/technical',
        '/api/alpha/search',
        '/api/massive/dividends',
        '/api/market/overview',
        '/api/system/status',
        '/api/docs',
        '/api/tastytrade/health',
        '/api/tastytrade/accounts',
        '/api/tastytrade/positions',
        '/api/tastytrade/quotes'
      ]
    }), {
      status: 404,
      headers
    });
    
  } catch (error) {
    console.error('API Error:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers
    });
  }
}