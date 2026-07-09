import Link from "next/link";
import type { PublishedArticle } from "@/types/article";
import type { ToolItem } from "@/types/tool";
import { ArticleCard } from "@/components/articles/article-card";
import { CompactToolCard } from "@/components/tools/CompactToolCard";
import { FeaturedToolCard } from "@/components/tools/FeaturedToolCard";
import { SectionHeader } from "./home-section-header";

type CosmicHomeSectionsProps = {
  tools: ToolItem[];
  articles: PublishedArticle[];
};

// Hero prefers a tool that already has a real photo cover so the largest slot
// shows a photograph; falls back to the first published tool.
function pickFeatured(tools: ToolItem[]) {
  const withPhoto = tools.find((tool) => (tool.cover_url ?? "").includes("/tool-covers/photos/"));
  const hero = withPhoto ?? tools[0];
  if (!hero) {
    return { hero: null, sideTools: [] as ToolItem[] };
  }
  const sideTools = tools.filter((tool) => tool.id !== hero.id).slice(0, 4);
  return { hero, sideTools };
}

const sectionCopy = {
  featured: {
    title: "精选工具与开源项目",
    description: "筛选更值得收藏的 AI 工具、开源项目、自托管方案和效率软件。",
  },
  latest: {
    title: "最新文章与实战指南",
    description: "工具选择、避坑经验和效率方案，帮助你在收藏前判断值不值得深入。",
  },
  more: {
    title: "更多收录工具",
    description: "继续浏览已整理的 AI 工具、开源项目、效率软件和在线工具。",
  },
};

export function CosmicHomeSections({ tools, articles }: CosmicHomeSectionsProps) {
  const { hero, sideTools } = pickFeatured(tools);
  const featuredIds = new Set([hero?.id, ...sideTools.map((tool) => tool.id)].filter(Boolean));
  const moreTools = tools.filter((tool) => !featuredIds.has(tool.id)).slice(0, 6);
  const latestArticles = articles.slice(0, 6);

  return (
    <section className="zh-shell zh-home-sections zh-content-flow">
      <div className="zh-home-zones">
        <div className="zh-zone-tools">
          {hero && (
            <div className="zh-section zh-section-featured">
              <SectionHeader
                eyebrow="Tools"
                title={sectionCopy.featured.title}
                description={sectionCopy.featured.description}
                href="/tools"
              />
              <div className="zh-feature-layout">
                <FeaturedToolCard tool={hero} />
                <div className="zh-feature-small-grid">
                  {sideTools.map((tool) => (
                    <CompactToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {moreTools.length > 0 && (
            <div className="zh-section zh-section-more zh-zone-more-tools">
              <SectionHeader
                eyebrow="More"
                title={sectionCopy.more.title}
                description={sectionCopy.more.description}
                href="/tools"
              />
              <div className="zh-grid zh-grid-3">
                {moreTools.map((tool) => (
                  <CompactToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          )}

          <div className="zh-zone-tools-mobile-cta">
            <Link className="zh-btn zh-btn-primary" href="/tools">
              进入工具库
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {latestArticles.length > 0 && (
          <div className="zh-zone-articles zh-section zh-section-latest">
            <SectionHeader
              eyebrow="Articles"
              title={sectionCopy.latest.title}
              description={sectionCopy.latest.description}
              href="/articles"
            />
            <div className="zh-home-article-grid">
              {latestArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
