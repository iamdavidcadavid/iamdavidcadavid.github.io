# Implementation Plan: Personal Content Website (Home, About, Contact, Blog, Photos, Sales, Easter Egg)

**Branch**: `001-content-website` | **Date**: 2026-09-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-content-website/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

A bilingual (English default, Spanish at `/es/`), fully static personal site with five public
pages (Home — welcome banner + About + Contact sections, Blog, Photos) and two unlisted,
unindexed pages (Sales, Easter Egg), built with the Astro framework (latest, v7.x) in static
output mode. Blog posts and photo albums each also get their own dedicated, shareable detail
page, statically generated per entry via Astro's `getStaticPaths()`. All content (blog posts,
photo albums/photos, sale items) is authored as local content-collection files; there is no
backend, database, or server-side code of any kind — the Sales password gate is a
client-side-only check, matching the project constitution's static-site principle and the
user's explicit "no backend code" instruction. Styling is plain CSS (no framework), since the
site's small, fixed styling surface (one brand palette, one breakpoint, a handful of custom
components) doesn't need one. The existing GitHub Pages workflow is updated to build the Astro
project and publish its static output.

## Technical Context

**Language/Version**: TypeScript/JavaScript on Astro 7.x (latest stable — 7.3.3 at plan time),
Node.js ≥22.12.0 (Astro 7's minimum supported Node version)

**Primary Dependencies**: `astro` (core framework, static output mode); `@astrojs/sitemap`
(sitemap generation, filtered to exclude Sales/Easter Egg); no UI framework (React/Vue/Svelte)
and no CSS framework — plain HTML/CSS/vanilla JS "islands" only, per the constitution's
static-site-simplicity principle, since none of this feature's interactivity (hamburger toggle,
load-more, carousel, lightbox modal, password gate) needs more than that

**Storage**: N/A (no database/backend). Content lives as local files under `src/content/`
(Astro content collections: Markdown for blog posts, YAML/JSON for photo albums and sale
items), validated at build time with Zod schemas

**Testing**: Manual verification via `quickstart.md` validation scenarios (build + local
preview, checked at the 375px / 768px / 1440px viewports from the spec's Clarifications). The
constitution does not mandate an automated test framework and the spec defines no automated
test requirement, so no test runner is introduced for this feature — see research.md for the
rationale and the (rejected) alternative of adding Playwright/Vitest now

**Target Platform**: Static HTML/CSS/JS served by GitHub Pages; evergreen desktop and mobile
browsers (latest two versions of Chrome, Firefox, Safari, Edge)

**Project Type**: Single static site project (Astro), web frontend only — no backend/API
project exists or is introduced

**Performance Goals**: No numeric target is set by the spec; Astro's static output (zero
client-side JS by default, JS added only for the specific interactive widgets this feature
needs) is relied on to keep pages fast without a dedicated performance budget in this iteration

**Constraints**: No server-side code of any kind (constitution Principle III + explicit user
instruction); must deploy via the existing GitHub Pages pipeline; Sales page password check
MUST be client-side only and is explicitly understood not to be real security; every page MUST
exist at both an English URL and a Spanish URL (`/es/` prefix) per the spec's Clarifications;
visual design MUST use only the ratified brand palette

**Scale/Scope**: Personal-site scale — 5 public pages + 2 hidden pages, each in 2 languages;
content catalogs (blog posts, photo albums, sale items) sized in the dozens, not thousands, of
entries (per spec Assumptions)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Constraint | Gate | Status |
|---|---|---|
| I. Authentic Professional Representation | Plan does not fabricate bio content; About/Contact sections use placeholders per FR-007, to be replaced manually later | PASS |
| II. Bilingual Parity (NON-NEGOTIABLE) | Every route generated in English (default, unprefixed) and Spanish (`/es/`) via Astro's built-in i18n routing; visible switch control on every page (FR-010/FR-011) | PASS |
| III. Static-Site Simplicity | Astro used strictly in static output mode (no SSR adapter, no server runtime); no framework/dependency added beyond what this feature's interactivity requires | PASS |
| IV. Accessible & Responsive by Default | Semantic HTML, alt text on all images, keyboard-operable nav/modal/carousel, 768px responsive breakpoint (from Clarifications) applied throughout | PASS (enforced during implementation/tasks, not further gated here) |
| V. Reliable Contact & Hiring Pathways | Mailto button + LinkedIn/GitHub/YouTube links on Home, present in both languages (FR-015–FR-017) | PASS |
| VI. Blog Content Integrity | Blog content-collection schema requires a publish date field; content is the owner's own (placeholders until replaced) | PASS |
| Technical Constraints — hosting | GitHub Pages hosting model unchanged; only the build step is added (constitution explicitly permits this) — `.github/workflows/static.yml` updated to build Astro and publish `dist/` | PASS |
| Technical Constraints — i18n structure | Content collections organized per locale subfolder; shared Astro layouts/components reused across languages, not duplicated logic | PASS |
| Technical Constraints — brand palette | Palette defined once as CSS custom properties in a shared stylesheet, consumed everywhere; no arbitrary colors introduced | PASS |
| Technical Constraints — no invasive tracking | No analytics/tracking dependency is introduced by this plan | PASS |

No violations requiring justification — the Complexity Tracking table below is intentionally
empty.

**Post-Phase 1 re-check** (after research.md, data-model.md, contracts/, and quickstart.md were
written): all rows above still hold. The one design choice most worth re-checking against the
constitution — keeping Sale item data out of the content-collection build pipeline, in
`public/sales-catalog.*.json` instead — remains static (no server) and does not weaken Principle
III; it exists specifically to make FR-032's "no server-side component" and SC-005's "not
present in the page" both literally true at once. No new violations were introduced during
design. Gate: **PASS**.

**Post-revision re-check** (after adding individual blog post/album pages via
`getStaticPaths()`, per FR-020/FR-028/SC-009): still fully static — `getStaticPaths()` runs at
build time, producing plain pre-rendered HTML files, so this adds pages, not a server (Principle
III intact). Each new page also ships in both languages by construction, since it's generated
per locale subfolder (Principle II intact). No new violations. Gate: **PASS**.

## Project Structure

### Documentation (this feature)

```text
specs/001-content-website/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── content-schemas.md
│   └── routing-contract.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
astro.config.mjs           # i18n config (en default, es prefixed), sitemap integration
package.json
tsconfig.json

src/
├── content.config.ts       # Content collection definitions + Zod schemas
├── content/
│   ├── blog/
│   │   ├── en/*.md          # Blog posts, English
│   │   └── es/*.md          # Blog posts, Spanish
│   └── albums/
│       ├── en/*.yaml         # Photo album metadata + photo lists, English
│       └── es/*.yaml         # Photo album metadata + photo lists, Spanish
│       # NOTE: Sale items are NOT a content collection — see public/ below and
│       # research.md §7 for why they're kept out of the built page HTML/JS
├── config/
│   └── site.ts              # Site-wide config: blog/sales page size, contact usernames
├── layouts/
│   └── BaseLayout.astro     # Shared header + footer + <head>, used by every page
├── components/
│   ├── NavBar.astro          # Full nav + hamburger toggle (below 768px)
│   ├── LanguageSwitch.astro  # Uses astro:i18n getRelativeLocaleUrl()
│   ├── AboutSection.astro
│   ├── ContactSection.astro
│   ├── BlogList.astro        # Load-more list, alternating row styling, oven animation
│   ├── AlbumGrid.astro       # Photos index: cover + title grid, links to each [album] page
│   ├── PhotoLightbox.astro   # Photo list + enlarge modal, empty-album state; used by [album].astro
│   ├── SalesGate.astro       # Client-side password check + post-auth fetch of catalog JSON
│   └── Carousel.astro        # Shared by Sales item photos
├── pages/
│   ├── index.astro           # English Home (banner + About + Contact)
│   ├── blog/
│   │   ├── index.astro        # List: title + excerpt, Load More, oven animation
│   │   └── [slug].astro       # One per blog entry (getStaticPaths): full post body
│   ├── photos/
│   │   ├── index.astro        # Grid of album covers + titles
│   │   └── [album].astro      # One per album entry (getStaticPaths): photo list + modal
│   ├── sales/index.astro     # excluded from nav + sitemap + robots
│   ├── easter-egg/index.astro# excluded from nav + sitemap + robots
│   └── es/
│       ├── index.astro
│       ├── blog/
│       │   ├── index.astro
│       │   └── [slug].astro
│       ├── photos/
│       │   ├── index.astro
│       │   └── [album].astro
│       ├── sales/index.astro
│       └── easter-egg/index.astro
├── styles/
│   └── global.css            # Brand palette as CSS custom properties, reset, breakpoint vars
└── assets/
    └── placeholders/         # Placeholder profile photo, album covers, etc.

public/
├── robots.txt                # Disallow /sales/, /es/sales/, /easter-egg/, /es/easter-egg/
├── sales-catalog.en.json     # Sale items data, fetched client-side only after correct password
└── sales-catalog.es.json

.github/workflows/
└── static.yml                # UPDATED: npm ci && npm run build, then upload ./dist
```

**Structure Decision**: Single Astro project at the repository root (no separate
frontend/backend split — none is needed or permitted by the constitution). Astro's file-based
routing under `src/pages/` directly encodes the site's IA: English routes at the top level,
Spanish routes mirrored one-for-one under `src/pages/es/`, matching the `/es/`-prefix decision
in the spec's Clarifications. `blog/[slug].astro` and `photos/[album].astro` use Astro's
`getStaticPaths()` to pre-render one real, shareable static page per content-collection entry
(FR-020, FR-028, SC-009), keeping the list pages (`blog/index.astro`, `photos/index.astro`)
focused purely on the list/grid + pagination/empty-state behavior. Reusable UI (nav, sections,
list/gallery widgets) lives in `src/components/` and is shared by both language trees so there
is exactly one implementation of each behavior, not two. Content authors edit files under
`src/content/`, split into `en/` and `es/` subfolders per collection, following Astro's
documented i18n content-collection pattern. The Sales page's item data is intentionally kept
out of `src/content/` (which gets baked into the built HTML/JS) and instead lives in
`public/sales-catalog.*.json`, fetched by client-side JS only after the password check passes —
this is what makes SC-005 ("no item content present in the page prior to a correct password")
literally true rather than merely visually hidden, and is also why Sale items (unlike blog
posts and albums) do not get their own dedicated route.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — this section is intentionally empty.
