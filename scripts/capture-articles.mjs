import { chromium, devices } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const port = process.env.PORT || "3001";
const baseUrl = process.env.BASE_URL || "http://localhost:" + port;
const articleSlug = process.env.ARTICLE_SLUG || "free-ai-tools-safety";
const articlesUrl = baseUrl.replace(/\/$/, "") + "/articles";
const detailUrl = articlesUrl + "/" + articleSlug;
const outputDir = path.join(process.cwd(), "artifacts", "articles-screenshots");

fs.mkdirSync(outputDir, { recursive: true });

async function gotoOrFail(page, url) {
  const response = await page.goto(url, { waitUntil: "networkidle" });

  if (!response) {
    throw new Error("No response received for " + url);
  }

  if (!response.ok()) {
    throw new Error("Unexpected status " + response.status() + " for " + url);
  }
}

async function capturePage(browser, label, url, viewport, options = {}) {
  const page = await browser.newPage({
    viewport,
    deviceScaleFactor: 1,
    ...options,
  });

  await gotoOrFail(page, url);
  await page.screenshot({
    path: path.join(outputDir, label + ".png"),
    fullPage: true,
  });

  await page.close();
}

const browser = await chromium.launch();

try {
  await capturePage(browser, "articles-wide", articlesUrl, { width: 1920, height: 1200 });
  await capturePage(browser, "articles-desktop", articlesUrl, { width: 1440, height: 1200 });
  await capturePage(browser, "articles-mobile", articlesUrl, undefined, devices["iPhone 13"]);

  await capturePage(
    browser,
    "article-detail-" + articleSlug + "-wide",
    detailUrl,
    { width: 1920, height: 1200 },
  );
  await capturePage(
    browser,
    "article-detail-" + articleSlug + "-desktop",
    detailUrl,
    { width: 1440, height: 1200 },
  );
  await capturePage(
    browser,
    "article-detail-" + articleSlug + "-mobile",
    detailUrl,
    undefined,
    devices["iPhone 13"],
  );

  console.log("ARTICLES_SCREENSHOTS_OK");
  console.log("ARTICLES_URL:", articlesUrl);
  console.log("DETAIL_URL:", detailUrl);
  console.log("SLUG:", articleSlug);
  console.log("ARTICLES_WIDE:", path.join(outputDir, "articles-wide.png"));
  console.log("ARTICLES_DESKTOP:", path.join(outputDir, "articles-desktop.png"));
  console.log("ARTICLES_MOBILE:", path.join(outputDir, "articles-mobile.png"));
  console.log("DETAIL_WIDE:", path.join(outputDir, "article-detail-" + articleSlug + "-wide.png"));
  console.log("DETAIL_DESKTOP:", path.join(outputDir, "article-detail-" + articleSlug + "-desktop.png"));
  console.log("DETAIL_MOBILE:", path.join(outputDir, "article-detail-" + articleSlug + "-mobile.png"));
} finally {
  await browser.close();
}
