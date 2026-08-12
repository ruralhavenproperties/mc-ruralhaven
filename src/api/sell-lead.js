// Handles submissions from the ruralhaven.co "sell your house" intake form.
// Leads are stored in the existing TRADING_KV namespace (no new KV needed)
// under `lead_<timestamp>_<rand>`, with an index list at `leads_index` so
// they're easy to page through from handleListLeads / the dashboard.

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function handleSellLead(request, env) {
  if (request.method !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  let data;
  try {
    data = await request.json();
  } catch (error) {
    return json(400, { ok: false, error: "Invalid request body." });
  }

  // Honeypot: real users never fill this hidden field in. Pretend success
  // so bots don't learn anything, but don't store it as a lead.
  if (data.company) {
    return json(200, { ok: true, message: "Thanks! We'll be in touch shortly." });
  }

  const name = String(data.name || "").trim();
  const contact = String(data.contact || "").trim();
  const address = String(data.address || "").trim();
  const details = String(data.details || "").trim();

  if (!name || !contact || !address) {
    return json(400, {
      ok: false,
      error: "Name, contact info, and property address are required.",
    });
  }
  if (name.length > 200 || contact.length > 200 || address.length > 300 || details.length > 5000) {
    return json(400, { ok: false, error: "One of the fields is too long." });
  }

  const now = new Date();
  const id = `lead_${now.getTime()}_${Math.random().toString(36).slice(2, 8)}`;
  const lead = {
    id,
    name,
    contact,
    address,
    details,
    submitted: now.toISOString(),
    source: "ruralhaven.co intake form",
    userAgent: request.headers.get("User-Agent") || "",
  };

  try {
    const kv = env.TRADING_KV;
    await kv.put(id, JSON.stringify(lead));

    const indexRaw = await kv.get("leads_index");
    const index = indexRaw ? JSON.parse(indexRaw) : [];
    index.unshift(id);
    await kv.put("leads_index", JSON.stringify(index.slice(0, 1000)));
  } catch (error) {
    console.error("Failed to store lead:", error);
    return json(500, {
      ok: false,
      error: "Could not save your submission. Please try again or contact us directly.",
    });
  }

  return json(200, { ok: true, message: "Thanks! We'll be in touch shortly." });
}

// GET /api/leads — simple protected endpoint to review submissions without
// digging through the Cloudflare KV dashboard. Requires the same X-API-Key
// used by /api/update.
export async function handleListLeads(request, env) {
  const apiKey = request.headers.get("X-API-Key");
  const expectedKey = env.API_KEY;
  if (!expectedKey || apiKey !== expectedKey) {
    return json(401, { ok: false, error: "Unauthorized" });
  }

  const kv = env.TRADING_KV;
  const indexRaw = await kv.get("leads_index");
  const ids = indexRaw ? JSON.parse(indexRaw) : [];

  const limit = Math.min(Number(new URL(request.url).searchParams.get("limit")) || 100, 500);
  const leads = [];
  for (const id of ids.slice(0, limit)) {
    const raw = await kv.get(id);
    if (raw) leads.push(JSON.parse(raw));
  }

  return json(200, { ok: true, count: leads.length, leads });
}
