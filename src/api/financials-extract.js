// /api/ai/financials-extract
// Seller's trailing financial statement (T12 / T3 / T4 / any period) -> expense
// ratios and annualized figures, matching the exact contract the calculator
// (calculator.html) Paste Financials review + Apply step expects:
//   200 -> { fields: { grossIncome, totalExpenses, operatingExpenseRatioPct,
//                      annualizedGrossIncome, annualizedTotalExpenses,
//                      periodMonths, expenseLines[], extractionWarnings[] } }
//   not configured -> { error:'not_configured', message }
//
// Model/provider handling mirrors listing-extract.js: cheap OpenRouter model by
// default (gpt-oss-20b ~$0.03/$0.13 per 1M tokens), override with EXTRACTION_MODEL
// or switch provider via EXTRACTION_PROVIDER (openrouter|openai|deepseek).

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MAX_CHARS = 30000;
const DEFAULT_MODEL = "openai/gpt-oss-20b";

export async function handleFinancialsExtract(request, env) {
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
    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!text) {
      return json(400, { error: "Send {text} with the financial statement content." });
    }
    const fields = await extractFields(text.slice(0, MAX_CHARS), env, apiKey, provider);
    return json(200, { ok: true, fields });
  } catch (err) {
    return json(500, { ok: false, error: err.message || "Extraction failed." });
  }
}

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

async function extractViaCompletions(url, sourceText, apiKey, model, env, extraHeaders) {
  let payload = {
    model,
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: `Extract the operating statement data from the following seller financials.\n\n${sourceText}` },
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
    if (isCleanFields(fields)) {
      // Normalize: the front-end expects annualizedExpenses for the per-line breakdown.
      // Accept either name from the model and normalize to annualizedExpenses.
      const lines = Array.isArray(fields.annualizedExpenses)
        ? fields.annualizedExpenses
        : (Array.isArray(fields.expenseLines) ? fields.expenseLines : []);
      fields.annualizedExpenses = lines.map(l => ({ name: String(l.name || ""), amount: Number(l.amount) || 0 }));
      return fields;
    }

    payload = {
      ...payload,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are a data extraction API. Output ONE flat JSON object. Do NOT include reasoning, analysis, commentary, or arrays-as-toplevel — only the JSON object. Use these exact keys." },
        { role: "user", content: `Return ONLY a JSON object with these keys: ${JSON.stringify({
          propertyName: "", address: "", periodLabel: "", periodMonths: 0,
          grossIncome: 0, totalExpenses: 0, annualizedGrossIncome: 0,
          annualizedTotalExpenses: 0, operatingExpenseRatioPct: 0,
          annualizedExpenses: [], extractionWarnings: []
        })}\n\nExtract from: ${sourceText}` },
      ],
    };
  }
  throw new Error("Model returned unusable output after retry.");
}

function isCleanFields(fields) {
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) return false;
  if ("analysis" in fields || "commentary" in fields || "reasoning" in fields) return false;
  // Accept a flat object that carries at least one of our schema's signature keys.
  const KNOWN = ["periodMonths","grossIncome","totalExpenses","annualizedGrossIncome","annualizedTotalExpenses","operatingExpenseRatioPct","annualizedExpenses","expenseLines"];
  return KNOWN.some(k => k in fields);
}

function buildSystemPrompt() {
  return [
    "You extract operating-statement (T12 / trailing 12-month) data from a seller's financial statement, which may be pasted text, an Excel/CSV/Sheets dump, or a PDF extract.",
    "Return JSON only; no markdown fences.",
    "Use 0 for missing numeric values and empty string for missing text.",
    "Do NOT invent values. If a figure is absent, output 0.",
    "",
    "Identify the property from the statement header/title if present: propertyName is the property's own name (e.g. 'Maple Ridge Apartments'); address is the street address (e.g. '1200 Roosevelt St, Edmond, OK'). Leave empty strings if not present in the statement.",
    "",
    "Interpret mixed periods correctly: the statement may be for a partial period (T3, T4, 6 months, YTD). Report the period, then ANNUALIZE income and expenses to an equivalent 12-month trailing figure in the annualized* fields.",
    "grossIncome / totalExpenses should be the statement's own (as-reported) totals for the stated period.",
    "annualizedGrossIncome / annualizedTotalExpenses are the same figures scaled to 12 months (e.g. a 3-month statement of $25k gross income annualizes to $100k).",
    "operatingExpenseRatioPct = annualizedTotalExpenses / annualizedGrossIncome * 100.",
    "annualizedExpenses is an array of { name, amount } for every expense line item you can identify, scaled to the trailing-12-month equivalent (taxes, insurance, HOA, maintenance, management, utilities, reserves, etc.).",

    "",
    "Return exactly this JSON shape:",
    JSON.stringify(
      {
        propertyName: "",
        address: "",
        periodLabel: "",
        periodMonths: 0,
        grossIncome: 0,
        totalExpenses: 0,
        annualizedGrossIncome: 0,
        annualizedTotalExpenses: 0,
        operatingExpenseRatioPct: 0,
        annualizedExpenses: [],
        extractionWarnings: []
      },
      null,
      2
    ),
  ].join("\n");
}

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

function json(statusCode, payload) {
  return new Response(JSON.stringify(payload), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
}
