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
  const gradient = getCategoryGradient(tool.category);
  const accentClass = getCategoryAccentClass(tool.category);
  const visibleTags = getVisibleTags(tool, 2);
  const coverStyle = coverUrl
    ? {
        backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.12), rgba(14, 165, 233, 0.08)), url("${coverUrl}")`,
      }
    : undefined;

  return (
    <article className="glass-card soft-card-hover group flex min-w-0 flex-col overflow-hidden sm:min-h-[200px] sm:flex-row">
      <div
        className={`relative flex h-36 shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br bg-cover bg-center ${gradient} sm:h-auto sm:w-48 lg:w-56`}
        style={coverStyle}
        aria-label={coverUrl ? `${title} 封面` : undefined}
      >
        {!coverUrl ? <span className="text-3xl font-black text-white/90 drop-shadow-lg sm:text-4xl">{initials}</span> : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${accentClass}`}>
              {tool.category || "未分类"}
            </span>
            {tool.is_free && (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                免费
              </span>
            )}
            {tool.is_open_source && (
              <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                开源
              </span>
            )}
          </div>

          <h3 className="text-lg font-black leading-tight text-[#0f172a] sm:text-[1.35rem]">{title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{summary}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            <span className="font-semibold text-slate-700">适合：</span>
            {focusText}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/80 bg-white/62 px-2 py-0.5 text-xs font-medium text-slate-500 shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={`/tools/${slug}`}
          className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-[14px] bg-[#0f172a] px-4 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-lg sm:w-auto sm:min-w-[140px]"
        >
          查看详情
        </Link>
      </div>
    </article>
  );
}
