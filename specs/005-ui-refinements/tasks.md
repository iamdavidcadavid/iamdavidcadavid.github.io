---

description: "Task list for the UI Refinements feature"
---

# Tasks: UI Refinements

**Input**: Design documents from `/specs/005-ui-refinements/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: No separate test tasks. There is no automated suite; verification is the
`quickstart.md` walkthrough in a real browser at each checkpoint and in full at the end.

**Rules that apply to every task** (carried over from feature 004):
- Colours come only from the tokens in `src/styles/global.css`. No literal colours in code files.
- Motion goes inside `@media (prefers-reduced-motion: no-preference)`, and there are no colour
  transitions (see the `.btn` note in `global.css`).
- Every new visible or accessible string exists in EN and ES (`src/i18n/ui.ts`).
- Keep all behaviour not named in the spec unchanged.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unmet dependency)
- **[Story]**: Maps the task to US1–US4 from spec.md

---

## Phase 1: Setup

No setup: all changes edit existing files (plan.md → Project Structure).

---

## Phase 2: Foundational

**Purpose**: The shared copy changes that US1 and US2 both read from `src/i18n/ui.ts`.

- [X] T001 In `src/i18n/ui.ts`: change English `home.title` to "Hello — I am David" and
      `home.cta.now` to "What I am up to now", leaving the Spanish values unchanged (FR-006). Add
      the key `viewer.position` with EN "Photo {i} of {n}" and ES "Foto {i} de {n}"
      (contracts/ui-copy.md). Do not remove `theme.light` yet; T008 removes it together with the
      component that uses it.

**Checkpoint**: `npm run build` passes.

---

## Phase 3: User Story 1 - Cleaner photo viewing (Priority: P1) 🎯 MVP

**Goal**: The enlarged viewers show no caption and have side arrows centred vertically. Sales
cards have overlaid side arrows and no dots.

**Independent Test**: quickstart.md Scenarios 1 and 2 ([interaction-contract.md §A, §B](./contracts/interaction-contract.md)).

- [X] T002 [US1] In `src/components/PhotoLightbox.astro` (FR-001–FR-004; research §1–§2):
      - Delete the `<p class="modal-caption" data-modal-caption>` element, the `modalCaption`
        variable and the line that sets its text. Keep `modalImage.alt = img.alt` (FR-002).
      - Restructure `.modal-content` into one flex row: the prev button (when `photos.length > 1`),
        then `<img data-modal-image>`, then the next button (when `photos.length > 1`), with
        `align-items: center` and a 14px gap (10px below 768px). Remove the old `.modal-nav-row`
        wrapper and its CSS.
      - Keep the × close button absolutely positioned above the top-right corner (`top: -48px;
        right: 0`).
      - Constrain the image to `max-width: min(760px, calc(100vw - 2 * (44px + 14px) - 32px))` and
        `max-height: 72vh`. Below 768px use the 10px gap in that calc.
      - Keep the viewer script's behaviour unchanged (wrap-around, ← / →, Escape, backdrop).
- [X] T003 [US1] In `src/components/SalesGate.astro`, apply the same viewer change as T002 to the
      Sales viewer (FR-005):
      - Delete `<p class="sg-modal-caption" data-sg-modal-caption>`, the `modalCaption` const and
        the line in `showAt` that sets its text (keep `modalImage.alt`).
      - Make `.sg-modal-content` the same flex row: `[data-sg-modal-prev]`, the image,
        `[data-sg-modal-next]`. The prev/next buttons stay in the markup with `hidden` toggled by
        `openModal` as today. Remove `.sg-modal-nav-row`.
      - Use the same image max-size rule and close-button placement as T002.
- [X] T004 [US1] In `src/components/SalesGate.astro`'s card carousel (`renderItem()` and the
      `.sg-carousel*` CSS) (FR-005a; research §3; contract §B):
      - Give the carousel photo a `position: relative` wrapper. Inside the existing
        `if (item.photos.length > 1)` branch, append the prev/next buttons into that wrapper.
      - Style them 36px round `--blue` / `--on-blue`, absolutely positioned at `left: 10px` /
        `right: 10px`, `top: 50%`, `transform: translateY(-50%)`, with a `z-index` above the photo
        button.
      - Remove the dots entirely: the `sg-dots` / `sg-dot` markup, script and CSS, and the
        `.sg-carousel-controls` row.
      - Pass a `viewerPosition` template (`t(locale, 'viewer.position')`) through `define:vars`.
        On multi-photo cards, set each visible slide button's `aria-label` to
        `${photo.alt} — ${viewerPosition with {i}/{n} filled}` initially and after every arrow
        press. Single-photo cards get no position text.
      - Keep the wrap-around and "click opens the viewer on the current photo" behaviour — depends
        on T001 and T003 (same file).

**Checkpoint**: Run quickstart Scenarios 1–2 at 1280px and 390px, both themes and both languages.

---

## Phase 4: User Story 2 - A calmer Home page (Priority: P2)

**Goal**: "I am" on Home and Now, and non-interactive Home photos.

**Independent Test**: quickstart.md Scenario 3 (contract §C).

- [X] T005 [P] [US2] In `src/content/now/en/latest-update.md`, change the frontmatter title to
      `"[PLACEHOLDER] What I am up to now"` (FR-006). Leave the Spanish file unchanged.
- [X] T006 [US2] In `src/components/HomePhotosCard.astro` (FR-007, FR-008; research §4):
      - Stop importing and rendering `PhotoLightbox`. Render the pool's first 3 photos as plain
        `<img src alt loading="lazy">` elements in a `<div class="tiles">` using the same mosaic
        CSS moved here: `2fr 1fr` columns, two rows, the first tile spanning both rows, 8px gap
        (6px below 768px), images `object-fit: cover`, radius 14px (12px below 768px),
        `min-height` 210px (200px below 768px).
      - No buttons or links, `cursor: default`, no hover zoom.
      - Keep `data-photo-pool` and the Fisher–Yates script, changed to rewrite the `src`/`alt` of
        the `.tiles img` elements (there are no `aria-label`s to update any more). Keep the
        empty-pool message and "See more".
- [X] T007 [US2] In `src/components/PhotoLightbox.astro`, remove the now-unused `layout` prop and
      the `tiles` variant (the `layout` prop, the `tiles` class binding, the tile-only
      `aria-label`, and every `.photo-list.tiles` CSS rule) (research §4; plan Structure
      Decision). Grid albums are unaffected. Depends on T002 (same file) and T006 (the last user
      of `tiles`).

**Checkpoint**: Run quickstart Scenario 3. Tab through Home and confirm no photo stops.

---

## Phase 5: User Story 3 - A theme switch that simply flips (Priority: P3)

**Goal**: One switch control that always flips the theme.

**Independent Test**: quickstart.md Scenario 4 (contract §D).

- [X] T008 [US3] Rewrite `src/components/ThemeToggle.astro` (FR-009–FR-011; research §5):
      - Render a single `<button type="button" role="switch" aria-checked="false"
        aria-label={t(locale,'theme.dark')} data-theme-toggle hidden>` containing both icon spans
        (sun, moon) in the existing pill look. Keep the 32px / 30px icon circles and
        `--shadow-pill`.
      - CSS highlights the moon circle (`--ink` fill, `--surface` icon) when
        `[aria-checked="true"]` and the sun circle otherwise; the inactive icon is `--faint`.
      - Script: `effectiveTheme()` as today. On click, set
        `root.dataset.theme = effectiveTheme() === 'dark' ? 'light' : 'dark'`, save it in
        `try/catch`, and set `aria-checked` to `effectiveTheme() === 'dark'`. Also sync on load
        and on `matchMedia` change, and remove `hidden` on load.
      - Add a visible `:focus-visible` outline on the button.
      - Then in `src/i18n/ui.ts`, delete the now-unused `theme.light` key in both languages
        (contracts/ui-copy.md "Removed"). Depends on T001 (same file as the `ui.ts` edit).

**Checkpoint**: Run quickstart Scenario 4, including Space/Enter and a reload.

---

## Phase 6: User Story 4 - Footer order and LinkedIn (Priority: P4)

**Goal**: The quote comes above the copyright, and the LinkedIn link is correct.

**Independent Test**: quickstart.md Scenario 5 (contract §E).

- [X] T009 [P] [US4] In `src/layouts/BaseLayout.astro`'s footer, put
      `<p class="footer-quote">` before `<p class="copyright">` (FR-012). Move the 8px top margin
      from `.footer-quote` to `.copyright` and drop the `!important`.
- [X] T010 [P] [US4] In `src/config/site.ts`, change the LinkedIn entry's `username` from
      `'cadaviddavid'` to `'iamdavidcadavid'` (FR-013; data-model.md). No other change is needed:
      the link and the displayed handle both derive from it.

**Checkpoint**: Run quickstart Scenario 5 in both languages.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T011 Run `quickstart.md` Scenarios 1–5 end to end with `npm run build && npm run preview`
      at 1280px and 390px, light and dark, EN and ES. Fix any failure found.
- [X] T012 Run quickstart Scenario 6 (regressions):
      - The in-page contrast check in both themes on Home, the album with the viewer open,
        unlocked Sales with the viewer open, and Contact.
      - A literal-colour sweep of `src` code files (only `global.css` may contain colours).
      - `grep -rn "var(--color-" src` returns nothing.
      - 0 English strings on `/es/` pages, including accessible names such as the switch label
        and the card position.
      - 0 console errors.

---

## Dependencies & Execution Order

- **Foundational (T001)** comes first: US1 (T004) and US3 (T008) read or edit `ui.ts`, and the
  Home copy lives there.
- **US1**: T002 and T003 can run in parallel (different files). T004 follows T003 (same file).
- **US2**: T005 and T006 can run in parallel. T007 follows T002 (same file) and T006.
- **US3**: T008 follows T001 (`ui.ts`).
- **US4**: T009 and T010 are independent of everything and can run in parallel.
- **Polish**: after the stories you ship.

### Parallel Opportunities

- After T001: T002 ∥ T003 ∥ T005 ∥ T006 ∥ T009 ∥ T010.
- Then T004 (after T003), T007 (after T002 and T006) and T008.
- T011 and T012 can run together.

---

## Implementation Strategy

1. **MVP**: T001, then US1 (T002–T004). The viewer and card changes are the most visible, so
   validate them first.
2. Then US2 (Home and Now), US3 (theme switch) and US4 (footer and LinkedIn). Each is small and
   independently testable.
3. Finish with Polish (T011–T012).

## Notes

- `PhotoLightbox.astro` is edited by T002, then T007. `SalesGate.astro` is edited by T003, then
  T004. `ui.ts` is edited by T001, then T008.
- Commit after each story and validate at every checkpoint.
