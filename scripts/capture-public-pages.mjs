import { chromium, devices } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const port = process.env.PORT || "3001";
const baseUrl = process.env.BASE_URL || "http://localhost:" + port;
const rootUrl = baseUrl.replace(/\/$/, "");
const outputDir = path.join(process.cwd(), "artifacts", "public-pages-screenshots");

const targets = [
  { label: "search", path: "/search?q=ai", allowedStatuses: [200] },
  { label: "submit", path: "/submit", allowedStatuses: [200] },
  { label: "copyright", path: "/copyright", allowedStatuses: [200] },
  { label: "not-found", path: "/not-a-real-page", allowedStatuses: [404] },
];

fs.mkdirSync(outputDir, { recursive: true });

async function gotoOrFail(page, target) {
  const url = rootUrl + target.path;
  const response = await page.goto(url, { waitUntil: "networkidle" });

  if (!response) {
    throw new Error("No response received for " + url);
  }

  const status = response.status();

  if (!target.allowedStatuses.includes(status)) {
    throw new Error("Unexpected status " + status + " for " + url);
  }

  return { url, status };
}

async function captureTarget(browser, target, mode, options) {
  const page = await browser.newPage(options);
  const result = await gotoOrFail(page, target);

  const fileName = target.label + "-" + mode + ".png";
  const filePath = path.join(outputDir, fileName);

  await page.screenshot({
    path: filePath,
    fullPage: true,
  });

  await page.close();

  console.log(target.label.toUpperCase() + "_" + mode.toUpperCase() + ":", filePath);
  console.log(target.label.toUpperCase() + "_" + mode.toUpperCase() + "_STATUS:", result.status);
  console.log(target.label.toUpperCase() + "_" + mode.toUpperCase() + "_URL:", result.url);
}

const browser = await chromium.launch();

try {
  for (const target of targets) {
    await captureTarget(browser, target, "desktop", {
      viewport: { width: 1440, height: 1200 },
      deviceScaleFactor: 1,
    });

    await captureTarget(browser, target, "mobile", {
      ...devices["iPhone 13"],
    });
  }

  console.log("PUBLIC_PAGES_SCREENSHOTS_OK");
  console.log("OUTPUT_DIR:", outputDir);
} finally {
  await browser.close();
}
