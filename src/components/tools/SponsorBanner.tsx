export function SponsorBanner() {
  const sellingPoints = [
    {
      emoji: "📈",
      label: "高质量流量",
      desc: "精准触达寻找工具的用户",
    },
    {
      emoji: "🏷️",
      label: "品牌曝光",
      desc: "在专业工具导航站展示",
    },
    {
      emoji: "🤝",
      label: "灵活合作",
      desc: "支持多种推广形式",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-[#f0f7ff] via-[#eef6ff] to-[#f8fbff] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-8 lg:p-10">
      {/* Background glow */}
      <div className="pointer-events-none absolute right-[-10%] top-[-40%] h-56 w-56 rounded-full bg-sky-200/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-30%] left-[-8%] h-48 w-48 rounded-full bg-cyan-100/30 blur-3xl" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: text CTA */}
        <div className="max-w-lg">
          <span className="inline-flex rounded-full border border-sky-200 bg-sky-50/80 px-3 py-1 text-xs font-bold text-sky-700">
            合作推广
          </span>
          <h2 className="mt-4 text-2xl font-black leading-tight text-[#0f172a] sm:text-3xl">
            在这里展示你的产品或服务
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            精准触达正在寻找工具、软件和效率方案的用户。
          </p>
          <a
            href="mailto:contact@zhishare.com"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-[14px] bg-[#0f172a] px-6 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-lg"
          >
            了解合作
          </a>
        </div>

        {/* Right: selling points */}
        <div className="grid gap-3 sm:grid-cols-3 lg:max-w-md">
          {sellingPoints.map((point) => (
            <div
              key={point.label}
              className="flex items-center gap-3 rounded-[18px] border border-white/80 bg-white/60 p-3.5 shadow-inner backdrop-blur sm:flex-col sm:items-start sm:gap-2"
            >
              <span className="text-xl sm:text-2xl" role="img" aria-hidden="true">
                {point.emoji}
              </span>
              <div>
                <p className="text-sm font-bold text-[#0f172a]">{point.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{point.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
