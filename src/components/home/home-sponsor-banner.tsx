import Link from "next/link";

const sellingPoints = ["精准用户", "内容场景", "长期曝光"];

export function HomeSponsorBanner() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-[#eef8ff] via-[#f8fbff] to-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute right-[-10%] top-[-40%] h-56 w-56 rounded-full bg-sky-200/32 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-30%] left-[-8%] h-48 w-48 rounded-full bg-cyan-100/32 blur-3xl" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <span className="inline-flex rounded-full border border-sky-200 bg-sky-50/80 px-3 py-1 text-xs font-bold text-sky-700">
            合作推广
          </span>
          <h2 className="mt-4 text-2xl font-black leading-tight text-[#0f172a] sm:text-3xl">
            让优质产品被真正需要的人看到
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            适合工具、软件、SaaS 服务、开源项目和效率产品展示。
          </p>
          <Link
            href="/submit"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-[14px] bg-[#0f172a] px-6 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-800 hover:shadow-lg"
          >
            了解合作
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:max-w-md">
          {sellingPoints.map((point, index) => (
            <div
              key={point}
              className="flex items-center gap-3 rounded-[18px] border border-white/80 bg-white/60 p-3.5 shadow-inner backdrop-blur sm:flex-col sm:items-start sm:gap-2"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#2563eb] to-[#0ea5e9] text-xs font-black text-white">
                0{index + 1}
              </span>
              <p className="text-sm font-bold text-[#0f172a]">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
