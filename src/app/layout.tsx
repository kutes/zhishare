import type { Metadata } from "next";
import {
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_TITLE,
  SITE_KEYWORDS,
  SITE_NAME,
  getAbsoluteUrl,
  getSiteUrl,
} from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: SITE_NAME,
  title: {
    default: DEFAULT_SITE_TITLE,
    template: `%s｜${SITE_NAME}`,
  },
  description: DEFAULT_SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  alternates: {
    canonical: getAbsoluteUrl("/"),
  },
  openGraph: {
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
    type: "website",
    url: getAbsoluteUrl("/"),
    siteName: SITE_NAME,
    locale: "zh_CN",
  },
  twitter: {
    card: "summary",
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
