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

### Step 21 - Balanced hero layout v2

Status: completed

- Redesigned the homepage hero as a two-column large-screen composition.
- Added a right-side resource discovery panel to reduce empty space on wide screens.
- Enlarged hero typography and search area for desktop.
- Kept mobile as a single-column layout.
- Did not modify backend, database, routing, or lower homepage sections.

### Step 22 - Compact balanced hero layout

Status: completed

- Reduced oversized hero height from the previous wide-screen version.
- Prevented desktop hero title wrapping.
- Tightened search, hotword, and CTA vertical spacing.
- Reduced excessive gap between hero and the category section.
- Preserved the right-side resource discovery panel on desktop.
- Kept mobile as a single-column layout.
- Did not modify backend, database, routing, or lower homepage sections.

### Step 23 - Centered editorial hero stage

Status: completed

- Reworked the homepage hero to follow the user's reference layout more closely.
- Removed the two-column resource discovery panel from the hero.
- Converted hero into a centered editorial stage with title, description, search bar, hotwords, and CTAs.
- Reduced mobile complexity and fixed the previous side-panel-driven layout issues.
- Preserved lower homepage modules and did not modify backend, database, routes, or dependencies.

### Step 24 - CSS anomalous matter hero stage

Status: completed

- Reworked the hero using the user's uploaded anomalous matter prompt as visual inspiration.
- Did not introduce three, WebGL, shadcn, lucide-react, or /components/ui.
- Added a CSS-only energy field / anomalous matter style background.
- Increased the hero search bar width so search becomes the primary action.
- Preserved the centered portal hero structure and lower homepage modules.
- Kept mobile layout simple and single-column.

### Step 25 - Soften search focus state

Status: completed

- Removed the harsh inner focus outline from the homepage search input.
- Kept a subtle focus state on the whole search bar container for usability.
- Did not modify hero structure, lower homepage modules, backend, database, routes, or dependencies.

### Step 26 - Homepage content flow polish

Status: completed

- Improved the homepage lower content flow after freezing the hero.
- Reframed categories as channel cards.
- Strengthened partner cards, featured resources, latest guide cards, sponsor banner, and ranking blocks.
- Preserved the warm editorial style and the existing data model.
- Did not modify hero, backend, database, routes, scripts, or dependencies.

### Step 28 - Tools page visual QA capture

Status: completed

- Added a dedicated Playwright screenshot script for the /tools page.
- Added npm run capture:tools.
- Captures wide, desktop, and mobile screenshots for /tools.
- Did not modify tools page UI, data flow, filtering logic, backend, database, routes, or dependencies.

### Step 29 - Tools listing warm editorial redesign

Status: completed

- Restyled the /tools listing page into the warm dark editorial direction used by the public homepage.
- Kept the existing query, category, and tag filtering logic intact.
- Reworked the hero, quick tasks, filter panel, featured cards, grid cards, sponsor banner, and empty state.
- Preserved the current data flow and did not touch detail pages, backend, database, routes, or Supabase logic.

### Step 31 - Tool detail visual QA capture

Status: completed

- Added a dedicated Playwright screenshot script for /tools/[slug] detail pages.
- Added npm run capture:tool-detail.
- Default detail screenshot target is /tools/chatgpt.
- TOOL_SLUG can override the detail screenshot target.
- Captures wide, desktop, and mobile screenshots for the selected tool detail page.
- Did not modify tool detail UI, data flow, backend, database, routes, or dependencies.

### Step 32 - Tool detail warm editorial redesign

Status: completed

- Unified /tools/[slug] into the warm dark editorial direction used across the public portal.
- Preserved the dynamic route entry, getToolBySlug, getRelatedTools, and the desktop/mobile rendering split.
- Kept the external website and download actions, related tools, collapsible descriptions, and not-found state intact.
- Added warm detail-page CSS tokens and surfaces without touching backend, database, Supabase, or screenshot scripts.
- Did not modify package.json, package-lock.json, scripts, the tools listing page, or any homepage component.

### Step 33 - Public site header warm editorial fix

Status: completed

- Fixed the old light public header that appeared above warm editorial tool detail pages.
- Restyled the shared public site header with warm dark background, low-opacity border, and gold accent.
- Preserved navigation links and actions.
- Did not modify tool detail data flow, dynamic route entry, backend, database, Supabase logic, package files, or dependencies.

### Step 35 - Articles visual QA capture

Status: completed

- Added a dedicated Playwright screenshot script for /articles and /articles/[slug].
- Added npm run capture:articles.
- Default article detail screenshot target is /articles/free-ai-tools-safety.
- ARTICLE_SLUG can override the detail screenshot target.
- Captures wide, desktop, and mobile screenshots for both the articles list and selected article detail page.
- Did not modify article UI, data flow, backend, database, routes, or dependencies.

### Step 36 - Articles listing warm editorial redesign

Status: completed

- Restyled the /articles listing page into the warm dark editorial direction used by the rest of the public portal.
- Preserved the existing query, category, and tag filtering logic without changing the article data flow.
- Reworked the hero, filter panel, article cards, ad slot, and empty state for a more cohesive reading flow.
- Did not modify the article detail page, backend, database, routes, screenshot scripts, or dependencies.

### Step 37 - Article detail warm editorial redesign

Status: completed

- Restyled /articles/[slug] detail pages to match the warm editorial portal direction.
- Preserved getArticleBySlug and getRelatedArticles data flow.
- Preserved article sections, related articles, ad slot, copyright notice, and not-found state.
- Did not modify the article listing page, backend, database, Supabase logic, scripts, package files, or dependencies.
