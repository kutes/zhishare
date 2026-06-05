"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAdminStats, type AdminStats } from "@/lib/db/admin";
import {
  getSupabaseBrowserClient,
  getSupabaseUserWithTimeout,
  isSupabaseAuthSessionMissing,
} from "@/lib/supabase/client";

type AdminPageStatus = "checking" | "loading" | "ready" | "error" | "signingOut";

const emptyStats: AdminStats = {
  tools: 0,
  articles: 0,
  submissions: 0,
  reports: 0,
};

const menuItems = [
  { label: "后台首页", href: "/admin" },
  { label: "工具管理", href: "/admin/tools" },
  { label: "文章管理", href: "/admin/articles" },
  { label: "分类管理", href: "/admin/categories" },
  { label: "标签管理", href: "/admin/tags" },
  { label: "投稿管理", href: "/admin/submissions" },
  { label: "投诉管理", href: "/admin/reports" },
  { label: "返回前台", href: "/" },
];

const statCards: Array<{
  key: keyof AdminStats;
  label: string;
  description: string;
  accent: string;
}> = [
  {
    key: "tools",
    label: "工具数量",
    description: "当前数据库中的工具内容",
    accent: "from-sky-500 to-cyan-400",
  },
  {
    key: "articles",
    label: "文章数量",
    description: "当前数据库中的文章内容",
    accent: "from-indigo-500 to-sky-400",
  },
  {
    key: "submissions",
    label: "投稿数量",
    description: "用户提交的工具推荐",
    accent: "from-teal-500 to-emerald-400",
  },
  {
    key: "reports",
    label: "投诉数量",
    description: "版权与权益反馈记录",
    accent: "from-violet-500 to-indigo-400",
  },
];

export default function AdminHomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<AdminPageStatus>("checking");
  const [stats, setStats] = useState<AdminStats>(emptyStats);
  const [user, setUser] = useState<User | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let mounted = true;
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      router.replace("/admin/login?next=admin");
      return;
    }

    const client = supabase;

    async function verifyUserAndLoadStats() {
      try {
        const { data, error } = await getSupabaseUserWithTimeout(client);

        if (!mounted) {
          return;
        }

        if (error && !isSupabaseAuthSessionMissing(error)) {
          console.error("[Admin] getUser", error);
          router.replace("/admin/login?next=admin");
          return;
        }

        if (error || !data.user) {
          router.replace("/admin/login?next=admin");
          return;
        }

        setUser(data.user);
        setStatus("loading");

        const nextStats = await getAdminStats();

        if (!mounted) {
          return;
        }

        setStats(nextStats);
        setNotice("");
        setStatus("ready");
      } catch (error) {
        console.error("[Admin] verifyUserAndLoadStats", error);

        if (mounted) {
          router.replace("/admin/login?next=admin");
        }
      }
    }

    verifyUserAndLoadStats();

    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
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
      console.error("[Admin] signOut", error);
      setNotice("退出登录失败，请稍后重试。");
      setStatus("ready");
      return;
    }

    router.replace("/admin/login");
  }

  if (status === "checking") {
    return (
      <main className="min-h-screen overflow-hidden bg-[#f8fbff] text-ink">
        <section className="section-gradient-soft min-h-screen">
          <div className="page-shell flex min-h-screen items-center justify-center py-10">
            <div className="glass-card-strong w-full max-w-lg p-6 text-center sm:p-8">
              <p className="text-sm font-bold text-sky-700">后台权限检查</p>
              <h1 className="mt-3 text-2xl font-black text-ink">正在验证登录状态</h1>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                正在通过 Supabase Auth 获取当前用户。验证完成前不会显示后台菜单、统计数据或管理内容。
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const isStatsLoading = status === "loading";

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fbff] text-ink">
      <section className="section-gradient-soft min-h-screen">
        <div className="page-shell py-5 sm:py-6 lg:py-8">
          <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
            <aside className="glass-card h-fit p-4 lg:sticky lg:top-5 lg:min-h-[calc(100vh-40px)]">
              <div className="rounded-3xl bg-ink px-5 py-5 text-white shadow-[0_22px_60px_rgba(15,23,42,0.18)]">
                <p className="text-xs font-bold text-sky-200">知享后台</p>
                <h1 className="mt-2 text-2xl font-black">管理中心</h1>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  先做最小可用后台，后续再逐步增加审核和内容管理。
                </p>
              </div>

              <nav className="mt-4 grid gap-2" aria-label="后台菜单">
                {menuItems.map((item) => {
                  const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

                  return (
                    <a
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
                      </span>
                    </a>
                  );
                })}
              </nav>
            </aside>

            <section className="grid gap-5">
              <header className="glass-card-strong flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <p className="text-sm font-bold text-sky-700">后台首页</p>
                  <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">数据概览</h2>
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

              {isStatsLoading ? (
                <section className="glass-card p-6 text-sm font-semibold leading-7 text-slate-600">
                  正在读取后台统计...
                </section>
              ) : null}

              {notice ? (
                <section className="rounded-3xl border border-amber-200 bg-amber-50/80 p-5 text-sm font-semibold leading-7 text-amber-800 shadow-sm">
                  {notice}
                </section>
              ) : null}

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="后台统计">
                {statCards.map((card) => (
                  <article key={card.key} className="glass-card soft-card-hover p-5">
                    <div className={`h-1.5 w-16 rounded-full bg-gradient-to-r ${card.accent}`} />
                    <p className="mt-5 text-sm font-bold text-slate-500">{card.label}</p>
                    <strong className="mt-3 block text-4xl font-black tracking-tight text-ink">
                      {isStatsLoading ? "..." : stats[card.key].toLocaleString("zh-CN")}
                    </strong>
                    <p className="mt-3 text-sm leading-6 text-slate-500">{card.description}</p>
                  </article>
                ))}
              </section>

              <section className="glass-card p-6 sm:p-7">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-bold text-sky-700">当前阶段</p>
                    <h3 className="mt-2 text-2xl font-black text-ink">只做登录和概览，不做复杂管理</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                      本页用于确认后台入口、登录保护和基础统计读取。工具发布、文章编辑、投稿审核和投诉处理会在后续小步骤中逐步补上。
                    </p>
                  </div>
                  <div className="grid gap-3 text-sm font-semibold text-slate-600 sm:grid-cols-3 lg:min-w-[360px]">
                    {["邮箱密码登录", "基础统计", "手机端可用"].map((item) => (
                      <span
                        key={item}
                        className="rounded-2xl border border-white/75 bg-white/65 px-4 py-3 text-center shadow-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
