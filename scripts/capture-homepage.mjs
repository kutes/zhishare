import { chromium, devices } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const port = process.env.PORT || "3001";
const baseUrl = process.env.BASE_URL || "http://localhost:" + port;
const outputDir = path.join(process.cwd(), "artifacts", "homepage-screenshots");

fs.mkdirSync(outputDir, { recursive: true });

async function captureDesktop(browser) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
    deviceScaleFactor: 1,
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.screenshot({
    path: path.join(outputDir, "homepage-desktop.png"),
    fullPage: true,
  });

  await page.close();
}

async function captureMobile(browser) {
  const page = await browser.newPage({
    ...devices["iPhone 13"],
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.screenshot({
    path: path.join(outputDir, "homepage-mobile.png"),
    fullPage: true,
  });

  await page.close();
}

const browser = await chromium.launch();

try {
  await captureDesktop(browser);
  await captureMobile(browser);
  console.log("HOMEPAGE_SCREENSHOTS_OK");
  console.log("DESKTOP:", path.join(outputDir, "homepage-desktop.png"));
  console.log("MOBILE:", path.join(outputDir, "homepage-mobile.png"));
} finally {
  await browser.close();
}
