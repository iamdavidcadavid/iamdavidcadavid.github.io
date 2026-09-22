# Phase 1 Data Model: Personal Content Website

Derived from spec.md's Key Entities section, expanded with concrete fields/types for the Astro
Content Collections chosen in research.md. Every content entity exists once per locale (`en`
and `es`, per FR-010) as separate files in the matching locale subfolder — this document
describes the shape of one locale's entry; the other locale's entry has the same shape.

## Blog Post

**Collection**: `blog` (`src/content/blog/en/*.md`, `src/content/blog/es/*.md`)

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Shown in the Blog list (FR-019) |
| `pubDate` | date | yes | Publish date — required by constitution Principle VI |
| `translationPending` | boolean | no (default `false`) | Set `true` on a post that exists in one language but not yet the other, per constitution Principle II's "visible translation-pending indicator" rule |
| body (Markdown content) | Markdown | yes | Full article text. The list view's "first two to three lines" (FR-019) is *computed at render time* from this body, not stored as a separate field, so the excerpt can never drift out of sync with the source text |

**Identity**: filename (slug) within its locale folder — this slug is also the post's URL
segment (`/blog/<slug>/`, `/es/blog/<slug>/`), generated via `getStaticPaths()`
(research.md §11).

**Validation rules**: `title` non-empty; `pubDate` a valid date; schema enforced via Zod in
`src/content.config.ts` so a malformed post fails the build rather than shipping broken.

**Relationships**: none (flat list, ordered by `pubDate` descending for display).

**Routes**: `/blog/` (list, excerpts only) and `/blog/<slug>/` (detail, full body) — see
contracts/routing-contract.md.

## Photo Album

**Collection**: `albums` (`src/content/albums/en/*.yaml`, `.../es/*.yaml`)

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Shown on the album's grid tile (FR-027) |
| `cover` | object `{ src: string, alt: string }` | yes | Grid tile cover image; `alt` required for accessibility (constitution Principle IV) |
| `photos` | array of Photo (see below) | yes, may be empty `[]` | Empty array triggers the "Development in process..." empty state (FR-030) |

**Identity**: filename (slug) within its locale folder — also the album's URL segment
(`/photos/<slug>/`, `/es/photos/<slug>/`), generated via `getStaticPaths()` (research.md §11).

**Validation rules**: `title` non-empty; `cover.alt` non-empty; `photos` defaults to `[]` if
omitted (not an error — this is the documented empty-album case, not a data error).

**Relationships**: has-many Photo, embedded inline (not a separate top-level collection — a
photo only ever exists in the context of one album, per spec's Key Entities).

**Routes**: `/photos/` (grid of album covers) and `/photos/<slug>/` (that album's photo list,
plus the enlarge-on-click modal) — see contracts/routing-contract.md.

## Photo (embedded)

Not a top-level collection — appears only as an entry in an Album's `photos` array or a Sale
Item's `photos` array (see below).

| Field | Type | Required | Notes |
|---|---|---|---|
| `src` | string (image path) | yes | Rendered at grid, list, and enlarged-modal sizes |
| `alt` | string | yes | Required for accessibility (constitution Principle IV) |

## Sale Item

**Storage**: intentionally **not** an Astro content collection (kept out of the built page
HTML/JS per research.md §7). Authored directly as static JSON under `public/`:
`public/sales-catalog.en.json`, `public/sales-catalog.es.json` — each a JSON array of items.

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | FR-033 |
| `price` | string | yes | Stored as a display-ready string (e.g., `"$45"`) rather than a bare number, since currency/formatting is a content decision, not a computed one |
| `description` | string | no | Optional per FR-033 |
| `photos` | array of Photo (see above) | yes, at least 1 | FR-033 requires "one or more photos"; the carousel (FR-034) needs at least one to render |

**Identity**: array index or an explicit `id` string field, used only to key the carousel/DOM
elements — no cross-references depend on it.

**Validation rules**: `photos.length >= 1`. Because this file lives in `public/` and bypasses
the content-collection build pipeline, it is *not* Zod-validated by Astro automatically; a
small `npm run validate:sales` script (documented as a task, not implemented in this plan) is
recommended to check both JSON files against the same shape before each deploy.

**Relationships**: has-many Photo, embedded inline (same pattern as Photo Album).

## Contact Link

**Storage**: not authored content — a fixed constant in `src/config/site.ts`, since the spec
pins these to exact, unchanging values (FR-016).

| Field | Type | Notes |
|---|---|---|
| `platform` | `'linkedin' \| 'github' \| 'youtube'` | Selects icon + base URL pattern |
| `username` | string | `cadaviddavid` for LinkedIn, `iamdavidcadavid` for GitHub and YouTube (FR-016) |

## Navigation Entry

**Storage**: not authored content — a fixed constant array in `NavBar.astro` (or a shared
config module), since nav membership is exactly the 5 public pages from FR-002 and is not meant
to be editable data. Sales and Easter Egg are hidden *by simply not appearing in this list*
(FR-003) — there is no `visible`/`hidden` flag to set wrong.

| Field | Type | Notes |
|---|---|---|
| `label` | string | Display text (localized per language file/dictionary) |
| `href` | string | Target path or `#about` / `#contact` anchor on Home (FR-018) |

## Site Config

**Storage**: `src/config/site.ts` — not in the spec's original Key Entities list, but needed to
back FR-021 (configurable Blog page size) and FR-032/FR-035 (configurable Sales password and
page size).

| Field | Type | Default | Notes |
|---|---|---|---|
| `blogPageSize` | number | `5` | Initial + "Load More" increment (FR-021, FR-023) |
| `salesPageSize` | number | `5` | Same pattern, applied to the Sales list (FR-035) |
| `salesPassword` | string | *(owner-set, e.g. placeholder `"changeme"`)* | Checked entirely client-side (FR-032); **not a secret** — this file ships in the built JS bundle, consistent with the spec's explicit "front-end-only, not real security" framing |
