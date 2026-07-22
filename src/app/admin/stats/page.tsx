"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminStatsDetail, type AdminStatsDetail } from "@/lib/db/admin";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type PageStatus = "loading" | "ready";

// Cloudflare dashboard root — from here: 选域名 → Analytics & Logs → Traffic.
// Root path avoids a placeholder deep-link that could 404 for a beginner.
const CLOUDFLARE_ANALYTICS_URL = "https://dash.cloudflare.com/";

type TrafficDay = { date: string; pageViews: number; requests: number; uniques: number };
type TrafficState =
  | { status: "loading" }
  | { status: "disconnected" }
  | { status: "error" }
  | { status: "connected"; windowDays: number; totals: { pageViews: number; requests: number; uniques: number }; days: TrafficDay[] };

export default function AdminStatsPage() {
  const [status, setStatus] = useState<PageStatus>("loading");
  const [detail, setDetail] = useState<AdminStatsDetail | null>(null);
  const [traffic, setTraffic] = useState<TrafficState>({ status: "loading" });

  useEffect(() => {
    let mounted = true;

    getAdminStatsDetail().then((result) => {
      if (!mounted) {
        return;
      }

      setDetail(result);
      setStatus("ready");
    });

    async function loadTraffic() {
      try {
        const supabase = getSupabaseBrowserClient();
        const accessToken = supabase ? (await supabase.auth.getSession()).data.session?.access_token : undefined;

        if (!accessToken) {
          if (mounted) setTraffic({ status: "error" });
          return;
        }

        const response = await fetch("/api/admin/traffic", {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
        });
        const data = await response.json();

        if (!mounted) return;

        if (data.connected === false) {
          setTraffic({ status: "disconnected" });
        } else if (data.connected && Array.isArray(data.days)) {
          setTraffic({ status: "connected", windowDays: data.windowDays, totals: data.totals, days: data.days });
        } else {
          setTraffic({ status: "error" });
        }
      } catch {
        if (mounted) setTraffic({ status: "error" });
      }
    }

    loadTraffic();

    return () => {
      mounted = false;
    };
  }, []);

  const maxDailyCount = detail
    ? Math.max(1, ...detail.recentDays.map((day) => day.tools + day.articles))
    : 1;

  return (
    <AdminShell>
      <section className="glass-card-strong p-5 sm:p-6">
        <p className="text-sm font-bold text-sky-700">数据统计</p>
        <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl">内容全景与健康度</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          全部数字实时读取数据库,统计口径:分布与趋势按全部内容(含草稿),健康度单列草稿与缺失项。
        </p>
      </section>

      {status === "loading" || !detail ? (
        <section className="glass-card p-6 text-sm font-semibold leading-7 text-slate-600">正在汇总统计数据...</section>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="内容总量">
            <StatCard
              label="工具"
              value={detail.tools.total}
              note={`已发布 ${detail.tools.published} · 草稿 ${detail.tools.draft}`}
            />
            <StatCard
              label="文章"
              value={detail.articles.total}
              note={`已发布 ${detail.articles.published} · 草稿 ${detail.articles.draft}`}
            />
            <StatCard label="分类" value={detail.categories} note={`标签 ${detail.tags} 个`} />
            <StatCard label="投稿 / 投诉" value={detail.submissions + detail.reports} note={`投稿 ${detail.submissions} · 投诉 ${detail.reports}`} />
          </section>

          <TrafficSection traffic={traffic} />

          <section className="glass-card p-5 sm:p-6" aria-label="内容健康度">
            <h2 className="text-xl font-black text-ink">内容健康度</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">这些是需要补的坑,数字降到 0 才算内容完整。</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <HealthCard label="没挂标签的工具" value={detail.tools.noTag} />
              <HealthCard label="没挂标签的文章" value={detail.articles.noTag} />
              <HealthCard label="缺封面的内容" value={detail.tools.noCover + detail.articles.noCover} />
              <HealthCard label="草稿待处理" value={detail.tools.draft + detail.articles.draft} />
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-2">
            <section className="glass-card p-5 sm:p-6" aria-label="工具分类分布">
              <h2 className="text-xl font-black text-ink">工具分类分布</h2>
              <BarList items={detail.toolsByCategory} />
            </section>

            <section className="glass-card p-5 sm:p-6" aria-label="文章分类分布">
              <h2 className="text-xl font-black text-ink">文章分类分布</h2>
              <BarList items={detail.articlesByCategory} />
            </section>
          </div>

          <section className="glass-card p-5 sm:p-6" aria-label="最近 14 天新增">
            <h2 className="text-xl font-black text-ink">最近 14 天新增</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">按内容创建日期统计,深色为工具,浅色为文章。</p>
            <div className="mt-5 flex items-end gap-1.5 sm:gap-2" style={{ height: "8.5rem" }}>
              {detail.recentDays.map((day) => {
                const total = day.tools + day.articles;
                const heightPct = (total / maxDailyCount) * 100;
                const toolPct = total > 0 ? (day.tools / total) * 100 : 0;

                return (
                  <div key={day.date} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                    <span className="text-[11px] font-bold text-slate-500">{total > 0 ? total : ""}</span>
                    <div
                      className="flex w-full max-w-8 flex-col justify-end overflow-hidden rounded-t-lg bg-[rgba(227,167,95,0.12)]"
                      style={{ height: `${Math.max(heightPct, total > 0 ? 8 : 2)}%` }}
                      title={`${day.date}:工具 ${day.tools},文章 ${day.articles}`}
                    >
                      <div className="w-full bg-[#edbd7e]" style={{ height: `${100 - toolPct}%` }} />
                      <div className="w-full bg-[#b06e22]" style={{ height: `${toolPct}%` }} />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">{day.date.slice(5)}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="glass-card p-5 sm:p-6" aria-label="标签使用情况">
            <h2 className="text-xl font-black text-ink">标签使用情况</h2>
            {detail.tagUsage.length === 0 ? (
              <p className="mt-3 text-sm leading-7 text-slate-600">还没有任何标签。</p>
            ) : (
              <div className="mt-4 grid gap-2">
                {detail.tagUsage.map((tag) => (
                  <div
                    key={tag.name}
                    className="flex items-center justify-between rounded-2xl border border-white/75 bg-white/65 px-4 py-3 text-sm shadow-sm"
                  >
                    <span className="font-bold text-ink">{tag.name}</span>
                    <span className="font-semibold text-slate-500">
                      工具 {tag.tools} · 文章 {tag.articles}
                      {tag.tools + tag.articles === 0 ? " · 未使用" : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </AdminShell>
  );
}

function TrafficSection({ traffic }: { traffic: TrafficState }) {
  return (
    <section className="glass-card p-5 sm:p-6" aria-label="流量分析">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-ink">流量分析</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            由 Cloudflare 边缘统计,真实访客数据,不依赖会被墙的脚本。站点无注册用户,统计口径为匿名访客。
          </p>
        </div>
        <a
          href={CLOUDFLARE_ANALYTICS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex min-h-10 shrink-0 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 transition hover:bg-sky-100 sm:mt-0"
        >
          打开 Cloudflare 看板 ↗
        </a>
      </div>

      {traffic.status === "loading" ? (
        <p className="mt-5 text-sm font-semibold text-slate-500">正在读取流量数据...</p>
      ) : traffic.status === "connected" ? (
        <>
          <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">
            最近 {traffic.windowDays} 天合计
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <StatCard label="页面浏览 PV" value={traffic.totals.pageViews} note={`最近 ${traffic.windowDays} 天`} />
            <StatCard label="独立访客 UV" value={traffic.totals.uniques} note="按 Cloudflare 去重" />
            <StatCard label="请求总数" value={traffic.totals.requests} note="含静态资源与接口" />
          </div>
          <div className="mt-5 flex items-end gap-1.5 sm:gap-2" style={{ height: "7rem" }}>
            {traffic.days.map((day) => {
              const max = Math.max(1, ...traffic.days.map((item) => item.pageViews));
              const heightPct = (day.pageViews / max) * 100;

              return (
                <div key={day.date} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                  <div
                    className="w-full max-w-8 rounded-t-lg bg-gradient-to-t from-[#b06e22] to-[#e3a75f]"
                    style={{ height: `${Math.max(heightPct, day.pageViews > 0 ? 6 : 2)}%` }}
                    title={`${day.date}:PV ${day.pageViews},UV ${day.uniques}`}
                  />
                  <span className="text-[10px] font-semibold text-slate-400">{day.date.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </>
      ) : traffic.status === "error" ? (
        <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm font-semibold leading-7 text-amber-800">
          流量数据读取失败,可先点右上角按钮到 Cloudflare 看板查看。
        </p>
      ) : (
        <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50/70 p-5">
          <p className="text-sm font-bold text-sky-800">尚未接入内嵌数据(不影响看板查看)</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            想把 PV/UV 数字直接显示在这里,需要一个 Cloudflare 只读 API Token。配好后本页会自动点亮真实数据,在此之前只显示这个提示,绝不放占位假数字。
          </p>
          <ol className="mt-3 grid gap-1.5 text-sm leading-7 text-slate-600">
            <li>1. Cloudflare 后台 → 个人资料 → API 令牌 → 创建令牌,权限选「区域 · Analytics · 读取」,范围限定 songkuntai.com。</li>
            <li>2. 在域名 Overview 页复制 Zone ID。</li>
            <li>3. 把这两个值配到 Vercel 环境变量:CLOUDFLARE_API_TOKEN、CLOUDFLARE_ZONE_ID(本地则写进 .env.local)。</li>
          </ol>
        </div>
      )}
    </section>
  );
}

function StatCard({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <article className="glass-card p-5">
      <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-[#e3a75f] to-[#edbd7e]" />
      <p className="mt-5 text-sm font-bold text-slate-500">{label}</p>
      <strong className="mt-3 block text-4xl font-black tracking-tight text-ink">
        {value.toLocaleString("zh-CN")}
      </strong>
      <p className="mt-3 text-sm leading-6 text-slate-500">{note}</p>
    </article>
  );
}

function HealthCard({ label, value }: { label: string; value: number }) {
  const isClean = value === 0;

  return (
    <div
      className={`rounded-2xl border px-4 py-4 shadow-sm ${
        isClean ? "border-emerald-100 bg-emerald-50/70" : "border-amber-200 bg-amber-50/80"
      }`}
    >
      <p className={`text-sm font-bold ${isClean ? "text-emerald-700" : "text-amber-800"}`}>{label}</p>
      <strong className={`mt-2 block text-3xl font-black ${isClean ? "text-emerald-700" : "text-amber-800"}`}>
        {value}
      </strong>
      <p className={`mt-1 text-xs font-semibold ${isClean ? "text-emerald-600" : "text-amber-700"}`}>
        {isClean ? "已清零" : "待补充"}
      </p>
    </div>
  );
}

function BarList({ items }: { items: Array<{ name: string; count: number }> }) {
  if (items.length === 0) {
    return <p className="mt-3 text-sm leading-7 text-slate-600">暂无数据。</p>;
  }

  const max = Math.max(...items.map((item) => item.count), 1);

  return (
    <div className="mt-4 grid gap-3">
      {items.map((item) => (
        <div key={item.name} className="grid grid-cols-[6rem_1fr_2.5rem] items-center gap-3 text-sm">
          <span className="truncate font-bold text-slate-600">{item.name}</span>
          <div className="h-3 overflow-hidden rounded-full bg-[rgba(227,167,95,0.12)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#b06e22] to-[#e3a75f]"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
          <span className="text-right font-black text-ink">{item.count}</span>
        </div>
      ))}
    </div>
  );
}
