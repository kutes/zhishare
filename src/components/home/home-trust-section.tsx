import { homeShellClassName } from "./home-visual-utils";

const principles = [
  {
    title: "来源清晰",
    description: "优先提供官网、项目主页或官方文档链接。",
    color: "bg-[#eef8ff]",
    mark: "01",
  },
  {
    title: "功能明确",
    description: "先说明工具解决什么问题，再推荐使用场景。",
    color: "bg-[#f7fbf6]",
    mark: "02",
  },
  {
    title: "风险提醒",
    description: "涉及账号、隐私、版权或付费内容时，会尽量提示注意事项。",
    color: "bg-[#fffbeb]",
    mark: "03",
  },
  {
    title: "人工整理",
    description: "不做自动搬运，避免垃圾信息和低质量内容。",
    color: "bg-white",
    mark: "04",
  },
];

export function HomeTrustSection() {
  return (
    <section className="relative py-7 sm:py-8 lg:py-9">
      <div className={homeShellClassName}>
        <div className="max-w-3xl">
          <p className="text-xs font-black text-[#34a987]">收录原则</p>
          <h2 className="mt-1 text-2xl font-black text-[#0f172a] sm:text-3xl">内容先可信，再发布</h2>
          <p className="mt-3 text-sm leading-7 text-[#64748b] sm:text-base">
            知享优先整理来源清晰、功能明确、适合中文用户理解的工具和知识内容。投稿内容会先进入人工审核，再决定是否发布。
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((item) => (
            <article
              key={item.title}
              className={`relative overflow-hidden rounded-[8px] border border-[#0f172a]/12 ${item.color} p-4 shadow-[4px_4px_0_rgba(15,23,42,0.05)]`}
            >
              <span className="inline-flex h-8 min-w-10 items-center justify-center rounded-[6px] border border-[#0f172a]/10 bg-white px-2 text-xs font-black text-[#34a987]">
                {item.mark}
              </span>
              <h3 className="mt-3 text-base font-black text-[#0f172a]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#64748b]">{item.description}</p>
              <svg className="absolute bottom-3 right-3 h-9 w-9 text-[#93c5fd]/70" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <path d="M9 25C14 17 22 28 31 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M28 14H31V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
