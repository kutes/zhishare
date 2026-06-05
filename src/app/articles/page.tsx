import { ArticlesPage } from "@/components/articles/articles-page";
import { getPublishedArticles } from "@/lib/db/articles";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "文章与教程",
  description: "阅读围绕 AI 工具、在线工具、开源项目和效率软件整理的使用教程、避坑经验和效率技巧。",
  path: "/articles",
});

export default async function Page() {
  const articles = await getPublishedArticles();

  return <ArticlesPage articles={articles} />;
}
