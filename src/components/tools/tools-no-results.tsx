type ToolsNoResultsProps = {
  onClear: () => void;
};

export function ToolsNoResults({ onClear }: ToolsNoResultsProps) {
  return (
    <div className="glass-card border-dashed p-8 text-center sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
        <svg
          className="h-6 w-6 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
      <p className="mt-4 text-lg font-black text-[#0f172a]">没有找到匹配的工具</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        可以尝试减少筛选条件或换一个关键词。
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-5 inline-flex h-11 items-center rounded-[14px] bg-[#0f172a] px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-lg"
      >
        清空筛选条件
      </button>
    </div>
  );
}
