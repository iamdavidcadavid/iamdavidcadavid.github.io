# Implementation Plan: Now Page & Photo Navigation Polish

**Branch**: `003-now-page-photo-nav` | **Date**: 2026-09-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-now-page-photo-nav/spec.md`

## Summary

Four independent polish items layered on the existing static Astro site: (1) in-modal next/previous
navigation with an aligned caption for the Photos page's `PhotoLightbox` and the Sales page's
`SalesGate` enlarged photo views, including left/right-arrow-key support, so a visitor never has to
close and reopen the enlarged view to see another photo in the same album/product; (2) a new bilingual
"Now" page, reachable from primary navigation, showing the latest status update plus a native
`<details>`-based accordion of prior updates; (3) raising the blog's initial page size from 5 to 6;
(4) adding vertical breathing room (5–10px) to the sticky header on both mobile and desktop. All four
are implemented as static-site-compatible Astro components/content plus the vanilla client-side JS
already used elsewhere in this codebase — no new dependencies, no server/runtime changes.

## Technical Context

**Language/Version**: Astro components (`.astro`) with embedded TypeScript, targeting Node.js ≥22.12.0 (matches `package.json` `engines`)

**Primary Dependencies**: Astro 7.3.3 (`astro:content`, `astro:i18n`), `@astrojs/sitemap` — both already in use; no new dependencies required

**Storage**: N/A (static site). New "Now Update" content is authored as markdown files in a new `now` Astro Content Collection, following the same locale-prefixed `glob()` loader pattern already used for `blog`/`albums`

**Testing**: No automated test framework in this repo (consistent with features 001/002); validation is `npm run build` (static-generation correctness) plus manual/browser-based verification via the local preview server, covering both languages and mobile/desktop widths per the constitution's workflow section

**Target Platform**: Static site hosted on GitHub Pages; evaluated in modern desktop and mobile browsers

**Project Type**: Single static web project (Astro), no frontend/backend split

**Performance Goals**: Enlarged-view photo navigation and accordion expand/collapse must feel instantaneous — purely client-side (DOM show/hide or native `<details>` toggle), no network round-trip

**Constraints**: No server-side runtime may be introduced (Principle III); all interactivity uses vanilla JS embedded in `.astro` components, matching the existing `Carousel`/`PhotoLightbox`/`SalesGate` pattern; the Now page's expand/collapse MUST use the simplest solution available — native `<details>`/`<summary>`, not a custom JS accordion — per Principle III's "prefer the simplest solution that satisfies the other principles"

**Scale/Scope**: Photos/Sales pages already contain a handful of placeholder albums/items (some single-photo, some multi-photo) usable as-is for testing both the "arrows shown" and "arrows hidden" paths; the Now page ships with a small number of placeholder update entries (one latest + a couple of prior ones) to exercise the accordion

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment |
|---|---|
| I. Authentic Professional Representation | Now page ships with clearly marked `[PLACEHOLDER]` content, same convention as every other page's placeholder copy — no fabricated claims about the owner. PASS |
| II. Bilingual Parity (NON-NEGOTIABLE) | New `now` collection is authored under both `en/` and `es/` from the start (mirrors `blog`/`albums`); Now page gets both an unprefixed English route and an `/es/` route, wired into the existing `LanguageSwitch` (already path-generic, no changes needed). PASS |
| III. Static-Site Simplicity | No new dependencies; accordion uses native `<details>`/`<summary>` instead of custom JS; photo navigation extends existing vanilla-JS component scripts. All output remains static HTML/CSS/JS. PASS |
| IV. Accessible & Responsive by Default | Native `<details>` gives keyboard + screen-reader accordion support for free; enlarged-view navigation adds explicit left/right arrow-key support (FR-007) alongside on-screen buttons; existing alt-text is surfaced as a visible caption (FR-005), improving accessibility rather than regressing it. PASS |
| V. Reliable Contact & Hiring Pathways | Not touched by this feature. PASS (no change) |
| VI. Blog Content Integrity | Blog page-size change is a display-count constant only; post authorship/dates/translation-pending semantics are untouched. PASS |

No violations. Complexity Tracking table is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/003-now-page-photo-nav/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md         # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── routing-contract.md
│   └── interaction-contract.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── content.config.ts                # MODIFY: add `now` collection (glob loader, date+title schema)
├── content/
│   └── now/
│       ├── en/
│       │   ├── <slug-1>.md          # NEW: latest placeholder update (English)
│       │   └── <slug-2>.md          # NEW: prior placeholder update (English)
│       └── es/
│           ├── <slug-1>.md          # NEW: latest placeholder update (Spanish)
│           └── <slug-2>.md          # NEW: prior placeholder update (Spanish)
├── config/
│   └── site.ts                      # MODIFY: blogPageSize 5 -> 6
├── components/
│   ├── NavBar.astro                 # MODIFY: insert "Now" link after "Home"
│   ├── PhotoLightbox.astro          # MODIFY: modal prev/next + caption + arrow-key nav
│   └── SalesGate.astro              # MODIFY: shared modal prev/next + caption + arrow-key nav
├── layouts/
│   └── BaseLayout.astro             # MODIFY: vertical padding on .site-header-inner
└── pages/
    ├── now/
    │   └── index.astro              # NEW: English Now page (latest + accordion)
    └── es/
        └── now/
            └── index.astro          # NEW: Spanish Now page (latest + accordion)
```

**Structure Decision**: Single static Astro project (existing structure from features 001/002 is
reused as-is). No new top-level directories; the only new route family is `now/` (English) and
`es/now/` (Spanish), mirroring the existing `contact/` / `es/contact/` pattern. No frontend/backend
split, no additional projects — Principle III forecloses that option.

## Post-Design Constitution Re-check

Phase 1 design (data-model.md, contracts/) introduces one new content collection (markdown,
same loader pattern as `blog`) and two new static routes (`/now/`, `/es/now/`); no new runtime
dependency, no server code, no deviation from the pre-design assessment above. All six
principles remain PASS.

## Complexity Tracking

*No Constitution Check violations — table intentionally omitted.*
