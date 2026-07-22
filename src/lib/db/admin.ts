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

/* ===== 数据统计页(/admin/stats)扩展查询 =====
   与 getAdminStats 同模式:浏览器端匿名/登录会话查询,失败降级为空,不抛错。
   只做真实数据聚合,不编造任何数字。 */

export type AdminStatsDetail = {
  tools: { total: number; published: number; draft: number; noCover: number; noTag: number };
  articles: { total: number; published: number; draft: number; noCover: number; noTag: number };
  categories: number;
  tags: number;
  submissions: number;
  reports: number;
  toolsByCategory: Array<{ name: string; count: number }>;
  articlesByCategory: Array<{ name: string; count: number }>;
  tagUsage: Array<{ name: string; tools: number; articles: number }>;
  recentDays: Array<{ date: string; tools: number; articles: number }>;
};

const emptyDetail: AdminStatsDetail = {
  tools: { total: 0, published: 0, draft: 0, noCover: 0, noTag: 0 },
  articles: { total: 0, published: 0, draft: 0, noCover: 0, noTag: 0 },
  categories: 0,
  tags: 0,
  submissions: 0,
  reports: 0,
  toolsByCategory: [],
  articlesByCategory: [],
  tagUsage: [],
  recentDays: [],
};

export async function getAdminStatsDetail(): Promise<AdminStatsDetail> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    console.error("[Supabase] admin stats detail: missing public Supabase config");
    return emptyDetail;
  }

  try {
    const [toolsRes, articlesRes, categoriesRes, tagsRes, toolTagsRes, articleTagsRes, submissions, reports] =
      await Promise.all([
        supabase.from("tools").select("id,status,cover_url,category_id,created_at"),
        supabase.from("articles").select("id,status,cover_url,category_id,created_at"),
        supabase.from("categories").select("id,name"),
        supabase.from("tags").select("id,name"),
        supabase.from("tool_tags").select("tool_id,tag_id"),
        supabase.from("article_tags").select("article_id,tag_id"),
        countSubmissions(supabase),
        countReports(supabase),
      ]);

    for (const [scope, res] of [
      ["tools", toolsRes],
      ["articles", articlesRes],
      ["categories", categoriesRes],
      ["tags", tagsRes],
    ] as const) {
      if (res.error) {
        console.error(`[Supabase] admin stats detail ${scope}`, res.error);
      }
    }

    const tools = toolsRes.data ?? [];
    const articles = articlesRes.data ?? [];
    const categories = categoriesRes.data ?? [];
    const tags = tagsRes.data ?? [];
    const toolTags = toolTagsRes.data ?? [];
    const articleTags = articleTagsRes.data ?? [];

    const taggedToolIds = new Set(toolTags.map((row) => row.tool_id));
    const taggedArticleIds = new Set(articleTags.map((row) => row.article_id));
    const categoryName = new Map(categories.map((row) => [row.id, row.name ?? "未命名分类"]));

    const toolsByCategory = aggregateByCategory(tools, categoryName);
    const articlesByCategory = aggregateByCategory(articles, categoryName);

    const tagUsage = tags
      .map((tag) => ({
        name: tag.name ?? "未命名标签",
        tools: toolTags.filter((row) => row.tag_id === tag.id).length,
        articles: articleTags.filter((row) => row.tag_id === tag.id).length,
      }))
      .sort((a, b) => b.tools + b.articles - (a.tools + a.articles));

    return {
      tools: {
        total: tools.length,
        published: tools.filter((row) => row.status === "published").length,
        draft: tools.filter((row) => row.status !== "published").length,
        noCover: tools.filter((row) => !row.cover_url?.trim()).length,
        noTag: tools.filter((row) => !taggedToolIds.has(row.id)).length,
      },
      articles: {
        total: articles.length,
        published: articles.filter((row) => row.status === "published").length,
        draft: articles.filter((row) => row.status !== "published").length,
        noCover: articles.filter((row) => !row.cover_url?.trim()).length,
        noTag: articles.filter((row) => !taggedArticleIds.has(row.id)).length,
      },
      categories: categories.length,
      tags: tags.length,
      submissions,
      reports,
      toolsByCategory,
      articlesByCategory,
      tagUsage,
      recentDays: buildRecentDays(tools, articles, 14),
    };
  } catch (error) {
    console.error("[Supabase] admin stats detail", error);
    return emptyDetail;
  }
}

type CategoryCountableRow = { category_id: string | null };
type DatedRow = { created_at: string | null };

function aggregateByCategory(rows: CategoryCountableRow[], categoryName: Map<string, string>) {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const name = row.category_id ? categoryName.get(row.category_id) ?? "未命名分类" : "未分类";
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

function buildRecentDays(tools: DatedRow[], articles: DatedRow[], days: number) {
  const result: Array<{ date: string; tools: number; articles: number }> = [];
  const today = new Date();

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);
    const key = day.toISOString().slice(0, 10);
    result.push({
      date: key,
      tools: tools.filter((row) => row.created_at?.slice(0, 10) === key).length,
      articles: articles.filter((row) => row.created_at?.slice(0, 10) === key).length,
    });
  }

  return result;
}
