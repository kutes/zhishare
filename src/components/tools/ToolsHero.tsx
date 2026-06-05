type ToolsHeroProps = {
  totalCount: number;
};

const heroTags = ["AI 工具", "在线工具", "开源项目", "效率软件", "人工智能"];

export function ToolsHero({ totalCount }: ToolsHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f8fbff_0%,#eef8ff_48%,#ffffff_100%)]">
      <div className="pointer-events-none absolute left-[-10%] top-[-28%] h-80 w-80 rounded-full bg-sky-200/45 blur-3xl sm:h-[28rem] sm:w-[28rem]" />
      <div className="pointer-events-none absolute bottom-[-18%] right-[-8%] h-72 w-72 rounded-full bg-cyan-100/75 blur-3xl sm:h-[26rem] sm:w-[26rem]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-white/35 to-[#f8fbff]" />

      <div className="page-shell relative grid gap-8 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] lg:items-center lg:py-24">
        <div className="max-w-4xl">
          <p className="inline-flex rounded-full border border-sky-100 bg-white/68 px-4 py-2 text-sm font-semibold text-sky-700 shadow-[0_12px_36px_rgba(14,165,233,0.10)] backdrop-blur-xl">
            精选工具库
          </p>
          <h1 className="mt-6 max-w-4xl text-[2.25rem] font-black leading-tight text-[#0f172a] sm:text-5xl lg:text-6xl">
            发现实用、可靠、来源清晰的数字工具
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#475569] sm:text-lg">
            收录 AI 工具、在线工具、效率软件和开源项目，先看介绍，再访问官网，降低试错成本。
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5 sm:gap-3">
            {heroTags.map((item) => (
              <span
                key={item}
                className="rounded-full border border-sky-200/75 bg-white/62 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_10px_30px_rgba(37,99,235,0.08)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-white/82 hover:shadow-[0_16px_38px_rgba(14,165,233,0.14)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <aside className="glass-card-strong liquid-border relative overflow-hidden rounded-[32px] border border-white/75 bg-white/70 p-5 shadow-[0_30px_90px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-6 lg:p-7">
          <div className="pointer-events-none absolute right-[-18%] top-[-26%] h-44 w-44 rounded-full bg-sky-200/55 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-24%] left-[-18%] h-40 w-40 rounded-full bg-cyan-100/70 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">工具发现</p>
              <p className="mt-2 text-2xl font-black text-[#0f172a] sm:text-3xl">筛选控制台</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.65)]" />
              LIVE
            </span>
          </div>

          <div className="relative mt-7 rounded-[26px] border border-white/80 bg-white/58 p-5 shadow-inner backdrop-blur-xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">当前收录</p>
                <div className="mt-2 flex items-end gap-3">
                  <span className="text-5xl font-black leading-none text-[#0f172a] sm:text-6xl">{totalCount}</span>
                  <span className="pb-1.5 text-sm font-semibold text-slate-500 sm:text-base">个已发布工具</span>
                </div>
              </div>
              <div className="hidden h-16 w-16 rounded-full border-[10px] border-sky-100 border-t-sky-400 shadow-inner sm:block" />
            </div>
          </div>

          <div className="relative mt-4 grid gap-3">
            <ConsoleRow label="筛选维度" value="分类 + 标签 + 关键词" />
            <ConsoleRow label="访问保障" value="先看详情，再去官网" />
          </div>

          <div className="relative mt-6 rounded-[24px] border border-sky-100/80 bg-sky-50/62 p-4 shadow-inner backdrop-blur">
            <div className="flex items-center justify-between gap-4 text-xs font-semibold text-slate-500">
              <span>工具发现路径</span>
              <span>最新优先</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {["筛选", "详情", "官网"].map((item, index) => (
                <div key={item} className="rounded-full bg-white/80 px-3 py-2 text-center text-xs font-bold text-slate-700 shadow-sm">
                  {index + 1}. {item}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

type ConsoleRowProps = {
  label: string;
  value: string;
};

function ConsoleRow({ label, value }: ConsoleRowProps) {
  return (
    <div className="rounded-[22px] border border-white/80 bg-white/58 p-4 shadow-inner backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-bold text-[#0f172a]">{label}</p>
        <span className="h-2 w-16 rounded-full bg-gradient-to-r from-[#2563eb] via-[#0ea5e9] to-[#67e8f9] shadow-[0_0_18px_rgba(14,165,233,0.22)]" />
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{value}</p>
    </div>
  );
}
