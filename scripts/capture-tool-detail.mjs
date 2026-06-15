import { chromium, devices } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const port = process.env.PORT || "3001";
const baseUrl = process.env.BASE_URL || "http://localhost:" + port;
const toolSlug = process.env.TOOL_SLUG || "chatgpt";
const targetUrl = baseUrl.replace(/\/$/, "") + "/tools/" + toolSlug;
const outputDir = path.join(process.cwd(), "artifacts", "tool-detail-screenshots");

fs.mkdirSync(outputDir, { recursive: true });

async function gotoOrFail(page) {
  const response = await page.goto(targetUrl, { waitUntil: "networkidle" });

  if (!response) {
    throw new Error("No response received for " + targetUrl);
  }

  if (!response.ok()) {
    throw new Error("Unexpected status " + response.status() + " for " + targetUrl);
  }
}

async function captureWide(browser) {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1200 },
    deviceScaleFactor: 1,
  });

  await gotoOrFail(page);
  await page.screenshot({
    path: path.join(outputDir, "tool-detail-" + toolSlug + "-wide.png"),
    fullPage: true,
  });

  await page.close();
}

async function captureDesktop(browser) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
    deviceScaleFactor: 1,
  });

  await gotoOrFail(page);
  await page.screenshot({
    path: path.join(outputDir, "tool-detail-" + toolSlug + "-desktop.png"),
    fullPage: true,
  });

  await page.close();
}

async function captureMobile(browser) {
  const page = await browser.newPage({
    ...devices["iPhone 13"],
  });

  await gotoOrFail(page);
  await page.screenshot({
    path: path.join(outputDir, "tool-detail-" + toolSlug + "-mobile.png"),
    fullPage: true,
  });

  await page.close();
}

const browser = await chromium.launch();

try {
  await captureWide(browser);
  await captureDesktop(browser);
  await captureMobile(browser);

  console.log("TOOL_DETAIL_SCREENSHOTS_OK");
  console.log("URL:", targetUrl);
  console.log("SLUG:", toolSlug);
  console.log("WIDE:", path.join(outputDir, "tool-detail-" + toolSlug + "-wide.png"));
  console.log("DESKTOP:", path.join(outputDir, "tool-detail-" + toolSlug + "-desktop.png"));
  console.log("MOBILE:", path.join(outputDir, "tool-detail-" + toolSlug + "-mobile.png"));
} finally {
  await browser.close();
}
