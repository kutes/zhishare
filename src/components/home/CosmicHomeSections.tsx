import {
  featuredResources,
  latestGuides,
  partnerAds,
  portalCategories,
  rankingGroups,
} from "./cosmic-home-data";
import { CategoryCard } from "./home-category-gateway";
import { FeaturedLargeCard, FeatureSmallCard } from "./home-featured-resources";
import { LatestGuideCard } from "./home-latest-guides";
import { PartnerAdCard } from "./home-partner-ads";
import { PromoBanner } from "./home-promo-banner";
import { RankingCard } from "./home-ranking-grid";
import { SectionHeader } from "./home-section-header";

const sectionCopy = {
  categories: {
    title: "资源分类入口",
    description:
      "先从场景进入，再选择具体工具。适合没有明确关键词时快速发现资源。",
  },
  partners: {
    title: "合作伙伴与推广位",
  },
  featured: {
    title: "精选工具与开源项目",
    description:
      "筛选更值得收藏的 AI 工具、开源项目、自托管方案和效率软件。",
  },
  latest: {
    title: "最新工具评测与实战指南",
    description:
      "持续更新近期发布的 AI 应用、开源项目、配置教程、使用避坑和效率方案。",
  },
  ranking: {
    title: "热门 AI 工具与开源项目",
    description:
      "按分类整理近期更受关注的工具、项目、效率软件和实用教程。",
  },
};

export function CosmicHomeSections() {
  const [heroFeature, ...sideFeatures] = featuredResources;

  return (
    <section className="zh-shell zh-home-sections zh-content-flow">
      <div className="zh-section zh-section-channels">
        <SectionHeader
          eyebrow="Categories"
          title={sectionCopy.categories.title}
          description={sectionCopy.categories.description}
        />
        <div className="zh-grid zh-grid-5">
          {portalCategories.map((item) => (
            <CategoryCard key={item.name} item={item} />
          ))}
        </div>
      </div>

      <div className="zh-section zh-section-partners">
        <SectionHeader eyebrow="Partners" title={sectionCopy.partners.title} />
        <div className="zh-grid zh-grid-4">
          {partnerAds.map((item) => (
            <PartnerAdCard key={item.title} item={item} />
          ))}
        </div>
      </div>

      <div className="zh-section zh-section-featured">
        <SectionHeader
          eyebrow="Featured"
          title={sectionCopy.featured.title}
          description={sectionCopy.featured.description}
          href="/tools"
        />
        <div className="zh-feature-layout">
          <FeaturedLargeCard item={heroFeature} />
          <div className="zh-feature-small-grid">
            {sideFeatures.map((item) => (
              <FeatureSmallCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </div>

      <PromoBanner />

      <div className="zh-section zh-section-latest">
        <SectionHeader
          eyebrow="Latest"
          title={sectionCopy.latest.title}
          description={sectionCopy.latest.description}
          href="/articles"
        />
        <div className="zh-list-grid">
          {latestGuides.map((item) => (
            <LatestGuideCard key={item.title} item={item} />
          ))}
        </div>
      </div>

      <div className="zh-section zh-section-ranking">
        <SectionHeader
          eyebrow="Ranking"
          title={sectionCopy.ranking.title}
          description={sectionCopy.ranking.description}
        />
        <div className="zh-grid zh-grid-4">
          {rankingGroups.map((group) => (
            <RankingCard key={group.title} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
}
