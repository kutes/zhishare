import Link from "next/link";
import type { ReactNode } from "react";
import { AdPlaceholder } from "@/components/common/AdPlaceholder";
import { CopyrightNotice } from "@/components/common/CopyrightNotice";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CollapsibleDescription } from "./collapsible-description";
import { MobileToolDetailSections } from "./mobile-tool-detail-sections";
import { ToolDecisionPanel } from "./tool-decision-panel";
import { ToolMobileSummaryCard } from "./tool-mobile-summary-card";
import type { ToolItem } from "@/types/tool";

type ToolDetailPageProps = {
  tool: ToolItem;
  relatedTools: ToolItem[];
};

export function ToolDetailPage({ tool, relatedTools }: ToolDetailPageProps) {
  const title = tool.name?.trim() || "未命名工具";
  const summary = tool.tagline?.trim() || "暂无简介";
  const description = tool.description?.trim() || "暂无简介";
  const category = tool.category?.trim() || "未分类";
  const visibleTags = getVisibleTags(tool.tags, 4);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fbff]">
      <SiteHeader />
      <main>
        <section className="section-gradient-blue relative overflow-hidden">
          <div className="page-shell py-6 sm:py-8 lg:py-10">
            <Link href="/tools" className="inline-flex text-sm font-bold text-cyan-700 transition hover:text-cyan-900">
              返回工具库
            </Link>

            <div className="space-y-4 md:hidden">
              <ToolMobileSummaryCard tool={tool} />
              <ToolDecisionPanel tool={tool} />
              <QuickFactsBar category={category} tagCount={tool.tags.length} className="mt-0 md:hidden" />
            </div>

            <div className="mt-4 hidden gap-4 md:grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.9fr)] lg:items-start">
              <DetailHero
                title={title}
                summary={summary}
                description={description}
                category={category}
                visibleTags={visibleTags}
                isFree={tool.is_free}
                isOpenSource={tool.is_open_source}
                freeStatus={tool.free_status}
                openSourceStatus={tool.open_source_status}
              />

              <ToolDecisionPanel tool={tool} />
            </div>

            <div className="hidden md:block">
              <QuickFactsBar category={category} tagCount={tool.tags.length} />
            </div>
          </div>
          <div className="h-10 bg-gradient-to-b from-transparent to-[#f8fbff] sm:h-12" />
        </section>

        <section className="section-gradient-soft section-block">
          <div className="page-shell space-y-6">
            <MobileToolDetailSections tool={tool} className="md:hidden" />
            <MobileRelatedToolsCompact relatedTools={relatedTools} className="md:hidden" />

            <div className="hidden gap-5 md:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
              <article className="glass-card p-4 sm:p-5">
                <div className="space-y-4 sm:space-y-5">
                  <CollapsibleDescription title="这个工具是什么" content={description} className="mt-0" />
                  <ListSection title="核心功能" items={tool.detail.features} />
                  <AdPlaceholder variant="inline" />
                  <ListSection title="适合人群" items={tool.detail.audience} />
                  <ListSection title="使用场景" items={tool.detail.scenarios} />
                  <ListSection title="优点" items={tool.detail.pros} />
                  <ListSection title="缺点" items={tool.detail.cons} />
                  <ListSection title="风险提醒" items={tool.detail.risks} warning />
                </div>
              </article>

              <aside className="space-y-5 lg:sticky lg:top-24">
                <AdPlaceholder variant="sidebar" />
              </aside>
            </div>

            <div className="hidden md:block">
              <RelatedToolsSection relatedTools={relatedTools} />
            </div>
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

type DetailHeroProps = {
  title: string;
  summary: string;
  description: string;
  category: string;
  visibleTags: string[];
  isFree: boolean;
  isOpenSource: boolean;
  freeStatus?: string;
  openSourceStatus?: string;
};

function DetailHero({
  title,
  summary,
  description,
  category,
  visibleTags,
  isFree,
  isOpenSource,
  freeStatus,
  openSourceStatus,
}: DetailHeroProps) {
  return (
    <article className="glass-card-strong liquid-border min-w-0 p-5 sm:p-6 lg:p-7">
      <div className="flex flex-wrap gap-2 text-xs font-bold">
        <DetailBadge tone="cyan">{category}</DetailBadge>
        <DetailBadge tone="green">{getFreeLabel(isFree, freeStatus)}</DetailBadge>
        <DetailBadge tone={isOpenSource ? "blue" : "slate"}>{getOpenSourceLabel(isOpenSource, openSourceStatus)}</DetailBadge>
      </div>

      <h1 className="mt-5 max-w-3xl text-[clamp(2.6rem,7.6vw,4.7rem)] font-black leading-[0.94] tracking-[-0.05em] text-[#0f172a] sm:text-[clamp(3rem,5vw,5rem)]">
        {title}
      </h1>

      <p className="mt-3 max-w-2xl text-base font-bold leading-7 text-slate-800 sm:text-lg sm:leading-8">{summary}</p>
      <CollapsibleDescription title="这个工具是什么" content={description} className="mt-2.5" />

      <div className="mt-4 flex flex-wrap gap-2">
        {visibleTags.length > 0 ? (
          visibleTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/80 bg-white/65 px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm"
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="rounded-full border border-white/80 bg-white/65 px-3 py-1.5 text-sm font-semibold text-slate-500 shadow-sm">
            暂无标签
          </span>
        )}
      </div>

      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        我们先把最影响判断的信息放在这里，方便你快速看懂它是不是值得继续了解。
      </p>
    </article>
  );
}

type QuickFactsBarProps = {
  category: string;
  tagCount: number;
  className?: string;
};

function QuickFactsBar({ category, tagCount, className = "" }: QuickFactsBarProps) {
  return (
    <div className={`mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 ${className}`.trim()}>
      <QuickFact label="类型" value={category || "未分类"} />
      <QuickFact label="标签" value={tagCount > 0 ? `${tagCount} 个标签` : "暂无标签"} />
      <QuickFact label="收录状态" value="已发布" />
      <QuickFact label="建议动作" value="先阅读介绍" />
    </div>
  );
}

type QuickFactProps = {
  label: string;
  value: string;
};

function QuickFact({ label, value }: QuickFactProps) {
  return (
    <div className="rounded-[20px] border border-[#0f172a]/[0.08] bg-white/78 p-3.5 shadow-sm">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1.5 text-sm font-black leading-6 text-[#0f172a]">{value}</p>
    </div>
  );
}

type DetailBadgeProps = {
  tone: "cyan" | "green" | "blue" | "slate";
  children: ReactNode;
};

function DetailBadge({ tone, children }: DetailBadgeProps) {
  const toneClasses: Record<DetailBadgeProps["tone"], string> = {
    cyan: "border-cyan-200 bg-cyan-50/80 text-cyan-800",
    green: "border-emerald-200 bg-emerald-50/80 text-emerald-700",
    blue: "border-blue-200 bg-blue-50/80 text-blue-700",
    slate: "border-slate-200 bg-slate-100/80 text-slate-600",
  };

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${toneClasses[tone]}`}>{children}</span>;
}

type ListSectionProps = {
  title: string;
  items: string[] | null | undefined;
  warning?: boolean;
};

function ListSection({ title, items, warning = false }: ListSectionProps) {
  const normalizedItems = normalizeListItems(items);

  if (normalizedItems.length === 0) {
    return null;
  }

  return (
    <section className="liquid-panel rounded-[22px] px-4 py-4 sm:px-5 sm:py-5">
      <SectionTitle>{title}</SectionTitle>
      <ul className="mt-3 grid gap-x-5 gap-y-2.5 sm:mt-4 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-3">
        {normalizedItems.map((item, index) => (
          <li
            key={`${title}-${index}-${item.slice(0, 24)}`}
            className={`rounded-[16px] border px-3.5 py-3 text-sm leading-6 ${
              warning ? "border-amber-200 bg-amber-50/80 text-amber-900" : "border-white/70 bg-white/58 text-slate-600"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function normalizeListItems(items: unknown): string[] {
  if (!items) {
    return [];
  }

  if (Array.isArray(items)) {
    return items
      .flatMap((item) => normalizeListItems(item))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof items === "string") {
    return items
      .split(/\r?\n/)
      .map((line) => line.trim())
      .map((line) => line.replace(/^[-•*]\s*/, "").trim())
      .filter((line) => line && line !== "-" && line !== "•" && line !== "*");
  }

  return [];
}

type SectionTitleProps = {
  children: ReactNode;
};

function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="border-l-4 border-cyan-300 pl-3.5">
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
        <div className="glass-card p-5 text-sm leading-6 text-slate-500">当前暂无同分类推荐，后续内容增加后会自动补充。</div>
      )}
    </section>
  );
}

type MobileRelatedToolsCompactProps = {
  relatedTools: ToolItem[];
  className?: string;
};

function MobileRelatedToolsCompact({ relatedTools, className = "" }: MobileRelatedToolsCompactProps) {
  return (
    <section className={`space-y-3 ${className}`.trim()}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-cyan-700">相关推荐</p>
          <h2 className="mt-1 text-xl font-black text-ink">继续看看同类工具</h2>
        </div>
        <p className="text-xs font-medium leading-5 text-slate-500">更适合手机快速浏览</p>
      </div>

      {relatedTools.length > 0 ? (
        <div className="space-y-3">
          {relatedTools.map((relatedTool) => (
            <Link
              key={relatedTool.id}
              href={`/tools/${relatedTool.slug}`}
              className="flex items-center gap-3 rounded-[22px] border border-[#0f172a]/[0.08] bg-white/90 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#5ecfb1]/30 bg-[#f2fffa] text-sm font-black text-[#20a27f]">
                {getCompactIcon(relatedTool.name)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-black text-[#0f172a]">{relatedTool.name}</p>
                  <span className="rounded-full border border-[#0f172a]/[0.08] bg-[#f8fbff] px-2 py-0.5 text-[10px] font-black text-[#64748b]">
                    {relatedTool.category || "未分类"}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-xs font-medium leading-5 text-slate-500">
                  {relatedTool.tagline || "暂无简介"}
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-[#0f172a]/10 bg-white px-3 py-1.5 text-xs font-black text-[#0f172a] shadow-sm">
                查看
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-[22px] border border-[#0f172a]/[0.08] bg-white/90 p-4 text-sm leading-6 text-slate-500 shadow-sm">
          当前暂无相关推荐。
        </div>
      )}
    </section>
  );
}

function getVisibleTags(tags: string[] | undefined, maxCount: number) {
  return (tags ?? []).filter(Boolean).slice(0, maxCount);
}

function getFreeLabel(isFree: boolean, freeStatus?: string) {
  return firstText(freeStatus, isFree ? "免费" : "付费", "未标注");
}

function getOpenSourceLabel(isOpenSource: boolean, openSourceStatus?: string) {
  return firstText(openSourceStatus, isOpenSource ? "开源" : "非开源", "未标注");
}

function firstText(...values: Array<string | null | undefined>) {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return "";
}

function getCompactIcon(name: string) {
  const text = name.trim();

  if (!text) {
    return "KT";
  }

  const chunks = text.match(/[\p{L}\p{N}]+/gu);
  if (!chunks || chunks.length === 0) {
    return text.slice(0, 2).toUpperCase();
  }

  const first = chunks[0];
  if (/^[\u4e00-\u9fa5]+$/.test(first)) {
    return first.slice(0, 2);
  }

  return first.slice(0, 2).toUpperCase();
}
