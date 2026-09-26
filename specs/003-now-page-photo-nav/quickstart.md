# Quickstart: Validating Now Page & Photo Navigation Polish

## Prerequisites

- Node.js ≥22.12.0, dependencies installed (`npm install`).
- Placeholder content already present from features 001/002: at least one multi-photo album
  under `src/content/albums/`, and the Sales catalog JSON (`public/sales-catalog.en.json` /
  `.es.json`) with a mix of single-photo and multi-photo items (already true as of this feature).

## Setup

```bash
npm run build
npm run preview
```

Open the preview URL (see `.claude/launch.json`'s `astro-preview` config, typically
`http://localhost:4321`).

## Scenario 1 — Photos page: navigate a multi-photo album without closing the enlarged view (US1)

1. Go to `/photos/`, open an album that has more than one photo (e.g. the seeded "weekend hike"
   album from feature 001).
2. Click a thumbnail to open the enlarged view. Confirm prev/next controls are visible and a
   caption below the image matches the current photo's alt text (see
   [interaction-contract.md §A](./contracts/interaction-contract.md)).
3. Click "next" repeatedly; confirm the image and caption update each time, the view never
   closes, and after the last photo it wraps back to the first.
4. Press the right/left arrow keys instead of clicking; confirm the same navigation happens.
5. Close the view, open the album's single-photo placeholder (or any album with exactly one
   photo); confirm no prev/next controls are rendered.

## Scenario 2 — Sales page: same navigation behavior, gated content (US1)

1. Go to `/sales/`, enter the configured password (see `src/config/site.ts`'s `salesPassword`).
2. Open an item with multiple photos (e.g. `item-1` or `item-4` in
   `public/sales-catalog.en.json`) into its enlarged view; repeat steps 2–4 from Scenario 1.
3. Open a single-photo item (e.g. `item-2` or `item-3`); confirm no prev/next controls appear.
4. Repeat in Spanish (`/es/sales/`) to confirm parity.

## Scenario 3 — Now page (US2)

1. Go to `/now/`. Confirm the latest update is fully visible immediately (no click needed) and,
   if prior updates exist, they appear below it, collapsed, each labeled with its date/title.
2. Click a collapsed prior update; confirm it expands in place. Click it again; confirm it
   collapses. Expand two prior updates at once; confirm both stay open independently.
3. Tab to a collapsed entry using only the keyboard and press Enter/Space; confirm it
   expands (native `<details>` behavior).
4. Confirm "Now" appears in the primary navigation (between Home and Contact) on every page.
5. Repeat at `/es/now/`; confirm the same structure renders in Spanish and the language switch
   on `/now/` links to `/es/now/` (and back).
6. After `npm run build`, open the generated sitemap file under `dist/` and confirm `/now/` and
   `/es/now/` are both listed (FR-015's indexing half — `/sales/` and `/easter-egg/` must NOT be
   listed, per the existing `astro.config.mjs` filter).

## Scenario 4 — Blog page size (US3)

1. Confirm `src/content/blog/en/*.md` has at least 7 posts. Feature 001 seeded 6; tasks.md T011
   adds a 7th (`a-quick-project-update.md`) specifically so this scenario is verifiable — without
   it, all 6 existing posts would fit on one page and "Load More" would never appear, leaving the
   new page-size boundary untested. Go to `/blog/`.
2. Count the posts visible before any interaction: expect exactly 6, with a "Load More" control
   present.
3. Click "Load More"; confirm the remaining post(s) appear.

## Scenario 5 — Header spacing (US4)

1. At a desktop width (e.g. 1280px), inspect the header: confirm visible vertical space (5–10px)
   above and below the nav content, on both edges of the header bar.
2. Resize to a mobile width (e.g. 375px, hamburger visible): confirm the same visible spacing
   around the hamburger icon.
3. Scroll the page; confirm the header remains sticky and no content is hidden behind it.

## Expected outcome

All five scenarios pass in both English and Spanish, at both mobile and desktop widths, with no
console errors in the browser and a clean `npm run build`.
