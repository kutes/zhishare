import Link from "next/link";
import { SearchIcon } from "./home-search-icon";

export type HeroQuickTool = {
  label: string;
  slug: string;
};

type CosmicHomeHeroProps = {
  quickTools?: HeroQuickTool[];
};

const heroText = {
  title: "发现好工具，少走弯路",
  tagline: ["人工整理", "来源清晰", "优先官网", "不收录破解盗版"],
  searchPlaceholder: "搜索工具、文章或关键词",
  searchButton: "搜索",
  quickLabel: "大家在找",
};

export function CosmicHomeHero({ quickTools = [] }: CosmicHomeHeroProps) {
  return (
    <section className="zh-shell zh-hero zh-hero-slim">
      <div className="zh-hero-stage-inner">
        <h1 className="zh-hero-heading">{heroText.title}</h1>

        <p className="zh-hero-tagline">
          {heroText.tagline.map((item, index) => (
            <span key={item}>
              {index > 0 && <span className="zh-hero-tagline-dot" aria-hidden="true" />}
              {item}
            </span>
          ))}
        </p>

        <form action="/search" method="get" className="zh-search-bar zh-hero-search" role="search">
          <SearchIcon />
          <input
            className="zh-search-input"
            name="q"
            type="search"
            placeholder={heroText.searchPlaceholder}
            aria-label={heroText.searchPlaceholder}
            autoComplete="off"
          />
          <button className="zh-btn zh-btn-primary zh-hero-search-btn" type="submit">
            {heroText.searchButton}
          </button>
        </form>

        {quickTools.length > 0 && (
          <div className="zh-hero-quick" aria-label={heroText.quickLabel}>
            <span className="zh-hero-quick-label">{heroText.quickLabel}</span>
            {quickTools.map((tool) => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className="zh-quick-chip">
                {tool.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
