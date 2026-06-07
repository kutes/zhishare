import { unstable_noStore as noStore } from "next/cache";
import { HomePage } from "@/components/home/home-page";
import { getPublishedArticles } from "@/lib/db/articles";
import { getPublishedTools } from "@/lib/db/tools";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "KT严选｜知享",
  description: "人工筛选实用工具、优质文章和清晰可靠的使用经验，帮你更快找到值得尝试的数字工具。",
  path: "/",
  absoluteTitle: true,
});

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Page() {
  noStore();

  const [tools, articles] = await Promise.all([getPublishedTools(), getPublishedArticles()]);

  return <HomePage tools={tools} articles={articles} />;
}
