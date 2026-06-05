import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

let cachedClient: SupabaseClient<Database> | null = null;

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.warn("[Supabase] Missing public Supabase environment variables.");
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient<Database>(url, anonKey);
  }

  return cachedClient;
}

export function getSupabaseUserWithTimeout(client: SupabaseClient<Database>, timeoutMs = 8000) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("auth_timeout"));
    }, timeoutMs);
  });

  return Promise.race([client.auth.getUser(), timeoutPromise]).finally(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });
}

export function isSupabaseAuthSessionMissing(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const record = error as { message?: unknown; name?: unknown };
  const message = typeof record.message === "string" ? record.message.toLowerCase() : "";
  const name = typeof record.name === "string" ? record.name : "";

  return name === "AuthSessionMissingError" || message.includes("auth session missing");
}
