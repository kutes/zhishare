import { unstable_noStore as noStore } from "next/cache";
import { CosmicHomeHero } from "@/components/home/CosmicHomeHero";
import { CosmicHomeSections } from "@/components/home/CosmicHomeSections";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedArticles } from "@/lib/db/articles";
import { getPublishedTools } from "@/lib/db/tools";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "知享｜发现工具与资源",
  description: "发现实用工具、精选文章与高质量资源，继续保持内容门户结构，采用暖调编辑风格呈现。",
  path: "/",
  absoluteTitle: true,
});

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Page() {
  noStore();

  const [tools, articles] = await Promise.all([getPublishedTools(), getPublishedArticles()]);

  return (
    <div className="public-cosmic-page warm-home-page">
      <SiteHeader />
      <main className="zh-home-main">
        <CosmicHomeHero />
        <CosmicHomeSections tools={tools} articles={articles} />
      </main>
      <SiteFooter />
    </div>
  );
}
