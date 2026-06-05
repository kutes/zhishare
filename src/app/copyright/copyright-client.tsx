"use client";

import type { FormEvent } from "react";
import { useRef, useState } from "react";
import { TurnstileWidget, type TurnstileWidgetHandle } from "@/components/security/TurnstileWidget";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createReport } from "@/lib/db/reports";
import { verifyTurnstileTokenOnClient } from "@/lib/security/turnstile-client";

type CopyrightErrors = Partial<
  Record<"ownerName" | "email" | "pageUrl" | "issueType" | "request", string>
>;
type ReportStatusMessage = { type: "success" | "error"; message: string } | null;

const heroTags = ["版权反馈", "权益处理", "链接更正", "及时核实"];

const issueTypes = ["版权问题", "商标问题", "授权问题", "信息错误", "链接失效", "其他问题"];

const noticeItems = [
  "本站主要用于信息整理、技术研究、工具体验与经验分享。",
  "文中提到的工具、项目、软件、网站或服务，版权、商标及相关权益归原作者、开发者或所属公司所有。",
  "本站不提供破解、盗版、绕过付费、未授权下载或侵权资源。",
  "如发现问题，请提供具体页面链接和相关证明材料。",
];

const processSteps = [
  "收到反馈",
  "初步核查页面内容",
  "必要时联系补充材料",
  "核实后修改、删除或更正相关内容",
];

export default function CopyrightPage() {
  const [errors, setErrors] = useState<CopyrightErrors>({});
  const [statusMessage, setStatusMessage] = useState<ReportStatusMessage>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileWidgetHandle | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const ownerName = String(formData.get("ownerName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const pageUrl = String(formData.get("pageUrl") ?? "").trim();
    const issueType = String(formData.get("issueType") ?? "").trim();
    const proof = String(formData.get("proof") ?? "").trim();
    const request = String(formData.get("request") ?? "").trim();
    const nextErrors: CopyrightErrors = {};

    if (!ownerName) {
      nextErrors.ownerName = "请填写权利人姓名或机构名称。";
    }

    if (!email) {
      nextErrors.email = "请填写联系邮箱。";
    } else if (!isValidEmail(email)) {
      nextErrors.email = "请填写正确的邮箱格式。";
    }

    if (!pageUrl) {
      nextErrors.pageUrl = "请填写涉及页面链接。";
    } else if (!isHttpUrl(pageUrl)) {
      nextErrors.pageUrl = "涉及页面链接必须是 http 或 https 链接。";
    }

    if (!issueType) {
      nextErrors.issueType = "请选择问题类型。";
    }

    if (!request) {
      nextErrors.request = "请填写处理要求。";
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
        setStatusMessage({ type: "error", message: "验证失败，请刷新后重试。" });
        turnstileRef.current?.reset();
        return;
      }

      const result = await createReport({
        owner_name: ownerName,
        email,
        page_url: pageUrl,
        issue_type: issueType,
        proof,
        request,
      });

      if (result.success) {
        setStatusMessage({
          type: "success",
          message: "反馈已提交，我们会在核实后及时处理。",
        });
        form.reset();
        turnstileRef.current?.reset();
      } else {
        setStatusMessage({ type: "error", message: "提交失败，请稍后重试。" });
      }
    } catch (error) {
      console.error("[Copyright] createReport", error);
      setStatusMessage({ type: "error", message: "提交失败，请稍后重试。" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fbff]">
      <SiteHeader />

      <main>
        <section className="section-gradient-violet">
          <div className="page-shell py-14 sm:py-16 lg:py-20">
            <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <div className="mb-5 inline-flex rounded-full border border-indigo-200/80 bg-white/60 px-4 py-2 text-xs font-bold text-indigo-700 shadow-sm backdrop-blur">
                  权益反馈
                </div>
                <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
                  版权与权益问题反馈
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  如果本站内容涉及版权、商标、授权、权益或信息错误问题，请通过此页面提交说明，我们会在核实后及时处理。
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  {heroTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-indigo-200/80 bg-white/65 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm backdrop-blur"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-card-strong p-6 sm:p-8">
                <p className="text-sm font-bold text-indigo-700">处理承诺</p>
                <h2 className="mt-3 text-2xl font-black text-ink">清晰说明，及时核实</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  请尽量提交具体页面、问题类型和证明说明。信息越完整，越有利于快速判断和处理。
                </p>
                <div className="mt-5 grid gap-3">
                  {["不公开联系方式", "优先核实具体链接", "必要时联系补充材料"].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/70 bg-white/60 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-gradient-soft">
          <div className="page-shell section-block">
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              <section className="glass-card p-6 sm:p-8">
                <p className="text-sm font-bold text-indigo-700">处理说明</p>
                <h2 className="mt-3 text-2xl font-black text-ink">请提供可核实的信息</h2>
                <div className="mt-6 grid gap-4">
                  {noticeItems.map((item) => (
                    <p
                      key={item}
                      className="rounded-2xl border border-white/70 bg-white/55 px-4 py-3 text-sm leading-7 text-slate-600"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </section>

              <section className="glass-card-strong p-6 sm:p-8" aria-labelledby="copyright-form-title">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-indigo-700">投诉表单</p>
                    <h2 id="copyright-form-title" className="mt-3 text-2xl font-black text-ink">
                      提交反馈信息
                    </h2>
                  </div>
                  <p className="text-sm text-slate-500">带 * 的字段为必填</p>
                </div>

                <StatusNotice message={statusMessage} />

                <form className="mt-6 grid gap-5" method="post" onSubmit={handleSubmit} noValidate>
                  <div className="grid gap-5 md:grid-cols-2">
                    <FormField
                      label="权利人姓名或机构名称"
                      name="ownerName"
                      placeholder="请填写姓名或机构名称"
                      error={errors.ownerName}
                      required
                    />
                    <FormField
                      label="联系邮箱"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      error={errors.email}
                      required
                    />
                  </div>

                  <FormField
                    label="涉及页面链接"
                    name="pageUrl"
                    placeholder="https://example.com/page"
                    error={errors.pageUrl}
                    required
                  />

                  <SelectField
                    label="问题类型"
                    name="issueType"
                    options={issueTypes}
                    error={errors.issueType}
                    required
                  />

                  <TextareaField
                    label="证明材料说明"
                    name="proof"
                    placeholder="请说明你能提供的证明材料，例如权属证明、授权文件、商标信息等。"
                  />
                  <TextareaField
                    label="处理要求"
                    name="request"
                    placeholder="请说明希望我们修改、删除、更正或补充哪些内容。"
                    error={errors.request}
                    required
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
                    {isSubmitting ? "提交中..." : "提交反馈"}
                  </button>
                </form>
              </section>
            </div>

            <section className="glass-card mt-6 p-6 sm:p-8">
              <p className="text-sm font-bold text-indigo-700">处理流程</p>
              <h2 className="mt-3 text-2xl font-black text-ink">从收到反馈到完成更正</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                {processSteps.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-2xl border border-white/75 bg-white/65 p-4 shadow-sm"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-sm font-black text-indigo-700">
                      {index + 1}
                    </span>
                    <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">{step}</p>
                  </div>
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

function StatusNotice({ message }: { message: ReportStatusMessage }) {
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
        className="min-h-12 w-full rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm font-medium text-ink shadow-inner outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
      />
      {error ? <span className="text-xs font-semibold text-rose-600">{error}</span> : null}
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  error,
  required = false,
}: {
  label: string;
  name: string;
  options: string[];
  error?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      <span>
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </span>
      <select
        name={name}
        defaultValue=""
        aria-invalid={Boolean(error)}
        className="min-h-12 w-full rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm font-medium text-ink shadow-inner outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
      >
        <option value="" disabled>
          请选择问题类型
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
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
        className="w-full resize-y rounded-2xl border border-white/80 bg-white/70 px-4 py-3 text-sm font-medium leading-7 text-ink shadow-inner outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
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
