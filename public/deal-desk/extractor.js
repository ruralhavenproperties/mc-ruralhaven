import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://fiolerxczexrlactcnck.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_rqwjWcAPiqtBUcXK_s277A_GJrDV9UM";
const EXTRACT_ENDPOINT = "/api/extract-import";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const importForm = document.getElementById("importForm");
const importStatus = document.getElementById("importStatus");

let isProcessingImports = false;

bootExtractionQueue();

function bootExtractionQueue() {
  importForm?.addEventListener("submit", () => {
    setTimeout(() => {
      void processPendingImports();
    }, 1200);
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      setTimeout(() => {
        void processPendingImports();
      }, 900);
    }
  });

  setTimeout(() => {
    void processPendingImports();
  }, 1200);
}

async function processPendingImports() {
  if (isProcessingImports) return;

  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;
  if (!user) return;

  isProcessingImports = true;
  let shouldRefreshWorkspace = false;

  try {
    while (true) {
      const { data: importRecord, error } = await supabase
        .from("deal_imports")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error || !importRecord) break;
      importStatus.textContent = `Extracting ${labelForImport(importRecord)}...`;

      const { error: processingError } = await supabase
        .from("deal_imports")
        .update({ status: "processing", updated_at: new Date().toISOString(), error_text: null })
        .eq("id", importRecord.id);

      if (processingError) {
        importStatus.textContent = `Could not start extraction: ${processingError.message}`;
        break;
      }

      try {
        const requestPayload = await buildExtractionPayload(importRecord);
        const response = await fetch(EXTRACT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestPayload)
        });

        const result = await response.json();
        if (!response.ok || !result.ok) {
          throw new Error(result.error || "Extraction failed.");
        }

        const draftDeal = normalizeExtractedDeal(result.extracted, importRecord);
        const { data: savedDeal, error: dealError } = await supabase
          .from("deals")
          .insert(dealToRecord(user.id, draftDeal))
          .select()
          .single();

        if (dealError) throw dealError;

        const extractedPayload = {
          ...result.extracted,
          source_summary: result.sourceSummary || "",
          extraction_warnings: result.warnings || []
        };

        const { error: updateError } = await supabase
          .from("deal_imports")
          .update({
            status: "ready",
            extracted_payload: extractedPayload,
            deal_id: savedDeal.id,
            error_text: null,
            updated_at: new Date().toISOString()
          })
          .eq("id", importRecord.id);

        if (updateError) throw updateError;

        shouldRefreshWorkspace = true;
        importStatus.textContent = `Imported ${labelForImport(importRecord)} into a draft deal.`;
      } catch (error) {
        await supabase
          .from("deal_imports")
          .update({
            status: "error",
            error_text: error.message,
            updated_at: new Date().toISOString()
          })
          .eq("id", importRecord.id);

        importStatus.textContent = `Could not extract ${labelForImport(importRecord)}: ${error.message}`;
      }
    }
  } finally {
    isProcessingImports = false;
    if (shouldRefreshWorkspace) {
      setTimeout(() => {
        window.location.reload();
      }, 600);
    }
  }
}

async function buildExtractionPayload(importRecord) {
  if (importRecord.source_type === "url") {
    return {
      sourceType: "url",
      sourceUrl: importRecord.source_url
    };
  }

  if (importRecord.source_type === "text") {
    return {
      sourceType: "text",
      rawText: importRecord.raw_text || ""
    };
  }

  const { data: fileRecord, error } = await supabase
    .from("deal_files")
    .select("*")
    .eq("import_id", importRecord.id)
    .limit(1)
    .maybeSingle();

  if (error || !fileRecord) {
    throw new Error("The uploaded PDF file record could not be found.");
  }

  const { data: fileBlob, error: downloadError } = await supabase.storage
    .from(fileRecord.bucket)
    .download(fileRecord.path);

  if (downloadError || !fileBlob) {
    throw new Error("The uploaded PDF could not be downloaded for extraction.");
  }

  const base64 = await blobToBase64(fileBlob);

  return {
    sourceType: "pdf",
    pdf: {
      filename: fileRecord.filename,
      mimeType: fileRecord.mime_type || "application/pdf",
      base64
    }
  };
}

function normalizeExtractedDeal(extracted, importRecord) {
  const payload = extracted || {};
  const assetType = normalizeAssetType(payload.asset_type);
  const units = assetType === "Single Family" ? 1 : Math.max(number(payload.units), 1);
  const name = payload.property_name || payload.address || readableSource(importRecord) || "Imported deal";
  const taxes = number(payload.annual_taxes);
  const insurance = number(payload.annual_insurance);
  const hoa = number(payload.annual_hoa);
  const annualCarryCosts = taxes + insurance + hoa;
  const notes = [
    payload.source_summary ? `Import summary: ${payload.source_summary}` : "",
    payload.description ? `Listing description: ${payload.description}` : "",
    payload.notes ? `Extraction notes: ${payload.notes}` : ""
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    id: crypto.randomUUID(),
    name,
    market: payload.market || payload.city_state || "",
    assetType,
    stage: "Lead",
    dealStrategy: normalizeStrategy(payload.suggested_strategy),
    financingType: "Bank Loan",
    units,
    purchasePrice: number(payload.purchase_price),
    monthlyRent: number(payload.monthly_rent),
    otherIncome: 0,
    expenseRatio: 40,
    vacancyRate: 5,
    capexRate: 5,
    rehabBudget: 0,
    downPaymentRate: 25,
    bankLtvRate: 75,
    sellerCarryRate: 0,
    pmlLoanRate: 0,
    loanAmount: 0,
    sellerCarryAmount: 0,
    acquisitionDownPaymentAmount: 0,
    closingCosts: 2,
    closingCostsMode: "percent",
    interestRate: 0,
    sellerInterestRate: 0,
    loanTermYears: 30,
    sellerTermYears: 5,
    holdYears: 10,
    afterRepairValue: number(payload.estimated_value || payload.list_price || payload.purchase_price),
    monthlyBuyerPayment: 0,
    buyerDownPayment: 0,
    balloonPayment: 0,
    saleCostsRate: 6,
    annualCarryCosts,
    carryCostGrowthRate: 0.5,
    notes,
    nextAction: "Review imported assumptions and confirm underwriting inputs",
    sourceUrl: importRecord.source_url || "",
    updatedAt: new Date().toISOString(),
    timeline: [
      {
        date: new Date().toISOString().slice(0, 10),
        text: `Imported from ${readableSource(importRecord)}`
      }
    ],
    comps: []
  };
}

function dealToRecord(userId, deal) {
  return {
    id: deal.id,
    user_id: userId,
    name: deal.name,
    market: deal.market,
    asset_type: deal.assetType,
    stage: deal.stage,
    deal_strategy: deal.dealStrategy,
    financing_type: deal.financingType,
    source_url: deal.sourceUrl || null,
    notes: deal.notes || "",
    next_action: deal.nextAction || "",
    payload: deal,
    updated_at: deal.updatedAt
  };
}

function normalizeAssetType(value) {
  const text = String(value || "").toLowerCase();
  if (text.includes("single")) return "Single Family";
  if (text.includes("multi")) return "Multifamily";
  if (text.includes("storage")) return "Storage";
  if (text.includes("retail")) return "Retail";
  if (text.includes("office")) return "Office";
  if (text.includes("industrial")) return "Industrial";
  if (text.includes("mixed")) return "Mixed Use";
  return "Single Family";
}

function normalizeStrategy(value) {
  const text = String(value || "").toLowerCase();
  if (text.includes("flip")) return "Flip";
  if (text.includes("slow")) return "Slow Flip";
  return "Rental Hold";
}

function readableSource(importRecord) {
  if (importRecord.source_url) {
    try {
      return new URL(importRecord.source_url).hostname.replace(/^www\./, "");
    } catch (_error) {
      return "listing URL";
    }
  }
  if (importRecord.source_type === "pdf") return "PDF";
  if (importRecord.source_type === "text") return "raw text";
  return "import";
}

function labelForImport(importRecord) {
  return readableSource(importRecord);
}

function number(value) {
  return Number(value) || 0;
}

async function blobToBase64(blob) {
  const buffer = await blob.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}
