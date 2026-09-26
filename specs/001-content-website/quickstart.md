# Quickstart: Validating the Personal Content Website

Manual validation guide (no automated test suite — see research.md §10). Run through this after
implementation to confirm the feature matches spec.md.

## Prerequisites

- Node.js ≥22.12.0 (Astro 7's minimum)
- Repository checked out on the `001-content-website` branch

## Setup

```bash
npm install
npm run dev
```

Opens a local dev server (default `http://localhost:4321`). For a production-accurate check
(matches what GitHub Pages will actually serve), instead run:

```bash
npm run build
npm run preview
```

## Validation scenarios

Check each of these against the acceptance scenarios and success criteria in
[spec.md](./spec.md); the routes referenced are defined precisely in
[contracts/routing-contract.md](./contracts/routing-contract.md).

### 1. Viewport / navigation (SC-002, FR-005/FR-006/FR-014)

At each of **375px**, **768px**, and **1440px** browser widths, on `/` and `/es/`:

- [ ] Below 768px: hamburger menu visible, full nav bar not visible; About section shows photo
      above text.
- [ ] At/above 768px: full nav bar visible, hamburger not visible; About section shows text
      left, photo right.
- [ ] Resizing slowly across 768px never shows both menus or neither at once.

### 2. Home — About/Contact (User Story 1)

- [ ] `/` shows welcome banner, About (placeholder text + placeholder photo), Contact sections.
- [ ] Contact section: friendly intro paragraph, LinkedIn (`cadaviddavid`), GitHub
      (`iamdavidcadavid`), YouTube (`iamdavidcadavid`) icon links open the right profiles, and
      an "email" button opens a new message to `contact@davidcadavid.com`.
- [ ] Same checks pass on `/es/` with Spanish copy (or a visible translation-pending marker).

### 3. Language switching (SC-007, FR-010/FR-011)

- [ ] From `/blog/`, the language switch goes to `/es/blog/` (not `/es/`).
- [ ] From `/es/photos/`, the language switch goes to `/photos/` (not `/`).

### 4. Blog (User Story 2)

- [ ] With more posts than `blogPageSize` (`src/config/site.ts`), only that many show initially,
      each with title + first 2-3 lines.
- [ ] "Load More" appends exactly `blogPageSize` more posts each click, then disappears once all
      are shown.
- [ ] Adjacent posts alternate visual treatment.
- [ ] With zero posts, the bread-oven loading animation shows instead of an empty list.
- [ ] Clicking a post's title navigates to `/blog/<slug>/` (or `/es/blog/<slug>/`), showing the
      full post body. Opening that URL directly (skipping `/blog/`) also works (FR-020, SC-009).
- [ ] The post marked `translationPending: true` (with no Spanish file) shows a visible "not yet
      available in Spanish" note on both its English list entry and its English detail page
      (FR-027, SC-010); it does not appear at all in the Spanish list or sitemap.

### 5. Photos (User Story 3)

- [ ] Grid shows each album's cover + title.
- [ ] Clicking an album navigates to `/photos/<slug>/` (or `/es/photos/<slug>/`), showing its
      photo list; opening that URL directly (skipping `/photos/`) also works (FR-029, SC-009).
- [ ] Clicking a photo opens an enlarged modal.
- [ ] An album with an empty `photos: []` array shows "Development in process..." with the
      photo-developing animation (FR-031), not a blank grid or an error.

### 6. Sales — hidden + gated (User Story 4)

- [ ] `/sales/` and `/es/sales/` are not linked from any nav or page (search rendered HTML for
      `href="/sales"` outside the page itself — should find nothing).
- [ ] `curl`'d/viewed HTML source of `/sales/` before entering a password contains no item name,
      price, description, or photo URL (confirms research.md §7's approach worked).
- [ ] Wrong password: no content revealed. Correct password (from `src/config/site.ts`): items
      appear, each with name/price/optional description and a photo carousel that enlarges on
      click.
- [ ] Reloading the page within the same tab/session does not re-prompt for the password.
- [ ] `Load More` behaves like the Blog list once unlocked.
- [ ] With JavaScript disabled in the browser, `/sales/` shows the `<noscript>` "requires
      JavaScript" message instead of an inert password field (FR-034, SC-011).

### 7. Easter Egg — hidden (User Story 5)

- [ ] `/easter-egg/` and `/es/easter-egg/` load successfully with placeholder/empty content and
      are not linked anywhere.

### 8. Indexing exclusion (SC-004)

- [ ] `dist/sitemap-0.xml` (or equivalent) after `npm run build` contains no `/sales/` or
      `/easter-egg/` URLs, in either language.
- [ ] `public/robots.txt` disallows all four hidden URLs.
- [ ] Sales and Easter Egg pages' rendered `<head>` includes
      `<meta name="robots" content="noindex, nofollow">`.

### 9. Brand palette & contrast (SC-008)

- [ ] Inspect computed colors site-wide — only the four palette hex values (`#454DBF`,
      `#90B4D4`, `#BFCF74`, `#88AB4D`) plus neutrals (white/black/gray) appear.
- [ ] Any text using a palette color as its own color (not just background) passes a contrast
      checker against its background at standard (WCAG AA) thresholds.

## Deployment check

After merging, confirm `.github/workflows/static.yml` runs `npm ci && npm run build` and
uploads `./dist` (not the repo root) — a broken workflow here means the above all passed
locally but the live GitHub Pages site would still be stale/wrong.
