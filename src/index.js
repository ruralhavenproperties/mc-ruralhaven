import { handleStatus } from "./api/status.js";
import { handleTradingBrief } from "./api/trading-brief.js";
import { handleUpdate } from "./api/update.js";
import { handleExtractImport } from "./api/extract-import.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

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

    return env.ASSETS.fetch(request);
  }
};
