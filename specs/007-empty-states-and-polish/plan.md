# Implementation Plan: Empty States and Polish

**Branch**: `007-empty-states-and-polish` | **Date**: 2026-09-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-empty-states-and-polish/spec.md`

## Summary

Four small improvements:
- **Empty states** for Now, Photos and Sales (plus the Home Now card). A new shared
  `EmptyState` component holds the card, the camera (moved from `PhotoLightbox`) and two new
  CSS-shape illustrations (hourglass, price tag).
- **A "Copy" button** next to the email address on Contact, using the browser clipboard, with a
  2-second "Copied" confirmation and a manual-copy fallback message.
- **The Sales catalogue check runs before every build** through npm's `prebuild` hook, so local
  builds and publishing both stop on an invalid catalogue. It also gains an EN/ES item-ID parity
  rule and a duplicate-ID rule.
- **A fifth Home role tag**, "Content creator", with a new dot-colour token and the updated
  summary line.

## Technical Context

**Language/Version**: Astro 7.3.3 components (`.astro`) with TypeScript; Node.js ≥22.12.0 (Node
22 in the workflow)

**Primary Dependencies**: `astro`, `@astrojs/sitemap`; `zod` (devDependency, already used by the
catalogue check). **No new packages.**

**Storage**: N/A (content collections and the two public JSON catalogues, unchanged in shape)

**Testing**: No automated suite. `npm run build` (which now includes the catalogue check) plus the
browser walkthrough in [quickstart.md](./quickstart.md), including temporarily emptying content.

**Target Platform**: GitHub Pages (static, HTTPS), modern evergreen browsers

**Project Type**: Single static web project (Astro)

**Performance Goals**: No change. The check adds well under a second to the build.

**Constraints**: Colours only from tokens (one new token, `--chip-creator`). Motion only inside
`prefers-reduced-motion: no-preference`, and no colour transitions. Every string in EN and ES.
Single 768px layout breakpoint.

**Scale/Scope**: 1 new component; about 11 existing files edited (7 components, `ui.ts`,
`global.css`, `package.json`) plus the check script.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / constraint | Assessment |
|---|---|
| I. Authentic Professional Representation | The new role and summary line were supplied and approved by the owner (Clarifications). PASS |
| II. Bilingual Parity (NON-NEGOTIABLE) | All new strings in `ui.ts` for EN and ES (the build enforces it). The catalogue check now also enforces EN/ES item parity for Sales. PASS |
| III. Static-Site Simplicity | No dependencies; npm's built-in `prebuild` hook; the clipboard is a browser feature. PASS |
| IV. Accessible & Responsive by Default | Empty states use `role="status"` with decorative illustrations hidden. The copy button is a real `<button>` with a name containing its visible text, a live region, a visible focus outline and 44px height. It's hidden without JS, and the email link still works. Reduced motion is respected. PASS |
| V. Reliable Contact & Hiring Pathways | Adds a fallback for visitors without an email app. The link still works. PASS |
| VI. Blog Content Integrity | Not affected. PASS |
| Tech: design tokens | One new colour, `--chip-creator`, added to the token set (decorative dot, no contrast requirement). No literal colours in components. PASS |
| Tech: hosting / deployment | The workflow file is unchanged; the check runs through `npm run build`. A failing check stops the deploy, so the live site stays up. PASS |
| Tech: privacy | Clipboard write only, on the visitor's action; nothing is sent anywhere. PASS |

## Project Structure

### Documentation (this feature)

```text
specs/007-empty-states-and-polish/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── ui-copy.md               # new and changed EN/ES strings
│   ├── interaction-contract.md  # empty states, copy button, role tags
│   └── build-contract.md        # when the catalogue check runs, output, exit codes
└── tasks.md                     # /speckit-tasks (not created here)
```

### Source Code (repository root)

```text
package.json                         # MODIFY: add "prebuild": "node scripts/validate-sales.mjs"
scripts/validate-sales.mjs           # MODIFY: duplicate-ID and EN/ES parity rules, summary line
src/
├── i18n/ui.ts                       # MODIFY: new subline; keys in contracts/ui-copy.md
├── styles/global.css                # MODIFY: --chip-creator token
└── components/
    ├── EmptyState.astro             # NEW: card + camera/hourglass/tag illustrations
    ├── PhotoLightbox.astro          # MODIFY: use EmptyState (camera moved out); photos.empty
    ├── AlbumGrid.astro              # MODIFY: EmptyState (camera) when there are 0 albums
    ├── NowTimeline.astro            # MODIFY: EmptyState (hourglass) when there are 0 entries
    ├── HomeNowCard.astro            # MODIFY: "Nothing new yet." when there are 0 entries
    ├── SalesGate.astro              # MODIFY: hidden EmptyState (tag), shown if catalogue is empty
    ├── ContactSection.astro         # MODIFY: Copy button, status region, script, styles
    └── HomeHero.astro               # MODIFY: fifth role tag
```

**Structure Decision**: Same single Astro project. `EmptyState` is the only new file. It keeps
the three new empty states and the existing album one on a single card implementation instead of
more copies. The Blog oven stays where it is (research §3).

## Post-Design Constitution Re-check

The Phase 1 design adds one component, one colour token and one npm lifecycle script. It adds no
dependency, page or stored data. All principles remain PASS.

## Complexity Tracking

*No Constitution Check violations — table intentionally omitted.*
