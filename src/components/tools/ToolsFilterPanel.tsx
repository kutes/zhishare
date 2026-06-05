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
    <section className="glass-card-strong liquid-border relative overflow-hidden rounded-[32px] border border-white/75 bg-white/70 p-4 shadow-[0_28px_90px_rgba(15,23,42,0.09)] backdrop-blur-2xl sm:p-6 lg:p-7">
      <div className="pointer-events-none absolute right-[-6rem] top-[-7rem] h-56 w-56 rounded-full bg-sky-100/80 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-7rem] left-[-8rem] h-56 w-56 rounded-full bg-cyan-100/70 blur-3xl" />

      <div className="relative mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="inline-flex rounded-full border border-sky-100 bg-sky-50/70 px-3 py-1 text-xs font-bold text-sky-700">
            工具筛选器
          </p>
          <h2 className="mt-3 text-xl font-black leading-snug text-[#0f172a] sm:text-2xl">用关键词和标签快速缩小范围</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748b]">
            搜索标题、简介、分类或标签，找到最适合你的工具。
          </p>
        </div>
        <div className="inline-flex w-fit rounded-full border border-sky-100 bg-white/72 px-4 py-2 text-sm font-bold text-slate-600 shadow-sm backdrop-blur">
          当前显示：<span className="mx-1 text-[#0f172a]">{resultCount}</span> 个工具
        </div>
      </div>

      <div className="relative rounded-[28px] border border-white/80 bg-white/58 p-3 shadow-inner backdrop-blur-xl sm:p-4">
        <label className="sr-only" htmlFor="tools-search">
          搜索工具
        </label>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <span className="pointer-events-none absolute left-5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#0ea5e9] shadow-[0_0_20px_rgba(14,165,233,0.58)]" />
            <input
              id="tools-search"
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="搜索工具标题、简介、分类或标签"
              className="h-16 w-full rounded-[24px] border border-white/90 bg-white/86 px-5 pl-12 text-base font-semibold text-[#0f172a] shadow-[inset_0_2px_12px_rgba(15,23,42,0.05)] outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100 sm:h-[4.5rem]"
            />
          </div>
          <button
            type="button"
            onClick={onClear}
            className="min-h-14 rounded-[22px] border border-slate-200/70 bg-white/78 px-6 text-sm font-bold text-[#0f172a] shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:shadow-[0_18px_36px_rgba(14,165,233,0.13)] sm:min-h-[4.5rem]"
          >
            清空筛选
          </button>
        </div>
      </div>

      <div className="relative mt-6 grid gap-4 lg:grid-cols-2">
        <FilterGroup title="分类筛选" description="按工具类型快速浏览">
          {categories.map((category) => (
            <FilterButton
              key={category}
              label={category}
              isActive={selectedCategory === category}
              onClick={() => onCategoryChange(category)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="标签筛选" description="用细分标签缩小范围">
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

      <div className="relative mt-6 flex flex-col gap-3 rounded-[22px] border border-sky-100/80 bg-sky-50/70 px-4 py-3 text-sm font-semibold text-slate-600 shadow-inner sm:flex-row sm:items-center sm:justify-between">
        <span>
          当前显示：<span className="mx-1 text-[#0f172a]">{resultCount}</span> 个工具
        </span>
        <span className="text-xs text-slate-500">排序方式：最新优先</span>
      </div>
    </section>
  );
}

type FilterGroupProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function FilterGroup({ title, description, children }: FilterGroupProps) {
  return (
    <div className="rounded-[26px] border border-white/80 bg-white/54 p-4 shadow-inner backdrop-blur-xl">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold text-[#0f172a]">{title}</p>
        <p className="text-xs font-medium text-slate-500">{description}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

type FilterButtonProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

function FilterButton({ label, isActive, onClick }: FilterButtonProps) {
  const displayLabel = label || "未命名";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-10 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
        isActive
          ? "border-transparent bg-gradient-to-r from-[#2563eb] via-[#0ea5e9] to-[#67e8f9] text-white shadow-[0_14px_32px_rgba(14,165,233,0.28)]"
          : "border-slate-200/70 bg-white/72 text-slate-600 shadow-sm hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-[#0f172a] hover:shadow-[0_12px_26px_rgba(14,165,233,0.10)]"
      }`}
    >
      {displayLabel}
    </button>
  );
}
