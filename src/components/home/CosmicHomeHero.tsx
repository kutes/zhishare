import Link from "next/link";
import { heroHotwords } from "./cosmic-home-data";

const heroDescription =
  "汇聚全球优质 AI 工具、开发利器与设计资源，助你生产力倍增。";

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
    <section className="zh-shell zh-hero">
      <div className="zh-eyebrow">
        <span className="zh-eyebrow-dot" />
        精选 AI 工具与资源导航
      </div>

      <h1 className="zh-hero-title">探索 · 发现</h1>

      <p className="zh-hero-kicker">EXPLORE · DISCOVER</p>

      <p className="zh-hero-desc">{heroDescription}</p>

      <form action="/search" method="get" className="zh-search-bar" role="search">
        <SearchIcon />
        <input
          className="zh-search-input"
          name="q"
          type="search"
          placeholder="搜索工具、文章或关键词"
          aria-label="搜索工具、文章或关键词"
          autoComplete="off"
        />
        <button className="zh-btn zh-btn-primary" type="submit">
          搜索
        </button>
      </form>

      <div className="zh-categories" aria-label="热门分类">
        <span className="zh-categories-label">热门分类</span>
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
          探索工具
          <span aria-hidden="true">→</span>
        </Link>
        <Link className="zh-btn zh-btn-secondary zh-btn-lg" href="/tools">
          浏览工具库
        </Link>
      </div>
    </section>
  );
}
