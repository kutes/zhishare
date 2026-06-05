import Link from "next/link";

const entryCards = [
  {
    title: "工具库",
    description: "收录 AI、在线工具、效率软件和开源项目。",
    action: "浏览工具",
    href: "/tools",
    mark: "T",
    gradient: "from-sky-400 via-cyan-400 to-blue-600",
  },
  {
    title: "实用文章",
    description: "面向小白整理工具选择、使用教程和避坑经验。",
    action: "阅读文章",
    href: "/articles",
    mark: "A",
    gradient: "from-violet-400 via-indigo-500 to-blue-700",
  },
  {
    title: "推荐工具",
    description: "发现可靠工具，可以提交给我们人工整理。",
    action: "提交工具",
    href: "/submit",
    mark: "S",
    gradient: "from-emerald-400 via-teal-500 to-cyan-700",
  },
  {
    title: "版权与反馈",
    description: "如涉及版权、授权或权益问题，可提交反馈。",
    action: "查看说明",
    href: "/copyright",
    mark: "C",
    gradient: "from-slate-500 via-sky-500 to-cyan-500",
  },
];

export function HomeCategorySection() {
  return (
    <section className="section-gradient-cyan py-8 sm:py-10 lg:py-12">
      <div className="page-shell">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-cyan-700">站点入口</p>
            <h2 className="mt-2 text-2xl font-black text-[#0f172a] sm:text-3xl">从这里开始浏览知享</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-500">
            首页只做清晰入口，把工具发现、文章阅读、投稿和权益反馈分开。
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {entryCards.map((card) => (
            <article key={card.title} className="glass-card soft-card-hover flex min-h-56 flex-col p-5">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-[16px] bg-gradient-to-br ${card.gradient} text-base font-black text-white shadow-sm`}
              >
                {card.mark}
              </div>
              <h3 className="mt-5 text-xl font-black text-[#0f172a]">{card.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">{card.description}</p>
              <Link
                href={card.href}
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[14px] border border-white/80 bg-white/68 px-4 text-sm font-bold text-[#0f172a] shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
              >
                {card.action}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
