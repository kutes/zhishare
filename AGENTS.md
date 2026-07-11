# AGENTS.md

<!-- CURRENT_DESIGN_DIRECTION_START -->
## Authoritative Current Design Direction - Warm Editorial Portal

This section is the current source of truth and overrides all earlier notes (cosmic sun homepage, liquid glass buttons, dark blog cards). Full detail lives in `docs/DESIGN_SYSTEM.md` — read that before any visual work; this section is the short version agents load automatically.

Current approved direction:

- Warm dark editorial resource portal.
- Background: `#120F0E` -> `#171210` -> `#120F0E` gradient. Accent: `#E3A75F`. Surface: `rgba(255, 247, 237, 0.04)`. Hover surface: `rgba(255, 247, 237, 0.07)`. Border: `rgba(255, 247, 237, 0.09)`. Text: `#F7F1EA`. Muted text: `rgba(247, 241, 234, 0.7)`. Faint text: `rgba(175, 163, 153, 0.82)`.
- Headings use `var(--zh-serif)` (single token defined once on `:root`, do not hand-roll a new serif stack). Body/UI text uses `"PingFang SC", "Microsoft YaHei", Arial, sans-serif`.
- Buttons: compact warm editorial style. Search bar: practical, rectangular-rounded, clear.
- Do not reintroduce the pure-black cosmic sun homepage, the Liquid Glass button experiment, or the Dark Blog Card experiment.
- Do not introduce shadcn, framer-motion, or lucide-react unless explicitly approved later.
- Use Playwright screenshots (`scripts/capture-*.mjs`) after any visual change; confirm zero regression by comparing before/after.

Card standard (established 2026-07-05/07-09, see `docs/DESIGN_SYSTEM.md` for full detail):

- Exactly 3 reusable card components: `FeaturedToolCard`, `CompactToolCard`, `ArticleCard`. Do not write one-off card markup for new sections — reuse these.
- Whole-card click via stretched-link (`position: relative` on card + `::after { inset: 0 }` on the one visible action link/arrow).
- Tool cover/icon fallback chain, always resolved in this order, never leave a card blank: official photo (`tool-covers/photos/{slug}`) -> generated SVG cover (`tool-covers/covers/{slug}.svg`, deterministic, see `src/lib/covers/tool-cover.mjs`) -> initials placeholder. Compact-card icons always use the generated SVG (never a photo).

Data standard (critical — read this):

- **Real data only. Never ship fake metrics or fake demo content in a shipped page.** The homepage previously showed hardcoded fake tools and fake view counts ("8.2K") for over a month before being fixed on 2026-07-09 — this was a real defect, not acceptable "polish". Any count/stat/ranking UI either reflects real data or is omitted.
- `src/components/home/cosmic-home-data.ts` may only hold non-content static config (hero hotwords, partner-ad copy, category icon mapping) — never mock tools/articles/rankings.
- New tool/article-facing UI reads from `getPublishedTools()` / `getPublishedArticles()` (`src/lib/db/`), not from hardcoded arrays.

Content assets standard:

- Do not add a database column/table for new content-adjacent data (images, media galleries) — the project owner performs zero manual operations, and schema changes require Supabase console SQL access nobody will run. Store structured metadata as public JSON files in Supabase Storage instead (pattern: `tool-media/{slug}.json`), fetched server-side with `cache: "no-store"`, empty/failed fetch renders nothing.
- Any script that writes to Supabase must follow the guarded-script pattern already used throughout `scripts/content-import/`: dry-run by default (report JSON, no writes), `--execute` flag required for real writes, service key read from env only (`SUPABASE_SERVICE_ROLE_KEY`) and never written to disk or printed, post-write verification by reading the row/file back.
- Video = allowlisted iframe embed only (bilibili/youtube host allowlist), never self-hosted video files.
- Any file containing Chinese text must be written with the `Write` tool or `fs.writeFileSync(path, text, "utf8")` — never PowerShell default redirection (`>`, `Out-File` without `-Encoding utf8`). A prior incident silently replaced all Chinese content with literal `?` this way; see `docs/TASK_LOG.md` 2026-07-03.

Implementation rules:

- Prefer stable semantic CSS classes beginning with `zh-` (or a page-specific prefix: `tool-detail-`, `articles-`, `search-warm-`, `submit-`, `copyright-`, `not-found-`).
- Prefer CSS variables for reusable visual tokens. Avoid dynamic Tailwind class construction.
- When deleting a component, grep for its CSS classes (`grep -rl <class> src --include=*.tsx`) and remove now-dead rules in the same pass — don't let styles outlive their component. When editing shared multi-selector CSS rules, only remove the dead selector, keep the rule for classes still in use.
- Do not modify backend, admin, API, Supabase schema, or environment variables for visual work.
<!-- CURRENT_DESIGN_DIRECTION_END -->

## Project Identity

`zhishare` is a Chinese public-facing tool and knowledge-sharing website, fully deployed (see `docs/TASK_LOG.md` and `docs/CHANGELOG.md` for real status — they supersede any phase language in `docs/ROADMAP.md`'s older sections).

Admin and backend areas are out of scope for visual/content work unless a task explicitly says otherwise.

## Read Order

Before any redesign or content step, read these files first:

1. `AGENTS.md` (this file)
2. `docs/DESIGN_SYSTEM.md` (full visual + data + content-asset standard)
3. `docs/ARTICLE_CONTENT_STANDARD.md` (article writing structure + rendering pattern — read before writing or rendering any article content)
4. `docs/CONTENT_STYLE_STANDARD.md` (voice/style standard: real-experience-sharer tone, AI-flavor blacklist — read before writing or rewriting ANY article or tool copy)
5. `docs/PROJECT_RULES.md` (workflow rules: small steps, naming, verification)
6. `docs/COSMIC_REDESIGN_LOG.md` (chronological record of what's already been built — check before re-deciding something already decided)

If a task conflicts with these files, stop and report the conflict.

## Allowed Scope

Allowed public-facing routes:

- `/`
- `/tools`
- `/tools/[slug]`
- `/articles`
- `/articles/[slug]`
- `/search`
- `/submit`
- `/copyright`

Forbidden areas (unless a task explicitly says otherwise):

- `src/app/admin/**`
- `src/app/api/**`
- Supabase schema / auth / RLS policy changes (content and media go through Storage + guarded scripts instead, see Data/Content standards above)

## Execution Rules

Every task should be small (see `docs/PROJECT_RULES.md` — "每次只做一个小步骤"). For each task:

1. Modify only the files the task requires; don't bundle unrelated cleanup into the same change unless it's a dedicated cleanup task.
2. Do not rename routes without explicit instruction.
3. Do not change data fetching contracts unless explicitly instructed.
4. Do not add dependencies unless explicitly instructed.
5. Report: modified files, `npx tsc --noEmit` result, and (for visual changes) screenshot verification.
6. If uncertain, stop and report rather than guessing.

## Component Strategy

Homepage components live under `src/components/home/`:

- `CosmicHomeHero.tsx` — hero section (search bar, hotwords, CTAs).
- `CosmicHomeSections.tsx` — assembles all below-the-fold sections; receives real `tools`/`articles` as props from `src/app/page.tsx`, does not fetch or hardcode content itself.
- `home-section-header.tsx`, `home-category-gateway.tsx`, `home-partner-ads.tsx`, `home-promo-banner.tsx` — section-specific presentational components (no fake content).
- `cosmic-home-data.ts` — static non-content config only (see Data standard above).

Tool/article cards are NOT homepage-specific — they live in `src/components/tools/` (`FeaturedToolCard`, `CompactToolCard`) and `src/components/articles/` (`ArticleCard`) and are imported into the homepage, `/tools`, and `/articles` alike. Do not re-implement card markup inside `src/components/home/`.

Do not re-concentrate homepage sections into one large file.
