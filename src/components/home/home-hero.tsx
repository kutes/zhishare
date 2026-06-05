const heroTags = ["来源清晰", "人工整理", "持续更新", "降低试错"];

const dashboardStats = [
  { label: "工具", value: "79" },
  { label: "技巧", value: "34" },
  { label: "开源", value: "12" },
];

const dashboardNotes = [
  "AI 搜索：适合资料调研，需要核对来源",
  "开源传输：适合局域网文件流转",
  "隐私提示：敏感文件上传前先确认规则",
];

export function HomeHero() {
  return (
    <section className="section-gradient-blue relative overflow-hidden">
      <div className="page-shell grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-24">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-white/80 bg-white/60 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm backdrop-blur">
            中文工具发现站
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl">
            发现值得信任的数字工具
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            收录 AI 工具、在线工具、效率软件和开源项目。先看清用途、来源、价格和风险，再决定是否打开官网。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {heroTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-cyan-200/80 bg-white/55 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white/75"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card-strong liquid-border p-5 sm:p-6 lg:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">今日发现看板</p>
              <p className="mt-2 text-3xl font-black text-ink">内容雷达</p>
            </div>
            <span className="rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-bold text-emerald-700">
              LIVE
            </span>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3">
            {dashboardStats.map((item) => (
              <div key={item.label} className="rounded-[20px] border border-white/70 bg-white/55 p-4 text-center shadow-inner">
                <p className="text-2xl font-black text-ink sm:text-3xl">{item.value}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {dashboardNotes.map((note) => (
              <p
                key={note}
                className="rounded-2xl border border-white/70 bg-white/50 px-4 py-3 text-sm leading-6 text-slate-600 shadow-inner"
              >
                {note}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="h-12 bg-gradient-to-b from-transparent to-[#f8fbff]" />
    </section>
  );
}
