"use client";

import type { FormEvent } from "react";
import { useRef, useState } from "react";
import { TurnstileWidget, type TurnstileWidgetHandle } from "@/components/security/TurnstileWidget";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createSubmission } from "@/lib/db/submissions";
import { verifyTurnstileTokenOnClient } from "@/lib/security/turnstile-client";

type SubmitErrors = Partial<Record<"toolName" | "officialUrl" | "summary" | "email", string>>;
type SubmitStatusMessage = { type: "success" | "error"; message: string } | null;

const heroTags = ["人工审核", "优先官网", "拒绝破解盗版", "持续收录"];

const submitNotes = [
  "我们优先收录官网清晰、功能明确、适合中文用户了解的工具。",
  "请尽量提供官方网站、项目主页或官方文档链接。",
  "不收录破解软件、盗版资源、影视资源、课程搬运、电子书扫描版、网盘合集、磁力链接等内容。",
];

const contentRules = ["来源清晰", "不提供破解盗版", "优先指向官网", "人工整理后发布", "如有权益问题及时处理"];

export default function SubmitPage() {
  const [errors, setErrors] = useState<SubmitErrors>({});
  const [statusMessage, setStatusMessage] = useState<SubmitStatusMessage>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileWidgetHandle | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const toolName = String(formData.get("toolName") ?? "").trim();
    const officialUrl = String(formData.get("officialUrl") ?? "").trim();
    const summary = String(formData.get("summary") ?? "").trim();
    const reason = String(formData.get("reason") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const nextErrors: SubmitErrors = {};

    if (!toolName) {
      nextErrors.toolName = "请填写工具名称。";
    }

    if (!officialUrl) {
      nextErrors.officialUrl = "请填写官方地址。";
    } else if (!isHttpUrl(officialUrl)) {
      nextErrors.officialUrl = "官方地址必须是 http 或 https 链接。";
    }

    if (!summary) {
      nextErrors.summary = "请填写工具简介。";
    }

    if (email && !isValidEmail(email)) {
      nextErrors.email = "请填写正确的邮箱格式。";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatusMessage(null);
      return;
    }

    setErrors({});
    setStatusMessage(null);

    if (!turnstileToken) {
      setStatusMessage({ type: "error", message: "请先完成人机验证。" });
      return;
    }

    setIsSubmitting(true);

    try {
      const isVerified = await verifyTurnstileTokenOnClient(turnstileToken);

      if (!isVerified) {
        setStatusMessage({ type: "error", message: "人机验证失败，请刷新后重试。" });
        turnstileRef.current?.reset();
        return;
      }

      const result = await createSubmission({
        tool_name: toolName,
        website_url: officialUrl,
        summary,
        reason,
        email,
      });

      if (result.success) {
        setStatusMessage({
          type: "success",
          message: "提交成功，我们会进行人工审核后决定是否收录。",
        });
        form.reset();
        turnstileRef.current?.reset();
      } else {
        setStatusMessage({ type: "error", message: "提交失败，请稍后重试。" });
      }
    } catch (error) {
      console.error("[Submit] createSubmission", error);
      setStatusMessage({ type: "error", message: "提交失败，请稍后重试。" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fbff]">
      <SiteHeader />

      <main>
        <section className="section-gradient-cyan">
          <div className="page-shell py-14 sm:py-16 lg:py-20">
            <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <div className="mb-5 inline-flex rounded-full border border-teal-200/80 bg-white/60 px-4 py-2 text-xs font-bold text-teal-700 shadow-sm backdrop-blur">
                  推荐入口
                </div>
                <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
                  推荐一个值得收录的工具
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  如果你发现了实用、可靠、来源清晰的 AI 工具、在线工具、效率软件或开源项目，可以提交给我们进行人工整理。
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  {heroTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-teal-200/80 bg-white/65 px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm backdrop-blur"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-card-strong p-6 sm:p-8">
                <p className="text-sm font-bold text-teal-700">投稿前确认</p>
                <div className="mt-5 grid gap-4">
                  {["官方来源可查", "功能描述明确", "适合公开介绍"].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/70 bg-white/60 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-500">
                  当前表单会写入 Supabase 的 submissions 表，进入待审核状态。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-gradient-soft">
          <div className="page-shell section-block">
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              <section className="glass-card p-6 sm:p-8">
                <p className="text-sm font-bold text-teal-700">投稿说明</p>
                <h2 className="mt-3 text-2xl font-black text-ink">我们会人工判断是否适合收录</h2>
                <div className="mt-6 grid gap-4">
                  {submitNotes.map((note) => (
                    <p
                      key={note}
                      className="rounded-2xl border border-white/70 bg-white/55 px-4 py-3 text-sm leading-7 text-slate-600"
                    >
                      {note}
                    </p>
                  ))}
                </div>
              </section>

              <section className="glass-card-strong p-6 sm:p-8" aria-labelledby="submit-form-title">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-teal-700">投稿表单</p>
                    <h2 id="submit-form-title" className="mt-3 text-2xl font-black text-ink">
                      提交工具信息
                    </h2>
                  </div>
                  <p className="text-sm text-slate-500">带 * 的字段为必填</p>
                </div>

                <StatusNotice message={statusMessage} />

                <form className="mt-6 grid gap-5" method="post" onSubmit={handleSubmit} noValidate>
                  <div className="grid gap-5 md:grid-cols-2">
                    <FormField
                      label="工具名称"
                      name="toolName"
                      placeholder="例如：Raycast"
                      error={errors.toolName}
                      required
                    />
                    <FormField
                      label="官方地址"
                      name="officialUrl"
                      placeholder="https://example.com"
                      error={errors.officialUrl}
                      required
                    />
                  </div>

                  <TextareaField
                    label="工具简介"
                    name="summary"
                    placeholder="用一两句话说明这个工具主要解决什么问题。"
                    error={errors.summary}
                    required
                  />
                  <TextareaField
                    label="推荐理由"
                    name="reason"
                    placeholder="可以说明你为什么推荐、适合什么人、有哪些需要注意的地方。"
                  />
                  <FormField
                    label="推荐人邮箱"
                    name="email"
                    type="email"
                    placeholder="可选，方便后续联系补充信息"
                    error={errors.email}
                  />

                  <TurnstileWidget
                    ref={turnstileRef}
                    onTokenChange={setTurnstileToken}
                    className="rounded-2xl border border-white/75 bg-white/55 px-4 py-3 shadow-sm"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-h-12 rounded-2xl bg-ink px-6 py-3 text-sm font-bold text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_24px_60px_rgba(15,23,42,0.24)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-fit"
                  >
                    {isSubmitting ? "提交中..." : "提交推荐"}
                  </button>
                </form>
              </section>
            </div>

            <section className="glass-card mt-6 p-6 sm:p-8">
              <p className="text-sm font-bold text-teal-700">收录原则</p>
              <h2 className="mt-3 text-2xl font-black text-ink">内容先可信，再发布</h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {contentRules.map((rule) => (
                  <span
                    key={rule}
                    className="rounded-full border border-white/75 bg-white/65 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm"
                  >
                    {rule}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function StatusNotice({ message }: { message: SubmitStatusMessage }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`mt-6 rounded-2xl border px-4 py-3 text-sm font-semibold leading-7 ${
        message.type === "success"
          ? "border-emerald-200 bg-emerald-50/80 text-emerald-700"
          : "border-rose-200 bg-rose-50/80 text-rose-700"
      }`}
    >
      {message.message}
    </div>
  );
}

function FormField({
  label,
  name,
  placeholder,
  type = "text",
  error,
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      <span>
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className="min-h-12 w-full rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm font-medium text-ink shadow-inner outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:ring-4 focus:ring-teal-100"
      />
      {error ? <span className="text-xs font-semibold text-rose-600">{error}</span> : null}
    </label>
  );
}

function TextareaField({
  label,
  name,
  placeholder,
  error,
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      <span>
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </span>
      <textarea
        name={name}
        rows={4}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className="w-full resize-y rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm font-medium leading-7 text-ink shadow-inner outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:ring-4 focus:ring-teal-100"
      />
      {error ? <span className="text-xs font-semibold text-rose-600">{error}</span> : null}
    </label>
  );
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
