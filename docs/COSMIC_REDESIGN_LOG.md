# Cosmic Redesign Log

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

## Step Log

### Step 1 - Create redesign guardrails

Status: completed

- Created redesign guardrail documents.
- Locked the initial public-facing redesign scope.
- Excluded backend and admin changes.

### Step 9 - Homepage content portal v1 implementation

Status: completed

- Reframed homepage as a content-rich resource portal.
- Added local placeholder data for content modules.
- Added category gateway, partner ads, featured resources, banner, latest guides, and rankings.
- Did not modify backend, database, admin, or API.

### Step 13 - Revert button and card experiments

Status: completed

- Removed Liquid Glass button experiment.
- Removed Dark Blog Card experiment.
- Preserved the content portal structure.
- Restarted visual styling from the user-provided warm editorial HTML concept.

### Step 14 - Visual QA tooling and warm editorial baseline

Status: completed

- Added Playwright screenshot workflow.
- Added npm script: `capture:homepage`.
- Ignored screenshot artifacts in `.gitignore`.
- Locked the warm editorial HTML concept as the next visual baseline.

### Step 15 - Warm editorial homepage redesign v1

Status: completed

- Restyled homepage around a warm dark background, warm gold accent, serif hero title, compact editorial buttons, practical search bar, and low-opacity warm cards.
- Removed page usage of the old cosmic solar visual direction.
- Did not introduce shadcn, framer-motion, or lucide-react.
- Did not modify backend, database, tools page, articles page, or search page.

### Step 16 - Warm editorial polish and encoding cleanup

Status: completed

- Restored visible search caret.
- Removed unnecessary hydration suppression.
- Improved small text and card readability.
- Fixed hero Chinese mojibake.
- Verified search submits to `/search?q=AI`.

### Step 17 - Split homepage sections into focused components

Status: completed

- Split the large homepage sections component into focused files.
- Preserved current visual output.
- Reduced homepage component entropy.
- Did not modify layout, data, backend, database, or routing.

## Current State

- Homepage direction: warm editorial resource portal.
- Visual QA: Playwright screenshots available.
- Main screenshot command: `npm run capture:homepage`.
- Current next recommended action: final total validation, then commit and push if validation passes.


### Step 20 - Wide-screen layout and ambient glow polish

Status: completed

- Increased warm homepage shell width for large desktop screens.
- Added 1600px and 1920px responsive layout polish.
- Replaced the hard round yellow glow with larger, softer, off-canvas warm ambient ellipses.
- Added Playwright wide-screen screenshot output: homepage-wide.png.
- Did not change content structure, backend, database, or routes.
