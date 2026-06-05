type ToolsHeroProps = {
  totalCount: number;
  categoryCount: number;
  tagCount: number;
};

const advantages = ["严格筛选", "持续更新", "分类清晰", "安全可靠"];

export function ToolsHero({ totalCount, categoryCount, tagCount }: ToolsHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f8fbff_0%,#eef8ff_48%,#ffffff_100%)]">
      {/* Background glows */}
      <div className="pointer-events-none absolute left-[-8%] top-[-36%] h-64 w-64 rounded-full bg-sky-200/38 blur-3xl sm:h-80 sm:w-80" />
      <div className="pointer-events-none absolute bottom-[-30%] right-[-8%] h-56 w-56 rounded-full bg-cyan-100/70 blur-3xl sm:h-72 sm:w-72" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent via-white/30 to-[#f8fbff]" />

      <div className="page-shell relative grid gap-6 py-8 sm:py-10 md:grid-cols-[minmax(0,1fr)_minmax(260px,0.52fr)] md:items-center lg:py-12">
        {/* Left: main content */}
        <div className="max-w-3xl">
          {/* Badge */}
          <p className="inline-flex rounded-full border border-sky-100 bg-white/68 px-3.5 py-1.5 text-xs font-semibold text-sky-700 shadow-[0_10px_28px_rgba(14,165,233,0.09)] backdrop-blur-xl sm:text-sm">
            精选工具库
          </p>

          {/* Title */}
          <h1 className="mt-4 max-w-3xl text-[1.85rem] font-black leading-tight text-[#0f172a] sm:text-3xl lg:text-4xl">
            发现更好用的工具，让效率与创意触手可及
          </h1>

          {/* Subtitle */}
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#475569] sm:text-base">
            收录 AI、设计、开发、运营、办公等优质工具，先看介绍，再进入详情判断是否值得使用。
          </p>

          {/* Advantage badges */}
          <div className="mt-5 flex flex-wrap gap-2">
            {advantages.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/75 bg-white/62 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-[0_8px_24px_rgba(37,99,235,0.07)] backdrop-blur-xl sm:text-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Right: stats overview card (desktop only) */}
        <aside className="glass-card-strong liquid-border relative hidden overflow-hidden rounded-[24px] border border-white/75 bg-white/72 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:block">
          <div className="pointer-events-none absolute right-[-24%] top-[-34%] h-36 w-36 rounded-full bg-sky-200/45 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-34%] left-[-20%] h-32 w-32 rounded-full bg-cyan-100/60 blur-3xl" />

          <div className="relative flex items-start justify-between gap-3">
            <p className="text-xs font-semibold text-slate-500">工具库概览</p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/90 px-2.5 py-1 text-[11px] font-black text-emerald-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
              LIVE
            </span>
          </div>

          <div className="relative mt-3 grid grid-cols-2 gap-2.5">
            <StatCell label="当前收录" value={String(totalCount)} suffix="个工具" />
            <StatCell label="分类数量" value={String(categoryCount)} suffix="个分类" />
          </div>

          {tagCount > 0 && (
            <div className="relative mt-2.5">
              <StatCell label="标签数量" value={String(tagCount)} suffix="个标签" />
            </div>
          )}

          <div className="relative mt-3 flex items-center gap-2 rounded-[14px] border border-sky-100 bg-sky-50/80 px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.55)]" />
            <span className="text-[11px] font-bold text-sky-700">先看详情，再去官网</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

type StatCellProps = {
  label: string;
  value: string;
  suffix: string;
};

function StatCell({ label, value, suffix }: StatCellProps) {
  return (
    <div className="rounded-[16px] border border-white/80 bg-white/58 p-3 shadow-inner backdrop-blur">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 flex items-end gap-1.5">
        <span className="text-2xl font-black leading-none text-[#0f172a]">{value}</span>
        <span className="text-xs font-semibold text-slate-500">{suffix}</span>
      </p>
    </div>
  );
}
