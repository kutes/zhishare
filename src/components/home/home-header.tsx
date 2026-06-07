import Link from "next/link";
import { homeShellClassName } from "./home-visual-utils";

const navItems = [
  { label: "首页", href: "/" },
  { label: "工具库", href: "/tools" },
  { label: "文章", href: "/articles" },
  { label: "投稿", href: "/submit" },
  { label: "版权投诉", href: "/copyright" },
];

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#0f172a]/[0.06] bg-white/88 backdrop-blur-xl">
      <div className={`${homeShellClassName} flex min-h-14 items-center justify-between gap-3 py-2`}>
        <Link href="/" className="group flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 -rotate-3 items-center justify-center rounded-[12px] border border-[#0f172a]/10 bg-[#0f172a] text-sm font-black text-white shadow-[3px_3px_0_rgba(118,185,255,0.22)] transition group-hover:-translate-y-0.5">
            知
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-black text-[#0f172a]">知享</span>
            <span className="hidden truncate text-xs font-semibold text-[#64748b] sm:block">工具与知识发现站</span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 rounded-full border border-[#0f172a]/[0.08] bg-white px-1.5 py-1 text-sm font-bold text-[#475569] shadow-[0_8px_28px_rgba(15,23,42,0.05)] lg:flex"
          aria-label="首页导航"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-full px-3.5 py-1.5 transition hover:-translate-y-0.5 hover:bg-[#eef8ff] hover:text-[#0f172a]",
                item.href === "/" ? "bg-[#0f172a] text-white shadow-sm" : "",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/search"
            className="inline-flex min-h-10 items-center justify-center rounded-[14px] border border-[#0f172a]/[0.08] bg-white px-4 text-sm font-bold text-[#0f172a] shadow-[3px_3px_0_rgba(118,185,255,0.12)] transition hover:-translate-y-0.5 hover:bg-[#eef8ff]"
          >
            搜索
          </Link>
          <Link
            href="/submit"
            className="inline-flex min-h-10 items-center justify-center rounded-[14px] border border-[#0f172a] bg-[#0f172a] px-4 text-sm font-bold text-white shadow-[3px_3px_0_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5"
          >
            推荐工具
          </Link>
        </div>

        <details className="group relative md:hidden">
          <summary className="list-none rounded-[14px] border border-[#0f172a]/[0.08] bg-white px-4 py-2 text-sm font-black text-[#0f172a] shadow-[3px_3px_0_rgba(118,185,255,0.12)]">
            菜单
          </summary>
          <div className="absolute right-0 top-12 w-44 rounded-[14px] border border-[#0f172a]/[0.08] bg-white p-2 shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
            {navItems.concat([{ label: "搜索", href: "/search" }]).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-[10px] px-3 py-2 text-sm font-bold text-[#475569] hover:bg-[#eef8ff] hover:text-[#0f172a]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
