"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { deleteSubmission, getAdminSubmissions, updateSubmissionStatus } from "@/lib/db/submissions";
import type { AdminSubmission, AdminSubmissionStatus } from "@/types/submission";

type PageStatus = "loading" | "ready";
type MessageType = "info" | "error";

const statusOptions: Array<{ value: AdminSubmissionStatus; label: string }> = [
  { value: "pending", label: "标记为 pending" },
  { value: "reviewed", label: "标记为 reviewed" },
  { value: "rejected", label: "标记为 rejected" },
];

export default function AdminSubmissionsPage() {
  const [pageStatus, setPageStatus] = useState<PageStatus>("loading");
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [expandedId, setExpandedId] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("info");

  const stats = useMemo(() => {
    return submissions.reduce(
      (result, submission) => {
        result.total += 1;

        if (submission.status === "pending") {
          result.pending += 1;
        }

        if (submission.status === "reviewed") {
          result.reviewed += 1;
        }

        if (submission.status === "rejected") {
          result.rejected += 1;
        }

        return result;
      },
      { total: 0, pending: 0, reviewed: 0, rejected: 0 },
    );
  }, [submissions]);

  useEffect(() => {
    let mounted = true;

    async function loadSubmissions() {
      setPageStatus("loading");
      const result = await getAdminSubmissions();

      if (!mounted) {
        return;
      }

      if (!result.success) {
        showMessage(result.error || "投稿列表读取失败，请稍后重试。", "error");
      }

      setSubmissions(result.data ?? []);
      setPageStatus("ready");
    }

    loadSubmissions();

    return () => {
      mounted = false;
    };
  }, []);

  function showMessage(nextMessage: string, nextType: MessageType) {
    setMessage(nextMessage);
    setMessageType(nextType);
  }

  async function handleStatusUpdate(id: string, status: AdminSubmissionStatus) {
    setUpdatingId(id);
    setMessage("");

    const result = await updateSubmissionStatus(id, status);

    if (!result.success || !result.data) {
      showMessage(result.error || "状态更新失败，请稍后重试。", "error");
      setUpdatingId("");
      return;
    }

    setSubmissions((current) => current.map((item) => (item.id === id ? result.data! : item)));
    showMessage("投稿状态已更新。", "info");
    setUpdatingId("");
  }

  async function handleDelete(submission: AdminSubmission) {
    const confirmed = window.confirm(`确认删除「${submission.tool_name}」这条投稿吗？删除后不可从后台恢复。`);

    if (!confirmed) {
      return;
    }

    setDeletingId(submission.id);
    setMessage("");

    const result = await deleteSubmission(submission.id);

    if (!result.success) {
      showMessage(result.error || "删除失败，请稍后重试。", "error");
      setDeletingId("");
      return;
    }

    setSubmissions((current) => current.filter((item) => item.id !== submission.id));

    if (expandedId === submission.id) {
      setExpandedId("");
    }

    showMessage("投稿已删除。", "info");
    setDeletingId("");
  }

  return (
    <AdminShell>
      <section className="glass-card-strong p-5 sm:p-6">
        <div>
          <p className="text-sm font-bold text-sky-700">用户推荐</p>
          <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl">投稿管理</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600">查看用户提交的工具推荐，并标记处理状态。</p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="全部投稿数量" value={stats.total} tone="slate" />
        <StatsCard label="pending 数量" value={stats.pending} tone="amber" />
        <StatsCard label="reviewed 数量" value={stats.reviewed} tone="emerald" />
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
            <h2 className="text-xl font-black text-ink">投稿列表</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {pageStatus === "loading" ? "正在读取投稿..." : `当前共 ${submissions.length} 条投稿`}
            </p>
          </div>
        </div>

        {pageStatus === "ready" && submissions.length === 0 ? (
          <div className="rounded-3xl border border-white/75 bg-white/65 p-8 text-center">
            <h3 className="text-xl font-black text-ink">暂无投稿</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">用户通过投稿页提交工具推荐后，会显示在这里。</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {submissions.map((submission) => {
              const isExpanded = expandedId === submission.id;

              return (
                <article key={submission.id} className="rounded-3xl border border-white/75 bg-white/70 p-4 shadow-sm sm:p-5">
                  <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="break-words text-lg font-black text-ink">{submission.tool_name}</h3>
                        <StatusBadge status={submission.status} />
                      </div>

                      <div className="mt-3 grid gap-3 text-sm leading-7 text-slate-600 md:grid-cols-2">
                        <InfoItem label="官方地址">
                          <ExternalLink url={submission.website_url} />
                        </InfoItem>
                        <InfoItem label="提交时间">{formatDateTime(submission.created_at)}</InfoItem>
                        <InfoItem label="推荐人邮箱">{submission.email || "未填写"}</InfoItem>
                        <InfoItem label="工具简介">{submission.summary}</InfoItem>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 xl:max-w-xs xl:justify-end">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? "" : submission.id)}
                        className="min-h-10 rounded-xl border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100"
                      >
                        {isExpanded ? "收起详情" : "查看详情"}
                      </button>

                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleStatusUpdate(submission.id, option.value)}
                          disabled={updatingId === submission.id || submission.status === option.value}
                          className="min-h-10 rounded-xl border border-white/75 bg-white/75 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingId === submission.id ? "更新中..." : option.label}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleDelete(submission)}
                        disabled={deletingId === submission.id}
                        className="min-h-10 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === submission.id ? "删除中..." : "删除"}
                      </button>
                    </div>
                  </div>

                  {isExpanded ? (
                    <div className="mt-5 rounded-3xl border border-white/75 bg-white/70 p-4 sm:p-5">
                      <h4 className="text-base font-black text-ink">投稿详情</h4>
                      <div className="mt-4 grid gap-4 text-sm leading-7 text-slate-600 lg:grid-cols-2">
                        <InfoItem label="工具名称">{submission.tool_name}</InfoItem>
                        <InfoItem label="当前状态">
                          <StatusBadge status={submission.status} />
                        </InfoItem>
                        <InfoItem label="官方地址">
                          <ExternalLink url={submission.website_url} />
                        </InfoItem>
                        <InfoItem label="推荐人邮箱">{submission.email || "未填写"}</InfoItem>
                        <InfoItem label="提交时间">{formatDateTime(submission.created_at)}</InfoItem>
                        <InfoItem label="工具简介">{submission.summary}</InfoItem>
                        <div className="lg:col-span-2">
                          <InfoItem label="推荐理由">{submission.reason || "未填写"}</InfoItem>
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

function StatsCard({ label, value, tone }: { label: string; value: number; tone: "slate" | "amber" | "emerald" | "rose" }) {
  const toneClass = {
    slate: "bg-slate-50 text-slate-700",
    amber: "bg-amber-50 text-amber-700",
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
  const knownStatus = status as AdminSubmissionStatus;
  const label = getStatusLabel(status);
  const className =
    knownStatus === "pending"
      ? "bg-amber-50 text-amber-700 ring-amber-100"
      : knownStatus === "reviewed"
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

function getStatusLabel(status: string) {
  if (status === "pending") {
    return "待处理";
  }

  if (status === "reviewed") {
    return "已查看";
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
