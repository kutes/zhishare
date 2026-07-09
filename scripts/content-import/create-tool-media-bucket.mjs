// Creates the public "tool-media" storage bucket (per-tool media JSON + hosted images).
// Dry-run by default; --execute creates. Needs Supabase URL + service key at execute.

import { loadLocalEnv } from "./lib/load-local-env.mjs";

loadLocalEnv();

const BUCKET = "tool-media";
const executeMode = process.argv.includes("--execute");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? "";

if (!executeMode) {
  console.log("CREATE_MEDIA_BUCKET_DRY_RUN_OK");
  console.log(`BUCKET: ${BUCKET} (public read)`);
  console.log(`ENV_READY: ${String(Boolean(supabaseUrl && serviceKey))}`);
  process.exit(0);
}

if (!supabaseUrl || !serviceKey) {
  console.error("MISSING_SUPABASE_ENV");
  process.exit(1);
}

const { createClient } = await import("@supabase/supabase-js");
const client = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

const { data: existing } = await client.storage.getBucket(BUCKET);
if (existing) {
  console.log("MEDIA_BUCKET_ALREADY_EXISTS");
  process.exit(0);
}

const { error } = await client.storage.createBucket(BUCKET, { public: true });
if (error) {
  console.error(`CREATE_MEDIA_BUCKET_FAILED: ${error.message}`);
  process.exit(1);
}
console.log("CREATE_MEDIA_BUCKET_OK");
