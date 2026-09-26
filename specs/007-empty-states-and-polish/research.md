# Research: Empty States and Polish

## 1. Running the Sales catalogue check as part of the build

**Finding**: `npm run build` runs only `astro build`. `scripts/validate-sales.mjs` runs only via
`npm run validate:sales`. The publishing workflow (`.github/workflows/static.yml`) runs `npm ci`
then `npm run build`, so the check never runs there either.

**Decision**: Add an npm `prebuild` script: `"prebuild": "node scripts/validate-sales.mjs"`. npm
runs `prebuild` automatically before `build` whenever `npm run build` is used (locally and in the
workflow), and stops with a non-zero exit if it fails, so `astro build` never starts and nothing
is uploaded or deployed. Keep `validate:sales` for running the check alone (FR-013).

**Rationale**: No workflow edit and no new dependency. `zod` is already a devDependency, and
`npm ci` installs devDependencies in the workflow (it doesn't set `NODE_ENV=production`).

**Alternatives considered**:
- `"build": "node scripts/validate-sales.mjs && astro build"`: equivalent, but `prebuild` keeps
  `build` readable and is the standard npm lifecycle hook.
- An Astro integration hook (`astro:build:start`): runs inside Astro, so `npx astro build` would
  also be covered, but it's more code for the same result. Documented limitation instead: calling
  `astro build` directly (not through npm) skips the check. The workflow and the documented
  commands always go through npm.
- A separate workflow step: covers publishing but not local builds.

## 2. EN/ES catalogue parity (FR-013a)

**Decision**: After both files pass their own schema, compare their `id` sets. For each ID in EN
but not ES, and vice versa, print `✗ item "<id>" is in sales-catalog.en.json but missing from
sales-catalog.es.json` (and the reverse), then exit 1. Order is ignored. Duplicate IDs within one
file are also reported (a duplicate would make parity ambiguous). If either file already failed
its own check, skip the parity step (its output would be noise).

**Rationale**: The ID is the only field that must match; names, prices and descriptions are
translated or localized.

## 3. Shared empty-state component

**Finding**: Two empty states exist, each with its own copy of the same card CSS (`.empty-state`,
`.empty-message`): Blog (oven, in `BlogList.astro`) and an empty album (camera, in
`PhotoLightbox.astro`). This feature needs three more: Photos index (camera again), Now and Sales.

**Decision**: Create `src/components/EmptyState.astro` with props `message` and
`illustration: 'camera' | 'hourglass' | 'tag'`, rendering the same card
(`<div class="empty-state card" role="status">`, illustration `aria-hidden="true"`, message
`<p class="empty-message">`). Move the camera markup and CSS out of `PhotoLightbox` into it, and
use it for the empty album, the Photos index, Now and Sales. Blog keeps its oven as is (out of
scope; it can move to `EmptyState` later).

**Illustrations** (CSS shapes in `--blue`, like the design README's empty-state rule):
- **camera**: moved unchanged, with its iris `glow` animation.
- **hourglass** (Now): two triangles meeting at a waist, with a small "sand" dot using the
  existing `pulse` keyframes.
- **tag** (Sales): a rounded price tag with a hole, using the existing `wobble` keyframes.

All animation stays inside `prefers-reduced-motion: no-preference`, and colours come only from
tokens (`--blue`, `--on-blue`, `--blue-soft`, `--lens`, `--lens-ring`, `--glow`).

**Alternatives considered**: Copying the card CSS into each page (a fourth and fifth copy of the
same rules); moving the Blog oven too (no requirement; increases the regression surface).

## 4. Sales empty state at runtime

**Finding**: The Sales catalogue is fetched in the browser after unlocking
(`fetch('/sales-catalog.<locale>.json')`), so emptiness is only known at runtime.

**Decision**: Render `<EmptyState illustration="tag" …>` inside `[data-sg-catalog]`, wrapped in an
element with `data-sg-empty hidden`. In `unlock()`, after loading, set
`emptyEl.hidden = catalog.length > 0`, and leave `revealNext()` to hide "Load more" as today
(`shown >= catalog.length` is true for 0 items). The no-JS Sales page is unchanged.

## 5. Copy-email button

**Finding**: Each contact row is a single `<a class="link-row">`. A button can't go inside a link.

**Decision**: For the email row only, render the `<li>` as a flex row containing the existing
link (flex 1) and a `<button type="button" class="copy-email" data-copy-email hidden>` after it.
- Visible text "Copy" / "Copiar", accessible name "Copy email address" / "Copiar dirección de
  correo" (it contains the visible text, per WCAG "label in name").
- A visually hidden `<span aria-live="polite" data-copy-status>` next to it.
- Script: remove `hidden` on load (so it never shows without JS). On click, call
  `navigator.clipboard.writeText(address)`. On success, set the button text to "Copied" /
  "Copiado" and the live region to the same, then reset after 2s (clearing any running timer
  first, so repeated clicks restart it). On failure, or if `navigator.clipboard` is unavailable,
  set the live region **and** a visible note to "Couldn't copy. Select and copy the address:
  <address>" / "No se pudo copiar. Selecciona y copia la dirección: <address>". The address is
  repeated as plain text because the one in the row is a link, and dragging across a link on a
  computer drags the link instead of selecting its text.
- Style: the site's small pill button look (`--surface` / `--ink`, `--line` border, a visible
  `:focus-visible` outline in `--blue`), min 44px tall, no colour transitions. It wraps below the
  address on narrow screens.

**Rationale**: `navigator.clipboard.writeText` works on HTTPS (GitHub Pages) and `localhost`, and
from a click. The deprecated `document.execCommand('copy')` fallback is not used; the manual
message covers the rare failure.

## 6. "Content creator" role

**Decision**: Add `--chip-creator: oklch(0.64 0.11 85)` (a warm gold, distinct from the blue,
green 150, orange 45 and pink 330 hues) next to the other role-dot tokens in `global.css`, and a
fifth entry `{ key: 'home.chip.creator', dot: 'var(--chip-creator)' }` in `HomeHero.astro`. The
dots are decorative (`aria-hidden`), so they carry no contrast requirement; the tag text is
unchanged in colour. The chip list already wraps (`flex-wrap`).

## 7. Copy and translations

**Decision**: All new strings go in `src/i18n/ui.ts` (EN and ES), so the existing
missing-Spanish check covers them. The "Development in process…" text moves from
`PhotoLightbox`'s local table into `ui.ts` as `photos.empty` so both camera uses share it. See
[contracts/ui-copy.md](./contracts/ui-copy.md).

## 8. How to test empty sections

**Finding**: A content collection with zero files builds fine; Astro only prints a warning that
the collection is empty.

**Decision**: Validate by temporarily moving the files of one collection (or one language's
folder) out of `src/content/…`, and by temporarily setting both Sales catalogues to `[]`, then
rebuilding. Restore afterwards (see quickstart.md). No test-only code is added.
