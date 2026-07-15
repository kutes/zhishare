type ToolsFilterPanelProps = {
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

const allOption = "全部";

export function ToolsFilterPanel({
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
}: ToolsFilterPanelProps) {
  const hasActiveFilters = query.trim().length > 0 || selectedCategory !== allOption || selectedTag !== allOption;

  return (
    <div className="zh-tools-filter-panel">
      <div className="zh-tools-filter-top">
        <div>
          <p className="zh-tools-eyebrow">FILTERS</p>
          <h2 className="zh-tools-section-title">搜索与筛选</h2>
        </div>

        <div className="zh-tools-filter-actions">
          {hasActiveFilters && (
            <button type="button" onClick={onClear} className="zh-tools-clear">
              清空筛选
            </button>
          )}
          <div className="zh-tools-count">{resultCount} items</div>
        </div>
      </div>

      <div className="zh-tools-search-shell">
        <span className="zh-tools-search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          id="tools-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="搜索工具名称、用途或关键词，例如：写作、视频、编程、图片"
          className="zh-tools-search-input"
        />
      </div>

      <div className="zh-tools-filter-stack">
        <div className="zh-tools-filter-row zh-tools-filter-row-category">
          <span className="zh-tools-filter-label">分类</span>
          <div className="zh-tools-chip-scroll">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={selectedCategory === category ? "zh-tools-filter-chip zh-tools-filter-chip-active" : "zh-tools-filter-chip"}
              >
                {category || "未命名"}
              </button>
            ))}
          </div>
        </div>

        {tags.length > 1 && (
          <div className="zh-tools-filter-row zh-tools-filter-row-tag">
            <span className="zh-tools-filter-label">标签</span>
            <div className="zh-tools-chip-scroll">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagChange(tag)}
                  className={selectedTag === tag ? "zh-tools-filter-chip zh-tools-filter-chip-active" : "zh-tools-filter-chip"}
                >
                  {tag || "未命名"}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
