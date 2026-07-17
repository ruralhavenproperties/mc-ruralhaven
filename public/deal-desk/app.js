import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://fiolerxczexrlactcnck.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_rqwjWcAPiqtBUcXK_s277A_GJrDV9UM";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const sampleDeals = [
  {
    id: crypto.randomUUID(),
    name: "Maple Court Apartments",
    market: "Kansas City, MO",
    assetType: "Multifamily",
    stage: "Underwriting",
    dealStrategy: "Rental Hold",
    financingType: "Bank Loan",
    units: 18,
    purchasePrice: 1750000,
    monthlyRent: 19750,
    otherIncome: 900,
    expenseRatio: 42,
    vacancyRate: 6,
    capexRate: 7,
    rehabBudget: 180000,
    downPaymentRate: 25,
    bankLtvRate: 75,
    sellerCarryRate: 0,
    pmlLoanRate: 0,
    loanAmount: 0,
    sellerCarryAmount: 0,
    acquisitionDownPaymentAmount: 0,
    closingCosts: 0,
    closingCostsMode: "percent",
    interestRate: 6.4,
    sellerInterestRate: 0,
    loanTermYears: 30,
    sellerTermYears: 5,
    holdYears: 5,
    afterRepairValue: 2125000,
    monthlyBuyerPayment: 0,
    buyerDownPayment: 0,
    balloonPayment: 0,
    saleCostsRate: 6,
    annualCarryCosts: 0,
    carryCostGrowthRate: 0.5,
    notes: "Seller is motivated after previous buyer retraded. Roof was replaced in 2021, interiors still need heavy turns.",
    nextAction: "Call broker about trailing 12 utility costs",
    sourceUrl: "",
    updatedAt: new Date().toISOString(),
    timeline: [
      { date: "2026-04-08", text: "Broker OM imported and rent roll reviewed." },
      { date: "2026-04-09", text: "Initial walkthrough notes added." }
    ],
    comps: [
      { name: "Oak Terrace", ppu: 94000, capRate: 6.1, distance: "1.2 mi" },
      { name: "The Benton", ppu: 101000, capRate: 5.8, distance: "2.5 mi" }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "Pine Street Duplex",
    market: "Tulsa, OK",
    assetType: "Single Family",
    stage: "LOI",
    dealStrategy: "Slow Flip",
    financingType: "Seller Financing",
    units: 2,
    purchasePrice: 345000,
    monthlyRent: 0,
    otherIncome: 0,
    expenseRatio: 0,
    vacancyRate: 0,
    capexRate: 0,
    rehabBudget: 22000,
    downPaymentRate: 12,
    bankLtvRate: 0,
    sellerCarryRate: 88,
    pmlLoanRate: 0,
    loanAmount: 0,
    sellerCarryAmount: 0,
    acquisitionDownPaymentAmount: 15000,
    closingCosts: 1.75,
    closingCostsMode: "percent",
    interestRate: 0,
    sellerInterestRate: 6.5,
    loanTermYears: 1,
    sellerTermYears: 8,
    holdYears: 5,
    afterRepairValue: 455000,
    monthlyBuyerPayment: 2850,
    buyerDownPayment: 28000,
    balloonPayment: 245000,
    saleCostsRate: 3,
    annualCarryCosts: 5400,
    carryCostGrowthRate: 0.5,
    notes: "Structured as a slow flip candidate with seller carry in and buyer note out.",
    nextAction: "Stress test buyer payment and balloon assumptions",
    sourceUrl: "",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    timeline: [
      { date: "2026-04-05", text: "Seller open to carrying paper with 8 year term." },
      { date: "2026-04-09", text: "Buyer note assumptions penciled into deal sheet." }
    ],
    comps: [
      { name: "Cherry Duplex", ppu: 169000, capRate: 6.4, distance: "0.8 mi" },
      { name: "Briar Twinhome", ppu: 175500, capRate: 6.0, distance: "1.7 mi" }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: "Riverside Shops",
    market: "Omaha, NE",
    assetType: "Retail",
    stage: "Lead",
    dealStrategy: "Flip",
    financingType: "Cash",
    units: 6,
    purchasePrice: 2280000,
    monthlyRent: 0,
    otherIncome: 0,
    expenseRatio: 0,
    vacancyRate: 0,
    capexRate: 0,
    rehabBudget: 95000,
    downPaymentRate: 100,
    bankLtvRate: 0,
    sellerCarryRate: 0,
    pmlLoanRate: 0,
    loanAmount: 0,
    sellerCarryAmount: 0,
    acquisitionDownPaymentAmount: 0,
    closingCosts: 0,
    closingCostsMode: "percent",
    interestRate: 0,
    sellerInterestRate: 0,
    loanTermYears: 1,
    sellerTermYears: 1,
    holdYears: 1,
    afterRepairValue: 2675000,
    monthlyBuyerPayment: 0,
    buyerDownPayment: 0,
    balloonPayment: 0,
    saleCostsRate: 4,
    annualCarryCosts: 18000,
    carryCostGrowthRate: 0.5,
    notes: "Potential light reposition and resale if rollover risk is handled quickly.",
    nextAction: "Request tenant rollover schedule",
    sourceUrl: "",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
    timeline: [
      { date: "2026-04-04", text: "Deal sourced through local broker breakfast." },
      { date: "2026-04-07", text: "Initial flip spread reviewed against capex plan." }
    ],
    comps: [
      { name: "Linden Plaza", ppu: 355000, capRate: 7.1, distance: "3.0 mi" },
      { name: "Edgewater Retail", ppu: 372000, capRate: 6.7, distance: "4.4 mi" }
    ]
  }
];

const stageOrder = ["All", "Lead", "Underwriting", "LOI", "Due Diligence", "Closed", "Dead"];
const numericFields = [
  "units", "purchasePrice", "monthlyRent", "otherIncome", "expenseRatio", "vacancyRate", "capexRate", "rehabBudget",
  "downPaymentRate", "bankLtvRate", "sellerCarryRate", "pmlLoanRate", "loanAmount", "sellerCarryAmount",
  "acquisitionDownPaymentAmount", "closingCosts", "interestRate", "sellerInterestRate", "loanTermYears", "sellerTermYears",
  "holdYears", "afterRepairValue", "monthlyBuyerPayment", "buyerDownPayment", "balloonPayment", "saleCostsRate",
  "annualCarryCosts", "carryCostGrowthRate"
];

const state = {
  deals: [],
  imports: [],
  selectedDealId: null,
  activeStage: "All",
  session: null,
  user: null,
  isBooting: true
};

const elements = {
  portfolioStats: document.getElementById("portfolioStats"),
  stageFilters: document.getElementById("stageFilters"),
  urgentTasks: document.getElementById("urgentTasks"),
  dealBoard: document.getElementById("dealBoard"),
  dealForm: document.getElementById("dealForm"),
  metricCards: document.getElementById("metricCards"),
  compList: document.getElementById("compList"),
  timelineList: document.getElementById("timelineList"),
  selectedDealName: document.getElementById("selectedDealName"),
  selectedDealUpdated: document.getElementById("selectedDealUpdated"),
  rentGrowthInput: document.getElementById("rentGrowthInput"),
  exitCapInput: document.getElementById("exitCapInput"),
  rentGrowthValue: document.getElementById("rentGrowthValue"),
  exitCapValue: document.getElementById("exitCapValue"),
  scenarioSummary: document.getElementById("scenarioSummary"),
  newDealButton: document.getElementById("newDealButton"),
  resetButton: document.getElementById("resetButton"),
  dealCardTemplate: document.getElementById("dealCardTemplate"),
  monthlyRentLabel: document.getElementById("monthlyRentLabel"),
  interestRateLabel: document.getElementById("interestRateLabel"),
  loanTermLabel: document.getElementById("loanTermLabel"),
  holdYearsLabel: document.getElementById("holdYearsLabel"),
  salePriceLabel: document.getElementById("salePriceLabel"),
  authOverlay: document.getElementById("authOverlay"),
  authForm: document.getElementById("authForm"),
  authEmail: document.getElementById("authEmail"),
  authPassword: document.getElementById("authPassword"),
  authMessage: document.getElementById("authMessage"),
  signUpButton: document.getElementById("signUpButton"),
  authToggleButton: document.getElementById("authToggleButton"),
  authStatus: document.getElementById("authStatus"),
  importForm: document.getElementById("importForm"),
  importUrl: document.getElementById("importUrl"),
  importText: document.getElementById("importText"),
  importFile: document.getElementById("importFile"),
  importStatus: document.getElementById("importStatus"),
  importList: document.getElementById("importList")
};

initialize();

async function initialize() {
  bindEvents();
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    setAuthMessage(error.message, true);
  } else {
    applySession(data.session);
  }
  supabase.auth.onAuthStateChange((_event, session) => {
    applySession(session);
  });
  state.isBooting = false;
  syncAuthUi();
  if (state.user) {
    await loadWorkspace();
  } else {
    renderSignedOutState();
  }
}

function bindEvents() {
  elements.dealForm.addEventListener("submit", handleSaveDeal);
  elements.newDealButton.addEventListener("click", handleNewDeal);
  elements.resetButton.addEventListener("click", handleResetDeals);
  elements.rentGrowthInput.addEventListener("input", renderScenario);
  elements.exitCapInput.addEventListener("input", renderScenario);
  elements.dealForm.elements.namedItem("dealStrategy").addEventListener("change", handleStructureChange);
  elements.dealForm.elements.namedItem("financingType").addEventListener("change", handleStructureChange);
  elements.dealForm.elements.namedItem("assetType").addEventListener("change", handleStructureChange);
  elements.authForm.addEventListener("submit", handleSignIn);
  elements.signUpButton.addEventListener("click", handleSignUp);
  elements.authToggleButton.addEventListener("click", handleAuthToggle);
  elements.importForm.addEventListener("submit", handleCreateImport);
}

function applySession(session) {
  state.session = session;
  state.user = session?.user ?? null;
  syncAuthUi();
}

function syncAuthUi() {
  const signedIn = Boolean(state.user);
  elements.authOverlay.hidden = state.isBooting || signedIn;
  elements.authToggleButton.textContent = signedIn ? "Sign out" : "Sign in";
  elements.authStatus.innerHTML = signedIn
    ? `<div class="task-item"><span class="auth-badge">Private app</span><strong>${escapeHtml(state.user.email ?? "Signed in")}</strong><span>Deals sync through Supabase.</span></div>`
    : `<p class="empty-state">Sign in to load and save your deals.</p>`;
}

async function loadWorkspace() {
  const [dealsResult, importsResult] = await Promise.all([loadDealsFromSupabase(), loadImportsFromSupabase()]);
  state.deals = dealsResult;
  state.imports = importsResult;
  state.selectedDealId = state.deals[0]?.id ?? null;
  render();
  renderImports();
}

function renderSignedOutState() {
  state.deals = [];
  state.imports = [];
  state.selectedDealId = null;
  elements.portfolioStats.innerHTML = `<p class="empty-state">Sign in to view portfolio metrics.</p>`;
  elements.stageFilters.innerHTML = "";
  elements.urgentTasks.innerHTML = `<p class="empty-state">Action queue appears after you load deals.</p>`;
  elements.dealBoard.innerHTML = `<p class="empty-state">Your cloud-saved deals will appear here.</p>`;
  elements.metricCards.innerHTML = `<p class="empty-state">Sign in to load underwriting metrics.</p>`;
  elements.compList.innerHTML = `<p class="empty-state">Sign in to view comparable sales.</p>`;
  elements.timelineList.innerHTML = `<p class="empty-state">Sign in to view recent activity.</p>`;
  elements.importList.innerHTML = `<p class="empty-state">Imports will appear here after sign-in.</p>`;
  elements.importStatus.textContent = "";
  elements.selectedDealName.textContent = "Sign in required";
  elements.selectedDealUpdated.textContent = "-";
  elements.scenarioSummary.innerHTML = `<span class="empty-state">Scenario output appears after you load a deal.</span>`;
}

function render() {
  if (!state.user) {
    renderSignedOutState();
    return;
  }
  renderPortfolioStats();
  renderStageFilters();
  renderTasks();
  renderDealBoard();
  renderSelectedDeal();
}

function renderPortfolioStats() {
  const activeDeals = state.deals.filter((deal) => deal.stage !== "Dead");
  const totalCapital = activeDeals.reduce((sum, deal) => sum + totalBasis(deal), 0);
  const totalProfit = activeDeals.reduce((sum, deal) => sum + calculateMetrics(deal).headlineValue, 0);
  const stats = [
    { label: "Active deals", value: `${activeDeals.length}` },
    { label: "Capital in play", value: formatCurrency(totalCapital) },
    { label: "Projected value", value: formatCurrency(totalProfit) }
  ];
  elements.portfolioStats.innerHTML = stats.map((stat) => `
    <div class="stat-item">
      <span class="section-label">${stat.label}</span>
      <strong class="stat-value">${stat.value}</strong>
    </div>
  `).join("");
}

function renderStageFilters() {
  elements.stageFilters.innerHTML = "";
  stageOrder.forEach((stage) => {
    const count = stage === "All" ? state.deals.length : state.deals.filter((deal) => deal.stage === stage).length;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-button ${state.activeStage === stage ? "active" : ""}`;
    button.innerHTML = `<span>${stage}</span><strong>${count}</strong>`;
    button.addEventListener("click", () => {
      state.activeStage = stage;
      renderDealBoard();
      renderStageFilters();
    });
    elements.stageFilters.appendChild(button);
  });
}

function renderTasks() {
  const tasks = state.deals.filter((deal) => !["Closed", "Dead"].includes(deal.stage)).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 4);
  elements.urgentTasks.innerHTML = tasks.length ? tasks.map((deal) => `
    <div class="task-item">
      <strong>${escapeHtml(deal.nextAction || "Add next action")}</strong>
      <span>${escapeHtml(deal.name)}</span>
      <span class="timeline-date">${formatRelativeDate(deal.updatedAt)}</span>
    </div>
  `).join("") : `<p class="empty-state">No active tasks yet.</p>`;
}

function renderDealBoard() {
  const visibleDeals = state.deals.filter((deal) => state.activeStage === "All" || deal.stage === state.activeStage);
  elements.dealBoard.innerHTML = "";
  if (!visibleDeals.length) {
    elements.dealBoard.innerHTML = `<p class="empty-state">No deals match this stage.</p>`;
    return;
  }
  visibleDeals.forEach((deal) => {
    const metrics = calculateMetrics(deal);
    const fragment = elements.dealCardTemplate.content.cloneNode(true);
    const button = fragment.querySelector(".deal-card");
    button.classList.toggle("active", deal.id === state.selectedDealId);
    fragment.querySelector(".deal-stage").textContent = `${deal.stage} | ${deal.dealStrategy}`;
    fragment.querySelector(".deal-name").textContent = deal.name;
    fragment.querySelector(".deal-subtitle").textContent = `${deal.market} | ${deal.assetType} | ${deal.financingType}`;
    fragment.querySelector(".deal-kpis").innerHTML = metrics.dealPills.map((pill) => `<span class="pill">${pill}</span>`).join("");
    button.addEventListener("click", () => {
      state.selectedDealId = deal.id;
      renderDealBoard();
      renderSelectedDeal();
    });
    elements.dealBoard.appendChild(fragment);
  });
}

function renderSelectedDeal() {
  const deal = getSelectedDeal();
  if (!deal) {
    elements.metricCards.innerHTML = `<p class="empty-state">Create a deal or import one to start underwriting.</p>`;
    elements.compList.innerHTML = `<p class="empty-state">No comparable sales yet.</p>`;
    elements.timelineList.innerHTML = `<p class="empty-state">No activity yet.</p>`;
    elements.selectedDealName.textContent = "No deal selected";
    elements.selectedDealUpdated.textContent = "-";
    elements.scenarioSummary.innerHTML = `<span class="empty-state">Scenario output appears after you save a deal.</span>`;
    return;
  }
  fillForm(deal);
  syncStructureVisibility();
  syncDynamicLabels();
  const metrics = calculateMetrics(deal);
  elements.selectedDealName.textContent = `${deal.name} (${deal.dealStrategy})`;
  elements.selectedDealUpdated.textContent = formatRelativeDate(deal.updatedAt);
  const metricConfig = [
    { label: metrics.primaryMetricLabel, value: metrics.primaryMetricValue, hint: metrics.primaryMetricHint, trend: metrics.primaryMetricTrend },
    { label: "Total basis", value: formatCurrency(metrics.allInCost), hint: "Purchase plus rehab before resale costs." },
    { label: "Acquisition down payment", value: formatCurrency(metrics.acquisitionDownPaymentAmount), hint: "Temporary cash advanced before acquisition and tracked separately from the purchase price." },
    { label: "Cash needed at acquisition", value: formatCurrency(metrics.initialCash), hint: "Cash actually needed when you close after loan proceeds and acquisition down payment credits." },
    { label: metrics.secondaryMetricLabel, value: metrics.secondaryMetricValue, hint: metrics.secondaryMetricHint, trend: metrics.secondaryMetricTrend },
    { label: "Break-even occupancy", value: `${metrics.breakEvenOccupancy.toFixed(1)}%`, hint: "For rental deals, how occupied the asset needs to stay to carry itself." },
    { label: "Debt or note payment", value: formatCurrency(metrics.monthlyDebtService), hint: "Monthly outgoing payment on bank debt or seller carry." },
    { label: "All-in basis / unit", value: formatCurrency(metrics.pricePerUnit), hint: "Helpful for quick comp comparisons." },
    { label: "Exit or resale value", value: formatCurrency(metrics.exitValue), hint: "Expected value on stabilization, sale, or note payoff." }
  ];
  elements.metricCards.innerHTML = metricConfig.map((metric) => `
    <div class="metric-card">
      <span class="metric-label">${metric.label}</span>
      <strong class="metric-value">${metric.value}</strong>
      <span class="metric-trend ${metric.trend ?? ""}">${metric.hint}</span>
    </div>
  `).join("");
  elements.compList.innerHTML = deal.comps.length ? deal.comps.map((comp) => `
    <div class="comp-item">
      <strong>${escapeHtml(comp.name)}</strong>
      <span>${formatCurrency(comp.ppu)} / unit</span>
      <span>${comp.capRate.toFixed(1)}% cap | ${escapeHtml(comp.distance)}</span>
    </div>
  `).join("") : `<p class="empty-state">Add comps to compare local trades.</p>`;
  elements.timelineList.innerHTML = deal.timeline.length ? [...deal.timeline].sort((a, b) => new Date(b.date) - new Date(a.date)).map((entry) => `
    <div class="timeline-item">
      <strong>${escapeHtml(entry.text)}</strong>
      <span class="timeline-date">${formatDate(entry.date)}</span>
    </div>
  `).join("") : `<p class="empty-state">No activity yet.</p>`;
  renderScenario();
}

function renderScenario() {
  const deal = getSelectedDeal();
  if (!deal) return;
  const metrics = calculateMetrics(deal);
  const rentGrowth = number(elements.rentGrowthInput.value) / 100;
  const exitCap = number(elements.exitCapInput.value) / 100;
  let futureValue = metrics.exitValue;
  let projectedProfit = metrics.projectedProfit;
  if (deal.dealStrategy === "Rental Hold") {
    let cumulativeCashFlow = 0;
    for (let year = 1; year <= number(deal.holdYears); year += 1) {
      const grownNoi = metrics.noi * Math.pow(1 + rentGrowth, year - 1);
      const debtServiceForYear = year <= number(deal.loanTermYears) ? metrics.monthlyDebtService * 12 : 0;
      cumulativeCashFlow += grownNoi - debtServiceForYear;
    }
    const futureNOI = metrics.noi * Math.pow(1 + rentGrowth, Math.max(number(deal.holdYears) - 1, 0));
    futureValue = exitCap > 0 ? futureNOI / exitCap : 0;
    projectedProfit = cumulativeCashFlow + futureValue * (1 - number(deal.saleCostsRate) / 100) - metrics.remainingDebtAtExit - metrics.initialCash;
  } else if (deal.dealStrategy === "Flip") {
    futureValue = number(deal.afterRepairValue) * (1 + rentGrowth);
    projectedProfit = futureValue * (1 - number(deal.saleCostsRate) / 100) - metrics.allInCost - calculateGrowingAnnualSeries(number(deal.annualCarryCosts), number(deal.carryCostGrowthRate) / 100, number(deal.holdYears));
  } else {
    const debtYears = Math.min(number(deal.loanTermYears), number(deal.holdYears));
    const freeClearYears = Math.max(number(deal.holdYears) - debtYears, 0);
    const monthlyPmlPayment = deal.financingType === "PML" ? number(deal.monthlyRent) : metrics.monthlyDebtService;
    futureValue = number(deal.buyerDownPayment) + number(deal.monthlyBuyerPayment) * number(deal.holdYears) * 12 + number(deal.balloonPayment);
    projectedProfit = number(deal.buyerDownPayment) + (number(deal.monthlyBuyerPayment) - monthlyPmlPayment) * debtYears * 12 + number(deal.monthlyBuyerPayment) * freeClearYears * 12 + number(deal.balloonPayment) - calculateGrowingAnnualSeries(number(deal.annualCarryCosts), number(deal.carryCostGrowthRate) / 100, number(deal.holdYears)) - metrics.initialCash;
  }
  elements.rentGrowthValue.textContent = `${elements.rentGrowthInput.value}%`;
  elements.exitCapValue.textContent = `${number(elements.exitCapInput.value).toFixed(1)}%`;
  elements.scenarioSummary.innerHTML = `
    <strong>${formatCurrency(futureValue)}</strong> projected value under the current scenario.
    Estimated profit before taxes: <strong>${formatCurrency(projectedProfit)}</strong>.
  `;
}

function renderImports() {
  elements.importList.innerHTML = state.imports.length ? state.imports.map((item) => `
    <div class="task-item">
      <strong>${escapeHtml(importTitle(item))}</strong>
      <span><span class="import-pill">${escapeHtml(importSourceLabel(item))}</span> ${escapeHtml(importStatusLabel(item.status))}</span>
      <span class="timeline-date">${formatRelativeDate(item.created_at)}</span>
    </div>
  `).join("") : `<p class="empty-state">No imports yet. Save a URL, PDF, or raw text intake to start the pipeline.</p>`;
}

async function handleSignIn(event) {
  event.preventDefault();
  setAuthMessage("Signing in...");
  const email = elements.authEmail.value.trim();
  const password = elements.authPassword.value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    setAuthMessage(error.message, true);
    return;
  }
  setAuthMessage("Signed in.");
  await loadWorkspace();
}

async function handleSignUp() {
  const email = elements.authEmail.value.trim();
  const password = elements.authPassword.value;
  setAuthMessage("Creating your account...");
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    setAuthMessage(error.message, true);
    return;
  }
  setAuthMessage("Account created. If email confirmation is enabled, confirm your email and sign in.");
}

async function handleAuthToggle() {
  if (state.user) {
    await supabase.auth.signOut();
    renderSignedOutState();
    return;
  }
  elements.authOverlay.hidden = false;
}
async function handleSaveDeal(event) {
  event.preventDefault();
  if (!state.user) return;
  const formData = new FormData(elements.dealForm);
  const existing = getSelectedDeal();
  const nextDeal = {
    ...existing,
    id: existing?.id ?? crypto.randomUUID(),
    timeline: existing?.timeline ?? [],
    comps: existing?.comps ?? [],
    updatedAt: new Date().toISOString()
  };
  for (const [key, value] of formData.entries()) {
    nextDeal[key] = numericFields.includes(key) ? number(value) : value.toString().trim();
  }
  normalizeDealStructure(nextDeal);
  const hydratedDeal = hydrateDealDefaults(nextDeal);
  const entry = existing ? { date: new Date().toISOString().slice(0, 10), text: "Deal assumptions updated." } : { date: new Date().toISOString().slice(0, 10), text: "New deal created." };
  hydratedDeal.timeline = [entry, ...(existing?.timeline ?? [])].slice(0, 6);
  try {
    const savedDeal = await upsertDeal(hydratedDeal);
    const index = state.deals.findIndex((deal) => deal.id === savedDeal.id);
    if (index >= 0) state.deals.splice(index, 1, savedDeal);
    else state.deals.unshift(savedDeal);
    state.selectedDealId = savedDeal.id;
    render();
  } catch (error) {
    elements.importStatus.textContent = error.message;
  }
}

function handleNewDeal() {
  state.selectedDealId = null;
  elements.dealForm.reset();
  elements.dealForm.elements.namedItem("stage").value = "Lead";
  elements.dealForm.elements.namedItem("assetType").value = "Multifamily";
  elements.dealForm.elements.namedItem("dealStrategy").value = "Rental Hold";
  elements.dealForm.elements.namedItem("financingType").value = "Bank Loan";
  elements.dealForm.elements.namedItem("bankLtvRate").value = 75;
  elements.dealForm.elements.namedItem("sellerCarryRate").value = 0;
  elements.dealForm.elements.namedItem("pmlLoanRate").value = 0;
  elements.dealForm.elements.namedItem("loanAmount").value = 0;
  elements.dealForm.elements.namedItem("sellerCarryAmount").value = 0;
  elements.dealForm.elements.namedItem("acquisitionDownPaymentAmount").value = 0;
  elements.dealForm.elements.namedItem("closingCosts").value = 0;
  elements.dealForm.elements.namedItem("closingCostsMode").value = "percent";
  elements.dealForm.elements.namedItem("sellerInterestRate").value = 0;
  elements.dealForm.elements.namedItem("sellerTermYears").value = 5;
  elements.dealForm.elements.namedItem("carryCostGrowthRate").value = 0.5;
  syncStructureVisibility();
  syncDynamicLabels();
  elements.metricCards.innerHTML = `<p class="empty-state">Enter assumptions to see the underwriting.</p>`;
  elements.compList.innerHTML = `<p class="empty-state">New deals start without comps.</p>`;
  elements.timelineList.innerHTML = `<p class="empty-state">Save the deal to start a timeline.</p>`;
  elements.selectedDealName.textContent = "New deal";
  elements.selectedDealUpdated.textContent = "-";
  elements.scenarioSummary.innerHTML = `<span class="empty-state">Scenario output appears after you save the deal.</span>`;
  renderDealBoard();
}

async function handleResetDeals() {
  if (!state.user) return;
  elements.importStatus.textContent = "Resetting demo deals in Supabase...";
  const existingIds = state.deals.map((deal) => deal.id);
  if (existingIds.length) {
    const { error: deleteError } = await supabase.from("deals").delete().in("id", existingIds);
    if (deleteError) {
      elements.importStatus.textContent = deleteError.message;
      return;
    }
  }
  const inserts = sampleDeals.map((deal) => dealToInsertRecord(hydrateDealDefaults(structuredClone(deal))));
  const { data, error } = await supabase.from("deals").insert(inserts).select();
  if (error) {
    elements.importStatus.textContent = error.message;
    return;
  }
  state.deals = (data ?? []).map(recordToDeal);
  state.selectedDealId = state.deals[0]?.id ?? null;
  elements.importStatus.textContent = "Demo deals loaded into your account.";
  render();
}

async function handleCreateImport(event) {
  event.preventDefault();
  if (!state.user) return;
  const sourceUrl = elements.importUrl.value.trim();
  const rawText = elements.importText.value.trim();
  const file = elements.importFile.files?.[0] ?? null;
  if (!sourceUrl && !rawText && !file) {
    elements.importStatus.textContent = "Add a listing URL, raw text, or a PDF before saving the import.";
    return;
  }
  elements.importStatus.textContent = "Saving import intake...";
  let uploadRecord = null;
  if (file) {
    uploadRecord = await uploadImportFile(file);
    if (!uploadRecord) return;
  }
  const sourceType = file ? "pdf" : sourceUrl ? "url" : "text";
  const payload = {
    user_id: state.user.id,
    source_type: sourceType,
    source_url: sourceUrl || null,
    raw_text: rawText || null,
    status: "pending",
    extracted_payload: {}
  };
  const { data: importRecord, error } = await supabase.from("deal_imports").insert(payload).select().single();
  if (error) {
    elements.importStatus.textContent = error.message;
    return;
  }
  if (uploadRecord) {
    await supabase.from("deal_files").insert({
      user_id: state.user.id,
      import_id: importRecord.id,
      bucket: uploadRecord.bucket,
      path: uploadRecord.path,
      filename: uploadRecord.filename,
      mime_type: uploadRecord.mime_type,
      size_bytes: uploadRecord.size_bytes
    });
  }
  state.imports.unshift(importRecord);
  elements.importStatus.textContent = sourceUrl
    ? `Saved ${humanizeHostname(sourceUrl)} link for queued extraction.`
    : file
      ? "PDF saved for queued extraction."
      : "Raw text saved for queued extraction.";
  elements.importForm.reset();
  renderImports();
}

async function uploadImportFile(file) {
  const path = `${state.user.id}/${crypto.randomUUID()}-${safeFilename(file.name)}`;
  const { error } = await supabase.storage.from("deal-documents").upload(path, file, { upsert: false });
  if (error) {
    elements.importStatus.textContent = error.message;
    return null;
  }
  return {
    bucket: "deal-documents",
    path,
    filename: file.name,
    mime_type: file.type || "application/pdf",
    size_bytes: file.size
  };
}

function fillForm(deal) {
  Object.entries(deal).forEach(([key, value]) => {
    const field = elements.dealForm.elements.namedItem(key);
    if (field) field.value = value ?? "";
  });
}

function handleStructureChange() {
  if (elements.dealForm.elements.namedItem("dealStrategy").value === "Slow Flip") {
    elements.dealForm.elements.namedItem("financingType").value = "PML";
  }
  syncStructureVisibility();
  syncDynamicLabels();
}

function syncStructureVisibility() {
  const strategy = elements.dealForm.elements.namedItem("dealStrategy").value;
  const financingType = elements.dealForm.elements.namedItem("financingType").value;
  const assetType = elements.dealForm.elements.namedItem("assetType").value;
  const isMultifamily = assetType === "Multifamily";
  const isSingleFamily = assetType === "Single Family";
  document.querySelectorAll(".strategy-field").forEach((node) => {
    const className = `strategy-${strategy.toLowerCase().replace(/\s+/g, "-")}`;
    node.hidden = !node.classList.contains(className);
  });
  document.querySelectorAll(".finance-field").forEach((node) => {
    const show =
      (financingType === "Cash" && node.classList.contains("finance-cash")) ||
      (financingType === "Bank Loan" && (node.classList.contains("finance-bank") || node.classList.contains("finance-cash"))) ||
      (financingType === "PML" && (node.classList.contains("finance-pml") || node.classList.contains("finance-cash"))) ||
      (financingType === "Seller Financing" && (node.classList.contains("finance-seller") || node.classList.contains("finance-cash"))) ||
      (financingType === "Bank + Seller Finance" && (node.classList.contains("finance-bank") || node.classList.contains("finance-seller") || node.classList.contains("finance-cash")));
    node.hidden = !show;
  });
  document.querySelectorAll(".buyer-field").forEach((node) => {
    node.hidden = strategy !== "Slow Flip" || isMultifamily;
  });
  document.querySelectorAll(".asset-field.not-single-family").forEach((node) => {
    node.hidden = isSingleFamily;
  });
  elements.dealForm.elements.namedItem("financingType").disabled = strategy === "Slow Flip";
}

function syncDynamicLabels() {
  const strategy = elements.dealForm.elements.namedItem("dealStrategy").value;
  const financingType = elements.dealForm.elements.namedItem("financingType").value;
  const isSlowFlipPml = strategy === "Slow Flip" && financingType === "PML";
  elements.monthlyRentLabel.textContent = isSlowFlipPml ? "Monthly payment to PML" : "Monthly rent";
  elements.interestRateLabel.textContent = financingType === "PML" ? "PML interest rate %" : "Bank interest rate %";
  elements.loanTermLabel.textContent = financingType === "PML" ? "PML term (years)" : "Bank term (years)";
  elements.holdYearsLabel.textContent = strategy === "Slow Flip" ? "Buyer note term (years)" : "Target hold (years)";
  elements.salePriceLabel.textContent = strategy === "Slow Flip" ? "Sale price to end buyer" : "After repair value";
}
function normalizeDealStructure(deal) {
  if (deal.financingType === "Cash") {
    deal.bankLtvRate = 0;
    deal.sellerCarryRate = 0;
    deal.pmlLoanRate = 0;
    deal.loanAmount = 0;
    deal.sellerCarryAmount = 0;
    deal.downPaymentRate = 100;
    deal.interestRate = 0;
    deal.sellerInterestRate = 0;
  } else if (deal.financingType === "Bank Loan") {
    deal.sellerCarryRate = 0;
    deal.pmlLoanRate = 0;
    deal.sellerCarryAmount = 0;
    deal.sellerInterestRate = 0;
  } else if (deal.financingType === "PML") {
    deal.bankLtvRate = 0;
    deal.sellerCarryRate = 0;
    deal.sellerCarryAmount = 0;
    deal.sellerInterestRate = 0;
  } else if (deal.financingType === "Seller Financing") {
    deal.bankLtvRate = 0;
    deal.pmlLoanRate = 0;
    deal.loanAmount = 0;
    deal.interestRate = 0;
  } else {
    deal.pmlLoanRate = 0;
  }
  deal.downPaymentRate = Math.min(Math.max(number(deal.downPaymentRate), 0), 100);
  if (deal.dealStrategy !== "Slow Flip" || deal.assetType === "Multifamily") {
    deal.monthlyBuyerPayment = 0;
    deal.buyerDownPayment = 0;
    deal.balloonPayment = 0;
  }
  if (deal.dealStrategy === "Slow Flip") {
    deal.otherIncome = 0;
    deal.expenseRatio = 0;
    deal.vacancyRate = 0;
    deal.capexRate = 0;
    deal.rehabBudget = 0;
  }
}

function hydrateDealDefaults(deal) {
  const hydrated = {
    dealStrategy: "Rental Hold",
    financingType: "Bank Loan",
    bankLtvRate: 75,
    sellerCarryRate: 0,
    pmlLoanRate: 0,
    loanAmount: 0,
    sellerCarryAmount: 0,
    acquisitionDownPaymentAmount: 0,
    closingCosts: 0,
    closingCostsMode: "percent",
    sellerInterestRate: 0,
    sellerTermYears: 5,
    afterRepairValue: 0,
    monthlyBuyerPayment: 0,
    buyerDownPayment: 0,
    balloonPayment: 0,
    saleCostsRate: 6,
    annualCarryCosts: 0,
    carryCostGrowthRate: 0.5,
    sourceUrl: "",
    timeline: [],
    comps: [],
    ...deal
  };
  hydrated.closingCosts = normalizeClosingCostsPercent(hydrated);
  normalizeDealStructure(hydrated);
  return hydrated;
}

function calculateMetrics(deal) {
  const units = Math.max(number(deal.units), 1);
  const allInCost = totalBasis(deal);
  const financing = financingBreakdown(deal, allInCost);
  const initialCash = financing.cashNeededAtAcquisition;
  const monthlyDebtService = financing.bankPayment + financing.pmlPayment + financing.sellerPayment;
  const holdMonths = Math.max(number(deal.holdYears) * 12, 1);
  const remainingDebtAtExit =
    Math.max(financing.bankLoan - amortizedPrincipalPaydown(financing.bankLoan, number(deal.interestRate) / 100, number(deal.loanTermYears), holdMonths), 0) +
    Math.max(financing.pmlLoan - amortizedPrincipalPaydown(financing.pmlLoan, number(deal.interestRate) / 100, number(deal.loanTermYears), holdMonths), 0) +
    Math.max(financing.sellerLoan - amortizedPrincipalPaydown(financing.sellerLoan, number(deal.sellerInterestRate) / 100, number(deal.sellerTermYears), holdMonths), 0);
  const annualRent = number(deal.monthlyRent) * 12;
  const annualOtherIncome = number(deal.otherIncome) * 12;
  const gsi = annualRent + annualOtherIncome;
  const vacancyLoss = gsi * (number(deal.vacancyRate) / 100);
  const egi = gsi - vacancyLoss;
  const operatingExpenses = egi * (number(deal.expenseRatio) / 100);
  const capexReserve = egi * (number(deal.capexRate) / 100);
  const noi = egi - operatingExpenses - capexReserve;
  const annualDebtService = monthlyDebtService * 12;
  const capRate = number(deal.purchasePrice) ? (noi / number(deal.purchasePrice)) * 100 : 0;
  const dscr = annualDebtService ? noi / annualDebtService : 0;
  const breakEvenOccupancy = gsi ? ((operatingExpenses + capexReserve + annualDebtService) / gsi) * 100 : 0;
  const pricePerUnit = allInCost / units;
  const yearsWithDebt = Math.min(number(deal.holdYears), number(deal.loanTermYears));
  const freeClearYears = Math.max(number(deal.holdYears) - yearsWithDebt, 0);
  const annualCashFlow = noi - annualDebtService;
  const holdProfitBeforeSale = annualCashFlow * yearsWithDebt + noi * freeClearYears - initialCash;
  const saleCosts = number(deal.afterRepairValue) * (number(deal.saleCostsRate) / 100);
  const totalCarryCosts = calculateGrowingAnnualSeries(number(deal.annualCarryCosts), number(deal.carryCostGrowthRate) / 100, number(deal.holdYears));
  const flipProfit = number(deal.afterRepairValue) - saleCosts - allInCost - totalCarryCosts;
  const monthlyPmlPayment = deal.financingType === "PML" ? number(deal.monthlyRent) : financing.pmlPayment;
  const debtYears = Math.min(number(deal.loanTermYears), number(deal.holdYears));
  const freeClearYearsSlowFlip = Math.max(number(deal.holdYears) - debtYears, 0);
  const monthlyBuyerSpreadWhileDebt = number(deal.monthlyBuyerPayment) - monthlyPmlPayment;
  const totalBuyerCollections = number(deal.buyerDownPayment) + number(deal.monthlyBuyerPayment) * holdMonths + number(deal.balloonPayment);
  const slowFlipProfit = number(deal.buyerDownPayment) + monthlyBuyerSpreadWhileDebt * debtYears * 12 + number(deal.monthlyBuyerPayment) * freeClearYearsSlowFlip * 12 + number(deal.balloonPayment) - totalCarryCosts - initialCash;
  if (deal.dealStrategy === "Slow Flip") {
    return {
      allInCost, initialCash, acquisitionDownPaymentAmount: financing.acquisitionDownPaymentAmount, monthlyDebtService, breakEvenOccupancy: 0,
      pricePerUnit, exitValue: totalBuyerCollections, projectedProfit: slowFlipProfit, headlineValue: totalBuyerCollections, remainingDebtAtExit, noi,
      dealPills: [`${formatCurrency(financing.cashNeededAtAcquisition)} close cash`, `${formatCurrency(monthlyBuyerSpreadWhileDebt)}/mo spread`, `${freeClearYearsSlowFlip} yrs free clear`, `${formatCurrency(slowFlipProfit)} profit`],
      primaryMetricLabel: "Projected slow-flip profit", primaryMetricValue: formatCurrency(slowFlipProfit),
      primaryMetricHint: "Buyer down payment plus monthly spread during the debt years, then buyer payments free and clear after payoff.",
      primaryMetricTrend: slowFlipProfit >= 0 ? "good" : "bad",
      secondaryMetricLabel: "Net monthly spread", secondaryMetricValue: formatCurrency(monthlyBuyerSpreadWhileDebt),
      secondaryMetricHint: "Buyer payment less your debt payment during the active note term.", secondaryMetricTrend: monthlyBuyerSpreadWhileDebt >= 0 ? "good" : "bad"
    };
  }
  if (deal.dealStrategy === "Flip") {
    return {
      allInCost, initialCash, acquisitionDownPaymentAmount: financing.acquisitionDownPaymentAmount, monthlyDebtService, breakEvenOccupancy: 0,
      pricePerUnit, exitValue: number(deal.afterRepairValue), projectedProfit: flipProfit, headlineValue: number(deal.afterRepairValue), remainingDebtAtExit, noi,
      dealPills: [`${formatCurrency(financing.cashNeededAtAcquisition)} close cash`, `${formatCurrency(number(deal.afterRepairValue))} exit`, `${formatCurrency(flipProfit)} spread`],
      primaryMetricLabel: "Projected flip profit", primaryMetricValue: formatCurrency(flipProfit), primaryMetricHint: "Resale proceeds after costs minus basis and carry.",
      primaryMetricTrend: flipProfit >= 0 ? "good" : "bad", secondaryMetricLabel: "Margin on cost",
      secondaryMetricValue: `${allInCost ? ((flipProfit / allInCost) * 100).toFixed(2) : "0.00"}%`, secondaryMetricHint: "Profit relative to total basis invested.",
      secondaryMetricTrend: flipProfit >= 0 ? "good" : "bad"
    };
  }
  return {
    allInCost, initialCash, acquisitionDownPaymentAmount: financing.acquisitionDownPaymentAmount, monthlyDebtService, breakEvenOccupancy,
    pricePerUnit, exitValue: number(deal.afterRepairValue), projectedProfit: holdProfitBeforeSale, headlineValue: noi, remainingDebtAtExit, noi,
    dealPills: [`${formatCurrency(financing.cashNeededAtAcquisition)} close cash`, `${capRate.toFixed(1)}% cap`, `${freeClearYears} yrs free clear`, `${dscr.toFixed(2)} DSCR`],
    primaryMetricLabel: "NOI", primaryMetricValue: formatCurrency(noi), primaryMetricHint: "Income after vacancy, opex, and capex reserve.",
    primaryMetricTrend: noi >= 0 ? "good" : "bad", secondaryMetricLabel: "Hold profit before sale", secondaryMetricValue: formatCurrency(holdProfitBeforeSale),
    secondaryMetricHint: `Cash flow during ${yearsWithDebt} debt years plus ${freeClearYears} free-and-clear years, minus initial cash in.`, secondaryMetricTrend: holdProfitBeforeSale >= 0 ? "good" : "bad"
  };
}

function financingBreakdown(deal, allInCost) {
  let bankLoan = 0;
  let sellerLoan = 0;
  let pmlLoan = 0;
  const acquisitionDownPaymentAmount = number(deal.acquisitionDownPaymentAmount);
  if (deal.financingType === "Bank Loan") {
    bankLoan = number(deal.loanAmount) > 0 ? number(deal.loanAmount) : allInCost * (number(deal.bankLtvRate) / 100);
  } else if (deal.financingType === "PML") {
    pmlLoan = number(deal.loanAmount) > 0 ? number(deal.loanAmount) : allInCost * (number(deal.pmlLoanRate) / 100);
  } else if (deal.financingType === "Seller Financing") {
    sellerLoan = number(deal.sellerCarryAmount) > 0 ? number(deal.sellerCarryAmount) : allInCost * (number(deal.sellerCarryRate) / 100);
  } else if (deal.financingType === "Bank + Seller Finance") {
    bankLoan = number(deal.loanAmount) > 0 ? number(deal.loanAmount) : allInCost * (number(deal.bankLtvRate) / 100);
    sellerLoan = number(deal.sellerCarryAmount) > 0 ? number(deal.sellerCarryAmount) : allInCost * (number(deal.sellerCarryRate) / 100);
  }
  const enteredCash = allInCost * (number(deal.downPaymentRate) / 100);
  const uncoveredGap = Math.max(allInCost - bankLoan - pmlLoan - sellerLoan, 0);
  const grossCashNeeded = Math.max(enteredCash, uncoveredGap);
  const cashNeededAtAcquisition = Math.max(grossCashNeeded - acquisitionDownPaymentAmount, 0);
  return {
    bankLoan,
    pmlLoan,
    sellerLoan,
    bankPayment: monthlyPayment(bankLoan, number(deal.interestRate) / 100, number(deal.loanTermYears)),
    pmlPayment: monthlyPayment(pmlLoan, number(deal.interestRate) / 100, number(deal.loanTermYears)),
    sellerPayment: monthlyPayment(sellerLoan, number(deal.sellerInterestRate) / 100, number(deal.sellerTermYears)),
    acquisitionDownPaymentAmount,
    cashNeededAtAcquisition
  };
}

function totalBasis(deal) {
  return number(deal.purchasePrice) + number(deal.rehabBudget) + closingCostsAmount(deal);
}

function closingCostsAmount(deal) {
  if (deal.closingCostsMode === "amount") return number(deal.closingCosts);
  return number(deal.purchasePrice) * (number(deal.closingCosts) / 100);
}

function normalizeClosingCostsPercent(deal) {
  if (deal.closingCostsMode === "amount") return number(deal.closingCosts);
  const closingCosts = number(deal.closingCosts);
  const purchasePrice = number(deal.purchasePrice);
  if (!closingCosts || !purchasePrice) return closingCosts;
  if (closingCosts > 100) return (closingCosts / purchasePrice) * 100;
  return closingCosts;
}
function monthlyPayment(principal, annualRate, termYears) {
  const monthlyRate = annualRate / 12;
  const payments = Math.max(termYears * 12, 1);
  if (!principal) return 0;
  if (!monthlyRate) return principal / payments;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1);
}

function amortizedPrincipalPaydown(principal, annualRate, termYears, monthsElapsed) {
  const payment = monthlyPayment(principal, annualRate, termYears);
  const monthlyRate = annualRate / 12;
  let balance = principal;
  for (let i = 0; i < monthsElapsed; i += 1) {
    const interest = balance * monthlyRate;
    const principalPaid = payment - interest;
    balance = Math.max(balance - principalPaid, 0);
    if (balance === 0) break;
  }
  return principal - balance;
}

function calculateGrowingAnnualSeries(baseAmount, growthRate, years) {
  let total = 0;
  for (let year = 0; year < years; year += 1) {
    total += baseAmount * Math.pow(1 + growthRate, year);
  }
  return total;
}

function getSelectedDeal() {
  return state.deals.find((deal) => deal.id === state.selectedDealId) ?? null;
}

async function loadDealsFromSupabase() {
  const { data, error } = await supabase.from("deals").select("*").order("updated_at", { ascending: false });
  if (error) {
    elements.importStatus.textContent = error.message;
    return [];
  }
  return (data ?? []).map(recordToDeal);
}

async function loadImportsFromSupabase() {
  const { data, error } = await supabase.from("deal_imports").select("*").order("created_at", { ascending: false }).limit(10);
  if (error) {
    elements.importStatus.textContent = error.message;
    return [];
  }
  return data ?? [];
}

async function upsertDeal(deal) {
  const payload = dealToInsertRecord(deal);
  const { data, error } = await supabase.from("deals").upsert(payload).select().single();
  if (error) throw error;
  return recordToDeal(data);
}

function dealToInsertRecord(deal) {
  return {
    id: deal.id,
    user_id: state.user.id,
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
    updated_at: deal.updatedAt || new Date().toISOString()
  };
}

function recordToDeal(record) {
  return hydrateDealDefaults({
    ...(record.payload ?? {}),
    id: record.id,
    name: record.name,
    market: record.market,
    assetType: record.asset_type,
    stage: record.stage,
    dealStrategy: record.deal_strategy,
    financingType: record.financing_type,
    sourceUrl: record.source_url || "",
    notes: record.notes || "",
    nextAction: record.next_action || "",
    updatedAt: record.updated_at
  });
}

function importTitle(item) {
  if (item.source_url) return `${humanizeHostname(item.source_url)} listing`;
  if (item.raw_text) return item.raw_text.slice(0, 48);
  return "PDF import";
}

function importSourceLabel(item) {
  if (item.source_type === "url" && item.source_url) {
    return humanizeHostname(item.source_url);
  }
  if (item.source_type === "pdf") return "PDF";
  if (item.source_type === "text") return "Text";
  return item.source_type || "Import";
}

function importStatusLabel(status) {
  if (status === "pending") return "queued";
  return status || "saved";
}

function humanizeHostname(url) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return hostname
      .split(".")
      .slice(0, -1)
      .join(".")
      .replace(/-/g, " ");
  } catch (_error) {
    return "Listing";
  }
}

function setAuthMessage(message, isError = false) {
  elements.authMessage.textContent = message;
  elements.authMessage.style.color = isError ? "var(--danger)" : "var(--muted)";
}

function safeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function number(value) {
  return Number(value) || 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);
}

function formatRelativeDate(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffHours = Math.max(Math.round(diffMs / (1000 * 60 * 60)), 0);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.round(diffHours / 24)}d ago`;
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateString));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
