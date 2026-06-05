const signals = ["来源清晰", "人工整理", "持续更新", "降低试错"];

export function HeroSection() {
  return (
    <section className="section-gradient-blue relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#f8fbff]" />
      <div className="page-shell relative grid items-center gap-8 pb-20 pt-14 sm:gap-10 sm:pb-24 sm:pt-[4.5rem] lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-20">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-white/70 bg-white/60 px-4 py-2 text-sm font-semibold text-cyan-800 shadow-sm backdrop-blur">
            中文工具、AI 工具、开源项目与知识技巧
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-normal text-ink sm:text-5xl lg:text-6xl">
            发现值得信任的数字工具
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            收录 AI 工具、在线工具、效率软件和开源项目。先看清用途、来源、价格和风险，再决定是否打开官网。
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {signals.map((signal) => (
              <span
                key={signal}
                className="rounded-full border border-cyan-200/80 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white/85"
              >
                {signal}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card soft-card-hover p-4 sm:p-5">
          <div className="rounded-[20px] border border-white/70 bg-white/45 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-500">今日发现看板</p>
                <p className="mt-1 text-xl font-black text-ink">精选内容概览</p>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-semibold text-emerald-700">
                已筛选
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                ["79", "工具"],
                ["34", "技巧"],
                ["12", "开源"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/70 bg-white/70 p-3 shadow-sm">
                  <p className="text-2xl font-black text-ink">{value}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {[
                ["AI 搜索", "适合资料调研，需核对来源", "bg-cyan-50 text-cyan-800"],
                ["开源传输", "适合局域网文件流转", "bg-blue-50 text-blue-800"],
                ["隐私提示", "敏感文件上传前先确认规则", "bg-amber-50 text-amber-800"],
              ].map(([title, desc, tone]) => (
                <div key={title} className="rounded-2xl border border-white/70 bg-white/70 p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{desc}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${tone}`}>
                      推荐
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
