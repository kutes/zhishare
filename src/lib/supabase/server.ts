import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type SupabaseServerClient = SupabaseClient<Database>;

let cachedClient: SupabaseServerClient | null = null;

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function getSupabaseServerClient() {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient<Database>(config.url, config.anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return cachedClient;
}

export function logSupabaseError(scope: string, error: unknown) {
  console.error(`[Supabase] ${scope}`, error);
}
