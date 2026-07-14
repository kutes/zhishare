import Link from "next/link";
import type { ToolItem } from "@/types/tool";
import {
  getToolCardTitle,
  getToolCoverUrl,
  getToolFocusText,
  getToolInitials,
  getToolSlug,
  getToolSummary,
  isPhotoCover,
} from "./tool-card-utils";

type CompactToolCardProps = {
  tool: ToolItem;
};

// Cover-on-top grid card (xiaohu-style): every tool has a 16:9 cover
// (official photo or generated SVG), so the small icon variant was retired.
export function CompactToolCard({ tool }: CompactToolCardProps) {
  const title = getToolCardTitle(tool);
  const slug = getToolSlug(tool);
  const summary = getToolSummary(tool);
  const focusText = getToolFocusText(tool);
  const initials = getToolInitials(title);
  const coverUrl = getToolCoverUrl(tool);

  return (
    <Link href={`/tools/${slug}`} className="zh-tool-card zh-tool-card-cover" aria-label={`查看 ${title} 详情`}>
      {coverUrl ? (
        <div className={`zh-tool-card-banner-wrap${isPhotoCover(tool) ? " zh-tool-card-banner-photo" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="zh-tool-card-banner" src={coverUrl} alt="" loading="lazy" />
        </div>
      ) : (
        <div className="zh-tool-card-cover-fallback">
          <span className="zh-tool-card-initials">{initials}</span>
        </div>
      )}

      <div className="zh-tool-card-meta">
        <span className="zh-tool-badge">{tool.category || "未分类"}</span>
        {tool.is_free && <span className="zh-tool-badge zh-tool-badge-soft">免费</span>}
        {tool.is_open_source && <span className="zh-tool-badge zh-tool-badge-soft">开源</span>}
      </div>

      <h3 className="zh-tool-card-title">{title}</h3>
      <p className="zh-tool-card-desc zh-tool-card-desc-clamp">{summary}</p>

      <div className="zh-tool-card-bottom">
        <p className="zh-tool-card-focus">
          <span>适合</span>
          {focusText}
        </p>
        <span className="zh-tool-card-arrow" aria-hidden="true">
          →
        </span>
      </div>
    </Link>
  );
}
