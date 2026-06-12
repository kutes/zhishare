import Link from "next/link";
import type { ToolItem } from "@/types/tool";
import {
  getCategoryAccentClass,
  getCategoryGradient,
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
  const gradient = getCategoryGradient(tool.category);
  const accentClass = getCategoryAccentClass(tool.category);
  const visibleTags = getVisibleTags(tool, 2);
  const logoStyle = coverUrl
    ? {
        backgroundImage: `url("${coverUrl}")`,
      }
    : undefined;

  return (
    <article className="glass-card soft-card-hover group flex min-h-[12.5rem] min-w-0 flex-col p-4 sm:p-5">
      <div className="flex items-start gap-2.5">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-gradient-to-br bg-cover bg-center ${gradient} shadow-sm`}
          style={logoStyle}
          aria-label={coverUrl ? `${title} 图标` : undefined}
        >
          {!coverUrl ? <span className="text-xs font-black text-white/90">{initials}</span> : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${accentClass}`}>
              {tool.category || "未分类"}
            </span>
            {tool.is_free && (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                免费
              </span>
            )}
            {tool.is_open_source && (
              <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                开源
              </span>
            )}
          </div>

          <h3 className="mt-2 text-[15px] font-black leading-tight text-[#0f172a] sm:text-base">{title}</h3>
          <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-slate-600">{summary}</p>
        </div>
      </div>

      <p className="mt-2.5 text-[13px] leading-5 text-slate-500">
        <span className="font-semibold text-slate-700">适合：</span>
        {focusText}
      </p>

      {visibleTags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-100 bg-white/60 px-2 py-0.5 text-[10px] font-medium text-slate-500"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <Link
        href={`/tools/${slug}`}
        className="mt-auto inline-flex h-9 w-full items-center justify-center rounded-[12px] bg-[#0f172a] px-4 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-md"
      >
        查看详情
      </Link>
    </article>
  );
}
