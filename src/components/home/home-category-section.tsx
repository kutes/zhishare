import Link from "next/link";

type SceneCard = {
  title: string;
  description: string;
  href: string;
  tone: string;
  icon: "spark" | "window" | "check" | "code";
};

const sceneCards: SceneCard[] = [
  {
    title: "AI 工具",
    description: "智能创作，效率加倍",
    href: "/tools",
    tone: "bg-[#eaf6ff] border-[#93c5fd]/45 text-[#2563eb]",
    icon: "spark",
  },
  {
    title: "在线工具",
    description: "即开即用，无需安装",
    href: "/tools",
    tone: "bg-[#f3fbef] border-[#7dd3bc]/45 text-[#20a27f]",
    icon: "window",
  },
  {
    title: "效率软件",
    description: "提升效率，事半功倍",
    href: "/tools",
    tone: "bg-[#fff8db] border-[#facc15]/45 text-[#d69e00]",
    icon: "check",
  },
  {
    title: "开源项目",
    description: "开源共享，持续进化",
    href: "/tools",
    tone: "bg-[#f2efff] border-[#bfdbfe]/70 text-[#4f46e5]",
    icon: "code",
  },
];

function SceneIcon({ icon }: { icon: SceneCard["icon"] }) {
  if (icon === "spark") {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="h-9 w-9" aria-hidden="true">
        <path
          d="M22 5c2 10 8 16 19 18-11 2-17 8-19 20C20 31 14 25 4 23c10-2 16-8 18-18Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M38 5c1 5 4 8 8 9-4 1-7 4-8 9-1-5-4-8-8-9 4-1 7-4 8-9Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "window") {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="h-9 w-9" aria-hidden="true">
        <rect
          x="7"
          y="10"
          width="34"
          height="28"
          rx="7"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path d="M7 19h34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M15 15h.1M22 15h.1" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <path d="M15 27h18M15 32h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "check") {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="h-9 w-9" aria-hidden="true">
        <rect
          x="9"
          y="8"
          width="30"
          height="34"
          rx="7"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          d="M17 25l5 5 10-13"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M17 36h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" fill="none" className="h-9 w-9" aria-hidden="true">
      <path
        d="M18 15 8 24l10 9M30 15l10 9-10 9"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M27 10 21 38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function DoodleCorner() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-5 top-0 h-2 w-14 rotate-[-3deg] rounded-full bg-[#fde68a]"
    />
  );
}

export function HomeCategorySection() {
  return (
    <section className="relative px-5 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 inline-flex rounded-full border border-[#5ecfb1]/35 bg-white px-3 py-1 text-xs font-black text-[#20a27f] shadow-sm">
              场景分类
            </p>
            <h2 className="text-2xl font-black tracking-[-0.04em] text-[#0f172a] sm:text-3xl">
              按场景浏览
            </h2>
          </div>

          <p className="hidden max-w-md text-right text-sm font-medium leading-6 text-[#64748b] md:block">
            按用途快速进入工具库，先找到方向，再进入详情判断。
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {sceneCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
                className={`group relative min-h-[132px] overflow-hidden rounded-[24px] border-2 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)] sm:min-h-[140px] sm:p-4.5 ${card.tone}`}
            >
              <DoodleCorner />

              <div className="relative z-10">
                <div className="mb-4 inline-flex rounded-2xl bg-white/72 p-2 shadow-sm">
                  <SceneIcon icon={card.icon} />
                </div>

                <h3 className="text-base font-black tracking-[-0.03em] text-[#0f172a] sm:text-lg">
                  {card.title}
                </h3>

                <p className="mt-1 text-xs font-bold leading-5 text-[#475569] sm:text-sm">
                  {card.description}
                </p>

                <span className="mt-2.5 inline-flex text-xs font-black text-[#20a27f] transition group-hover:translate-x-1">
                  查看工具 →
                </span>
              </div>

              <div className="pointer-events-none absolute -right-7 -top-7 h-24 w-24 rounded-full bg-white/40" />
              <div className="pointer-events-none absolute -bottom-8 right-6 h-16 w-16 rounded-full border border-white/60" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
