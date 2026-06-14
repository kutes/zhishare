# AGENTS.md

<!-- CURRENT_DESIGN_DIRECTION_START -->
## Authoritative Current Design Direction - Warm Editorial Portal

This section is the current source of truth and overrides earlier cosmic / realistic sun homepage notes.

Current approved direction:

- Warm dark editorial resource portal
- Background: #120F0E
- Accent: #E3A75F
- Surface: rgba(255, 247, 237, 0.04)
- Hover surface: rgba(255, 247, 237, 0.07)
- Border: rgba(255, 247, 237, 0.09)
- Text: #F7F1EA
- Muted text: #AFA399
- Faint text: #756B64
- Hero title should use a Chinese serif direction: Songti SC / Noto Serif SC / STSong
- Buttons should be compact warm editorial buttons
- Cards should be simple low-opacity warm surfaces
- Search bar should be practical, rectangular-rounded, and clear
- Homepage should remain a content-rich resource portal
- Keep modules: Hero search, hotwords, categories, partner ads, featured resources, banner ad, latest guides, ranking blocks
- Do not continue the old pure-black cosmic sun homepage direction
- Do not continue the Liquid Glass button experiment
- Do not continue the Dark Blog Card experiment
- Do not introduce shadcn, framer-motion, or lucide-react unless explicitly approved later
- Use Playwright screenshots after major visual changes

Implementation rules:

- Prefer stable semantic CSS classes beginning with zh-
- Prefer CSS variables for reusable visual tokens
- Avoid dynamic Tailwind class construction
- Do not modify backend, admin, API, Supabase schema, or environment variables for visual work
<!-- CURRENT_DESIGN_DIRECTION_END -->

## Project Identity

`zhishare` is a Chinese public-facing tool and knowledge-sharing website.

The current redesign focuses on public pages only. Admin and backend areas are out of scope unless a step explicitly says otherwise.

## Read Order

Before any redesign step, read these files first:

1. `AGENTS.md`
2. `docs/COSMIC_REDESIGN_SPEC.md`
3. `docs/COSMIC_REDESIGN_LOG.md`

If a task conflicts with these files, stop and report the conflict.

## Approved Visual Direction

The approved direction remains:

- warm dark
- minimal
- premium
- editorial
- tool-sharing focused
- warm gold accent
- serif Chinese hero title
- practical search bar
- low-opacity warm surfaces
- restrained animation
- no colorful UI

Homepage hero copy is locked:

```text
探索 · 发现
EXPLORE · DISCOVER
```

## Current Homepage Architecture

The homepage should use a content-dense resource portal structure:

1. Hero discovery area
2. Primary category gateway
3. Partner ad strip
4. Featured tools and open-source projects
5. Mid-page banner ad
6. Latest reviews and practical guides
7. Popular category ranking blocks

Footer should remain current.

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

Forbidden areas:

- `src/app/admin/**`
- `src/app/api/**`
- Supabase logic
- database schema
- auth / RLS / backend code

## Execution Rules

Every task must be small.

For each task:

1. Modify only explicitly listed files.
2. Do not perform unrelated cleanup.
3. Do not rename routes.
4. Do not change data fetching unless explicitly instructed.
5. Do not add dependencies unless explicitly instructed.
6. Return unified diff.
7. Return verification results.
8. If uncertain, stop and report.

## Verification

After each task, report:

- modified files
- unified diff
- `npm run lint` result if run
- `npm run build` result if run
- `git status --short`

## Future visual baseline - warm editorial concept

The latest user-provided HTML concept is the next redesign baseline.

Use this direction in future design work:

- Warm dark background: #120F0E
- Warm gold accent: #E3A75F
- Low-opacity warm surface: rgba(255, 247, 237, 0.04)
- Low-opacity warm border: rgba(255, 247, 237, 0.09)
- Serif Chinese hero title direction, similar to Songti SC / Noto Serif SC / STSong
- Compact warm buttons with 10px to 12px radius
- Simple tool cards with clear icon, title, description, and warm hover border
- Search bar should be rectangular-rounded, clean, and practical
- Keep the content portal structure, but redesign styling from this HTML concept
- Do not continue the previous Liquid Glass button experiment
- Do not continue the previous Dark Blog Card experiment

## Component Strategy

Homepage components live under:

- `src/components/home/`

The homepage has been split into focused components:

- `CosmicHomeHero.tsx`
- `CosmicHomeSections.tsx`
- `home-section-header.tsx`
- `home-category-gateway.tsx`
- `home-partner-ads.tsx`
- `home-featured-resources.tsx`
- `home-promo-banner.tsx`
- `home-latest-guides.tsx`
- `home-ranking-grid.tsx`
- `cosmic-home-data.ts`

Do not re-concentrate homepage sections into one large file.
