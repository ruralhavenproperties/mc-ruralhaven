// Fitness tracker server-side sync (per profile).
//   GET /api/fitness?profile=nathan  -> stored JSON (or {})
//   PUT /api/fitness?profile=nathan  -> store JSON body
// Only reachable on the Mission Control host (mc.ruralhaven.co), which is
// behind Cloudflare Access, so personal fitness data stays private.
const PROFILES = ["nathan", "luke", "jacob"];

export async function handleFitness(request, env) {
  const url = new URL(request.url);
  const profile = url.searchParams.get("profile");
  if (!PROFILES.includes(profile)) {
    return new Response(JSON.stringify({ error: "Missing or invalid profile" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const key = "fitness_" + profile;

  if (request.method === "GET") {
    const raw = await env.TRADING_KV.get(key);
    return new Response(raw || "{}", {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (request.method === "PUT") {
    const body = await request.text();
    if (!body || body.length > 500_000) {
      return new Response(JSON.stringify({ error: "Body too large" }), { status: 413 });
    }
    try {
      JSON.parse(body);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
    }
    await env.TRADING_KV.put(key, body);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
}
