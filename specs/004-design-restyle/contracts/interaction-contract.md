# Interaction Contract: Site Design Restyle

Observable behavior that implementation and validation must match. Visual values (sizes, colors,
timing) come from `design/README.md` and the `.dc.html` artboards. This file covers behavior
only. The photo viewer behavior from 003's
[interaction-contract.md §A](../../003-now-page-photo-nav/contracts/interaction-contract.md) and
the Now accordion behavior from its §B still apply unchanged.

## A. Theme

| Situation | Required behavior |
|---|---|
| First visit, no saved choice | Page uses the device preference; `<html>` has no `data-theme` |
| Saved `theme` = `light`/`dark` | `<html data-theme>` is set **before first paint**; no flash of the other theme |
| Visitor clicks the sun / moon | Theme switches immediately; `data-theme` and `localStorage.theme` are updated |
| Toggle "active" button | Reflects the **effective** theme (saved choice, else device preference) |
| Device preference changes while following the device | Page follows it live (via CSS alone) |
| `localStorage` unavailable | Toggle still switches the current page; nothing is remembered; no error thrown |
| JavaScript disabled | Page follows the device via CSS; the toggle is not shown |
| Accessibility | Two `<button>`s labelled "Light theme"/"Tema claro" and "Dark theme"/"Tema oscuro"; the active one has `aria-pressed="true"` |

## B. Header and mobile menu (below 768px)

| Situation | Required behavior |
|---|---|
| Menu button pressed | Menu card fades in below the header; its expanded state is exposed natively (the menu is a `<details>`/`<summary>` disclosure) |
| Pressed again / Escape / a menu link chosen | Menu closes; focus returns to the button on Escape |
| JavaScript disabled | The menu still opens and closes by pressing the button, and every link works; only the Escape and close-on-link enhancements are missing |
| Scrolling with the menu open | Header and card stay pinned together at the top |
| Viewport grows to ≥768px | Menu card is not shown; desktop pill is shown |
| Current page | Its row is `--blue-ink` with the dot marker and `aria-current="page"` |

## C. Home Photos card

| Situation | Required behavior |
|---|---|
| Pool > 3 photos, JS on | On each load, 3 photos are chosen at random from the pool (no duplicates) |
| Pool ≤ 3 photos, or JS off | The first photos of the pool are shown in collection order |
| Pool empty | No tiles; the empty message is shown |
| Tile clicked | Photo viewer opens on that photo; prev/next step through **the tiles shown** (003 §A rules: wrap-around, caption, arrow keys, Escape) |
| Tiles | No text over photos; each tile's accessible name is the photo's alt text |

## D. Sales catalog item

| Situation | Required behavior |
|---|---|
| Item with N > 1 photos | Prev/next buttons and N dots; the dot at the current index is `--blue`, the rest `--line`; wraps around |
| Item with 1 photo | No buttons and no dots |
| Photo clicked | 003's viewer opens for that item's photos (unchanged) |
| Wrong password | "Incorrect password." is shown in `--danger`; the input border turns `--danger`; the input gets `aria-invalid="true"` |

## E. Motion

| Situation | Required behavior |
|---|---|
| `prefers-reduced-motion: no-preference` | Entrance, hover lift/scale, egg wobble, empty-state glow and 404 ring pulse play as in the design |
| `prefers-reduced-motion: reduce` | None of them play; all content is visible in its final position |

## F. 404 page

| Situation | Required behavior |
|---|---|
| Any missing URL (e.g. `/nope/`, `/es/nope/`) | Shows the 404 page with the site header (no active nav item, no language switch) and footer |
| "Go home · Ir al inicio" | Goes to `/` |
| "Read the blog · Leer el blog" | Goes to `/blog/` |
| Language markup | Page `lang="en"`; the Spanish block has `lang="es"` |
