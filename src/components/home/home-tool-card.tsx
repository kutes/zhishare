import Link from "next/link";
import type { ToolItem } from "@/types/tool";

type HomeToolCardProps = {
  tool: ToolItem;
};

export function HomeToolCard({ tool }: HomeToolCardProps) {
  const title = tool.name || tool.slug || "未命名工具";
  const summary = tool.tagline || tool.description || "暂无简介";
  const category = tool.category || "未分类";
  const tags = Array.isArray(tool.tags) ? tool.tags.filter(Boolean).slice(0, 2) : [];

  return (
    <article className="glass-card soft-card-hover flex h-full min-h-64 flex-col p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#2563eb] via-[#0ea5e9] to-[#67e8f9] text-sm font-black text-white shadow-sm">
          {title.slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-black leading-snug text-[#0f172a]">{title}</h3>
          <p className="mt-1 text-xs font-semibold text-sky-700">{category}</p>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 flex-1 text-sm leading-6 text-slate-500">{summary}</p>

      {tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-100 bg-white/60 px-2.5 py-1 text-xs font-semibold text-slate-500"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <Link
        href={`/tools/${tool.slug}`}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[14px] bg-[#0f172a] px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-lg"
      >
        查看详情
      </Link>
    </article>
  );
}
