"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminToolForm } from "@/components/admin/AdminToolForm";
import { getAdminCategories } from "@/lib/db/categories";
import { getAdminToolById, updateTool } from "@/lib/db/tools";
import type { Json } from "@/types/database";
import type { AdminCategoryOption, AdminTool, AdminToolInput, ToolStatus } from "@/types/tool";

type PageStatus = "loading" | "ready" | "notFound";

export default function EditAdminToolPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const toolId = params.id;
  const [status, setStatus] = useState<PageStatus>("loading");
  const [tool, setTool] = useState<AdminTool | null>(null);
  const [categories, setCategories] = useState<AdminCategoryOption[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadTool() {
      setStatus("loading");
      setNotice("");

      const [toolResult, categoryResult] = await Promise.all([getAdminToolById(toolId), getAdminCategories()]);

      if (!mounted) {
        return;
      }

      if (!categoryResult.success) {
        setNotice(categoryResult.error || "分类读取失败，仍可继续编辑工具。");
      }

      setCategories(categoryResult.data ?? []);

      if (!toolResult.success || !toolResult.data) {
        setTool(null);
        setStatus("notFound");
        return;
      }

      setTool(toolResult.data);
      setStatus("ready");
    }

    loadTool();

    return () => {
      mounted = false;
    };
  }, [toolId]);

  async function handleSubmit(data: AdminToolInput) {
    const result = await updateTool(toolId, data);

    if (result.success) {
      router.push("/admin/tools");
    }

    return result;
  }

  return (
    <AdminShell>
      <section className="glass-card-strong p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-sky-700">编辑内容</p>
            <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl">编辑工具</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">修改工具内容后保存，会更新 Supabase tools 表。</p>
          </div>
          <Link
            href="/admin/tools"
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
        <section className="glass-card p-6 text-sm font-semibold leading-7 text-slate-600">正在读取工具内容...</section>
      ) : null}

      {status === "notFound" ? (
        <section className="glass-card p-8 text-center">
          <h2 className="text-xl font-black text-ink">没有找到这个工具</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">你可以返回工具管理列表重新选择。</p>
          <Link
            href="/admin/tools"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl bg-ink px-5 py-2 text-sm font-bold text-white"
          >
            返回工具管理
          </Link>
        </section>
      ) : null}

      {status === "ready" && tool ? (
        <AdminToolForm
          mode="edit"
          categories={categories}
          initialValues={toFormValues(tool)}
          onSubmit={handleSubmit}
        />
      ) : null}
    </AdminShell>
  );
}

function toFormValues(tool: AdminTool): AdminToolInput {
  return {
    title: tool.title ?? tool.name ?? "",
    slug: tool.slug ?? "",
    summary: tool.summary ?? "",
    description: tool.description ?? "",
    website_url: tool.website_url ?? "",
    download_url: tool.download_url ?? "",
    cover_url: tool.cover_url ?? "",
    category_id: tool.category_id ?? "",
    is_free: Boolean(tool.is_free),
    is_open_source: Boolean(tool.is_open_source),
    target_users: jsonToText(tool.target_users),
    use_cases: jsonToText(tool.use_cases),
    pros: jsonToText(tool.pros),
    cons: jsonToText(tool.cons),
    risk_notice: tool.risk_notice ?? "",
    status: normalizeStatus(tool.status),
  };
}

function normalizeStatus(status: string | null): ToolStatus {
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
