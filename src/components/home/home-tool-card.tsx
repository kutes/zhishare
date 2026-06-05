import Link from "next/link";
import type { ToolItem } from "@/types/tool";

type HomeToolCardProps = {
  tool: ToolItem;
};

export function HomeToolCard({ tool }: HomeToolCardProps) {
  return (
    <article className="glass-card soft-card-hover flex h-full min-h-[25rem] flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full border border-cyan-200/80 bg-cyan-50/80 px-3 py-1 text-xs font-bold text-cyan-800">
          {tool.category}
        </span>
        <span className="shrink-0 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3 py-1 text-xs font-bold text-emerald-700">
          {tool.free_status}
        </span>
      </div>

      <h3 className="mt-5 text-xl font-black leading-7 text-ink">{tool.name}</h3>
      <p className="mt-2 text-sm font-semibold text-slate-700">{tool.tagline}</p>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-500">{tool.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {tool.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/75 bg-white/60 px-2.5 py-1 text-xs font-semibold text-slate-500">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-white/75 bg-white/55 p-3 text-sm leading-6 text-slate-600 shadow-inner">
        {tool.highlight}
      </div>

      <Link
        href={`/tools/${tool.slug}`}
        className="mt-5 inline-flex min-h-12 items-center justify-center rounded-[14px] bg-ink px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-lg"
      >
        查看详情
      </Link>
    </article>
  );
}
