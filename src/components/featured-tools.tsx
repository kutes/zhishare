import type { MockTool } from "@/data/mock-tools";
import { ToolCard } from "./tool-card";

type FeaturedToolsProps = {
  tools: MockTool[];
};

export function FeaturedTools({ tools }: FeaturedToolsProps) {
  return (
    <section id="featured-tools" className="section-block bg-gradient-to-b from-[#f8fbff] via-[#f5f7fb] to-[#eef6ff]">
      <div className="page-shell">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-cyan-700">推荐工具</p>
            <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">先看这批实用工具</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-500">
            所有内容来自本地假数据，用于确认首页布局和内容结构。
          </p>
        </div>

        <div className="mt-8 grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
