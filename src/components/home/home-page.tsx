import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { PublishedArticle } from "@/types/article";
import type { ToolItem } from "@/types/tool";
import { HomeCategorySection } from "./home-category-section";
import { HomeFeaturedTools } from "./home-featured-tools";
import { HomeHero } from "./home-hero";
import { HomeLatestArticles } from "./home-latest-articles";
import { HomeSearchSection } from "./home-search-section";
import { HomeSponsorBanner } from "./home-sponsor-banner";
import { HomeTrustSection } from "./home-trust-section";

type HomePageProps = {
  tools: ToolItem[];
  articles: PublishedArticle[];
  categoryCount: number;
};

export function HomePage({ tools, articles, categoryCount }: HomePageProps) {
  const previewTools = tools.slice(0, 3);
  const previewArticles = articles.slice(0, 3);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fbff]">
      <SiteHeader />
      <main>
        <HomeHero toolCount={tools.length} articleCount={articles.length} categoryCount={categoryCount} />
        <HomeSearchSection />
        <HomeCategorySection />
        <HomeFeaturedTools tools={previewTools} />
        <HomeLatestArticles articles={previewArticles} />
        <HomeTrustSection />
        <section className="section-gradient-soft py-8 sm:py-10 lg:py-12">
          <div className="page-shell">
            <HomeSponsorBanner />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
