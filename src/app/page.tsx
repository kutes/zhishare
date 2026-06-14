import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { CosmicHomeHero } from "@/components/home/CosmicHomeHero";
import { CosmicHomeSections } from "@/components/home/CosmicHomeSections";
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

const navItems = [
  { label: "首页", href: "/" },
  { label: "工具库", href: "/tools" },
  { label: "文章", href: "/articles" },
  { label: "投稿", href: "/submit" },
  { label: "版权", href: "/copyright" },
];

function HomeNav() {
  return (
    <header className="zh-shell zh-nav">
      <Link prefetch={false} href="/" className="zh-logo" aria-label="返回首页">
        <span className="zh-logo-mark">知</span>
        <span className="zh-logo-text">
          <span className="zh-logo-title">知享</span>
          <span className="zh-logo-sub">ZhiShare</span>
        </span>
      </Link>

      <nav className="zh-nav-links" aria-label="首页导航">
        {navItems.map((item) => (
          <Link
            prefetch={false}
            key={item.href}
            href={item.href}
            className={item.href === "/" ? "zh-nav-link zh-nav-link-active" : "zh-nav-link"}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="zh-nav-actions">
        <Link prefetch={false} href="/search" className="zh-icon-btn" aria-label="搜索">
          <span aria-hidden="true">⌕</span>
        </Link>
        <Link prefetch={false} href="/tools" className="zh-btn zh-btn-primary">
          开始探索
        </Link>
      </div>
    </header>
  );
}

function HomeFooter() {
  return (
    <footer className="zh-footer">
      <div className="zh-shell zh-footer-inner">
        <div>
          <Link prefetch={false} href="/" className="zh-logo" aria-label="返回首页">
            <span className="zh-logo-mark">知</span>
            <span className="zh-logo-text">
              <span className="zh-logo-title">知享</span>
              <span className="zh-logo-sub">ZhiShare</span>
            </span>
          </Link>
          <p>发现工具、分享知识、提升效率，一切都从清晰的内容入口开始。</p>
        </div>

        <div className="zh-footer-links">
          {navItems.slice(1).map((item) => (
            <Link prefetch={false} key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default async function Page() {
  noStore();

  await Promise.all([getPublishedTools(), getPublishedArticles()]);

  return (
    <div className="public-cosmic-page warm-home-page">
      <HomeNav />
      <main className="zh-home-main">
        <CosmicHomeHero />
        <CosmicHomeSections />
      </main>
      <HomeFooter />
    </div>
  );
}
