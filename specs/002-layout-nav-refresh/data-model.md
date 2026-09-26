# Phase 1 Data Model: Layout, Navigation & Content Restructuring

**No new data entities.** This feature restructures existing UI components and static copy; it
does not add, remove, or change any Astro content collection, schema, or JSON data file defined
in `001-content-website`'s data-model.md (`Blog Post`, `Photo Album`, `Photo`, `Sale Item` are
all untouched).

## Existing entities touched only at the presentation layer

- **Contact Link** (`src/config/site.ts`, from 001's data-model.md): shape (`platform`,
  `username`) is unchanged, but the `ContactPlatform` union gains a fourth value, `'email'`, and
  `contactLinks` gains a fourth entry (`{ platform: 'email', username: contactEmail }`) so email
  renders through the same array-driven `.map()` as LinkedIn/GitHub/YouTube instead of separate
  hand-coded markup (FR-009; research.md §6, resolved from `/speckit-analyze` finding U1).
  `contactLinkUrl` gains a matching `case 'email'` returning `mailto:${link.username}`.
  GitHub/YouTube also get real icon markup (FR-010) instead of text-initial placeholders — the
  icon choice is determined by `platform` in the rendering component, same pattern as today.
- **Navigation Entry** (from 001's data-model.md, a fixed constant array in `NavBar.astro`, not
  authored content): the array's contents change (drop "About", change "Contact"'s target from
  an anchor to a page URL — FR-006/FR-007), but its shape (`label`, `href`) is unchanged.

## New non-content asset

- `src/assets/placeholders/contact-photo.svg` — a static placeholder image (research.md §5),
  not a content-collection entity; referenced directly by `ContactSection.astro`, the same way
  `profile-photo.svg` is referenced by `AboutSection.astro` today.
