"use client";

import Link from "next/link";
import { useState } from "react";
import type { ToolItem } from "@/types/tool";

type ToolDecisionPanelProps = {
  tool: ToolItem;
  className?: string;
};

type DecisionItem = {
  label: string;
  value: string;
  detail: string;
  tone: string;
};

function readText(source: unknown, keys: string[]) {
  if (!source || typeof source !== "object") {
    return "";
  }

  const record = source as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function readTextArray(source: unknown, keys: string[]) {
  if (!source || typeof source !== "object") {
    return [];
  }

  const record = source as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];

    if (Array.isArray(value)) {
      return value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    if (typeof value === "string" && value.trim()) {
      return [value.trim()];
    }
  }

  return [];
}

function getDetail(tool: ToolItem) {
  return (tool as unknown as { detail?: Record<string, unknown> }).detail ?? {};
}

function getNestedDetailArray(tool: ToolItem, keys: string[]) {
  return readTextArray(getDetail(tool), keys);
}

function getNestedDetailText(tool: ToolItem, keys: string[]) {
  return readText(getDetail(tool), keys);
}

function getWebsiteUrl(tool: ToolItem) {
  return readText(tool, ["website_url", "websiteUrl", "officialUrl", "official_url", "url"]);
}

function getDownloadUrl(tool: ToolItem) {
  return readText(tool, [
    "download_url",
    "downloadUrl",
    "pan_url",
    "panUrl",
    "cloud_url",
    "cloudUrl",
    "cloudDriveUrl",
    "resource_url",
    "resourceUrl",
  ]);
}

function getTargetUsers(tool: ToolItem) {
  const direct = readTextArray(tool, ["target_users", "targetUsers", "audience"]);

  if (direct.length > 0) {
    return direct;
  }

  const detail = getNestedDetailArray(tool, [
    "target_users",
    "targetUsers",
    "audience",
    "suitableFor",
  ]);

  if (detail.length > 0) {
    return detail;
  }

  return ["适合想快速判断这个工具是否值得尝试的用户。"];
}

function getUseCases(tool: ToolItem) {
  const direct = readTextArray(tool, ["use_cases", "useCases", "scenarios"]);

  if (direct.length > 0) {
    return direct;
  }

  const detail = getNestedDetailArray(tool, ["use_cases", "useCases", "scenarios"]);

  if (detail.length > 0) {
    return detail;
  }

  return ["适合在访问官网前，先了解功能、用途和基本风险。"];
}

function getRiskNotice(tool: ToolItem) {
  return (
    readText(tool, ["risk_notice", "riskNotice"]) ||
    getNestedDetailText(tool, ["risk_notice", "riskNotice", "risk"]) ||
    "使用前建议确认官网信息、价格、隐私政策、授权说明和账号安全。"
  );
}

function compactText(value: string, maxLength = 36) {
  const text = value.trim();

  if (!text) {
    return "";
  }

  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

function MobileDecisionRow({ item }: { item: DecisionItem }) {
  return (
    <div className={`rounded-[18px] border px-3 py-3 ${item.tone}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#64748b]">{item.label}</p>
          <p className="mt-1 text-sm font-black leading-5 text-[#0f172a]">
            {compactText(item.value, 42)}
          </p>
        </div>
        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#5ecfb1]" />
      </div>

      <p className="mt-2 text-xs font-medium leading-5 text-[#64748b]">
        {compactText(item.detail, 58)}
      </p>
    </div>
  );
}

function DesktopDecisionRow({ item }: { item: DecisionItem }) {
  return (
    <div className={`rounded-[22px] border px-4 py-3 ${item.tone}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black text-[#64748b]">{item.label}</p>
          <p className="mt-1 text-sm font-black leading-6 text-[#0f172a]">{item.value}</p>
        </div>

        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#5ecfb1]" />
      </div>

      <p className="mt-2 text-xs font-medium leading-5 text-[#64748b]">{item.detail}</p>
    </div>
  );
}

function ActionButtons({
  websiteUrl,
  downloadUrl,
}: {
  websiteUrl: string;
  downloadUrl: string;
}) {
  return (
    <div className="mt-4 grid gap-2">
      {websiteUrl ? (
        <a
          href={websiteUrl}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#0f172a] px-4 text-sm font-black text-white shadow-[0_12px_24px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-[#111827]"
        >
          访问官网
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="inline-flex h-11 cursor-not-allowed items-center justify-center rounded-2xl bg-[#cbd5e1] px-4 text-sm font-black text-white"
        >
          暂无官网
        </button>
      )}

      {downloadUrl ? (
        <a
          href={downloadUrl}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#5ecfb1]/50 bg-[#f2fffa] px-4 text-sm font-black text-[#0f766e] shadow-sm transition hover:-translate-y-0.5 hover:border-[#20a27f]/60 hover:bg-white"
        >
          网盘下载
        </a>
      ) : (
        <button
          type="button"
          disabled
          title="后台未填写网盘下载链接"
          className="inline-flex h-11 cursor-not-allowed items-center justify-center rounded-2xl border border-[#cbd5e1] bg-[#f1f5f9] px-4 text-sm font-black text-[#94a3b8]"
        >
          网盘下载
        </button>
      )}

      <Link
        href="/tools"
        className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#0f172a]/10 bg-white px-4 text-sm font-black text-[#0f172a] shadow-sm transition hover:-translate-y-0.5 hover:border-[#5ecfb1]/60 hover:text-[#20a27f]"
      >
        返回工具库
      </Link>
    </div>
  );
}

export function ToolDecisionPanel({ tool, className = "" }: ToolDecisionPanelProps) {
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  const targetUsers = getTargetUsers(tool);
  const useCases = getUseCases(tool);
  const riskNotice = getRiskNotice(tool);
  const websiteUrl = getWebsiteUrl(tool);
  const downloadUrl = getDownloadUrl(tool);

  const decisionItems: DecisionItem[] = [
    {
      label: "适合人群",
      value: targetUsers[0] || "适合想快速判断这个工具是否值得尝试的用户。",
      detail: targetUsers.slice(0, 2).join("；") || "适合想快速判断这个工具是否值得尝试的用户。",
      tone: "border-[#5ecfb1]/30 bg-[#f2fffa]",
    },
    {
      label: "使用场景",
      value: useCases[0] || "适合在访问官网前，先了解功能、用途和基本风险。",
      detail: useCases.slice(0, 2).join("；") || "适合在访问官网前，先了解功能、用途和基本风险。",
      tone: "border-[#93c5fd]/35 bg-[#f1f8ff]",
    },
    {
      label: "风险提醒",
      value: riskNotice,
      detail: "重点关注价格、隐私、授权、账号安全和官网真实性。",
      tone: "border-[#facc15]/45 bg-[#fffbea]",
    },
    {
      label: "访问路径",
      value: "先看详情，再访问官网。",
      detail: "先阅读介绍、适用场景和风险提醒，再决定是否跳转官网。",
      tone: "border-[#bfdbfe]/50 bg-[#f8fbff]",
    },
  ];

  return (
    <aside
      className={`rounded-[28px] border border-[#0f172a]/[0.08] bg-white/88 p-4 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black text-[#20a27f]">快速判断</p>
          <h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-[#0f172a]">
            先判断值不值得继续看
          </h2>
        </div>

        <span className="hidden shrink-0 rounded-full border border-[#5ecfb1]/40 bg-[#f2fffa] px-3 py-1 text-[11px] font-black text-[#20a27f] md:inline-flex">
          决策面板
        </span>

        <button
          type="button"
          onClick={() => setShowMobileDetails((value) => !value)}
          aria-expanded={showMobileDetails}
          className="shrink-0 rounded-full border border-[#5ecfb1]/40 bg-[#f2fffa] px-3 py-1.5 text-[11px] font-black text-[#20a27f] shadow-sm transition hover:-translate-y-0.5 hover:bg-white md:hidden"
        >
          {showMobileDetails ? "收起判断" : "展开判断"}
        </button>
      </div>

      <div className="mt-3 rounded-[20px] border border-[#0f172a]/[0.06] bg-[#f8fbff] px-3 py-3 md:hidden">
        <p className="text-[11px] font-black text-[#94a3b8]">决策摘要</p>
        <p className="mt-1 text-sm font-black leading-6 text-[#0f172a]">
          先看介绍，确认适用场景与风险，再决定是否访问官网或下载资源。
        </p>
      </div>

      {showMobileDetails ? (
        <div className="mt-3 space-y-2 md:hidden">
          {decisionItems.map((item) => (
            <MobileDecisionRow key={item.label} item={item} />
          ))}
        </div>
      ) : null}

      <div className="mt-4 hidden space-y-3 md:block">
        {decisionItems.map((item) => (
          <DesktopDecisionRow key={item.label} item={item} />
        ))}
      </div>

      <ActionButtons websiteUrl={websiteUrl} downloadUrl={downloadUrl} />
    </aside>
  );
}
