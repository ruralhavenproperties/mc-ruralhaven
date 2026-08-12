import { handleStatus } from "./api/status.js";
import { handleTradingBrief } from "./api/trading-brief.js";
import { handleUpdate } from "./api/update.js";
import { handleExtractImport } from "./api/extract-import.js";
import { handleSellLead, handleListLeads } from "./api/sell-lead.js";
import { renderSellHomePage } from "./pages/sell-home.js";

// Hostnames that should keep serving the Mission Control dashboard
// (the existing static assets in /public). Everything else — i.e.
// the apex domain ruralhaven.co — gets the seller intake page instead.
const MISSION_CONTROL_HOSTS = new Set(["mc.ruralhaven.co"]);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname.replace(/^www\./, "");

    if (url.pathname === "/api/status") {
      return handleStatus(request, env);
    }
    if (url.pathname === "/api/trading-brief") {
      return handleTradingBrief(request, env);
    }
    if (url.pathname === "/api/update") {
      return handleUpdate(request, env);
    }
    if (url.pathname === "/api/extract-import") {
      return handleExtractImport(request, env);
    }
    if (url.pathname === "/api/sell-lead") {
      return handleSellLead(request, env);
    }
    if (url.pathname === "/api/leads") {
      return handleListLeads(request, env);
    }

    const isMissionControlHost = MISSION_CONTROL_HOSTS.has(hostname);
    if (!isMissionControlHost && (url.pathname === "/" || url.pathname === "/index.html")) {
      return new Response(renderSellHomePage(), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return env.ASSETS.fetch(request);
  }
};

