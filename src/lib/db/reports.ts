"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getAdminAuthErrorMessage, getAdminFriendlyErrorMessage } from "./admin-errors";
import type {
  AdminReport,
  AdminReportDbResult,
  AdminReportStatus,
  ReportInput,
  ReportInsert,
  ReportWriteResult,
} from "@/types/report";

const allowedAdminStatuses: AdminReportStatus[] = ["pending", "reviewed", "resolved", "rejected"];

export async function createReport(data: ReportInput): Promise<ReportWriteResult> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return { success: false, error: "missing_supabase_config" };
  }

  const payload: ReportInsert = {
    owner_name: data.owner_name,
    email: data.email,
    page_url: data.page_url,
    issue_type: data.issue_type,
    proof: data.proof?.trim() || undefined,
    request: data.request,
    status: "pending",
  };

  const { error } = await supabase.from("reports").insert(payload);

  if (error) {
    console.error("[Supabase] createReport", error);
    return { success: false, error: "insert_failed" };
  }

  return { success: true };
}

export async function getAdminReports(): Promise<AdminReportDbResult<AdminReport[]>> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return { success: false, data: [], error: "missing_supabase_config" };
  }

  const authError = await ensureAdminSession("getAdminReports");

  if (authError) {
    return { success: false, data: [], error: authError };
  }

  const { data, error } = await supabase.from("reports").select("*").order("created_at", { ascending: false });

  if (error) {
    console.error("getAdminReports error:", error);
    return {
      success: false,
      data: [],
      error: getAdminFriendlyErrorMessage(error, "投诉列表读取失败，请稍后重试。"),
    };
  }

  return { success: true, data: data ?? [] };
}

export async function updateReportStatus(
  id: string,
  status: AdminReportStatus,
): Promise<AdminReportDbResult<AdminReport>> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return { success: false, error: "missing_supabase_config" };
  }

  if (!allowedAdminStatuses.includes(status)) {
    return { success: false, error: "状态不合法。" };
  }

  const authError = await ensureAdminSession("updateReportStatus");

  if (authError) {
    return { success: false, error: authError };
  }

  const { data, error } = await supabase.from("reports").update({ status }).eq("id", id).select("*").single();

  if (error) {
    console.error("updateReportStatus error:", error);
    return { success: false, error: getAdminFriendlyErrorMessage(error, "状态更新失败，请稍后重试。") };
  }

  return { success: true, data };
}

export async function deleteReport(id: string): Promise<AdminReportDbResult<null>> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return { success: false, error: "missing_supabase_config" };
  }

  const authError = await ensureAdminSession("deleteReport");

  if (authError) {
    return { success: false, error: authError };
  }

  const { error } = await supabase.from("reports").delete().eq("id", id);

  if (error) {
    console.error("deleteReport error:", error);
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
