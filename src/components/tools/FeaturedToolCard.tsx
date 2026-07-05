import Link from "next/link";
import type { ToolItem } from "@/types/tool";
import {
  getToolCardTitle,
  getToolCoverUrl,
  getToolFocusText,
  getToolInitials,
  getToolSlug,
  getToolSummary,
  getVisibleTags,
} from "./tool-card-utils";

type FeaturedToolCardProps = {
  tool: ToolItem;
};

export function FeaturedToolCard({ tool }: FeaturedToolCardProps) {
  const title = getToolCardTitle(tool);
  const slug = getToolSlug(tool);
  const summary = getToolSummary(tool);
  const focusText = getToolFocusText(tool);
  const initials = getToolInitials(title);
  const coverUrl = getToolCoverUrl(tool);
  const visibleTags = getVisibleTags(tool, 4);

  return (
    <article className="zh-tool-card zh-tool-card-featured">
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="zh-tool-card-banner" src={coverUrl} alt="" loading="lazy" />
      ) : (
        <div className="zh-tool-feature-visual">
          <span className="zh-tool-card-initials zh-tool-card-initials-large">{initials}</span>
        </div>
      )}

      <div className="zh-tool-feature-body">
        <div className="zh-tool-card-meta">
          <span className="zh-tool-badge">{tool.category || "未分类"}</span>
          {tool.is_free && <span className="zh-tool-badge zh-tool-badge-soft">免费</span>}
          {tool.is_open_source && <span className="zh-tool-badge zh-tool-badge-soft">开源</span>}
        </div>

        <h3 className="zh-tool-card-title zh-tool-card-title-lg">{title}</h3>
        <p className="zh-tool-card-desc zh-tool-card-desc-lg">{summary}</p>
        <p className="zh-tool-card-focus zh-tool-card-focus-lg">
          <span>适合</span>
          {focusText}
        </p>

        <div className="zh-tool-card-bottom">
          {visibleTags.length > 0 ? (
            <div className="zh-tool-tag-row zh-tool-tag-row-wide">
              {visibleTags.map((tag) => (
                <span key={tag} className="zh-tool-tag">
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <span />
          )}
          <Link href={`/tools/${slug}`} className="zh-tool-link zh-tool-card-arrow" aria-label={`查看 ${title} 详情`}>
            →
          </Link>
        </div>
      </div>
    </article>
  );
}
