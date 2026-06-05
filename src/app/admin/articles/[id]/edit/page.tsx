"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminArticleForm } from "@/components/admin/AdminArticleForm";
import { getAdminCategories } from "@/lib/db/categories";
import { getAdminArticleById, updateArticle } from "@/lib/db/articles";
import type { AdminArticle, AdminArticleInput, ArticleStatus } from "@/types/article";
import type { Json } from "@/types/database";
import type { AdminCategoryOption } from "@/types/tool";

type PageStatus = "loading" | "ready" | "notFound";

export default function EditAdminArticlePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const articleId = params.id;
  const [status, setStatus] = useState<PageStatus>("loading");
  const [article, setArticle] = useState<AdminArticle | null>(null);
  const [categories, setCategories] = useState<AdminCategoryOption[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadArticle() {
      setStatus("loading");
      setNotice("");

      const [articleResult, categoryResult] = await Promise.all([
        getAdminArticleById(articleId),
        getAdminCategories(),
      ]);

      if (!mounted) {
        return;
      }

      if (!categoryResult.success) {
        setNotice(categoryResult.error || "分类读取失败，仍可继续编辑文章。");
      }

      setCategories(categoryResult.data ?? []);

      if (!articleResult.success || !articleResult.data) {
        setArticle(null);
        setStatus("notFound");
        return;
      }

      setArticle(articleResult.data);
      setStatus("ready");
    }

    loadArticle();

    return () => {
      mounted = false;
    };
  }, [articleId]);

  async function handleSubmit(data: AdminArticleInput) {
    const result = await updateArticle(articleId, data);

    if (result.success) {
      router.push("/admin/articles");
    }

    return result;
  }

  return (
    <AdminShell>
      <section className="glass-card-strong p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-sky-700">编辑内容</p>
            <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl">编辑文章</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">修改文章内容后保存，会更新 Supabase articles 表。</p>
          </div>
          <Link
            href="/admin/articles"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/75 bg-white/70 px-5 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
          >
            返回列表
          </Link>
        </div>
      </section>

      {notice ? (
        <section className="rounded-3xl border border-amber-200 bg-amber-50/80 p-5 text-sm font-semibold leading-7 text-amber-800 shadow-sm">
          {notice}
        </section>
      ) : null}

      {status === "loading" ? (
        <section className="glass-card p-6 text-sm font-semibold leading-7 text-slate-600">正在读取文章内容...</section>
      ) : null}

      {status === "notFound" ? (
        <section className="glass-card p-8 text-center">
          <h2 className="text-xl font-black text-ink">没有找到这篇文章</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">你可以返回文章管理列表重新选择。</p>
          <Link
            href="/admin/articles"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl bg-ink px-5 py-2 text-sm font-bold text-white"
          >
            返回文章管理
          </Link>
        </section>
      ) : null}

      {status === "ready" && article ? (
        <AdminArticleForm
          mode="edit"
          categories={categories}
          initialValues={toFormValues(article)}
          onSubmit={handleSubmit}
        />
      ) : null}
    </AdminShell>
  );
}

function toFormValues(article: AdminArticle): AdminArticleInput {
  return {
    title: article.title ?? "",
    slug: article.slug ?? "",
    summary: article.summary ?? "",
    content: jsonToText(article.content),
    cover_url: article.cover_url ?? "",
    category_id: article.category_id ?? "",
    status: normalizeStatus(article.status),
  };
}

function normalizeStatus(status: string | null): ArticleStatus {
  return status === "published" ? "published" : "draft";
}

function jsonToText(value: Json | null) {
  if (value === null) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => (typeof item === "string" ? item : JSON.stringify(item))).join("\n");
  }

  return JSON.stringify(value);
}
