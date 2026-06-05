"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { createCategory, deleteCategory, getAdminCategories, updateCategory } from "@/lib/db/categories";
import type { AdminCategory, AdminCategoryInput } from "@/types/category";

type PageStatus = "loading" | "ready";

const initialForm: AdminCategoryInput = {
  name: "",
  slug: "",
  description: "",
};

const inputClass =
  "min-h-12 w-full rounded-2xl border border-white/75 bg-white/75 px-4 text-sm font-medium text-ink shadow-inner outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100";

export default function AdminCategoriesPage() {
  const [status, setStatus] = useState<PageStatus>("loading");
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [formValues, setFormValues] = useState<AdminCategoryInput>(initialForm);
  const [editingId, setEditingId] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"info" | "error">("info");

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return timeB - timeA;
    });
  }, [categories]);

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      setStatus("loading");
      const result = await getAdminCategories();

      if (!mounted) {
        return;
      }

      if (!result.success) {
        showMessage(result.error || "分类列表读取失败，请稍后重试。", "error");
      }

      setCategories(result.data ?? []);
      setStatus("ready");
    }

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  async function reloadCategories() {
    const result = await getAdminCategories();

    if (!result.success) {
      showMessage(result.error || "分类列表刷新失败，请稍后重试。", "error");
      return;
    }

    setCategories(result.data ?? []);
  }

  function showMessage(nextMessage: string, nextType: "info" | "error") {
    setMessage(nextMessage);
    setMessageType(nextType);
  }

  function handleNameChange(nextName: string) {
    setFormValues((current) => ({
      ...current,
      name: nextName,
      slug: slugTouched ? current.slug : createSlug(nextName),
    }));
  }

  function startEdit(category: AdminCategory) {
    setEditingId(category.id);
    setSlugTouched(true);
    setFormValues({
      name: category.name ?? "",
      slug: category.slug ?? "",
      description: category.description ?? "",
    });
    setMessage("");
  }

  function resetForm() {
    setEditingId("");
    setSlugTouched(false);
    setFormValues(initialForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const validationMessage = validateCategory(formValues);

    if (validationMessage) {
      showMessage(validationMessage, "error");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: formValues.name.trim(),
      slug: formValues.slug.trim(),
      description: formValues.description,
    };
    const result = editingId ? await updateCategory(editingId, payload) : await createCategory(payload);

    if (!result.success) {
      showMessage(result.error || "保存失败，请稍后重试。", "error");
      setIsSubmitting(false);
      return;
    }

    resetForm();
    await reloadCategories();
    showMessage(editingId ? "分类已更新。" : "分类已新增。", "info");
    setIsSubmitting(false);
  }

  async function handleDelete(category: AdminCategory) {
    const categoryName = category.name || "未命名分类";
    const confirmed = window.confirm(`确认删除「${categoryName}」吗？如果该分类正在被工具或文章使用，删除会失败。`);

    if (!confirmed) {
      return;
    }

    setDeletingId(category.id);
    setMessage("");

    const result = await deleteCategory(category.id);

    if (!result.success) {
      showMessage(result.error || "该分类可能正在被工具或文章使用，请先调整相关内容后再删除。", "error");
      setDeletingId("");
      return;
    }

    setCategories((current) => current.filter((item) => item.id !== category.id));

    if (editingId === category.id) {
      resetForm();
    }

    showMessage("分类已删除。", "info");
    setDeletingId("");
  }

  const isEditing = Boolean(editingId);

  return (
    <AdminShell>
      <section className="glass-card-strong p-5 sm:p-6">
        <div>
          <p className="text-sm font-bold text-sky-700">分类内容</p>
          <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl">分类管理</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600">管理工具和文章使用的内容分类。</p>
        </div>
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

      <section className="glass-card-strong p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold text-sky-700">{isEditing ? "编辑分类" : "新增分类区域"}</p>
            <h2 className="mt-2 text-xl font-black text-ink">{isEditing ? "修改当前分类" : "新增一个内容分类"}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              分类会用于前台筛选，也会出现在工具和文章后台表单的分类下拉里。
            </p>
          </div>
          {isEditing ? (
            <button
              type="button"
              onClick={resetForm}
              className="min-h-11 rounded-2xl border border-white/75 bg-white/70 px-5 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              取消编辑
            </button>
          ) : null}
        </div>

        <form className="grid gap-4" method="post" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              分类名称
              <input
                value={formValues.name}
                onChange={(event) => handleNameChange(event.target.value)}
                className={inputClass}
                placeholder="例如：AI 工具"
              />
            </label>

            <label className="grid gap-2 text-sm font-bold text-slate-700">
              slug
              <input
                value={formValues.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setFormValues((current) => ({
                    ...current,
                    slug: event.target.value,
                  }));
                }}
                className={inputClass}
                placeholder="例如：ai-tools"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-bold text-slate-700">
            分类说明
            <textarea
              value={formValues.description ?? ""}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className="min-h-24 w-full resize-y rounded-2xl border border-white/75 bg-white/75 px-4 py-3 text-sm font-medium leading-7 text-ink shadow-inner outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              placeholder="可选，用于说明这个分类收录哪些内容"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-12 rounded-2xl bg-ink px-6 py-3 text-sm font-bold text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isSubmitting ? "保存中..." : isEditing ? "保存修改" : "新增分类"}
            </button>
          </div>
        </form>
      </section>

      <section className="glass-card p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-ink">分类列表</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {status === "loading" ? "正在读取分类..." : `当前共 ${sortedCategories.length} 个分类`}
            </p>
          </div>
        </div>

        {status === "ready" && sortedCategories.length === 0 ? (
          <div className="rounded-3xl border border-white/75 bg-white/65 p-8 text-center">
            <h3 className="text-xl font-black text-ink">暂无分类</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">可以先新增一个分类，再给工具或文章选择它。</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {sortedCategories.map((category) => (
              <article
                key={category.id}
                className="rounded-3xl border border-white/75 bg-white/70 p-4 shadow-sm sm:p-5"
              >
                <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black text-ink">{category.name || "未命名分类"}</h3>
                      <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                        {category.slug || "-"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {category.description || "暂无说明。"}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-slate-400">创建时间：{formatDate(category.created_at)}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <button
                      type="button"
                      onClick={() => startEdit(category)}
                      className="min-h-10 rounded-xl border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-100"
                    >
                      编辑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category)}
                      disabled={deletingId === category.id}
                      className="min-h-10 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === category.id ? "删除中" : "删除"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}

function validateCategory(values: AdminCategoryInput) {
  if (!values.name.trim()) {
    return "分类名称不能为空。";
  }

  if (!values.slug.trim()) {
    return "slug 不能为空。";
  }

  return "";
}

function createSlug(value: string) {
  const slug = value
    .normalize("NFKD")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || `category-${Date.now()}`;
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
