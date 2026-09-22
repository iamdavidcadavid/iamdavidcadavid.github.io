# Phase 0 Research: Personal Content Website

All items below were either fully specified by the user/spec/constitution (no research needed)
or resolved through documentation lookups against the framework the user specified. No
`NEEDS CLARIFICATION` markers remain in the Technical Context.

## 1. Framework and version

**Decision**: Astro, latest stable release — **7.3.3** at plan time (Node.js ≥22.12.0 required).

**Rationale**: Explicitly requested by the user ("Use the latest version of the Astro
framework"). Confirmed via the npm registry (`npm view astro version` / registry metadata) at
plan time rather than assumed from training data, since "latest" is a moving target.

**Alternatives considered**: None — the framework choice was a direct instruction, not an open
design decision.

## 2. Rendering mode (static vs. SSR)

**Decision**: Astro's default **static output mode** (`output: 'static'`, the default — no
`server`/`hybrid` output, no SSR adapter installed).

**Rationale**: The user explicitly said "No backend code is required," and constitution
Principle III (Static-Site Simplicity) prohibits introducing a server-side runtime unless the
owner explicitly decides to change the hosting model. Astro's static mode builds to plain HTML/
CSS/JS, deployable to GitHub Pages exactly like the current site, just with a build step in
front of it.

**Alternatives considered**: Astro `server`/`hybrid` output with an adapter (Node, Deno,
Cloudflare) — rejected outright; it would require a server runtime GitHub Pages cannot provide
and directly contradicts both the constitution and the user's instruction.

## 3. Internationalization / URL routing

**Decision**: Astro's built-in i18n routing (`astro:i18n`), configured as:

```js
i18n: {
  locales: ['en', 'es'],
  defaultLocale: 'en',
  routing: { prefixDefaultLocale: false },
}
```

English pages are served unprefixed at the root; Spanish pages are served under `/es/`. The
`getRelativeLocaleUrl()` helper from `astro:i18n` generates the language-switch link on every
page, pointing at the equivalent URL in the other language.

**Rationale**: This is exactly the URL scheme decided in the spec's Clarifications session
(English default/unprefixed, Spanish under `/es/`, switch control links to the equivalent page)
— and it is a first-class, documented Astro feature, so no custom routing logic is needed.
Confirmed against Astro's i18n guide at plan time.

**Alternatives considered**: A hand-rolled routing scheme (duplicate `src/pages/` trees without
using Astro's `i18n` config) — rejected as unnecessary reinvention of a feature Astro already
provides natively. Client-side-only language switching (single URL, JS swaps text) — rejected
in the spec clarification itself, since it fails SEO/shareability and conflicts with the
"separate URL per language" decision.

## 4. Content modeling

**Decision**: Astro Content Collections (Content Layer API, `glob()` loader) defined in
`src/content.config.ts`, with entries organized into per-locale subfolders per collection
(`src/content/blog/en/`, `src/content/blog/es/`, and the same pattern for `albums` and
`sale-items`). Each collection has a Zod schema matching the spec's Key Entities.

**Rationale**: Matches the spec's Assumption that content is "maintained by the site owner as
static content... edited directly," with no CMS/admin UI. Astro's own content-collections guide
documents the per-locale-subfolder pattern (filtering entries via `id.startsWith('en/')`) as the
standard approach for exactly this case.

**Alternatives considered**: A single flat collection per content type with a `lang` field on
each entry — rejected as slightly less discoverable for a non-technical content editor than
clearly separated `en/`/`es/` folders, and it's the officially documented pattern.

## 5. UI interactivity approach

**Decision**: No UI framework (no React/Vue/Svelte/Preact integration). All interactivity —
hamburger nav toggle, Blog/Sales "Load More", Photos album view + enlarge modal, Sales password
gate, carousels — is implemented as small vanilla JS modules loaded via Astro's native
`<script>` support ("islands" of plain JS, not framework components).

**Rationale**: Every one of these behaviors is simple DOM state toggling / array slicing /
`fetch()` — none of it needs component state management, and constitution Principle III
explicitly says to prefer the simplest solution and not add frameworks the site doesn't need.
Astro ships zero JS by default, so this also keeps the performance benefit of static output
intact.

**Alternatives considered**: Adding a lightweight framework (Preact/Svelte via
`@astrojs/preact`) for the interactive pieces — rejected as unnecessary weight for
DOM-manipulation-level interactivity.

## 6. Styling approach

**Decision**: Plain CSS. The brand palette (`#454DBF`, `#90B4D4`, `#BFCF74`, `#88AB4D`, per the
constitution) is defined once as CSS custom properties in `src/styles/global.css`, imported by
the shared layout; component-scoped styles live in each `.astro` component's `<style>` block.
The 768px breakpoint from the spec's Clarifications is the single responsive breakpoint used
site-wide (as a CSS custom property / shared value, not hard-coded in multiple places).

**Rationale**: Constitution Principle III again — no CSS framework (Tailwind, Bootstrap, etc.)
is needed for a small, well-defined page set, and Astro's scoped `<style>` blocks already solve
the "avoid unrelated global leakage" problem a CSS framework would otherwise be reached for.

**Alternatives considered**: Tailwind CSS — rejected as an added build dependency and learning
surface not justified by the site's size; would also make "colors only from the ratified
palette" harder to enforce than a small, fixed set of CSS custom properties.

## 7. Sales page password gate architecture

**Decision**: The Sales page ships with no item data in its built HTML/JS. Item content (name,
price, description, photo URLs) lives in a public but unlinked static JSON file
(`public/sales-catalog.en.json` / `.es.json`). A small client-side script checks the entered
password against a value in `src/config/site.ts`; only on a match does it `fetch()` the JSON
file and render the catalog, then remembers success for the rest of the tab's session via
`sessionStorage`.

**Rationale**: Success Criterion SC-005 requires that no item name/price/description/photo be
"visible or present in the page" before the correct password — if item data were embedded in
the page's initial HTML and merely hidden with CSS/JS, anyone using "View Source" could read it
without ever entering the password, which fails SC-005's literal requirement even though it's
explicitly *not* meant to be real security (per the spec's Assumptions). Fetching a separate
JSON file post-auth satisfies SC-005 exactly while staying 100% static (no server component,
consistent with FR-030's "no server-side component").

**Alternatives considered**: Embedding item data in the page and hiding it with CSS until
password entry — rejected because it fails SC-005 (data is "present in the page" via View
Source). Base64/obfuscation-encoding the embedded data — rejected as more complex than just
serving a separate static file, for no real security benefit either way (both are equally
"front-end only," per the spec's own framing).

## 8. Hidden-page exclusion from navigation, sitemap, and indexing

**Decision**: Three layers, all static: (1) Sales and Easter Egg pages are simply never linked
from `NavBar.astro` or any other component (FR-003 is satisfied by omission — there's nothing
to "turn off"). (2) `@astrojs/sitemap`'s `filter` option excludes any URL matching `/sales/` or
`/easter-egg/` (both language variants) from the generated `sitemap.xml`. (3) `public/robots.txt`
disallows `/sales/`, `/es/sales/`, `/easter-egg/`, `/es/easter-egg/`, and each of those pages'
`<head>` additionally includes `<meta name="robots" content="noindex, nofollow">` via a layout
prop, since `robots.txt` alone prevents crawling but not indexing of a URL discovered elsewhere.

**Rationale**: Directly satisfies FR-003/FR-004/SC-004, using only static files/build-time
config — no server-side access control needed since GitHub Pages serves everything publicly
regardless; the requirement is about discoverability, not access control (the spec is explicit
that these pages are "reachable... by direct URL").

**Alternatives considered**: None needed — this is a standard static-site pattern.

## 9. GitHub Pages deployment workflow

**Decision**: Update `.github/workflows/static.yml` to run `npm ci` and `npm run build` (Astro
outputs to `dist/` by default) before the existing `actions/upload-pages-artifact@v3` step, and
change that step's `path` from `.` (current repo-root upload with no build) to `./dist`.

**Rationale**: Introducing any build step/static site generator requires this change — the
constitution explicitly anticipates and permits it ("If a build step or static site generator
is introduced, it MUST output plain static files compatible with GitHub Pages deployment"). The
hosting model itself (GitHub Pages) is unchanged, only what feeds it.

**Alternatives considered**: Committing the built `dist/` output to the repository and serving
it directly — rejected as duplicating what CI is for and inviting drift between source and
built output.

## 10. Testing strategy

**Decision**: No automated test framework is introduced for this feature. Verification is
manual, via the scenarios in `quickstart.md` (build, preview, and check each acceptance
scenario from spec.md at the 375px/768px/1440px viewports).

**Rationale**: Neither the constitution (no Test-First-style principle was adopted) nor the
spec mandates automated testing. For a personal site of this size, adding a test runner
(Playwright/Vitest) now would be exactly the kind of unneeded complexity Principle III warns
against; it can be introduced later if the site grows enough to justify it.

**Alternatives considered**: Playwright for end-to-end checks of the nav breakpoint and
language-switch links — noted as a reasonable future addition, not adopted now.

## 11. Individual blog post and photo album pages

**Decision**: Confirmed with the user (post-plan) that both need dedicated, shareable pages —
spec.md now requires this explicitly (FR-020, FR-028, SC-009). Implemented as Astro dynamic
routes using `getStaticPaths()` to pre-render one static page per content-collection entry, per
locale:

- `src/pages/blog/[slug].astro` and `src/pages/es/blog/[slug].astro` — one per `blog` collection
  entry in that locale, rendering the post's full Markdown body via `render(entry)` /
  `<Content />` (see contracts/content-schemas.md).
- `src/pages/photos/[album].astro` and `src/pages/es/photos/[album].astro` — one per `albums`
  collection entry in that locale, rendering that album's photo list (with the same
  enlarge-on-click modal used everywhere else) and the empty-state view when `photos: []`.

Both list pages (`blog/index.astro`, `photos/index.astro`) link each entry's title/cover to its
generated detail page instead of toggling in-page state.

**Rationale**: `getStaticPaths()` is Astro's standard, documented mechanism for generating one
static page per data entry — exactly this project's pattern (personal-site-scale catalogs, per
spec Assumptions) is what it's designed for, and it keeps the site fully static (build-time
generation, no server, no client-side routing library). It also gives every post/album a real,
crawlable, bookmarkable URL, which is what SC-009 now requires. Neither page needs to be
excluded from the sitemap or nav — only Sales and Easter Egg are hidden (research.md §8); blog
post and album pages are ordinary public content.

**Alternatives considered**: In-page client-side state change (grid ⇄ album view without a URL
change) — this was the original plan's approach before the user confirmed dedicated pages were
wanted; rejected now because it can't satisfy SC-009's "own dedicated, shareable URL"
requirement. A client-side router (e.g., view transitions with client-side history manipulation
but no real per-URL static HTML) — rejected as unnecessary complexity when `getStaticPaths()`
already produces real static pages with no extra runtime cost.

Sale items remain the one content type with **no individual page/route** — the spec never asks
for one, and giving items their own URLs would conflict with keeping their data out of the
built HTML/JS until after the password check (research.md §7).
