"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import type { AdminCategoryOption, AdminDbResult, AdminToolInput, ToolStatus } from "@/types/tool";

type AdminToolFormProps = {
  mode: "create" | "edit";
  categories: AdminCategoryOption[];
  initialValues?: Partial<AdminToolInput>;
  onSubmit: (data: AdminToolInput) => Promise<AdminDbResult<unknown>>;
};

const inputClass =
  "min-h-12 w-full rounded-2xl border border-white/75 bg-white/75 px-4 text-sm font-medium text-ink shadow-inner outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100";

const textareaClass =
  "min-h-28 w-full resize-y rounded-2xl border border-white/75 bg-white/75 px-4 py-3 text-sm font-medium leading-7 text-ink shadow-inner outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100";

export function AdminToolForm({ mode, categories, initialValues, onSubmit }: AdminToolFormProps) {
  const [values, setValues] = useState<AdminToolInput>(() => ({
    title: initialValues?.title ?? "",
    slug: initialValues?.slug ?? "",
    summary: initialValues?.summary ?? "",
    description: initialValues?.description ?? "",
    website_url: initialValues?.website_url ?? "",
    cover_url: initialValues?.cover_url ?? "",
    category_id: initialValues?.category_id ?? "",
    is_free: initialValues?.is_free ?? true,
    is_open_source: initialValues?.is_open_source ?? false,
    target_users: initialValues?.target_users ?? "",
    use_cases: initialValues?.use_cases ?? "",
    pros: initialValues?.pros ?? "",
    cons: initialValues?.cons ?? "",
    risk_notice: initialValues?.risk_notice ?? "",
    status: initialValues?.status ?? "draft",
  }));
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues?.slug));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const submitLabel = useMemo(() => {
    if (isSubmitting) {
      return mode === "create" ? "保存中..." : "更新中...";
    }

    return mode === "create" ? "保存工具" : "保存修改";
  }, [isSubmitting, mode]);

  function updateValue<Key extends keyof AdminToolInput>(key: Key, value: AdminToolInput[Key]) {
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

    const validationMessage = validateTool(values);

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
      return;
    }
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit} noValidate>
      {message ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm font-semibold leading-7 text-rose-700">
          {message}
        </div>
      ) : null}

      <section className="glass-card-strong grid gap-5 p-5 sm:p-6">
        <div>
          <p className="text-sm font-bold text-sky-700">基础信息</p>
          <h2 className="mt-2 text-xl font-black text-ink">前台展示最核心的工具信息</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            工具名称
            <input
              value={values.title}
              onChange={(event) => handleTitleChange(event.target.value)}
              className={inputClass}
              placeholder="例如：Raycast"
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
              placeholder="例如：raycast"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-bold text-slate-700">
          一句话简介
          <input
            value={values.summary}
            onChange={(event) => updateValue("summary", event.target.value)}
            className={inputClass}
            placeholder="用一句话说明这个工具解决什么问题"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-slate-700">
          详细介绍
          <textarea
            value={values.description}
            onChange={(event) => updateValue("description", event.target.value)}
            className={textareaClass}
            placeholder="适合写工具定位、核心价值、使用前需要知道的信息"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            官网地址
            <input
              value={values.website_url}
              onChange={(event) => updateValue("website_url", event.target.value)}
              className={inputClass}
              placeholder="https://example.com"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-700">
            封面图地址
            <input
              value={values.cover_url ?? ""}
              onChange={(event) => updateValue("cover_url", event.target.value)}
              className={inputClass}
              placeholder="当前阶段仅预留字段"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            分类
            <select
              value={values.category_id}
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
              onChange={(event) => updateValue("status", event.target.value as ToolStatus)}
              className={inputClass}
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </label>

          <div className="grid gap-2 text-sm font-bold text-slate-700">
            属性
            <div className="grid min-h-12 grid-cols-2 gap-3">
              <label className="flex items-center gap-2 rounded-2xl border border-white/75 bg-white/70 px-4 text-sm font-bold text-slate-700 shadow-sm">
                <input
                  type="checkbox"
                  checked={values.is_free}
                  onChange={(event) => updateValue("is_free", event.target.checked)}
                  className="h-4 w-4 accent-sky-500"
                />
                免费
              </label>
              <label className="flex items-center gap-2 rounded-2xl border border-white/75 bg-white/70 px-4 text-sm font-bold text-slate-700 shadow-sm">
                <input
                  type="checkbox"
                  checked={values.is_open_source}
                  onChange={(event) => updateValue("is_open_source", event.target.checked)}
                  className="h-4 w-4 accent-sky-500"
                />
                开源
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card grid gap-5 p-5 sm:p-6">
        <div>
          <p className="text-sm font-bold text-sky-700">内容补充</p>
          <h2 className="mt-2 text-xl font-black text-ink">详情页阅读信息</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            适合人群
            <textarea
              value={values.target_users}
              onChange={(event) => updateValue("target_users", event.target.value)}
              className={textareaClass}
              placeholder="例如：开发者、内容创作者、效率工具用户"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-700">
            使用场景
            <textarea
              value={values.use_cases}
              onChange={(event) => updateValue("use_cases", event.target.value)}
              className={textareaClass}
              placeholder="例如：快速启动应用、整理工作流、团队协作"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-700">
            优点
            <textarea
              value={values.pros}
              onChange={(event) => updateValue("pros", event.target.value)}
              className={textareaClass}
              placeholder="写清楚值得推荐的地方"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-700">
            缺点
            <textarea
              value={values.cons}
              onChange={(event) => updateValue("cons", event.target.value)}
              className={textareaClass}
              placeholder="写清楚限制、门槛或不适合场景"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-bold text-slate-700">
          风险提示
          <textarea
            value={values.risk_notice}
            onChange={(event) => updateValue("risk_notice", event.target.value)}
            className={textareaClass}
            placeholder="例如：上传敏感文件前请确认隐私政策和服务条款"
          />
        </label>
      </section>

      <div className="glass-card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-7 text-slate-600">
          保存后会写入 Supabase tools 表。若状态为 published，前台工具库可读取到该内容。
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

function validateTool(values: AdminToolInput) {
  if (!values.title.trim()) {
    return "工具名称不能为空。";
  }

  if (!values.slug.trim()) {
    return "slug 不能为空。";
  }

  if (!values.summary.trim()) {
    return "一句话简介不能为空。";
  }

  if (values.website_url && !isHttpUrl(values.website_url)) {
    return "官网地址必须是 http 或 https 链接。";
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

  return slug || `tool-${Date.now()}`;
}
