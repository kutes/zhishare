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
  const hasActiveFilters = query.trim().length > 0 || selectedCategory !== "全部" || selectedTag !== "全部";

  return (
    <div className="glass-card-strong liquid-border relative overflow-hidden rounded-[24px] border border-white/75 bg-white/72 p-4 shadow-[0_18px_56px_rgba(15,23,42,0.07)] backdrop-blur-2xl sm:p-5">
      {/* Background glow */}
      <div className="pointer-events-none absolute right-[-6rem] top-[-6rem] h-40 w-40 rounded-full bg-sky-100/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-6rem] left-[-6rem] h-40 w-40 rounded-full bg-cyan-100/50 blur-3xl" />

      <div className="relative">
        {/* Search row */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[#0ea5e9] shadow-[0_0_16px_rgba(14,165,233,0.5)]" />
            <input
              id="tools-search"
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="搜索工具名称、功能、平台或关键词..."
              className="h-11 w-full rounded-[16px] border border-white/90 bg-white/80 pl-10 pr-4 text-sm font-semibold text-[#0f172a] shadow-[inset_0_2px_10px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100 sm:h-12 sm:text-base"
            />
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClear}
                className="inline-flex h-11 items-center rounded-[14px] border border-slate-200/70 bg-white/78 px-4 text-sm font-bold text-[#0f172a] shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:shadow-[0_12px_26px_rgba(14,165,233,0.12)] sm:h-12"
              >
                清空筛选
              </button>
            )}
            <div className="inline-flex h-11 items-center rounded-[14px] border border-sky-100 bg-sky-50/80 px-4 text-sm font-bold text-sky-700 sm:h-12">
              {resultCount} 个工具
            </div>
          </div>
        </div>

        {/* Filter chips rows */}
        <div className="mt-4 space-y-3">
          {/* Category chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs font-bold text-slate-400">分类</span>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`min-h-8 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  selectedCategory === category
                    ? "border-transparent bg-gradient-to-r from-[#2563eb] via-[#0ea5e9] to-[#67e8f9] text-white shadow-[0_10px_24px_rgba(14,165,233,0.25)]"
                    : "border-slate-200/70 bg-white/70 text-slate-600 shadow-sm hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-[#0f172a]"
                }`}
              >
                {category || "未命名"}
              </button>
            ))}
          </div>

          {/* Tag chips */}
          {tags.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-xs font-bold text-slate-400">标签</span>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagChange(tag)}
                  className={`min-h-8 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    selectedTag === tag
                      ? "border-transparent bg-gradient-to-r from-[#14b8a6] via-[#0ea5e9] to-[#6366f1] text-white shadow-[0_10px_24px_rgba(14,165,233,0.25)]"
                      : "border-slate-200/70 bg-white/70 text-slate-600 shadow-sm hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-[#0f172a]"
                  }`}
                >
                  {tag || "未命名"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
