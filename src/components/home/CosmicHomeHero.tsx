import { SearchIcon } from "./home-search-icon";

const heroText = {
  eyebrow: "工具与知识发现站",
  searchPlaceholder: "搜索工具、文章或关键词",
  searchButton: "搜索",
};

export function CosmicHomeHero() {
  return (
    <section className="zh-shell zh-hero zh-hero-slim">
      <div className="zh-hero-stage-inner">
        <div className="zh-eyebrow">
          <span className="zh-eyebrow-dot" />
          {heroText.eyebrow}
        </div>

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
          <button className="zh-btn zh-btn-primary" type="submit">
            {heroText.searchButton}
          </button>
        </form>
      </div>
    </section>
  );
}
