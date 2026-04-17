export async function onRequest(context) {
  const request = context.request;
  const kv = context.env.TRADING_KV;
  
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Check for API key (simple auth)
  const apiKey = request.headers.get('X-API-Key');
  const expectedKey = context.env.API_KEY;
  
  if (!expectedKey || apiKey !== expectedKey) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Parse the incoming data
    const data = await request.json();
    const now = new Date();
    
    // Validate required fields
    if (!data.date || !data.summary || !data.market) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Add metadata
    const tradingBrief = {
      ...data,
      updated: now.toISOString(),
      source: 'vps_automation',
      version: '1.0'
    };
    
    // Store in KV
    await kv.put('latest_brief', JSON.stringify(tradingBrief));
    await kv.put('last_update', now.toISOString());
    
    // Also store historical data (last 7 days)
    const historyKey = `history_${data.date.replace(/-/g, '')}`;
    await kv.put(historyKey, JSON.stringify(tradingBrief));
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Trading brief updated successfully',
      timestamp: now.toISOString(),
      stored_keys: ['latest_brief', 'last_update', historyKey]
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Update error:', error);
    
    return new Response(JSON.stringify({
      error: 'Failed to update trading brief',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}