export async function handleStatus(request, env) {
  const kv = env.TRADING_KV;
  const now = new Date();

  try {
    const lastUpdate = await kv.get('last_update');

    const status = {
      status: "online",
      timestamp: now.toISOString(),
      services: {
        pages: { status: "online", region: "global" },
        workers: { status: "online", requests: "healthy" },
        kv: { status: "online", storage: "available" },
        vps: { status: "pending", last_sync: lastUpdate || "never" }
      },
      limits: {
        daily_requests: 100000,
        kv_reads: 100000,
        bandwidth: "unlimited"
      },
      deployment: {
        version: "1.0.0",
        environment: "production",
        region: "auto"
      }
    };

    return new Response(JSON.stringify(status, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=60'
      }
    });

  } catch (error) {
    console.error('Status check error:', error);

    const errorStatus = {
      status: "degraded",
      timestamp: now.toISOString(),
      error: error.message,
      services: {
        pages: { status: "online" },
        workers: { status: "online" },
        kv: { status: "error" },
        vps: { status: "unknown" }
      }
    };

    return new Response(JSON.stringify(errorStatus, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      status: 200
    });
  }
}
