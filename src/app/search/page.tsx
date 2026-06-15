import { SearchPage } from "@/components/search/search-page";
import { getPublishedArticles } from "@/lib/db/articles";
import { getPublishedTools } from "@/lib/db/tools";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "搜索",
  description: "搜索工具、文章、分类和标签，快速找到适合你的实用内容。",
  path: "/search",
});

type SearchPageRouteProps = {
  searchParams?: Promise<{
    q?: string | string[];
  }>;
};

export default async function Page({ searchParams }: SearchPageRouteProps) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params?.q) ? params?.q[0] : params?.q;
  const initialQuery = rawQuery?.trim() ?? "";
  const [tools, articles] = await Promise.all([getPublishedTools(), getPublishedArticles()]);

  return (
    <div className="search-warm-page">
      <SearchPage tools={tools} articles={articles} initialQuery={initialQuery} />
    </div>
  );
}
