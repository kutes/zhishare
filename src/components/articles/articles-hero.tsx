const heroTags = ["工具教程", "效率技巧", "AI 应用", "开源项目", "持续更新"];
const boardItems = ["教程整理", "避坑经验", "工具对比"];

type ArticlesHeroProps = {
  totalCount: number;
};

export function ArticlesHero({ totalCount }: ArticlesHeroProps) {
  return (
    <section className="section-gradient-violet relative overflow-hidden">
      <div className="page-shell grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:py-24">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-white/80 bg-white/60 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm backdrop-blur">
            文章库
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl">
            整理过的工具教程与效率技巧
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            围绕 AI 工具、在线工具、开源项目和效率软件，持续整理真实可用的使用方法、避坑经验和替代方案。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {heroTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-indigo-200/80 bg-white/55 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-white/75"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <aside className="glass-card-strong liquid-border p-5 sm:p-6 lg:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">内容看板</p>
              <p className="mt-2 text-3xl font-black text-ink">持续整理</p>
            </div>
            <span className="rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-bold text-indigo-700">
              {totalCount} 篇
            </span>
          </div>
          <div className="mt-7 grid gap-3">
            {boardItems.map((item) => (
              <div key={item} className="rounded-[20px] border border-white/75 bg-white/55 p-4 shadow-inner">
                <p className="text-sm font-bold text-ink">{item}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">围绕真实使用场景做结构化整理。</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
      <div className="h-12 bg-gradient-to-b from-transparent to-[#f8fbff]" />
    </section>
  );
}
