type ToolsHeroProps = {
  totalCount: number;
};

const heroTags = ["AI 工具", "在线工具", "开源项目", "效率软件", "人工整理"];

export function ToolsHero({ totalCount }: ToolsHeroProps) {
  return (
    <section className="section-gradient-blue relative overflow-hidden">
      <div className="page-shell grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:py-24">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-white/80 bg-white/60 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm backdrop-blur">
            精选工具库
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl">
            发现实用、可靠、来源清晰的数字工具
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            收录 AI 工具、在线工具、效率软件和开源项目。先看介绍，再访问官网，降低试错成本。
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {heroTags.map((item) => (
              <span
                key={item}
                className="rounded-full border border-cyan-200/80 bg-white/55 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white/75"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <aside className="glass-card-strong liquid-border p-5 sm:p-6 lg:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">工具库概览</p>
              <p className="mt-2 text-3xl font-black text-ink">筛选控制台</p>
            </div>
            <span className="rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-bold text-emerald-700">
              LIVE
            </span>
          </div>

          <div className="mt-7 rounded-[22px] border border-white/75 bg-white/55 p-5 shadow-inner">
            <p className="text-sm font-semibold text-slate-500">当前收录</p>
            <div className="mt-2 flex items-end gap-3">
              <span className="text-6xl font-black leading-none text-ink">{totalCount}</span>
              <span className="pb-2 text-base font-semibold text-slate-500">个演示工具</span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[20px] border border-white/75 bg-white/55 p-4 shadow-inner">
              <p className="text-sm font-bold text-ink">筛选体验</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">分类 + 标签 + 搜索</p>
            </div>
            <div className="rounded-[20px] border border-white/75 bg-white/55 p-4 shadow-inner">
              <p className="text-sm font-bold text-ink">访问逻辑</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">先看详情，再去官网</p>
            </div>
          </div>
        </aside>
      </div>
      <div className="h-12 bg-gradient-to-b from-transparent to-[#f8fbff]" />
    </section>
  );
}
