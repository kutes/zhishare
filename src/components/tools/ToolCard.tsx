import Link from "next/link";
import type { ToolItem } from "@/types/tool";

type ToolCardProps = {
  tool: ToolItem;
};

export function ToolCard({ tool }: ToolCardProps) {
  const visibleTags = tool.tags.slice(0, 4);

  return (
    <article className="glass-card soft-card-hover group flex h-full min-h-[25.5rem] min-w-0 flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full border border-cyan-200/80 bg-cyan-50/80 px-3 py-1 text-xs font-bold text-cyan-800">
          {tool.category}
        </span>
        <span className="shrink-0 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3 py-1 text-xs font-bold text-emerald-700">
          {tool.free_status}
        </span>
      </div>

      <h2 className="mt-6 break-words text-2xl font-black leading-tight text-ink">{tool.name}</h2>
      <p className="mt-2 text-sm font-bold text-slate-700">{tool.tagline}</p>
      <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">{tool.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {visibleTags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/80 bg-white/62 px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm">
            {tag}
          </span>
        ))}
      </div>

      <div className="mb-5 mt-6 flex-1 rounded-[20px] border border-cyan-100/80 bg-gradient-to-br from-cyan-50/75 to-white/55 p-4 shadow-inner">
        <p className="text-xs font-bold text-cyan-900">适合人群</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{tool.highlight}</p>
      </div>

      <Link
        href={`/tools/${tool.slug}`}
        className="mt-auto inline-flex h-12 w-full items-center justify-center rounded-[16px] bg-ink px-4 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-lg"
      >
        查看详情
      </Link>
    </article>
  );
}
