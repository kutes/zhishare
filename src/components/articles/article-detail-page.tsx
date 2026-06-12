import Link from "next/link";
import { AdPlaceholder } from "@/components/common/AdPlaceholder";
import { CopyrightNotice } from "@/components/common/CopyrightNotice";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { ArticleItem, ArticleSection } from "./article-content";

type ArticleDetailPageProps = {
  article: ArticleItem;
  relatedArticles: ArticleItem[];
};

export function ArticleDetailPage({ article, relatedArticles }: ArticleDetailPageProps) {
  const middleIndex = Math.max(1, Math.ceil(article.sections.length / 2));
  const firstSections = article.sections.slice(0, middleIndex);
  const lastSections = article.sections.slice(middleIndex);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fbff]">
      <SiteHeader />
      <main>
        <section className="section-gradient-violet relative overflow-hidden">
          <div className="page-shell py-9 sm:py-14 lg:py-20">
            <Link href="/articles" className="inline-flex text-sm font-bold text-indigo-700 transition hover:text-indigo-900">
              返回文章列表
            </Link>

            <article className="glass-card-strong liquid-border mt-5 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold sm:gap-2 sm:text-xs">
                <span className="rounded-full border border-indigo-200 bg-indigo-50/80 px-2.5 py-1 text-indigo-800 sm:px-3">
                  {article.category}
                </span>
                <span className="rounded-full border border-white/75 bg-white/60 px-2.5 py-1 text-slate-500 sm:px-3">
                  更新时间：{article.date}
                </span>
                <span className="rounded-full border border-white/75 bg-white/60 px-2.5 py-1 text-slate-500 sm:px-3">
                  {article.readTime}
                </span>
              </div>

              <h1 className="mt-4 max-w-4xl text-[28px] font-black leading-tight text-ink sm:text-5xl">{article.title}</h1>
              <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600 sm:text-lg sm:leading-8">{article.summary}</p>

              <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/80 bg-white/65 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm sm:text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </div>
          <div className="h-12 bg-gradient-to-b from-transparent to-[#f8fbff]" />
        </section>

        <section className="section-gradient-soft section-block">
          <div className="page-shell space-y-6 sm:space-y-8">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
              <article className="px-0 py-0 sm:glass-card sm:p-6 lg:p-7">
                <div className="mx-auto max-w-[44rem] space-y-8 sm:space-y-10">
                  {firstSections.map((section, index) => (
                    <ArticleContentSection key={`${section.title}-${index}`} section={section} />
                  ))}
                  <AdPlaceholder variant="inline" />
                  {lastSections.map((section, index) => (
                    <ArticleContentSection key={`${section.title}-${index + firstSections.length}`} section={section} />
                  ))}
                </div>
              </article>

              <aside className="hidden space-y-6 lg:sticky lg:top-24 lg:block">
                <AdPlaceholder variant="sidebar" />
              </aside>
            </div>

            <RelatedArticlesSection relatedArticles={relatedArticles} />
            <AdPlaceholder variant="banner" />
            <CopyrightNotice />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export function ArticleNotFoundPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fbff]">
      <SiteHeader />
      <main className="section-gradient-violet">
        <div className="page-shell flex min-h-[60vh] items-center py-16">
          <section className="glass-card-strong mx-auto max-w-2xl p-6 text-center sm:p-8">
            <p className="text-sm font-semibold text-indigo-700">文章不存在</p>
            <h1 className="mt-3 text-3xl font-black text-ink sm:text-4xl">没有找到这篇文章</h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600">你可以返回文章列表继续浏览。</p>
            <Link
              href="/articles"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-[14px] bg-ink px-6 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-800 hover:shadow-lg"
            >
              返回文章列表
            </Link>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function ArticleContentSection({ section }: { section: ArticleSection }) {
  if (section.type === "list") {
    return (
      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-[22px] font-bold leading-snug text-slate-950 sm:text-2xl">{section.title}</h2>
        <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
          {section.items.map((item, index) => (
            <div
              key={`${section.title}-item-${index}`}
              className="rounded-[18px] border border-white/75 bg-white/70 p-3.5 text-[15px] leading-7 text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-4"
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3 sm:space-y-4">
      <h2 className="text-[22px] font-bold leading-snug text-slate-950 sm:text-2xl">{section.title}</h2>
      <div className="space-y-4">
        {section.paragraphs.map((paragraph, index) => (
          <p key={`${section.title}-paragraph-${index}`} className="text-[16px] leading-8 text-slate-700 sm:text-[17px]">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

function RelatedArticlesSection({ relatedArticles }: { relatedArticles: ArticleItem[] }) {
  return (
    <section>
      <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
        <div>
          <p className="text-sm font-semibold text-indigo-700">相关推荐</p>
          <h2 className="mt-1.5 text-[22px] font-black text-ink sm:mt-2 sm:text-2xl">继续阅读同类文章</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-500">优先推荐同分类文章，方便继续深入了解。</p>
      </div>

      {relatedArticles.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {relatedArticles.map((relatedArticle) => (
            <article key={relatedArticle.id} className="glass-card soft-card-hover flex h-full flex-col p-4 sm:p-5">
              <span className="w-fit rounded-full border border-indigo-200 bg-indigo-50/80 px-2.5 py-1 text-[11px] font-bold text-indigo-800 sm:px-3 sm:text-xs">
                {relatedArticle.category}
              </span>
              <h3 className="mt-3 text-lg font-black leading-7 text-ink sm:mt-4 sm:text-xl">{relatedArticle.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{relatedArticle.summary}</p>
              <Link
                href={`/articles/${relatedArticle.slug}`}
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-[14px] bg-ink px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-800 hover:shadow-lg sm:mt-5"
              >
                阅读全文
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="glass-card p-4 text-sm leading-6 text-slate-500 sm:p-5">当前暂无同分类推荐，后续文章增加后会自动补充。</div>
      )}
    </section>
  );
}
