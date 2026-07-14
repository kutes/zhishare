"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  getSupabaseBrowserClient,
  getSupabaseUserWithTimeout,
  isSupabaseAuthSessionMissing,
} from "@/lib/supabase/client";

type AdminShellStatus = "checking" | "ready" | "signingOut";

const menuItems = [
  { label: "后台首页", href: "/admin", pending: false },
  { label: "工具管理", href: "/admin/tools", pending: false },
  { label: "文章管理", href: "/admin/articles", pending: false },
  { label: "分类管理", href: "/admin/categories", pending: false },
  { label: "标签管理", href: "/admin/tags", pending: false },
  { label: "投稿管理", href: "/admin/submissions", pending: false },
  { label: "投诉管理", href: "/admin/reports", pending: false },
  { label: "返回前台", href: "/", pending: false },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [status, setStatus] = useState<AdminShellStatus>("checking");
  const [user, setUser] = useState<User | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let mounted = true;
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      router.replace("/admin/login?next=admin");
      return;
    }

    getSupabaseUserWithTimeout(supabase)
      .then(({ data, error }) => {
        if (!mounted) {
          return;
        }

        if (error && !isSupabaseAuthSessionMissing(error)) {
          console.error("[AdminShell] getUser", error);
          router.replace("/admin/login?next=admin");
          return;
        }

        if (error || !data.user) {
          router.replace("/admin/login?next=admin");
          return;
        }

        setUser(data.user);
        setStatus("ready");
      })
      .catch((error) => {
        console.error("[AdminShell] getUser rejected", error);

        if (!mounted) {
          return;
        }

        router.replace("/admin/login?next=admin");
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/admin/login?next=admin");
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [router]);

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      router.replace("/admin/login");
      return;
    }

    setStatus("signingOut");
    setNotice("");

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("[AdminShell] signOut", error);
      setNotice("退出登录失败，请稍后重试。");
      setStatus("ready");
      return;
    }

    router.replace("/admin/login");
  }

  if (status === "checking") {
    return (
      <main className="admin-theme min-h-screen overflow-hidden bg-[#faf6f0] text-ink">
        <section className="section-gradient-soft min-h-screen">
          <div className="page-shell flex min-h-screen items-center justify-center py-10">
            <div className="glass-card-strong w-full max-w-lg p-6 text-center sm:p-8">
              <p className="text-sm font-bold text-sky-700">后台权限检查</p>
              <h1 className="mt-3 text-2xl font-black text-ink">正在验证登录状态</h1>
              <p className="mt-4 text-sm leading-7 text-slate-600">验证完成后再显示后台菜单和管理内容。</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fbff] text-ink">
      <section className="section-gradient-soft min-h-screen">
        <div className="page-shell py-5 sm:py-6 lg:py-8">
          <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
            <aside className="glass-card h-fit p-4 lg:sticky lg:top-5 lg:min-h-[calc(100vh-40px)]">
              <div className="rounded-3xl bg-ink px-5 py-5 text-white shadow-[0_22px_60px_rgba(15,23,42,0.18)]">
                <p className="text-xs font-bold text-sky-200">知享后台</p>
                <h1 className="mt-2 text-2xl font-black">管理中心</h1>
                <p className="mt-3 text-sm leading-6 text-slate-300">先保持后台简单清晰，再逐步补全内容管理。</p>
              </div>

              <nav className="mt-4 grid gap-2" aria-label="后台菜单">
                {menuItems.map((item) => {
                  const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
                        isActive
                          ? "bg-sky-50 text-sky-700 shadow-sm"
                          : "text-slate-600 hover:bg-white/70 hover:text-ink"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="flex items-center justify-between gap-3">
                        {item.label}
                        {item.pending ? (
                          <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-bold text-slate-400">
                            待开放
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </aside>

            <section className="grid min-w-0 gap-5">
              <header className="glass-card-strong flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <p className="text-sm font-bold text-sky-700">后台工作台</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {user?.email ? `当前登录：${user.email}` : "已通过登录校验"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={status === "signingOut"}
                  className="min-h-11 rounded-2xl border border-white/75 bg-white/70 px-5 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {status === "signingOut" ? "退出中..." : "退出登录"}
                </button>
              </header>

              {notice ? (
                <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-5 text-sm font-semibold leading-7 text-amber-800 shadow-sm">
                  {notice}
                </div>
              ) : null}

              {children}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
