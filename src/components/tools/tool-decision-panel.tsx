"use client";

import Link from "next/link";
import { useState } from "react";
import { toListItems } from "@/lib/db/normalizers";
import type { ToolItem } from "@/types/tool";

type ToolDecisionPanelProps = {
  tool: ToolItem;
  className?: string;
};

type DecisionItem = {
  label: string;
  value: string;
  detail: string;
  tone: "gold" | "blue" | "surface" | "warning";
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

    if (Array.isArray(value) || typeof value === "string") {
      return toListItems(value);
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

  const detail = getNestedDetailArray(tool, ["target_users", "targetUsers", "audience", "suitableFor"]);

  if (detail.length > 0) {
    return detail;
  }

  return ["适合想快速判断这款工具是否值得继续了解的用户。"];
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
    "工具信息可能会变化，具体价格、功能、授权和下载方式请以官网为准。"
  );
}

function compactText(value: string, maxLength = 40) {
  const text = value.trim();

  if (!text) {
    return "";
  }

  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

function DecisionRow({ item }: { item: DecisionItem }) {
  return (
    <div className={`tool-decision-item tool-decision-item-${item.tone}`}>
      <div className="tool-decision-item-head">
        <div className="min-w-0">
          <p className="tool-decision-item-label">{item.label}</p>
          <p className="tool-decision-item-value">{compactText(item.value, 44)}</p>
        </div>

        <span className="tool-decision-dot" />
      </div>

      <p className="tool-decision-item-detail">{compactText(item.detail, 64)}</p>
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
    <div className="tool-decision-actions">
      {websiteUrl ? (
        <a href={websiteUrl} target="_blank" rel="nofollow noopener noreferrer" className="tool-decision-button">
          访问官网
        </a>
      ) : (
        <button type="button" disabled className="tool-decision-button tool-decision-button-disabled">
          暂无官网链接
        </button>
      )}

      {downloadUrl ? (
        <a
          href={downloadUrl}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="tool-decision-button tool-decision-button-secondary"
        >
          网盘下载
        </a>
      ) : (
        <button type="button" disabled title="暂无网盘下载" className="tool-decision-button tool-decision-button-disabled-secondary">
          网盘下载
        </button>
      )}

      <Link href="/tools" className="tool-decision-link">
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
      value: targetUsers[0] || "适合快速判断是否值得继续了解的用户。",
      detail: targetUsers.slice(0, 2).join("；") || "优先看这类用户是否和你的需求一致。",
      tone: "gold",
    },
    {
      label: "使用场景",
      value: useCases[0] || "适合在访问官网前先看功能和用途。",
      detail: useCases.slice(0, 2).join("；") || "先判断实际用途，再决定是否打开官网。",
      tone: "blue",
    },
    {
      label: "风险提醒",
      value: riskNotice,
      detail: "重点关注价格、隐私、授权、账号安全和官网真实性。",
      tone: "warning",
    },
    {
      label: "访问路径",
      value: "先看简介，再访问官网。",
      detail: "建议先浏览摘要和适用场景，再决定是否跳转外部链接。",
      tone: "surface",
    },
  ];

  return (
    <aside className={`tool-decision-panel ${className}`.trim()}>
      <div className="tool-decision-head">
        <div className="min-w-0">
          <p className="tool-decision-kicker">快速判断</p>
          <h2 className="tool-decision-title">先判断值不值得继续看</h2>
          <p className="tool-decision-subtitle">把适用人群、使用场景、风险提示和下一步动作放在一起，减少犹豫。</p>
        </div>

        <button
          type="button"
          onClick={() => setShowMobileDetails((value) => !value)}
          aria-expanded={showMobileDetails}
          className="tool-decision-toggle md:hidden"
        >
          {showMobileDetails ? "收起判断" : "展开判断"}
        </button>
      </div>

      <div className="tool-decision-summary md:hidden">
        <p className="tool-decision-summary-label">决策摘要</p>
        <p className="tool-decision-summary-copy">先看简介，确认适用场景与风险，再决定是否访问官网。</p>
      </div>

      {showMobileDetails ? (
        <div className="tool-decision-grid md:hidden">
          {decisionItems.map((item) => (
            <DecisionRow key={item.label} item={item} />
          ))}
        </div>
      ) : null}

      <div className="tool-decision-grid hidden md:grid">
        {decisionItems.map((item) => (
          <DecisionRow key={item.label} item={item} />
        ))}
      </div>

      <ActionButtons websiteUrl={websiteUrl} downloadUrl={downloadUrl} />
    </aside>
  );
}
