"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import type { AdminArticleDbResult, AdminArticleInput, ArticleStatus } from "@/types/article";
import type { AdminCategoryOption } from "@/types/tool";

type AdminArticleFormProps = {
  mode: "create" | "edit";
  categories: AdminCategoryOption[];
  initialValues?: Partial<AdminArticleInput>;
  onSubmit: (data: AdminArticleInput) => Promise<AdminArticleDbResult<unknown>>;
};

const inputClass =
  "min-h-12 w-full rounded-2xl border border-white/75 bg-white/75 px-4 text-sm font-medium text-ink shadow-inner outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100";

const textareaClass =
  "w-full resize-y rounded-2xl border border-white/75 bg-white/75 px-4 py-3 text-sm font-medium leading-7 text-ink shadow-inner outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100";

export function AdminArticleForm({ mode, categories, initialValues, onSubmit }: AdminArticleFormProps) {
  const [values, setValues] = useState<AdminArticleInput>(() => ({
    title: initialValues?.title ?? "",
    slug: initialValues?.slug ?? "",
    summary: initialValues?.summary ?? "",
    content: initialValues?.content ?? "",
    cover_url: initialValues?.cover_url ?? "",
    category_id: initialValues?.category_id ?? "",
    status: initialValues?.status ?? "draft",
  }));
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues?.slug));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const submitLabel = useMemo(() => {
    if (isSubmitting) {
      return mode === "create" ? "保存中..." : "更新中...";
    }

    return mode === "create" ? "保存文章" : "保存修改";
  }, [isSubmitting, mode]);

  function updateValue<Key extends keyof AdminArticleInput>(key: Key, value: AdminArticleInput[Key]) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleTitleChange(nextTitle: string) {
    setValues((current) => ({
      ...current,
      title: nextTitle,
      slug: slugTouched ? current.slug : createSlug(nextTitle),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const validationMessage = validateArticle(values);

    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);
    const result = await onSubmit({
      ...values,
      title: values.title.trim(),
      slug: values.slug.trim(),
      summary: values.summary.trim(),
      status: values.status,
    });

    if (!result.success) {
      setMessage(result.error || "保存失败，请检查控制台错误信息。");
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-6" method="post" onSubmit={handleSubmit} noValidate>
      {message ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm font-semibold leading-7 text-rose-700">
          {message}
        </div>
      ) : null}

      <section className="glass-card-strong grid gap-5 p-5 sm:p-6">
        <div>
          <p className="text-sm font-bold text-sky-700">基础信息</p>
          <h2 className="mt-2 text-xl font-black text-ink">文章列表和详情页展示信息</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            文章标题
            <input
              value={values.title}
              onChange={(event) => handleTitleChange(event.target.value)}
              className={inputClass}
              placeholder="例如：如何判断一个 AI 工具是否值得使用"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-700">
            slug
            <input
              value={values.slug}
              onChange={(event) => {
                setSlugTouched(true);
                updateValue("slug", event.target.value);
              }}
              className={inputClass}
              placeholder="例如：ai-tool-checklist"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-bold text-slate-700">
          文章摘要
          <textarea
            value={values.summary}
            onChange={(event) => updateValue("summary", event.target.value)}
            className={`${textareaClass} min-h-24`}
            placeholder="用一小段话说明这篇文章解决什么问题"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="grid gap-2 text-sm font-bold text-slate-700 sm:col-span-1">
            封面图地址
            <input
              value={values.cover_url ?? ""}
              onChange={(event) => updateValue("cover_url", event.target.value)}
              className={inputClass}
              placeholder="https://example.com/cover.jpg"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-700">
            分类
            <select
              value={values.category_id ?? ""}
              onChange={(event) => updateValue("category_id", event.target.value)}
              className={inputClass}
            >
              <option value="">{categories.length > 0 ? "不选择分类" : "暂无分类"}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-700">
            状态
            <select
              value={values.status}
              onChange={(event) => updateValue("status", event.target.value as ArticleStatus)}
              className={inputClass}
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </label>
        </div>
      </section>

      <section className="glass-card grid gap-5 p-5 sm:p-6">
        <div>
          <p className="text-sm font-bold text-sky-700">正文内容</p>
          <h2 className="mt-2 text-xl font-black text-ink">先用纯文本维护，后续再考虑编辑器</h2>
        </div>

        <label className="grid gap-2 text-sm font-bold text-slate-700">
          正文内容
          <textarea
            value={values.content}
            onChange={(event) => updateValue("content", event.target.value)}
            className={`${textareaClass} min-h-[320px]`}
            placeholder="这里先写纯文本正文，不接入富文本编辑器。"
          />
        </label>
      </section>

      <div className="glass-card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-7 text-slate-600">
          保存后会写入 Supabase articles 表。状态为 published 时，前台文章页可读取到该内容。
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-12 rounded-2xl bg-ink px-6 py-3 text-sm font-bold text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function validateArticle(values: AdminArticleInput) {
  if (!values.title.trim()) {
    return "文章标题不能为空。";
  }

  if (!values.slug.trim()) {
    return "slug 不能为空。";
  }

  if (!values.summary.trim()) {
    return "文章摘要不能为空。";
  }

  if (values.cover_url && !isHttpUrl(values.cover_url)) {
    return "封面图地址必须是 http 或 https 链接。";
  }

  if (values.status !== "draft" && values.status !== "published") {
    return "状态只能是 draft 或 published。";
  }

  return "";
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
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

  return slug || `article-${Date.now()}`;
}
