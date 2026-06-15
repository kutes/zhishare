"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "首页", href: "/" },
  { label: "工具库", href: "/tools" },
  { label: "文章", href: "/articles" },
  { label: "投稿", href: "/submit" },
  { label: "版权投诉", href: "/copyright" },
];

const actionItems = [
  { label: "搜索", href: "/search" },
  { label: "推荐工具", href: "/submit" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="zh-site-header">
      <div className="zh-site-header-shell">
        <Link href="/" className="zh-site-brand" onClick={() => setMobileOpen(false)}>
          <span className="zh-site-brand-mark">知</span>
          <span className="zh-site-brand-text">
            <span className="zh-site-brand-name">知享</span>
            <span className="zh-site-brand-sub">工具与知识发现站</span>
          </span>
        </Link>

        <nav className="zh-site-nav" aria-label="主导航">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`zh-site-nav-link${active ? " zh-site-nav-link-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="zh-site-actions">
          <Link
            href={actionItems[0].href}
            className={`zh-site-action${isActivePath(pathname, actionItems[0].href) ? " zh-site-action-active" : ""}`}
          >
            {actionItems[0].label}
          </Link>
          <Link href={actionItems[1].href} className="zh-site-action zh-site-action-primary">
            {actionItems[1].label}
          </Link>

          <button
            type="button"
            className="zh-site-mobile-toggle"
            aria-expanded={mobileOpen}
            aria-controls="zh-site-mobile-panel"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? "收起" : "菜单"}
          </button>
        </div>
      </div>

      <div id="zh-site-mobile-panel" className={`zh-site-mobile-panel${mobileOpen ? " is-open" : ""}`}>
        <div className="zh-site-mobile-shell">
          <nav className="zh-site-mobile-nav" aria-label="移动端主导航">
            {navItems.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`zh-site-mobile-link${active ? " zh-site-nav-link-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="zh-site-mobile-actions">
            {actionItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`zh-site-mobile-action${index === 1 ? " zh-site-action-primary" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
