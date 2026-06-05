import type { ArticleItem } from "@/components/articles/article-content";
import { getArticles } from "@/components/articles/article-content";
import type { ArticleRow, Database } from "@/types/database";
import type { AdminArticle, AdminArticleDbResult, AdminArticleInput, PublishedArticle } from "@/types/article";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSupabaseServerClient, logSupabaseError, type SupabaseServerClient } from "@/lib/supabase/server";
import { getAdminAuthErrorMessage, getAdminFriendlyErrorMessage } from "./admin-errors";
import { buildCategoryNameMap, normalizeArticle, readNestedName, toRecordArray } from "./normalizers";
import { fetchCategoryRows } from "./categories";
import type { SupabaseClient } from "@supabase/supabase-js";

type ArticleInsert = Database["public"]["Tables"]["articles"]["Insert"];
type ArticleUpdate = Database["public"]["Tables"]["articles"]["Update"];
type AdminArticlePayload = {
  title: string;
  slug: string;
  summary: string;
  content: string | null;
  cover_url: string | null;
  category_id: string | null;
  status: "draft" | "published";
  updated_at: string;
};

export async function getPublishedArticles(): Promise<PublishedArticle[]> {
  return fetchPublishedArticlesFromSupabase();
}

export async function getArticleBySlug(slug: string): Promise<PublishedArticle | null> {
  const client = getSupabaseServerClient();

  if (!client) {
    return getArticles().find((article) => article.slug === slug) ?? null;
  }

  const { data, error } = await client
    .from("articles")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getArticleBySlug error:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  const categoryMap = buildCategoryNameMap(await fetchCategoryRows(client));
  const tagMap = await fetchArticleTagMap(client, [String(data.id)]);

  return normalizeArticle(data, {
    categoryName: data.category_id ? categoryMap.get(String(data.category_id)) : undefined,
    tags: tagMap.get(String(data.id)),
  });
}

export async function getRelatedArticles(
  categoryId: string | undefined,
  currentArticleId: string,
): Promise<PublishedArticle[]> {
  const client = getSupabaseServerClient();

  if (!client) {
    return getArticles()
      .filter((article) => article.id !== currentArticleId)
      .filter((article) => article.category === categoryId)
      .slice(0, 3);
  }

  if (!categoryId) {
    return [];
  }

  const { data, error } = await client
    .from("articles")
    .select("*")
    .eq("status", "published")
    .eq("category_id", categoryId)
    .neq("id", currentArticleId)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("getRelatedArticles error:", error);
    return [];
  }

  const rows = data ?? [];
  const categoryMap = buildCategoryNameMap(await fetchCategoryRows(client));
  const tagMap = await fetchArticleTagMap(
    client,
    rows.map((row) => String(row.id)),
  );

  return rows.map((row) =>
    normalizeArticle(row, {
      categoryName: row.category_id ? categoryMap.get(String(row.category_id)) : undefined,
      tags: tagMap.get(String(row.id)),
    }),
  );
}

export async function getAdminArticles(): Promise<AdminArticleDbResult<AdminArticle[]>> {
  const client = getAdminBrowserClient();

  if (!client) {
    return { success: false, data: [], error: "missing_supabase_config" };
  }

  const { data, error } = await client.from("articles").select("*").order("updated_at", { ascending: false });

  if (error) {
    console.error("getAdminArticles error:", error);
    return { success: false, data: [], error: getAdminFriendlyErrorMessage(error, "文章列表读取失败，请稍后重试。") };
  }

  return { success: true, data: (data ?? []) as AdminArticle[] };
}

export async function getAdminArticleById(id: string): Promise<AdminArticleDbResult<AdminArticle | null>> {
  const client = getAdminBrowserClient();

  if (!client) {
    return { success: false, data: null, error: "missing_supabase_config" };
  }

  const { data, error } = await client.from("articles").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("getAdminArticleById error:", error);
    return { success: false, data: null, error: getAdminFriendlyErrorMessage(error, "文章读取失败，请稍后重试。") };
  }

  return { success: true, data: (data ?? null) as AdminArticle | null };
}

export async function createArticle(data: AdminArticleInput): Promise<AdminArticleDbResult<AdminArticle>> {
  const client = getAdminBrowserClient();

  if (!client) {
    return { success: false, error: "missing_supabase_config" };
  }

  const authError = await ensureAdminSession(client, "createArticle");

  if (authError) {
    return { success: false, error: authError };
  }

  const payload = buildArticlePayload(data);
  console.log("createArticle payload:", payload);

  const { data: createdArticle, error } = await client
    .from("articles")
    .insert(payload as ArticleInsert)
    .select("*")
    .single();

  if (error) {
    console.error("createArticle error:", error);
    return { success: false, error: getArticleWriteErrorMessage(error) };
  }

  return { success: true, data: createdArticle as AdminArticle };
}

export async function updateArticle(id: string, data: AdminArticleInput): Promise<AdminArticleDbResult<AdminArticle>> {
  const client = getAdminBrowserClient();

  if (!client) {
    return { success: false, error: "missing_supabase_config" };
  }

  const authError = await ensureAdminSession(client, "updateArticle");

  if (authError) {
    return { success: false, error: authError };
  }

  const payload = buildArticlePayload(data);
  console.log("updateArticle payload:", payload);

  const { data: updatedArticle, error } = await client
    .from("articles")
    .update(payload as ArticleUpdate)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("updateArticle error:", error);
    return { success: false, error: getArticleWriteErrorMessage(error) };
  }

  return { success: true, data: updatedArticle as AdminArticle };
}

export async function deleteArticle(id: string): Promise<AdminArticleDbResult<null>> {
  const client = getAdminBrowserClient();

  if (!client) {
    return { success: false, error: "missing_supabase_config" };
  }

  const authError = await ensureAdminSession(client, "deleteArticle");

  if (authError) {
    return { success: false, error: authError };
  }

  const { error } = await client.from("articles").delete().eq("id", id);

  if (error) {
    console.error("deleteArticle error:", error);
    return { success: false, error: getAdminFriendlyErrorMessage(error, "删除失败，请稍后重试。") };
  }

  return { success: true, data: null };
}

async function fetchPublishedArticlesFromSupabase(): Promise<PublishedArticle[]> {
  const client = getSupabaseServerClient();

  if (!client) {
    return getArticles();
  }

  const { data, error } = await client
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("updated_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("getPublishedArticles error:", error);
    return [];
  }

  const rows = data ?? [];
  const categoryMap = buildCategoryNameMap(await fetchCategoryRows(client));
  const tagMap = await fetchArticleTagMap(
    client,
    rows.map((row) => String(row.id)),
  );

  return rows.map((row) =>
    normalizeArticle(row, {
      categoryName: row.category_id ? categoryMap.get(String(row.category_id)) : undefined,
      tags: tagMap.get(String(row.id)),
    }),
  );
}

async function fetchArticleTagMap(client: SupabaseServerClient, articleIds: string[]) {
  const tagMap = new Map<string, string[]>();

  if (articleIds.length === 0) {
    return tagMap;
  }

  const { data, error } = await client
    .from("article_tags")
    .select("article_id,tags(name,slug)")
    .in("article_id", articleIds);

  if (error) {
    logSupabaseError("fetch article tags", error);
    return tagMap;
  }

  for (const record of toRecordArray(data)) {
    const articleId = typeof record.article_id === "string" ? record.article_id : undefined;
    const tagName = readNestedName(record.tags);

    if (!articleId || !tagName) {
      continue;
    }

    const tags = tagMap.get(articleId) ?? [];
    tags.push(tagName);
    tagMap.set(articleId, tags);
  }

  return tagMap;
}

export function getRelatedArticlesFromList(article: ArticleItem) {
  return getArticles()
    .filter((item) => item.slug !== article.slug)
    .filter((item) => item.category === article.category)
    .slice(0, 3);
}

function getAdminBrowserClient() {
  if (typeof window === "undefined") {
    return null;
  }

  return getSupabaseBrowserClient();
}

async function ensureAdminSession(client: SupabaseClient<Database>, action: string) {
  const { data, error } = await client.auth.getUser();

  if (error) {
    console.error(`${action} auth error:`, error);
    return getAdminAuthErrorMessage(error);
  }

  if (!data.user) {
    console.error(`${action} auth error:`, "Auth session missing");
    return getAdminAuthErrorMessage(null);
  }

  return "";
}

function buildArticlePayload(data: AdminArticleInput): AdminArticlePayload {
  return {
    title: data.title.trim(),
    slug: data.slug.trim() || createSlug(data.title),
    summary: data.summary.trim(),
    content: optionalText(data.content),
    cover_url: optionalText(data.cover_url),
    category_id: optionalUuid(data.category_id),
    status: normalizeStatus(data.status),
    updated_at: new Date().toISOString(),
  };
}

function optionalText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function optionalUuid(value: string | null | undefined) {
  const trimmed = value?.trim();
  return !trimmed || trimmed === "none" ? null : trimmed;
}

function normalizeStatus(status: string | undefined) {
  return status === "published" ? "published" : "draft";
}

function createSlug(value: string) {
  const slug = value
    .normalize("NFKD")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || `article-${Date.now()}`;
}

function getArticleWriteErrorMessage(error: { code?: string; message: string }) {
  const message = error.message.toLowerCase();
  const permissionMessage = getAdminFriendlyErrorMessage(error, "");

  if (permissionMessage) {
    return permissionMessage;
  }

  if (error.code === "23505" || message.includes("duplicate")) {
    return "slug 已存在，请换一个 slug。";
  }

  return "保存失败，请检查控制台错误信息。";
}

export type { ArticleRow };
