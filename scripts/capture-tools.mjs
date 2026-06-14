import { chromium, devices } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const port = process.env.PORT || "3001";
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
const targetUrl = baseUrl.replace(/\/$/, "") + "/tools";
const outputDir = path.join(process.cwd(), "artifacts", "tools-screenshots");

fs.mkdirSync(outputDir, { recursive: true });

async function captureWide(browser) {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1200 },
    deviceScaleFactor: 1,
  });

  await page.goto(targetUrl, { waitUntil: "networkidle" });
  await page.screenshot({
    path: path.join(outputDir, "tools-wide.png"),
    fullPage: true,
  });

  await page.close();
}

async function captureDesktop(browser) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
    deviceScaleFactor: 1,
  });

  await page.goto(targetUrl, { waitUntil: "networkidle" });
  await page.screenshot({
    path: path.join(outputDir, "tools-desktop.png"),
    fullPage: true,
  });

  await page.close();
}

async function captureMobile(browser) {
  const page = await browser.newPage({
    ...devices["iPhone 13"],
  });

  await page.goto(targetUrl, { waitUntil: "networkidle" });
  await page.screenshot({
    path: path.join(outputDir, "tools-mobile.png"),
    fullPage: true,
  });

  await page.close();
}

const browser = await chromium.launch();

try {
  await captureWide(browser);
  await captureDesktop(browser);
  await captureMobile(browser);

  console.log("TOOLS_SCREENSHOTS_OK");
  console.log("URL:", targetUrl);
  console.log("WIDE:", path.join(outputDir, "tools-wide.png"));
  console.log("DESKTOP:", path.join(outputDir, "tools-desktop.png"));
  console.log("MOBILE:", path.join(outputDir, "tools-mobile.png"));
} finally {
  await browser.close();
}
