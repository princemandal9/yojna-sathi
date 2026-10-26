// ==============================================================================
// ScholarSync / Yojna Sathi - Supabase Configuration
// ==============================================================================
// Placeholders for your Supabase project credentials.
// To connect your live Supabase project:
// 1. Go to your Supabase Project Settings -> API.
// 2. Paste your Project URL and anon public key below.
// 3. In Supabase Storage, create a bucket named "vault".
// ==============================================================================

var SUPABASE_URL = "https://yhgejaomrwmqqltvmqvx.supabase.co";
var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZ2VqYW9tcndtcXFsdHZtcXZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwMjgxNDcsImV4cCI6MjEwODYwNDE0N30.CzTwLe-g2yNV5PidA9Vul7qMihrDe6FOh1jctqbCfm4";

// Global Supabase client instance
var supabaseClient = null;

if (typeof window !== "undefined") {
  window.SUPABASE_URL = SUPABASE_URL;
  window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
  window.supabaseClient = null;
}

/**
 * Initializes the Supabase client if valid credentials are provided
 * and the Supabase JS CDN is loaded.
 */
function initSupabase() {
  const url = typeof SUPABASE_URL !== "undefined" ? SUPABASE_URL : window.SUPABASE_URL;
  const key = typeof SUPABASE_ANON_KEY !== "undefined" ? SUPABASE_ANON_KEY : window.SUPABASE_ANON_KEY;

  const isConfigured =
    typeof url === "string" &&
    typeof key === "string" &&
    url !== "https://your-supabase-project.supabase.co" &&
    key !== "your-supabase-anon-key" &&
    url.startsWith("https://");

  const supaLib = typeof window !== "undefined" ? window.supabase : (typeof supabase !== "undefined" ? supabase : null);

  if (supaLib && isConfigured) {
    try {
      supabaseClient = supaLib.createClient(url, key);
      if (typeof window !== "undefined") window.supabaseClient = supabaseClient;
      console.log("Supabase client initialized successfully.");
    } catch (err) {
      console.warn("Failed to initialize Supabase client:", err);
    }
  } else {
    console.info("Supabase placeholder credentials active. Digital Vault will operate with simulated secure local storage.");
  }
  return supabaseClient;
}

/**
 * Helper to check whether live Supabase is connected
 */
function isSupabaseConfigured() {
  return !!(typeof supabaseClient !== "undefined" && supabaseClient || (typeof window !== "undefined" && window.supabaseClient));
}

// Auto-initialize when script loads if CDN is already present
if (typeof window !== "undefined" && typeof window.supabase !== "undefined") {
  initSupabase();
}

