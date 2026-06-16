type ArticlesHeroProps = {
  totalCount: number;
  filteredCount: number;
};

const heroTags = ["工具教程", "资源整理", "效率指南"];

const boardItems = [
  {
    title: "工具教程",
    description: "快速上手常用工具",
  },
  {
    title: "资源整理",
    description: "按主题整理可读内容",
  },
  {
    title: "效率指南",
    description: "帮你少走弯路",
  },
];

export function ArticlesHero({ totalCount, filteredCount }: ArticlesHeroProps) {
  return (
    <section className="articles-hero">
      <div className="page-shell articles-hero-shell">
        <div className="articles-hero-copy">
          <p className="articles-eyebrow">ARTICLES</p>
          <h1 className="articles-hero-title">文章</h1>
          <p className="articles-hero-desc">工具教程、资源整理与效率指南。</p>

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
              <p className="articles-hero-panel-kicker">阅读索引</p>
              <p className="articles-hero-panel-title">按主题继续整理</p>
            </div>

            <span className="articles-hero-count">{totalCount} 篇</span>
          </div>

          <p className="articles-hero-panel-note">当前可读 {filteredCount} 篇。</p>

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
