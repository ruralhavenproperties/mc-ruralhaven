import { handleStatus } from "./api/status.js";
import { handleTradingBrief } from "./api/trading-brief.js";
import { handleUpdate } from "./api/update.js";
import { handleExtractImport } from "./api/extract-import.js";
import { handleListingExtract } from "./api/listing-extract.js";
import { handleFinancialsExtract } from "./api/financials-extract.js";
import { handleAiCoach } from "./api/ai-coach.js";
import { handleSellLead, handleListLeads } from "./api/sell-lead.js";
import { handleFitness } from "./api/fitness.js";
import { renderSellHomePage } from "./pages/sell-home.js";

// Hostnames that should keep serving the Mission Control dashboard
// (the existing static assets in /public). Everything else — i.e.
// the apex domain ruralhaven.co — gets the seller intake page instead.
const MISSION_CONTROL_HOSTS = new Set(["mc.ruralhaven.co"]);

// Allowed browser origins for cross-origin API calls (e.g. the back40
// calculator/wholesale pages calling the calc worker). Add/remove as needed.
const CORS_ORIGINS = new Set([
  "https://back40.ruralhaven.co",
  "https://calc.ruralhaven.co",
  "https://mc.ruralhaven.co",
  "https://mc-ruralhaven-co.pages.dev",
  "https://backforty-5c2.pages.dev",
]);

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const allow = CORS_ORIGINS.has(origin) ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function withCors(response, headers) {
  const h = new Headers(response.headers);
  for (const [k, v] of Object.entries(headers)) h.set(k, v);
  return new Response(response.body, { status: response.status, headers: h });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname.replace(/^www\./, "");
    const cors = corsHeaders(request);

    // Handle CORS preflight for our API routes.
    if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
      return new Response(null, { status: 204, headers: cors });
    }

    if (url.pathname === "/api/status") {
      return withCors(await handleStatus(request, env), cors);
    }
    if (url.pathname === "/api/trading-brief") {
      return withCors(await handleTradingBrief(request, env), cors);
    }
    if (url.pathname === "/api/update") {
      return withCors(await handleUpdate(request, env), cors);
    }
    if (url.pathname === "/api/extract-import") {
      return withCors(await handleExtractImport(request, env), cors);
    }
    if (url.pathname === "/api/ai/listing-extract") {
      return withCors(await handleListingExtract(request, env), cors);
    }
    if (url.pathname === "/api/ai/financials-extract") {
      return withCors(await handleFinancialsExtract(request, env), cors);
    }
    if (url.pathname === "/api/sell-lead") {
      return withCors(await handleSellLead(request, env), cors);
    }
    if (url.pathname === "/api/leads") {
      return withCors(await handleListLeads(request, env), cors);
    }

    const isMissionControlHost = MISSION_CONTROL_HOSTS.has(hostname);

    // Fitness tracker sync — only on the MC host (behind Cloudflare Access).
    if (url.pathname === "/api/fitness") {
      if (!isMissionControlHost) return new Response("Not found", { status: 404 });
      return withCors(await handleFitness(request, env), cors);
    }
    // Fitness coach chat — only on the MC host (behind Cloudflare Access);
    // proxies to OpenRouter with the server-side secret (no key in the browser).
    if (url.pathname === "/api/ai/coach") {
      if (!isMissionControlHost) return new Response("Not found", { status: 404 });
      return withCors(await handleAiCoach(request, env), cors);
    }

    if (!isMissionControlHost && (url.pathname === "/" || url.pathname === "/index.html")) {
      return new Response(renderSellHomePage(), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Private Back40 build-log spreadsheet. Served only with the right key
    // so it stays hidden from the public site. Access:
    //   https://mc.ruralhaven.co/back40-log?key=<API_KEY>
    if (url.pathname === "/back40-log") {
      const key = url.searchParams.get("key");
      if (!env.API_KEY || key !== env.API_KEY) {
        return new Response("Unauthorized", { status: 401 });
      }
      const res = await env.ASSETS.fetch(new Request(
        new URL("/Back40-Build-Log.xlsx", url).toString()
      ));
      return new Response(res.body, {
        status: res.status,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": 'attachment; filename="Back40-Build-Log.xlsx"',
        },
      });
    }

    return env.ASSETS.fetch(request);
  }
};

