type ArticlesHeroProps = {
  totalCount: number;
};

export function ArticlesHero({ totalCount }: ArticlesHeroProps) {
  return (
    <section className="articles-hero">
      <div className="page-shell articles-hero-shell">
        <p className="articles-eyebrow">ARTICLES</p>
        <div className="articles-hero-row">
          <h1 className="articles-hero-title">文章</h1>
          <p className="articles-hero-desc">工具教程、资源整理与效率指南，共 {totalCount} 篇。</p>
        </div>
      </div>
    </section>
  );
}
