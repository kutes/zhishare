"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

export type AdminStats = {
  tools: number;
  articles: number;
  submissions: number;
  reports: number;
};

const emptyStats: AdminStats = {
  tools: 0,
  articles: 0,
  submissions: 0,
  reports: 0,
};

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    console.error("[Supabase] admin stats: missing public Supabase config");
    return emptyStats;
  }

  const [tools, articles, submissions, reports] = await Promise.all([
    countTools(supabase),
    countArticles(supabase),
    countSubmissions(supabase),
    countReports(supabase),
  ]);

  return {
    tools,
    articles,
    submissions,
    reports,
  };
}

async function countTools(client: SupabaseClient<Database>): Promise<number> {
  const { count, error } = await client.from("tools").select("*", { count: "exact", head: true });
  return normalizeCount("tools", count, error);
}

async function countArticles(client: SupabaseClient<Database>): Promise<number> {
  const { count, error } = await client.from("articles").select("*", { count: "exact", head: true });
  return normalizeCount("articles", count, error);
}

async function countSubmissions(client: SupabaseClient<Database>): Promise<number> {
  const { count, error } = await client.from("submissions").select("*", { count: "exact", head: true });
  return normalizeCount("submissions", count, error);
}

async function countReports(client: SupabaseClient<Database>): Promise<number> {
  const { count, error } = await client.from("reports").select("*", { count: "exact", head: true });
  return normalizeCount("reports", count, error);
}

function normalizeCount(scope: string, count: number | null, error: unknown): number {
  if (error) {
    console.error(`[Supabase] admin count ${scope}`, error);
    return 0;
  }

  return count ?? 0;
}
