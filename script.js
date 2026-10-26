// ==============================================================================
// ScholarSync / Yojna Sathi - Regional Schemes Master Database
// Master dataset for West Bengal, Assam, and Sikkim
// ==============================================================================

const HELP = "1800-102-8014";

var schemes = [
  // ============================================================================
  // 1. WEST BENGAL STATE SCHEMES
  // ============================================================================
  {
    id: "svmcm",
    name: "Swami Vivekananda Merit-cum-Means Scholarship (SVMCM)",
    short: "SVMCM",
    state: "West Bengal",
    stateCode: "WB",
    category: "Education",
    dept: "Dept. of Higher Education, Govt. of West Bengal",
    icon: "award",
    color: "bg-emerald-800",
    status: "open",
    window: "July to November annually",
    deadline: "Check portal – usually early November",
    target: "Class 11, 12, Undergrad, Postgrad, Doctoral students.",
    elig: "WB domicile, family income ≤ ₹2.5 Lakh/year, min 60% marks (H.S./UG).",
    mode: "Online",
    helpline: "1800-102-8014",
    docs: [
      ["Qualifying mark sheet (both sides)", "m"],
      ["Current course admission receipt", "m"],
      ["Family income certificate (BDO/SDO)", "m"],
      ["Domicile proof (Aadhaar/Voter)", "m"],
      ["Bank passbook copy (first page with IFSC)", "m"],
      ["Passport size photo & signature", "m"],
      ["Caste certificate (SC/ST/OBC)", "o"],
      ["Birth certificate", "o"],
      ["Disability certificate (if applicable)", "o"]
    ]
  },
  {
    id: "oasis",
    name: "OASIS Scholarship (SC/ST/OBC Post-Matric)",
    short: "OASIS",
    state: "West Bengal",
    stateCode: "WB",
    category: "Caste Welfare",
    dept: "Backward Classes Welfare & Tribal Development Dept, WB",
    icon: "book-open",
    color: "bg-lime-900",
    status: "closing",
    window: "August to December annually",
    deadline: "Closing soon – check portal",
    target: "SC, ST, and OBC students from Class 9 to Post-Graduation.",
    elig: "Permanent WB resident belonging to reserved categories, family income limits apply.",
    mode: "Online",
    helpline: "033-2287-7687",
    docs: [
      ["Caste certificate issued by competent authority", "m"],
      ["Passport size photograph", "m"],
      ["Last qualifying mark sheet", "m"],
      ["Family income certificate", "m"],
      ["Bank account passbook with IFSC", "m"],
      ["Course admission fee receipt", "m"],
      ["Aadhaar card copy", "m"],
      ["Residential proof", "o"],
      ["Birth certificate", "o"]
    ]
  },
  {
    id: "aikya",
    name: "Aikyashree Scholarship (WBMDFC)",
    short: "Aikyashree",
    state: "West Bengal",
    stateCode: "WB",
    category: "Minority Welfare",
    dept: "West Bengal Minorities' Development & Finance Corporation",
    icon: "users",
    color: "bg-zinc-800",
    status: "soon",
    window: "July to November annually",
    deadline: "To be announced",
    target: "Students from minority communities (Buddhist, Christian, Jain, Muslim, Parsi, Sikh) from Class 1 to Ph.D.",
    elig: "WB resident, minority community, min 50% marks in last exam, family income ≤ ₹2 Lakh.",
    mode: "Online",
    helpline: "1800-120-2130",
    docs: [
      ["Self-declaration minority community form", "m"],
      ["Previous qualifying mark sheet", "m"],
      ["Current admission fee receipt", "m"],
      ["Family income certificate", "m"],
      ["Bank passbook details", "m"],
      ["Address / Domicile proof", "m"],
      ["Passport size photo", "o"],
      ["Birth certificate", "o"]
    ]
  },
  {
    id: "kanya",
    name: "Kanyashree Prakalpa (K1 & K2)",
    short: "Kanyashree",
    state: "West Bengal",
    stateCode: "WB",
    category: "Girl Child Welfare",
    dept: "Dept. of Women & Child Development and Social Welfare, WB",
    icon: "heart-handshake",
    color: "bg-emerald-900",
    status: "open",
    window: "Rolling – through school/college session",
    deadline: "Within the academic year",
    target: "Unmarried girl students aged 13-19 enrolled in recognized institutions.",
    elig: "Unmarried girl student, WB resident, enrolled in Class 8+ or equivalent, family income limits apply.",
    mode: "Online + Offline (via school)",
    helpline: "1800-102-8014",
    docs: [
      ["Aadhaar card", "m"],
      ["Age proof (birth certificate)", "m"],
      ["Bank passbook (single/joint account with guardian)", "m"],
      ["Institution enrolment proof", "m"],
      ["Residential proof", "m"],
      ["Family income certificate / self-declaration", "o"],
      ["Disability certificate (if applicable)", "o"]
    ]
  },
  {
    id: "nabanna",
    name: "WB Chief Minister's Relief Fund (Nabanna / Uttaran)",
    short: "Nabanna / Uttaran",
    state: "West Bengal",
    stateCode: "WB",
    category: "Financial Aid",
    dept: "Chief Minister's Office, Government of West Bengal",
    icon: "landmark",
    color: "bg-zinc-800",
    status: "open",
    window: "Year-round (Peak June to October after board results)",
    deadline: "Rolling throughout the academic year",
    target: "Students not receiving SVMCM/other major scholarships studying in WB.",
    elig: "WB resident, family income ≤ ₹1.2 Lakh, min 50-60% aggregate marks.",
    mode: "Online / Offline",
    helpline: "033-2214-5555",
    docs: [
      ["MLA / Gazetted Officer recommendation letter", "m"],
      ["Student self-declaration form", "m"],
      ["Family income certificate (BDO/SDO)", "m"],
      ["Mark sheets of last qualifying exam", "m"],
      ["Current course admission receipt", "m"],
      ["Bank passbook copy or cancelled cheque", "m"],
      ["Aadhaar card", "m"]
    ]
  },
  {
    id: "tarun",
    name: "Taruner Swapna (Free Tablet Scheme)",
    short: "Taruner Swapna",
    state: "West Bengal",
    stateCode: "WB",
    category: "Youth Tech",
    dept: "School Education Department, Govt. of West Bengal",
    icon: "tablet",
    color: "bg-lime-900",
    status: "soon",
    window: "September to December annually",
    deadline: "Processed via school portal",
    target: "Students enrolled in Class 12 in state government-run or aided schools.",
    elig: "Regular Class 12 student in West Bengal educational institution.",
    mode: "School Route",
    helpline: "1800-102-8014",
    docs: [
      ["School ID card", "m"],
      ["Active single-holder bank account details (Aadhaar seeded)", "m"],
      ["Student / guardian school declaration form", "m"],
      ["Aadhaar card copy", "m"]
    ]
  },
  {
    id: "wbscc",
    name: "West Bengal Student Credit Card (WBSCC)",
    short: "WBSCC",
    state: "West Bengal",
    stateCode: "WB",
    category: "Education Loan",
    dept: "Higher Education Dept, Govt. of West Bengal",
    icon: "credit-card",
    color: "bg-emerald-800",
    status: "open",
    window: "Open year-round",
    deadline: "Open round the year",
    target: "Students pursuing secondary, UG, PG, vocational, or professional courses.",
    elig: "Resident of WB for at least 10 years, loan up to ₹10 Lakh at nominal interest.",
    mode: "Online Portal",
    helpline: "1800-102-8014",
    docs: [
      ["Co-borrower / guardian income proof", "m"],
      ["PAN card (student and co-borrower)", "m"],
      ["Admission proof with breakdown of fees", "m"],
      ["Residence proof", "m"],
      ["Scanned passport photo & signature", "m"],
      ["Academic mark sheets", "m"],
      ["Bank account details (passbook copy)", "m"]
    ]
  },

  // ============================================================================
  // 2. ASSAM STATE SCHEMES
  // ============================================================================
  {
    id: "pragyan",
    name: "Assam Pragyan Bharti Scooty / Financial Scheme",
    short: "Pragyan Bharti",
    state: "Assam",
    stateCode: "AS",
    category: "Youth Merit",
    dept: "Higher Education Department, Government of Assam",
    icon: "sparkles",
    color: "bg-emerald-700",
    status: "open",
    window: "August to November following exam results",
    deadline: "Check DHE Assam portal",
    target: "High-achieving students passing Higher Secondary (AHSEC) or Graduation exams.",
    elig: "Assam resident, secured first division/prescribed cut-off marks in board/university exams.",
    mode: "Online",
    helpline: "0361-255-0866",
    docs: [
      ["AHSEC / Graduation mark sheet", "m"],
      ["Pass certificate", "m"],
      ["Institutional verification certificate", "m"],
      ["Bank account details", "m"],
      ["Passport size photograph", "m"],
      ["Aadhaar card", "m"],
      ["Permanent Resident Certificate (PRC)", "o"]
    ]
  },
  {
    id: "assam_postmatric",
    name: "Assam Post-Matric Scholarship for SC, ST, and OBC",
    short: "Assam Post-Matric",
    state: "Assam",
    stateCode: "AS",
    category: "Caste Welfare",
    dept: "WPTBC Dept, Government of Assam",
    icon: "book-open",
    color: "bg-lime-900",
    status: "open",
    window: "July to October annually",
    deadline: "Check state portal",
    target: "SC, ST, and OBC students pursuing post-matriculation or post-secondary courses.",
    elig: "Permanent resident of Assam, annual family income criteria based on category rules.",
    mode: "Online Portal",
    helpline: "1800-345-3532",
    docs: [
      ["Caste certificate issued by competent authority", "m"],
      ["Family income certificate", "m"],
      ["Previous qualifying exam mark sheet", "m"],
      ["Course admission fee receipt", "m"],
      ["Bank account passbook copy linked with Aadhaar", "m"],
      ["Permanent Resident Certificate (PRC) / Domicile proof", "m"],
      ["Passport size photo", "o"]
    ]
  },
  {
    id: "assam_minority",
    name: "Assam Minority Scholarship (State Merit & Means)",
    short: "Assam Minority",
    state: "Assam",
    stateCode: "AS",
    category: "Minority Welfare",
    dept: "Directorate of Minority Welfare, Government of Assam",
    icon: "users",
    color: "bg-zinc-800",
    status: "soon",
    window: "August to November",
    deadline: "Check portal for dates",
    target: "Students belonging to notified minority communities studying in Assam.",
    elig: "Assam domicile, minimum 50% marks in last exam, family income restriction.",
    mode: "Online",
    helpline: "0361-223-7224",
    docs: [
      ["Minority community declaration form", "m"],
      ["Mark sheets of last qualifying exam", "m"],
      ["Current course admission receipt", "m"],
      ["Family income proof / certificate", "m"],
      ["Bank passbook copy", "m"],
      ["Address / Residential proof", "m"],
      ["Aadhaar card", "o"]
    ]
  },

  // ============================================================================
  // 3. SIKKIM STATE SCHEMES
  // ============================================================================
  {
    id: "sikkim_merit",
    name: "Sikkim State Merit Scholarship Scheme",
    short: "Sikkim Merit",
    state: "Sikkim",
    stateCode: "SK",
    category: "Education",
    dept: "Education Department, Government of Sikkim",
    icon: "award",
    color: "bg-emerald-700",
    status: "open",
    window: "June to September annually",
    deadline: "Check department portal",
    target: "Meritorious students pursuing higher education inside or outside Sikkim.",
    elig: "Sikkim Subject Certificate (SSC) or Certificate of Identification (COI) holder, high academic merit.",
    mode: "Education Dept",
    helpline: "03592-202-238",
    docs: [
      ["COI / Sikkim Subject Certificate", "m"],
      ["Academic transcripts / mark sheets", "m"],
      ["Institution admission proof", "m"],
      ["Income certificate issued by competent magistrate", "m"],
      ["Bank account details (first page of passbook)", "m"],
      ["Passport size photos", "m"],
      ["Recommendation letter from Head of Institution", "o"]
    ]
  },
  {
    id: "sikkim_postmatric",
    name: "Sikkim Post-Matric Scholarship for SC, ST, and OBC",
    short: "Sikkim Post-Matric",
    state: "Sikkim",
    stateCode: "SK",
    category: "Caste Welfare",
    dept: "Social Welfare Department, Government of Sikkim",
    icon: "book-open",
    color: "bg-lime-900",
    status: "open",
    window: "July to November",
    deadline: "Check portal",
    target: "Reserved category students pursuing higher studies post-matriculation.",
    elig: "Permanent resident/COI holder of Sikkim, belonging to notified SC/ST/OBC groups.",
    mode: "Online",
    helpline: "03592-280-362",
    docs: [
      ["COI / Residential Certificate", "m"],
      ["Category / Caste certificate", "m"],
      ["Family income proof", "m"],
      ["Mark sheets of previous examination", "m"],
      ["Fee structure receipt from institution", "m"],
      ["Bank passbook copy", "m"],
      ["Aadhaar card copy", "o"]
    ]
  },
  {
    id: "sikkim_cm_youth",
    name: "Sikkim Chief Minister's Youth Empowerment Scheme",
    short: "Sikkim CM Youth",
    state: "Sikkim",
    stateCode: "SK",
    category: "Youth Skill",
    dept: "Skill Development Department, Government of Sikkim",
    icon: "zap",
    color: "bg-zinc-800",
    status: "open",
    window: "Open year-round with periodic intake cycles",
    deadline: "Rolling intake cycles",
    target: "Unemployed youth and citizens seeking skill training, entrepreneurship, or higher vocational support.",
    elig: "Sikkim citizen / COI holder meeting age and skill criteria.",
    mode: "Departmental",
    helpline: "03592-202-764",
    docs: [
      ["COI / Sikkim Subject Certificate", "m"],
      ["Voter ID / Aadhaar card", "m"],
      ["Educational qualification certificates / mark sheets", "m"],
      ["Skill training application form", "m"],
      ["Bank account details", "m"],
      ["Passport size photograph", "o"]
    ]
  }
];

// Status badge styling (earthy, soft tones)
var statusUI = {
  open: ["Applications Open", "bg-emerald-100 text-emerald-800 border border-emerald-200"],
  closing: ["Closing Soon", "bg-amber-100 text-amber-800 border border-amber-200"],
  soon: ["Opens Soon", "bg-stone-200 text-stone-700 border border-stone-300"]
};

if (typeof window !== "undefined") {
  window.schemes = schemes;
  window.statusUI = statusUI;
}

// Active filters
var activeState = "all";
var searchQuery = "";

// Alternatives knowledge base for the AI Sync Assistant
const kb = [
  { k: ["birth"], t: "Birth certificate", a: "You can usually use your <b>Aadhaar card</b> or your <b>Madhyamik/Class 10 admit card</b> as date-of-birth proof. Upload whichever you have – Aadhaar is the most widely accepted.", call: false },
  { k: ["coi", "identification", "sikkim subject", "ssc"], t: "COI / Sikkim Subject Certificate", a: "For Sikkim scholarships, a <b>Certificate of Identification (COI)</b> or <b>Sikkim Subject Certificate</b> issued by the competent Revenue/District Magistrate is mandatory. Domicile proof alone cannot replace COI.", call: true },
  { k: ["prc", "permanent resident"], t: "Permanent Resident Certificate (PRC)", a: "In Assam, a <b>Permanent Resident Certificate (PRC)</b> is issued by the Deputy Commissioner / Sub-Divisional Officer. If yours is pending, your parent's PRC or PRC application acknowledgement number may be accepted temporarily.", call: true },
  { k: ["aadhaar", "aadhar", "adhar"], t: "Aadhaar card", a: "Download your official <b>e-Aadhaar</b> from the UIDAI portal or DigiLocker using your registered mobile number. If you haven't received Aadhaar, an enrolment slip is sometimes accepted temporarily.", call: true },
  { k: ["income", "salary"], t: "Income certificate", a: "Income certificates are typically issued by your <b>BDO / SDO / Municipality Executive Officer / Revenue Inspector</b>. In some schemes, a gazetted officer salary slip or employer certificate is valid.", call: true },
  { k: ["mla", "recommendation", "gazetted"], t: "MLA / Gazetted Recommendation", a: "For WB Chief Minister's Relief Fund (Nabanna), request your local elected <b>MLA or a Group-A Gazetted Officer</b> to provide a signed recommendation letter on their official letterhead.", call: false },
  { k: ["caste", "community", "minority"], t: "Caste / community certificate", a: "There is no direct substitute for this certificate. Apply via the state caste certificate portal or at the <b>SDO/BDO office</b>. Your parent's certificate may be accepted during interim processing.", call: true },
  { k: ["resid", "domicile", "address"], t: "Residential / Domicile proof", a: "Commonly accepted proofs include your <b>Ration card, Voter ID, electricity bill, or Aadhaar address</b>.", call: false },
  { k: ["bank", "passbook", "account"], t: "Bank passbook", a: "A <b>bank statement or cancelled cheque</b> clearly displaying your name, account number, and IFSC code is acceptable. Payments can only be disbursed to active single-holder bank accounts.", call: true },
  { k: ["marksheet", "mark sheet", "admit", "result", "transcript", "ahsec"], t: "Marksheet / Academic transcript", a: "Download a verified digital copy from <b>DigiLocker</b> or your board portal (WBBSE, WBCHSE, AHSEC, or university portal). An attested copy from your institution head also works.", call: false },
  { k: ["photo", "signature", "sign"], t: "Photo / signature", a: "Use the <b>Built-in Compressor</b> on this page. Take a well-lit photo against a plain background and shrink it to meet portal size limits (under 50KB or 100KB).", call: false },
  { k: ["disab"], t: "Disability certificate", a: "Only required if you are applying under the PwD / disability quota. If not applicable, you can safely skip it.", call: true }
];

var cur = null, checked = {};

function showHome() {
  home.classList.remove("hidden");
  detail.classList.add("hidden");
  const vaultView = document.getElementById("vault");
  if (vaultView) vaultView.classList.add("hidden");
  window.scrollTo(0, 0);
}

function showVault() {
  home.classList.add("hidden");
  detail.classList.add("hidden");
  const vaultView = document.getElementById("vault");
  if (vaultView) {
    vaultView.classList.remove("hidden");
    if (typeof renderVault === "function") renderVault();
  }
  window.scrollTo(0, 0);
}

function setFilter(state) {
  activeState = state;
  renderHome();
}

function handleSchemeSearch(query) {
  searchQuery = query.toLowerCase().trim();
  renderHome();
}

function renderFilterBar() {
  const bar = document.getElementById("stateFilterBar");
  if (!bar) return;

  const counts = {
    all: schemes.length,
    wb: schemes.filter(s => s.stateCode === "WB").length,
    as: schemes.filter(s => s.stateCode === "AS").length,
    sk: schemes.filter(s => s.stateCode === "SK").length
  };

  const tabs = [
    { key: "all", label: "All Regions", count: counts.all, icon: "layers" },
    { key: "wb", label: "West Bengal", count: counts.wb, icon: "map-pin" },
    { key: "as", label: "Assam", count: counts.as, icon: "map-pin" },
    { key: "sk", label: "Sikkim", count: counts.sk, icon: "map-pin" }
  ];

  bar.innerHTML = tabs.map(t => {
    const isAct = activeState === t.key;
    return `
      <button onclick="setFilter('${t.key}')" class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${isAct ? "bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-900" : "bg-stone-200/80 hover:bg-stone-300 text-stone-700"}">
        <i data-lucide="${t.icon}" class="w-3.5 h-3.5"></i>
        <span>${t.label}</span>
        <span class="text-[10px] ml-1 px-1.5 py-0.2 rounded-full ${isAct ? "bg-emerald-950/60 text-emerald-200" : "bg-stone-300 text-stone-700"}">${t.count}</span>
      </button>
    `;
  }).join("");
}

function renderHome() {
  renderFilterBar();

  const grid = document.getElementById("schemeGrid");
  if (!grid) return;

  // Filter schemes by active state and search query
  const filtered = schemes.filter(s => {
    const matchesState = activeState === "all" || s.stateCode.toLowerCase() === activeState.toLowerCase();
    const matchesSearch = !searchQuery ||
      s.name.toLowerCase().includes(searchQuery) ||
      s.dept.toLowerCase().includes(searchQuery) ||
      s.elig.toLowerCase().includes(searchQuery) ||
      s.state.toLowerCase().includes(searchQuery) ||
      s.category.toLowerCase().includes(searchQuery);
    return matchesState && matchesSearch;
  });

  const badge = document.getElementById("schemeCountBadge");
  if (badge) {
    badge.textContent = `${filtered.length} of ${schemes.length} Schemes`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="sm:col-span-2 text-center py-12 px-4 bg-white rounded-2xl border border-stone-200">
        <div class="w-12 h-12 rounded-xl bg-stone-100 text-stone-400 grid place-items-center mx-auto mb-3">
          <i data-lucide="search-x" class="w-6 h-6"></i>
        </div>
        <p class="font-bold text-stone-800">No scholarships found</p>
        <p class="text-xs text-stone-500 mt-1 max-w-sm mx-auto">No scholarships matched "${searchQuery}". Try selecting "All Regions" or clearing your search query.</p>
        <button onclick="searchQuery='';const i=document.getElementById('schemeSearchInput');if(i)i.value='';setFilter('all')" class="mt-4 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition">
          Reset All Filters
        </button>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  grid.innerHTML = filtered.map(s => `
    <button onclick="openScheme('${s.id}')" class="text-left bg-white rounded-2xl border border-stone-200 hover:border-emerald-700 hover:shadow-md transition p-5 flex flex-col justify-between group">
      <div>
        <div class="flex items-start justify-between gap-3 mb-2">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl ${s.color} text-stone-50 grid place-items-center shrink-0 shadow-sm">
              <i data-lucide="${s.icon}" class="w-5 h-5"></i>
            </div>
            <div class="min-w-0">
              <h3 class="font-bold text-stone-900 leading-snug group-hover:text-emerald-850 transition">${s.name}</h3>
              <p class="text-xs text-stone-500 truncate mt-0.5">${s.dept}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-1.5 my-3">
          <span class="inline-block text-[11px] font-semibold rounded-full px-2.5 py-0.5 ${statusUI[s.status][1]}">● ${statusUI[s.status][0]}</span>
          <span class="inline-flex items-center gap-1 text-[11px] font-medium bg-stone-100 text-stone-700 rounded-full px-2.5 py-0.5 border border-stone-200">
            <i data-lucide="map-pin" class="w-3 h-3 text-emerald-700"></i> ${s.state}
          </span>
          <span class="inline-block text-[11px] font-medium bg-emerald-50 text-emerald-800 rounded-full px-2.5 py-0.5 border border-emerald-100">
            ${s.category}
          </span>
        </div>

        <ul class="space-y-1.5 text-xs text-stone-600 mt-2">
          <li class="flex gap-2"><i data-lucide="calendar" class="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-700"></i><span><b>Window:</b> ${s.window}</span></li>
          <li class="flex gap-2"><i data-lucide="user-check" class="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-700"></i><span class="line-clamp-2"><b>Eligibility:</b> ${s.elig}</span></li>
          <li class="flex gap-2"><i data-lucide="globe" class="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-700"></i><span><b>Mode:</b> ${s.mode}</span></li>
          <li class="flex gap-2"><i data-lucide="file-check-2" class="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-700"></i><span><b>Prerequisites:</b> ${s.docs.filter(d => d[1] === "m").length} mandatory documents</span></li>
        </ul>
      </div>

      <div class="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
        <span class="text-stone-500 font-normal">Pre-flight readiness audit</span>
        <span class="inline-flex items-center gap-1 text-emerald-800 font-bold group-hover:translate-x-0.5 transition">View Documents <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></span>
      </div>
    </button>
  `).join("");

  if (window.lucide) lucide.createIcons();
}

function openScheme(id) {
  cur = schemes.find(s => s.id === id);
  checked = {};
  if (typeof window !== "undefined") window.cur = cur;

  home.classList.add("hidden");
  detail.classList.remove("hidden");
  const vaultView = document.getElementById("vault");
  if (vaultView) vaultView.classList.add("hidden");
  window.scrollTo(0, 0);

  dLogo.className = `w-14 h-14 rounded-2xl grid place-items-center text-white shrink-0 shadow-sm ${cur.color}`;
  dLogo.innerHTML = `<i data-lucide="${cur.icon}" class="w-7 h-7"></i>`;
  dName.textContent = cur.name;
  dDept.innerHTML = `<span class="inline-flex items-center gap-1 font-semibold text-emerald-800 mr-2"><i data-lucide="map-pin" class="w-3.5 h-3.5"></i> ${cur.state}</span> • <span>${cur.dept}</span>`;
  dStatus.textContent = "● " + statusUI[cur.status][0];
  dStatus.className = "text-xs font-semibold rounded-full px-3 py-1 " + statusUI[cur.status][1];
  dWindow.textContent = cur.window;
  dDeadline.textContent = cur.deadline;
  dElig.textContent = cur.elig;
  dMode.textContent = cur.mode;
  dHelp.textContent = cur.helpline;
  dHelp.href = "tel:" + cur.helpline.replace(/-/g, "");

  const li = (d, i) => {
    // Automatically pre-tick if this document exists in the student's Digital Vault
    const inVault = typeof hasVaultDocument === "function" && hasVaultDocument(d[0]);
    if (inVault) {
      checked[i] = true;
    }
    const isChecked = !!checked[i];

    return `<li class="flex items-center gap-3 rounded-xl border ${isChecked ? "border-emerald-300 bg-emerald-50/70" : "border-stone-200 bg-white"} p-3 transition" id="row${i}">
      <input type="checkbox" id="c${i}" ${isChecked ? "checked" : ""} class="w-5 h-5 accent-emerald-700 cursor-pointer" onchange="tick(${i},this.checked)">
      <div class="flex-1 flex flex-wrap items-center gap-2">
        <label for="c${i}" class="text-xs sm:text-sm font-medium text-stone-800 cursor-pointer">${d[0]}</label>
        ${inVault ? `<span class="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full"><i data-lucide="shield-check" class="w-3 h-3 text-emerald-700"></i> In Vault</span>` : ""}
      </div>
      <button onclick="askAbout('${d[0].replace(/'/g, "")}')" class="text-xs text-emerald-800 font-semibold hover:underline whitespace-nowrap">Don’t have it?</button></li>`;
  };

  mList.innerHTML = cur.docs.map((d, i) => d[1] === "m" ? li(d, i) : "").join("");
  oList.innerHTML = cur.docs.map((d, i) => d[1] === "o" ? li(d, i) : "").join("");
  startMsg.classList.add("hidden");
  updateAudit();
  resetChat();
  lucide.createIcons();
}

function tick(i, v) {
  checked[i] = v;
  document.getElementById("row" + i).className = "flex items-center gap-3 rounded-xl border p-3 transition " + (v ? "border-emerald-300 bg-emerald-50/70" : "border-stone-200 bg-white");
  updateAudit();
}

function updateAudit() {
  const mand = cur.docs.map((d, i) => [d, i]).filter(x => x[0][1] === "m");
  const have = mand.filter(x => checked[x[1]]).length;
  const pct = Math.round((have / mand.length) * 100);
  pFill.style.width = pct + "%";
  pText.textContent = pct + "%";
  pBar.setAttribute("aria-valuenow", pct);
  pFill.className = "h-full transition-all duration-500 " + (pct === 100 ? "bg-emerald-600" : pct >= 50 ? "bg-emerald-700" : "bg-amber-500");
  pMsg.textContent = pct === 100
    ? "You’re ready for take-off! All mandatory documents are in place."
    : `${have} of ${mand.length} mandatory documents ready. ${mand.length - have} to go.`;
}

function startApp() {
  const miss = cur.docs.filter((d, i) => d[1] === "m" && !checked[i]).map(d => d[0]);
  startMsg.classList.remove("hidden");
  if (miss.length) {
    startMsg.className = "text-xs sm:text-sm mt-3 p-3.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200";
    startMsg.innerHTML = `<b>Hold on – ${miss.length} mandatory document(s) not ready:</b> ${miss.join(", ")}. Use “Don’t have it?” for legal alternatives.`;
  } else {
    startMsg.className = "text-xs sm:text-sm mt-3 p-3.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200";
    startMsg.innerHTML = "✅ All set! All prerequisite documents verified. Proceed to portal application (demo).";
  }
}

/* ---------- AI Assistant ---------- */
function bot(h) {
  chat.insertAdjacentHTML("beforeend", `<div class="flex gap-2"><span class="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 grid place-items-center shrink-0"><i data-lucide="bot" class="w-4 h-4"></i></span><div class="bg-stone-100 rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%] text-stone-800">${h}</div></div>`);
  end();
}
function me(t) {
  const d = document.createElement("div");
  d.className = "flex justify-end";
  d.innerHTML = `<div class="bg-emerald-800 text-stone-50 rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%]"></div>`;
  d.firstChild.textContent = t;
  chat.appendChild(d);
  end();
}
function end() {
  lucide.createIcons();
  chat.scrollTop = chat.scrollHeight;
}

function resetChat() {
  chat.innerHTML = "";
  bot("Hi! 👋 Tell me which document you <b>don’t have</b> and I’ll suggest valid substitutes for " + (cur ? cur.state : "your scholarship") + ".");
  chips.innerHTML = ["Birth certificate", "COI / Sikkim Subject", "Income certificate", "Bank passbook", "PRC Assam"]
    .map(c => `<button onclick="askAbout('${c}')" class="text-xs border border-stone-300 rounded-full px-3 py-1 hover:bg-stone-100 text-stone-700 transition">${c}</button>`).join("");
}
function askAbout(d) {
  me("I don’t have: " + d);
  reply(d);
}
function sendChat(e) {
  e.preventDefault();
  const v = chatIn.value.trim();
  if (!v) return;
  me(v);
  chatIn.value = "";
  reply(v);
}
function openAI() {
  aiBox.scrollIntoView({ behavior: "smooth" });
  chatIn.focus();
}

function reply(t) {
  const s = t.toLowerCase();
  const hit = kb.find(x => x.k.some(k => s.includes(k)));
  setTimeout(() => {
    if (!hit) {
      bot(`I’m not sure about that one. Please call the helpline for ${cur.state}: <a class="font-bold text-emerald-800 underline" href="tel:${cur.helpline.replace(/-/g, "")}">${cur.helpline}</a> and they’ll guide you.`);
      return;
    }
    let h = `<p class="font-semibold text-stone-900 mb-1">${hit.t} missing – guidance:</p><p class="text-stone-700">${hit.a}</p>`;
    if (hit.call) h += `<p class="mt-2 p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs border border-emerald-100">📞 Not sure it will be accepted? Call <a class="font-bold underline" href="tel:${cur.helpline.replace(/-/g, "")}">${cur.helpline}</a> to verify.</p>`;
    h += `<p class="mt-2 text-[10px] text-stone-500">Official rules apply. Final acceptance rests with the department.</p>`;
    bot(h);
  }, 400);
}

/* ---------- Image compressor ---------- */
function compress(f) {
  if (!f) return;
  window._f = f;
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    const sc = Math.min(1, 1200 / Math.max(img.width, img.height));
    c.width = img.width * sc;
    c.height = img.height * sc;
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    c.toBlob(b => {
      const url = URL.createObjectURL(b);
      const size = n => (n / 1024).toFixed(0) + " KB";
      cOut.classList.remove("hidden");
      cOut.innerHTML = `<p class="rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 text-xs">${size(f.size)} → <b>${size(b.size)}</b> (${Math.max(0, Math.round((1 - b.size / f.size) * 100))}% smaller)</p>
      <a href="${url}" download="compressed.jpg" class="mt-2 block text-center bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl py-2 text-xs font-semibold transition">Download Compressed File</a>`;
    }, "image/jpeg", q.value / 100);
  };
  img.src = URL.createObjectURL(f);
}

if (typeof document !== "undefined") {
  renderHome();
  lucide.createIcons();
}
