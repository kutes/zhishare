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

const heroTags = ["版权反馈", "权利处理", "链接更正", "及时核实"];

const issueTypes = ["版权问题", "商标问题", "授权问题", "信息错误", "链接失效", "其他问题"];

const noticeItems = [
  "本站主要用于信息整理、技术研究、工具导航与经验分享。",
  "内容中提到的工具、项目、网站或服务，其版权、商标及相关权利归原作者或权利方所有。",
  "本站不提供破解、盗版、绕过付费、未授权下载或侵权资源。",
  "如发现问题，请尽量提供页面链接与可核实的证明材料。",
];

const processSteps = [
  "收到反馈",
  "初步核查页面内容",
  "必要时联系补充材料",
  "核实后修改、删除或更正相关内容",
];

export default function CopyrightClientPage() {
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
      setStatusMessage({ type: "error", message: "请先完成安全验证。" });
      return;
    }

    setIsSubmitting(true);

    try {
      const isVerified = await verifyTurnstileTokenOnClient(turnstileToken);

      if (!isVerified) {
        setStatusMessage({ type: "error", message: "安全验证失败，请刷新后重试。" });
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
    <div className="copyright-warm-page">
      <div className="copyright-warm-bg" aria-hidden="true" />
      <SiteHeader />

      <main>
        <section className="copyright-warm-shell copyright-hero">
          <p className="copyright-kicker">COPYRIGHT</p>
          <h1 className="copyright-title">版权与内容声明</h1>
          <p className="copyright-desc">
            知享尊重原创与版权，站内内容主要用于信息整理、技术研究、经验分享与学习参考。
          </p>
          <div className="flex flex-wrap gap-3">
            {heroTags.map((tag) => (
              <span key={tag} className="copyright-tag">
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section className="copyright-warm-shell copyright-layout">
          <div className="copyright-content-card">
            <section className="copyright-section-card">
              <p className="copyright-section-title">版权说明</p>
              <div className="mt-4 grid gap-4">
                {noticeItems.map((item) => (
                  <p key={item} className="copyright-section-text">
                    {item}
                  </p>
                ))}
              </div>
            </section>

            <section className="copyright-side-card">
              <p className="copyright-side-title">提交后我们会这样处理</p>
              <ul className="copyright-side-list">
                {processSteps.map((step, index) => (
                  <li key={step}>
                    <span>{index + 1}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="copyright-form-card" aria-labelledby="copyright-form-title">
            <div className="copyright-section-card copyright-section-card-tight">
              <p className="copyright-section-title">版权投诉表单</p>
              <h2 id="copyright-form-title" className="copyright-form-title">
                提交反馈信息
              </h2>
              <p className="copyright-section-text mt-4">
                请尽量提供具体链接、问题类型和可核实证明。信息越完整，核实和处理越快。
              </p>
            </div>

            <StatusNotice message={statusMessage} />

            <form className="copyright-form-grid mt-6" method="post" onSubmit={handleSubmit} noValidate>
              <FormField
                label="权利人姓名或机构名称"
                name="ownerName"
                placeholder="请输入姓名或机构名称"
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
              <FormField
                label="涉及页面链接"
                name="pageUrl"
                placeholder="https://example.com/page"
                error={errors.pageUrl}
                required
                fullWidth
              />
              <SelectField
                label="问题类型"
                name="issueType"
                options={issueTypes}
                error={errors.issueType}
                required
                fullWidth
              />
              <TextareaField
                label="证明材料说明"
                name="proof"
                placeholder="请说明你能提供的证明材料，例如权属证明、授权文件、商标信息等。"
                fullWidth
              />
              <TextareaField
                label="处理要求"
                name="request"
                placeholder="请说明希望我们修改、删除、更正或补充哪些内容。"
                error={errors.request}
                required
                fullWidth
              />

              <div className="copyright-turnstile-box">
                <TurnstileWidget ref={turnstileRef} onTokenChange={setTurnstileToken} />
              </div>

              <div className="copyright-action-row">
                <button type="submit" disabled={isSubmitting} className="copyright-button">
                  {isSubmitting ? "提交中..." : "提交反馈"}
                </button>
                <p className="copyright-help">提交前请确认页面链接、邮箱和证明材料准确无误。</p>
              </div>
            </form>
          </section>
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
      className={`copyright-status ${
        message.type === "success" ? "copyright-status-success" : "copyright-status-error"
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
  fullWidth = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <label className={`copyright-field ${fullWidth ? "copyright-field-full" : ""}`}>
      <span className="copyright-label">
        {label}
        {required ? <span className="copyright-required"> *</span> : null}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className="copyright-input"
      />
      {error ? <span className="copyright-help copyright-help-error">{error}</span> : null}
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  error,
  required = false,
  fullWidth = false,
}: {
  label: string;
  name: string;
  options: string[];
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <label className={`copyright-field ${fullWidth ? "copyright-field-full" : ""}`}>
      <span className="copyright-label">
        {label}
        {required ? <span className="copyright-required"> *</span> : null}
      </span>
      <select name={name} defaultValue="" aria-invalid={Boolean(error)} className="copyright-select">
        <option value="" disabled>
          请选择问题类型
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <span className="copyright-help copyright-help-error">{error}</span> : null}
    </label>
  );
}

function TextareaField({
  label,
  name,
  placeholder,
  error,
  required = false,
  fullWidth = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <label className={`copyright-field ${fullWidth ? "copyright-field-full" : ""}`}>
      <span className="copyright-label">
        {label}
        {required ? <span className="copyright-required"> *</span> : null}
      </span>
      <textarea
        name={name}
        rows={4}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className="copyright-textarea"
      />
      {error ? <span className="copyright-help copyright-help-error">{error}</span> : null}
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
