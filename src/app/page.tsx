import { unstable_noStore as noStore } from "next/cache";
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

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Page() {
  noStore();

  const [categories, tools, articles] = await Promise.all([
    getCategories(),
    getPublishedTools(),
    getPublishedArticles(),
  ]);

  return (
    <HomePage
      tools={tools}
      articles={articles}
      categoryCount={categories.length}
    />
  );
}
