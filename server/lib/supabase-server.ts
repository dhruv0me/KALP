import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://orgymnewsoisqkltogjt.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_SN-F-0CIsFkXg2OO8nzLwA_zkDBF1KL";

// guard:allow-env-credential — deploy-level public Supabase endpoint URL
const envUrl = process.env.SUPABASE_URL;
// guard:allow-env-credential — deploy-level public Supabase endpoint URL
const envNextUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// guard:allow-env-credential — deploy-level public Supabase publishable anon key
const envAnon = process.env.SUPABASE_ANON_KEY;
// guard:allow-env-credential — deploy-level public Supabase publishable anon key
const envNextAnon = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabaseUrl = envUrl || envNextUrl || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = envAnon || envNextAnon || DEFAULT_SUPABASE_ANON_KEY;

export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);

export function getSupabaseServerClient() {
  return supabaseServer;
}
