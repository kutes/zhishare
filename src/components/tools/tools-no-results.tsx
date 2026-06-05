type ToolsNoResultsProps = {
  onClear: () => void;
};

export function ToolsNoResults({ onClear }: ToolsNoResultsProps) {
  return (
    <div className="glass-card border-dashed p-8 text-center sm:p-10">
      <p className="text-lg font-black text-ink">没有找到匹配的工具</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
        可以尝试减少筛选条件或换一个关键词。
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-5 min-h-11 rounded-[14px] bg-ink px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-lg"
      >
        清空筛选
      </button>
    </div>
  );
}
