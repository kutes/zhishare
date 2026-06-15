"use client";

import type { FormEvent } from "react";
import { useRef, useState } from "react";
import { TurnstileWidget, type TurnstileWidgetHandle } from "@/components/security/TurnstileWidget";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createSubmission } from "@/lib/db/submissions";
import { verifyTurnstileTokenOnClient } from "@/lib/security/turnstile-client";

type SubmitErrors = Partial<Record<"toolName" | "officialUrl" | "summary" | "email", string>>;
type SubmitStatusMessage = { type: "success"; message: string } | { type: "error"; message: string } | null;

const heroTags = ["人工审核", "优先官网", "拒绝盗版", "持续收录"];

const submitNotes = [
  "我们优先收录官网清晰、功能明确、适合中文用户了解的工具。",
  "请尽量提供官方网站、项目主页或官方文档链接。",
  "不收录破解软件、盗版资源、影视资源、课程搬运、电子书扫描版、网盘合集等内容。",
];

const contentRules = ["来源清晰", "优先官网", "人工整理后发布", "如有问题及时联系"];

const submissionKinds = [
  "AI 工具",
  "在线工具",
  "开源项目",
  "效率软件",
  "其他资源",
];

export default function SubmitClientPage() {
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
      nextErrors.officialUrl = "请填写官方网址。";
    } else if (!isHttpUrl(officialUrl)) {
      nextErrors.officialUrl = "官方网址必须是 http 或 https 链接。";
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
    <div className="submit-warm-page">
      <div className="submit-warm-bg" aria-hidden="true" />
      <SiteHeader />

      <main className="submit-warm-shell">
        <section className="submit-hero">
          <div className="submit-kicker">推荐入口</div>
          <h1 className="submit-title">提交一个值得收录的工具</h1>
          <p className="submit-desc">
            如果你发现了值得分享的 AI 工具、在线工具或开源项目，欢迎提交给我们。我们会优先查看来源清晰、功能明确、适合中文用户理解的内容。
          </p>
          <div className="submit-hero-meta" aria-label="提交亮点">
            {heroTags.map((tag) => (
              <span key={tag} className="submit-hero-chip">
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section className="submit-layout" aria-label="提交表单与说明">
          <div className="submit-form-card">
            <div className="submit-form-header">
              <div>
                <p className="submit-kicker">提交表单</p>
                <h2 className="submit-section-title">把工具信息一次说清</h2>
              </div>
              <p className="submit-help">带 * 的字段为必填。</p>
            </div>

            <StatusNotice message={statusMessage} />

            <form className="submit-form-grid" method="post" onSubmit={handleSubmit} noValidate>
              <div className="submit-field-grid">
                <FormField
                  label="工具名称"
                  name="toolName"
                  placeholder="例如：Raycast"
                  error={errors.toolName}
                  required
                />
                <FormField
                  label="官方网址"
                  name="officialUrl"
                  placeholder="https://example.com"
                  error={errors.officialUrl}
                  required
                />
              </div>

              <div className="submit-field submit-field-full">
                <label className="submit-label" htmlFor="submissionType">
                  提交类型
                </label>
                <select id="submissionType" name="submissionType" className="submit-select" defaultValue="AI 工具">
                  {submissionKinds.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <p className="submit-help">这个选项只用于你快速描述资源类型，不影响后续审核。</p>
              </div>

              <TextareaField
                label="工具简介"
                name="summary"
                placeholder="用一两句话说明这个工具主要解决什么问题。"
                error={errors.summary}
                required
                fullWidth
              />

              <TextareaField
                label="推荐理由"
                name="reason"
                placeholder="可以补充它适合什么人、有哪些优点，以及你为什么推荐它。"
                fullWidth
              />

              <FormField
                label="推荐人邮箱"
                name="email"
                type="email"
                placeholder="可选，方便后续沟通补充信息"
                error={errors.email}
                fullWidth
              />

              <div className="submit-field submit-field-full">
                <div className="submit-label">人机验证</div>
                <div className="submit-turnstile-box">
                  <TurnstileWidget ref={turnstileRef} onTokenChange={setTurnstileToken} />
                </div>
                <p className="submit-help">提交前请先完成验证，避免无效提交。</p>
              </div>

              <div className="submit-action-row">
                <button type="submit" disabled={isSubmitting} className="submit-button">
                  {isSubmitting ? "提交中..." : "提交推荐"}
                </button>
                <p className="submit-help">
                  提交后会进入人工审核，若信息不完整，我们会尽量通过邮箱联系你补充。
                </p>
              </div>
            </form>
          </div>

          <aside className="submit-side-card">
            <p className="submit-side-title">提交前请先确认</p>
            <ul className="submit-side-list">
              {submitNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>

            <div className="submit-side-divider" />

            <p className="submit-side-title">收录原则</p>
            <div className="submit-rule-chips">
              {contentRules.map((rule) => (
                <span key={rule} className="submit-rule-chip">
                  {rule}
                </span>
              ))}
            </div>
          </aside>
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
    <div className={`submit-status ${message.type === "success" ? "submit-status-success" : "submit-status-error"}`}>
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
    <label className={`submit-field${fullWidth ? " submit-field-full" : ""}`}>
      <span className="submit-label">
        {label}
        {required ? <span className="submit-required"> *</span> : null}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className="submit-input"
      />
      {error ? <span className="submit-error">{error}</span> : null}
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
    <label className={`submit-field${fullWidth ? " submit-field-full" : ""}`}>
      <span className="submit-label">
        {label}
        {required ? <span className="submit-required"> *</span> : null}
      </span>
      <textarea
        name={name}
        rows={4}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className="submit-textarea"
      />
      {error ? <span className="submit-error">{error}</span> : null}
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
