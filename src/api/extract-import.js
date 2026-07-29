// Ported from Property OS's Netlify extract-import function, then from a
// Cloudflare Pages Function, to a plain Worker route so listing import
// (LOI/deal intake) keeps working when Deal Desk is served from this Worker.
const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const READER_PROXY_URL = "https://r.jina.ai/";
const DEFAULT_EXTRACTION_PROVIDER = "openai";

export async function handleExtractImport(request, env) {
  if (request.method !== "POST") {
    return json(405, { ok: false, error: "Method not allowed." });
  }

  const provider = getExtractionProvider(env);

  const configError = validateProviderConfig(provider, env);
  if (configError) {
    return json(500, { ok: false, error: configError });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const sourceType = body.sourceType;

    if (!["url", "text", "pdf"].includes(sourceType)) {
      return json(400, { ok: false, error: "Unsupported source type." });
    }

    const outputText = await runExtraction(body, provider, env);

    const extracted = JSON.parse(outputText);
    return json(200, {
      ok: true,
      extracted,
      sourceSummary: extracted.source_summary || "",
      warnings: extracted.extraction_warnings || []
    });
  } catch (error) {
    return json(500, { ok: false, error: error.message || "Extraction failed." });
  }
}

async function runExtraction(body, provider, env) {
  if (provider === "ollama") {
    return runOllamaExtraction(body, env);
  }

  return runOpenAiExtraction(body, env);
}

async function runOpenAiExtraction(body, env) {
  const content = await buildSourceContent(body, "openai");
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || "gpt-4o-mini",
      text: {
        format: {
          type: "json_object"
        }
      },
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: buildSystemPrompt() }]
        },
        {
          role: "user",
          content
        }
      ]
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "OpenAI extraction failed.");
  }

  const outputText = extractOutputText(data);
  if (!outputText) {
    throw new Error("OpenAI returned no extracted content.");
  }

  return outputText;
}

async function runOllamaExtraction(body, env) {
  if (body.sourceType === "pdf") {
    throw new Error("PDF extraction is not supported with the Ollama fallback yet. Use OpenAI for PDFs or paste raw text.");
  }

  const baseUrl = String(env.OLLAMA_BASE_URL || "http://127.0.0.1:11434/api").replace(/\/$/, "");
  const content = await buildSourceContent(body, "ollama");
  const prompt = [
    buildSystemPrompt(),
    "",
    flattenPromptContent(content),
    "",
    buildJsonContract()
  ].join("\n");

  const headers = {
    "Content-Type": "application/json"
  };

  if (env.OLLAMA_API_KEY) {
    headers.Authorization = `Bearer ${env.OLLAMA_API_KEY}`;
  }

  const response = await fetch(`${baseUrl}/generate`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: env.OLLAMA_MODEL || "gemma3",
      prompt,
      stream: false,
      format: "json"
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Ollama extraction failed.");
  }

  if (typeof data.response !== "string" || !data.response.trim()) {
    throw new Error("Ollama returned no extracted content.");
  }

  return data.response;
}

async function buildSourceContent(body, provider) {
  const content = [];

  if (body.sourceType === "url") {
    const fetched = await fetchListingText(body.sourceUrl);
    content.push({
      type: "input_text",
      text: [
        `Listing URL: ${body.sourceUrl}`,
        `Fetched page title: ${fetched.title || ""}`,
        "Fetched source text:",
        fetched.text
      ].join("\n\n")
    });
  } else if (body.sourceType === "text") {
    content.push({
      type: "input_text",
      text: `Extract a real estate listing from this pasted text:\n\n${body.rawText || ""}`
    });
  } else if (body.sourceType === "pdf") {
    if (provider !== "openai") {
      throw new Error("This extraction provider does not support PDF intake yet.");
    }

    content.push({
      type: "input_file",
      filename: body.pdf.filename || "listing.pdf",
      file_data: body.pdf.base64
    });
    content.push({
      type: "input_text",
      text: "Extract the property and listing data from this PDF."
    });
  }

  content.push({
    type: "input_text",
    text: buildJsonContract()
  });

  return content;
}

function buildSystemPrompt() {
  return [
    "You extract structured real estate deal data from listing sources.",
    "Return JSON only.",
    "Use null or 0 for missing numeric values.",
    "Favor conservative extraction and do not invent values.",
    "Support listing sites like Zillow, Crexi, Realtor, Redfin, LoopNet, MLS mirrors, broker pages, and uploaded offering PDFs.",
    "Fields should describe the property and listing, not speculative underwriting assumptions."
  ].join(" ");
}

function buildJsonContract() {
  return [
    "Return a JSON object with these fields:",
    "{",
    '  "property_name": string,',
    '  "address": string,',
    '  "city_state": string,',
    '  "market": string,',
    '  "asset_type": string,',
    '  "units": number,',
    '  "purchase_price": number,',
    '  "list_price": number,',
    '  "monthly_rent": number,',
    '  "annual_taxes": number,',
    '  "annual_insurance": number,',
    '  "annual_hoa": number,',
    '  "estimated_value": number,',
    '  "suggested_strategy": string,',
    '  "description": string,',
    '  "source_summary": string,',
    '  "notes": string,',
    '  "extraction_warnings": array',
    "}",
    "If a field is unavailable, return an empty string, 0, or [] as appropriate."
  ].join("\n");
}

function flattenPromptContent(content) {
  return content
    .map((part) => part.text || "")
    .filter(Boolean)
    .join("\n\n");
}

function getExtractionProvider(env) {
  return String(env.EXTRACTION_PROVIDER || DEFAULT_EXTRACTION_PROVIDER)
    .trim()
    .toLowerCase();
}

function validateProviderConfig(provider, env) {
  if (provider === "ollama") {
    return env.OLLAMA_BASE_URL
      ? ""
      : "OLLAMA_BASE_URL is not set. Point it at a reachable Ollama API endpoint.";
  }

  if (env.OPENAI_API_KEY) {
    return "";
  }

  return "OPENAI_API_KEY is not set in this Worker's environment variables.";
}

async function fetchListingText(url) {
  const directResponse = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      accept: "text/html,application/xhtml+xml"
    }
  });

  if (directResponse.ok) {
    const html = await directResponse.text();
    return {
      title: extractTitle(html),
      text: htmlToText(html).slice(0, 18000)
    };
  }

  const proxyResponse = await fetch(`${READER_PROXY_URL}${url}`, {
    headers: {
      accept: "text/plain",
      "x-no-cache": "true"
    }
  });

  if (!proxyResponse.ok) {
    throw new Error(`Could not fetch listing URL (${directResponse.status}) and proxy fallback failed (${proxyResponse.status}). Try raw text or PDF for this site.`);
  }

  const proxyText = await proxyResponse.text();
  return {
    title: "",
    text: proxyText.slice(0, 18000)
  };
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>(.*?)<\/title>/i);
  return match ? decodeHtml(match[1]) : "";
}

function htmlToText(html) {
  return decodeHtml(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function decodeHtml(text) {
  return String(text || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractOutputText(data) {
  if (typeof data.output_text === "string" && data.output_text) {
    return data.output_text;
  }

  const outputs = Array.isArray(data.output) ? data.output : [];
  for (const item of outputs) {
    const content = Array.isArray(item.content) ? item.content : [];
    for (const part of content) {
      if (part.type === "output_text" && part.text) {
        return part.text;
      }
    }
  }

  return "";
}

function json(statusCode, payload) {
  return new Response(JSON.stringify(payload), {
    status: statusCode,
    headers: { "Content-Type": "application/json" }
  });
}
