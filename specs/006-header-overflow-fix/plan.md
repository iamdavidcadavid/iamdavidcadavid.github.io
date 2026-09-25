# Implementation Plan: Header Overflow Fix

**Branch**: `006-header-overflow-fix` | **Date**: 2026-09-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-header-overflow-fix/spec.md`

## Summary

Between 768px and about 890px, the one-row desktop header is wider than the window, so every
page scrolls sideways. The fix adds a spacing-only "compact desktop" range (768px–959.98px):
- page margins 48px → 24px (via the `--gutter` token, so header and content stay aligned);
- nav link side padding 18px → 10px;
- nav pill gap 6px → 4px;
- header actions gap 20px → 12px.

That brings the Spanish header from 875px to 731px, which fits a 768px window with a scrollbar
and leaves 22px spare ([research.md](./research.md) §2). Wide screens (≥ 960px) and phones
(< 768px) are untouched.

## Technical Context

**Language/Version**: Astro 7.3.3 components (`.astro`) and global CSS; Node.js ≥22.12.0

**Primary Dependencies**: `astro`, `@astrojs/sitemap` (unchanged). **No new packages.**

**Storage**: N/A

**Testing**: No automated suite. `npm run build` plus the browser walkthrough in
[quickstart.md](./quickstart.md) (widths 768–959px, 1280px and 390px; EN/ES; both themes).

**Target Platform**: GitHub Pages (static), modern evergreen browsers

**Project Type**: Single static web project (Astro)

**Performance Goals**: No change (CSS only).

**Constraints**: Tokens only for colours (none added). No motion added. 768px stays the only
layout breakpoint. The new 960px threshold is spacing-only ([research.md](./research.md) §5).

**Scale/Scope**: 3 existing files edited (CSS only), no files created or deleted in `src/`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / constraint | Assessment |
|---|---|
| I. Authentic Professional Representation | Not affected. PASS |
| II. Bilingual Parity (NON-NEGOTIABLE) | The EN/ES switch stays visible in the compact range, and the fit is sized for the longer Spanish labels. PASS |
| III. Static-Site Simplicity | CSS-only change, no dependencies, no script. PASS |
| IV. Accessible & Responsive by Default | Fixes a responsive defect on tablet/small-laptop widths (and zoomed large screens). Link targets stay ≈ 51 × 40px or larger; focus and current-page styles unchanged. PASS |
| V. Reliable Contact & Hiring Pathways | Nav to Contact stays visible at every width. PASS |
| VI. Blog Content Integrity | Not affected. PASS |
| Tech: design tokens | No colours added; the existing `--gutter` token is overridden per range, following the phone override pattern. PASS |
| Tech: hosting / deployment | Unchanged. PASS |

## Project Structure

### Documentation (this feature)

```text
specs/006-header-overflow-fix/
├── plan.md
├── research.md
├── data-model.md               # spacing tiers
├── quickstart.md
├── baseline.json               # header geometry before the change (written by T001)
├── contracts/
│   └── header-layout.md        # what the header guarantees per width
└── tasks.md                    # /speckit-tasks (not created here)
```

### Source Code (repository root)

```text
src/
├── styles/global.css           # MODIFY: --gutter: 24px for 768px–959.98px; extend the
│                               #   breakpoint note to name the spacing-only 960px threshold
├── layouts/BaseLayout.astro    # MODIFY: .header-actions gap 12px in 768px–959.98px
└── components/NavBar.astro     # MODIFY: .desktop-nav link padding 10px 10px and pill gap 4px
                                #   in 768px–959.98px
```

**Structure Decision**: Same single Astro project. Each rule goes in the file that already owns
that spacing, inside `@media (min-width: 768px) and (max-width: 959.98px)`.

## Post-Design Constitution Re-check

The Phase 1 design adds no dependency, page, colour, motion or script. All principles remain
PASS.

## Complexity Tracking

*No Constitution Check violations — table intentionally omitted.*
