---

description: "Task list for the Now Page & Photo Navigation Polish feature"
---

# Tasks: Now Page & Photo Navigation Polish

**Input**: Design documents from `/specs/003-now-page-photo-nav/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Not included as separate tasks — consistent with `001-content-website` and
`002-layout-nav-refresh`, this project has no automated test suite (plan.md's Technical
Context). Verification is the manual `quickstart.md` checklist, run via an actual browser (not
just build output), since real bugs in this codebase have historically been invisible in static
HTML/build output alone.

**Organization**: Tasks are grouped by user story (spec.md, priority order P1→P4). Unlike
`002-layout-nav-refresh`, every user story here edits a **disjoint set of files** — there is no
shared prerequisite step, so there is no Foundational phase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unmet dependency)
- **[Story]**: Maps the task to US1–US4 from spec.md
- Every task names its exact file path(s)

---

## Phase 1: Setup

**Purpose**: N/A for this feature. Every user story below touches its own files
(`PhotoLightbox.astro`/`SalesGate.astro` for US1; `content.config.ts`/`src/content/now/`/
`src/pages/now/`/`NavBar.astro` for US2; `src/config/site.ts` for US3; `BaseLayout.astro` for
US4) with no shared token, utility, or infrastructure to stand up first — no tasks in this
phase.

---

## Phase 2: User Story 1 - Browse every photo without leaving the enlarged view (Priority: P1) 🎯 MVP

**Goal**: In both `PhotoLightbox.astro` (Photos page) and `SalesGate.astro` (Sales page), the
enlarged/full-size photo view gets next/previous controls and an aligned caption, so a
multi-photo album/product can be browsed without closing and reopening the view; single-photo
albums/products show no controls.

**Independent Test**: Open a multi-photo album's enlarged view on `/photos/`; step through every
photo with the on-screen controls and the arrow keys without the view ever closing, confirming
the caption always matches the shown photo; open a single-photo album and confirm no controls
render. Repeat on `/sales/` after unlocking (per spec.md's Independent Test for User Story 1;
[interaction-contract.md §A](./contracts/interaction-contract.md#a-enlarged-photo-view--shared-behavior-contract)).

- [X] T001 [P] [US1] In `src/components/PhotoLightbox.astro`: inside `.modal-content`, after
      `<img data-modal-image src="" alt="" />`, add `<p class="modal-caption" data-modal-caption></p>`
      and, conditionally rendered only when `photos.length > 1` (same pattern as
      `Carousel.astro`'s existing `{photos.length > 1 && (<div class="carousel-controls">...)}` —
      no controls in the DOM at all for a single photo, per FR-004), a `<div class="modal-nav">`
      containing `<button type="button" data-modal-prev aria-label="Previous photo">‹</button>`
      and `<button type="button" data-modal-next aria-label="Next photo">›</button>`. Add CSS: a
      flex row (`display:flex; align-items:center; justify-content:center; gap:1rem;`) placing
      the prev button, caption, and next button on one line directly below the image, so the
      caption sits "aligned with the arrows" (FR-005); style `.modal-nav button` to match
      `.carousel-controls button`'s existing circular-button look (`background:
      var(--color-primary-blue); color: var(--color-white); border-radius: 50%; width: 32px;
      height: 32px; border: none; font-size: 1.25rem; cursor: pointer;`).
- [X] T002 [US1] In `src/components/PhotoLightbox.astro`'s `<script>`: add `let currentIndex = 0;`
      and a `photos` array built once from the existing `triggers` (`const photos =
      triggers.map((t) => t.querySelector('img'));`); add a `showAt(index)` helper that wraps
      `index` (`(index + photos.length) % photos.length`), updates `modalImage.src`/`.alt` from
      `photos[wrapped]`, sets `currentIndex = wrapped`, and writes the caption element's
      `textContent` to the shown photo's `alt`; update `open(index)` to call `showAt(index)`
      instead of setting the image directly (so opening any thumbnail also sets the caption and
      `currentIndex`); wire
      `modal?.querySelector('[data-modal-prev]')?.addEventListener('click', () => showAt(currentIndex - 1))`
      and the `next` button to `showAt(currentIndex + 1)`; extend the existing
      `document.addEventListener('keydown', ...)` handler to also call `showAt(currentIndex - 1)`
      on `ArrowLeft` and `showAt(currentIndex + 1)` on `ArrowRight`, guarded by
      `!modal.hidden && photos.length > 1` (FR-001–FR-003, FR-006, FR-007;
      interaction-contract.md §A) — depends on T001 (script attaches listeners to elements T001
      creates).
- [X] T003 [P] [US1] In `src/components/SalesGate.astro`: inside `.sg-modal-content`, after
      `<img data-sg-modal-image src="" alt="" />`, add `<p class="sg-modal-caption" data-sg-modal-caption></p>`
      and `<div class="sg-modal-nav"><button type="button" data-sg-modal-prev aria-label="Previous photo">‹</button><button type="button" data-sg-modal-next aria-label="Next photo">›</button></div>`.
      Unlike `PhotoLightbox`, `SalesGate` uses one shared modal for every item and only learns an
      item's photo count at open-time (research.md §5), so both nav buttons are present in the
      static markup with the `hidden` attribute by default; the caption element is never hidden
      (its text is simply set/cleared at open-time). Add CSS matching T001's visual treatment
      (flex row below the image; `.sg-modal-nav button` styled like `.sg-carousel-controls
      button`'s existing circular look) — parallel with T001/T002 (different file).
- [X] T004 [US1] In `src/components/SalesGate.astro`'s `<script>`: change `openModal(src, alt)`
      to `openModal(photos, index)`; add `let currentPhotos = []; let currentIndex = 0;` in the
      script's closure (alongside the existing `modal`/`modalImage` consts); inside `openModal`,
      set `currentPhotos = photos; currentIndex = index;`, populate `modalImage.src`/`.alt` and
      the caption element's `textContent` from `photos[index]`, and toggle both nav buttons'
      `hidden` attribute based on `photos.length > 1`; update the slide-button click handler
      inside `renderItem()` from `slideBtn.addEventListener('click', () => openModal(photo.src, photo.alt))`
      to `slideBtn.addEventListener('click', () => openModal(item.photos, index))`; add a
      `showAt(index)` helper identical in shape to T002's (wraps against `currentPhotos.length`,
      updates image + caption + `currentIndex`), wire it to the two nav buttons' `click`
      listeners, and extend the existing `Escape` keydown listener with `ArrowLeft`/`ArrowRight`
      handling guarded by `!modal.hidden && currentPhotos.length > 1` (FR-001–FR-003, FR-006,
      FR-007, FR-008; interaction-contract.md §A) — depends on T003 (same file, sequential; needs
      T003's markup to attach listeners to).

**Checkpoint**: Run `quickstart.md` Scenarios 1 and 2 (Photos and Sales enlarged-view
navigation, including arrow keys and the single-photo no-controls case, in both languages). User
Story 1 is independently functional — this alone resolves the highest-friction item in the
original request.

---

## Phase 3: User Story 2 - A "Now" page with a latest update and collapsible history (Priority: P2)

**Goal**: A new, bilingual, publicly-indexed "Now" page reachable from primary navigation, whose
latest status update is always visible and whose prior updates sit in a native, independently
expandable/collapsible accordion below it.

**Independent Test**: Navigate to the Now page from the nav; confirm the latest update is
immediately visible, prior updates are present but collapsed and labeled by date, and each
expands/collapses independently (including via keyboard) without a page reload. Repeat in
Spanish (per spec.md's Independent Test for User Story 2;
[interaction-contract.md §B](./contracts/interaction-contract.md#b-now-page-accordion--behavior-contract)).

- [X] T005 [P] [US2] In `src/content.config.ts`: add
      ```ts
      const nowSchema = z.object({
        date: z.coerce.date(),
        title: z.string().min(1),
      });
      const now = defineCollection({
        loader: glob({ base: './src/content/now', pattern: '**/*.md' }),
        schema: nowSchema,
      });
      ```
      and add `now` to `export const collections = { blog, albums, now };`. Per
      data-model.md's field table: `date` is **required**, coerced from an ISO string (mirrors
      `blog`'s `pubDate` field exactly — same `z.coerce.date()` treatment); `title` is
      **required**, a non-empty string (`min length 1`); the markdown body is **required and
      must be non-empty**.
- [X] T006 [P] [US2] Create two English placeholder entries: `src/content/now/en/latest-update.md`
      (frontmatter `date:` a recent date, `title: "[PLACEHOLDER] What I'm up to now"`, body: 2–3
      short placeholder paragraphs) and `src/content/now/en/first-entry.md` (an earlier `date:`,
      `title: "[PLACEHOLDER] An earlier update"`, a shorter placeholder body) — matches
      data-model.md's "Now Update" entity shape — depends on T005.
- [X] T007 [P] [US2] Create the Spanish equivalents with the same slugs and dates:
      `src/content/now/es/latest-update.md` (`title: "[MARCADOR DE POSICIÓN] En qué estoy ahora"`)
      and `src/content/now/es/first-entry.md` (`title: "[MARCADOR DE POSICIÓN] Una actualización anterior"`),
      each with a Spanish placeholder body — depends on T005 (parallel with T006, different
      files).
- [X] T008 [US2] Create `src/pages/now/index.astro`: `getCollection('now', ({ id }) =>
      id.startsWith('en/'))`, sort descending by `date` (same pattern as `BlogList.astro`'s
      `sorted = [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())`,
      substituting `date` for `pubDate`); split into `const [latest, ...prior] = sorted;`; render
      each entry's markdown via `astro:content`'s `render()` (`const { Content: LatestContent } =
      await render(latest);` for the latest entry, and `await Promise.all(prior.map((entry) =>
      render(entry)))` to get each prior entry's `Content` component for use inside the
      accordion). Template: `<h1 class="page-title">Now</h1>` (matches the `page-title` pattern
      used by `blog/index.astro`/`photos/index.astro`/`contact/index.astro`), then a
      `<section class="now-latest">` showing `latest.data.title`, its formatted `date`, and
      `<LatestContent />`; then, only `{prior.length > 0 && (<div class="now-history">...)}`
      (never rendered empty — spec.md Edge Cases), one `<details>` per prior entry with a
      `<summary>` showing that entry's date and `title`, and its rendered `<Content />` inside.
      No `name` attribute on any `<details>` (entries toggle independently;
      interaction-contract.md §B) — depends on T006.
- [X] T009 [P] [US2] Create `src/pages/es/now/index.astro`: Spanish equivalent of T008 — filter
      with `id.startsWith('es/')`, `<h1 class="page-title">Ahora</h1>` — depends on T007.
- [X] T010 [P] [US2] In `src/components/NavBar.astro`'s `links` array, insert
      `{ label: 'Now', href: getRelativeLocaleUrl(locale, '/now/') }` immediately after the
      `Home` entry (matching this array's existing convention of unlocalized English labels — the
      same convention already applied to `Home`/`Contact`/`Blog`/`Photos` on the Spanish site) —
      no dependency on T008/T009 to write, but validate together with them at the checkpoint
      below.

**Checkpoint**: Run `quickstart.md` Scenario 3 (Now page: latest update, independent
expand/collapse, keyboard operability, nav link, language switch) in both languages. User
Stories 1 and 2 both work independently.

---

## Phase 4: User Story 3 - More blog posts before "Load More" (Priority: P3)

**Goal**: The Blog page shows 6 posts per language before "Load More" is needed, instead of 5.

**Independent Test**: With 7+ published posts in a language, load the Blog page and count posts
shown before any interaction (per spec.md's Independent Test for User Story 3). The repo
currently has exactly 6 English posts (5 Spanish) — one short of what's needed to actually see
"Load More" appear at the new page size, so T011 below seeds a 7th before T012 changes the
constant (`/speckit-analyze` finding C1: without a 7th post, FR-016/SC-006's "Load More" path is
unverifiable and quickstart.md previously overstated the existing seed count).

- [X] T011 [P] [US3] Create `src/content/blog/en/a-quick-project-update.md`: frontmatter
      `title: "[PLACEHOLDER] A quick project update"`, `pubDate: 2026-02-16`,
      `translationPending: true` (same pattern as the existing
      `src/content/blog/en/english-only-draft.md` — no Spanish counterpart is needed, since
      Spanish stays at 5 posts, safely under the new `blogPageSize`), plus 1–2 placeholder
      paragraphs. Brings the English blog collection to 7 posts total, which FR-016/SC-006
      require to actually exercise the "Load More" boundary this story changes
      (`/speckit-analyze` finding C1).
- [X] T012 [P] [US3] In `src/config/site.ts`, change `export const blogPageSize = 5;` to
      `export const blogPageSize = 6;` (FR-016). No other change — `BlogList.astro` already reads
      this value into `data-page-size` at runtime (research.md §7).

**Checkpoint**: Run `quickstart.md` Scenario 4 (Blog page size, now with 7 English posts seeded
by T011). User Stories 1–3 all work independently.

---

## Phase 5: User Story 4 - Comfortable spacing around the navigation bar (Priority: P4)

**Goal**: The header's nav content (links/hamburger icon) has visible vertical breathing room
above and below it, on both mobile and desktop, instead of sitting flush against the header
bar's edges.

**Independent Test**: Load any page at both a mobile and a desktop viewport width and visually
confirm the header's content is not touching the header bar's top or bottom edge (per spec.md's
Independent Test for User Story 4).

- [X] T013 [P] [US4] In `src/layouts/BaseLayout.astro`, add `padding-block: 10px;` to the
      `.site-header-inner` rule (the flex container already holding `<NavBar />` and
      `<LanguageSwitch />`) — not `.site-header` itself, so the sticky bar's `border-bottom` stays
      at the true header edge (research.md §6). Applies identically to mobile and desktop; no
      breakpoint override. During the Phase 6 checkpoint, if 10px visually makes the header too
      tall, reduce uniformly — never below `padding-block: 5px;` (FR-017, FR-018).

**Checkpoint**: Run `quickstart.md` Scenario 5 (header spacing, both breakpoints, sticky-scroll
still working). All four user stories are now independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Full verification across languages and breakpoints, plus a regression check against
the shared files this feature's US2/US4 touch (`NavBar.astro`, `BaseLayout.astro`).

- [X] T014 [P] Execute `quickstart.md`'s full checklist (all 5 scenarios) end-to-end against a
      real running preview (`npm run build && npm run preview`, viewed in an actual browser),
      both languages, mobile and desktop widths; if T013's header padding looks too tall at 10px,
      reduce it (down to the 5px floor) here and re-verify.
- [X] T015 [P] Regression spot-check: confirm the Sales page's existing per-item thumbnail
      carousel (`.sg-carousel-controls`, added before this feature) still works unchanged; confirm
      `Escape` still closes both enlarged views; confirm the language switch still resolves
      correctly from every page, including the two new `/now/`/`/es/now/` routes; confirm
      `/sales/` and `/easter-egg/` remain excluded from the sitemap while `/now/` and `/es/now/`
      **are** present in it (inspect the sitemap file generated under `dist/` by `npm run build`
      — unaffected exclusions per contracts/routing-contract.md, and closes `/speckit-analyze`
      finding C2, which found no task previously verified the Now page's sitemap inclusion half
      of FR-015).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No tasks — nothing to wait on.
- **User Stories (Phase 2–5)**: Each depends only on nothing outside itself — every story's
  files are disjoint from every other story's files (unlike 002, there is no shared-file
  cross-story dependency at all). All four can proceed in parallel if staffed, or in priority
  order (P1→P2→P3→P4) if not.
- **Polish (Phase 6)**: Depends on every user story phase you choose to complete.

### User Story Dependencies

- **US1 (P1)**: No dependency on any other story. Internal ordering: T002 depends on T001 (same
  file); T004 depends on T003 (same file).
- **US2 (P2)**: No dependency on any other story. Internal ordering: T006/T007 depend on T005
  (schema must exist before content files are meaningfully validated); T008 depends on T006; T009
  depends on T007; T010 has no hard dependency.
- **US3 (P3)**: No dependency on any other story. T011 (seed a 7th English blog post) and T012
  (`blogPageSize` constant) touch different files and have no dependency on each other.
- **US4 (P4)**: No dependency on any other story or internal ordering (single task).

### Parallel Opportunities

- T001 (PhotoLightbox markup/CSS) and T003 (SalesGate markup/CSS) can run in parallel — different
  files.
- T005 (`content.config.ts`), T011 (new blog post), T012 (`site.ts`), and T013
  (`BaseLayout.astro`) have no dependency on anything and can run in parallel with all of US1 and
  each other.
- T006 and T007 can run in parallel once T005 lands (different locale directories).
- T008 and T009 can run in parallel once their respective content tasks (T006, T007) land.
- T010 (`NavBar.astro`) can run in parallel with everything in US1/US3/US4 and with T005–T009
  (different file, no dependency).
- T014 and T015 can run in parallel (both are verification passes, no file edits).

---

## Parallel Example: User Story 1

```bash
# These two can proceed together (different files):
Task: "Add caption + prev/next markup/CSS to src/components/PhotoLightbox.astro"
Task: "Add caption + prev/next markup/CSS to src/components/SalesGate.astro"
# ...then, once each file's markup task lands, its own script task follows sequentially:
Task: "Wire prev/next + arrow-key script logic in src/components/PhotoLightbox.astro"
Task: "Wire prev/next + arrow-key script logic in src/components/SalesGate.astro"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: User Story 1 (T001–T004).
2. **STOP and VALIDATE**: run `quickstart.md` Scenarios 1–2 in both languages.
3. Deploy/demo if ready — this alone resolves items 4–6 of the original request, the
   highest-friction fix.

### Incremental Delivery

1. US1 (photo navigation) → validate → deploy/demo.
2. Add US2 (Now page) → validate → deploy/demo.
3. Add US3 (blog page size) → validate → deploy/demo.
4. Add US4 (header spacing) → validate → deploy/demo.
5. Phase 6: full `quickstart.md` re-run plus regression spot-check.

Every story adds value without breaking a previously delivered one — there is no cross-story file
coupling in this feature at all (each story's files are entirely its own).

---

## Notes

- [P] tasks touch different files with no unmet dependency on another incomplete task.
- [Story] labels trace every task back to spec.md's user stories.
- No test tasks are included (see "Tests" note at the top) — `quickstart.md` is the verification
  mechanism, referenced at every phase checkpoint and run in full in Phase 6.
- Commit after each task or logical group; stop at any checkpoint to validate a story
  independently before moving on.
