# Phase 0 Research: Now Page & Photo Navigation Polish

All items below were resolvable from the existing codebase's established conventions; no
`NEEDS CLARIFICATION` markers remained in the Technical Context.

## 1. Accordion mechanism for the Now page's prior updates

**Decision**: Use native `<details>`/`<summary>` elements, one per prior update, with no shared
`name` attribute (so entries toggle independently and several may be open at once).

**Rationale**: `<details>`/`<summary>` is built into HTML: it is keyboard-operable, exposes the
correct `button`/expanded state to screen readers automatically, and requires zero JavaScript.
Constitution Principle III explicitly says to "prefer the simplest solution... that satisfies the
other principles — do not add frameworks, build tooling, or abstractions the site does not need."
A hand-rolled JS accordion (state array + click handlers + ARIA attribute management, as would be
needed to replicate this by hand) would duplicate what the browser already provides correctly.

**Alternatives considered**:
- Custom JS accordion (same pattern as `BlogList.astro`'s load-more button): rejected — strictly
  more code and more accessibility surface area to get right, for behavior `<details>` gives for free.
- CSS-only checkbox-hack accordion: rejected — `<details>` is the same zero-JS cost with correct
  semantics out of the box; the checkbox hack has none of that and needs extra markup.

## 2. Content model for "Now Update" entries

**Decision**: A new `now` Astro Content Collection, markdown files under
`src/content/now/{en,es}/*.md` with frontmatter `{ date: coerced date, title: string }`, body
rendered via `astro:content`'s `render()` + `<Content />`, loaded with the same locale-prefixed
`glob()` pattern already used for `blog` and `albums` in `src/content.config.ts`.

**Rationale**: Now Update entries are freeform prose (a status update, potentially several
paragraphs), which is exactly what the existing `blog` collection already models and exactly what
`blog/[slug].astro` already knows how to render (`render(post)` → `<Content />`). Reusing that
proven pattern needs no new loader logic. YAML (the `albums` collection's format) fits structured,
enumerable fields (photo lists) far better than prose and was rejected for that reason.

**Alternatives considered**:
- Reuse the `blog` collection with a `kind: 'now'` discriminator field: rejected — conflates two
  content types the constitution treats differently (Principle VI, "Blog Content Integrity," has
  blog-specific publish-date/authorship/translation-pending rules that should not implicitly start
  applying to Now updates, and vice versa).
- Plain YAML with a `body: string` field (rendered as one block of text): rejected — loses
  markdown paragraph/emphasis support the blog collection already has, for no benefit.

## 3. Determining which entry is "latest" vs "prior"

**Decision**: Sort all entries in a locale by `date` descending (identical to `BlogList.astro`'s
existing `sorted = [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())`
pattern). The entry at index 0 is rendered as the always-visible "latest" update; the rest are
rendered inside individual `<details>` elements, most-recent-first.

**Rationale**: Deriving "latest" from the date avoids a separate `isLatest` boolean that an author
could forget to move when adding a new entry — the sort is the single source of truth, and the
pattern already exists elsewhere in the codebase.

**Alternatives considered**: A stored `isLatest: boolean` flag — rejected as an extra field that
must be manually kept in sync (unset on the old latest, set on the new one) every time an update is
published, which is exactly the kind of authoring footgun a derived value avoids.

## 4. In-modal next/previous navigation — `PhotoLightbox.astro` (Photos page)

**Decision**: Because `PhotoLightbox` receives the full `photos` array as an Astro prop at build
time (per-album, per-page instance), render the prev/next buttons and the caption element
conditionally in the template itself — `{photos.length > 1 && (...)}` — exactly like
`Carousel.astro` already does for its own thumbnail-level controls. The existing inline `<script>`
block already builds an array of slide images from the DOM (`triggers.map(...)`); extend it to
track a `currentIndex`, and give the prev/next buttons and the `Escape` keydown listener sibling
handlers for `ArrowLeft`/`ArrowRight` (guarded by `!modal.hidden`).

**Rationale**: Server-rendering the controls only when there is more than one photo means "no
controls for a single photo" (FR-004) is enforced by the controls never existing in the DOM at all,
not by a runtime `hidden` toggle that could be forgotten or raced — the same robustness argument
already documented for `Carousel.astro`'s thumbnail-level arrows.

**Alternatives considered**: Always render the buttons and hide them with `[hidden]` when
`photos.length <= 1`: rejected — strictly more fragile than omitting the markup, and inconsistent
with the codebase's existing convention (`Carousel.astro`) for the exact same decision.

## 5. In-modal next/previous navigation — `SalesGate.astro` (Sales page)

**Decision**: `SalesGate` uses a single shared `.sg-modal` element for every item's enlarged view
(items and their photo counts are only known at runtime, after the catalog JSON loads client-side
post-password). So, unlike `PhotoLightbox`, the prev/next buttons and caption element must exist
once in the static markup and be toggled with the `hidden` attribute at open-time, based on the
clicked item's `photos.length`. `openModal(src, alt)` becomes `openModal(photos, index)`, storing
`currentPhotos`/`currentIndex` in the script's closure scope so prev/next/keyboard handlers can
read and update them; the existing per-item thumbnail carousel (`sg-carousel-controls`,
unaffected by this feature) keeps working exactly as before.

**Rationale**: This mirrors decision 4 as closely as the runtime-vs-build-time difference allows,
keeping both galleries' enlarged-view behavior — buttons, caption placement, wraparound, arrow-key
support — identical from a visitor's perspective (FR-008), while respecting the existing
constraint that sale item data must not be present in the page before the password is entered
(001's SC-005) — the shared modal shell can exist statically since it renders no item data itself.

**Alternatives considered**: Render one modal per item (like the per-item thumbnail carousels):
rejected — would multiply DOM nodes for every catalog item and complicate the "no item data
before password" guarantee for no behavioral benefit, since only one modal is ever open at a time.

## 6. Header vertical spacing

**Decision**: Add `padding-block: 10px;` to `.site-header-inner` in `BaseLayout.astro` (the flex
container that already holds `NavBar` + `LanguageSwitch`), with no separate mobile/desktop
override — identical in spirit to 002's decision to drop the mobile-only `.navbar` override and
let one rule serve both breakpoints. If browser verification during implementation shows the
10px value making the header visually too tall, reduce uniformly down to a floor of 5px
(`padding-block: 5px;`), per the spec's documented range.

**Rationale**: `.site-header-inner` is the element whose children (nav links, hamburger button,
language switch) actually need the breathing room; padding on `.site-header` itself would also
push the `border-bottom` away from the sticky bar's true edge, which is not what was asked for.

**Alternatives considered**: Per-breakpoint padding (different mobile vs desktop values): rejected
— the spec explicitly asks for the same treatment on both, and 002's research already established
that this codebase prefers one rule over duplicated breakpoint-specific overrides where behavior
should be identical.

## 7. Blog page size

**Decision**: Change the single constant `blogPageSize` in `src/config/site.ts` from `5` to `6`.
No changes to `BlogList.astro` are needed — it already reads `blogPageSize` into a
`data-page-size` attribute and uses that value at runtime.

**Rationale**: The page-size behavior is already fully data-driven; only the source-of-truth value
needs to change.

## 8. Navigation placement and discoverability of the Now page

**Decision**: Insert a `{ label: 'Now', href: getRelativeLocaleUrl(locale, '/now/') }` entry into
`NavBar.astro`'s `links` array, immediately after `Home`. No change to `astro.config.mjs`'s
sitemap `filter` — it only excludes `/sales/` and `/easter-egg/`, and the Now page must be public
and indexed (FR-015), so the default (included) behavior is already correct.

**Rationale**: Matches the spec's documented Assumption; reuses `NavBar.astro`'s existing
locale-aware link-building pattern with no new logic.
