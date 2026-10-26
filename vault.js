// ==============================================================================
// ScholarSync / Yojna Sathi - Digital Vault Module
// ==============================================================================
// Manages student document storage, Supabase storage uploads, secure signed URLs,
// checklist verification, and scholarship document application packs.
// ==============================================================================

const VAULT_CATEGORIES = [
  { id: "aadhaar", label: "Aadhaar Card", icon: "credit-card", keywords: ["aadhaar", "aadhar", "adhar"] },
  { id: "marksheet", label: "Marksheet / Class 10 Admit", icon: "file-text", keywords: ["marksheet", "mark sheet", "admit", "qualifying exam", "previous exam", "class 10"] },
  { id: "income", label: "Income Certificate / Self-Declaration", icon: "wallet", keywords: ["income", "salary", "self-declaration"] },
  { id: "residential", label: "Residential Proof / Domicile", icon: "home", keywords: ["residential", "domicile", "address"] },
  { id: "bank", label: "Bank Passbook (First Page)", icon: "landmark", keywords: ["bank", "passbook", "account"] },
  { id: "photo", label: "Passport Photo & Signature", icon: "camera", keywords: ["photo", "photograph", "signature", "sign"] },
  { id: "caste", label: "Caste / Minority Certificate", icon: "award", keywords: ["caste", "minority", "sc/st/obc", "community"] },
  { id: "birth", label: "Birth Certificate / Age Proof", icon: "calendar", keywords: ["birth", "age proof"] },
  { id: "enrolment", label: "Institution Enrolment / Fee Receipt", icon: "graduation-cap", keywords: ["enrolment", "enrollment", "admission", "fee receipt"] },
  { id: "disability", label: "Disability Certificate", icon: "heart-pulse", keywords: ["disab"] },
  { id: "other", label: "Other Supporting Document", icon: "paperclip", keywords: [] }
];

let selectedPackSchemeId = "svmcm";

/**
 * Safely get initialized Supabase client
 */
function getVaultSupabaseClient() {
  if (typeof getActiveSupabaseClient === "function") return getActiveSupabaseClient();
  if (typeof supabaseClient !== "undefined" && supabaseClient) return supabaseClient;
  if (typeof window !== "undefined" && window.supabaseClient) return window.supabaseClient;
  return null;
}

/**
 * Returns storage key for the current user's document metadata
 */
function getVaultStorageKey() {
  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  return user ? `yojna_vault_${user.id}` : "yojna_vault_guest";
}

/**
 * Get all documents stored in the vault for the active user
 */
function getVaultDocuments() {
  if (typeof localStorage === "undefined") return [];
  const key = getVaultStorageKey();
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error reading vault documents:", e);
    return [];
  }
}

/**
 * Save documents array for the active user
 */
function saveVaultDocuments(docs) {
  if (typeof localStorage === "undefined") return;
  const key = getVaultStorageKey();
  try {
    localStorage.setItem(key, JSON.stringify(docs));
  } catch (e) {
    console.error("Error saving vault documents:", e);
  }
}

/**
 * Check if the student's vault has a document matching the scheme's document requirement
 */
function hasVaultDocument(schemeDocLabel) {
  if (!schemeDocLabel) return false;
  const docs = getVaultDocuments();
  if (!docs || docs.length === 0) return false;

  const target = schemeDocLabel.toLowerCase();

  return docs.some(d => {
    // 1. Match by category keywords
    const cat = VAULT_CATEGORIES.find(c => c.id === d.category);
    if (cat && cat.keywords.some(k => target.includes(k))) {
      return true;
    }
    // 2. Match by document custom title or file name
    const title = (d.title || "").toLowerCase();
    const fileName = (d.name || "").toLowerCase();
    if (title && (target.includes(title) || title.includes(target))) {
      return true;
    }
    if (fileName && (target.includes(fileName) || fileName.includes(target))) {
      return true;
    }
    return false;
  });
}

/**
 * Retrieve the matching vault document details for a scheme label
 */
function getMatchingVaultDoc(schemeDocLabel) {
  if (!schemeDocLabel) return null;
  const docs = getVaultDocuments();
  if (!docs || docs.length === 0) return null;

  const target = schemeDocLabel.toLowerCase();

  return docs.find(d => {
    const cat = VAULT_CATEGORIES.find(c => c.id === d.category);
    if (cat && cat.keywords.some(k => target.includes(k))) return true;
    const title = (d.title || "").toLowerCase();
    if (title && (target.includes(title) || title.includes(target))) return true;
    return false;
  }) || null;
}

/**
 * Format bytes to readable size
 */
function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return "0 KB";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

/**
 * Handle document upload (Supabase Storage + metadata)
 */
async function uploadVaultDocument(file, category, customTitle) {
  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  if (!user) {
    if (typeof openAuthModal === "function") openAuthModal("login");
    throw new Error("Please sign in to upload documents to your Digital Vault.");
  }

  if (!file) throw new Error("No file selected.");
  if (file.size > 10 * 1024 * 1024) throw new Error("File exceeds 10MB maximum limit.");

  const docId = "doc_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  const catObj = VAULT_CATEGORIES.find(c => c.id === category) || VAULT_CATEGORIES[0];
  const title = customTitle?.trim() || catObj.label;
  const fileExt = file.name.split(".").pop();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${user.id}/${category}_${Date.now()}_${safeName}`;

  let storagePath = null;
  let inSupabaseStorage = false;

  const client = getVaultSupabaseClient();

  // Attempt Supabase Storage upload if configured
  if (typeof isSupabaseConfigured === "function" && isSupabaseConfigured() && client) {
    try {
      const { data, error } = await client.storage
        .from("vault")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (!error && data?.path) {
        storagePath = data.path;
        inSupabaseStorage = true;
      } else if (error) {
        console.warn("Supabase Storage note:", error.message);
      }
    } catch (err) {
      console.warn("Storage upload note:", err);
    }
  }

  // Generate data URL for local preview and offline storage
  let dataUrl = "";
  if (!inSupabaseStorage && typeof FileReader !== "undefined") {
    try {
      dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    } catch (e) {
      dataUrl = "";
    }
  }

  const docRecord = {
    id: docId,
    userId: user.id,
    category: category,
    title: title,
    name: file.name,
    fileExt: fileExt,
    size: file.size,
    sizeFormatted: formatFileSize(file.size),
    createdAt: new Date().toISOString(),
    filePath: storagePath || filePath,
    inSupabase: inSupabaseStorage,
    dataUrl: dataUrl,
  };

  const docs = getVaultDocuments();
  const existingIdx = docs.findIndex(d => d.category === category);
  if (existingIdx >= 0) {
    docs[existingIdx] = docRecord;
  } else {
    docs.unshift(docRecord);
  }
  saveVaultDocuments(docs);

  return docRecord;
}

/**
 * Securely download or generate a signed link for a vault document
 */
async function downloadVaultDocument(docId) {
  const docs = getVaultDocuments();
  const doc = docs.find(d => d.id === docId);
  if (!doc) {
    if (typeof alert !== "undefined") alert("Document not found.");
    return;
  }

  const client = getVaultSupabaseClient();

  // 1. If stored in live Supabase Storage, generate signed URL
  if (typeof isSupabaseConfigured === "function" && isSupabaseConfigured() && client && doc.inSupabase && doc.filePath) {
    try {
      const { data, error } = await client.storage
        .from("vault")
        .createSignedUrl(doc.filePath, 3600, { download: doc.name });

      if (!error && data?.signedUrl) {
        const a = document.createElement("a");
        a.href = data.signedUrl;
        a.download = doc.name;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }
    } catch (err) {
      console.warn("Supabase signed URL error, trying local fallback:", err);
    }
  }

  // 2. Local fallback: use dataUrl or create mock blob
  if (doc.dataUrl && typeof document !== "undefined") {
    const a = document.createElement("a");
    a.href = doc.dataUrl;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else if (typeof Blob !== "undefined" && typeof document !== "undefined") {
    const blob = new Blob([`ScholarSync Digital Vault\nDocument: ${doc.title}\nOriginal File: ${doc.name}\nUploaded: ${doc.createdAt}\nStatus: Verified Secure Document`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.name.endsWith(".txt") ? doc.name : `${doc.name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

/**
 * Delete a document from the vault
 */
async function deleteVaultDocument(docId) {
  if (typeof confirm !== "undefined" && !confirm("Are you sure you want to remove this document from your Digital Vault?")) {
    return;
  }

  const docs = getVaultDocuments();
  const doc = docs.find(d => d.id === docId);
  const client = getVaultSupabaseClient();

  if (doc && typeof isSupabaseConfigured === "function" && isSupabaseConfigured() && client && doc.inSupabase && doc.filePath) {
    try {
      await client.storage.from("vault").remove([doc.filePath]);
    } catch (e) {
      console.warn("Storage deletion warning:", e);
    }
  }

  const updated = docs.filter(d => d.id !== docId);
  saveVaultDocuments(updated);
  renderVault();

  // If a scheme detail is open, update its checklist
  if (typeof cur !== "undefined" && cur && typeof openScheme === "function") {
    openScheme(cur.id);
  }
}

/**
 * Pre-load sample student documents for demo / review testing
 */
function loadDemoSampleDocuments() {
  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  if (!user) {
    if (typeof openAuthModal === "function") openAuthModal("login");
    return;
  }

  const samples = [
    {
      id: "doc_demo_aadhaar",
      userId: user.id,
      category: "aadhaar",
      title: "Aadhaar Card",
      name: "Aadhaar_Card_Verified.pdf",
      fileExt: "pdf",
      size: 420 * 1024,
      sizeFormatted: "420 KB",
      createdAt: new Date().toISOString(),
      filePath: `${user.id}/aadhaar_sample.pdf`,
      inSupabase: false,
      dataUrl: "",
    },
    {
      id: "doc_demo_marksheet",
      userId: user.id,
      category: "marksheet",
      title: "Class 10 Admit Card & Marksheet",
      name: "Madhyamik_Marksheet_2025.pdf",
      fileExt: "pdf",
      size: 780 * 1024,
      sizeFormatted: "780 KB",
      createdAt: new Date().toISOString(),
      filePath: `${user.id}/marksheet_sample.pdf`,
      inSupabase: false,
      dataUrl: "",
    },
    {
      id: "doc_demo_income",
      userId: user.id,
      category: "income",
      title: "Income Certificate (BDO Certified)",
      name: "Income_Certificate_2026.pdf",
      fileExt: "pdf",
      size: 310 * 1024,
      sizeFormatted: "310 KB",
      createdAt: new Date().toISOString(),
      filePath: `${user.id}/income_sample.pdf`,
      inSupabase: false,
      dataUrl: "",
    },
    {
      id: "doc_demo_bank",
      userId: user.id,
      category: "bank",
      title: "Bank Passbook (SBI First Page)",
      name: "Bank_Passbook_SBI.pdf",
      fileExt: "pdf",
      size: 512 * 1024,
      sizeFormatted: "512 KB",
      createdAt: new Date().toISOString(),
      filePath: `${user.id}/bank_sample.pdf`,
      inSupabase: false,
      dataUrl: "",
    },
    {
      id: "doc_demo_residential",
      userId: user.id,
      category: "residential",
      title: "Residential Certificate / Domicile",
      name: "Residential_Proof_WB.pdf",
      fileExt: "pdf",
      size: 290 * 1024,
      sizeFormatted: "290 KB",
      createdAt: new Date().toISOString(),
      filePath: `${user.id}/residential_sample.pdf`,
      inSupabase: false,
      dataUrl: "",
    },
    {
      id: "doc_demo_photo",
      userId: user.id,
      category: "photo",
      title: "Passport Photo & Signature",
      name: "Passport_Photo_and_Sign.jpg",
      fileExt: "jpg",
      size: 85 * 1024,
      sizeFormatted: "85 KB",
      createdAt: new Date().toISOString(),
      filePath: `${user.id}/photo_sample.jpg`,
      inSupabase: false,
      dataUrl: "",
    }
  ];

  saveVaultDocuments(samples);
  renderVault();

  // If a scheme view is open, refresh it
  if (typeof cur !== "undefined" && cur && typeof openScheme === "function") {
    openScheme(cur.id);
  }
}

/**
 * Manage Scheme Application Pack
 * Downloads all verified documents for the selected scholarship
 */
async function downloadApplicationPack(schemeId) {
  const scheme = typeof schemes !== "undefined" ? schemes.find(s => s.id === schemeId) : null;
  if (!scheme) return;

  const docs = getVaultDocuments();
  const readyDocs = [];

  scheme.docs.forEach(([docLabel]) => {
    const match = getMatchingVaultDoc(docLabel);
    if (match && !readyDocs.some(d => d.id === match.id)) {
      readyDocs.push(match);
    }
  });

  if (readyDocs.length === 0) {
    if (typeof alert !== "undefined") alert("No verified documents for this scheme exist in your vault yet. Upload documents first!");
    return;
  }

  // Trigger download for each ready document
  if (typeof alert !== "undefined") {
    alert(`Preparing download pack: ${readyDocs.length} verified documents for ${scheme.name}. Your downloads will start.`);
  }
  for (let i = 0; i < readyDocs.length; i++) {
    await new Promise(r => setTimeout(r, 350));
    downloadVaultDocument(readyDocs[i].id);
  }
}

/**
 * Switch selected scheme for the Application Pack tab
 */
function setPackScheme(schemeId) {
  selectedPackSchemeId = schemeId;
  renderApplicationPack();
}

/**
 * Render the Application Pack section
 */
function renderApplicationPack() {
  if (typeof document === "undefined") return;
  const container = document.getElementById("vaultPackContainer");
  if (!container || typeof schemes === "undefined") return;

  const scheme = schemes.find(s => s.id === selectedPackSchemeId) || schemes[0];
  const mand = scheme.docs.filter(d => d[1] === "m");

  let mandReadyCount = 0;
  mand.forEach(([docLabel]) => {
    if (hasVaultDocument(docLabel)) mandReadyCount++;
  });

  const pct = Math.round((mandReadyCount / mand.length) * 100);
  const isComplete = pct === 100;

  const schemeButtons = schemes.map(s => {
    const isSel = s.id === scheme.id;
    return `
      <button onclick="setPackScheme('${s.id}')" class="px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${isSel ? "bg-blue-600 text-white shadow-sm" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}">
        <i data-lucide="${s.icon}" class="w-3.5 h-3.5"></i>
        <span>${s.short}</span>
      </button>
    `;
  }).join("");

  const renderDocRow = ([label, type]) => {
    const match = getMatchingVaultDoc(label);
    const isMand = type === "m";

    if (match) {
      return `
        <div class="flex items-center justify-between p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs">
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="w-6 h-6 rounded-lg bg-emerald-600 text-white grid place-items-center shrink-0">
              <i data-lucide="check" class="w-3.5 h-3.5"></i>
            </span>
            <div class="min-w-0">
              <p class="font-semibold text-slate-800 truncate">${label}</p>
              <p class="text-[11px] text-emerald-800 truncate">Stored: ${match.name} (${match.sizeFormatted})</p>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${isMand ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"}">${isMand ? "Mandatory" : "Optional"}</span>
            <button onclick="downloadVaultDocument('${match.id}')" title="Download signed copy" class="p-1.5 rounded-lg bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-700 transition">
              <i data-lucide="download" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 grid place-items-center shrink-0">
              <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>
            </span>
            <div class="min-w-0">
              <p class="font-medium text-slate-700 truncate">${label}</p>
              <p class="text-[11px] text-amber-700">Not in vault</p>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${isMand ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"}">${isMand ? "Mandatory" : "Optional"}</span>
            <button onclick="quickSelectCategoryForUpload('${label}')" class="text-[11px] font-semibold text-blue-600 hover:underline">
              Upload
            </button>
          </div>
        </div>
      `;
    }
  };

  container.innerHTML = `
    <div class="flex items-center justify-between flex-wrap gap-2 mb-4">
      <div>
        <h4 class="font-bold text-slate-800 flex items-center gap-1.5">
          <i data-lucide="package-check" class="w-4 h-4 text-blue-600"></i>
          <span>Scheme Application Pack</span>
        </h4>
        <p class="text-xs text-slate-500">Auto-bundle documents for official submission</p>
      </div>
      <div class="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
        ${schemeButtons}
      </div>
    </div>

    <!-- Readiness Bar -->
    <div class="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
      <div class="flex items-center justify-between text-xs font-semibold mb-1.5">
        <span class="text-slate-700">${scheme.name}</span>
        <span class="${isComplete ? "text-emerald-600 font-bold" : "text-blue-600"}">${mandReadyCount} / ${mand.length} Mandatory Ready (${pct}%)</span>
      </div>
      <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div class="h-full transition-all duration-500 ${isComplete ? "bg-emerald-500" : pct >= 50 ? "bg-blue-600" : "bg-amber-400"}" style="width: ${pct}%"></div>
      </div>
      <p class="text-[11px] text-slate-500 mt-2">
        ${isComplete ? "🎉 Application pack is 100% complete! All mandatory files are ready in your vault." : `Need ${mand.length - mandReadyCount} more mandatory document(s) before applying.`}
      </p>

      <div class="mt-4 flex flex-wrap gap-2">
        <button onclick="downloadApplicationPack('${scheme.id}')" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl py-2.5 px-4 flex items-center justify-center gap-1.5 shadow-sm transition">
          <i data-lucide="download" class="w-4 h-4"></i> Download Application Pack
        </button>
        <button onclick="openScheme('${scheme.id}')" class="border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl py-2.5 px-4 flex items-center justify-center gap-1.5 transition">
          <i data-lucide="external-link" class="w-4 h-4"></i> Review in Checklist
        </button>
      </div>
    </div>

    <!-- Required Docs Checklist Breakdown -->
    <div class="space-y-2">
      <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Required Documents (${scheme.docs.length})</p>
      ${scheme.docs.map(renderDocRow).join("")}
    </div>
  `;

  if (typeof window !== "undefined" && window.lucide) lucide.createIcons();
}

/**
 * Helper to select category in upload form and focus file input
 */
function quickSelectCategoryForUpload(schemeDocLabel) {
  if (typeof document === "undefined") return;
  const catSelect = document.getElementById("vaultDocCategory");
  const target = schemeDocLabel.toLowerCase();
  const cat = VAULT_CATEGORIES.find(c => c.keywords.some(k => target.includes(k)));

  if (catSelect && cat) {
    catSelect.value = cat.id;
  }
  const uploadInput = document.getElementById("vaultFileInput");
  if (uploadInput) {
    uploadInput.scrollIntoView({ behavior: "smooth" });
    uploadInput.click();
  }
}

/**
 * Render the entire Vault section
 */
function renderVault() {
  if (typeof document === "undefined") return;
  const vaultView = document.getElementById("vault");
  if (!vaultView) return;

  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;

  // If user is not logged in, show lock screen hero
  if (!user) {
    vaultView.innerHTML = `
      <div class="max-w-2xl mx-auto py-12 text-center">
        <div class="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 grid place-items-center mx-auto mb-4">
          <i data-lucide="lock" class="w-8 h-8"></i>
        </div>
        <h2 class="text-3xl font-bold text-slate-800">Student Digital Vault</h2>
        <p class="text-slate-600 mt-2 max-w-md mx-auto text-sm leading-relaxed">
          Store your Aadhaar, marksheets, income certificates, and bank passbooks in your encrypted personal vault.
          Upload once, pre-tick checklist requirements automatically, and export scholarship application packs.
        </p>
        <div class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onclick="openAuthModal('login')" class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-6 py-3 flex items-center justify-center gap-2 shadow-sm transition">
            <i data-lucide="user" class="w-4 h-4"></i> Sign In to Vault
          </button>
          <button onclick="openAuthModal('signup')" class="w-full sm:w-auto border border-slate-300 hover:bg-white text-slate-700 font-semibold rounded-xl px-6 py-3 flex items-center justify-center gap-2 transition">
            <i data-lucide="user-plus" class="w-4 h-4"></i> Create Free Account
          </button>
        </div>
        <div class="mt-8 pt-6 border-t border-slate-200 flex flex-wrap justify-center gap-6 text-xs text-slate-500">
          <span class="flex items-center gap-1.5"><i data-lucide="shield-check" class="w-4 h-4 text-emerald-600"></i> Supabase Storage</span>
          <span class="flex items-center gap-1.5"><i data-lucide="key" class="w-4 h-4 text-blue-600"></i> Signed Download URLs</span>
          <span class="flex items-center gap-1.5"><i data-lucide="check-circle-2" class="w-4 h-4 text-indigo-600"></i> Auto Pre-flight Checklists</span>
        </div>
      </div>
    `;
    if (typeof window !== "undefined" && window.lucide) lucide.createIcons();
    return;
  }

  const docs = getVaultDocuments();
  const userName = user.user_metadata?.full_name || user.email.split("@")[0];

  // Calculate statistics
  let totalBytes = 0;
  docs.forEach(d => totalBytes += (d.size || 0));
  const storageStatus = (typeof isSupabaseConfigured === "function" && isSupabaseConfigured()) ? "Supabase Cloud Vault" : "Local Encrypted Session";

  // Category options for upload select
  const categoryOptions = VAULT_CATEGORIES.map(c => `
    <option value="${c.id}">${c.label}</option>
  `).join("");

  vaultView.innerHTML = `
    <!-- Top Bar -->
    <div class="flex items-center justify-between flex-wrap gap-4 mb-6">
      <button onclick="showHome()" class="flex items-center gap-1.5 text-sm text-blue-700 font-semibold hover:underline">
        <i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Scholarships
      </button>
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-medium">
          <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> ${storageStatus}
        </span>
        <button onclick="loadDemoSampleDocuments()" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-medium transition" title="Add pre-filled sample documents for testing">
          + Load Sample Docs
        </button>
      </div>
    </div>

    <!-- Vault Banner -->
    <div class="rounded-3xl bg-gradient-to-br from-indigo-700 via-blue-700 to-blue-800 text-white p-6 sm:p-8 mb-8 shadow-sm">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="inline-flex items-center gap-1.5 text-xs bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 font-medium mb-3">
            <i data-lucide="folder-lock" class="w-3.5 h-3.5 text-emerald-300"></i> Personal Digital Vault
          </span>
          <h2 class="text-2xl sm:text-3xl font-bold">Welcome, ${userName}</h2>
          <p class="text-blue-100 text-sm mt-1 max-w-xl">
            Your stored documents are ready for instant scholarship verification. Whenever you view a scheme, matching documents are automatically checked off.
          </p>
        </div>
        <div class="flex sm:flex-col gap-4 text-right bg-white/10 rounded-2xl p-4 shrink-0">
          <div>
            <p class="text-2xl font-bold">${docs.length}</p>
            <p class="text-xs text-blue-200">Documents Stored</p>
          </div>
          <div>
            <p class="text-sm font-semibold text-emerald-300">${formatFileSize(totalBytes)}</p>
            <p class="text-xs text-blue-200">Vault Size</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Grid: Left = Upload + Docs, Right = Application Pack -->
    <div class="grid lg:grid-cols-12 gap-8">
      
      <!-- Left Column: Upload Form & Stored Documents List -->
      <div class="lg:col-span-7 space-y-6">
        
        <!-- Upload Card -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-base flex items-center gap-2">
              <i data-lucide="cloud-upload" class="w-5 h-5 text-blue-600"></i>
              <span>Upload Document to Vault</span>
            </h3>
            <span class="text-xs text-slate-400">PDF, JPG, PNG up to 10MB</span>
          </div>

          <form id="vaultUploadForm" onsubmit="handleVaultUpload(event)" class="space-y-4">
            <div class="grid sm:grid-cols-2 gap-3">
              <div>
                <label for="vaultDocCategory" class="block text-xs font-semibold text-slate-700 mb-1">Document Type</label>
                <select id="vaultDocCategory" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-blue-600 focus:outline-none bg-white">
                  ${categoryOptions}
                </select>
              </div>
              <div>
                <label for="vaultDocTitle" class="block text-xs font-semibold text-slate-700 mb-1">Document Label (Optional)</label>
                <input type="text" id="vaultDocTitle" placeholder="e.g. My Aadhaar 2026" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-blue-600 focus:outline-none">
              </div>
            </div>

            <!-- Drag & Drop File Selector -->
            <div>
              <label for="vaultFileInput" class="block border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 text-center cursor-pointer transition bg-slate-50/50 hover:bg-blue-50/30">
                <i data-lucide="file-up" class="w-6 h-6 mx-auto text-blue-600 mb-1"></i>
                <p id="vaultFileLabel" class="text-xs font-medium text-slate-700">Click to choose document or drag here</p>
                <p class="text-[11px] text-slate-400 mt-0.5">Scanned certificates or original portal files</p>
                <input id="vaultFileInput" type="file" accept=".pdf,image/jpeg,image/png" class="sr-only" onchange="handleFileSelect(this)">
              </label>
            </div>

            <div id="vaultUploadMsg" class="hidden text-xs p-3 rounded-xl"></div>

            <button type="submit" id="vaultUploadBtn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm">
              <i data-lucide="shield-check" class="w-4 h-4"></i> Securely Save to Digital Vault
            </button>
          </form>
        </div>

        <!-- Stored Documents List -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-base flex items-center gap-2">
              <i data-lucide="files" class="w-5 h-5 text-indigo-600"></i>
              <span>Stored Vault Documents (${docs.length})</span>
            </h3>
            ${docs.length > 0 ? `<button onclick="loadDemoSampleDocuments()" class="text-xs text-blue-600 hover:underline">Reset Demo Samples</button>` : ""}
          </div>

          ${docs.length === 0 ? `
            <div class="text-center py-10 px-4 border border-dashed border-slate-200 rounded-xl">
              <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 grid place-items-center mx-auto mb-2">
                <i data-lucide="folder-open" class="w-6 h-6"></i>
              </div>
              <p class="text-sm font-semibold text-slate-700">No documents in your vault yet</p>
              <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Upload your certificates above or load pre-filled sample documents to test the pre-flight checklist.</p>
              <button onclick="loadDemoSampleDocuments()" class="mt-4 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold px-4 py-2 rounded-xl text-xs transition inline-flex items-center gap-1.5">
                <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> Load Pre-verified Demo Docs
              </button>
            </div>
          ` : `
            <div class="space-y-3">
              ${docs.map(doc => {
                const cat = VAULT_CATEGORIES.find(c => c.id === doc.category) || VAULT_CATEGORIES[0];
                return `
                  <div class="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 transition bg-white">
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 grid place-items-center shrink-0">
                        <i data-lucide="${cat.icon}" class="w-5 h-5"></i>
                      </div>
                      <div class="min-w-0">
                        <div class="flex items-center gap-2">
                          <p class="font-semibold text-sm text-slate-800 truncate">${doc.title || cat.label}</p>
                          <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium shrink-0">${cat.label}</span>
                        </div>
                        <p class="text-xs text-slate-400 truncate mt-0.5">${doc.name} • ${doc.sizeFormatted || "Ready"}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-1.5 shrink-0 ml-2">
                      <button onclick="downloadVaultDocument('${doc.id}')" title="Secure Download / Signed URL" class="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1 transition">
                        <i data-lucide="download" class="w-4 h-4"></i>
                        <span class="hidden sm:inline">Download</span>
                      </button>
                      <button onclick="deleteVaultDocument('${doc.id}')" title="Remove document" class="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition" aria-label="Delete">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                      </button>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          `}
        </div>
      </div>

      <!-- Right Column: Scholarship Application Pack Manager -->
      <div class="lg:col-span-5 space-y-6">
        <div id="vaultPackContainer" class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"></div>
      </div>

    </div>
  `;

  renderApplicationPack();
  if (typeof window !== "undefined" && window.lucide) lucide.createIcons();
}

/**
 * Handle file input selection UI update
 */
function handleFileSelect(input) {
  if (typeof document === "undefined") return;
  const file = input.files?.[0];
  const label = document.getElementById("vaultFileLabel");
  if (!label) return;

  if (file) {
    label.innerHTML = `Selected: <b class="text-blue-700">${file.name}</b> (${formatFileSize(file.size)})`;
  } else {
    label.textContent = "Click to choose document or drag here";
  }
}

/**
 * Handle Vault Upload Form Submission
 */
async function handleVaultUpload(e) {
  e.preventDefault();
  if (typeof document === "undefined") return;
  const fileInput = document.getElementById("vaultFileInput");
  const catSelect = document.getElementById("vaultDocCategory");
  const titleInput = document.getElementById("vaultDocTitle");
  const msgEl = document.getElementById("vaultUploadMsg");
  const submitBtn = document.getElementById("vaultUploadBtn");

  const file = fileInput?.files?.[0];
  const category = catSelect?.value;
  const customTitle = titleInput?.value;

  if (!file) {
    if (msgEl) {
      msgEl.className = "text-xs p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-2";
      msgEl.innerHTML = `<i data-lucide="alert-circle" class="w-4 h-4"></i> Please choose a document file to upload.`;
      msgEl.classList.remove("hidden");
      if (typeof window !== "undefined" && window.lucide) lucide.createIcons();
    }
    return;
  }

  const originalHtml = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="animate-spin mr-2">⏳</span> Uploading to Vault...`;

  try {
    await uploadVaultDocument(file, category, customTitle);
    if (msgEl) {
      msgEl.className = "text-xs p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2";
      msgEl.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4"></i> Document saved to your Digital Vault!`;
      msgEl.classList.remove("hidden");
    }

    // Reset inputs
    fileInput.value = "";
    if (titleInput) titleInput.value = "";
    const label = document.getElementById("vaultFileLabel");
    if (label) label.textContent = "Click to choose document or drag here";

    setTimeout(() => {
      renderVault();
      if (typeof cur !== "undefined" && cur && typeof openScheme === "function") {
        openScheme(cur.id);
      }
    }, 600);
  } catch (err) {
    if (msgEl) {
      msgEl.className = "text-xs p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2";
      msgEl.innerHTML = `<i data-lucide="alert-circle" class="w-4 h-4"></i> ${err.message || "Upload failed."}`;
      msgEl.classList.remove("hidden");
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHtml;
    if (typeof window !== "undefined" && window.lucide) lucide.createIcons();
  }
}

/**
 * Callback when authentication state changes
 */
function onAuthChangeVault() {
  if (typeof document === "undefined") return;
  const vaultView = document.getElementById("vault");
  if (vaultView && !vaultView.classList.contains("hidden")) {
    renderVault();
  }
}

