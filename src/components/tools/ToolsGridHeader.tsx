type ToolsGridHeaderProps = {
  resultCount: number;
  totalCount: number;
};

export function ToolsGridHeader({ resultCount, totalCount }: ToolsGridHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-cyan-700">筛选结果</p>
        <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">先读介绍，再进入详情判断</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          每张卡片只展示关键判断信息，官网访问入口统一放到详情页。
        </p>
      </div>
      <div className="glass-card px-5 py-4">
        <div className="flex items-center gap-3 text-sm font-bold text-cyan-900">
          <span className="h-2 w-2 rounded-full bg-[#0ea5e9] shadow-[0_0_14px_rgba(14,165,233,0.55)]" />
          <span>
            当前显示 {resultCount} / {totalCount}
          </span>
        </div>
      </div>
    </div>
  );
}
