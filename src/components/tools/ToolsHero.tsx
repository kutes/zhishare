type ToolsHeroProps = {
  totalCount: number;
};

export function ToolsHero({ totalCount }: ToolsHeroProps) {
  return (
    <section className="zh-tools-hero">
      <div className="zh-tools-hero-glow" aria-hidden="true" />
      <div className="zh-tools-hero-line" aria-hidden="true" />

      <div className="page-shell zh-tools-shell zh-tools-hero-shell">
        <p className="zh-tools-hero-kicker">
          <span className="zh-tools-hero-kicker-dot" aria-hidden="true" />
          Tools Library · 工具库
        </p>

        <div className="zh-tools-hero-row">
          <h1 className="zh-tools-title">工具库</h1>
          <span className="zh-tools-hero-divider" aria-hidden="true" />
          <p className="zh-tools-lead">荟萃 AI 工具、开源项目、效率软件与实用资源。</p>
          <span className="zh-tools-hero-count">共 {totalCount} 项</span>
        </div>
      </div>
    </section>
  );
}
