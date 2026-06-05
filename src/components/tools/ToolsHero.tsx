type ToolsHeroProps = {
  totalCount: number;
  categoryCount: number;
  tagCount: number;
};

const heroTags = ["AI 工具", "在线工具", "开源项目", "效率软件", "人工智能"];

export function ToolsHero({ totalCount, categoryCount, tagCount }: ToolsHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f8fbff_0%,#eef8ff_48%,#ffffff_100%)]">
      <div className="pointer-events-none absolute left-[-8%] top-[-36%] h-64 w-64 rounded-full bg-sky-200/38 blur-3xl sm:h-80 sm:w-80" />
      <div className="pointer-events-none absolute bottom-[-30%] right-[-8%] h-56 w-56 rounded-full bg-cyan-100/70 blur-3xl sm:h-72 sm:w-72" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent via-white/35 to-[#f8fbff]" />

      <div className="page-shell relative grid gap-6 py-10 sm:py-12 md:grid-cols-[minmax(0,1fr)_minmax(260px,0.58fr)] md:items-center lg:py-14">
        <div className="max-w-4xl">
          <p className="inline-flex rounded-full border border-sky-100 bg-white/68 px-3.5 py-1.5 text-xs font-semibold text-sky-700 shadow-[0_10px_28px_rgba(14,165,233,0.09)] backdrop-blur-xl sm:text-sm">
            精选工具库
          </p>
          <h1 className="mt-4 max-w-4xl text-[2.05rem] font-black leading-tight text-[#0f172a] sm:text-4xl lg:text-5xl">
            发现实用、可靠、来源清晰的数字工具
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#475569] sm:text-base">
            收录 AI 工具、在线工具、效率软件和开源项目，先看介绍，再访问官网，降低试错成本。
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {heroTags.map((item) => (
              <span
                key={item}
                className="rounded-full border border-sky-200/75 bg-white/62 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-[0_8px_24px_rgba(37,99,235,0.07)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-white/82 hover:shadow-[0_14px_30px_rgba(14,165,233,0.12)] sm:text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <aside className="glass-card-strong liquid-border relative hidden overflow-hidden rounded-[26px] border border-white/75 bg-white/70 p-4 shadow-[0_22px_64px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:block lg:p-5">
          <div className="pointer-events-none absolute right-[-24%] top-[-34%] h-36 w-36 rounded-full bg-sky-200/45 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-34%] left-[-20%] h-32 w-32 rounded-full bg-cyan-100/60 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500">工具库概览</p>
              <p className="mt-1 text-xl font-black text-[#0f172a]">筛选控制台</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/90 px-2.5 py-1 text-[11px] font-bold text-emerald-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.65)]" />
              LIVE
            </span>
          </div>

          <div className="relative mt-4 grid grid-cols-2 gap-2.5">
            <CompactStat label="当前收录" value={String(totalCount)} suffix="个工具" />
            <CompactStat label="分类筛选" value={String(categoryCount)} suffix="个分类" />
          </div>

          <div className="relative mt-3 grid gap-2.5">
            {tagCount > 0 ? <ConsoleRow label="标签筛选" value={`${tagCount} 个标签`} /> : null}
            <ConsoleRow label="访问路径" value="先看详情，再去官网" />
          </div>
        </aside>
      </div>
    </section>
  );
}

type CompactStatProps = {
  label: string;
  value: string;
  suffix: string;
};

function CompactStat({ label, value, suffix }: CompactStatProps) {
  return (
    <div className="rounded-[18px] border border-white/80 bg-white/58 p-3 shadow-inner backdrop-blur">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 flex items-end gap-1.5">
        <span className="text-2xl font-black leading-none text-[#0f172a]">{value}</span>
        <span className="text-xs font-semibold text-slate-500">{suffix}</span>
      </p>
    </div>
  );
}

type ConsoleRowProps = {
  label: string;
  value: string;
};

function ConsoleRow({ label, value }: ConsoleRowProps) {
  return (
    <div className="rounded-[18px] border border-white/80 bg-white/58 p-3 shadow-inner backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-bold text-[#0f172a]">{label}</p>
        <span className="h-1.5 w-12 rounded-full bg-gradient-to-r from-[#2563eb] via-[#0ea5e9] to-[#67e8f9] shadow-[0_0_14px_rgba(14,165,233,0.18)]" />
      </div>
      <p className="mt-1.5 text-xs leading-5 text-slate-600">{value}</p>
    </div>
  );
}
