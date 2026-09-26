# Handoff: davidcadavid.com visual restyle

## Overview
A new visual style for David Cadavid's personal Astro site: soft and organic, with warm neutrals, a blue accent, a serif for headings and a clean sans for body text, and light/dark themes. It covers every page: Home, Now, Contact, Blog list, Blog post, Photos, Album, Sales (gate, catalog, no-JS), empty states and the Easter egg. It also covers the shared header, mobile menu, footer and photo lightbox.

## About the design files
The `.dc.html` files in this bundle are **design references built in HTML**. They show the intended look and behaviour; they are not production code to copy. The task is to **recreate them inside the existing Astro codebase** (`src/`) using its current patterns: `.astro` components, scoped `<style>`, the CSS custom properties in `src/styles/global.css`, small vanilla `<script>` blocks, and i18n via `Astro.currentLocale`. Keep all existing behaviour and content: i18n copy tables, pagination sizes from `config/site.ts`, the sales gate logic, lightbox keyboard support, and `hideLanguageSwitch`.

Open the files in a browser to inspect them. Each artboard is labelled (e.g. `2a`, `7b`). Desktop artboards are 1280px wide and mobile artboards are 390px.

## Fidelity
**High fidelity.** Colours, type, spacing, radii and interactions are final. Copy marked `[PLACEHOLDER]` is the same placeholder content that is already in `src/content`.

## Design tokens (replace the palette in `global.css`)
Use `oklch()` directly; all modern browsers support it. Theme is set with `data-theme="light|dark"` on `<html>`.

| Token | Light | Dark |
|---|---|---|
| `--bg` (page) | `#f2efe9` | `#171615` |
| `--surface` (cards, nav pill, footer) | `#fbfaf7` | `#221f1d` |
| `--sand` (hover fill) | `#ebe5dc` | `#2e2a27` |
| `--ink` (headings/text) | `#2a2622` | `#efebe5` |
| `--body` (paragraphs) | `#4d4741` | `#cfc8bf` |
| `--muted` | `#6b645c` | `#b0a89f` |
| `--faint` (dates, meta) | `#857d74` | `#8d857c` |
| `--line` (dividers, borders) | `#e6e0d6` | `#35312d` |
| `--blue` (primary fill) | `oklch(0.50 0.15 265)` | `oklch(0.74 0.12 265)` |
| `--blue-hover` | `oklch(0.44 0.15 265)` | `oklch(0.80 0.10 265)` |
| `--blue-ink` (blue text/links) | `oklch(0.46 0.15 265)` | `oklch(0.78 0.11 265)` |
| `--blue-soft` (tinted chips/icons) | `oklch(0.94 0.03 265)` | `oklch(0.30 0.06 265)` |
| `--on-blue` (text on blue) | `#ffffff` | `#11131c` |
| `--danger` | `oklch(0.52 0.18 25)` | `oklch(0.76 0.13 25)` |
| `--shadow-pill` | `0 1px 2px rgba(42,38,34,.06), 0 8px 24px -12px rgba(42,38,34,.18)` | `0 1px 2px rgba(0,0,0,.3), 0 8px 24px -12px rgba(0,0,0,.6)` |

Role-chip dot colours (Home): Systems engineer = `--blue`, Mentor `oklch(0.64 0.11 150)`, Public speaker `oklch(0.64 0.12 45)`, Voice actor `oklch(0.64 0.11 330)`.

**Typography** (Google Fonts): `Young Serif` 400 for headings, wordmark and card titles; `Onest` 300–600 (with italic) for everything else.
- H1 page titles: Young Serif, `clamp(44px, 6.5vw, 84px)`, line-height 1, letter-spacing −0.02em, followed by a blue period (`Blog.`, `Photos.`, etc.).
- Home H1: "Hello — I'm David." at 80px desktop and 46px mobile, line-height 1.02.
- Card titles: Young Serif 24px desktop / 21px mobile.
- Body: Onest 16–17px, line-height 1.6–1.75. Meta and dates: 13–14px in `--faint`.
- Post body: 17–19px / 1.75. Lead paragraph is 1.15em in `--ink`. H2 is Young Serif 1.5em. Pull quote is Young Serif 1.4em in `--blue-ink`.

**Radii:** pills 999px · cards 28px desktop / 24px mobile · photos inside cards 20px (album) / 14px (home tiles) · inputs 14px.
**Spacing:** page gutter 48px desktop / 20px mobile · card padding 28–32px desktop / 22–24px mobile · grid gaps 20px · list rows 18px vertical padding.
**Breakpoint:** keep the site's single breakpoint (768px).

## Global chrome (`BaseLayout.astro`, `NavBar.astro`, `LanguageSwitch.astro`)
- **Header (≥768px):** padding 24px 48px, three items spaced between.
  - Wordmark "David Cadavid" plus a blue "." in Young Serif 22px.
  - Centre: nav pill (`--surface`, 6px padding, 6px gap, `--shadow-pill`). Links are 15px with 10px 18px padding. The **active** link has a `--blue` fill and `--on-blue` text; on pages outside the nav (Sales, Easter egg) no link is active.
  - Right: language switch `EN / ES` (14px/500; current locale in `--ink`, others and the slash in `--faint`), then the theme toggle.
- **Theme toggle:** a pill (`--surface`, 4px padding) holding two 32px round buttons.
  - Sun is an 11px filled dot; moon is a 13px crescent made with `box-shadow: inset -4px -2px 0 0 currentColor`.
  - The active button gets an `--ink` fill with its icon in `--surface`/`--bg`; the inactive icon is `--faint`.
  - Persist the choice in `localStorage` and default to `prefers-color-scheme`. Set `data-theme` in an inline `<head>` script to avoid a flash.
- **Header (<768px):** height 68px. Wordmark at 19px; theme toggle (30px buttons) plus a 44px hamburger (three 20×2px bars).
  - The menu opens as a floating card: top 68px, 12px side insets, `--surface`, radius 24px, shadow `0 24px 48px -20px rgba(20,18,16,.35)`, 200ms fade.
  - Rows are 56px, Young Serif 24px, separated by 1px `--line`. The active row is in `--blue-ink` with an 8px blue dot on the right.
  - The `EN / ES` switch sits at the bottom of the menu.
- `hideLanguageSwitch` still hides EN/ES (translation-pending posts).
- **Footer:** same structure as today: centred, 24px padding, `--surface` background, 1px `--line` top border, text in `--muted`. The © line is 15px and the Gandalf quote is 14px italic.

## Screens
Every page head and content block uses an **entrance animation**. Heads use `slide-left`: from `opacity:0; translateX(-40px)`, 0.8s, `cubic-bezier(.2,.7,.2,1)`. Content uses `rise`: from `translateY(24px)` with a 0.12s delay, and a further block uses a 0.24s delay. Wrap all of it in `@media (prefers-reduced-motion: no-preference)`.

1. **Home (`index.astro` + `AboutSection.astro`)**: see `Home Redesign.dc.html`, artboards 2a–2e.
   - **Hero:** grid `1fr 540px`, gap 64px, `align-items:center`. Left column (gap 28px): H1, subline (20px `--muted`, max-width 520px), role chips, then an "A bit about me" card (surface, radius 28, padding 32px 36px, Young Serif 26px title, two paragraphs).
   - **Photo:** `david.png` uncropped (3:2, `object-fit:contain`, radius 24) inside a 10px `--blue` frame (radius 34, shadow `0 30px 60px -30px rgba(20,18,16,.5)`). Below it are centred buttons: "Say hello" (blue pill, 15px 26px padding) and "What I'm up to now" (surface pill).
   - **Hero entrance:** text blocks slide from the left, staggered 0 / 0.12 / 0.24s. The photo slides from the right (`translateX(48px)`, 1s, 0.15s delay). The buttons rise (0.55s delay).
   - **Row below:** 3 equal columns, gap 20. All three cards are surface-coloured.
     - **Now:** title and date, a divider, the latest summary (17px `--body`), and a "Read more →" link in `--blue-ink`.
     - **Latest writing:** max 3 rows, each a grid `58px 1fr 16px` (date · title · ↗), 1px `--line` top border. An "EN only" outline pill marks translation-pending posts.
     - **Photos:** "See more →" link. Up to 3 **random** photos from all albums in a `2fr 1fr` grid, with the first spanning 2 rows. No text on the photos. Clicking a photo opens the lightbox.
   - **Mobile:** single column in this order: H1, subline, chips, about, photo (7px frame), full-width 52px buttons, then Now, Blog and Photos stacked.
2. **Blog list (`BlogList.astro`):** header row with the H1 and "N posts". One surface card holds the rows: date (150px column) and a title column (Young Serif ~24px with ↗, optional "Not yet available in Spanish" pill, excerpt 15px `--muted`). Rows wrap on mobile. Keep "Load more" (blue pill) and `blogPageSize`.
3. **Blog post (`[slug].astro`):** 720px column; "← All posts" link; date and pending pill; H1 `clamp(36px, 4.6vw, 58px)`; a divider, then the body styles listed above. Images are radius 20 with a 14px `--faint` caption. A "← Back to all posts" surface pill closes the page.
4. **Photos (`AlbumGrid.astro`):** `repeat(auto-fill, minmax(300px, 1fr))`. Each card is surface with 12px padding and radius 28: a 4:3 cover (radius 20), then the title (Young Serif 22px) and photo count. Hover lifts the card 4px.
5. **Album (`PhotoLightbox.astro`):** "← Photos" link, H1 plus count, and a 4:3 photo grid (radius 20; hover scale 1.02). The lightbox is a `rgba(12,11,10,.8–.85)` backdrop with the image at radius 14, 44px blue round prev/next buttons, a white caption and a white × close button. Keep the existing Esc and arrow-key handling.
6. **Now:** 760px column. The latest update sits in a surface card: a date chip (`--blue-soft` background, `--blue-ink` text, blue dot), a Young Serif H2 and paragraphs. "Earlier updates" is a 13px uppercase label over `<details>` rows (date, Young Serif 20px title, and a 32px round +/− in `--blue-ink`).
7. **Contact (`ContactSection.astro`):** flex with `wrap-reverse`, so the photo sits above the text on mobile. Text column: H1, intro, and a surface card of 4 link rows (44px blue icon circle with the existing SVGs, label plus handle, ↗). Photo: 4:5 inside the blue frame.
8. **Sales gate (`SalesGate.astro`):** 440px centred column with the H1 and a surface form card. Card contents: a 60px `--blue-soft` lock icon, a "Password" label, a 52px input (radius 14, `--bg` fill, `--line` border; focus ring `0 0 0 3px var(--blue-soft)` with a blue border), the "Incorrect password." error in `--danger` (the input border turns danger too), and a 52px "Unlock" blue pill.
   - **Catalog:** the same card grid as Photos. Each card has a 4:3 photo (click to enlarge), a control row with 36px blue prev/next buttons and 7px dots (active dot blue, others `--line`, hidden when there is 1 photo), the name (Young Serif 21px), the price (16px/600 `--blue-ink`) and the description. Keep "Load more" and `salesPageSize`.
9. **Sales, no JS (`SalesNoScript.astro`):** 480px centred surface card with a 48px "!" circle and the message.
10. **Empty states:** a centred surface card with a CSS-shape illustration in `--blue`.
    - Blog: an oven whose glow dot pulses with `glow` (1.6s: opacity .55→1, scale .82→1).
    - Album: a camera with a pulsing lens.
    - Keep the existing copy and `role="status"`.
11. **Easter egg:** a wobbling egg (rotate ±5°, 2.4s), "You found the secret page!" and a "← Back home" pill.

12. **Error pages (new: `src/pages/404.astro`, `500.astro`, and a static `public/maintenance.html` for 503):** a 680px centred column.
    - **Code numeral:** Young Serif `clamp(110px, 16vw, 210px)`. The middle "0" is a **blue ring**: `0.72em` circle, `0.14em` `--blue` border, blue centre dot, gently pulsing between scale 1 and 0.9 over 2.6s.
    - **Text:** the EN H1 (Young Serif `clamp(28px, 3.4vw, 44px)`) with a `--muted` subline. Under a divider, the **Spanish** line (Young Serif 19px) and its subline (15px `--faint`) with `lang="es"`. Pages are bilingual because the locale is unknown at the root.
    - **Buttons:** a blue pill "Go home · Ir al inicio" / "Try again · Reintentar" plus an optional surface pill.
    - **503:** has no header or nav, just the wordmark, so it has no dependencies.
    - Copy for all three is in `Site Pages.dc.html` (`ERR` in the logic).

## State
- `theme` (global, `localStorage`), `menuOpen` (NavBar), lightbox index (existing), blog/sales pagination (existing), sales `unlocked` (existing sessionStorage), Now `<details>` (native).
- Home random photos: pick in a client `<script>` from a JSON list of all album photos, rendered at build time into a `data-` attribute, so each visit differs.

## Assets
- `assets/david.png`: the profile photo the user supplied. Replace `src/assets/placeholders/profile-photo.svg` on Home with it.
- Icons: reuse the existing inline SVGs in `ContactSection.astro`. Illustrations are plain CSS shapes (see the files).

## Files
- `Home Redesign.dc.html`: Home. **Turn 2 (2a–2e) is final**; turns 1 and 0 are earlier explorations and the old design.
- `Site Pages.dc.html`: all other pages (sections 1–12, desktop and mobile).
- `support.js`: runtime needed to open the `.dc.html` files locally.
