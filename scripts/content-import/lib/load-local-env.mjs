// Loads .env.local into process.env for keys that are not already set.
// Lets guarded scripts pick up NEXT_PUBLIC_SUPABASE_URL etc. when run from a plain terminal.
// Secrets (service keys) are intentionally NOT stored in .env.local — pass them via env.

import fs from "node:fs";
import path from "node:path";

export function loadLocalEnv(file = ".env.local") {
  const absolute = path.resolve(file);
  if (!fs.existsSync(absolute)) {
    return;
  }
  const text = fs.readFileSync(absolute, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq <= 0) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}
