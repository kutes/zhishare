import { AdPlaceholder } from "@/components/common/AdPlaceholder";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { MockCategory } from "@/data/mock-tools";
import type { PublishedArticle } from "@/types/article";
import type { ToolItem } from "@/types/tool";
import { HomeCategorySection } from "./home-category-section";
import { HomeFeaturedTools } from "./home-featured-tools";
import { HomeHero } from "./home-hero";
import { HomeLatestArticles } from "./home-latest-articles";
import { HomeSearchSection, type HomeSearchItem } from "./home-search-section";

type HomePageProps = {
  categories: MockCategory[];
  tools: ToolItem[];
  articles: PublishedArticle[];
  toolSearchItems: HomeSearchItem[];
  articleSearchItems: HomeSearchItem[];
};

export function HomePage({ categories, tools, articles, toolSearchItems, articleSearchItems }: HomePageProps) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fbff]">
      <SiteHeader />
      <main>
        <HomeHero />
        <HomeSearchSection tools={toolSearchItems} articles={articleSearchItems} />
        <HomeCategorySection categories={categories} />
        <HomeFeaturedTools tools={tools} />
        <section className="section-gradient-soft py-10 sm:py-12">
          <div className="page-shell">
            <AdPlaceholder
              variant="banner"
              title="合作推广"
              description="此处可展示赞助工具、精选服务或广告内容"
            />
          </div>
        </section>
        <HomeLatestArticles articles={articles} />
      </main>
      <SiteFooter />
    </div>
  );
}
