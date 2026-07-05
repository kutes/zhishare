import Link from "next/link";
import { heroHotwords } from "./cosmic-home-data";

const heroText = {
  eyebrow: "工具与知识发现站",
  title: "发现好工具，少走弯路",
  kicker: "CURATED TOOLS & KNOWLEDGE",
  description:
    "人工整理的 AI 工具、在线工具、效率软件与开源项目：来源清晰、优先官网、不收录破解盗版。",
  searchPlaceholder: "搜索工具、文章或关键词",
  hotLabel: "热门分类",
  searchButton: "搜索",
  primaryCta: "浏览工具库",
  secondaryCta: "阅读文章",
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
          <Link className="zh-btn zh-btn-secondary zh-btn-lg" href="/articles">
            {heroText.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
