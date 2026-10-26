// ==============================================================================
// ScholarSync / Yojna Sathi - Authentication Module (Supabase Auth)
// ==============================================================================

var currentUser = null;

/**
 * Returns current authenticated student user
 */
function getCurrentUser() {
  return currentUser;
}

/**
 * Safely get initialized Supabase client
 */
function getActiveSupabaseClient() {
  if (typeof supabaseClient !== "undefined" && supabaseClient) return supabaseClient;
  if (typeof window !== "undefined" && window.supabaseClient) return window.supabaseClient;
  return null;
}

/**
 * Initialize Auth state on page load
 */
async function initAuth() {
  // Ensure supabase is initialized if config is ready
  let client = getActiveSupabaseClient();
  if (!client && typeof initSupabase === "function") {
    client = initSupabase();
  }

  if (typeof isSupabaseConfigured === "function" && isSupabaseConfigured() && client) {
    try {
      // Get existing session
      const { data: { session }, error } = await client.auth.getSession();
      if (!error && session?.user) {
        currentUser = session.user;
      }

      // Listen for auth state changes
      client.auth.onAuthStateChange((_event, session) => {
        currentUser = session ? session.user : null;
        updateAuthUI();
        if (typeof onAuthChangeVault === "function") {
          onAuthChangeVault();
        }
      });
    } catch (e) {
      console.warn("Supabase session check error:", e);
    }
  } else {
    // Check for demo user session in local storage
    if (typeof localStorage !== "undefined") {
      const demoUser = localStorage.getItem("yojna_demo_user");
      if (demoUser) {
        try {
          currentUser = JSON.parse(demoUser);
        } catch (err) {
          currentUser = null;
        }
      }
    }
  }

  updateAuthUI();
}

/**
 * Student Sign-Up function
 */
async function signUpStudent(email, password, fullName) {
  const client = getActiveSupabaseClient();
  if (typeof isSupabaseConfigured === "function" && isSupabaseConfigured() && client) {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    if (data?.user) {
      currentUser = data.user;
    }
    return data;
  } else {
    // Simulated demo sign-up
    const user = {
      id: "demo-user-" + Date.now().toString(36),
      email: email,
      user_metadata: {
        full_name: fullName || email.split("@")[0],
      },
      is_demo: true,
    };
    currentUser = user;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("yojna_demo_user", JSON.stringify(user));
    }
    return { user };
  }
}

/**
 * Student Login function
 */
async function signInStudent(email, password) {
  const client = getActiveSupabaseClient();
  if (typeof isSupabaseConfigured === "function" && isSupabaseConfigured() && client) {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (data?.user) {
      currentUser = data.user;
    }
    return data;
  } else {
    // Simulated demo login
    const user = {
      id: "demo-user-101",
      email: email,
      user_metadata: {
        full_name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      },
      is_demo: true,
    };
    currentUser = user;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("yojna_demo_user", JSON.stringify(user));
    }
    return { user };
  }
}

/**
 * Student Logout function
 */
async function signOutStudent() {
  const client = getActiveSupabaseClient();
  if (typeof isSupabaseConfigured === "function" && isSupabaseConfigured() && client) {
    try {
      await client.auth.signOut();
    } catch (e) {
      console.warn("Sign out warning:", e);
    }
  }
  currentUser = null;
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("yojna_demo_user");
  }
  updateAuthUI();

  if (typeof onAuthChangeVault === "function") {
    onAuthChangeVault();
  }

  // If user was on the vault view, refresh it
  if (typeof document !== "undefined") {
    const vaultView = document.getElementById("vault");
    if (vaultView && !vaultView.classList.contains("hidden")) {
      if (typeof renderVault === "function") renderVault();
    }
  }
}

/**
 * Modal Handling and UI Updates
 */
function openAuthModal(initialTab = "login") {
  if (typeof document === "undefined") return;
  const modal = document.getElementById("authModal");
  if (!modal) return;

  switchAuthTab(initialTab);
  clearAuthAlert();

  // Show notice if keys are placeholders
  const notice = document.getElementById("authConfigNotice");
  if (notice) {
    if (typeof isSupabaseConfigured === "function" && !isSupabaseConfigured()) {
      notice.classList.remove("hidden");
    } else {
      notice.classList.add("hidden");
    }
  }

  modal.classList.remove("hidden");
  if (typeof window !== "undefined" && window.lucide) lucide.createIcons();
}

function closeAuthModal() {
  if (typeof document === "undefined") return;
  const modal = document.getElementById("authModal");
  if (modal) modal.classList.add("hidden");
  clearAuthAlert();
}

function switchAuthTab(tab) {
  if (typeof document === "undefined") return;
  const tabLogin = document.getElementById("tabLogin");
  const tabSignup = document.getElementById("tabSignup");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const authTitle = document.getElementById("authTitle");

  clearAuthAlert();

  if (tab === "signup") {
    if (tabSignup) tabSignup.className = "flex-1 py-3 border-b-2 border-blue-600 text-blue-600 font-bold transition";
    if (tabLogin) tabLogin.className = "flex-1 py-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition";
    if (signupForm) signupForm.classList.remove("hidden");
    if (loginForm) loginForm.classList.add("hidden");
    if (authTitle) authTitle.textContent = "Create Student Account";
  } else {
    if (tabLogin) tabLogin.className = "flex-1 py-3 border-b-2 border-blue-600 text-blue-600 font-bold transition";
    if (tabSignup) tabSignup.className = "flex-1 py-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition";
    if (loginForm) loginForm.classList.remove("hidden");
    if (signupForm) signupForm.classList.add("hidden");
    if (authTitle) authTitle.textContent = "Sign in to ScholarSync";
  }

  if (typeof window !== "undefined" && window.lucide) lucide.createIcons();
}

function showAuthAlert(msg, type = "error") {
  if (typeof document === "undefined") return;
  const alertEl = document.getElementById("authAlert");
  if (!alertEl) return;
  alertEl.classList.remove("hidden");
  if (type === "error") {
    alertEl.className = "text-xs p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2";
    alertEl.innerHTML = `<i data-lucide="alert-circle" class="w-4 h-4 shrink-0"></i><span>${msg}</span>`;
  } else {
    alertEl.className = "text-xs p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-2";
    alertEl.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4 shrink-0"></i><span>${msg}</span>`;
  }
  if (typeof window !== "undefined" && window.lucide) lucide.createIcons();
}

function clearAuthAlert() {
  if (typeof document === "undefined") return;
  const alertEl = document.getElementById("authAlert");
  if (alertEl) {
    alertEl.classList.add("hidden");
    alertEl.innerHTML = "";
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const submitBtn = document.getElementById("loginSubmitBtn");

  if (!email || !password) {
    showAuthAlert("Please provide both email and password.");
    return;
  }

  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="animate-spin mr-2">⏳</span> Signing in...`;

  try {
    await signInStudent(email, password);
    showAuthAlert("Successfully signed in! Welcome back.", "success");
    setTimeout(() => {
      closeAuthModal();
      updateAuthUI();
      if (typeof onAuthChangeVault === "function") onAuthChangeVault();
      if (typeof cur !== "undefined" && cur && typeof openScheme === "function") {
        openScheme(cur.id);
      }
    }, 600);
  } catch (err) {
    showAuthAlert(err.message || "Failed to sign in. Please verify your credentials.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    if (typeof window !== "undefined" && window.lucide) lucide.createIcons();
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const submitBtn = document.getElementById("signupSubmitBtn");

  if (!name || !email || !password) {
    showAuthAlert("Please fill in all required fields.");
    return;
  }

  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="animate-spin mr-2">⏳</span> Creating account...`;

  try {
    const res = await signUpStudent(email, password, name);
    if (typeof isSupabaseConfigured === "function" && isSupabaseConfigured() && res?.user && !res?.session) {
      showAuthAlert("Account created! Please check your email to confirm your account.", "success");
    } else {
      showAuthAlert("Student account created successfully! You are now logged in.", "success");
      setTimeout(() => {
        closeAuthModal();
        updateAuthUI();
        if (typeof onAuthChangeVault === "function") onAuthChangeVault();
        if (typeof cur !== "undefined" && cur && typeof openScheme === "function") {
          openScheme(cur.id);
        }
      }, 700);
    }
  } catch (err) {
    showAuthAlert(err.message || "Failed to create account. Please try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    if (typeof window !== "undefined" && window.lucide) lucide.createIcons();
  }
}

/**
 * Convenient 1-click demo login for development & testing
 */
async function quickDemoLogin() {
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  if (loginEmail) loginEmail.value = "ananya.roy@example.com";
  if (loginPassword) loginPassword.value = "student123";

  await signInStudent("ananya.roy@example.com", "student123");
  showAuthAlert("Logged in as Demo Student (Ananya Roy)!", "success");
  setTimeout(() => {
    closeAuthModal();
    updateAuthUI();
    if (typeof onAuthChangeVault === "function") onAuthChangeVault();
    if (typeof cur !== "undefined" && cur && typeof openScheme === "function") {
      openScheme(cur.id);
    }
  }, 600);
}

function handleAuthBtnClick() {
  if (currentUser) {
    showVault();
  } else {
    openAuthModal("login");
  }
}

/**
 * Update header and general UI according to authentication status
 */
function updateAuthUI() {
  if (typeof document === "undefined") return;
  const authContainer = document.getElementById("authContainer");
  if (!authContainer) return;

  if (currentUser) {
    const name = currentUser.user_metadata?.full_name || currentUser.email.split("@")[0];
    const initial = name.charAt(0).toUpperCase();

    authContainer.innerHTML = `
      <div class="flex items-center gap-2">
        <button onclick="showVault()" class="flex items-center gap-2 bg-blue-50 text-blue-800 text-xs font-semibold rounded-lg px-3 py-1.5 border border-blue-200 hover:bg-blue-100 transition" title="Go to My Digital Vault">
          <span class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">${initial}</span>
          <span class="hidden sm:inline max-w-[110px] truncate">${name}</span>
        </button>
        <button onclick="signOutStudent()" class="text-slate-500 hover:text-rose-600 p-2 rounded-lg hover:bg-slate-100 text-xs font-medium transition" title="Sign out" aria-label="Sign out">
          <i data-lucide="log-out" class="w-4 h-4"></i>
        </button>
      </div>
    `;
  } else {
    authContainer.innerHTML = `
      <button id="authBtn" onclick="openAuthModal('login')" class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg px-4 py-2 flex items-center gap-1.5 transition">
        <i data-lucide="user" class="w-4 h-4"></i>
        <span>Sign in</span>
      </button>
    `;
  }

  if (typeof window !== "undefined" && window.lucide) lucide.createIcons();
}

// Close modal on escape key press
if (typeof window !== "undefined") {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAuthModal();
    }
  });

  // Automatically initialize auth when DOM is ready
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initAuth);
    } else {
      initAuth();
    }
  }
}

