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
    <section className="glass-card-strong liquid-border p-4 sm:p-6 lg:p-7">
      <div className="mb-6">
        <p className="text-sm font-semibold text-indigo-700">文章筛选器</p>
        <h2 className="mt-2 text-xl font-black text-ink sm:text-2xl">按主题快速找到文章</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">搜索标题、摘要、分类和标签，快速定位合适的教程或技巧。</p>
      </div>

      <div className="rounded-[24px] border border-white/75 bg-white/52 p-3 shadow-inner sm:p-4">
        <label className="sr-only" htmlFor="articles-search">
          搜索文章
        </label>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            id="articles-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="搜索文章标题、摘要、分类或标签"
            className="h-16 w-full rounded-[22px] border border-white/90 bg-white/82 px-5 text-base font-semibold text-ink shadow-inner outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100 sm:h-[4.5rem]"
          />
          <button
            type="button"
            onClick={onClear}
            className="min-h-14 rounded-[18px] border border-white/80 bg-white/72 px-6 text-sm font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-lg sm:min-h-[4.5rem]"
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
            <FilterButton key={tag} label={tag} isActive={selectedTag === tag} onClick={() => onTagChange(tag)} />
          ))}
        </FilterGroup>
      </div>

      <div className="mt-6 rounded-[20px] border border-indigo-100/80 bg-indigo-50/70 px-4 py-3 text-sm font-semibold text-slate-600">
        当前显示 <span className="mx-1 text-ink">{resultCount}</span> 篇文章
      </div>
    </section>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[24px] border border-white/75 bg-white/50 p-4 shadow-inner">
      <p className="text-sm font-bold text-ink">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-10 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
        isActive
          ? "border-transparent bg-gradient-to-r from-[#6366f1] via-[#0ea5e9] to-[#14b8a6] text-white shadow-[0_12px_28px_rgba(99,102,241,0.24)]"
          : "border-white/80 bg-white/72 text-slate-600 shadow-sm hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
