import Link from "next/link";
import { heroHotwords } from "./cosmic-home-data";

const heroDescription =
  "汇聚全球优质 AI 工具、开发利器与设计资源，助你生产力倍增。";

const heroMetrics = [
  { value: "86+", label: "AI 工具" },
  { value: "64+", label: "开源项目" },
  { value: "92+", label: "实战指南" },
];

const heroRows = [
  {
    title: "热门搜索",
    description: "ChatGPT · DeepSeek · AI Agent",
  },
  {
    title: "内容方向",
    description: "工具评测 · 配置教程 · 效率清单",
  },
  {
    title: "广告合作",
    description: "首页横幅 · 分类推荐 · 资源位",
  },
];

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
    <section className="zh-shell zh-hero zh-hero-balanced">
      <div className="zh-hero-main">
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
      </div>

      <aside className="zh-hero-panel" aria-label="资源发现面板">
        <p className="zh-hero-panel-eyebrow">TODAY&apos;S SELECTION</p>
        <h2 className="zh-hero-panel-title">从工具库开始发现</h2>
        <p className="zh-hero-panel-desc">
          按场景筛选 AI 工具、开源项目、效率软件与实战教程。
        </p>

        <div className="zh-hero-metric-grid" aria-label="资源概览">
          {heroMetrics.map((metric) => (
            <div className="zh-hero-metric" key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>

        <div className="zh-hero-panel-list">
          {heroRows.map((row) => (
            <div className="zh-hero-panel-row" key={row.title}>
              <strong>{row.title}</strong>
              <span>{row.description}</span>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}
