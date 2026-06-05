"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminToolForm } from "@/components/admin/AdminToolForm";
import { getAdminCategories } from "@/lib/db/categories";
import { createTool } from "@/lib/db/tools";
import type { AdminCategoryOption, AdminToolInput } from "@/types/tool";

export default function NewAdminToolPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<AdminCategoryOption[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      const result = await getAdminCategories();

      if (!mounted) {
        return;
      }

      if (!result.success) {
        setNotice(result.error || "分类读取失败，仍可先保存工具。");
      }

      setCategories(result.data ?? []);
    }

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(data: AdminToolInput) {
    const result = await createTool(data);

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
            <p className="text-sm font-bold text-sky-700">新增内容</p>
            <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl">新增工具</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              先保存为 draft，确认内容完整后再切换为 published。
            </p>
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

      <AdminToolForm mode="create" categories={categories} onSubmit={handleSubmit} />
    </AdminShell>
  );
}
