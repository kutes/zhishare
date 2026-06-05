import { mockCategories } from "@/data/mock-tools";
import type { CategoryRow, Database } from "@/types/database";
import type { AdminCategory, AdminCategoryDbResult, AdminCategoryInput } from "@/types/category";
import type { AdminDbResult } from "@/types/tool";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSupabaseServerClient, logSupabaseError, type SupabaseServerClient } from "@/lib/supabase/server";
import { getAdminAuthErrorMessage, getAdminFriendlyErrorMessage } from "./admin-errors";
import { normalizeCategory } from "./normalizers";
import type { SupabaseClient } from "@supabase/supabase-js";

type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];
type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"];

export async function fetchCategoryRows(client: SupabaseServerClient): Promise<CategoryRow[]> {
  const { data, error } = await client.from("categories").select("*").order("created_at", { ascending: false });

  if (error) {
    logSupabaseError("fetch categories", error);
    return [];
  }

  return data ?? [];
}

export async function getCategories() {
  const client = getSupabaseServerClient();

  if (!client) {
    return mockCategories;
  }

  const rows = await fetchCategoryRows(client);

  if (rows.length === 0) {
    return [];
  }

  return rows.map(normalizeCategory);
}

export async function getAdminCategories(): Promise<AdminDbResult<AdminCategory[]>> {
  const client = getAdminBrowserClient();

  if (!client) {
    return { success: false, data: [], error: "missing_supabase_config" };
  }

  const { data, error } = await client.from("categories").select("*").order("name", { ascending: true });

  if (error) {
    console.error("fetch admin categories failed", error);
    return { success: false, data: [], error: getAdminFriendlyErrorMessage(error, "分类列表读取失败，请稍后重试。") };
  }

  return {
    success: true,
    data: (data ?? []).map((category) => ({
      ...category,
      name: category.name ?? "未命名分类",
    })),
  };
}

export async function createCategory(data: AdminCategoryInput): Promise<AdminCategoryDbResult<AdminCategory>> {
  const client = getAdminBrowserClient();

  if (!client) {
    return { success: false, error: "missing_supabase_config" };
  }

  const authError = await ensureAdminSession(client, "createCategory");

  if (authError) {
    return { success: false, error: authError };
  }

  const payload = buildCategoryPayload(data);
  const { data: createdCategory, error } = await client.from("categories").insert(payload).select("*").single();

  if (error) {
    console.error("createCategory error:", error);
    return { success: false, error: getCategoryWriteErrorMessage(error) };
  }

  return { success: true, data: normalizeAdminCategory(createdCategory) };
}

export async function updateCategory(
  id: string,
  data: AdminCategoryInput,
): Promise<AdminCategoryDbResult<AdminCategory>> {
  const client = getAdminBrowserClient();

  if (!client) {
    return { success: false, error: "missing_supabase_config" };
  }

  const authError = await ensureAdminSession(client, "updateCategory");

  if (authError) {
    return { success: false, error: authError };
  }

  const payload = buildCategoryPayload(data);
  const { data: updatedCategory, error } = await client
    .from("categories")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("updateCategory error:", error);
    return { success: false, error: getCategoryWriteErrorMessage(error) };
  }

  return { success: true, data: normalizeAdminCategory(updatedCategory) };
}

export async function deleteCategory(id: string): Promise<AdminCategoryDbResult<null>> {
  const client = getAdminBrowserClient();

  if (!client) {
    return { success: false, error: "missing_supabase_config" };
  }

  const authError = await ensureAdminSession(client, "deleteCategory");

  if (authError) {
    return { success: false, error: authError };
  }

  const { error } = await client.from("categories").delete().eq("id", id);

  if (error) {
    console.error("deleteCategory error:", error);
    return { success: false, error: getCategoryDeleteErrorMessage(error) };
  }

  return { success: true, data: null };
}

function getAdminBrowserClient() {
  if (typeof window === "undefined") {
    return null;
  }

  return getSupabaseBrowserClient();
}

function normalizeAdminCategory(category: CategoryRow): AdminCategory {
  return {
    ...category,
    name: category.name ?? "未命名分类",
  };
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

function buildCategoryPayload(data: AdminCategoryInput): CategoryInsert & CategoryUpdate {
  return {
    name: data.name.trim(),
    slug: data.slug.trim(),
    description: optionalText(data.description),
  };
}

function optionalText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function getCategoryWriteErrorMessage(error: { code?: string; message: string }) {
  const message = error.message.toLowerCase();
  const permissionMessage = getAdminFriendlyErrorMessage(error, "");

  if (permissionMessage) {
    return permissionMessage;
  }

  if (error.code === "23505" || message.includes("duplicate")) {
    return "slug 已存在，请换一个 slug。";
  }

  return "保存失败，请稍后重试。";
}

function getCategoryDeleteErrorMessage(error: { code?: string; message: string }) {
  const message = error.message.toLowerCase();
  const permissionMessage = getAdminFriendlyErrorMessage(error, "");

  if (permissionMessage) {
    return permissionMessage;
  }

  if (error.code === "23503" || message.includes("foreign key")) {
    return "该分类可能正在被工具或文章使用，请先调整相关内容后再删除。";
  }

  return "删除失败，请稍后重试。";
}
