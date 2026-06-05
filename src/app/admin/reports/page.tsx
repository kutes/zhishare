"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { deleteReport, getAdminReports, updateReportStatus } from "@/lib/db/reports";
import type { AdminReport, AdminReportStatus } from "@/types/report";

type PageStatus = "loading" | "ready";
type MessageType = "info" | "error";

const statusOptions: Array<{ value: AdminReportStatus; label: string }> = [
  { value: "pending", label: "标记为 pending" },
  { value: "reviewed", label: "标记为 reviewed" },
  { value: "resolved", label: "标记为 resolved" },
  { value: "rejected", label: "标记为 rejected" },
];

export default function AdminReportsPage() {
  const [pageStatus, setPageStatus] = useState<PageStatus>("loading");
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [expandedId, setExpandedId] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("info");

  const stats = useMemo(() => {
    return reports.reduce(
      (result, report) => {
        result.total += 1;

        if (report.status === "pending") {
          result.pending += 1;
        }

        if (report.status === "reviewed") {
          result.reviewed += 1;
        }

        if (report.status === "resolved") {
          result.resolved += 1;
        }

        if (report.status === "rejected") {
          result.rejected += 1;
        }

        return result;
      },
      { total: 0, pending: 0, reviewed: 0, resolved: 0, rejected: 0 },
    );
  }, [reports]);

  useEffect(() => {
    let mounted = true;

    async function loadReports() {
      setPageStatus("loading");
      const result = await getAdminReports();

      if (!mounted) {
        return;
      }

      if (!result.success) {
        showMessage(result.error || "投诉列表读取失败，请稍后重试。", "error");
      }

      setReports(result.data ?? []);
      setPageStatus("ready");
    }

    loadReports();

    return () => {
      mounted = false;
    };
  }, []);

  function showMessage(nextMessage: string, nextType: MessageType) {
    setMessage(nextMessage);
    setMessageType(nextType);
  }

  async function handleStatusUpdate(id: string, status: AdminReportStatus) {
    setUpdatingId(id);
    setMessage("");

    const result = await updateReportStatus(id, status);

    if (!result.success || !result.data) {
      showMessage(result.error || "状态更新失败，请稍后重试。", "error");
      setUpdatingId("");
      return;
    }

    setReports((current) => current.map((item) => (item.id === id ? result.data! : item)));
    showMessage("投诉状态已更新。", "info");
    setUpdatingId("");
  }

  async function handleDelete(report: AdminReport) {
    const confirmed = window.confirm(`确认删除「${report.owner_name}」提交的这条投诉反馈吗？删除后不可从后台恢复。`);

    if (!confirmed) {
      return;
    }

    setDeletingId(report.id);
    setMessage("");

    const result = await deleteReport(report.id);

    if (!result.success) {
      showMessage(result.error || "删除失败，请稍后重试。", "error");
      setDeletingId("");
      return;
    }

    setReports((current) => current.filter((item) => item.id !== report.id));

    if (expandedId === report.id) {
      setExpandedId("");
    }

    showMessage("投诉反馈已删除。", "info");
    setDeletingId("");
  }

  return (
    <AdminShell>
      <section className="glass-card-strong p-5 sm:p-6">
        <div>
          <p className="text-sm font-bold text-sky-700">权益反馈</p>
          <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl">投诉管理</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            查看版权、权益、链接错误和信息错误反馈，并标记处理状态。
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatsCard label="全部投诉数量" value={stats.total} tone="slate" />
        <StatsCard label="pending 数量" value={stats.pending} tone="amber" />
        <StatsCard label="reviewed 数量" value={stats.reviewed} tone="sky" />
        <StatsCard label="resolved 数量" value={stats.resolved} tone="emerald" />
        <StatsCard label="rejected 数量" value={stats.rejected} tone="rose" />
      </section>

      {message ? (
        <section
          className={`rounded-3xl p-5 text-sm font-semibold leading-7 shadow-sm ${
            messageType === "error"
              ? "border border-rose-200 bg-rose-50/80 text-rose-700"
              : "border border-emerald-200 bg-emerald-50/80 text-emerald-700"
          }`}
        >
          {message}
        </section>
      ) : null}

      <section className="glass-card p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-ink">投诉列表</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {pageStatus === "loading" ? "正在读取投诉反馈..." : `当前共 ${reports.length} 条投诉反馈`}
            </p>
          </div>
        </div>

        {pageStatus === "ready" && reports.length === 0 ? (
          <div className="rounded-3xl border border-white/75 bg-white/65 p-8 text-center">
            <h3 className="text-xl font-black text-ink">暂无投诉反馈</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              用户通过版权投诉页提交反馈后，会显示在这里。
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => {
              const isExpanded = expandedId === report.id;

              return (
                <article key={report.id} className="rounded-3xl border border-white/75 bg-white/70 p-4 shadow-sm sm:p-5">
                  <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="break-words text-lg font-black text-ink">{report.owner_name}</h3>
                        <StatusBadge status={report.status} />
                        <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
                          {report.issue_type}
                        </span>
                      </div>

                      <div className="mt-3 grid gap-3 text-sm leading-7 text-slate-600 md:grid-cols-2">
                        <InfoItem label="联系邮箱">
                          <EmailLink email={report.email} />
                        </InfoItem>
                        <InfoItem label="涉及页面">
                          <ExternalLink url={report.page_url} />
                        </InfoItem>
                        <InfoItem label="提交时间">{formatDateTime(report.created_at)}</InfoItem>
                        <InfoItem label="证明材料">{truncateText(report.proof || "未填写", 72)}</InfoItem>
                        <div className="md:col-span-2">
                          <InfoItem label="处理要求">{truncateText(report.request, 110)}</InfoItem>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 xl:max-w-xs xl:justify-end">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? "" : report.id)}
                        className="min-h-10 rounded-xl border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100"
                      >
                        {isExpanded ? "收起详情" : "查看详情"}
                      </button>

                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleStatusUpdate(report.id, option.value)}
                          disabled={updatingId === report.id || report.status === option.value}
                          className="min-h-10 rounded-xl border border-white/75 bg-white/75 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingId === report.id ? "更新中..." : option.label}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleDelete(report)}
                        disabled={deletingId === report.id}
                        className="min-h-10 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === report.id ? "删除中..." : "删除"}
                      </button>
                    </div>
                  </div>

                  {isExpanded ? (
                    <div className="mt-5 rounded-3xl border border-white/75 bg-white/70 p-4 sm:p-5">
                      <h4 className="text-base font-black text-ink">投诉详情</h4>
                      <div className="mt-4 grid gap-4 text-sm leading-7 text-slate-600 lg:grid-cols-2">
                        <InfoItem label="权利人或机构">{report.owner_name}</InfoItem>
                        <InfoItem label="当前状态">
                          <StatusBadge status={report.status} />
                        </InfoItem>
                        <InfoItem label="联系邮箱">
                          <EmailLink email={report.email} />
                        </InfoItem>
                        <InfoItem label="问题类型">{report.issue_type}</InfoItem>
                        <InfoItem label="涉及页面链接">
                          <ExternalLink url={report.page_url} />
                        </InfoItem>
                        <InfoItem label="提交时间">{formatDateTime(report.created_at)}</InfoItem>
                        <div className="lg:col-span-2">
                          <InfoItem label="证明材料说明">{report.proof || "未填写"}</InfoItem>
                        </div>
                        <div className="lg:col-span-2">
                          <InfoItem label="处理要求">{report.request}</InfoItem>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </AdminShell>
  );
}

function StatsCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "slate" | "amber" | "sky" | "emerald" | "rose";
}) {
  const toneClass = {
    slate: "bg-slate-50 text-slate-700",
    amber: "bg-amber-50 text-amber-700",
    sky: "bg-sky-50 text-sky-700",
    emerald: "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700",
  }[tone];

  return (
    <div className="glass-card p-5">
      <p className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${toneClass}`}>{label}</p>
      <p className="mt-4 text-3xl font-black text-ink">{value}</p>
    </div>
  );
}

function InfoItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold text-slate-400">{label}</p>
      <div className="mt-1 break-words text-sm font-semibold leading-7 text-slate-700">{children}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const knownStatus = status as AdminReportStatus;
  const label = getStatusLabel(status);
  const className =
    knownStatus === "pending"
      ? "bg-amber-50 text-amber-700 ring-amber-100"
      : knownStatus === "reviewed"
        ? "bg-sky-50 text-sky-700 ring-sky-100"
        : knownStatus === "resolved"
          ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
          : knownStatus === "rejected"
            ? "bg-rose-50 text-rose-700 ring-rose-100"
            : "bg-slate-50 text-slate-600 ring-slate-100";

  return <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${className}`}>{label}</span>;
}

function ExternalLink({ url }: { url: string }) {
  if (!url) {
    return <span>未填写</span>;
  }

  if (!isHttpUrl(url)) {
    return <span>{url}</span>;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className="text-sky-700 underline decoration-sky-200 underline-offset-4 hover:text-sky-900"
    >
      {url}
    </a>
  );
}

function EmailLink({ email }: { email: string }) {
  if (!email) {
    return <span>未填写</span>;
  }

  return (
    <a href={`mailto:${email}`} className="text-sky-700 underline decoration-sky-200 underline-offset-4 hover:text-sky-900">
      {email}
    </a>
  );
}

function getStatusLabel(status: string) {
  if (status === "pending") {
    return "待处理";
  }

  if (status === "reviewed") {
    return "已查看";
  }

  if (status === "resolved") {
    return "已处理";
  }

  if (status === "rejected") {
    return "已拒绝";
  }

  return status || "未知状态";
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function truncateText(value: string, maxLength: number) {
  const trimmed = value.trim();

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength)}...`;
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
