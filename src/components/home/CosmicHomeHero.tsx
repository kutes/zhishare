import Link from "next/link";
import { heroHotwords } from "./cosmic-home-data";

const heroText = {
  eyebrow: "精选 AI 工具与资源导航",
  title: "探索 · 发现",
  kicker: "EXPLORE · DISCOVER",
  description:
    "汇聚全球优质 AI 工具、开发利器与设计资源，助你生产力倍增。",
  searchPlaceholder: "搜索工具、文章或关键词",
  hotLabel: "热门分类",
  searchButton: "搜索",
  primaryCta: "探索工具",
  secondaryCta: "浏览工具库",
};

function SearchIcon() {
  return (
    <svg className="hero-search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 20l-4.6-4.6M18 10.8a7.2 7.2 0 1 1-14.4 0 7.2 7.2 0 0 1 14.4 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function CosmicHomeHero() {
  return (
    <section className="zh-shell zh-hero zh-hero-anomaly">
      <div className="zh-hero-orb" aria-hidden="true" />
      <div className="zh-hero-field" aria-hidden="true" />

      <div className="zh-hero-stage-inner">
        <div className="zh-eyebrow">
          <span className="zh-eyebrow-dot" />
          {heroText.eyebrow}
        </div>

        <h1 className="zh-hero-title">{heroText.title}</h1>

        <p className="zh-hero-kicker">{heroText.kicker}</p>

        <p className="zh-hero-desc">{heroText.description}</p>

        <form
          action="/search"
          method="get"
          className="zh-search-bar zh-hero-search"
          role="search"
        >
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

        <div className="zh-categories" aria-label={heroText.hotLabel}>
          <span className="zh-categories-label">{heroText.hotLabel}</span>
          {heroHotwords.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className={index === 0 ? "zh-pill zh-pill-active" : "zh-pill"}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="zh-cta-row">
          <Link className="zh-btn zh-btn-primary zh-btn-lg" href="/tools">
            {heroText.primaryCta}
            <span aria-hidden="true">→</span>
          </Link>
          <Link className="zh-btn zh-btn-secondary zh-btn-lg" href="/tools">
            {heroText.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
