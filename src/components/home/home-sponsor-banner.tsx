import Link from "next/link";

export function HomeSponsorBanner() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-[#0f172a]/[0.10] bg-[linear-gradient(135deg,#f7fbf6_0%,#eef8ff_62%,#ffffff_100%)] p-3 shadow-[8px_8px_0_rgba(94,207,177,0.13)] sm:p-4 lg:p-6">
      <div className="pointer-events-none absolute left-8 top-0 h-4 w-20 -translate-y-1/2 -rotate-3 rounded-[6px] bg-[#fde68a]" />
      <div className="pointer-events-none absolute right-8 top-7 hidden h-14 w-28 rotate-6 rounded-[22px] bg-white/48 md:block" />
      <PaperPlaneSketch className="pointer-events-none absolute left-5 top-8 hidden h-14 w-20 text-[#34a987] lg:block" />

      <div className="relative grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
        <div className="lg:pl-16">
          <span className="inline-flex -rotate-2 rounded-[14px] border border-[#0f172a]/[0.08] bg-white px-3 py-1 text-xs font-black text-[#34a987] shadow-[3px_3px_0_rgba(94,207,177,0.16)]">
            合作推广
          </span>
          <h2 className="mt-2.5 max-w-3xl text-xl font-black leading-tight text-[#0f172a] sm:text-2xl">
            与优秀产品一起，让更多人发现你的工具
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#64748b]">
            知享开放合作推广位，适合工具、软件、SaaS 服务、开源项目和效率产品展示。
          </p>
          <Link
            href="/submit"
            className="mt-3 inline-flex min-h-11 items-center justify-center rounded-[16px] border border-[#0f172a] bg-[#0f172a] px-6 text-sm font-black text-white shadow-[4px_4px_0_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:bg-[#1e293b]"
          >
            了解合作
          </Link>
        </div>

        <div className="hidden justify-self-end md:block">
          <SponsorSketch />
        </div>
      </div>
    </section>
  );
}

function PaperPlaneSketch({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 86 64" fill="none" aria-hidden="true">
      <path d="M9 31L75 9L57 55L43 37L29 49L34 34L9 31Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M34 34L75 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M8 52C18 59 29 59 40 53" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function SponsorSketch() {
  return (
    <svg className="h-32 w-48 text-[#34a987]" viewBox="0 0 224 164" fill="none" aria-hidden="true">
      <path d="M34 116H152C162 116 170 124 170 134V140H20V132C20 123 27 116 34 116Z" fill="#e8f8ef" stroke="currentColor" strokeWidth="3" />
      <rect x="58" y="46" width="106" height="70" rx="12" fill="white" stroke="currentColor" strokeWidth="3" />
      <path d="M76 68H118M76 84H142" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
      <path d="M91 102C103 92 117 108 130 97C137 91 145 93 151 98" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
      <circle cx="44" cy="64" r="14" fill="#eef8ff" stroke="currentColor" strokeWidth="3" />
      <path d="M37 84C45 77 54 78 62 85" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M181 27L185 38L196 42L185 46L181 57L177 46L166 42L177 38L181 27Z" stroke="#facc15" strokeWidth="3" strokeLinejoin="round" />
      <path d="M174 66C188 73 197 85 200 100M174 120C188 113 197 101 200 86" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
