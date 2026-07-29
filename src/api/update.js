export async function handleUpdate(request, env) {
  const kv = env.TRADING_KV;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const apiKey = request.headers.get('X-API-Key');
  const expectedKey = env.API_KEY;

  if (!expectedKey || apiKey !== expectedKey) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await request.json();
    const now = new Date();

    if (!data.date || !data.summary || !data.market) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const tradingBrief = {
      ...data,
      updated: now.toISOString(),
      source: 'vps_automation',
      version: '1.0'
    };

    await kv.put('latest_brief', JSON.stringify(tradingBrief));
    await kv.put('last_update', now.toISOString());

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
