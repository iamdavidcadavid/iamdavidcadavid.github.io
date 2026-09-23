# Phase 1 Data Model: Now Page & Photo Navigation Polish

This feature adds one new content entity (`Now Update`) and touches no other persisted data.
The photo-navigation work (User Story 1) introduces only in-memory client-side UI state
(current photo index within an already-loaded photo set); it does not change the `Photo` or
`Album`/sale-item shapes defined in feature 001.

## Now Update

Represents a single dated status entry on the Now page. Modeled as an `astro:content` collection
entry, one markdown file per entry per locale — directly analogous to the existing `blog`
collection (`src/content/blog/{en,es}/*.md`).

**Location**: `src/content/now/{en,es}/<slug>.md`

**Collection id shape**: locale-prefixed, e.g. `en/2026-01-latest-update`, `es/2026-01-latest-update`
(same convention as `blog`/`albums`: pages filter with `id.startsWith('en/')` / `id.startsWith('es/')`).

| Field | Type | Required | Notes |
|---|---|---|---|
| `date` | date (coerced from ISO string, e.g. `2026-01-15`) | Yes | Drives sort order and the label shown on collapsed prior entries. Mirrors `blog`'s `pubDate` field exactly (same `z.coerce.date()` treatment). |
| `title` | string, min length 1 | Yes | Short heading for the entry, shown next to its date whether latest or collapsed. |
| body (markdown content) | markdown | Yes (non-empty) | The entry's full text, rendered via `render()` + `<Content />`, same as `blog/[slug].astro`. |

No `translationPending` field is introduced for this entity: unlike blog posts (which may be
published in one language ahead of the other and need an explicit visible marker per Principle
II), every Now Update entry ships in both `en/` and `es/` together from the start — the feature
defines the page's structure/behavior, not an ongoing content-authoring workflow (see spec.md
Assumptions). If a future entry is ever published in only one language, the existing
`translationPending` pattern from `blog` is available to extend to `now` at that time — it is
intentionally out of scope here.

**Derived state (not stored)**:
- **Latest update**: the entry with the maximum `date` in a given locale's sorted set.
- **Prior updates**: all other entries in that locale, ordered most-recent-first.

**Validation rules**:
- `date` MUST be a valid, parseable date — enforced by the collection's `zod` schema in
  `src/content.config.ts` (`z.coerce.date()`), matching the existing `blogSchema` shape.
- `title` MUST be a non-empty string — enforced by the same schema (`z.string().min(1)`).
- The markdown body MUST be non-empty (a Now Update with no content is not meaningful). Note:
  this is an **authoring convention**, not schema-enforced — Astro content-collection `schema`
  validates frontmatter fields only, not the markdown body, so an empty body would still pass
  the build (the same is already true of the existing `blog` collection). Authors are expected
  to follow this rule manually when creating entries.

**Relationships**: None to other collections. Rendered only by the two new Now pages
(`src/pages/now/index.astro`, `src/pages/es/now/index.astro`).

**State transitions**: None — entries are static content authored/edited directly in the
repository, like blog posts and albums. There is no runtime create/update/delete flow (Principle
III: no server-side runtime).
