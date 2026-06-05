import Link from "next/link";

type HomeHeroProps = {
  toolCount: number;
  articleCount: number;
  categoryCount: number;
};

const heroChips = ["来源清晰", "人工整理", "先看介绍", "再去官网"];
const boardNotes = ["工具先进入详情页", "投稿进入人工审核", "版权问题可反馈处理"];

export function HomeHero({ toolCount, articleCount, categoryCount }: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f8fbff_0%,#eef8ff_48%,#ffffff_100%)]">
      <div className="pointer-events-none absolute left-[-10%] top-[-34%] h-72 w-72 rounded-full bg-sky-200/38 blur-3xl sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute bottom-[-28%] right-[-10%] h-64 w-64 rounded-full bg-cyan-100/70 blur-3xl sm:h-80 sm:w-80" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent via-white/35 to-[#f8fbff]" />

      <div className="page-shell relative grid gap-8 py-12 sm:py-14 md:grid-cols-[minmax(0,1fr)_minmax(280px,0.58fr)] md:items-center lg:py-16">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-sky-100 bg-white/68 px-3.5 py-1.5 text-xs font-semibold text-sky-700 shadow-[0_10px_28px_rgba(14,165,233,0.09)] backdrop-blur-xl sm:text-sm">
            中文工具与知识发现站
          </p>

          <h1 className="mt-4 max-w-3xl text-[2.15rem] font-black leading-tight text-[#0f172a] sm:text-4xl lg:text-5xl">
            发现值得信任的工具、方法和实用知识
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#475569] sm:text-base">
            知享持续整理 AI 工具、在线工具、效率软件、开源项目和实用教程，帮助你先理解，再选择，降低试错成本。
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/tools"
              className="inline-flex min-h-11 items-center justify-center rounded-[14px] bg-[#0f172a] px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-lg"
            >
              进入工具库
            </Link>
            <Link
              href="/articles"
              className="inline-flex min-h-11 items-center justify-center rounded-[14px] border border-white/80 bg-white/70 px-5 text-sm font-bold text-[#0f172a] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
            >
              阅读文章
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {heroChips.map((item) => (
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

        <aside className="glass-card-strong liquid-border relative hidden overflow-hidden rounded-[26px] border border-white/75 bg-white/72 p-5 shadow-[0_22px_64px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:block">
          <div className="pointer-events-none absolute right-[-24%] top-[-34%] h-36 w-36 rounded-full bg-sky-200/45 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-34%] left-[-20%] h-32 w-32 rounded-full bg-cyan-100/60 blur-3xl" />

          <div className="relative flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-500">今日发现看板</p>
              <h2 className="mt-1 text-xl font-black text-[#0f172a]">内容概览</h2>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/90 px-2.5 py-1 text-[11px] font-black text-emerald-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
              LIVE
            </span>
          </div>

          <div className="relative mt-4 grid gap-2.5">
            <BoardStat label="已收录工具" value={toolCount} suffix="个" />
            <BoardStat label="已发布文章" value={articleCount} suffix="篇" />
            {categoryCount > 0 ? <BoardStat label="当前分类" value={categoryCount} suffix="个" /> : null}
          </div>

          <div className="relative mt-4 space-y-2">
            {boardNotes.map((note) => (
              <p
                key={note}
                className="rounded-[14px] border border-white/80 bg-white/58 px-3 py-2 text-xs font-semibold text-slate-600 shadow-inner"
              >
                {note}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

type BoardStatProps = {
  label: string;
  value: number;
  suffix: string;
};

function BoardStat({ label, value, suffix }: BoardStatProps) {
  return (
    <div className="flex items-end justify-between gap-4 rounded-[18px] border border-white/80 bg-white/58 p-3 shadow-inner backdrop-blur">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="flex items-end gap-1.5">
        <span className="text-2xl font-black leading-none text-[#0f172a]">{value}</span>
        <span className="text-xs font-semibold text-slate-500">{suffix}</span>
      </p>
    </div>
  );
}
