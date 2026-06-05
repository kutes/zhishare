"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminCategories } from "@/lib/db/categories";
import { deleteTool, getAdminTools } from "@/lib/db/tools";
import type { AdminCategoryOption, AdminTool } from "@/types/tool";

type PageStatus = "loading" | "ready";

export default function AdminToolsPage() {
  const [status, setStatus] = useState<PageStatus>("loading");
  const [tools, setTools] = useState<AdminTool[]>([]);
  const [categories, setCategories] = useState<AdminCategoryOption[]>([]);
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const categoryMap = useMemo(() => {
    return new Map(categories.map((category) => [category.id, category.name]));
  }, [categories]);

  useEffect(() => {
    let mounted = true;

    async function loadTools() {
      setStatus("loading");
      setMessage("");

      const [toolResult, categoryResult] = await Promise.all([getAdminTools(), getAdminCategories()]);

      if (!mounted) {
        return;
      }

      if (!toolResult.success) {
        setMessage(toolResult.error || "工具列表读取失败，请稍后重试。");
      }

      if (!categoryResult.success) {
        setMessage((current) => current || categoryResult.error || "分类读取失败，列表仍可继续查看。");
      }

      setTools(toolResult.data ?? []);
      setCategories(categoryResult.data ?? []);
      setStatus("ready");
    }

    loadTools();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleDelete(tool: AdminTool) {
    const title = getToolTitle(tool);
    const confirmed = window.confirm(`确认删除「${title}」吗？此操作不可撤销。`);

    if (!confirmed) {
      return;
    }

    setDeletingId(tool.id);
    setMessage("");

    const result = await deleteTool(tool.id);

    if (!result.success) {
      setMessage(result.error || "删除失败，请稍后重试。");
      setDeletingId("");
      return;
    }

    setTools((current) => current.filter((item) => item.id !== tool.id));
    setDeletingId("");
  }

  return (
    <AdminShell>
      <section className="glass-card-strong p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-sky-700">工具内容</p>
            <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl">工具管理</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">管理前台工具库中展示的工具内容。</p>
          </div>
          <Link
            href="/admin/tools/new"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-ink px-5 py-2 text-sm font-bold text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            新增工具
          </Link>
        </div>
      </section>

      {message ? (
        <section className="rounded-3xl border border-amber-200 bg-amber-50/80 p-5 text-sm font-semibold leading-7 text-amber-800 shadow-sm">
          {message}
        </section>
      ) : null}

      <section className="glass-card p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-ink">工具列表</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {status === "loading" ? "正在读取工具..." : `当前共 ${tools.length} 个工具`}
            </p>
          </div>
        </div>

        {status === "ready" && tools.length === 0 ? (
          <div className="rounded-3xl border border-white/75 bg-white/65 p-8 text-center">
            <h3 className="text-xl font-black text-ink">暂无工具</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">可以先新增一个 draft 工具，确认内容后再发布。</p>
            <Link
              href="/admin/tools/new"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl bg-ink px-5 py-2 text-sm font-bold text-white"
            >
              新增工具
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-separate border-spacing-y-3 text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-2">工具名称</th>
                  <th className="px-4 py-2">slug</th>
                  <th className="px-4 py-2">官网</th>
                  <th className="px-4 py-2">分类</th>
                  <th className="px-4 py-2">免费</th>
                  <th className="px-4 py-2">开源</th>
                  <th className="px-4 py-2">状态</th>
                  <th className="px-4 py-2">更新时间</th>
                  <th className="px-4 py-2 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {tools.map((tool) => (
                  <tr key={tool.id} className="rounded-3xl bg-white/70 shadow-sm">
                    <td className="rounded-l-3xl px-4 py-4 font-bold text-ink">{getToolTitle(tool)}</td>
                    <td className="px-4 py-4 text-slate-600">{tool.slug ?? "-"}</td>
                    <td className="max-w-[180px] truncate px-4 py-4 text-slate-600">
                      {tool.website_url ? (
                        <a
                          href={tool.website_url}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="font-semibold text-sky-700 hover:text-sky-900"
                        >
                          {tool.website_url}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {tool.category_id ? categoryMap.get(tool.category_id) ?? "未命名分类" : tool.category ?? "-"}
                    </td>
                    <td className="px-4 py-4">{tool.is_free ? "是" : "否"}</td>
                    <td className="px-4 py-4">{tool.is_open_source ? "是" : "否"}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          tool.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {tool.status ?? "draft"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{formatDate(tool.updated_at)}</td>
                    <td className="rounded-r-3xl px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/tools/${tool.id}/edit`}
                          className="rounded-xl border border-sky-100 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100"
                        >
                          编辑
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(tool)}
                          disabled={deletingId === tool.id}
                          className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === tool.id ? "删除中" : "删除"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  );
}

function getToolTitle(tool: AdminTool) {
  return tool.title || tool.name || "未命名工具";
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}
