# Phase 0 Research: Site Design Restyle

No `NEEDS CLARIFICATION` remained in the Technical Context. Each decision below resolves how to
build something the spec requires within the constitution (static, no new dependencies, tokens
only, bilingual, accessible).

## 1. Self-hosted fonts (FR-005, FR-006)

**Decision**: Use Astro 7's built-in `fonts` config (`fontProviders.google()`) for **Young Serif**
(400) and **Onest** (300, 400, 500, 600; normal + italic), exposed as CSS variables
`--font-serif` and `--font-sans`. Render `<Font cssVariable="--font-serif" preload />` and
`<Font cssVariable="--font-sans" preload />` in `BaseLayout`'s `<head>`. Include fallbacks
(`Georgia, serif` / `system-ui, sans-serif`).

**Rationale**: Astro downloads the font files at **build** time and serves them from the site's own
`/_astro/` path, so visitors never contact Google (FR-006, constitution privacy constraint). It is
already in the installed Astro (verified: top-level `fonts` in the config schema, `Font` exported
from `astro:assets`), so no dependency is added (Principle III). It also generates matching
fallback metrics, which reduces layout shift.

**Alternatives considered**:
- Google Fonts `<link>`: rejected, since every page view would send visitor IPs to Google.
- `@fontsource/*` npm packages: rejected, since they add dependencies for something Astro already does.
- Committing `.woff2` files to `public/`: workable, but means manually managing subsets and licence
  files. Kept as the fallback if a build machine ever lacks network access.

**Note**: the build needs network access to fetch the fonts, the same as `npm ci` does. The GitHub
Actions build has it.

## 2. Theme mechanism (FR-002, FR-003, FR-004; edge cases for no-JS and blocked storage)

**Decision**:
- Define each color token **once** with CSS `light-dark(<light>, <dark>)`. Set
  `:root { color-scheme: light dark; }` (follow the device), plus
  `:root[data-theme="light"] { color-scheme: light; }` and
  `:root[data-theme="dark"] { color-scheme: dark; }`.
- An inline, blocking `<script is:inline>` placed first in `<head>` reads `localStorage.theme`
  inside `try/catch`. If it is `"light"` or `"dark"`, it sets `document.documentElement.dataset.theme`
  before first paint. Otherwise it leaves the attribute unset, so the page keeps following the
  device.
- `ThemeToggle` is rendered with `hidden`, and its own script removes `hidden`. Without JS it never
  appears. On click it sets `data-theme` and writes `localStorage.theme` in `try/catch`. When storage
  is blocked the switch still works for the current page. The "active" button reflects the
  **effective** theme: `data-theme` if set, otherwise `matchMedia('(prefers-color-scheme: dark)')`.

**Rationale**: `light-dark()` means the dark values live next to the light ones with no duplicate
block to keep in sync. Leaving `data-theme` unset for "follow device" gives visitors without JS the
correct theme using CSS alone. A blocking inline script is the standard way to avoid a flash of the
wrong theme (FR-004).

**Alternatives considered**:
- Duplicated dark blocks (`[data-theme=dark]` plus a `prefers-color-scheme` media block):
  rejected, because it doubles every dark value.
- Setting the theme in a normal module script: rejected, because it runs after first paint and
  causes a flash.

## 3. Token set and migration (FR-001; constitution design-token rule)

**Decision**: Replace every old token in `global.css` with the design tokens: `--bg`, `--surface`,
`--sand`, `--ink`, `--body`, `--muted`, `--faint`, `--line`, `--blue`, `--blue-hover`,
`--blue-ink`, `--blue-soft`, `--on-blue`, `--danger`, with light/dark values exactly as in
`design/README.md`. Add tokens for every other color the design uses, so no component needs a
literal:
- `--chip-mentor`, `--chip-speaker`, `--chip-voice`: role-chip dots (values from the README).
  "Systems engineer" uses `--blue`.
- `--backdrop` (`rgba(12,11,10,.82)` in both themes) and `--on-backdrop` (`#ffffff`) for the photo
  viewer.
- Shadow colors `--shadow-soft` / `--shadow-deep` (light/dark alphas from the README), composed
  into `--shadow-pill`, `--shadow-photo` (`0 30px 60px -30px`) and `--shadow-menu`
  (`0 24px 48px -20px`).

Remove the old tokens (`--color-primary-blue`, `--color-neutral-*`, etc.) entirely. Every usage
is migrated. As of today that is 12 old color tokens with 73 references across components. Keep the
layout tokens (`--content-max-width`, `--breakpoint-md-px`) and add `--gutter` (48px desktop /
20px mobile).

**Rationale**: A single, complete token set is what the amended constitution requires. Removing the
old names makes any missed migration show up (an undefined variable) instead of silently keeping
the old look.

## 4. Contrast audit and the `--faint` decision (SC-002; Principle IV)

Every text/background pair used by the design was computed with the WCAG formula (oklch values
converted to sRGB):

| Pair | Light | Dark |
|---|---|---|
| `--ink` on `--bg` / `--surface` | 13.1 / 14.4 | 15.2 / 13.8 |
| `--body` on `--surface` / `--bg` | 8.8 / 8.0 | 9.9 / 10.9 |
| `--muted` on `--bg` / `--surface` | 5.1 / 5.6 | 7.7 / 7.0 |
| **`--faint` on `--bg` / `--surface`** | **3.5 / 3.9 ✗** | 5.0 / 4.5 |
| `--blue-ink` on `--surface` / `--bg` / `--blue-soft` | 7.0 / 6.4 / 6.2 | 8.1 / 9.0 / 6.8 |
| `--on-blue` on `--blue` | 6.2 | 8.0 |
| `--danger` on `--surface` | 5.8 | 7.2 |
| `--ink` on `--sand` (hover) | 12.0 | 12.0 |

**Finding**: In the light theme, `--faint` fails AA (4.5:1) as normal-size text. The design uses it
for dates, meta text, the inactive `EN`/`ES` link and the "/" separator.

**Decision**: Following the constitution ("a token that fails contrast in a given context MUST be
paired with another token or adjusted"), **text uses `--muted` wherever the design shows
`--faint` text**: dates, meta, post counts, captions under images, and the inactive language
link. `--faint` stays in the token set for **non-text** decoration only: the "↗" arrow glyphs
beside links (decorative, `aria-hidden`), the language-switch slash (also `aria-hidden`) and the
inactive theme-toggle icon. Every other pair passes in both themes.

**Owner option (not taken by default)**: instead adjust `--faint`'s light value to about `#736b63`
(≈4.6:1 on `--bg`) and use it as designed. That changes the palette, which the constitution makes
an explicit owner decision, so this plan does not assume it.

**Owner decision (2026-09-24)**: keep `--muted` for text; `--faint` keeps its design value and
stays decoration-only. No palette change.

## 5. Profile photo (FR-015; performance)

**Decision**: Copy `design/assets/david.png` (2 MB, 3:2) to `src/assets/david.png` and render it
with `astro:assets` `<Image>` using `widths={[540, 1080]}`, `sizes="(min-width: 768px) 540px, 100vw"`,
`format="webp"` and `alt` from the UI dictionary ("David Cadavid"). Show it uncropped
(`object-fit: contain`, 3:2) inside the blue frame. Delete the now-unused `profile-photo.svg`.

**Rationale**: `sharp` is already installed as Astro's optional dependency, so optimization is
free. The page gets roughly 100 KB images instead of the 2 MB original.

## 6. Home Photos card: random tiles + photo viewer (FR-017; clarify leftover)

**Decision**:
- At build time, each locale's Home page collects the **photo pool**: every `{src, alt}` from every
  album in that locale (data-model.md). It renders the first 3 as tiles (so visitors without JS
  see fixed photos) and serializes the whole pool into a `data-pool` attribute.
- A small client script shuffles the pool (Fisher–Yates) and rewrites the `src`/`alt` of the
  **existing** 3 tile `<img>` elements. It only runs when the pool holds more than 3 photos.
- The tiles and viewer are `PhotoLightbox` with a new `layout="tiles"` prop (`2fr 1fr` grid, first
  tile spanning 2 rows). `PhotoLightbox` already keeps element references and reads `src`/`alt` when
  a photo is shown, so shuffling the same `<img>` elements needs no change to its viewer logic.
- The viewer steps through **the 3 shown photos** only. This settles the remaining clarify item: the
  card previews 3 photos, and "See more" goes to the full albums.
- With 0 photos in the pool, the card shows `home.photos.empty` instead of tiles.

**Alternatives considered**: picking photos at build time (rejected: FR-017 says the selection can
differ per visit); a separate lightbox for Home (rejected: it would duplicate 003's viewer
behavior).

## 7. Home Now and Latest writing cards (FR-017)

**Decision**: The Now card uses the latest `now` entry in the locale (same date-sort as the Now
page). Its summary is `firstParagraph(entry.body)`, a new helper in `src/lib/format.ts` that
returns the first paragraph with its wrapped lines joined. The line-based `excerptFor(body, 1)`
was rejected because content files wrap sentences across lines, so it would cut the summary
mid-sentence (e.g. "…focused on — work,"). The date uses the shared `formatDate`. Latest writing shows the 3 newest
posts in the locale (sort by `pubDate`), with the date in short form (e.g. "Feb 16" / "16 feb").
The "EN only" pill uses `translationPending`, so it only ever appears on English pages.

## 8. Shared strings, dates and page titles (FR-014; Principle II)

**Decision**:
- `src/i18n/ui.ts` holds every string used by more than one component or page: nav labels, card
  titles, links, pills, counts with singular/plural, and aria labels. A tiny `t(locale, key, vars?)`
  helper reads it. Component-specific strings stay in the component's local copy table (the
  existing pattern in `AboutSection`, `SalesGate`, etc.). All new strings are listed with their
  Spanish in `contracts/ui-copy.md` for owner review.
- `src/lib/format.ts`: `formatDate(date, locale, 'long' | 'medium' | 'short')` always passes
  `timeZone: 'UTC'`. This carries forward the off-by-one-day fix from 003 and now covers blog post
  dates too.
- Document `<title>`s are localized. Today `/es/photos/` and `/es/blog/` have English titles; they
  become "Fotos — David Cadavid" and "Blog — David Cadavid".

## 9. Active navigation item (FR-009)

**Decision**: `NavBar` takes the locale-agnostic path (strip a leading `/es`) and maps its first
segment: `''`→Home, `now`→Now, `contact`→Contact, `blog`→Blog (list and posts), `photos`→Photos
(index and albums). Anything else (Sales, Easter egg, 404) maps to no item. The active link gets
`aria-current="page"`, and the style targets `[aria-current="page"]`, so screen readers announce it
too. The full mapping is in contracts/routing-contract.md.

## 10. Header and mobile menu (FR-008, FR-010, FR-011, FR-012)

**Decision**: `BaseLayout`'s pinned header holds three regions: the wordmark link (to the locale's
Home), `NavBar`, and a right cluster with `LanguageSwitch` (desktop only), `ThemeToggle` and the
menu button (mobile only). `NavBar` renders the desktop pill and, below 768px, the floating menu
card (rows plus its own `LanguageSwitch` at the bottom). The mobile menu is a native
`<details>`/`<summary>` disclosure: the `<summary>` is the menu button and the card is the
`<details>` content. It therefore opens and closes **without JavaScript**, which fixes a gap
inherited from 001 where phone visitors without JS could not reach the navigation. A small script
adds close-on-Escape (focus back to the button) and close-on-link-click. The card sits inside the
sticky header, so it stays attached while scrolling. `hideLanguageSwitch` hides both switch
instances. The header background is `--bg` (opaque).

*Alternative rejected*: keeping the JS-only button (`aria-expanded` toggled by script). It works,
but leaves the mobile navigation unreachable without JS, and the native element gives the
expanded state to screen readers for free.

## 11. Shared page components (FR-019, FR-024)

**Decision**: `PageTitle.astro` (props: text, optional trailing meta such as the post count)
renders the serif H1 with the blue period and the slide-left entrance. It replaces the
`.page-title` style block repeated in about 10 pages. `NowTimeline.astro` (props: entries,
locale) replaces the ~90 lines currently duplicated across the two Now pages. The Now "+/−"
indicator is a CSS pseudo-element on `<summary>` driven by `details[open]`, so the Now page still
needs no JS.

## 12. Motion system (FR-007, SC-005)

**Decision**: `global.css` defines keyframes `slide-left`, `slide-right`, `rise`, `wobble`,
`pulse`, `glow` and utility classes (`.anim-slide-left`, `.anim-slide-right`, `.anim-rise`,
`.delay-1`/`-2`/`-3`/`-4` = 0.12s/0.24s/0.15s/0.55s). **Everything** is declared inside
`@media (prefers-reduced-motion: no-preference)`, including the hover lift and scale, the empty-state
glow, the egg wobble and the 404 ring pulse. With reduced motion, elements simply render in their
final state. Entrance classes use `animation-fill-mode: both`, so nothing is hidden when animations
are off.

## 13. Illustrations (FR-029, FR-030, FR-031)

**Decision**: The oven, camera, egg and 404 ring become plain CSS shapes in `--blue`/`--surface`,
as in the design files. They replace the inline SVGs that hold the hard-coded hex colors the
constitution amendment flagged. Existing messages and `role="status"` are kept.

## 14. 404 page (FR-031, FR-034; GitHub Pages behavior)

**Decision**: `src/pages/404.astro` builds to `/404.html`, which GitHub Pages serves automatically
for any missing path, including under `/es/`. It uses `BaseLayout` with `noindex` and
`hideLanguageSwitch` (both languages are on the page; see Complexity Tracking). The page is
`lang="en"`, and the Spanish block carries `lang="es"`. Buttons: "Go home · Ir al inicio" → `/`,
"Read the blog · Leer el blog" → `/blog/` (the design shows the secondary button in English only;
it gets the same bilingual treatment for Principle II). Root-relative asset URLs, which are
Astro's default, keep it working at any depth. The sitemap filter adds `/404` explicitly.

## 15. Maintenance page (FR-033)

**Decision**: `public/maintenance.html` is copied verbatim to the site root. It has inline `<style>`
with only the tokens it uses (same `light-dark()` values, marked "keep in sync with
`src/styles/global.css`"), system font stacks (`Georgia, serif` for the numeral and headings,
`system-ui` for text), the wordmark, the "503" numeral with the ring, EN + ES copy, a "Reload ·
Recargar" button (`location.reload()`, plus a plain link to `/` for no-JS) and
`<meta name="robots" content="noindex">`. It never loads another site file. Publishing it
(e.g. temporarily swapping it in for `index.html`) is a manual owner action, outside the build.

## 16. Sales catalog dots (FR-027)

**Decision**: `SalesGate`'s `renderItem()` adds a dot row (one `<span>` per photo, active one
`--blue`, others `--line`) in the same control row as its prev/next buttons. The existing
`current` index updates the active dot. Both buttons and dots are only created when
`photos.length > 1` (same guard as today). Gate logic, `sessionStorage`, `salesPageSize` and 003's
viewer behavior are untouched.

## 17. Dead code

**Decision**: Delete `src/components/Carousel.astro`. It is imported nowhere (`SalesGate` builds
its own carousel), and it references tokens this feature removes. Delete
`src/assets/placeholders/profile-photo.svg` once Home uses `david.png`.
