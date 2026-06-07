import Link from "next/link";
import type { PublishedArticle } from "@/types/article";
import { getArticleHref, getArticleMeta, getArticleSummary, getArticleTitle } from "./home-visual-utils";

type HomeArticleCardProps = {
  article: PublishedArticle;
};

function ArticleDoodle({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 52 44" fill="none" aria-hidden="true">
      <path
        d="M12 8H36C39 8 41 10 41 13V34C41 36 39 38 36 38H12C9 38 7 36 7 34V13C7 10 9 8 12 8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M15 18H32M15 25H35M15 32H27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M39 5L42 12L49 14L42 17L39 24L36 17L29 14L36 12L39 5Z"
        stroke="#facc15"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MobileArticleItem({ article }: HomeArticleCardProps) {
  const title = getArticleTitle(article);
  const summary = getArticleSummary(article);
  const meta = getArticleMeta(article);

  return (
    <article className="group relative flex h-full min-h-[96px] items-center gap-3 overflow-hidden rounded-[22px] border border-[#0f172a]/[0.08] bg-white/90 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_10px_18px_rgba(15,23,42,0.08)] md:hidden">
      <div className="flex h-12 w-12 shrink-0 rotate-[-2deg] items-center justify-center rounded-[16px] border border-[#facc15]/40 bg-[#fffdf4] text-[#facc15] shadow-[2px_2px_0_rgba(250,204,21,0.10)]">
        <ArticleDoodle className="h-7 w-7" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-[#94a3b8]">
          <span>{meta.date}</span>
          <span>·</span>
          <span>{meta.category}</span>
        </div>

        <h3 className="mt-0.5 line-clamp-1 text-sm font-black tracking-[-0.03em] text-[#0f172a]">
          {title}
        </h3>

        <p className="mt-0.5 line-clamp-1 text-xs leading-5 text-[#64748b]">
          {summary}
        </p>
      </div>

      <Link
        href={getArticleHref(article)}
        className="inline-flex h-8 shrink-0 items-center justify-center rounded-[14px] border border-[#0f172a]/[0.10] bg-[#0f172a] px-3 text-xs font-black text-white shadow-[0_8px_16px_rgba(15,23,42,0.12)] transition hover:bg-[#111827]"
      >
        阅读
      </Link>
    </article>
  );
}

function DesktopArticleCard({ article }: HomeArticleCardProps) {
  const title = getArticleTitle(article);
  const summary = getArticleSummary(article);
  const meta = getArticleMeta(article);

  return (
    <Link href={getArticleHref(article)} className="group hidden h-full md:block">
      <article className="relative flex h-full min-h-52 flex-col overflow-hidden rounded-[24px] border border-[#0f172a]/[0.10] bg-[#fffdf5] p-4 shadow-[6px_6px_0_rgba(250,204,21,0.14)] transition group-hover:-translate-y-1 group-hover:shadow-[8px_8px_0_rgba(250,204,21,0.18)]">
        <div className="pointer-events-none absolute left-6 top-0 h-5 w-20 -translate-y-1/2 -rotate-2 rounded-[5px] bg-[#fde68a]/90" />
        <div className="pointer-events-none absolute -right-8 top-4 h-16 w-28 rotate-6 rounded-[22px] bg-white/56" />
        <ArticleDoodle className="absolute right-5 top-5 h-10 w-12 text-[#93c5fd]" />

        <div className="relative flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full border border-[#5ecfb1]/70 bg-white px-3 py-1 text-[#34a987]">{meta.category}</span>
          <span className="text-[#64748b]">{meta.date}</span>
        </div>

        <h3 className="relative mt-5 line-clamp-2 text-lg font-black leading-7 text-[#0f172a]">{title}</h3>
        <p className="relative mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[#64748b]">{summary}</p>

        <span className="relative mt-5 inline-flex min-h-11 items-center justify-center rounded-[16px] border border-[#0f172a]/[0.10] bg-white px-4 text-sm font-black text-[#0f172a] transition group-hover:border-[#facc15] group-hover:bg-[#fffbeb]">
          阅读全文
        </span>
      </article>
    </Link>
  );
}

export function HomeArticleCard({ article }: HomeArticleCardProps) {
  return (
    <>
      <MobileArticleItem article={article} />
      <DesktopArticleCard article={article} />
    </>
  );
}
