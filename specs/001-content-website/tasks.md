---

description: "Task list for the Personal Content Website feature"
---

# Tasks: Personal Content Website (Home, About, Contact, Blog, Photos, Sales, Easter Egg)

**Input**: Design documents from `/specs/001-content-website/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Not included. The constitution adopts no Test-First principle and the spec sets no
automated-testing requirement (see plan.md's Technical Context "Testing" and research.md §10) —
verification is the manual `quickstart.md` checklist, run at the end of Setup+Foundational and
again after each user story, plus explicitly in the Polish phase.

**Organization**: Tasks are grouped by user story (from spec.md, priority order P1→P5) so each
story can be implemented, tested, and demoed independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unmet dependencies)
- **[Story]**: Maps the task to US1–US5 from spec.md
- Every task names its exact file path(s)

## Path Conventions

Single Astro project at the repository root, per plan.md's Project Structure — `src/`,
`public/`, `astro.config.mjs`, `.github/workflows/static.yml`. No `backend/`/`frontend/` split.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Scaffold the Astro project and the build/deploy pipeline it needs.

- [ ] T001 Initialize an Astro project (latest stable, currently 7.3.3 per research.md §1) at the
      repository root in **static output mode** — `package.json`, `tsconfig.json`, and a
      baseline `astro.config.mjs`. Requires Node.js ≥22.12.0.
- [ ] T002 In `astro.config.mjs`, add the `i18n` config: `locales: ['en', 'es']`,
      `defaultLocale: 'en'`, `routing: { prefixDefaultLocale: false }` (research.md §3) — depends
      on T001.
- [ ] T003 In `astro.config.mjs`, add the `@astrojs/sitemap` integration with a `filter` that
      excludes any URL containing `/sales/` or `/easter-egg/` (both language variants), per
      FR-004/SC-004 and research.md §8 — depends on T002 (same file).
- [ ] T004 [P] Create `src/styles/global.css`: brand-palette CSS custom properties (Primary Blue
      `#454DBF`, Secondary Blue `#90B4D4`, Secondary Green `#BFCF74`, Primary Green `#88AB4D`,
      per FR-009/constitution Technical Constraints), neutrals for text/background, a `768px`
      breakpoint value used consistently site-wide (per spec Clarifications), and a minimal
      reset.
- [ ] T005 [P] Create `public/robots.txt` disallowing `/sales/`, `/es/sales/`, `/easter-egg/`,
      `/es/easter-egg/` (FR-004, contracts/routing-contract.md).
- [ ] T006 [P] Update `.github/workflows/static.yml` to run `npm ci && npm run build` before the
      existing `actions/upload-pages-artifact@v3` step, and change that step's `path` from `.`
      to `./dist` (research.md §9; constitution Technical Constraints — hosting).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared infrastructure every user story's pages import — content schema, site
config, layout, nav, language switch.

**⚠️ CRITICAL**: No user story phase may begin until this phase is complete.

- [ ] T007 Create `src/content.config.ts` defining the `blog` and `albums` content collections
      via the Content Layer API `glob()` loader (one loader per locale subfolder:
      `src/content/blog/en/`, `src/content/blog/es/`, `src/content/albums/en/`,
      `src/content/albums/es/`), using the exact Zod schemas from
      `contracts/content-schemas.md` — `blogSchema` (`title: z.string().min(1)`,
      `pubDate: z.coerce.date()`, `translationPending: z.boolean().default(false)`) and
      `albumSchema`/`photoSchema` (`title`/`src`/`alt`: `z.string().min(1)`,
      `photos: z.array(photoSchema).default([])`) — depends on T001.
- [ ] T008 [P] Create `src/config/site.ts` exporting: `blogPageSize = 5`, `salesPageSize = 5`,
      `salesPassword` (owner-set placeholder string, e.g. `"changeme"`), and the three
      `ContactLink` entries — LinkedIn (`cadaviddavid`), GitHub (`iamdavidcadavid`), YouTube
      (`iamdavidcadavid`) — per data-model.md's Site Config / Contact Link and FR-016.
- [ ] T009 [P] Add placeholder assets under `src/assets/placeholders/`: a placeholder profile
      photo (for the About section) and a placeholder default album cover, both clearly
      identifiable as placeholders per FR-007.
- [ ] T010 Create `src/layouts/BaseLayout.astro`: shared `<head>` + header + footer rendered
      identically on every page (FR-001); sets the `<html lang>` attribute from Astro's current
      locale; accepts a `noindex` boolean prop that, when true, renders
      `<meta name="robots" content="noindex, nofollow">` (used by Sales/Easter Egg only);
      imports `src/styles/global.css`; provides slots/placement for the NavBar, LanguageSwitch,
      and page content — depends on T004.
- [ ] T011 [P] Create `src/components/NavBar.astro`: full nav bar linking Home (`/`), About
      (`#about`), Contact (`#contact`), Blog (`/blog/`), Photos (`/photos/`) — FR-002, FR-018
      (Sales and Easter Egg are simply absent from this list, per FR-003). Below 768px, render a
      hamburger control exposing the same links instead of the full bar, with exactly one of the
      two ever visible at any width (FR-005, FR-006).
- [ ] T012 [P] Create `src/components/LanguageSwitch.astro`: uses `astro:i18n`'s
      `getRelativeLocaleUrl()` to link to the equivalent URL of the *current* page in the other
      language, not just that language's Home page (FR-011).

**Checkpoint**: Foundation ready — `npm run dev` should show a page shell (header/nav/footer,
correct language) once any page exists. Proceed to user stories.

---

## Phase 3: User Story 1 - Learn about David and get in touch (Priority: P1) 🎯 MVP

**Goal**: A visitor on the Home page sees the welcome banner, an About section, and a Contact
section with working social links and a mailto button — the site's core "get in touch" value.

**Independent Test**: Load `/` (and `/es/`) directly and verify the banner, About text+photo,
and Contact section (social links + mailto) are all present and functional, without any other
page existing (per spec.md's Independent Test for User Story 1).

### Implementation for User Story 1

- [ ] T013 [P] [US1] Create `src/components/AboutSection.astro` with `id="about"`: one or more
      short placeholder biography paragraphs alongside the placeholder profile photo from T009
      (FR-013). At viewport widths ≥768px, text is to the left and the photo to the right; below
      768px, the photo appears above the text (FR-014).
- [ ] T014 [P] [US1] Create `src/components/ContactSection.astro` with `id="contact"`: opens
      with a short, kind/friendly-toned placeholder paragraph inviting contact (FR-015); renders
      icon links from `src/config/site.ts`'s `ContactLink` entries for LinkedIn, GitHub, and
      YouTube (FR-016); renders a button labeled "email" using a `mailto:contact@davidcadavid.com`
      link that opens the visitor's email client with a new message (FR-017).
- [ ] T015 [US1] Create `src/pages/index.astro`: English Home page — `BaseLayout` (NavBar +
      LanguageSwitch) wrapping a welcome banner with placeholder text (e.g. "Welcome to my
      site", FR-012), then `AboutSection`, then `ContactSection` — depends on T013, T014.
- [ ] T016 [US1] Create `src/pages/es/index.astro`: Spanish Home page, same structure as T015
      with Spanish placeholder copy (FR-008, FR-010) — depends on T013, T014.

**Checkpoint**: Run `quickstart.md` sections 1 (viewport/nav) and 2 (Home). User Story 1 is
fully functional and independently testable/demoable in both languages.

---

## Phase 4: User Story 2 - Browse blog articles (Priority: P2)

**Goal**: A visitor sees a paginated list of blog post excerpts, can "Load More", sees the
bread-oven animation when there are no posts, and can open any post at its own URL for the full
article.

**Independent Test**: Load `/blog/` directly with sample posts and verify the initial list,
alternating styling, "Load More" behavior, the empty-state animation, and opening an individual
post — all without depending on Home, Photos, or Sales (per spec.md's Independent Test for User
Story 2).

### Implementation for User Story 2

- [ ] T017 [P] [US2] Create at least 6 placeholder English blog post files in
      `src/content/blog/en/*.md` (valid `title` + `pubDate` front matter, placeholder body text)
      — more than `blogPageSize` (5) so "Load More" is exercisable (FR-021). Include at least one
      post with `translationPending: true` and deliberately **no** matching Spanish file, to
      exercise FR-027/SC-010.
- [ ] T018 [P] [US2] Create matching Spanish blog post files in `src/content/blog/es/*.md` for
      every English post **except** the one intentionally left untranslated in T017 (per
      constitution Principle II and contracts/content-schemas.md's locale pairing rule).
- [ ] T019 [P] [US2] Create `src/components/BlogList.astro`: renders posts sliced to
      `blogPageSize` from `src/config/site.ts`, each showing its title (linked to
      `/blog/<slug>/` or `/es/blog/<slug>/`) and its first two to three lines computed at render
      time from the post body (FR-019, FR-020); adjacent entries alternate between two visual
      treatments drawn from the brand palette (FR-026); shows a "Load More" button that appends
      the next `blogPageSize`-sized batch and disappears once all posts are shown (FR-021–FR-024);
      shows a bread-oven loading animation instead of the list when there are zero posts
      (FR-025); when an entry's `translationPending` is `true`, renders a visible "not yet
      available in [other language]" note next to that entry (FR-027, SC-010).
- [ ] T020 [US2] Create `src/pages/blog/index.astro`: English Blog list page — `BaseLayout` +
      `BlogList`, fed from `getCollection('blog', ({id}) => id.startsWith('en/'))` — depends on
      T019, T017.
- [ ] T021 [US2] Create `src/pages/es/blog/index.astro`: Spanish equivalent — depends on T019,
      T018.
- [ ] T022 [US2] Create `src/pages/blog/[slug].astro`: `getStaticPaths()` over the English
      `blog` entries; renders the selected post's full body via `render(entry)`/`<Content />` at
      its own URL (FR-020, SC-009); when `translationPending` is `true`, also renders the same
      visible not-yet-translated note as `BlogList` (FR-027, SC-010) — depends on T017.
- [ ] T023 [US2] Create `src/pages/es/blog/[slug].astro`: Spanish equivalent — depends on T018.

**Checkpoint**: Run `quickstart.md` section 4 (Blog). User Stories 1 AND 2 both work
independently, in both languages.

---

## Phase 5: User Story 3 - Browse photo albums (Priority: P3)

**Goal**: A visitor sees a grid of photo albums, opens one at its own URL to see its photos, and
enlarges any photo in a modal; an empty album shows the "Development in process..." state.

**Independent Test**: Load `/photos/` directly with sample albums and verify the grid, album
drill-down (at its own URL), and enlarge-on-click modal — all without depending on any other
page (per spec.md's Independent Test for User Story 3).

### Implementation for User Story 3

- [ ] T024 [P] [US3] Create at least 2 placeholder English album files in
      `src/content/albums/en/*.yaml`: one with several photos (`src`+`alt` each) to exercise the
      grid/list/modal, and one with `photos: []` to exercise the empty-album state (FR-031).
- [ ] T025 [P] [US3] Create matching Spanish album files in `src/content/albums/es/*.yaml` — per
      research.md §11's addendum, an album with no Spanish counterpart yet simply has no `es/`
      file (it will not appear in the Spanish grid; no fallback page is needed for it).
- [ ] T026 [P] [US3] Create `src/components/AlbumGrid.astro`: renders each album's cover image
      and title in a grid, each linking to its `/photos/<slug>/` (or `/es/photos/<slug>/`) page
      (FR-028).
- [ ] T027 [P] [US3] Create `src/components/PhotoLightbox.astro`: renders the given album's
      photo list; clicking a photo opens it enlarged in a modal overlay (FR-030); when the
      album's `photos` array is empty, renders the "Development in process..." message with a
      small photo-developing (darkroom-style) animation instead of a blank grid or an error
      (FR-031).
- [ ] T028 [US3] Create `src/pages/photos/index.astro`: English Photos grid page — `BaseLayout`
      + `AlbumGrid`, fed from the English `albums` entries — depends on T026, T024.
- [ ] T029 [US3] Create `src/pages/es/photos/index.astro`: Spanish equivalent — depends on T026,
      T025.
- [ ] T030 [US3] Create `src/pages/photos/[album].astro`: `getStaticPaths()` over the English
      `albums` entries; renders `PhotoLightbox` for the selected album at its own URL (FR-029,
      SC-009) — depends on T027, T024.
- [ ] T031 [US3] Create `src/pages/es/photos/[album].astro`: Spanish equivalent — depends on
      T027, T025.

**Checkpoint**: Run `quickstart.md` section 5 (Photos). User Stories 1, 2, AND 3 all work
independently, in both languages.

---

## Phase 6: User Story 4 - Shop a private sales catalog via a direct link (Priority: P4)

**Goal**: Someone with the direct `/sales/` URL enters the configured password and browses a
catalog of items, each with a photo carousel; nothing about any item is visible or present in
the page before a correct password.

**Independent Test**: Navigate directly to `/sales/` (no nav entry exists), verify the page is
unreachable/empty of item data without the correct password, and that once unlocked the
catalog, carousel, and Load More behavior work independently of Blog/Photos (per spec.md's
Independent Test for User Story 4).

### Implementation for User Story 4

- [ ] T032 [P] [US4] Create `public/sales-catalog.en.json`: a JSON array of at least 6
      placeholder sale items matching contracts/content-schemas.md's `saleItemSchema` (`id`,
      `name`, `price` as a display-ready string, optional `description`, `photos` — at least 1
      `{src, alt}` entry per item) — enough items to exercise "Load More" against
      `salesPageSize` (FR-035, FR-037).
- [ ] T033 [P] [US4] Create `public/sales-catalog.es.json`: Spanish equivalent placeholder
      items, same shape as T032.
- [ ] T034 [P] [US4] Create `src/components/Carousel.astro`: renders a sale item's `photos` in a
      carousel; clicking a photo enlarges it (FR-036), reusing the same enlarge interaction
      pattern as `PhotoLightbox`.
- [ ] T035 [US4] Create `src/components/SalesGate.astro`: renders a password input; compares the
      entered value client-side against `salesPassword` from `src/config/site.ts` (FR-033); on a
      correct match only, `fetch()`s the locale-appropriate `sales-catalog.*.json` and renders
      each item's name/price/optional description + `Carousel`, showing `salesPageSize` items
      initially with the same "Load More" behavior as `BlogList` (FR-032, FR-035, FR-037); no
      item name/price/description/photo is rendered or present in the page before a correct
      password (SC-005); remembers a correct entry in `sessionStorage` for the rest of that tab's
      session — depends on T034, T008.
- [ ] T036 [P] [US4] Create a shared `<noscript>` fallback markup (either inline in T037/T038 or
      as a small partial) rendering a plain-language message ("This page requires JavaScript") to
      pair with `<SalesGate />`, so a visitor with JavaScript disabled sees an explanation
      instead of an inert password field (FR-034, SC-011; research.md §7 addendum).
- [ ] T037 [US4] Create `src/pages/sales/index.astro`: English Sales page — `BaseLayout` with
      `noindex` set + `SalesGate` + the `<noscript>` fallback from T036; this file MUST NOT be
      referenced from `NavBar.astro` or any other component (FR-003) — depends on T035, T036,
      T010.
- [ ] T038 [US4] Create `src/pages/es/sales/index.astro`: Spanish equivalent, same
      not-referenced-anywhere constraint — depends on T035, T036, T010.

**Checkpoint**: Run `quickstart.md` section 6 (Sales). User Stories 1–4 all work independently.

---

## Phase 7: User Story 5 - Discover the hidden Easter Egg page (Priority: P5)

**Goal**: A visitor who knows/guesses the Easter Egg URL gets a working, unlisted page — content
can be empty for now.

**Independent Test**: Navigate directly to `/easter-egg/` and verify it loads successfully,
isn't linked anywhere, and is excluded from search indexing — regardless of whether any other
page exists (per spec.md's Independent Test for User Story 5).

### Implementation for User Story 5

- [ ] T039 [P] [US5] Create `src/pages/easter-egg/index.astro`: English Easter Egg page —
      `BaseLayout` with `noindex` set, placeholder/empty content; MUST NOT be referenced from
      `NavBar.astro` or any other component (FR-003, FR-038) — depends on T010.
- [ ] T040 [P] [US5] Create `src/pages/es/easter-egg/index.astro`: Spanish equivalent — depends
      on T010.

**Checkpoint**: Run `quickstart.md` section 7 (Easter Egg). All five user stories are now
independently functional.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verification and hardening that spans every story.

- [ ] T041 [P] Verify `public/robots.txt` (T005) and the `@astrojs/sitemap` filter (T003) each
      cover exactly the four hidden URLs — `/sales/`, `/es/sales/`, `/easter-egg/`,
      `/es/easter-egg/` — no more, no fewer (SC-004).
- [ ] T042 [P] Add an `npm run validate:sales` script that Zod-validates both
      `public/sales-catalog.en.json` and `public/sales-catalog.es.json` against
      contracts/content-schemas.md's `saleCatalogSchema`, including the required `id` field
      (data-model.md's Sale Item validation note).
- [ ] T043 [P] Accessibility pass across all pages: every image has `alt` text; `NavBar`
      (including the hamburger), `PhotoLightbox`'s modal, and `Carousel` are all keyboard
      operable; every brand-palette color used as text (not just background) passes standard
      (WCAG AA) contrast against its background (FR-009, SC-008, constitution Principle IV).
- [ ] T044 Run `npm run build && npm run preview` and confirm: the generated sitemap contains no
      `/sales/` or `/easter-egg/` URL in either language, and both hidden pages' rendered HTML
      includes `<meta name="robots" content="noindex, nofollow">` (SC-004).
- [ ] T045 Execute the full `quickstart.md` checklist (all 9 sections) end-to-end against the
      production build (`npm run preview`) and fix any failures found.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately. T002/T003 are sequential (same
  file); T004–T006 can run in parallel with each other and with T002/T003.
- **Foundational (Phase 2)**: Depends on Setup completion — **BLOCKS all user stories**.
- **User Stories (Phase 3–7)**: All depend on Foundational (Phase 2) completion. Independent of
  each other — can proceed in parallel (if staffed) or sequentially in priority order
  (P1 → P2 → P3 → P4 → P5).
- **Polish (Phase 8)**: Depends on every user story phase you choose to complete.

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories.
- **US2 (P2)**: No dependency on other stories (independent content collection, independent
  pages).
- **US3 (P3)**: No dependency on other stories.
- **US4 (P4)**: No dependency on other stories (its own gate + data file).
- **US5 (P5)**: No dependency on other stories.

### Within Each User Story

- Content files before the components that render them (e.g., T017/T018 before T019).
- Components before the pages that use them (e.g., T019 before T020/T021).
- List `index.astro` and `[slug]`/`[album].astro` detail pages can proceed in parallel with each
  other once their shared component exists, but both depend on that component.
- English and Spanish versions of the same page/component are independent files and can be built
  in parallel once their shared dependencies (component, content) exist.

### Parallel Opportunities

- Setup: T004, T005, T006 together.
- Foundational: T008, T009, T011, T012 together (after T001/T004 respectively).
- Once Foundational is done, all 5 user story phases can be staffed in parallel.
- Within US2: T017, T018, T019 together; then T020/T021/T022/T023 (each a different file).
- Within US3: T024, T025, T026, T027 together; then T028/T029/T030/T031.
- Within US4: T032, T033, T034 together.
- Within US5: T038, T039 together.
- Polish: T040, T041, T042 together.

---

## Parallel Example: User Story 2

```bash
# Launch content + component creation for User Story 2 together:
Task: "Create placeholder English blog posts in src/content/blog/en/*.md"
Task: "Create placeholder Spanish blog posts in src/content/blog/es/*.md"
Task: "Create BlogList.astro in src/components/BlogList.astro"

# Once those land, the four page files can proceed together:
Task: "Create src/pages/blog/index.astro"
Task: "Create src/pages/es/blog/index.astro"
Task: "Create src/pages/blog/[slug].astro"
Task: "Create src/pages/es/blog/[slug].astro"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (**CRITICAL** — blocks all stories).
3. Complete Phase 3: User Story 1 (Home — About/Contact, both languages).
4. **STOP and VALIDATE**: run `quickstart.md` sections 1–3 against `/` and `/es/`.
5. Deploy/demo if ready — this alone satisfies the site's core "get in touch" purpose.

### Incremental Delivery

1. Setup + Foundational → foundation ready.
2. Add US1 → validate → deploy/demo (MVP!).
3. Add US2 (Blog) → validate → deploy/demo.
4. Add US3 (Photos) → validate → deploy/demo.
5. Add US4 (Sales) → validate (nothing links to it, by design) → deploy/demo.
6. Add US5 (Easter Egg) → validate → deploy/demo.
7. Phase 8: Polish, then run the full `quickstart.md` checklist once more end-to-end.

Each story adds value without breaking any previously delivered story — none of US1–US5 shares
mutable state or a route with another.

---

## Notes

- [P] tasks touch different files with no unmet dependency on another incomplete task in the
  same batch.
- [Story] labels trace every task back to spec.md's user stories.
- No test tasks are included (see "Tests" note at the top) — `quickstart.md` is the verification
  mechanism, referenced at every phase checkpoint and run in full in Phase 8.
- Sale items intentionally have no dedicated route (research.md §7/§11) — do not add one.
- Commit after each task or logical group; stop at any checkpoint to validate a story
  independently before moving on.
