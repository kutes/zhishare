type ToolsHeroProps = {
  totalCount: number;
  categoryCount: number;
  tagCount: number;
};

const highlights = ["warm editorial", "search first", "clear filters", "live index"];

export function ToolsHero({ totalCount, categoryCount, tagCount }: ToolsHeroProps) {
  return (
    <section className="zh-tools-hero">
      <div className="zh-tools-hero-glow" aria-hidden="true" />
      <div className="zh-tools-hero-line" aria-hidden="true" />

      <div className="page-shell zh-tools-shell zh-tools-hero-grid">
        <div className="zh-tools-hero-copy">
          <p className="zh-tools-eyebrow">TOOLS LIBRARY</p>
          <h1 className="zh-tools-title">工具库</h1>
          <p className="zh-tools-lead">
            荟萃 AI 工具、开源项目、效率软件与实用资源。先用搜索锁定意图，再通过分类与标签快速收窄结果。
          </p>

          <div className="zh-tools-chip-row">
            {highlights.map((item) => (
              <span key={item} className="zh-tools-chip">
                {item}
              </span>
            ))}
          </div>
        </div>

        <aside className="zh-tools-hero-panel">
          <div className="zh-tools-panel-top">
            <div>
              <p className="zh-tools-panel-label">LIVE INDEX</p>
              <h2 className="zh-tools-panel-title">资源发现面板</h2>
            </div>
            <span className="zh-tools-live-dot">
              <span aria-hidden="true" />
              实时
            </span>
          </div>

          <div className="zh-tools-stat-grid">
            <StatCard label="收录工具" value={totalCount} suffix="items" />
            <StatCard label="分类数量" value={categoryCount} suffix="groups" />
          </div>

          <div className="zh-tools-stat-row">
            <StatCard label="标签数量" value={tagCount} suffix="tags" compact />
          </div>

          <div className="zh-tools-hero-note">
            <span aria-hidden="true" />
            先看详情，再决定是否前往官网。
          </div>
        </aside>
      </div>
    </section>
  );
}

type StatCardProps = {
  label: string;
  value: number;
  suffix: string;
  compact?: boolean;
};

function StatCard({ label, value, suffix, compact = false }: StatCardProps) {
  return (
    <div className={compact ? "zh-tools-stat-card zh-tools-stat-card-compact" : "zh-tools-stat-card"}>
      <p className="zh-tools-stat-label">{label}</p>
      <p className="zh-tools-stat-value">
        <span>{value}</span>
        <span>{suffix}</span>
      </p>
    </div>
  );
}
