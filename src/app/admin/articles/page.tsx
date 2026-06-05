"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminCategories } from "@/lib/db/categories";
import { deleteArticle, getAdminArticles } from "@/lib/db/articles";
import type { AdminArticle } from "@/types/article";
import type { AdminCategoryOption } from "@/types/tool";

type PageStatus = "loading" | "ready";

export default function AdminArticlesPage() {
  const [status, setStatus] = useState<PageStatus>("loading");
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [categories, setCategories] = useState<AdminCategoryOption[]>([]);
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const categoryMap = useMemo(() => {
    return new Map(categories.map((category) => [category.id, category.name]));
  }, [categories]);

  useEffect(() => {
    let mounted = true;

    async function loadArticles() {
      setStatus("loading");
      setMessage("");

      const [articleResult, categoryResult] = await Promise.all([getAdminArticles(), getAdminCategories()]);

      if (!mounted) {
        return;
      }

      if (!articleResult.success) {
        setMessage(articleResult.error || "文章列表读取失败，请稍后重试。");
      }

      if (!categoryResult.success) {
        setMessage((current) => current || categoryResult.error || "分类读取失败，列表仍可继续查看。");
      }

      setArticles(articleResult.data ?? []);
      setCategories(categoryResult.data ?? []);
      setStatus("ready");
    }

    loadArticles();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleDelete(article: AdminArticle) {
    const title = getArticleTitle(article);
    const confirmed = window.confirm(`确认删除「${title}」吗？此操作不可撤销。`);

    if (!confirmed) {
      return;
    }

    setDeletingId(article.id);
    setMessage("");

    const result = await deleteArticle(article.id);

    if (!result.success) {
      setMessage(result.error || "删除失败，请稍后重试。");
      setDeletingId("");
      return;
    }

    setArticles((current) => current.filter((item) => item.id !== article.id));
    setDeletingId("");
  }

  return (
    <AdminShell>
      <section className="glass-card-strong p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-sky-700">文章内容</p>
            <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl">文章管理</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">管理前台文章、教程和知识内容。</p>
          </div>
          <Link
            href="/admin/articles/new"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-ink px-5 py-2 text-sm font-bold text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            新增文章
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
            <h2 className="text-xl font-black text-ink">文章列表</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {status === "loading" ? "正在读取文章..." : `当前共 ${articles.length} 篇文章`}
            </p>
          </div>
        </div>

        {status === "ready" && articles.length === 0 ? (
          <div className="rounded-3xl border border-white/75 bg-white/65 p-8 text-center">
            <h3 className="text-xl font-black text-ink">暂无文章</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">可以先新增一篇 draft 文章，确认内容后再发布。</p>
            <Link
              href="/admin/articles/new"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl bg-ink px-5 py-2 text-sm font-bold text-white"
            >
              新增文章
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[780px] w-full border-separate border-spacing-y-3 text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-2">文章标题</th>
                  <th className="px-4 py-2">slug</th>
                  <th className="px-4 py-2">分类</th>
                  <th className="px-4 py-2">状态</th>
                  <th className="px-4 py-2">更新时间</th>
                  <th className="px-4 py-2 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="rounded-3xl bg-white/70 shadow-sm">
                    <td className="rounded-l-3xl px-4 py-4 font-bold text-ink">{getArticleTitle(article)}</td>
                    <td className="px-4 py-4 text-slate-600">{article.slug ?? "-"}</td>
                    <td className="px-4 py-4 text-slate-600">
                      {article.category_id
                        ? categoryMap.get(article.category_id) ?? "未命名分类"
                        : article.category ?? "-"}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          article.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {article.status ?? "draft"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{formatDate(article.updated_at)}</td>
                    <td className="rounded-r-3xl px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="rounded-xl border border-sky-100 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100"
                        >
                          编辑
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(article)}
                          disabled={deletingId === article.id}
                          className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === article.id ? "删除中" : "删除"}
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

function getArticleTitle(article: AdminArticle) {
  return article.title || "未命名文章";
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
