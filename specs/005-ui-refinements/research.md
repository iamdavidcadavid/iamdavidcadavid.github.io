# Phase 0 Research: UI Refinements

No `NEEDS CLARIFICATION` remained. The decisions below settle how to build each change within
the existing components.

## 1. Viewer: side arrows, vertically centred (FR-003, FR-005)

**Decision**: Lay out the viewer content as one flex row: previous button, image, next button,
with `align-items: center`. The image is the tallest item, so both arrows stay centred on it
whatever its height, with no measuring script. The × close button stays absolutely positioned
above the top-right corner. The image's maximum width subtracts the two arrow columns
(`min(760px, calc(100vw - 2 × (44px + gap) - side margin))`), so it shrinks on narrow screens
and never pushes an arrow off screen (spec Edge Cases). When there is one photo (no buttons),
the image simply sits centred. Apply the same CSS to `PhotoLightbox` and `SalesGate`'s viewer
(FR-005).

**Alternatives considered**: arrows overlaid on the photo's edges (`position: absolute; top:
50%`). Rejected for the viewer because it covers part of the photo at every size. The flex row
keeps the photo fully visible and gives the same centring.

## 2. Viewer: no visible caption (FR-001, FR-002)

**Decision**: Remove the caption element from both viewers, along with the script lines that set
its text. The script already sets `modalImage.alt` for every photo, so the description stays
available to assistive technology.

## 3. Sales card carousel: overlaid side arrows, no dots (FR-005a)

**Decision**: Wrap the card photo in a relatively positioned box and place the existing 36px
prev/next buttons inside it at `left: 10px` / `right: 10px`, `top: 50%`,
`transform: translateY(-50%)`. The card photo has a fixed 4:3 frame, so the arrows are centred
on it by construction. Remove the dots and their script. For screen readers, give the visible
slide button an `aria-label` of "{alt} — Photo {i} of {n}" (localized) and update it whenever
the arrows change the photo. Prev/next keep their wrap-around logic, and clicking the photo
still opens the viewer on the current photo.

**Rationale**: Overlaying suits the card, where there's no room beside a card-width photo; the
viewer uses the flex row instead (§1). The blue buttons with `--on-blue` glyphs keep their own
contrast over any photo.

## 4. Home Photos card: plain images (FR-007, FR-008)

**Decision**: `HomePhotosCard` stops using `PhotoLightbox` and renders its tiles as plain
`<img>` elements in the same `2fr 1fr` mosaic, with no buttons, no viewer and no pointer, zoom
or hover effect. The random-pick script is kept and now rewrites these `<img>`s' `src`/`alt`
directly. Remove `PhotoLightbox`'s `layout="tiles"` variant and its CSS, which were added only
for this card and would otherwise be dead code.

**Rationale**: Nothing interactive means nothing in the tab order (SC-003), and the alt text
stays on each image.

## 5. Theme switch: one control that flips (FR-009, FR-010, FR-011)

**Decision**: Replace the two buttons with a single
`<button role="switch" aria-checked="true|false">` labelled "Dark theme" / "Tema oscuro"
(`aria-checked` is true when dark is showing). The button contains both icons in the same pill;
CSS highlights the active icon from the button's `aria-checked`. Any click on the button (sun,
moon or the gap between them) sets the opposite of the effective theme and saves it. Keep all
of feature 004's theme behaviour: the `hidden` attribute until the script runs, the
effective-theme logic, `localStorage` wrapped in `try/catch`, the live update from
`matchMedia`, and no colour transitions.

**Alternatives considered**:
- Keep two buttons and make the active one also flip. Rejected: two controls whose meaning
  depends on state is confusing for screen readers.
- `aria-pressed` on a "Toggle theme" button. Rejected: `role="switch"` with a fixed "Dark theme"
  label states the current theme more clearly.

## 6. Footer, copy and LinkedIn (FR-006, FR-012, FR-013)

**Decision**:
- **Footer**: in `BaseLayout`, swap the order to the quote, then the copyright, and move the 8px
  gap onto the copyright line.
- **Copy**: in `ui.ts`, `home.title` becomes "Hello — I am David" and `home.cta.now` becomes
  "What I am up to now" (English only). The Now content title becomes "[PLACEHOLDER] What I am
  up to now".
- **LinkedIn**: in `site.ts`, the username becomes `iamdavidcadavid`. The link and the displayed
  handle both derive from it.

**Spec docs note**: feature 001's spec text still mentions `cadaviddavid`. Feature specs are
historical records, so they are not edited; this spec (FR-013) supersedes that detail.
