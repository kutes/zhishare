type ToolsNoResultsProps = {
  onClear: () => void;
};

export function ToolsNoResults({ onClear }: ToolsNoResultsProps) {
  return (
    <div className="zh-tools-empty">
      <div className="zh-tools-empty-icon" aria-hidden="true">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
      <h3 className="zh-tools-empty-title">没有找到匹配工具</h3>
      <p className="zh-tools-empty-copy">
        可以尝试换一个关键词，例如：图片、视频、AI、笔记、编程。
      </p>
      <button type="button" onClick={onClear} className="zh-tools-button">
        清空筛选
      </button>
    </div>
  );
}
