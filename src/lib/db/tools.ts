import { mockTools } from "@/data/mock-tools";
import type { Database, ToolRow } from "@/types/database";
import type { AdminDbResult, AdminTool, AdminToolInput, ToolItem } from "@/types/tool";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSupabaseServerClient, logSupabaseError, type SupabaseServerClient } from "@/lib/supabase/server";
import { getAdminAuthErrorMessage, getAdminFriendlyErrorMessage } from "./admin-errors";
import { buildCategoryNameMap, normalizeTool, readNestedName, toRecordArray } from "./normalizers";
import { fetchCategoryRows } from "./categories";
import type { SupabaseClient } from "@supabase/supabase-js";

type ToolInsert = Database["public"]["Tables"]["tools"]["Insert"];
type ToolUpdate = Database["public"]["Tables"]["tools"]["Update"];
type AdminToolPayload = {
  title: string;
  slug: string;
  summary: string;
  description: string | null;
  website_url: string | null;
  cover_url: string | null;
  category_id: string | null;
  is_free: boolean;
  is_open_source: boolean;
  target_users: string | null;
  use_cases: string | null;
  pros: string | null;
  cons: string | null;
  risk_notice: string | null;
  status: "draft" | "published";
  updated_at: string;
};
type ToolInsertPayload = ToolInsert & AdminToolPayload;
type ToolUpdatePayload = ToolUpdate & AdminToolPayload;

export async function getPublishedTools(): Promise<ToolItem[]> {
  return fetchPublishedToolsFromSupabase();
}

export async function getToolBySlug(slug: string): Promise<ToolItem | null> {
  const client = getSupabaseServerClient();

  if (!client) {
    return mockTools.find((tool) => tool.slug === slug) ?? null;
  }

  const { data, error } = await client
    .from("tools")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    logSupabaseError(`fetch tool by slug: ${slug}`, error);
    return null;
  }

  if (!data) {
    return null;
  }

  const categoryMap = buildCategoryNameMap(await fetchCategoryRows(client));
  const tagMap = await fetchToolTagMap(client, [String(data.id)]);

  return normalizeTool(data, {
    categoryName: data.category_id ? categoryMap.get(String(data.category_id)) : undefined,
    tags: tagMap.get(String(data.id)),
  });
}

export async function getRelatedTools(categoryId: string | undefined, currentToolId: string): Promise<ToolItem[]> {
  const client = getSupabaseServerClient();

  if (!client) {
    return mockTools
      .filter((tool) => tool.id !== currentToolId)
      .filter((tool) => tool.category === categoryId)
      .slice(0, 3);
  }

  if (!categoryId) {
    return [];
  }

  const { data, error } = await client
    .from("tools")
    .select("*")
    .eq("status", "published")
    .eq("category_id", categoryId)
    .neq("id", currentToolId)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    logSupabaseError(`fetch related tools: ${categoryId}`, error);
    return [];
  }

  const rows = data ?? [];
  const categoryMap = buildCategoryNameMap(await fetchCategoryRows(client));
  const tagMap = await fetchToolTagMap(
    client,
    rows.map((row) => String(row.id)),
  );

  return rows.map((row) =>
    normalizeTool(row, {
      categoryName: row.category_id ? categoryMap.get(String(row.category_id)) : undefined,
      tags: tagMap.get(String(row.id)),
    }),
  );
}

export async function getAdminTools(): Promise<AdminDbResult<AdminTool[]>> {
  const client = getAdminBrowserClient();

  if (!client) {
    return { success: false, data: [], error: "missing_supabase_config" };
  }

  const { data, error } = await client.from("tools").select("*").order("updated_at", { ascending: false });

  if (error) {
    console.error("fetch admin tools failed", error);
    return { success: false, data: [], error: getAdminFriendlyErrorMessage(error, "工具列表读取失败，请稍后重试。") };
  }

  return { success: true, data: data ?? [] };
}

export async function getAdminToolById(id: string): Promise<AdminDbResult<AdminTool | null>> {
  const client = getAdminBrowserClient();

  if (!client) {
    return { success: false, data: null, error: "missing_supabase_config" };
  }

  const { data, error } = await client.from("tools").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error(`fetch admin tool failed: ${id}`, error);
    return { success: false, data: null, error: getAdminFriendlyErrorMessage(error, "工具读取失败，请稍后重试。") };
  }

  return { success: true, data: data ?? null };
}

export async function createTool(data: AdminToolInput): Promise<AdminDbResult<AdminTool>> {
  const client = getAdminBrowserClient();

  if (!client) {
    return { success: false, error: "missing_supabase_config" };
  }

  const authError = await ensureAdminSession(client, "createTool");

  if (authError) {
    return { success: false, error: authError };
  }

  const payload = buildToolPayload(data, "insert");
  console.log("createTool payload:", payload);
  const { data: createdTool, error } = await client.from("tools").insert(payload).select("*").single();

  if (error) {
    console.error("createTool error:", error);
    return { success: false, error: getToolWriteErrorMessage(error) };
  }

  return { success: true, data: createdTool };
}

export async function updateTool(id: string, data: AdminToolInput): Promise<AdminDbResult<AdminTool>> {
  const client = getAdminBrowserClient();

  if (!client) {
    return { success: false, error: "missing_supabase_config" };
  }

  const authError = await ensureAdminSession(client, "updateTool");

  if (authError) {
    return { success: false, error: authError };
  }

  const payload = buildToolPayload(data, "update");
  console.log("updateTool payload:", payload);
  const { data: updatedTool, error } = await client.from("tools").update(payload).eq("id", id).select("*").single();

  if (error) {
    console.error("updateTool error:", error);
    return { success: false, error: getToolWriteErrorMessage(error) };
  }

  return { success: true, data: updatedTool };
}

export async function deleteTool(id: string): Promise<AdminDbResult<null>> {
  const client = getAdminBrowserClient();

  if (!client) {
    return { success: false, error: "missing_supabase_config" };
  }

  const authError = await ensureAdminSession(client, "deleteTool");

  if (authError) {
    return { success: false, error: authError };
  }

  const { error } = await client.from("tools").delete().eq("id", id);

  if (error) {
    console.error(`delete tool failed: ${id}`, error);
    return { success: false, error: getAdminFriendlyErrorMessage(error, "删除失败，请稍后重试。") };
  }

  return { success: true, data: null };
}

async function fetchPublishedToolsFromSupabase(): Promise<ToolItem[]> {
  const client = getSupabaseServerClient();

  if (!client) {
    return mockTools;
  }

  const { data, error } = await client
    .from("tools")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    logSupabaseError("fetch published tools", error);
    return [];
  }

  const rows = data ?? [];
  const categoryMap = buildCategoryNameMap(await fetchCategoryRows(client));
  const tagMap = await fetchToolTagMap(
    client,
    rows.map((row) => String(row.id)),
  );

  return rows.map((row) =>
    normalizeTool(row, {
      categoryName: row.category_id ? categoryMap.get(String(row.category_id)) : undefined,
      tags: tagMap.get(String(row.id)),
    }),
  );
}

async function fetchToolTagMap(client: SupabaseServerClient, toolIds: string[]) {
  const tagMap = new Map<string, string[]>();

  if (toolIds.length === 0) {
    return tagMap;
  }

  const { data, error } = await client.from("tool_tags").select("tool_id,tags(name,slug)").in("tool_id", toolIds);

  if (error) {
    logSupabaseError("fetch tool tags", error);
    return tagMap;
  }

  for (const record of toRecordArray(data)) {
    const toolId = typeof record.tool_id === "string" ? record.tool_id : undefined;
    const tagName = readNestedName(record.tags);

    if (!toolId || !tagName) {
      continue;
    }

    const tags = tagMap.get(toolId) ?? [];
    tags.push(tagName);
    tagMap.set(toolId, tags);
  }

  return tagMap;
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

function buildToolPayload(data: AdminToolInput, mode: "insert"): ToolInsertPayload;
function buildToolPayload(data: AdminToolInput, mode: "update"): ToolUpdatePayload;
function buildToolPayload(data: AdminToolInput, mode: "insert" | "update") {
  const now = new Date().toISOString();
  const commonPayload: AdminToolPayload = {
    title: data.title.trim(),
    slug: normalizeSlug(data.slug, data.title),
    summary: data.summary.trim(),
    description: optionalText(data.description),
    website_url: optionalText(data.website_url),
    cover_url: optionalText(data.cover_url),
    category_id: optionalUuid(data.category_id),
    is_free: data.is_free,
    is_open_source: data.is_open_source,
    target_users: optionalText(data.target_users),
    use_cases: optionalText(data.use_cases),
    pros: optionalText(data.pros),
    cons: optionalText(data.cons),
    risk_notice: optionalText(data.risk_notice),
    status: normalizeStatus(data.status),
    updated_at: now,
  };

  if (mode === "insert") {
    return commonPayload satisfies ToolInsertPayload;
  }

  return commonPayload satisfies ToolUpdatePayload;
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

function normalizeSlug(slug: string, title: string) {
  const trimmedSlug = slug.trim();
  const source = trimmedSlug || title.trim();
  const normalized = source
    .normalize("NFKD")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (normalized) {
    return normalized;
  }

  return `tool-${Date.now()}`;
}

function getToolWriteErrorMessage(error: { code?: string; message: string }) {
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

export type { ToolRow };
