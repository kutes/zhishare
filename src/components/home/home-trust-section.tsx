const principles = [
  {
    title: "来源清晰",
    description: "优先提供官网、项目主页或官方文档链接。",
  },
  {
    title: "功能明确",
    description: "先说明工具解决什么问题，再推荐使用场景。",
  },
  {
    title: "风险提醒",
    description: "涉及账号、隐私、版权或付费内容时，会尽量提示注意事项。",
  },
  {
    title: "人工整理",
    description: "不做自动搬运，避免垃圾信息和低质量内容。",
  },
];

export function HomeTrustSection() {
  return (
    <section className="section-gradient-soft py-8 sm:py-10 lg:py-12">
      <div className="page-shell">
        <div className="glass-card-strong liquid-border relative overflow-hidden rounded-[32px] border border-white/75 bg-white/70 p-5 shadow-[0_22px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute right-[-7rem] top-[-8rem] h-56 w-56 rounded-full bg-sky-100/70 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-8rem] left-[-8rem] h-56 w-56 rounded-full bg-cyan-100/58 blur-3xl" />

          <div className="relative max-w-3xl">
            <p className="inline-flex rounded-full border border-sky-100 bg-sky-50/70 px-3 py-1 text-xs font-bold text-sky-700">
              收录原则
            </p>
            <h2 className="mt-3 text-2xl font-black text-[#0f172a] sm:text-3xl">内容先可信，再发布</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
              知享优先整理来源清晰、功能明确、适合中文用户理解的工具和知识内容。投稿内容会先进入人工审核，再决定是否发布。
            </p>
          </div>

          <div className="relative mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((item, index) => (
              <article key={item.title} className="rounded-[22px] border border-white/80 bg-white/58 p-4 shadow-inner backdrop-blur">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#2563eb] to-[#0ea5e9] text-xs font-black text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-base font-black text-[#0f172a]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
