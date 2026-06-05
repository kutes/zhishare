import { HomePage } from "@/components/home/home-page";
import { getPublishedArticles } from "@/lib/db/articles";
import { getCategories } from "@/lib/db/categories";
import { getPublishedTools } from "@/lib/db/tools";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "知享｜发现值得信任的数字工具",
  description:
    "收录 AI 工具、在线工具、效率软件和开源项目。先看清用途、来源、价格和风险，再决定是否打开官网。",
  path: "/",
  absoluteTitle: true,
});

export default async function Page() {
  const [categories, tools, articles] = await Promise.all([
    getCategories(),
    getPublishedTools(),
    getPublishedArticles(),
  ]);

  const toolSearchItems = tools.map((tool) => ({
    slug: tool.slug,
    title: tool.name,
  }));
  const articleSearchItems = articles.map((article) => ({
    slug: article.slug,
    title: article.title,
  }));

  return (
    <HomePage
      categories={categories}
      tools={tools.slice(0, 6)}
      articles={articles.slice(0, 3)}
      toolSearchItems={toolSearchItems}
      articleSearchItems={articleSearchItems}
    />
  );
}
