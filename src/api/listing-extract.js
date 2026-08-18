// /api/ai/listing-extract
// Listing URL / pasted-text -> structured deal fields, matching the exact
// contract the calculators (calculator.html) and Wholesale (wholesale.html)
// already expect:
//   200 -> { fields: {...}, source: 'fetched_url'|'pasted_text', sourceSummary?, warnings? }
//   needsManualPaste -> { needsManualPaste:true, reason } (URL could not be fetched)
//   not configured   -> { error:'not_configured', message }
//
// URL fetching strategy (bot-scraping answer):
//   1. Direct fetch with a real browser User-Agent (works for many listing sites).
//   2. Fallback -> Jina Reader (https://r.jina.ai/<url>) which renders JS-heavy
//      pages (LandWatch, Land.com, LandAndFarm, MLS mirrors, LoopNet, Crexi) to
//      text. Jina requires an API key for datacenter IPs (our VPS AS20473 is
//      flagged), so JINA_API_KEY secret is required for the proxy path.
//   3. If both fail, return needsManualPaste so the user pastes raw text.

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const READER_PROXY_BASE = "https://r.jina.ai/";
const MAX_CHARS = 20000;
// Cheap default model via OpenRouter (~$0.03/$0.13 per 1M tokens). Override with
// EXTRACTION_MODEL, or switch providers via EXTRACTION_PROVIDER (openrouter|openai|deepseek).
const DEFAULT_MODEL = "openai/gpt-oss-20b";

export async function handleListingExtract(request, env) {
  if (request.method !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  const provider = String(env.EXTRACTION_PROVIDER || "openrouter").toLowerCase();
  const apiKey = provider === "openrouter"
    ? (env.OPENROUTER_API_KEY || env.OPENAI_API_KEY || env.DEEPSEEK_API_KEY)
    : (env.OPENAI_API_KEY || env.DEEPSEEK_API_KEY || env.OPENROUTER_API_KEY);
  if (!apiKey) {
    return json(500, { error: "not_configured", message: "AI extraction isn't configured yet (no OPENROUTER_API_KEY / OPENAI_API_KEY secret)." });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body." });
  }

  try {
    const hasUrl = typeof body.url === "string" && body.url.trim();
    const hasText = typeof body.text === "string" && body.text.trim();

    if (!hasUrl && !hasText) {
      return json(400, { error: "Send either {url} or {text}." });
    }

    let source;
    let sourceText = "";

    if (hasUrl) {
      const url = body.url.trim();
      try {
        const fetched = await fetchListingText(url, env);
        sourceText = fetched.text;
        source = fetched.viaProxy ? "fetched_url" : "fetched_url";
      } catch (e) {
        // Could not fetch the URL through any path -> ask the user to paste text.
        return json(200, {
          needsManualPaste: true,
          reason: `Couldn't fetch that URL automatically (${e.message}). Paste the listing's text directly instead.`,
        });
      }
      sourceText = `${sourceText}\n\nListing URL: ${url}`;
    } else {
      sourceText = body.text.trim();
      source = "pasted_text";
    }

    const fields = await extractFields(sourceText, env, apiKey, provider);
    return json(200, {
      ok: true,
      fields,
      source,
      sourceSummary: fields.sourceSummary || "",
      warnings: fields.extractionWarnings || [],
    });
  } catch (err) {
    return json(500, { ok: false, error: err.message || "Extraction failed." });
  }
}

// --- URL fetching -----------------------------------------------------------

async function fetchListingText(url, env) {
  // 1) Try a direct fetch with a real browser UA.
  const direct = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
    },
    redirect: "follow",
  });

  if (direct.ok) {
    const html = await direct.text();
    const text = htmlToText(html).slice(0, MAX_CHARS);
    if (text.trim().length > 80) {
      return { title: extractTitle(html), text, viaProxy: false };
    }
  }

  // 2) Fallback -> Jina Reader (renders JS-heavy sites). Requires an API key
  //    because Jina blocks anonymous queries from datacenter IPs.
  const jinaKey = env.JINA_API_KEY;
  if (!jinaKey) {
    throw new Error("JINA_API_KEY is not configured to fetch blocked listing sites");
  }

  const proxyRes = await fetch(`${READER_PROXY_BASE}${url}`, {
    headers: {
      Authorization: `Bearer ${jinaKey}`,
      accept: "text/plain",
      "x-no-cache": "true",
      "x-respond-with": "text",
    },
  });

  if (!proxyRes.ok) {
    throw new Error(
      `fetch failed (${direct.status}) and the reader proxy failed (${proxyRes.status}).`
    );
  }

  const proxyText = await proxyRes.text();
  const text = stripJinaBoilerplate(proxyText).slice(0, MAX_CHARS);
  return { title: "", text, viaProxy: true };
}

function stripJinaBoilerplate(t) {
  // Jina sometimes prefixes metadata; trim leading marker lines for cleaner prompt input.
  return String(t || "")
    .split("\n")
    .filter((line) => !/^(Title:|URL Source:|Markdown Content:|Image:)\s*$/i.test(line.trim()))
    .join("\n")
    .trim();
}

// --- Field extraction -------------------------------------------------------

async function extractFields(sourceText, env, apiKey, provider) {
  const model = env.EXTRACTION_MODEL || DEFAULT_MODEL;

  if (provider === "openrouter") {
    return extractViaCompletions(OPENROUTER_API_URL, sourceText, apiKey, model, env, {
      "HTTP-Referer": "https://ruralhaven.co",
      "X-Title": "Rural Haven Back40",
    });
  }
  if (provider === "openai") {
    return extractViaCompletions(OPENAI_API_URL, sourceText, apiKey, model, env, {});
  }
  if (provider === "deepseek") {
    return extractViaCompletions("https://api.deepseek.com/chat/completions", sourceText, apiKey, model, env, {});
  }
  throw new Error(`Unknown EXTRACTION_PROVIDER: ${provider}`);
}

// Generic OpenAI-compatible chat-completions call (covers OpenRouter, OpenAI,
// and DeepSeek — they all speak the same format) with JSON-mode where offered.
// Includes a repair retry: some cheap reasoning models occasionally leak
// chain-of-thought or return arrays; we detect that and force a strict retry.
async function extractViaCompletions(url, sourceText, apiKey, model, env, extraHeaders) {
  let payload = {
    model,
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: `Extract the real estate listing data from the following source.\n\n${sourceText}` },
    ],
  };

  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}`, ...extraHeaders }, body: JSON.stringify(payload) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error?.message || `Extraction failed (${res.status}).`);
    }
    const content = data.choices?.[0]?.message?.content || "";
    if (!content) throw new Error("Extraction returned no content.");

    const fields = parseJsonLoose(content);
    // Detect reasoning-bleed: a non-object, or an object/array that clearly isn't
    // our schema (e.g. reasoning dumps with analysis/commentary keys).
    if (isCleanFields(fields)) return fields;

    // Retry with an explicit strict instruction (no reasoning, no commentary).
    payload = {
      ...payload,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are a data extraction API. Output ONE flat JSON object matching the requested schema. Do not include reasoning, analysis, commentary, or arrays — only the JSON object." },
        { role: "user", content: `Output ONLY the JSON object for: ${sourceText}` },
      ],
    };
  }
  throw new Error("Model returned unusable output after retry.");
}

// True only when fields is a plain non-array object that resembles our schema
// (has listPrice key) and isn't a reasoning dump (analysis/commentary keys).
function isCleanFields(fields) {
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) return false;
  if ("analysis" in fields || "commentary" in fields) return false;
  return "listPrice" in fields || "lotAcres" in fields || "address" in fields;
}

// Field contract is deliberately land-aware AND covers the other asset types so
// the same endpoint serves every calculator mode (multifamily, storage, RV park,
// NNN, flip, SFH, napkin, slow flip, land).
function buildSystemPrompt() {
  return [
    "You extract structured real estate listing data from a page or pasted text.",
    "Return JSON only; no markdown fences.",
    "Use 0 for missing numeric values and empty string for missing text.",
    "Do NOT invent values. If a field is absent, output 0 or empty string.",
    "Support all property types: land/raw land/subdivision, multifamily, self-storage, RV park/campground, triple-net (NNN) commercial, single-family, fix-and-flip, and mixed.",
    "",
    "Return exactly this JSON shape:",
    JSON.stringify(
      {
        address: "",
        cityState: "",
        market: "",
        assetType: "",
        description: "",
        notes: "",
        // price & size
        listPrice: 0,
        purchasePrice: 0,
        pricePerAcre: 0,
        pricePerSf: 0,
        // land / lot
        lotAcres: 0,
        lotSqft: 0,
        zoning: "",
        utilitiesAvailable: "",
        landUse: "",
        // building
        sqft: 0,
        beds: 0,
        baths: 0,
        yearBuilt: 0,
        stories: 0,
        lotSqftForBuilding: 0,
        // income / units
        unitCount: 0,
        avgRentPerUnit: 0,
        estimatedRent: 0,
        occupancyPct: 0,
        capRate: 0,
        noi: 0,
        // RV-park specific
        rvSites: 0,
        rvMonthlySiteRent: 0,
        // NNN-specific
        nnnBaseRentPsf: 0,
        // listing / broker
        mlsNumber: "",
        brokerName: "",
        brokerPhone: "",
        brokerEmail: "",
        brokerageName: "",
        // extraction metadata
        sourceSummary: "",
        extractionWarnings: []
      },
      null,
      2
    ),
  ].join("\n");
}

// --- Helpers ----------------------------------------------------------------

function parseJsonLoose(text) {
  const cleaned = String(text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        /* fallthrough */
      }
    }
    throw new Error("Could not parse extracted JSON.");
  }
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>(.*?)<\/title>/i);
  return m ? decodeHtml(m[1]) : "";
}

function htmlToText(html) {
  return decodeHtml(
    String(html || "")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function decodeHtml(t) {
  return String(t || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function json(statusCode, payload) {
  return new Response(JSON.stringify(payload), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
}
