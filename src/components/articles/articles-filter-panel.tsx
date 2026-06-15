import type { ReactNode } from "react";

type ArticlesFilterPanelProps = {
  categories: string[];
  tags: string[];
  query: string;
  selectedCategory: string;
  selectedTag: string;
  resultCount: number;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onClear: () => void;
};

export function ArticlesFilterPanel({
  categories,
  tags,
  query,
  selectedCategory,
  selectedTag,
  resultCount,
  onQueryChange,
  onCategoryChange,
  onTagChange,
  onClear,
}: ArticlesFilterPanelProps) {
  return (
    <section className="articles-filter-panel">
      <div className="articles-filter-panel-head">
        <p className="articles-eyebrow">文章筛选器</p>
        <h2 className="articles-filter-title">按标题、摘要、分类和标签快速定位文章</h2>
        <p className="articles-filter-copy">
          保留当前搜索、分类和标签的组合筛选逻辑，只把外层视觉统一为更克制的暖黑编辑风。
        </p>
      </div>

      <div className="articles-search-shell">
        <label className="sr-only" htmlFor="articles-search">
          搜索文章
        </label>
        <div className="articles-search-row">
          <input
            id="articles-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="搜索标题、摘要、分类或标签"
            className="articles-search-input"
          />
          <button type="button" onClick={onClear} className="articles-clear-button">
            清空筛选
          </button>
        </div>
      </div>

      <div className="articles-filter-grid">
        <FilterGroup title="分类筛选">
          {categories.map((category) => (
            <FilterButton
              key={category}
              label={category}
              isActive={selectedCategory === category}
              onClick={() => onCategoryChange(category)}
            />
          ))}
        </FilterGroup>
        <FilterGroup title="标签筛选">
          {tags.map((tag) => (
            <FilterButton key={tag} label={tag} isActive={selectedTag === tag} onClick={() => onTagChange(tag)} />
          ))}
        </FilterGroup>
      </div>

      <div className="articles-result-bar">
        当前显示 <span>{resultCount}</span> 篇文章
      </div>
    </section>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="articles-filter-group">
      <p className="articles-filter-group-title">{title}</p>
      <div className="articles-filter-pills">{children}</div>
    </div>
  );
}

function FilterButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`articles-filter-pill${isActive ? " is-active" : ""}`}
    >
      {label}
    </button>
  );
}
