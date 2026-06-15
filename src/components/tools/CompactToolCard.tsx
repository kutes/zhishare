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

type CompactToolCardProps = {
  tool: ToolItem;
};

export function CompactToolCard({ tool }: CompactToolCardProps) {
  const title = getToolCardTitle(tool);
  const slug = getToolSlug(tool);
  const summary = getToolSummary(tool);
  const focusText = getToolFocusText(tool);
  const initials = getToolInitials(title);
  const coverUrl = getToolCoverUrl(tool);
  const visibleTags = getVisibleTags(tool, 3);

  return (
    <article className="zh-tool-card zh-tool-card-compact">
      <div className="zh-tool-card-top">
        <div
          className="zh-tool-card-visual"
          style={coverUrl ? { backgroundImage: `url("${coverUrl}")` } : undefined}
          aria-label={coverUrl ? `${title} icon` : undefined}
        >
          {!coverUrl ? <span className="zh-tool-card-initials">{initials}</span> : null}
        </div>

        <div className="zh-tool-card-copy">
          <div className="zh-tool-card-meta">
            <span className="zh-tool-badge">{tool.category || "未分类"}</span>
            {tool.is_free && <span className="zh-tool-badge zh-tool-badge-soft">免费</span>}
            {tool.is_open_source && <span className="zh-tool-badge zh-tool-badge-soft">开源</span>}
          </div>

          <h3 className="zh-tool-card-title">{title}</h3>
          <p className="zh-tool-card-desc">{summary}</p>
        </div>
      </div>

      <p className="zh-tool-card-focus">
        <span>适合</span>
        {focusText}
      </p>

      {visibleTags.length > 0 && (
        <div className="zh-tool-tag-row">
          {visibleTags.map((tag) => (
            <span key={tag} className="zh-tool-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <Link href={`/tools/${slug}`} className="zh-tool-link">
        查看详情
      </Link>
    </article>
  );
}
