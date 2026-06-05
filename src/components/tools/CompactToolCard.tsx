import Link from "next/link";
import type { ToolItem } from "@/types/tool";
import {
  getCategoryAccentClass,
  getCategoryGradient,
  getToolCardTitle,
  getToolCoverUrl,
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
  const initials = getToolInitials(title);
  const coverUrl = getToolCoverUrl(tool);
  const gradient = getCategoryGradient(tool.category);
  const accentClass = getCategoryAccentClass(tool.category);
  const visibleTags = getVisibleTags(tool, 3);

  return (
    <article className="glass-card soft-card-hover group flex min-h-[14rem] min-w-0 flex-col p-5">
      {/* Top row: logo + badges */}
      <div className="flex items-start gap-3">
        {/* Logo / fallback */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-gradient-to-br ${gradient} shadow-sm`}
        >
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="h-full w-full object-cover"
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = "none";
                const parent = el.parentElement;
                if (parent) {
                  const span = document.createElement("span");
                  span.className = "text-xs font-black text-white/90";
                  span.textContent = initials;
                  parent.appendChild(span);
                }
              }}
            />
          ) : (
            <span className="text-xs font-black text-white/90">{initials}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-black leading-snug text-[#0f172a]">{title}</h3>
          <p className="mt-0.5 truncate text-xs text-slate-500">{summary}</p>
        </div>
      </div>

      {/* Middle: badges */}
      <div className="mt-3 flex flex-wrap gap-1.5">
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

      {/* Tags */}
      {visibleTags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
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

      {/* Bottom: detail link */}
      <Link
        href={`/tools/${slug}`}
        className="mt-auto inline-flex h-10 w-full items-center justify-center rounded-[12px] bg-[#0f172a] px-4 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-md"
      >
        查看详情
      </Link>
    </article>
  );
}
