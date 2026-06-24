# First 3 tools import script v1

Status: active

## 1. Current goal

This script handles the first 3 tools import flow.
By default it only performs a dry-run and does not write to the database.

## 2. Input

- `docs/content/first-3-tools-ready-to-import-v1.csv`

## 3. Output

- `docs/content/first-3-tools-import-dry-run-report-v1.json`

## 4. Selected tools

The current whitelist is:

- `localsend`
- `stirling-pdf`
- `cyberchef`

## 5. Safety boundary

The script defaults to dry-run.
Only explicit `--execute` enters real write mode.

Execute mode now:

- checks the Supabase URL and service key;
- checks the slug whitelist first;
- checks slug conflicts against the `tools` table;
- only uses `insert(...).select("slug")`;
- does not use `upsert`, `update`, or `delete`;
- writes a dedicated execute report;
- never prints secrets.

## 6. Why it still cannot run immediately

Before real execution, the following still have to be true:

- the working tree is clean;
- the current shell session has the Supabase env values;
- the CSV still has exactly 3 rows;
- the slug set still matches the whitelist exactly;
- the `tools` table has no conflict for these slugs;
- the user has explicitly approved real import.

## 7. Next step

- run dry-run first;
- run readiness again;
- if a real import is needed, run `--execute` separately.

## Execute branch supplement

`import-first-3-tools.mjs` now includes a real `--execute` branch.

The default remains dry-run.

Only explicit `--execute` switches the script into Supabase write mode.

That branch now:

- uses the Supabase JS client;
- checks slug conflicts first;
- inserts only the 3 allowed tools;
- writes a dedicated execute report.
