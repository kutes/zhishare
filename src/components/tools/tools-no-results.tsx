type ToolsNoResultsProps = {
  onClear: () => void;
};

export function ToolsNoResults({ onClear }: ToolsNoResultsProps) {
  return (
    <div className="glass-card border-dashed p-6 text-center sm:p-8">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
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
      <p className="mt-4 text-lg font-black text-[#0f172a]">暂时没找到匹配工具</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        可以换个关键词试试，比如：图片、视频、AI、笔记、编程。
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-5 inline-flex h-10 items-center rounded-[14px] bg-[#0f172a] px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-lg"
      >
        清空筛选
      </button>
    </div>
  );
}
