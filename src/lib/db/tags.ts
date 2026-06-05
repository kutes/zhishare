import { getSupabaseServerClient, logSupabaseError } from "@/lib/supabase/server";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getAdminAuthErrorMessage, getAdminFriendlyErrorMessage } from "./admin-errors";
import { normalizeTag } from "./normalizers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TagRow } from "@/types/database";
import type { AdminTag, AdminTagDbResult, AdminTagInput } from "@/types/tag";

type TagInsert = Database["public"]["Tables"]["tags"]["Insert"];
type TagUpdate = Database["public"]["Tables"]["tags"]["Update"];

export async function getTags() {
  const client = getSupabaseServerClient();

  if (!client) {
    return [];
  }

  const { data, error } = await client.from("tags").select("*").order("created_at", { ascending: false });

  if (error) {
    logSupabaseError("fetch tags", error);
    return [];
  }

  return (data ?? []).map(normalizeTag);
}

export async function getAdminTags(): Promise<AdminTagDbResult<AdminTag[]>> {
  const client = getAdminBrowserClient();

  if (!client) {
    return { success: false, data: [], error: "missing_supabase_config" };
  }

  const { data, error } = await client.from("tags").select("*").order("name", { ascending: true });

  if (error) {
    console.error("fetch admin tags failed", error);
    return { success: false, data: [], error: getAdminFriendlyErrorMessage(error, "标签列表读取失败，请稍后重试。") };
  }

  return {
    success: true,
    data: (data ?? []).map(normalizeAdminTag),
  };
}

export async function createTag(data: AdminTagInput): Promise<AdminTagDbResult<AdminTag>> {
  const client = getAdminBrowserClient();

  if (!client) {
    return { success: false, error: "missing_supabase_config" };
  }

  const authError = await ensureAdminSession(client, "createTag");

  if (authError) {
    return { success: false, error: authError };
  }

  const payload = buildTagPayload(data);
  const { data: createdTag, error } = await client.from("tags").insert(payload).select("*").single();

  if (error) {
    console.error("createTag error:", error);
    return { success: false, error: getTagWriteErrorMessage(error) };
  }

  return { success: true, data: normalizeAdminTag(createdTag) };
}

export async function updateTag(id: string, data: AdminTagInput): Promise<AdminTagDbResult<AdminTag>> {
  const client = getAdminBrowserClient();

  if (!client) {
    return { success: false, error: "missing_supabase_config" };
  }

  const authError = await ensureAdminSession(client, "updateTag");

  if (authError) {
    return { success: false, error: authError };
  }

  const payload = buildTagPayload(data);
  const { data: updatedTag, error } = await client.from("tags").update(payload).eq("id", id).select("*").single();

  if (error) {
    console.error("updateTag error:", error);
    return { success: false, error: getTagWriteErrorMessage(error) };
  }

  return { success: true, data: normalizeAdminTag(updatedTag) };
}

export async function deleteTag(id: string): Promise<AdminTagDbResult<null>> {
  const client = getAdminBrowserClient();

  if (!client) {
    return { success: false, error: "missing_supabase_config" };
  }

  const authError = await ensureAdminSession(client, "deleteTag");

  if (authError) {
    return { success: false, error: authError };
  }

  const { error } = await client.from("tags").delete().eq("id", id);

  if (error) {
    console.error("deleteTag error:", error);
    return { success: false, error: getTagDeleteErrorMessage(error) };
  }

  return { success: true, data: null };
}

function getAdminBrowserClient() {
  if (typeof window === "undefined") {
    return null;
  }

  return getSupabaseBrowserClient();
}

function normalizeAdminTag(tag: TagRow): AdminTag {
  return {
    ...tag,
    name: tag.name ?? "未命名标签",
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

function buildTagPayload(data: AdminTagInput): TagInsert & TagUpdate {
  return {
    name: data.name.trim(),
    slug: data.slug.trim(),
  };
}

function getTagWriteErrorMessage(error: { code?: string; message: string }) {
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

function getTagDeleteErrorMessage(error: { code?: string; message: string }) {
  const message = error.message.toLowerCase();
  const permissionMessage = getAdminFriendlyErrorMessage(error, "");

  if (permissionMessage) {
    return permissionMessage;
  }

  if (error.code === "23503" || message.includes("foreign key")) {
    return "该标签可能正在被工具或文章使用，请先调整相关内容后再删除。";
  }

  return "删除失败，请稍后重试。";
}
