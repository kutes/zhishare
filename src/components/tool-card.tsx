import Link from "next/link";
import type { MockTool } from "@/data/mock-tools";

type ToolCardProps = {
  tool: MockTool;
};

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <article className="glass-card soft-card-hover flex h-full min-h-[25rem] flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="inline-flex rounded-full border border-cyan-200 bg-cyan-50/80 px-3 py-1 text-xs font-semibold text-cyan-800">
            {tool.category}
          </p>
          <h3 className="mt-4 text-xl font-black leading-7 text-ink">{tool.name}</h3>
        </div>
        <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-semibold text-emerald-700">
          {tool.pricing}
        </span>
      </div>

      <p className="mt-3 text-sm font-semibold text-ink">{tool.tagline}</p>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-500">{tool.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {tool.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/70 bg-white/60 px-2.5 py-1 text-xs font-medium text-slate-500">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-white/70 bg-white/55 p-3 text-sm leading-6 text-slate-500">
        {tool.highlight}
      </div>

      <Link
        href={`/tools/${tool.slug}`}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[14px] bg-ink px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-lg"
      >
        查看详情
      </Link>
    </article>
  );
}
