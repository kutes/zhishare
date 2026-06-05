import type { Metadata } from "next";

export const SITE_NAME = "知享";
export const DEFAULT_SITE_TITLE = "知享｜中文工具与知识发现站";
export const DEFAULT_SITE_DESCRIPTION =
  "知享是一个面向中文用户的工具与知识发现站，持续整理 AI 工具、在线工具、效率软件、开源项目和实用教程。";

export const SITE_KEYWORDS = [
  "AI工具",
  "在线工具",
  "效率软件",
  "开源项目",
  "工具导航",
  "软件推荐",
  "效率技巧",
  "中文工具站",
];

export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const normalizedUrl = /^https?:\/\//i.test(siteUrl) ? siteUrl : `https://${siteUrl}`;

  return normalizedUrl.replace(/\/+$/, "");
}

export function getAbsoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, getSiteUrl()).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  type?: "website" | "article";
}): Metadata {
  const url = getAbsoluteUrl(path);
  const fullTitle = absoluteTitle ? title : `${title}｜${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      type,
      url,
      siteName: SITE_NAME,
      locale: "zh_CN",
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
    },
  };
}
