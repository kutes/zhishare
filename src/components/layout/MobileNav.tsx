"use client";

import Link from "next/link";
import { useState } from "react";

type NavItem = {
  label: string;
  href: string;
};

type MobileNavProps = {
  navItems: NavItem[];
  actionItems: NavItem[];
  pathname: string;
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNav({ navItems, actionItems, pathname }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const allItems = [...navItems, ...actionItems];

  return (
    <div className="relative lg:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/75 bg-white/70 px-4 text-sm font-semibold text-ink shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
      >
        {isOpen ? "关闭" : "菜单"}
      </button>

      {isOpen ? (
        <div
          id="mobile-navigation"
          className="glass-card absolute right-0 top-14 z-50 w-[min(21rem,calc(100vw-2rem))] p-3 shadow-[0_28px_90px_rgba(15,23,42,0.16)]"
        >
          <nav className="grid gap-2" aria-label="移动端导航">
            {allItems.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={[
                    "flex min-h-11 items-center justify-between rounded-2xl px-4 text-sm font-semibold transition",
                    active
                      ? "bg-ink text-white shadow-sm"
                      : "bg-white/55 text-slate-600 hover:bg-white hover:text-ink",
                  ].join(" ")}
                >
                  <span>{item.label}</span>
                  <span className={active ? "text-white/70" : "text-slate-300"}>/</span>
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
