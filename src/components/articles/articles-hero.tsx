type ArticlesHeroProps = {
  totalCount: number;
};

export function ArticlesHero({ totalCount }: ArticlesHeroProps) {
  return (
    <section className="articles-hero">
      <div className="page-shell articles-hero-shell">
        <p className="articles-hero-kicker">
          <span className="articles-hero-kicker-dot" aria-hidden="true" />
          Articles · 文章
        </p>

        <div className="articles-hero-row">
          <h1 className="articles-hero-title">文章</h1>
          <span className="articles-hero-divider" aria-hidden="true" />
          <p className="articles-hero-desc">工具教程、资源整理与效率指南。</p>
          <span className="articles-hero-count">共 {totalCount} 篇</span>
        </div>
      </div>
    </section>
  );
}
