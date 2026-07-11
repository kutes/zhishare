import Link from "next/link";
import type { ReactNode } from "react";
import { AdPlaceholder } from "@/components/common/AdPlaceholder";
import { CopyrightNotice } from "@/components/common/CopyrightNotice";
import { toListItems } from "@/lib/db/normalizers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CollapsibleDescription } from "./collapsible-description";
import { ToolMediaGallery } from "./tool-media-gallery";
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
  const visibleTags = getVisibleTags(tool.tags, 6);
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
  const websiteUrl = firstText(tool.website_url, (detail as Record<string, unknown>).website_url);
  const downloadUrl = firstText(tool.download_url, tool.downloadUrl, (detail as Record<string, unknown>).download_url);

  return (
    <div className="tool-detail-page">
      <SiteHeader />

      <main>
        <section className="tool-detail-hero">
          <div className="tool-detail-shell py-6 sm:py-8 lg:py-9">
            <Link href="/tools" className="tool-detail-back-link">
              返回工具库
            </Link>

            <div className="tool-detail-hero-plain">
              <div className="tool-detail-badges">
                <DetailBadge tone="gold">{category}</DetailBadge>
                <DetailBadge tone="surface">{getFreeLabel(tool.is_free, tool.free_status)}</DetailBadge>
                <DetailBadge tone={tool.is_open_source ? "gold" : "outline"}>
                  {getOpenSourceLabel(tool.is_open_source, tool.open_source_status)}
                </DetailBadge>
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
            </div>
          </div>
        </section>

        <section className="tool-detail-content">
          <div className="tool-detail-shell space-y-6 py-6 sm:py-8 lg:py-9">
            <article className="tool-detail-article">
              <div className="space-y-4 sm:space-y-5">
                <section className="tool-detail-section">
                  <SectionTitle>这个工具是什么</SectionTitle>
                  <div className="mt-3">
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

                <div className="tool-detail-article-actions">
                  {websiteUrl ? (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="tool-detail-primary-button"
                    >
                      访问官网
                    </a>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="tool-detail-primary-button tool-detail-button-disabled"
                    >
                      暂无官网
                    </span>
                  )}

                  {downloadUrl ? (
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="tool-detail-secondary-button"
                    >
                      网盘下载
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="tool-detail-secondary-button tool-detail-button-disabled"
                    >
                      网盘下载
                    </button>
                  )}
                </div>
              </div>
            </article>

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
