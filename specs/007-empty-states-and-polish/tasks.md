---

description: "Task list for the Empty States and Polish feature"
---

# Tasks: Empty States and Polish

**Input**: Design documents from `/specs/007-empty-states-and-polish/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: No separate test tasks. There is no automated suite; verification is the
`quickstart.md` walkthrough (including temporarily emptied content) plus the build's own
catalogue check.

**Rules that apply to every task**:
- Colours come only from tokens in `src/styles/global.css`. No literal colours in code files.
- Motion goes inside `@media (prefers-reduced-motion: no-preference)`; no colour transitions (see
  the `.btn` note in `global.css`).
- Every visible or accessible string comes from `src/i18n/ui.ts` in EN and ES.
- Pages with content must look and behave exactly as today (FR-006).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unmet dependency)
- **[Story]**: Maps the task to US1–US4 from spec.md

---

## Phase 1: Setup

No setup: no new packages. `zod` is already a devDependency.

---

## Phase 2: Foundational

**Purpose**: All new and changed copy, which US1, US2 and US4 read from `ui.ts`.

- [X] T001 In `src/i18n/ui.ts`, apply [contracts/ui-copy.md](./contracts/ui-copy.md) in both the
      `en` and `es` dictionaries:
      - Change `home.subline` to EN "I build systems, help people grow, create content, and
        occasionally lend my voice to a story." / ES "Construyo sistemas, ayudo a las personas a
        crecer, creo contenido y, de vez en cuando, le presto mi voz a una historia."
      - Add `home.chip.creator` (Content creator / Creador de contenido), `home.now.empty`,
        `now.empty`, `sales.empty`, `photos.empty`, `contact.copy`, `contact.copyLabel`,
        `contact.copied` and `contact.copyFailed`, with the exact texts from the contract.

**Checkpoint**: `npm run build` passes (the missing-Spanish check would fail on any gap).

---

## Phase 3: User Story 1 - Friendly empty Now, Photos and Sales pages (Priority: P1) 🎯 MVP

**Goal**: Now, Photos and Sales show an empty-state card when empty, and the Home Now card shows
"Nothing new yet.".

**Independent Test**: quickstart.md Scenario 1 ([interaction-contract.md §A](./contracts/interaction-contract.md)).

- [X] T002 [US1] Create `src/components/EmptyState.astro` (research §3; data-model "Empty state"):
      - Props `message: string` and `illustration: 'camera' | 'hourglass' | 'tag'`.
      - Render `<div class="empty-state card anim-rise delay-1" role="status">`, an illustration
        wrapper with `aria-hidden="true"`, and `<p class="empty-message">{message}</p>`.
      - Move the `.empty-state`, `.empty-message` and camera CSS (`.camera*`, including the
        `glow` animation inside the reduced-motion query) here, unchanged, from
        `src/components/PhotoLightbox.astro`.
      - Add a CSS-shape **hourglass** (two `--blue` triangles meeting at a waist, about the
        camera's size, with a small sand dot using the existing `pulse` keyframes) and a
        **price tag** (a rounded `--blue` tag with an `--on-blue` hole, using the existing `wobble`
        keyframes). Both animations go inside `@media (prefers-reduced-motion: no-preference)`.
        Use tokens only.
- [X] T003 [US1] In `src/components/PhotoLightbox.astro`, replace the inline empty-state markup
      with `<EmptyState illustration="camera" message={t(locale, 'photos.empty')} />`. Delete the
      local `emptyMessage` table and the empty-state and camera CSS now owned by `EmptyState`. The
      empty album must look the same as before. Depends on T001 and T002.
- [X] T004 [P] [US1] In `src/components/AlbumGrid.astro`, when `albums.length === 0`, render
      `<EmptyState illustration="camera" message={t(locale, 'photos.empty')} />` instead of the
      grid (FR-002). Depends on T002.
- [X] T005 [P] [US1] In `src/components/NowTimeline.astro`, when there are no entries (`latest` is
      undefined), render the `<slot />` (page title) followed by
      `<EmptyState illustration="hourglass" message={t(locale, 'now.empty')} />` (FR-001).
      Depends on T002.
- [X] T006 [P] [US1] In `src/components/HomeNowCard.astro`, when `latest` is undefined, render
      `<p class="summary">{t(locale, 'home.now.empty')}</p>` in place of the summary, keep the
      title and the "What I am up to now" link, and show no date (FR-004).
- [X] T007 [US1] In `src/components/SalesGate.astro` (research §4): inside `[data-sg-catalog]`,
      before `[data-sg-items]`, add `<div data-sg-empty hidden><EmptyState illustration="tag"
      message={t(locale, 'sales.empty')} /></div>`. In `unlock()`, after `catalog` is loaded, set
      `emptyEl.hidden = catalog.length > 0`. "Load more" stays hidden for 0 items through
      `revealNext()`. The no-JS page and the password gate are unchanged (FR-003). Depends on T002.

**Checkpoint**: Run quickstart Scenario 1, including steps 3–5 with temporarily emptied content,
and restore it afterwards.

---

## Phase 4: User Story 2 - An easier way to get the email address (Priority: P2)

**Goal**: A "Copy" button next to the email link, with confirmation and a fallback.

**Independent Test**: quickstart.md Scenario 2 ([interaction-contract.md §B](./contracts/interaction-contract.md)).

- [X] T008 [US2] In `src/components/ContactSection.astro` (research §5):
      - For the `email` link only, make its `<li>` a wrapping flex row: the existing
        `<a class="link-row">` (flex 1), then
        `<button type="button" class="copy-email" data-copy-email data-address={link.username} aria-label={t(locale,'contact.copyLabel')} hidden>{t(locale,'contact.copy')}</button>`.
        Add a visually hidden `<span aria-live="polite" data-copy-status></span>` and a visible
        note `<p class="copy-note" data-copy-note hidden></p>` for the failure message.
      - Script: remove `hidden` from the button on load. On click, call
        `navigator.clipboard.writeText(address)`. On success, set the button text to
        `contact.copied` and the live region to it, and after 2000ms restore `contact.copy` and
        clear the live region (clear any previous timer first). On failure, or if
        `navigator.clipboard` is undefined, set the note's text and the live region to
        `contact.copyFailed` with `{email}` replaced by the address, as plain text (not a link),
        and show the note (FR-008). Pass the strings to the script via `define:vars` or `data-`
        attributes. In `ui.ts`, `contact.copyFailed` is EN "Couldn't copy. Select and copy the
        address: {email}" / ES "No se pudo copiar. Selecciona y copia la dirección: {email}".
      - Style: pill button with `--surface` background, `--ink` text, a 1px `--line` border,
        `min-height: 44px`, padding `0 18px`, radius 999px, and
        `:focus-visible { outline: 2px solid var(--blue); outline-offset: 2px }`. The note uses
        `--muted` at 14px. No colour transitions. The row wraps below 768px with no sideways
        scroll. Keep the existing row border between rows.
      - Depends on T001.

**Checkpoint**: Run quickstart Scenario 2 in EN and ES at 1280px and 390px.

---

## Phase 5: User Story 3 - A broken Sales catalogue can never go live (Priority: P2)

**Goal**: The catalogue check, with the new parity and duplicate rules, runs before every
`npm run build` and fails the build on any problem.

**Independent Test**: quickstart.md Scenario 3 ([build-contract.md](./contracts/build-contract.md)).

- [X] T009 [P] [US3] In `scripts/validate-sales.mjs` (research §2; data-model "Sales
      catalogue"):
      - Keep the per-file schema checks exactly as they are.
      - After them, for each file that parsed and passed, report any `id` that appears more than
        once: `✗ item "<id>" appears more than once in <file name>`.
      - If both files passed, compare their `id` sets and report each ID missing from the other:
        `✗ item "<id>" is in sales-catalog.en.json but missing from sales-catalog.es.json` (and
        the reverse). Order doesn't matter.
      - On full success, print `✓ EN and ES catalogues list the same <n> item(s)`.
      - Exit with code 1 if anything failed (existing `hadError` flow).
- [X] T010 [P] [US3] In `package.json`, add the script `"prebuild": "node scripts/validate-sales.mjs"`
      (research §1). Keep `validate:sales` and all other scripts unchanged. The workflow file
      `.github/workflows/static.yml` is not changed.
- [X] T011 [US3] Verify the build contract: run `npm run build` with valid catalogues (the three ✓
      lines, then Astro builds). Then temporarily introduce each of the following, in turn, and
      confirm `npm run build` stops before Astro starts, with the contracted message, restoring
      the file each time:
      - a missing `price`;
      - an ID only in EN;
      - a duplicate ID;
      - invalid JSON.
      Also confirm `npm run validate:sales` still works alone, and that both files set to `[]`
      pass. Depends on T009 and T010.

**Checkpoint**: Scenario 3 passes; both catalogues are restored and `git diff public/` is empty.

---

## Phase 6: User Story 4 - "Content creator" role (Priority: P3)

**Goal**: A fifth role tag and the new summary line.

**Independent Test**: quickstart.md Scenario 4 ([interaction-contract.md §C](./contracts/interaction-contract.md)).

- [X] T012 [P] [US4] In `src/styles/global.css`, add `--chip-creator: oklch(0.64 0.11 85);` after
      `--chip-voice` in the role-dot token group (research §6).
- [X] T013 [US4] In `src/components/HomeHero.astro`, append
      `{ key: 'home.chip.creator', dot: 'var(--chip-creator)' }` as the fifth chip. The summary
      line comes from `home.subline` (T001). Depends on T001 and T012.

**Checkpoint**: Scenario 4 at 1280px and 390px in EN and ES.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T014 Run `quickstart.md` Scenarios 1–4 end to end with `npm run build && npm run preview` at
      1280px and 390px, light and dark, EN and ES. Fix any failure found. Confirm all temporarily
      moved content and catalogues are restored (`git status` shows only intended changes).
- [X] T015 Run quickstart Scenario 5 (regressions):
      - the contrast check in both themes on Home, Contact (including the copy button and note)
        and each empty state;
      - no literal colours in `src` code files outside `global.css`, and no `var(--color-`;
      - 0 English strings on `/es/` pages, including the copy button's name and status text;
      - 0 console errors;
      - the non-empty Now, Photos, album and Sales pages look unchanged.

---

## Dependencies & Execution Order

- **Foundational (T001)** first: US1, US2 and US4 use its keys.
- **US1**: T002 first. Then T003 (same component family), T004, T005 and T007 depend on T002;
  T004 and T005 can run in parallel. T006 only needs T001.
- **US2 (T008)** needs only T001.
- **US3** is independent of everything else: T009 ∥ T010, then T011.
- **US4**: T012 ∥ others; T013 after T001 and T012.
- **Polish (T014, T015)** after the stories you ship.

### Parallel Opportunities

- At the start: T001 ∥ T009 ∥ T010 ∥ T012 (different files).
- After T001 + T002: T003 ∥ T004 ∥ T005 ∥ T006 ∥ T007 ∥ T008 ∥ T013 (all different files).
- T014 ∥ T015.

---

## Implementation Strategy

1. **MVP**: T001, then US1 (T002–T007). This covers all the "empty page" requests.
2. **US3** (T009–T011) can go in at any time. It's the safety net for publishing, so it's worth
   landing early.
3. Then **US2** (T008) and **US4** (T012–T013).
4. Finish with Polish (T014–T015).

## Notes

- `EmptyState.astro` is the only new file. `PhotoLightbox`'s empty album must look identical
  after the move (T003).
- Every temporary content change used for testing must be reverted before finishing.

---

## Phase 8: Convergence

- [X] T016 In `src/components/ContactSection.astro`, keep the Copy button's accessible name in step with its visible text: when showing `contact.copied`, also set `aria-label` to the copied label, and when the 2s timer restores `contact.copy`, restore `aria-label` to `contact.copyLabel` (pass it via a `data-label-name` attribute), so the name always contains the visible text (WCAG 2.5.3 label in name) per FR-007 / Constitution IV (contradicts)
- [X] T017 In `specs/007-empty-states-and-polish/contracts/interaction-contract.md` §A, change the empty Home Now card's link from "What I am up to now" to the card's actual link "Read more →" / "Leer más →" (unchanged by this feature, per FR-006); no code change per FR-004 (contradicts)
