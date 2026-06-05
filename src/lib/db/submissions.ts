"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getAdminAuthErrorMessage, getAdminFriendlyErrorMessage } from "./admin-errors";
import type {
  AdminSubmission,
  AdminSubmissionDbResult,
  AdminSubmissionStatus,
  DbWriteResult,
  SubmissionInput,
  SubmissionInsert,
} from "@/types/submission";

const allowedAdminStatuses: AdminSubmissionStatus[] = ["pending", "reviewed", "rejected"];

export async function createSubmission(data: SubmissionInput): Promise<DbWriteResult> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return { success: false, error: "missing_supabase_config" };
  }

  const payload: SubmissionInsert = {
    tool_name: data.tool_name,
    website_url: data.website_url,
    summary: data.summary,
    reason: data.reason?.trim() || undefined,
    email: data.email?.trim() || undefined,
    status: "pending",
  };

  const { error } = await supabase.from("submissions").insert(payload);

  if (error) {
    console.error("[Supabase] createSubmission", error);
    return { success: false, error: "insert_failed" };
  }

  return { success: true };
}

export async function getAdminSubmissions(): Promise<AdminSubmissionDbResult<AdminSubmission[]>> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return { success: false, data: [], error: "missing_supabase_config" };
  }

  const authError = await ensureAdminSession("getAdminSubmissions");

  if (authError) {
    return { success: false, data: [], error: authError };
  }

  const { data, error } = await supabase.from("submissions").select("*").order("created_at", { ascending: false });

  if (error) {
    console.error("getAdminSubmissions error:", error);
    return {
      success: false,
      data: [],
      error: getAdminFriendlyErrorMessage(error, "投稿列表读取失败，请稍后重试。"),
    };
  }

  return { success: true, data: data ?? [] };
}

export async function updateSubmissionStatus(
  id: string,
  status: AdminSubmissionStatus,
): Promise<AdminSubmissionDbResult<AdminSubmission>> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return { success: false, error: "missing_supabase_config" };
  }

  if (!allowedAdminStatuses.includes(status)) {
    return { success: false, error: "状态不合法。" };
  }

  const authError = await ensureAdminSession("updateSubmissionStatus");

  if (authError) {
    return { success: false, error: authError };
  }

  const { data, error } = await supabase.from("submissions").update({ status }).eq("id", id).select("*").single();

  if (error) {
    console.error("updateSubmissionStatus error:", error);
    return { success: false, error: getAdminFriendlyErrorMessage(error, "状态更新失败，请稍后重试。") };
  }

  return { success: true, data };
}

export async function deleteSubmission(id: string): Promise<AdminSubmissionDbResult<null>> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return { success: false, error: "missing_supabase_config" };
  }

  const authError = await ensureAdminSession("deleteSubmission");

  if (authError) {
    return { success: false, error: authError };
  }

  const { error } = await supabase.from("submissions").delete().eq("id", id);

  if (error) {
    console.error("deleteSubmission error:", error);
    return { success: false, error: getAdminFriendlyErrorMessage(error, "删除失败，请稍后重试。") };
  }

  return { success: true, data: null };
}

async function ensureAdminSession(action: string) {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return "missing_supabase_config";
  }

  const { data, error } = await supabase.auth.getUser();

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
