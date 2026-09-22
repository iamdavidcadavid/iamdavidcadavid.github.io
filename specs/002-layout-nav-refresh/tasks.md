---

description: "Task list for the Layout, Navigation & Content Restructuring feature"
---

# Tasks: Layout, Navigation & Content Restructuring

**Input**: Design documents from `/specs/002-layout-nav-refresh/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Not included as separate tasks — consistent with `001-content-website`, this project
has no automated test suite (plan.md's Technical Context). Verification is the manual
`quickstart.md` checklist, run via an actual browser (not just build output) since the two real
bugs found while building 001 were both invisible in static HTML.

**Organization**: Tasks are grouped by user story (spec.md, priority order P1→P5). Every task
here **edits an existing file** from `001-content-website` unless marked "NEW" — this feature is
a restructuring pass, not a fresh build.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unmet dependency)
- **[Story]**: Maps the task to US1–US5 from spec.md
- Every task names its exact file path(s)

---

## Phase 1: Setup

**Purpose**: The one prerequisite shared by more than one story — the content-width token/class
that both the header (US1) and the Blog grid (US5) depend on.

- [X] T001 In `src/styles/global.css`, add `--content-max-width: 1100px;` to the `:root` block
      and a new `.site-container { max-width: var(--content-max-width); margin-inline: auto;
      padding-inline: 1.5rem; }` utility class (research.md §1).

---

## Phase 2: User Story 1 - Consistent, always-visible site header (Priority: P1) 🎯 MVP

**Goal**: Nav/hamburger left, language switch right, both inside the same content-width
container as page body copy; header stays visible while scrolling.

**Independent Test**: Load any page, resize across 375px/767px/768px/1440px, and scroll down —
header contents stay aligned within the content column and the header never scrolls out of view
(per spec.md's Independent Test for User Story 1).

- [X] T002 [US1] In `src/layouts/BaseLayout.astro`: wrap `<NavBar />` and `<LanguageSwitch />` in
      a new `<div class="site-header-inner site-container">`. **Replace** (do not extend)
      `.site-header`'s current rule — remove its `padding`, `justify-content`, `align-items`,
      `gap` entirely — with `.site-header { position: sticky; top: 0; z-index: 40; background:
      var(--color-white); border-bottom: 1px solid var(--color-neutral-200); }` (kept below
      modals' `z-index: 100`); add `.site-header-inner { display: flex; align-items: center;
      justify-content: space-between; }` (FR-001, FR-002, FR-003; research.md §1–§2). **Leaving
      the old padding/flex properties on `.site-header` alongside the new container would double
      the horizontal inset and break the alignment this task exists to deliver** — depends on
      T001.
- [X] T003 [P] [US1] In `src/components/NavBar.astro`'s mobile `@media (max-width: 767.98px)`
      block, delete the `.navbar { position: relative; width: 100%; justify-content: flex-end;
      }` rule entirely — do not replace it with anything; `.navbar` reverts to its natural
      (button-only) width, and `.nav-menu`'s existing `position: absolute; left: 0; right: 0;`
      now resolves against the sticky `.site-header` ancestor instead, so the dropdown still
      spans the full header width (FR-004; research.md §2 — read this section before touching
      this file, the reasoning is non-obvious).

**Checkpoint**: Run `quickstart.md` section 1 (header container/sticky/hamburger-left) at all
four viewport widths, in a real browser. User Story 1 is independently functional.

---

## Phase 3: User Story 2 - A leaner Home page and a dedicated Contact page (Priority: P2)

**Goal**: Home shows the former About content directly (no separate heading/nav entry); Contact
becomes its own page with an image.

**Independent Test**: Load `/` and confirm there is no separate "About" heading/anchor; load
`/contact/` directly and confirm it renders standalone with its own URL, the existing contact
content, and an image (per spec.md's Independent Test for User Story 2).

- [X] T004 [P] [US2] In `src/components/AboutSection.astro`, remove `id="about"` from the
      `<section>` element. No other change — content and responsive layout are otherwise
      untouched (FR-005; research.md §4).
- [X] T005 [P] [US2] Create `src/assets/placeholders/contact-photo.svg`: a new placeholder image
      distinct from `profile-photo.svg` (e.g. an envelope/message motif), matching the existing
      placeholder-SVG style (`width`/`height`/`viewBox` all set — see 001's lesson on zero-size
      SVGs) (FR-008; research.md §5).
- [X] T006 [US2] In `src/components/ContactSection.astro`: remove `id="contact"` from the
      `<section>`; add an image block using `contact-photo.svg` (T005) with the same responsive
      text/image pattern as `AboutSection.astro` (image right of text ≥768px, above text <768px)
      (FR-008; research.md §5) — depends on T005.
- [X] T007 [US2] In `src/components/NavBar.astro`'s `links` array: remove the `{ label: 'About',
      href: '#about' }` entry; change the Contact entry's `href` from
      `` `${getRelativeLocaleUrl(locale, '/')}#contact` `` to
      `getRelativeLocaleUrl(locale, '/contact/')` (FR-006, FR-007) — depends on T003 (same
      file — T003's CSS-only edit must land first).
- [X] T008 [P] [US2] Create `src/pages/contact/index.astro`: English Contact page — `BaseLayout`
      wrapping `<ContactSection />`, following the same structure as `src/pages/blog/index.astro`
      (FR-007) — depends on T006.
- [X] T009 [P] [US2] Create `src/pages/es/contact/index.astro`: Spanish equivalent — depends on
      T006.
- [X] T010 [P] [US2] Remove the `<ContactSection />` import and usage from `src/pages/index.astro`
      (Contact now lives on its own page) — depends on T008.
- [X] T011 [P] [US2] Remove the `<ContactSection />` import and usage from
      `src/pages/es/index.astro` — depends on T009.

**Checkpoint**: Run `quickstart.md` sections 2 (Home) and 3 (Contact page). User Stories 1 AND 2
both work independently, in both languages.

---

## Phase 4: User Story 3 - Recognizable contact icons (Priority: P3)

**Goal**: Email styled as an icon-button matching LinkedIn/GitHub/YouTube; GitHub and YouTube
show real, recognizable icons.

**Independent Test**: Load the Contact page and visually confirm all four icon-buttons share the
same style, with GitHub/YouTube showing their platforms' own marks and email showing a standard
envelope icon instead of the word "email" (per spec.md's Independent Test for User Story 3).

- [X] T012 [P] [US3] In `src/config/site.ts`: add `'email'` to the `ContactPlatform` union type;
      add a fourth `contactLinks` entry `{ platform: 'email', username: contactEmail }`; add a
      matching `case 'email': return \`mailto:${link.username}\`;` to `contactLinkUrl`'s switch
      (FR-009; research.md §6, resolved from `/speckit-analyze` finding U1 — this is what lets
      email render through the same array-driven loop, and get the same `aria-label` treatment,
      as LinkedIn/GitHub/YouTube instead of one-off markup).
- [X] T013 [US3] In `src/components/ContactSection.astro`: add an `email: 'Email'` entry to the
      `platformLabels` map; move the email action into the same `<ul class="links">` list as
      LinkedIn/GitHub/YouTube by letting the existing `contactLinks.map()` loop render it (now
      that T012 added it to the array), using the existing `.icon-link`/`.icon` circle-badge
      markup and styling with an inline envelope/mail SVG as its icon; remove the now-unused
      standalone `.email-button` markup and CSS (FR-009) — depends on T012, T006.
- [X] T014 [US3] In `src/components/ContactSection.astro`: replace GitHub's `"gh"` text-initial
      icon and YouTube's `"▶"` text-initial icon with hand-authored inline SVG marks recognizable
      for each platform (a simplified octocat-style silhouette for GitHub; a rounded-rectangle
      with a play triangle for YouTube); LinkedIn's `"in"` text mark is left unchanged (FR-010;
      research.md §6) — depends on T013 (same file, sequential).

**Checkpoint**: Run `quickstart.md` section 4 (contact icon-buttons), including the
keyboard/`aria-label` check. User Stories 1–3 all work independently.

---

## Phase 5: User Story 4 - A personal touch in the footer (Priority: P4)

**Goal**: Footer shows the Gandalf quote, in the visitor's own language, below the existing
copyright line, on every page.

**Independent Test**: Load any page in both languages, scroll to the footer, and confirm both
the copyright line and the correctly-localized attributed quote are present (per spec.md's
Independent Test for User Story 4).

- [X] T015 [US4] In `src/layouts/BaseLayout.astro`'s `<footer class="site-footer">`, add a `<p>`
      below the existing copyright `<p>` that branches on `Astro.currentLocale` (same pattern as
      `AboutSection.astro`/`ContactSection.astro`) to render: English — "All we have to decide is
      what to do with the time that is given us" — Gandalf; Spanish — "Lo único que podemos
      decidir es qué hacer con el tiempo que se nos ha dado" — Gandalf (FR-011; research.md §7,
      resolved from `/speckit-analyze` finding C1 — do **not** hard-code the English text only,
      that would put untranslated prose on every Spanish page) — depends on T002 (same file,
      sequential).

**Checkpoint**: Run `quickstart.md` section 5 (footer quote) on at least two different pages, **in
both languages**. User Stories 1–4 all work independently.

---

## Phase 6: User Story 5 - A tidier two-column Blog grid (Priority: P5)

**Goal**: Blog posts render in a two-column grid; each row's two posts share identical width and
height (matching the taller one).

**Independent Test**: Load the Blog page with several posts and confirm a two-column grid where
each row's items match width and height (per spec.md's Independent Test for User Story 5).

- [X] T016 [US5] In `src/components/BlogList.astro`, change `.blog-list` from a single-column
      list (`max-width: 720px`) to `display: grid; grid-template-columns: repeat(2, 1fr); gap:
      1.5rem; max-width: var(--content-max-width);` and add `@media (max-width: 767.98px) {
      .blog-list { grid-template-columns: 1fr; } }` (FR-012, FR-013; research.md §3 — CSS Grid's
      default row-stretch gives equal height per row natively, no JS change needed). Leave the
      existing `is-even`/`is-odd` index-based class logic untouched — it deliberately produces
      solid alternating columns, not a checkerboard (research.md §3, resolved from
      `/speckit-analyze` finding U2) — depends on T001.

**Checkpoint**: Run `quickstart.md` section 6 (Blog grid), including the "Load More" and
odd-post-count checks. All five user stories are now independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Full verification, including regression-checking 001's existing behavior against
the shared files this feature touches (`BaseLayout.astro`, `NavBar.astro`, `global.css`).

- [X] T017 [P] Execute `quickstart.md`'s full checklist (all 6 sections) end-to-end against a
      real running preview (`npm run build && npm run preview`, viewed in an actual browser at
      each listed viewport width) and fix any failures found.
- [X] T018 [P] Re-run 001-content-website's `quickstart.md` regression-relevant checks — language
      switch targets from non-Home pages, the `english-only-draft` post's translation-pending
      note, the Sales password gate/modal/Load More, and sitemap/robots exclusion for
      `/sales/`/`/easter-egg/` — to confirm none of them regressed from the shared
      `BaseLayout`/`NavBar`/`global.css` changes (quickstart.md's "Regression spot-check"
      section).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **User Stories (Phase 2–6)**: All depend on Setup (T001) only where noted (US1's T002, US5's
  T016). US2/US3/US4 don't need T001 directly. Stories are otherwise independent of each other
  **except** where a task explicitly depends on an earlier story's task because it edits the
  same file (T007 depends on T003; T013 depends on T012 and T006; T015 depends on T002) — see
  each task's own dependency note.
- **Polish (Phase 7)**: Depends on every user story phase you choose to complete.

### User Story Dependencies

- **US1 (P1)**: Depends only on Setup (T001).
- **US2 (P2)**: Independent content/asset work (T004, T005, T006, T008–T011), except T007 which
  must follow US1's T003 (both edit `NavBar.astro`).
- **US3 (P3)**: T012 (`site.ts`) is independent of everything. T013 depends on both T012 and
  US2's T006 (`ContactSection.astro` — US3 layers icon restyling on top of US2's structural
  changes). T014 depends on T013 (same file, sequential).
- **US4 (P4)**: Depends on US1's T002 (both edit `BaseLayout.astro`).
- **US5 (P5)**: Depends only on Setup (T001).

### Parallel Opportunities

- T003 can run in parallel with T002 (different files, no dependency between them).
- T004 and T005 can run in parallel with each other and with anything in US1.
- T008 and T009 can run in parallel once T006 is done; T010 and T011 can run in parallel once
  T008/T009 (respectively) are done.
- T012 (`site.ts`) can run in parallel with anything in US1/US2 — it has no dependency at all.
- T016 (US5) can run in parallel with all of US2/US3/US4 — it only needs T001.
- T017 and T018 can run in parallel (both are verification passes, no file edits).

---

## Parallel Example: User Story 2

```bash
# Once T006 (ContactSection.astro restructure) is done, these four can proceed together:
Task: "Create src/pages/contact/index.astro"
Task: "Create src/pages/es/contact/index.astro"
# ...and once T008/T009 land respectively:
Task: "Remove <ContactSection /> from src/pages/index.astro"
Task: "Remove <ContactSection /> from src/pages/es/index.astro"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001).
2. Complete Phase 2: User Story 1 (T002–T003).
3. **STOP and VALIDATE**: run `quickstart.md` section 1 across all four viewport widths.
4. Deploy/demo if ready — the header fix alone resolves items 1, 2, 3, and 10 from the original
   request.

### Incremental Delivery

1. Setup → US1 (header) → validate → deploy/demo.
2. Add US2 (Home/Contact restructuring) → validate → deploy/demo.
3. Add US3 (icon consistency) → validate → deploy/demo.
4. Add US4 (footer quote) → validate → deploy/demo.
5. Add US5 (Blog grid) → validate → deploy/demo.
6. Phase 7: full `quickstart.md` re-run (both this feature's and 001's regression checks).

Each story adds value without breaking a previously delivered one — the only cross-story
coupling is same-file edit ordering (US2→US1 on `NavBar.astro`, US3→US2 on
`ContactSection.astro`, US4→US1 on `BaseLayout.astro`), not functional dependency. US3's
`site.ts` task (T012) has no cross-story coupling at all and can be done any time.

---

## Notes

- [P] tasks touch different files with no unmet dependency on another incomplete task.
- [Story] labels trace every task back to spec.md's user stories.
- No test tasks are included (see "Tests" note at the top) — `quickstart.md` is the verification
  mechanism, referenced at every phase checkpoint and run in full in Phase 7.
- Every same-file, cross-story dependency in this feature is called out explicitly both on the
  task itself and in the Dependencies section above — check both before starting a task out of
  order.
- Commit after each task or logical group; stop at any checkpoint to validate a story
  independently before moving on.

---

## Phase 8: Convergence

**Purpose**: Gap found by `/speckit-converge` after `/speckit-implement` completed T001–T018 —
verified against the live built site, not just checkbox state.

- [X] T019 Add a visible page heading to `src/pages/contact/index.astro`
      (`<h1 class="page-title">Contact</h1>`) and `src/pages/es/contact/index.astro`
      (`<h1 class="page-title">Contacto</h1>`), matching the `<h1 class="page-title">` pattern
      already used by `src/pages/blog/index.astro` and `src/pages/photos/index.astro` — reuse
      the same `.page-title { text-align: center; padding-top: 2rem; }` style block those pages
      already define per tasks.md T008 (partial)
