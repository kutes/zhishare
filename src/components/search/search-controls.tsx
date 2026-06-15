export type SearchMode = "all" | "tools" | "articles";

type SearchControlsProps = {
  query: string;
  mode: SearchMode;
  totalCount: number;
  hasQuery: boolean;
  onQueryChange: (query: string) => void;
  onModeChange: (mode: SearchMode) => void;
  onKeywordClick: (keyword: string) => void;
  onClear: () => void;
};

const hotKeywords = ["AI 写作", "在线工具", "开源", "PDF", "图片处理", "自媒体", "效率软件"];

const filters: Array<{ label: string; value: SearchMode }> = [
  { label: "全部", value: "all" },
  { label: "只看工具", value: "tools" },
  { label: "只看文章", value: "articles" },
];

export function SearchControls({
  query,
  mode,
  totalCount,
  hasQuery,
  onQueryChange,
  onModeChange,
  onKeywordClick,
  onClear,
}: SearchControlsProps) {
  return (
    <section className="search-controls-shell" aria-label="搜索与筛选">
      <form
        className="search-controls-form"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <label className="search-controls-field">
          <span className="sr-only">搜索关键词</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="搜索工具、文章、分类或标签"
            className="search-controls-input"
          />
        </label>

        <button type="submit" className="search-controls-button search-controls-button-primary">
          开始搜索
        </button>

        <button type="button" onClick={onClear} className="search-controls-button search-controls-button-ghost">
          清空
        </button>
      </form>

      <div className="search-controls-hotwords">
        {hotKeywords.map((keyword) => (
          <button
            key={keyword}
            type="button"
            onClick={() => onKeywordClick(keyword)}
            className="search-controls-hotword"
          >
            {keyword}
          </button>
        ))}
      </div>

      <div className="search-controls-footer">
        <div className="search-controls-filter-row" role="tablist" aria-label="搜索模式">
          {filters.map((filter) => {
            const active = mode === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => onModeChange(filter.value)}
                className={[
                  "search-controls-filter-chip",
                  active ? "is-active" : "",
                ].join(" ")}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <p className="search-controls-summary">
          {hasQuery ? `当前找到 ${totalCount} 条内容` : `推荐 ${totalCount} 条起点内容`}
        </p>
      </div>
    </section>
  );
}
