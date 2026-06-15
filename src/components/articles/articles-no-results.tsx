type ArticlesNoResultsProps = {
  onClear: () => void;
};

export function ArticlesNoResults({ onClear }: ArticlesNoResultsProps) {
  return (
    <div className="articles-empty">
      <p className="articles-empty-title">没有找到匹配的文章</p>
      <p className="articles-empty-copy">
        可以尝试减少筛选条件，或者换一个关键词。当前列表仍然保留了所有文章的筛选入口。
      </p>
      <button type="button" onClick={onClear} className="articles-empty-button">
        清空筛选
      </button>
    </div>
  );
}
