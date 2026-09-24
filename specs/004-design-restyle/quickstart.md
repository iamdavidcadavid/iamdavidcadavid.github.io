# Quickstart: Validating the Site Design Restyle

## Prerequisites

- Node.js ≥22.12.0 and `npm ci`. The build needs network access to download the fonts (research §1).
- Open `design/Home Redesign.dc.html` and `design/Site Pages.dc.html` in a browser to compare
  against. Home artboards 2a–2e are final. Site Pages sections 1–13 and 15 are in scope; section
  14 (the 500 page) is not.

## Setup

```bash
npm run build
```

```bash
npm run preview
```

Check each scenario at **1280px** and **390px** width, in **light** and **dark**, in **English**
and **Spanish**, unless a step says otherwise.

## Scenario 1: Look and theme (US1)

1. Clear site data, set the OS to dark, open `/`. Expect the dark theme with no light flash on
   load (throttle the network to "Slow 4G" to make a flash visible if there is one).
2. Click the sun. Expect light immediately. Open `/blog/`, `/photos/`, `/now/`, then close and
   reopen the browser. Expect light everywhere (contract A).
3. In DevTools, block storage (or use a private window with storage blocked). Expect the toggle to
   still switch the current page with no console errors.
4. Disable JavaScript. Expect the page to follow the OS theme and the toggle to be absent. At
   390px, expect the menu button to still open and close the menu and every link in it to work.
5. Check the header on `/blog/`, `/blog/<any post>/`, `/photos/weekend-hike/`: expect the
   Blog/Photos item active with `aria-current="page"`. On `/sales/` and `/es/easter-egg/` expect no
   active item.
6. On `/es/`: expect the nav to read Inicio · Ahora · Contacto · Blog · Fotos, `ES` emphasized, and
   `EN` going to `/`.
7. At 390px: open the menu. Expect the floating card with rows and `EN / ES` at the bottom. Scroll
   and expect it to stay attached. Press Escape and expect it to close, with focus back on the
   button.
8. Scroll any long page. Expect the header to stay pinned and opaque.
9. Turn on the OS "reduce motion" setting and reload several pages. Expect no animation at all
   (contract E).
10. In DevTools → Network, reload a few pages. Expect **0 requests** to any origin other than the
   site's own (SC-008), fonts included.

## Scenario 2: Home (US2)

1. Compare `/` with artboards 2a–2e. Check the hero, chips, about card, the framed photo
   (uncropped) and the three cards.
2. "Say hello" → `/contact/`; "What I'm up to now" and "Read more" → `/now/`; "All posts" →
   `/blog/`; "See more" → `/photos/`.
3. Now card: the summary is the whole first paragraph of the latest update, not a sentence cut
   off at a line break. Latest writing: expect the 3 newest English posts, with "EN only" on the translation-pending one.
   On `/es/`, expect Spanish posts only and no pill.
4. Click a photo tile. Expect the viewer; prev/next step through the shown tiles only (contract C).
5. Network tab: the profile photo should be an optimized image (webp, roughly 100 KB class), not
   the 2 MB PNG.

## Scenario 3: Reading pages (US3)

1. `/blog/`: the heading shows "7 posts" (`/es/blog/`: "5 entradas"); rows sit in one card; "Load
   More" reveals the 7th post (page size 6 unchanged).
2. Open a post. Expect the back link, the date (check it matches `pubDate` exactly, with no
   off-by-one day), the title, body styles and the closing button. The translation-pending post
   hides the language switch.
3. `/photos/`: album cards with cover, title and count; hover lifts the card (only with motion
   allowed).
4. `/photos/weekend-hike/`: back link, title with count, 4:3 grid. The viewer keeps 003's behavior
   (wrap-around, caption, arrow keys, Escape).
5. `/now/`: latest update card with the date chip; "Earlier updates" rows expand and collapse
   independently with +/−.
6. `/contact/`: 4 link rows with icon, label, handle and arrow; the image sits above the text at 390px.
   Click each link and confirm the target, in both languages (Principle V).

## Scenario 4: Sales, empty states, Easter egg (US4)

1. `/sales/`: wrong password shows the error text, a red input border and `aria-invalid`; `changeme`
   unlocks it. Reload and expect it to stay unlocked (session).
2. Catalog: multi-photo items show prev/next and dots that follow; single-photo items show
   neither. "Load More" still works (page size 5). Open an item's photo: the Sales viewer looks
   identical to the album viewer (backdrop, rounded image, 44px blue buttons, caption), in both
   themes.
3. JS disabled on `/sales/`: expect the "!" card message.
4. Empty states: open `/photos/coming-soon/` (camera). For the oven, temporarily point the Blog at an
   empty locale or inspect the component in isolation. The existing message and `role="status"`
   stay.
5. `/easter-egg/` and `/es/easter-egg/`: wobbling egg, translated text, "Back home"; still absent
   from nav, sitemap and indexing.

## Scenario 5: 404 and maintenance (US5)

1. Open `/does-not-exist/` and `/es/does-not-exist/`. Expect the bilingual 404 page, no language
   switch, no active nav item, and a pulsing ring (with motion allowed). Both buttons work
   (contract F).
2. Open `/maintenance.html` directly. Expect only the wordmark, the 503 numeral, both languages and
   a Reload button. In DevTools, confirm it loads **no other files** (fonts or CSS from the site).
3. `dist/sitemap-0.xml` contains no `/404`, `/sales/` or `/easter-egg/` entries.

## Scenario 6: Colors, contrast and regressions

1. Search the code files in `src/` (`.astro`, `.css`, `.ts`) for literal colors (`#hex`,
   `rgb(`, `oklch(`, `color-mix(`, `white`/`black`) outside `src/styles/global.css`. Expect none
   (constitution design-token rule). Image files (`src/assets/**`) are exempt because their colors
   are image content, and `public/maintenance.html` is the one documented code exception (plan
   Complexity Tracking).
2. Run an accessibility contrast check (e.g. DevTools' Lighthouse or axe) on Home, Blog, a post,
   Now, Contact and Sales, in **both** themes. Expect 0 contrast failures (SC-002).
3. Re-run the feature 003 quickstart scenarios (photo viewer, Now accordion, blog page size, header)
   and 001's language-switch and sales checks. Expect 0 regressions (SC-004).

## Expected outcome

Every scenario passes in both languages, both themes and both widths, the build is clean, and the
console shows no errors.
