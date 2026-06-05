import Link from "next/link";
import { AdPlaceholder } from "@/components/common/AdPlaceholder";
import { CopyrightNotice } from "@/components/common/CopyrightNotice";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { ToolItem } from "@/types/tool";

type ToolDetailPageProps = {
  tool: ToolItem;
  relatedTools: ToolItem[];
};

export function ToolDetailPage({ tool, relatedTools }: ToolDetailPageProps) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fbff]">
      <SiteHeader />
      <main>
        <section className="section-gradient-blue relative overflow-hidden">
          <div className="page-shell py-12 sm:py-16 lg:py-20">
            <Link href="/tools" className="inline-flex text-sm font-bold text-cyan-700 transition hover:text-cyan-900">
              返回工具库
            </Link>

            <div className="glass-card-strong liquid-border mt-6 grid gap-7 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:p-8">
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <span className="rounded-full border border-cyan-200 bg-cyan-50/80 px-3 py-1 text-xs font-bold text-cyan-800">
                    {tool.category}
                  </span>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-bold text-emerald-700">
                    {tool.free_status}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${
                      tool.is_open_source
                        ? "border-cyan-200 bg-cyan-50/80 text-cyan-800"
                        : "border-slate-200 bg-slate-100/80 text-slate-600"
                    }`}
                  >
                    {tool.open_source_status}
                  </span>
                </div>

                <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-ink sm:text-5xl">
                  {tool.name}
                </h1>
                <p className="mt-4 max-w-2xl text-lg font-bold leading-8 text-slate-800">{tool.tagline}</p>
                <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">{tool.description}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/80 bg-white/65 px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {tool.website_url ? (
                  <OfficialLink href={tool.website_url} className="mt-7" />
                ) : null}
              </div>

              <aside className="rounded-[24px] border border-white/75 bg-white/52 p-4 shadow-inner sm:p-5">
                <p className="text-sm font-semibold text-slate-500">工具快照</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <StatusRow label="是否免费" value={tool.free_status} tone="green" />
                  <StatusRow label="是否开源" value={tool.open_source_status} tone={tool.is_open_source ? "blue" : "slate"} />
                  <StatusRow label="适合人群" value={tool.highlight} tone="slate" />
                </div>
              </aside>
            </div>
          </div>
          <div className="h-12 bg-gradient-to-b from-transparent to-[#f8fbff]" />
        </section>

        <section className="section-gradient-soft section-block">
          <div className="page-shell space-y-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
              <article className="glass-card p-5 sm:p-7">
                <div className="space-y-6">
                  <TextSection title="详细介绍" paragraphs={tool.detail.introduction} />
                  <ListSection title="主要功能" items={tool.detail.features} />
                  <AdPlaceholder variant="inline" />
                  <ListSection title="适合人群" items={tool.detail.audience} />
                  <ListSection title="使用场景" items={tool.detail.scenarios} />
                  <ListSection title="优点" items={tool.detail.pros} />
                  <ListSection title="缺点" items={tool.detail.cons} />
                  <ListSection title="风险提示" items={tool.detail.risks} warning />
                </div>
              </article>

              <aside className="space-y-6 lg:sticky lg:top-24">
                <AdPlaceholder variant="sidebar" />
              </aside>
            </div>

            {tool.website_url ? <OfficialCta href={tool.website_url} /> : null}
            <RelatedToolsSection relatedTools={relatedTools} />
            <AdPlaceholder variant="banner" />
            <CopyrightNotice />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export function ToolNotFoundPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fbff]">
      <SiteHeader />
      <main className="section-gradient-blue">
        <div className="page-shell flex min-h-[60vh] items-center py-16">
          <section className="glass-card-strong mx-auto max-w-2xl p-6 text-center sm:p-8">
            <p className="text-sm font-semibold text-cyan-700">工具不存在</p>
            <h1 className="mt-3 text-3xl font-black text-ink sm:text-4xl">没有找到这个工具</h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600">你可以返回工具库重新浏览。</p>
            <Link
              href="/tools"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-[14px] bg-ink px-6 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-lg"
            >
              返回工具库
            </Link>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

type OfficialLinkProps = {
  href: string;
  className?: string;
};

function OfficialLink({ href, className = "" }: OfficialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className={`inline-flex min-h-12 items-center justify-center rounded-[14px] bg-gradient-to-r from-[#0f172a] via-[#155e75] to-[#0ea5e9] px-6 text-base font-bold text-white shadow-[0_16px_32px_rgba(14,165,233,0.22)] transition hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_20px_44px_rgba(14,165,233,0.34)] ${className}`}
    >
      访问官方网站
    </a>
  );
}

function OfficialCta({ href }: { href: string }) {
  return (
    <section className="glass-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-cyan-700">官网访问</p>
          <h2 className="mt-2 text-2xl font-black text-ink">准备访问这个工具？</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            请优先查看官方网站的价格、授权方式、隐私政策和服务条款。
          </p>
        </div>
        <OfficialLink href={href} />
      </div>
    </section>
  );
}

type StatusRowProps = {
  label: string;
  value: string;
  tone: "green" | "blue" | "slate";
};

const statusToneClasses: Record<StatusRowProps["tone"], string> = {
  green: "border-emerald-200 bg-emerald-50/80 text-emerald-700",
  blue: "border-cyan-200 bg-cyan-50/80 text-cyan-800",
  slate: "border-slate-200 bg-white/70 text-slate-600",
};

function StatusRow({ label, value, tone }: StatusRowProps) {
  return (
    <div className="rounded-[18px] border border-white/70 bg-white/52 p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusToneClasses[tone]}`}>
        {value}
      </p>
    </div>
  );
}

type TextSectionProps = {
  title: string;
  paragraphs: string[];
};

function TextSection({ title, paragraphs }: TextSectionProps) {
  return (
    <section className="liquid-panel p-5">
      <SectionTitle>{title}</SectionTitle>
      <div className="mt-4 space-y-3">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-7 text-slate-600">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

type ListSectionProps = {
  title: string;
  items: string[];
  warning?: boolean;
};

function ListSection({ title, items, warning = false }: ListSectionProps) {
  return (
    <section className="liquid-panel p-5">
      <SectionTitle>{title}</SectionTitle>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className={`rounded-[18px] border p-4 text-sm leading-6 ${
              warning
                ? "border-amber-200 bg-amber-50/80 text-amber-900"
                : "border-white/70 bg-white/58 text-slate-600"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

type SectionTitleProps = {
  children: React.ReactNode;
};

function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="border-l-4 border-cyan-300 pl-4">
      <h2 className="text-xl font-black text-[#0f172a]">{children}</h2>
    </div>
  );
}

type RelatedToolsSectionProps = {
  relatedTools: ToolItem[];
};

function RelatedToolsSection({ relatedTools }: RelatedToolsSectionProps) {
  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-cyan-700">相关推荐</p>
          <h2 className="mt-2 text-2xl font-black text-ink">继续看看同类工具</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-500">优先推荐同分类工具，帮助你做横向比较。</p>
      </div>

      {relatedTools.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {relatedTools.map((relatedTool) => (
            <article key={relatedTool.id} className="glass-card soft-card-hover flex h-full flex-col p-5">
              <span className="w-fit rounded-full border border-cyan-200 bg-cyan-50/80 px-3 py-1 text-xs font-bold text-cyan-800">
                {relatedTool.category}
              </span>
              <h3 className="mt-4 text-xl font-black text-ink">{relatedTool.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{relatedTool.tagline}</p>
              <Link
                href={`/tools/${relatedTool.slug}`}
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[14px] bg-ink px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-lg"
              >
                查看详情
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="glass-card p-5 text-sm leading-6 text-slate-500">
          当前暂无同分类推荐，后续内容增加后会自动补充。
        </div>
      )}
    </section>
  );
}
