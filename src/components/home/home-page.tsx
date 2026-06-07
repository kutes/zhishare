import { SiteFooter } from "@/components/site-footer";
import type { PublishedArticle } from "@/types/article";
import type { ToolItem } from "@/types/tool";
import { HomeCategorySection } from "./home-category-section";
import { HomeFeaturedTools } from "./home-featured-tools";
import { HomeHeader } from "./home-header";
import { HomeHero } from "./home-hero";
import { HomeLatestArticles } from "./home-latest-articles";
import { HomeSearchSection } from "./home-search-section";
import { HomeSponsorBanner } from "./home-sponsor-banner";
import { homeShellClassName, pickFeaturedTools } from "./home-visual-utils";

type HomePageProps = {
  tools: ToolItem[];
  articles: PublishedArticle[];
};

const trustItems = [
  { title: "来源清晰", mark: "01", description: "优先保留官网、项目主页和可信说明。" },
  { title: "功能明确", mark: "02", description: "先讲清能解决什么具体问题。" },
  { title: "风险提醒", mark: "03", description: "价格、隐私、授权等信息会单独提示。" },
  { title: "人工整理", mark: "04", description: "投稿内容先审核，再决定是否发布。" },
];

export function HomePage({ tools, articles }: HomePageProps) {
  const previewTools = pickFeaturedTools(tools, 3);
  const previewArticles = articles.slice(0, 3);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fbff] text-[#0f172a]">
      <HomeHeader />
      <main className="bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_34%,#f7fbf6_70%,#eef8ff_100%)]">
        <HomeHero tools={tools} toolCount={tools.length} articleCount={articles.length} />
        <HomeSearchSection />
        <HomeCategorySection />
        <HomeFeaturedTools tools={previewTools} />
        <HomeLatestArticles articles={previewArticles} />
        <TrustSection />
        <section className="py-5 sm:py-6 lg:py-7">
          <div className={homeShellClassName}>
            <HomeSponsorBanner />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function TrustSection() {
  return (
    <section className="relative py-4 sm:py-5 lg:py-6">
      <div className={homeShellClassName}>
        <div className="relative overflow-hidden rounded-[26px] border border-[#0f172a]/[0.10] bg-white/88 p-4 shadow-[6px_6px_0_rgba(147,197,253,0.12)] sm:p-5">
          <div className="pointer-events-none absolute -right-8 top-5 h-20 w-36 rotate-6 rounded-[26px] bg-[#e0f2fe]/70" />
          <div className="pointer-events-none absolute left-8 top-0 h-4 w-24 -translate-y-1/2 -rotate-2 rounded-[6px] bg-[#fde68a]" />
          <div className="relative grid gap-3 lg:grid-cols-[0.9fr_1.4fr] lg:items-center">
            <div>
              <p className="text-xs font-black text-[#34a987]">收录原则</p>
              <h2 className="mt-1 text-2xl font-black leading-tight text-[#0f172a] sm:text-3xl">内容先可信，再发布</h2>
              <p className="mt-2 text-sm leading-7 text-[#64748b]">
                知享优先整理来源清晰、功能明确、适合中文用户理解的工具和知识内容。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {trustItems.map((item) => (
                <article
                  key={item.title}
                  className="relative min-h-28 rounded-[18px] border border-[#0f172a]/[0.08] bg-[#f8fbff] p-3 shadow-[3px_3px_0_rgba(15,23,42,0.04)]"
                >
                  <span className="inline-flex h-7 w-7 -rotate-3 items-center justify-center rounded-[10px] border border-[#5ecfb1]/50 bg-[#f7fbf6] text-[11px] font-black text-[#34a987]">
                    {item.mark}
                  </span>
                  <h3 className="mt-2.5 text-sm font-black text-[#0f172a]">{item.title}</h3>
                  <p className="mt-1 text-xs font-semibold leading-5 text-[#64748b]">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
