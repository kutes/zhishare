import Link from "next/link";
import type { ReactNode } from "react";
import { AdPlaceholder } from "@/components/common/AdPlaceholder";
import { CopyrightNotice } from "@/components/common/CopyrightNotice";
import { toListItems } from "@/lib/db/normalizers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CollapsibleDescription } from "./collapsible-description";
import { MobileToolDetailSections } from "./mobile-tool-detail-sections";
import { ToolDecisionPanel } from "./tool-decision-panel";
import { ToolMediaGallery } from "./tool-media-gallery";
import { ToolMobileSummaryCard } from "./tool-mobile-summary-card";
import type { ToolMediaItem } from "@/lib/media/tool-media";
import type { ToolItem } from "@/types/tool";

type ToolDetailPageProps = {
  tool: ToolItem;
  relatedTools: ToolItem[];
  media?: ToolMediaItem[];
};

type DetailBadgeTone = "gold" | "surface" | "outline";

export function ToolDetailPage({ tool, relatedTools, media = [] }: ToolDetailPageProps) {
  const detail = getDetailRecord(tool);
  const title = firstText(tool.name, detail.name, detail.title) || "未命名工具";
  const summary = firstText(tool.tagline, detail.tagline, tool.description, detail.description) || "暂无简介";
  const description = firstText(tool.description, detail.description, summary) || "暂无详细介绍";
  const category = firstText(tool.category, detail.category) || "未分类";
  const visibleTags = getVisibleTags(tool.tags, 5);
  const features = getToolList(tool, ["features", "core_features", "coreFeatures"], [
    "features",
    "core_features",
    "coreFeatures",
    "mainFeatures",
  ]);
  const audience = getToolList(tool, ["target_users", "targetUsers", "audience"], [
    "target_users",
    "targetUsers",
    "audience",
    "suitableFor",
  ]);
  const scenarios = getToolList(tool, ["use_cases", "useCases", "scenarios"], ["use_cases", "useCases", "scenarios"]);
  const pros = getToolList(tool, ["pros", "advantages"], ["pros", "advantages"]);
  const cons = getToolList(tool, ["cons", "limitations"], ["cons", "limitations"]);
  const risks = getToolList(tool, ["risk_notice", "riskNotice"], ["risk_notice", "riskNotice", "risk"]);

  return (
    <div className="tool-detail-page">
      <SiteHeader />

      <main>
        <section className="tool-detail-hero">
          <div className="tool-detail-shell py-6 sm:py-8 lg:py-10">
            <Link href="/tools" className="tool-detail-back-link">
              返回工具库
            </Link>

            <div className="mt-5 space-y-4 md:hidden">
              <ToolMobileSummaryCard tool={tool} />
              <ToolDecisionPanel tool={tool} />
            </div>

            <div className="mt-5 hidden gap-5 md:grid lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.9fr)] lg:items-start">
              <DetailHero
                title={title}
                summary={summary}
                category={category}
                visibleTags={visibleTags}
                isFree={tool.is_free}
                isOpenSource={tool.is_open_source}
                freeStatus={tool.free_status}
                openSourceStatus={tool.open_source_status}
              />

              <ToolDecisionPanel tool={tool} />
            </div>
          </div>
        </section>

        <section className="tool-detail-content">
          <div className="tool-detail-shell space-y-6 py-6 sm:py-8 lg:py-10">
            <MobileToolDetailSections tool={tool} className="md:hidden" />
            <ToolMediaGallery items={media} className="md:hidden" />
            <MobileRelatedToolsCompact relatedTools={relatedTools} className="md:hidden" />

            <div className="hidden md:block">
              <article className="tool-detail-article">
                <div className="space-y-4 sm:space-y-5">
                  <section className="tool-detail-section">
                    <SectionTitle>这个工具是什么</SectionTitle>
                    <div className="mt-4">
                      <CollapsibleDescription title="" content={description} className="mt-0" />
                    </div>
                  </section>

                  <ListSection title="核心功能" items={features} />
                  <ToolMediaGallery items={media} />
                  <AdPlaceholder variant="inline" />
                  <ListSection title="适合人群" items={audience} />
                  <ListSection title="使用场景" items={scenarios} />
                  <ListSection title="优点" items={pros} />
                  <ListSection title="缺点" items={cons} />
                  <ListSection title="风险提醒" items={risks} warning />
                </div>
              </article>
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
    <div className="tool-detail-page">
      <SiteHeader />
      <main className="tool-detail-not-found">
        <div className="tool-detail-shell flex min-h-[62vh] items-center py-16">
          <section className="tool-detail-not-found-card">
            <p className="tool-detail-kicker">工具不存在</p>
            <h1 className="tool-detail-not-found-title">没有找到这个工具</h1>
            <p className="tool-detail-not-found-copy">你可以返回工具库重新浏览，也可以从搜索或分类页继续查找。</p>
            <Link href="/tools" className="tool-detail-primary-button mt-6">
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
  category,
  visibleTags,
  isFree,
  isOpenSource,
  freeStatus,
  openSourceStatus,
}: DetailHeroProps) {
  return (
    <article className="tool-detail-hero-card">
      <div className="tool-detail-badges">
        <DetailBadge tone="gold">{category}</DetailBadge>
        <DetailBadge tone="surface">{getFreeLabel(isFree, freeStatus)}</DetailBadge>
        <DetailBadge tone={isOpenSource ? "gold" : "outline"}>{getOpenSourceLabel(isOpenSource, openSourceStatus)}</DetailBadge>
      </div>

      <h1 className="tool-detail-title">{title}</h1>
      <p className="tool-detail-summary">{summary}</p>

      {visibleTags.length > 0 ? (
        <div className="tool-detail-tags">
          {visibleTags.map((tag) => (
            <span key={tag} className="tool-detail-tag">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

type DetailBadgeProps = {
  tone: DetailBadgeTone;
  children: ReactNode;
};

function DetailBadge({ tone, children }: DetailBadgeProps) {
  const toneClass = {
    gold: "tool-detail-badge tool-detail-badge-gold",
    surface: "tool-detail-badge tool-detail-badge-surface",
    outline: "tool-detail-badge tool-detail-badge-outline",
  }[tone];

  return <span className={toneClass}>{children}</span>;
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
    <section className={`tool-detail-section ${warning ? "tool-detail-section-warning" : ""}`}>
      <SectionTitle>{title}</SectionTitle>
      <ul className="tool-detail-list">
        {normalizedItems.map((item, index) => (
          <li key={`${title}-${index}-${item.slice(0, 24)}`} className="tool-detail-list-item">
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
    return items.flatMap((item) => normalizeListItems(item));
  }

  if (typeof items === "string") {
    return items
      .split(/\r?\n/)
      .map((line) => line.replace(/^[\s•·*-]+/, "").trim())
      .filter(Boolean);
  }

  return [];
}

function getDetailRecord(tool: ToolItem) {
  return (tool as unknown as { detail?: Record<string, unknown> }).detail ?? {};
}

function getToolList(tool: ToolItem, directKeys: string[], detailKeys: string[]) {
  const direct = readTextArray(tool, directKeys);

  if (direct.length > 0) {
    return direct;
  }

  return readTextArray(getDetailRecord(tool), detailKeys);
}

function readTextArray(source: unknown, keys: string[]) {
  if (!source || typeof source !== "object") {
    return [];
  }

  const record = source as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];

    if (Array.isArray(value) || typeof value === "string") {
      return toListItems(value);
    }
  }

  return [];
}

function firstText(...values: Array<unknown>) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
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

type SectionTitleProps = {
  children: ReactNode;
};

function SectionTitle({ children }: SectionTitleProps) {
  return <h2 className="tool-detail-section-title">{children}</h2>;
}

type RelatedToolsSectionProps = {
  relatedTools: ToolItem[];
};

function RelatedToolsSection({ relatedTools }: RelatedToolsSectionProps) {
  return (
    <section className="tool-detail-related-wrap">
      <div className="tool-detail-section-head">
        <div>
          <p className="tool-detail-kicker">相关推荐</p>
          <h2 className="tool-detail-section-heading">继续看看同类工具</h2>
        </div>
        <p className="tool-detail-section-copy">优先推荐同分类工具，方便你横向比较。</p>
      </div>

      {relatedTools.length > 0 ? (
        <div className="tool-detail-related-grid">
          {relatedTools.map((relatedTool) => (
            <article key={relatedTool.id} className="tool-detail-related-card">
              <span className="tool-detail-related-chip">{relatedTool.category || "未分类"}</span>
              <h3 className="tool-detail-related-title">{relatedTool.name}</h3>
              <p className="tool-detail-related-copy">{relatedTool.tagline || relatedTool.description || "暂无简介"}</p>
              <Link href={`/tools/${relatedTool.slug}`} className="tool-detail-secondary-button">
                查看详情
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="tool-detail-empty-related">当前暂无同类推荐，后续内容增加后会自动补充。</div>
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
    <section className={`tool-detail-mobile-related ${className}`.trim()}>
      <div className="tool-detail-section-head tool-detail-section-head-mobile">
        <div>
          <p className="tool-detail-kicker">相关推荐</p>
          <h2 className="tool-detail-section-heading tool-detail-section-heading-mobile">继续看看同类工具</h2>
        </div>
        <p className="tool-detail-section-copy tool-detail-section-copy-mobile">更适合手机上快速浏览。</p>
      </div>

      {relatedTools.length > 0 ? (
        <div className="tool-detail-mobile-related-list">
          {relatedTools.map((relatedTool) => (
            <Link key={relatedTool.id} href={`/tools/${relatedTool.slug}`} className="tool-detail-mobile-related-item">
              <div className="tool-detail-mobile-related-icon">{getCompactIcon(relatedTool.name)}</div>
              <div className="tool-detail-mobile-related-body">
                <div className="tool-detail-mobile-related-top">
                  <p className="tool-detail-mobile-related-title">{relatedTool.name}</p>
                  <span className="tool-detail-mobile-related-chip">{relatedTool.category || "未分类"}</span>
                </div>
                <p className="tool-detail-mobile-related-copy">{relatedTool.tagline || "暂无简介"}</p>
              </div>
              <span className="tool-detail-mobile-related-action">查看</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="tool-detail-mobile-empty">当前暂无同类推荐。</div>
      )}
    </section>
  );
}
