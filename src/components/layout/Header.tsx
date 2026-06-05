"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNav } from "./MobileNav";

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

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60">
      <div className="page-shell flex min-h-16 items-center justify-between gap-4 py-3">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ink text-sm font-bold text-white shadow-[0_16px_40px_rgba(15,23,42,0.18)] transition group-hover:-translate-y-0.5">
            知
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-bold text-ink">知享</span>
            <span className="hidden truncate text-xs font-medium text-slate-500 sm:block">
              工具与知识发现站
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 rounded-full border border-white/75 bg-white/55 p-1 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur-xl lg:flex"
          aria-label="主导航"
        >
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-full px-4 py-2 transition hover:-translate-y-0.5",
                  active
                    ? "bg-ink text-white shadow-sm"
                    : "hover:bg-white hover:text-ink hover:shadow-sm",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/search"
            className={[
              "min-h-11 rounded-2xl border border-white/80 bg-white/65 px-4 py-2.5 text-sm font-semibold text-ink shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md",
              isActivePath(pathname, "/search") ? "bg-white text-cyan-700 ring-1 ring-cyan-200" : "",
            ].join(" ")}
          >
            搜索
          </Link>
          <Link
            href="/submit"
            className="min-h-11 rounded-2xl bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_20px_52px_rgba(15,23,42,0.22)]"
          >
            推荐工具
          </Link>
        </div>

        <MobileNav navItems={navItems} actionItems={actionItems} pathname={pathname} />
      </div>
    </header>
  );
}
