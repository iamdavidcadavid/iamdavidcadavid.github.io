# Implementation Plan: Site Design Restyle

**Branch**: `004-design-restyle` | **Date**: 2026-09-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-design-restyle/spec.md`

## Summary

Restyle every page of the static Astro site to the handoff in `design/` (tokens, typography,
chrome, per-page layouts, motion) and add a light/dark theme, a redesigned Home, a bilingual 404
page and a standalone maintenance page, while keeping every behavior from features 001–003.

Technical approach: replace the old palette in `src/styles/global.css` with the design token set,
defined once per token using CSS `light-dark()` so the dark theme needs no duplicated values and
visitors without JavaScript still follow their device preference. A tiny inline `<head>` script
applies a saved theme before first paint. Fonts are self-hosted through Astro's built-in fonts
feature, and David's photo is optimized through Astro's built-in image pipeline. Neither adds a
dependency. Shared UI strings move into one EN/ES dictionary, repeated page-title markup becomes one
`PageTitle` component, and the duplicated Now-page markup becomes one `NowTimeline` component.
The rest is per-component restyling.

## Technical Context

**Language/Version**: Astro 7.3.3 components (`.astro`) with TypeScript; Node.js ≥22.12.0

**Primary Dependencies**: `astro` (built-in `fonts` config + `<Font>`, `astro:assets` `<Image>`,
`astro:i18n`, `astro:content`), `@astrojs/sitemap`. `sharp` is already installed as Astro's
optional dependency (in `package-lock.json`). **No new packages.**

**Storage**: N/A (static site). The only client-side state is the visitor's theme choice in
`localStorage` (see data-model.md). Existing content collections are unchanged.

**Testing**: No automated test suite (as in 001–003). Validation is `npm run build` plus
browser-based checks against `quickstart.md`, in both themes, both languages and both breakpoints,
side by side with the design artboards.

**Target Platform**: GitHub Pages (static). Modern evergreen browsers. The design already
requires `oklch()`; this plan also uses `light-dark()` (supported in all current major browsers
since 2024).

**Project Type**: Single static web project (Astro)

**Performance Goals**: No perceptible regression versus today. David's 2 MB PNG is served as
optimized responsive images (≈100 KB class). Two font families (serif 400; sans 300–600 + italic)
are preloaded and served from the site. No layout shift from late theme application.

**Constraints**: No server runtime (Principle III). No third-party requests at runtime (FR-006,
constitution privacy constraint). Every color comes from the token set (constitution design-token
rule). All animation is gated behind `prefers-reduced-motion: no-preference`. Single 768px
breakpoint. The maintenance page must work with no other site files (FR-033).

**Scale/Scope**: ~30 generated pages across 2 locales. About 20 existing files restyled, 12
created, 2 deleted (see Project Structure).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / constraint | Assessment |
|---|---|
| I. Authentic Professional Representation | Home gains David's real photo; role chips and subline come from the owner's own design; placeholder copy stays clearly marked. PASS |
| II. Bilingual Parity (NON-NEGOTIABLE) | Every new string has an EN/ES pair ([contracts/ui-copy.md](./contracts/ui-copy.md)); nav labels become localized; Spanish `<title>`s fixed. The 404 and maintenance pages show both languages inline and so carry no switch (justified below). PASS |
| III. Static-Site Simplicity | Zero new dependencies: built-in fonts API, built-in image optimization, native `<details>`, vanilla scripts. Output stays static files. Dead `Carousel.astro` removed. PASS |
| IV. Accessible & Responsive by Default | Contrast was checked for every text/background token pair in both themes (research §4). One light-theme failure (`--faint` as text) is resolved by pairing, per the design-token rule. Reduced motion fully honored; `aria-current` marks the active nav item; the menu closes on Escape; existing keyboard support is kept. PASS |
| V. Reliable Contact & Hiring Pathways | Contact links are restyled, not changed; re-verified in both languages (quickstart). PASS |
| VI. Blog Content Integrity | Posts gain a visible publish date, closing an existing gap. PASS |
| Tech: design tokens | All colors move to tokens, including chip dots, backdrop and shadows; the three hard-coded hex values flagged by constitution v1.2.0 are removed. The maintenance page's inline token copy is justified below. PASS (with justification) |
| Tech: privacy / no third-party | Fonts downloaded at **build** time and served from the site; runtime makes 0 third-party requests. PASS |
| Tech: hosting | Unchanged; the 404 page is picked up by GitHub Pages automatically; `maintenance.html` is a static file. PASS |

## Project Structure

### Documentation (this feature)

```text
specs/004-design-restyle/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── routing-contract.md      # new/changed routes, sitemap, active-nav mapping
│   ├── interaction-contract.md  # theme, mobile menu, Home photos, catalog dots, 404
│   └── ui-copy.md               # every new/changed UI string, EN + ES (owner review)
└── tasks.md             # Phase 2 output (/speckit-tasks — not created here)
```

### Source Code (repository root)

```text
astro.config.mjs                     # MODIFY: `fonts` (Young Serif, Onest); sitemap filter adds 404
design/assets/david.png              # (input) copied to src/assets/david.png

public/
└── maintenance.html                 # NEW: standalone 503 page (inline CSS, no site assets)

src/
├── styles/global.css                # REWRITE: tokens (light-dark), base type, motion keyframes,
│                                    #   shared .card / .btn utilities
├── i18n/ui.ts                       # NEW: shared EN/ES UI strings + t(locale, key)
├── lib/format.ts                    # NEW: formatDate (UTC), excerptFor (moved from BlogList)
├── assets/
│   ├── david.png                    # NEW: profile photo (optimized at build via <Image>)
│   └── placeholders/profile-photo.svg  # DELETE: replaced by david.png
├── layouts/BaseLayout.astro         # MODIFY: <Font>, no-flash theme script, new header, footer
├── components/
│   ├── NavBar.astro                 # REWRITE: nav pill, active item, localized labels, menu card
│   ├── LanguageSwitch.astro         # MODIFY: "EN / ES" format (rendered in header + menu)
│   ├── ThemeToggle.astro            # NEW: sun/moon pill, persists choice
│   ├── PageTitle.astro              # NEW: serif H1 + blue period + slide-left entrance
│   ├── AboutSection.astro           # MODIFY: becomes the "A bit about me" card
│   ├── HomeHero.astro               # NEW: H1, subline, chips, about card, photo, CTAs
│   ├── HomeNowCard.astro            # NEW
│   ├── HomeWritingCard.astro        # NEW
│   ├── HomePhotosCard.astro         # NEW: random tiles + photo viewer (via PhotoLightbox)
│   ├── BlogList.astro               # REWRITE: rows-in-card, CSS oven empty state
│   ├── AlbumGrid.astro              # MODIFY: cards with cover, title, count
│   ├── PhotoLightbox.astro          # MODIFY: restyle, `layout` prop (grid|tiles), CSS camera
│   ├── NowTimeline.astro            # NEW: shared Now markup (latest card + Earlier updates)
│   ├── ContactSection.astro         # REWRITE: link rows card + framed 4:5 image
│   ├── SalesGate.astro              # MODIFY: restyle gate/catalog, position dots
│   ├── SalesNoScript.astro          # MODIFY: centred "!" card
│   └── Carousel.astro               # DELETE: unused (never imported) and uses removed tokens
└── pages/
    ├── index.astro, es/index.astro                        # REWRITE: Home composition
    ├── blog/index.astro, es/blog/index.astro              # MODIFY: PageTitle + "N posts"
    ├── blog/[slug].astro, es/blog/[slug].astro            # MODIFY: post layout + date
    ├── photos/index.astro, es/photos/index.astro          # MODIFY: PageTitle
    ├── photos/[album].astro, es/photos/[album].astro      # MODIFY: back link, title + count
    ├── now/index.astro, es/now/index.astro                # MODIFY: use NowTimeline
    ├── contact/index.astro, es/contact/index.astro        # MODIFY: PageTitle + intro
    ├── sales/index.astro, es/sales/index.astro            # MODIFY: PageTitle, 440px column
    ├── easter-egg/index.astro, es/easter-egg/index.astro  # REWRITE: wobbling egg
    └── 404.astro                                          # NEW: bilingual 404
```

**Structure Decision**: Same single Astro project and per-locale page mirroring as 001–003. New
code goes into the existing `components/`, plus two small shared modules (`i18n/ui.ts`,
`lib/format.ts`) that replace repeated inline helpers. No new top-level project, framework or
build step.

## Post-Design Constitution Re-check

Phase 1 artifacts (data-model, three contracts, quickstart) introduce no server code, no new
dependency and no runtime third-party request. The only new persistent state is the theme choice,
kept in the visitor's own browser and never transmitted. All six principles remain PASS. The two
justified items below are unchanged by the design phase.

## Complexity Tracking

| Deviation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| `public/maintenance.html` repeats the token values inline instead of using `global.css` | FR-033: the maintenance page must work with no other site files, since it's used when the rest of the site may be unavailable | Linking `global.css` or the font files would break exactly when the page is needed. The inline block is marked "keep in sync with global.css" and holds only the tokens the page uses |
| The 404 and maintenance pages have no language switch (Principle II requires a visible switch on every page) | Both pages render the English and Spanish text together, because the visitor's language is unknown at the site root | A switch would link to `/es/404/`, which doesn't exist on a static host, and would offer a language that's already on screen |
