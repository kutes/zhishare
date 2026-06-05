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
    <section className="glass-card-strong p-5 sm:p-7" aria-label="搜索与筛选">
      <form
        className="grid gap-4 lg:grid-cols-[1fr_auto_auto]"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <label className="block">
          <span className="sr-only">搜索关键词</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="搜索工具、文章、分类或标签"
            className="min-h-14 w-full rounded-[22px] border border-white/80 bg-white/72 px-5 text-base font-semibold text-ink shadow-inner outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100 sm:min-h-16"
          />
        </label>
        <button
          type="submit"
          className="min-h-12 rounded-2xl bg-ink px-6 py-3 text-sm font-bold text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_24px_60px_rgba(15,23,42,0.24)] sm:min-h-14"
        >
          开始搜索
        </button>
        <button
          type="button"
          onClick={onClear}
          className="min-h-12 rounded-2xl border border-white/80 bg-white/65 px-5 py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:text-ink hover:shadow-md sm:min-h-14"
        >
          清空
        </button>
      </form>

      <div className="mt-5 flex flex-wrap gap-2">
        {hotKeywords.map((keyword) => (
          <button
            key={keyword}
            type="button"
            onClick={() => onKeywordClick(keyword)}
            className="min-h-10 rounded-full border border-sky-100 bg-white/62 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50/80 hover:text-sky-800"
          >
            {keyword}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-white/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const active = mode === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => onModeChange(filter.value)}
                className={[
                  "min-h-10 rounded-full px-4 py-2 text-sm font-bold transition",
                  active
                    ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-[0_12px_30px_rgba(14,165,233,0.24)]"
                    : "border border-white/80 bg-white/62 text-slate-600 shadow-sm hover:-translate-y-0.5 hover:bg-white hover:text-ink",
                ].join(" ")}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <p className="w-fit rounded-full border border-white/80 bg-white/62 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
          {hasQuery ? `当前找到 ${totalCount} 条结果` : `推荐 ${totalCount} 条内容`}
        </p>
      </div>
    </section>
  );
}
