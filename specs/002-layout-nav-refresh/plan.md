# Implementation Plan: Layout, Navigation & Content Restructuring

**Branch**: `002-layout-nav-refresh` | **Date**: 2026-09-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-layout-nav-refresh/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Ten UI/IA refinements layered onto the already-implemented `001-content-website` site: a
consistent sticky header (nav/hamburger left, language switch right, both inside the same
content-width container as page body copy); merging the Home/About content into a single Home
page (dropping the separate "About" nav entry); promoting Contact from a Home-page anchor to
its own dedicated page with an image; restyling the email action as an icon-button matching
LinkedIn/GitHub/YouTube (with a real GitHub/YouTube icon instead of the current "gh"/"▶"
placeholders); a footer quote; and a two-column, equal-height Blog grid. No new dependencies,
no new content-collection entities, no backend — this is a restructuring/restyling pass over
existing Astro components (`BaseLayout`, `NavBar`, `ContactSection`, `AboutSection`,
`BlogList`) and two new page files (`contact/index.astro` in each locale).

## Technical Context

**Language/Version**: Unchanged from 001 — TypeScript/JavaScript on Astro 7.x, static output
mode, Node.js ≥22.12.0.

**Primary Dependencies**: No new dependencies. Reuses `astro:i18n`, `astro:content`, plain CSS,
vanilla JS already in the project. GitHub/YouTube/mail icons are hand-authored inline SVG
(matching the project's existing no-icon-library approach), not a new package.

**Storage**: N/A — no new data entities (see data-model.md). This feature restructures existing
UI components and static copy, not content-collection schemas.

**Testing**: Manual, via `quickstart.md`, consistent with 001. Given two real bugs in 001 were
only caught by actually clicking through a running preview (not by reading generated HTML), this
feature's quickstart explicitly requires browser-based verification of the sticky header,
hamburger position, and Blog grid row-height behavior — those are exactly the kind of
runtime/layout behaviors static output can't confirm.

**Target Platform**: Unchanged — static HTML/CSS/JS on GitHub Pages, evergreen browsers.

**Project Type**: Unchanged — single Astro project, no backend.

**Performance Goals**: No new targets; sticky positioning and CSS Grid are both native browser
features with no measurable overhead at this site's scale.

**Constraints**: Must not disturb 001's existing bilingual routing, hidden-page exclusion, or
Sales/Photos functionality while restructuring the header and Home/Contact pages. Must avoid the
exact CSS-specificity pitfall found in 001 (a class rule's `display` value silently overriding
the `[hidden]` attribute) when adding any new conditionally-shown element.

**Scale/Scope**: Touches `BaseLayout.astro`, `NavBar.astro`, `global.css`, `AboutSection.astro`,
`ContactSection.astro`, `BlogList.astro`, `index.astro` (×2 locales); adds `contact/index.astro`
(×2 locales) and one new placeholder image. No change to Blog/Photos/Sales/Easter Egg data or
routing beyond the Blog grid's own CSS and container width.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Constraint | Gate | Status |
|---|---|---|
| I. Authentic Professional Representation | No content claims changed; Contact's new image is a placeholder per FR-007/001 convention | PASS |
| II. Bilingual Parity (NON-NEGOTIABLE) | Every changed/new page (Home, new Contact page, Blog) ships in both `en`/`es`; the footer quote branches on `Astro.currentLocale` (research.md §7) rather than assuming shared-component markup is automatically bilingual | PASS |
| III. Static-Site Simplicity | No new dependency; sticky header and 2-column grid are native CSS; icons are inline SVG, not an icon-library package | PASS |
| IV. Accessible & Responsive by Default | New icon-buttons keep `aria-label`s (existing pattern); sticky header re-verified not to obscure content; hamburger/dropdown keyboard behavior unchanged | PASS |
| V. Reliable Contact & Hiring Pathways | Contact becomes a first-class page (arguably *more* discoverable than an anchor); all four contact actions remain present and functional | PASS |
| VI. Blog Content Integrity | Unaffected — only list layout (grid) changes, not post data/authorship/dates | PASS |
| Technical Constraints — brand palette | No new colors introduced; icons use existing neutral/palette colors | PASS |
| Technical Constraints — i18n structure | New Contact page follows the same per-locale `src/pages/` mirroring already established | PASS |
| Technical Constraints — hosting | No change to build/deploy | PASS |

No violations — Complexity Tracking is intentionally empty.

**Post-Phase 1 re-check**: after writing research.md/data-model.md/contracts/quickstart.md, the
riskiest design choice — reusing the header's existing `position: sticky` containing-block
behavior (via the already-sticky `.site-header`) to keep the mobile dropdown full-width without
adding a second positioned wrapper — remains pure CSS, no new dependency, no server involvement.
Gate: **PASS**.

**Post-analyze re-check**: `/speckit-analyze` found that FR-011's footer quote, as originally
planned, would have shipped English-only on Spanish pages — a real Principle II violation, since
`BaseLayout.astro` had never before carried translatable prose and nothing in this plan made the
new text locale-aware. Fixed by branching the footer on `Astro.currentLocale` (research.md §7),
the same static, build-time, no-server pattern already used everywhere else on the site. No new
violations. Gate: **PASS**.

## Project Structure

### Documentation (this feature)

```text
specs/002-layout-nav-refresh/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output (no new entities — documents what's unchanged)
├── quickstart.md         # Phase 1 output
├── contracts/
│   └── routing-contract.md   # Updated nav/route contract (supersedes 001's for Home/Contact)
└── tasks.md              # Phase 2 output (/speckit-tasks — not created here)
```

### Source Code (repository root) — changes only, relative to the existing 001 tree

```text
src/
├── styles/
│   └── global.css            # ADD: --content-max-width token + .site-container utility class
├── layouts/
│   └── BaseLayout.astro      # CHANGE: header gets a .site-header-inner container (nav left,
│                              #   language right); .site-header's old padding/flex properties
│                              #   are REPLACED (not extended) with position: sticky — see
│                              #   research.md §2's I1 note before editing; footer quote branches
│                              #   on Astro.currentLocale (research.md §7)
├── config/
│   └── site.ts                # CHANGE: ContactPlatform gains 'email'; contactLinks gains a 4th
│                              #   entry; contactLinkUrl gains a matching case (research.md §6)
├── components/
│   ├── NavBar.astro          # CHANGE: drop "About" link, change "Contact" link to /contact/
│                              #   page URL (not #contact anchor); remove the mobile-only
│                              #   width:100%/justify-content:flex-end hack (see research.md)
│   ├── AboutSection.astro    # CHANGE: drop id="about" (no longer an independent nav target);
│                              #   content/layout otherwise unchanged
│   ├── ContactSection.astro  # CHANGE: drop id="contact"; email becomes a 4th icon-button
│                              #   (mail SVG) rendered via the same contactLinks.map() as the
│                              #   other three (research.md §6); GitHub/YouTube icons become
│                              #   real inline-SVG marks; add an image (new prop/slot)
│   └── BlogList.astro        # CHANGE: .blog-list becomes a 2-column CSS Grid (native
│                              #   grid row-stretch gives equal height "for free" — FR-013);
│                              #   container widened to match the new shared content width;
│                              #   is-even/is-odd class logic unchanged (research.md §3 — reads
│                              #   as solid alternating columns, a deliberate choice)
├── pages/
│   ├── index.astro           # CHANGE: drop <ContactSection /> (moved to its own page)
│   ├── contact/
│   │   └── index.astro       # NEW: English Contact page — BaseLayout + ContactSection
│   ├── es/
│   │   ├── index.astro       # CHANGE: same as English index.astro
│   │   └── contact/
│   │       └── index.astro   # NEW: Spanish equivalent
└── assets/placeholders/
    └── contact-photo.svg      # NEW: placeholder image for the Contact page (research.md §5)
```

**Structure Decision**: No new routes beyond `contact/index.astro` (×2 locales) — everything
else is an edit to an existing file. `AlbumGrid`/`PhotoLightbox`/`SalesGate`/Blog `[slug]` pages
and the Photos/Sales/Easter Egg routes are untouched. The header's new max-width container is a
single reusable `.site-container` utility in `global.css` rather than a one-off style in
`BaseLayout`, so it's available if a future feature wants the same content width elsewhere.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — this section is intentionally empty.
