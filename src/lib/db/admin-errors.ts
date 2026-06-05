type AdminErrorLike = {
  code?: string | null;
  details?: string | null;
  hint?: string | null;
  message?: string | null;
  name?: string | null;
  status?: number | string | null;
};

export const adminPermissionErrorMessage = "权限不足，请检查 Supabase RLS 配置。";
export const adminSessionExpiredMessage = "登录状态已失效，请重新登录后台。";

export function getAdminFriendlyErrorMessage(error: AdminErrorLike | null | undefined, fallback: string) {
  if (!error) {
    return fallback;
  }

  const searchableText = [
    error.code,
    error.details,
    error.hint,
    error.message,
    error.name,
    String(error.status ?? ""),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    error.code === "42501" ||
    searchableText.includes("permission denied") ||
    searchableText.includes("row-level security") ||
    searchableText.includes("violates row-level security policy") ||
    searchableText.includes("insufficient_privilege")
  ) {
    return adminPermissionErrorMessage;
  }

  return fallback;
}

export function getAdminAuthErrorMessage(error: AdminErrorLike | null | undefined) {
  return getAdminFriendlyErrorMessage(error, adminSessionExpiredMessage);
}
