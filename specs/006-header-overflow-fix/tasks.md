---

description: "Task list for the Header Overflow Fix feature"
---

# Tasks: Header Overflow Fix

**Input**: Design documents from `/specs/006-header-overflow-fix/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/header-layout.md](./contracts/header-layout.md), [quickstart.md](./quickstart.md)

**Tests**: No separate test tasks. There is no automated suite; verification is the
`quickstart.md` walkthrough in a real browser.

**Rules that apply to every task**:
- CSS only. No script, no markup changes, no new colours (tokens only), no motion.
- Every new rule goes inside `@media (min-width: 768px) and (max-width: 959.98px)`, the
  "compact desktop" range from [data-model.md](./data-model.md). Nothing outside that range
  changes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unmet dependency)
- **[Story]**: Maps the task to US1–US2 from spec.md

---

## Phase 1: Setup

**Purpose**: Record today's header so US2 can prove nothing changed outside the range.

- [X] T001 With `npm run build && npm run preview`, record the header's geometry **before** any
      edit: for `/` and `/es/` at 1280px, 960px and 390px, save the left/right/width of
      `.wordmark`, `.navbar`, each `.desktop-nav a`, `.header-actions` and the theme switch, and
      the `--gutter` value. Also record the horizontal overflow
      (`scrollWidth - clientWidth`) at 768, 800, 850, 900 and 959px (expected today: > 0 up to
      about 885px). Save everything to `specs/006-header-overflow-fix/baseline.json` (keyed by
      page, width and element) so T005 can compare against it even in a later session.

---

## Phase 2: Foundational

No foundational work: each story edits spacing that an existing file already owns.

---

## Phase 3: User Story 1 - No sideways scroll on mid-size screens (Priority: P1) 🎯 MVP

**Goal**: From 768px to 959.98px the one-row desktop header fits, with ≥ 16px spare in Spanish at
768px with a scrollbar.

**Independent Test**: quickstart.md Scenarios 1, 2 and 4 ([contract](./contracts/header-layout.md)
row 2).

- [X] T002 [P] [US1] In `src/styles/global.css`, next to the existing phone override
      (`@media (max-width: 767.98px) { :root { --gutter: 20px; } }`), add
      `@media (min-width: 768px) and (max-width: 959.98px) { :root { --gutter: 24px; } }`
      (research §4). Extend the "Layout" comment above `--breakpoint-md-px` to say that 960px is
      a spacing-only threshold (compact desktop spacing below it) and not a layout breakpoint
      (research §5).
- [X] T003 [P] [US1] In `src/components/NavBar.astro`, add a compact-range media query that sets
      `.desktop-nav ul { gap: 4px; }` and `.desktop-nav a { padding: 10px 10px; }` (was `6px` and
      `10px 18px`; data-model.md). Leave the font size, the pill's 6px inner padding, radius,
      colours, hover, current-page and focus styles unchanged.
- [X] T004 [P] [US1] In `src/layouts/BaseLayout.astro`, add a compact-range media query that sets
      `.header-actions { gap: 12px; }` (was `20px`; data-model.md). Leave `.site-header-inner`'s
      16px gap and every phone rule unchanged.

**Checkpoint**: `npm run build`, then run quickstart Scenarios 1, 2 and 4 in EN and ES. Expected:
0 overflow at 768/800/850/900/959px; ≈ 22px spare on `/es/` at 768px with a scrollbar (≥ 16px
required, SC-002); every nav link ≥ 24 × 24px; focus outline not clipped.

---

## Phase 4: User Story 2 - Wide and phone layouts stay exactly as they are (Priority: P2)

**Goal**: 0px difference at 1280px, 960px and 390px.

**Independent Test**: quickstart.md Scenario 3.

- [X] T005 [US2] Re-measure the T001 geometry at 1280px, 960px and 390px on `/` and `/es/`, and
      compare it with the values in `specs/006-header-overflow-fix/baseline.json`. Every position and size must match exactly (SC-003),
      and `--gutter` must be 48px at 960px and 1280px and 20px at 390px. If anything differs,
      fix the media query bounds in `src/styles/global.css`, `src/components/NavBar.astro` or
      `src/layouts/BaseLayout.astro` so the rules apply only between 768px and 959.98px.
      Depends on T002–T004.

**Checkpoint**: Scenario 3 passes.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T006 Run quickstart Scenarios 1 and 5 on every page type (Home, Now, Contact, Blog list and
      one post, Photos and one album, Sales locked and unlocked, a 404 URL), EN and ES, light and
      dark, at 768, 800, 850, 900 and 959px:
      - 0 horizontal overflow;
      - the header name's left edge lines up with the page content's left edge;
      - if a non-header element overflows, report it rather than changing it (spec Edge Cases);
      - browser zoom (spec Edge Cases): a 1280px window at 150% zoom (≈ 853px CSS width, e.g.
        by emulating an 853px viewport or setting the page zoom) shows the compact spacing and
        no sideways scroll.
- [X] T007 Regressions (quickstart Scenario 5.2):
      - a literal-colour sweep of `src` code files (only `global.css` may contain colours);
      - `grep -rn "var(--color-" src` returns nothing;
      - 0 console errors.

---

## Dependencies & Execution Order

- **Setup (T001)** must come first: US2 compares against its "before" numbers.
- **US1**: T002, T003 and T004 edit different files and can run in parallel.
- **US2 (T005)** follows T002–T004. It verifies the same edits from the other side (outside the
  range), so it can't run before them.
- **Polish (T006, T007)** after US1 and US2. T006 and T007 can run together.

### Parallel Opportunities

- After T001: T002 ∥ T003 ∥ T004.
- T006 ∥ T007.

---

## Implementation Strategy

1. **MVP**: T001, then US1 (T002–T004). This removes the sideways scroll.
2. Then US2 (T005) to prove wide and phone headers are untouched.
3. Finish with Polish (T006–T007).

## Notes

- Values come from [data-model.md](./data-model.md): compact tier `--gutter` **24px**, nav link
  padding **10px / 10px**, nav pill gap **4px**, header actions gap **12px**.
- Commit after the feature validates.
