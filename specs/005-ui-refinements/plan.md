# Implementation Plan: UI Refinements

**Branch**: `005-ui-refinements` | **Date**: 2026-09-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-ui-refinements/spec.md`

## Summary

Six small refinements on top of the feature 004 restyle:
- The two enlarged photo viewers (album and Sales) drop their visible caption and move the
  previous/next arrows to the photo's sides, vertically centred.
- The Sales product-card carousel gets the same side arrows and loses its dots.
- The Home Photos card becomes a plain, non-interactive photo mosaic.
- The theme switch becomes a single on/off control that always flips.
- The footer shows the quote first.
- "I'm" becomes "I am" on Home and Now (English).
- The LinkedIn handle becomes `iamdavidcadavid`.

All of it is markup, CSS and small script changes in existing components. There are no new
dependencies and no new pages.

## Technical Context

**Language/Version**: Astro 7.3.3 components (`.astro`) with TypeScript; Node.js ≥22.12.0

**Primary Dependencies**: `astro`, `@astrojs/sitemap` (unchanged). **No new packages.**

**Storage**: N/A. The theme choice stays in `localStorage.theme` exactly as in feature 004.

**Testing**: No automated suite (as in 001–004). Validation is `npm run build` plus the
browser-based walkthrough in `quickstart.md`, in both themes, both languages and both breakpoints.

**Target Platform**: GitHub Pages (static), modern evergreen browsers

**Project Type**: Single static web project (Astro)

**Performance Goals**: No change. Removing the viewer from the Home Photos card removes a little
markup and script from Home.

**Constraints**: Colours come only from `src/styles/global.css` tokens (constitution design-token
rule). Any motion stays inside `prefers-reduced-motion: no-preference`. No colour transitions
(Chromium keeps a transitioned `light-dark()` colour on its old theme; see the `.btn` note in
`global.css`). Single 768px breakpoint.

**Scale/Scope**: 7 existing code files and 1 content file edited, no files created or deleted
in `src/`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / constraint | Assessment |
|---|---|
| I. Authentic Professional Representation | The LinkedIn handle correction points visitors to the owner's real profile. PASS |
| II. Bilingual Parity (NON-NEGOTIABLE) | The new accessible strings (theme switch label, card photo position) are added in EN and ES ([contracts/ui-copy.md](./contracts/ui-copy.md)). The "I am" change is English-only because Spanish has no contraction. PASS |
| III. Static-Site Simplicity | No dependencies; the Home card gets simpler (plain images, no viewer). PASS |
| IV. Accessible & Responsive by Default | Photo alt text stays on every image (FR-002). The theme switch becomes one `role="switch"` control with its state announced. Card photos announce "Photo n of m" now that the dots are gone. Home tiles leave the tab order because they no longer do anything. The arrows keep 44px (viewer) / 36px (card) targets. PASS |
| V. Reliable Contact & Hiring Pathways | The LinkedIn link now reaches the correct profile. It is re-verified in both languages. PASS |
| VI. Blog Content Integrity | Not affected. PASS |
| Tech: design tokens | Reuses existing tokens only; no new colours. PASS |
| Tech: privacy / hosting | Unchanged. PASS |

## Project Structure

### Documentation (this feature)

```text
specs/005-ui-refinements/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── interaction-contract.md   # viewer, card carousel, Home tiles, theme switch
│   └── ui-copy.md                # changed and new EN/ES strings
└── tasks.md                      # /speckit-tasks (not created here)
```

### Source Code (repository root)

```text
src/
├── config/site.ts                    # MODIFY: LinkedIn username → iamdavidcadavid
├── i18n/ui.ts                        # MODIFY: "I am" copy; theme switch label; photo position
├── content/now/en/latest-update.md   # MODIFY: title "What I am up to now"
├── layouts/BaseLayout.astro          # MODIFY: footer order (quote, then copyright)
└── components/
    ├── ThemeToggle.astro             # REWRITE: one role="switch" button that flips
    ├── HomePhotosCard.astro          # MODIFY: plain, non-interactive image mosaic
    ├── PhotoLightbox.astro           # MODIFY: no caption, side arrows; remove the unused
    │                                 #   `tiles` layout
    └── SalesGate.astro               # MODIFY: viewer (no caption, side arrows);
                                      #   card carousel (side arrows, no dots, position label)
```

**Structure Decision**: Same single Astro project. Every change is an edit to an existing file.
`PhotoLightbox`'s `layout="tiles"` variant, added in 004 only for the Home card, becomes unused
once the Home card stops opening the viewer, so it is removed rather than left as dead code.

## Post-Design Constitution Re-check

The Phase 1 artifacts add no dependency, page, or runtime state. All principles remain PASS.

## Complexity Tracking

*No Constitution Check violations — table intentionally omitted.*
