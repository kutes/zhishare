# Content Pipeline Skeleton

This folder holds the first-step ingestion skeleton for public source collection.

## What it does

- Loads source definitions from JSON
- Fetches RSS or HTML pages
- Normalizes a shared row shape
- Assigns a heuristic AI score stub
- Writes JSON for the next automation step

## Current output fields

- title
- link
- github_stars
- summary
- published_at
- keywords
- source_name
- category
- is_open_source
- ai_score
- ai_verdict

## Run

```bash
python scripts/content-pipeline/content_pipeline.py --source-file scripts/content-pipeline/sources.example.json --output .tmp/content-items.json
```

The example source file uses placeholder URLs. Replace them with approved public sources before running in production.

## Feishu sync

First generate the Feishu payload:

```bash
python scripts/content-pipeline/feishu_export.py --input .tmp/content-items.json --output .tmp/feishu-payload.json
```

Then dry-run the sync:

```bash
python scripts/content-pipeline/feishu_sync.py --input .tmp/feishu-payload.json --dry-run
```

To perform a real sync, set:

- `FEISHU_APP_ID`
- `FEISHU_APP_SECRET`
- `FEISHU_APP_TOKEN`
- `FEISHU_TABLE_ID`

Then rerun without `--dry-run`.
