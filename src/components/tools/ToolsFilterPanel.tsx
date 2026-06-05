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
  return (
    <section className="glass-card-strong liquid-border p-4 sm:p-6 lg:p-7">
      <div className="mb-6">
        <div>
          <p className="text-sm font-semibold text-sky-700">工具筛选器</p>
          <h2 className="mt-2 text-xl font-black text-ink sm:text-2xl">用关键词和标签快速缩小范围</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">搜索标题、简介、分类和标签，先找到值得进入详情页的工具。</p>
        </div>
      </div>

      <div className="rounded-[24px] border border-white/75 bg-white/52 p-3 shadow-inner sm:p-4">
        <label className="sr-only" htmlFor="tools-search">
          搜索工具
        </label>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <span className="pointer-events-none absolute left-5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#0ea5e9] shadow-[0_0_18px_rgba(14,165,233,0.55)]" />
            <input
              id="tools-search"
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="搜索工具标题、简介、分类或标签"
              className="h-16 w-full rounded-[22px] border border-white/90 bg-white/82 px-5 pl-12 text-base font-semibold text-ink shadow-inner outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100 sm:h-[4.5rem]"
            />
          </div>
          <button
            type="button"
            onClick={onClear}
            className="min-h-14 rounded-[18px] border border-white/80 bg-white/72 px-6 text-sm font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:shadow-lg sm:min-h-[4.5rem]"
          >
            清空筛选
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
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
            <FilterButton
              key={tag}
              label={tag}
              isActive={selectedTag === tag}
              onClick={() => onTagChange(tag)}
            />
          ))}
        </FilterGroup>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-[20px] border border-cyan-100/80 bg-cyan-50/70 px-4 py-3 text-sm font-semibold text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <span>
          当前显示 <span className="mx-1 text-ink">{resultCount}</span> 个工具
        </span>
        <span className="text-xs text-slate-400">搜索范围包含标题、简介、分类和标签</span>
      </div>
    </section>
  );
}

type FilterGroupProps = {
  title: string;
  children: React.ReactNode;
};

function FilterGroup({ title, children }: FilterGroupProps) {
  return (
    <div className="rounded-[24px] border border-white/75 bg-white/50 p-4 shadow-inner">
      <p className="text-sm font-bold text-ink">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

type FilterButtonProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

function FilterButton({ label, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-10 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
        isActive
          ? "border-transparent bg-gradient-to-r from-[#0ea5e9] via-[#14b8a6] to-[#6366f1] text-white shadow-[0_12px_28px_rgba(14,165,233,0.24)]"
          : "border-white/80 bg-white/72 text-slate-600 shadow-sm hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
