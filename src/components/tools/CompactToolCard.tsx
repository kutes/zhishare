import Link from "next/link";
import type { ToolItem } from "@/types/tool";
import {
  getToolCardTitle,
  getToolFocusText,
  getToolIconUrl,
  getToolInitials,
  getToolSlug,
  getToolSummary,
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
  const iconUrl = getToolIconUrl(tool);

  return (
    <article className="zh-tool-card zh-tool-card-compact">
      <div className="zh-tool-card-top">
        {iconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="zh-tool-card-icon" src={iconUrl} alt="" loading="lazy" />
        ) : (
          <div className="zh-tool-card-visual">
            <span className="zh-tool-card-initials">{initials}</span>
          </div>
        )}

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

      <div className="zh-tool-card-bottom">
        <p className="zh-tool-card-focus">
          <span>适合</span>
          {focusText}
        </p>
        <Link href={`/tools/${slug}`} className="zh-tool-link zh-tool-card-arrow" aria-label={`查看 ${title} 详情`}>
          →
        </Link>
      </div>
    </article>
  );
}
