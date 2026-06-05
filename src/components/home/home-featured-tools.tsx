import type { ToolItem } from "@/types/tool";
import { HomeToolCard } from "./home-tool-card";

type HomeFeaturedToolsProps = {
  tools: ToolItem[];
};

export function HomeFeaturedTools({ tools }: HomeFeaturedToolsProps) {
  return (
    <section id="featured-tools" className="section-gradient-soft section-block">
      <div className="page-shell">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-sky-700">推荐工具</p>
            <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">先看这批实用工具</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-500">
            所有内容来自本地假数据，用于确认首页布局和内容结构。
          </p>
        </div>

        {tools.length > 0 ? (
          <div className="mt-8 grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tools.map((tool) => (
              <HomeToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="glass-card mt-8 p-6 text-sm leading-7 text-slate-500">
            暂无已发布工具。发布工具后，这里会显示推荐内容。
          </div>
        )}
      </div>
    </section>
  );
}
