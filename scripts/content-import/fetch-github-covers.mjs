// For published tools that still use a generated cover (not a real photo) AND have a GitHub
// repo in their text, fetch GitHub's auto-generated social preview image
// (opengraph.githubassets.com/1/{owner}/{repo}) and store it as the real cover.
// This is an official, reliably-fetchable image for open-source tools.
// Dry-run by default (reports plan); --execute downloads, uploads to tool-covers/photos/{slug}.png,
// updates cover_url, and reads back.

import fs from "node:fs";
import path from "node:path";
import { loadLocalEnv } from "./lib/load-local-env.mjs";

loadLocalEnv();

const BUCKET = "tool-covers";
const REPORT = "docs/content/fetch-github-covers-report.json";
const MAX_BYTES = 2 * 1024 * 1024;
const executeMode = process.argv.includes("--execute");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  const readKey = serviceKey || anonKey;
  if (!supabaseUrl || !readKey) {
    console.error("MISSING_SUPABASE_ENV");
    process.exit(1);
  }
  const headers = { apikey: readKey, Authorization: `Bearer ${readKey}` };
  const tools = await restGet(
    `${supabaseUrl}/rest/v1/tools?status=eq.published&select=id,slug,cover_url,description,risk_notice`,
    headers,
  );

  const targets = [];
  for (const tool of tools) {
    if (String(tool.cover_url ?? "").includes("/photos/")) continue; // already a real photo
    const repo = extractRepo(`${tool.description ?? ""} ${tool.risk_notice ?? ""}`);
    if (!repo) continue;
    targets.push({ id: tool.id, slug: tool.slug, repo });
  }

  console.log(`GEN_COVER_TOOLS_WITH_REPO: ${targets.length}`);
  for (const t of targets) console.log(`  ${t.slug} <- github:${t.repo}`);

  if (!executeMode) {
    writeReport({ status: "dry_run_completed", targets });
    console.log("FETCH_GITHUB_COVERS_DRY_RUN_OK");
    console.log(`REPORT: ${REPORT}`);
    return;
  }

  if (!serviceKey) {
    console.error("MISSING_SERVICE_KEY_FOR_EXECUTE");
    process.exit(1);
  }
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const updated = [];
  const failed = [];
  for (const t of targets) {
    try {
      const ogUrl = `https://opengraph.githubassets.com/1/${t.repo}`;
      const res = await fetch(ogUrl, { redirect: "follow", headers: { "User-Agent": "zhishare-bot/1.0" } });
      if (!res.ok) throw new Error(`fetch ${res.status}`);
      const ct = res.headers.get("content-type") ?? "";
      if (!ct.startsWith("image/")) throw new Error(`not image: ${ct}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 2000) throw new Error("too small");
      if (buf.length > MAX_BYTES) throw new Error("too large");

      const storagePath = `photos/${t.slug}.png`;
      const up = await client.storage
        .from(BUCKET)
        .upload(storagePath, buf, { contentType: "image/png", upsert: true });
      if (up.error) throw new Error(`upload: ${up.error.message}`);
      const publicUrl = client.storage.from(BUCKET).getPublicUrl(storagePath).data?.publicUrl ?? "";
      if (!publicUrl) throw new Error("public url empty");

      const { data: after, error: upErr } = await client
        .from("tools")
        .update({ cover_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", t.id)
        .select("cover_url");
      if (upErr || !after?.[0]?.cover_url?.includes("/photos/")) {
        throw new Error(upErr?.message ?? "verify failed");
      }
      updated.push(t.slug);
    } catch (error) {
      failed.push({ slug: t.slug, error: error instanceof Error ? error.message : String(error) });
    }
  }

  writeReport({ status: failed.length ? "execute_partial" : "execute_completed", updated, failed });
  console.log(failed.length ? "FETCH_GITHUB_COVERS_EXECUTE_PARTIAL" : "FETCH_GITHUB_COVERS_EXECUTE_OK");
  console.log(`UPDATED: ${updated.join(",")}`);
  if (failed.length) console.log(`FAILED: ${failed.map((f) => `${f.slug}(${f.error})`).join("; ")}`);
  console.log(`REPORT: ${REPORT}`);
  if (failed.length) process.exitCode = 1;
}

function extractRepo(text) {
  const m = String(text).match(/github\.com\/([\w.-]+)\/([\w.-]+)/);
  if (!m) return "";
  const owner = m[1];
  const repo = m[2].replace(/[.,;)]+$/, "");
  return `${owner}/${repo}`;
}

async function restGet(url, headers) {
  const response = await fetch(url, { headers });
  const data = await response.json();
  if (!response.ok) throw new Error(`REST_GET_FAILED ${response.status}: ${JSON.stringify(data)}`);
  return data;
}

function writeReport(report) {
  const absolute = path.resolve(REPORT);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify({ ...report, secret_values_printed: false }, null, 2)}\n`, "utf8");
}
