const heroTags = ["工具教程", "效率方法", "AI 应用", "开源项目", "持续更新"];
const boardItems = [
  {
    title: "精选阅读",
    description: "围绕工具体验、实战方法和效率提升整理可直接上手的内容。",
  },
  {
    title: "分类阅读",
    description: "按主题、标签和热度梳理，让常用文章更容易被重新找到。",
  },
  {
    title: "持续更新",
    description: "保留内容流的节奏感，让首页和工具页之外仍然有稳定阅读入口。",
  },
];

type ArticlesHeroProps = {
  totalCount: number;
  filteredCount: number;
};

export function ArticlesHero({ totalCount, filteredCount }: ArticlesHeroProps) {
  return (
    <section className="articles-hero">
      <div className="page-shell articles-hero-shell">
        <div className="articles-hero-copy">
          <p className="articles-eyebrow">文章库</p>
          <h1 className="articles-hero-title">整理成可直接阅读的工具实战与效率指南</h1>
          <p className="articles-hero-lead">
            聚焦 AI 工具、在线效率、开源项目和实用技巧，把分散的经验整理成更容易筛选、回访和持续扩展的内容流。
          </p>

          <div className="articles-hero-tags">
            {heroTags.map((tag) => (
              <span key={tag} className="articles-hero-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <aside className="articles-hero-panel">
          <div className="articles-hero-panel-top">
            <div>
              <p className="articles-hero-panel-kicker">阅读面板</p>
              <p className="articles-hero-panel-title">按主题持续整理</p>
            </div>
            <span className="articles-hero-count">{totalCount} 篇</span>
          </div>

          <div className="articles-hero-stats">
            <div className="articles-hero-stat articles-hero-stat-accent">
              <p className="articles-hero-stat-label">当前筛选</p>
              <p className="articles-hero-stat-value">{filteredCount} 篇可读</p>
            </div>
            <div className="articles-hero-stat">
              <p className="articles-hero-stat-label">内容结构</p>
              <p className="articles-hero-stat-value">教程 · 评测 · 清单</p>
            </div>
            <div className="articles-hero-stat">
              <p className="articles-hero-stat-label">阅读节奏</p>
              <p className="articles-hero-stat-value">更适合收藏回看</p>
            </div>
          </div>

          <div className="articles-hero-boards">
            {boardItems.map((item) => (
              <article key={item.title} className="articles-hero-board">
                <p className="articles-hero-board-title">{item.title}</p>
                <p className="articles-hero-board-copy">{item.description}</p>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
