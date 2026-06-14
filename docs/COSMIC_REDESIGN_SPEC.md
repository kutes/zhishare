# Cosmic Redesign Spec

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

## 1. Homepage Structure

The homepage is a content-rich resource portal.

Required modules:

1. Hero discovery area
   - Main title: `探索 · 发现`
   - English subtitle: `EXPLORE · DISCOVER`
   - Short description line
   - Practical search bar
   - Hotword/category pills
   - Primary and secondary CTA buttons

2. Primary category gateway
   - AI 工具
   - 在线工具
   - 开发项目
   - 软件资源
   - 教程指南

3. Partner ad strip
   - Four compact sponsor cards
   - Must use small `推广` / `sponsor` style labels
   - Must not use flashy ads

4. Featured resources
   - One large featured resource
   - Four compact resource cards

5. Mid-page banner ad
   - Warm dark banner
   - Suitable for sponsorship or internal promotion

6. Latest reviews and practical guides
   - Two columns on desktop
   - Single column on mobile

7. Ranking blocks
   - Four ranking cards
   - Five links per card

## 2. Visual Rules

- Use warm black, warm gold, and low-opacity warm surfaces.
- Do not use the old realistic sun background.
- Do not reintroduce heavy glassmorphism.
- Do not use noisy gradients.
- Do not use colorful third-party logos unless a later task explicitly requires it.
- Keep text contrast readable.
- Mobile layout must not overflow horizontally.

## 3. QA Rules

Before commit:

- `npm run lint`
- `npm run build`
- `npm run capture:homepage`
- Verify desktop and mobile screenshots.
- Verify search submits to `/search?q=AI`.
- Verify no red console runtime errors.
- Verify no mojibake text.

## 4. Frontend Scope

Only edit frontend files when a task explicitly allows it. The current allowed scope remains public-facing pages and the homepage component files already introduced by earlier steps.

Forbidden areas remain:

- `src/app/admin/**`
- `src/app/api/**`
- `src/lib/**` unless explicitly required
- Supabase code
- database schema

## 5. Homepage Component Strategy

The homepage is split into focused components under `src/components/home/`.

Keep the split structure and do not merge it back into a single large file.

## 6. Future Baseline

The warm editorial HTML concept is the current visual baseline.

Keep the design direction:

- Warm dark background: `#120F0E`
- Warm gold accent: `#E3A75F`
- Surface: `rgba(255, 247, 237, 0.04)`
- Hover surface: `rgba(255, 247, 237, 0.07)`
- Border: `rgba(255, 247, 237, 0.09)`
- Hover border: `rgba(224, 167, 95, 0.4)`
- Text: `#F7F1EA`
- Muted text: `#AFA399`
- Faint text: `#756B64`
- Chinese serif hero title direction: Songti SC / Noto Serif SC / STSong
- Compact editorial buttons
- Clean practical search bar
- Content portal structure preserved
