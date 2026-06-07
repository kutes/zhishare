import Link from "next/link";
import type { ToolItem } from "@/types/tool";
import { HomeToolCard } from "./home-tool-card";

type HomeFeaturedToolsProps = {
  tools: ToolItem[];
};

export function HomeFeaturedTools({ tools }: HomeFeaturedToolsProps) {
  const displayTools = tools.slice(0, 3);

  return (
    <section id="featured-tools" className="relative px-5 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-3.5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="mb-1 inline-flex rounded-full border border-[#5ecfb1]/35 bg-white px-3 py-1 text-xs font-black text-[#20a27f] shadow-sm">
              精选工具
            </p>

            <h2 className="text-2xl font-black tracking-[-0.04em] text-[#0f172a] sm:text-3xl">
              先看这些实用工具
            </h2>

            <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-[#64748b]">
              帮你减少试错成本，先了解适合谁，再进入详情判断。
            </p>
          </div>

          <Link
            href="/tools"
            className="inline-flex h-10 items-center justify-center rounded-2xl border border-[#0f172a]/10 bg-white px-4 text-xs font-black text-[#0f172a] shadow-sm transition hover:-translate-y-0.5 hover:border-[#5ecfb1]/60 hover:text-[#20a27f]"
          >
            查看全部工具
          </Link>
        </div>

        {displayTools.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {displayTools.map((tool, index) => (
              <HomeToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-[26px] border-2 border-dashed border-[#0f172a]/[0.10] bg-white/80 p-5 text-sm font-bold leading-7 text-[#64748b] shadow-sm">
            暂时还没有工具，欢迎提交推荐。
          </div>
        )}
      </div>
    </section>
  );
}
