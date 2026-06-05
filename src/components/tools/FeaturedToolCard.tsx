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

type FeaturedToolCardProps = {
  tool: ToolItem;
};

export function FeaturedToolCard({ tool }: FeaturedToolCardProps) {
  const title = getToolCardTitle(tool);
  const slug = getToolSlug(tool);
  const summary = getToolSummary(tool);
  const initials = getToolInitials(title);
  const coverUrl = getToolCoverUrl(tool);
  const gradient = getCategoryGradient(tool.category);
  const accentClass = getCategoryAccentClass(tool.category);
  const visibleTags = getVisibleTags(tool, 3);

  return (
    <article className="glass-card soft-card-hover group flex min-w-0 flex-col overflow-hidden sm:flex-row">
      {/* Left: cover image or gradient fallback */}
      <div className="relative h-44 shrink-0 overflow-hidden sm:h-auto sm:w-56 lg:w-64">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        <div
          className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient} ${coverUrl ? "hidden" : ""}`}
        >
          <span className="text-3xl font-black text-white/90 drop-shadow-lg sm:text-4xl">
            {initials}
          </span>
        </div>
      </div>

      {/* Right: content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
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

          <h3 className="text-xl font-black leading-tight text-[#0f172a] sm:text-2xl">
            {title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{summary}</p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
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
          className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-[14px] bg-[#0f172a] px-4 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-lg sm:w-auto sm:min-w-[140px]"
        >
          查看详情
        </Link>
      </div>
    </article>
  );
}
