// /api/ai/coach
// Fitness coach chat proxy (fitness.html). The browser never sees an API key:
// the page posts { model, messages, temperature } here and this handler
// forwards to OpenRouter with the OPENROUTER_API_KEY Worker secret, returning
// OpenRouter's JSON response unchanged so the page's existing parsing works.

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "inclusionai/ling-3.0-flash";

export async function handleAiCoach(request, env) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }
  const apiKey = env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "not_configured", message: "Coach isn't configured yet (no OPENROUTER_API_KEY secret)." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "bad_request", message: "Expected JSON body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!Array.isArray(body.messages) || !body.messages.length) {
    return new Response(JSON.stringify({ error: "bad_request", message: "messages[] is required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const upstream = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey,
    },
    body: JSON.stringify({
      model: typeof body.model === "string" && body.model ? body.model : DEFAULT_MODEL,
      messages: body.messages,
      temperature: typeof body.temperature === "number" ? body.temperature : 0.4,
    }),
  });
  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
