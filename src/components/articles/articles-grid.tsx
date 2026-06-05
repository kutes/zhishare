import { Fragment } from "react";
import { AdPlaceholder } from "@/components/common/AdPlaceholder";
import type { ArticleItem } from "./article-content";
import { ArticleCard } from "./article-card";
import { ArticlesNoResults } from "./articles-no-results";

type ArticlesGridProps = {
  articles: ArticleItem[];
  onClear: () => void;
};

export function ArticlesGrid({ articles, onClear }: ArticlesGridProps) {
  const adBlock = (
    <div className="col-span-full">
      <AdPlaceholder
        variant="banner"
        title="合作推广"
        description="这里可以展示赞助工具、精选服务或广告内容"
      />
    </div>
  );

  if (articles.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <div className="col-span-full">
          <ArticlesNoResults onClear={onClear} />
        </div>
        {adBlock}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, index) => (
        <Fragment key={article.id}>
          <ArticleCard article={article} />
          {index === 5 ? adBlock : null}
        </Fragment>
      ))}
      {articles.length < 6 ? adBlock : null}
    </div>
  );
}
