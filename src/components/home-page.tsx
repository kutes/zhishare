import { mockArticles } from "@/data/mock-articles";
import { mockCategories, mockTools } from "@/data/mock-tools";
import { AdPlaceholder } from "./common/AdPlaceholder";
import { CategoryGrid } from "./category-grid";
import { FeaturedTools } from "./featured-tools";
import { HeroSection } from "./hero-section";
import { LatestArticles } from "./latest-articles";
import { SearchPanel } from "./search-panel";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <SiteHeader />
      <main>
        <HeroSection />
        <SearchPanel />
        <CategoryGrid categories={mockCategories} />
        <FeaturedTools tools={mockTools} />
        <section className="section-gradient-blue px-4 py-10 sm:px-6 lg:px-8">
          <div className="page-shell">
            <AdPlaceholder
              variant="banner"
              title="合作推广"
              description="此处可展示赞助工具、精选服务或广告内容"
            />
          </div>
        </section>
        <LatestArticles articles={mockArticles} />
      </main>
      <SiteFooter />
    </div>
  );
}
