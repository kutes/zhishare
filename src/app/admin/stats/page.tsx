"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminStatsDetail, type AdminStatsDetail } from "@/lib/db/admin";

type PageStatus = "loading" | "ready";

export default function AdminStatsPage() {
  const [status, setStatus] = useState<PageStatus>("loading");
  const [detail, setDetail] = useState<AdminStatsDetail | null>(null);

  useEffect(() => {
    let mounted = true;

    getAdminStatsDetail().then((result) => {
      if (!mounted) {
        return;
      }

      setDetail(result);
      setStatus("ready");
    });

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
