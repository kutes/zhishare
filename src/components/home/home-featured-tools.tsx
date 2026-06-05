import Link from "next/link";
import type { ToolItem } from "@/types/tool";
import { HomeToolCard } from "./home-tool-card";

type HomeFeaturedToolsProps = {
  tools: ToolItem[];
};

export function HomeFeaturedTools({ tools }: HomeFeaturedToolsProps) {
  return (
    <section id="featured-tools" className="section-gradient-soft py-8 sm:py-10 lg:py-12">
      <div className="page-shell">
        <SectionHeading
          eyebrow="精选工具"
          title="先看介绍，再进入详情判断"
          description="展示少量已发布工具，帮助你快速进入工具详情页继续判断是否适合。"
          actionLabel="查看全部工具"
          actionHref="/tools"
        />

        {tools.length > 0 ? (
          <div className="mt-5 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <HomeToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <EmptyState text="暂无已发布工具。发布工具后，这里会显示精选工具预览。" />
        )}
      </div>
    </section>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
};

function SectionHeading({ eyebrow, title, description, actionLabel, actionHref }: SectionHeadingProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm font-semibold text-sky-700">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-black text-[#0f172a] sm:text-3xl">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
      </div>
      <Link
        href={actionHref}
        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-[14px] border border-white/80 bg-white/70 px-4 text-sm font-bold text-[#0f172a] shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
      >
        {actionLabel}
      </Link>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="glass-card mt-5 p-6 text-sm leading-7 text-slate-500">{text}</div>;
}
