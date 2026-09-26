# Interaction Contract: UI Refinements

Replaces the parts of feature 003's viewer contract (§A caption) and feature 004's interaction
contract (§A theme buttons, §C Home tiles, §D catalog dots) that this feature changes. Anything
not listed here is unchanged.

## A. Enlarged photo viewer (album pages and Sales)

| Situation | Required behavior |
|---|---|
| Photo shown | No visible description text. The `<img>` keeps the photo's alt text. |
| N > 1 photos | Previous and next buttons sit left and right of the photo, vertically centred on it, and stay centred as photos of different heights are shown. |
| N = 1 | No arrow buttons; the photo is centred alone. |
| Narrow screen (< 768px) | Both arrows stay fully visible and tappable, the photo shrinks to fit between them, and nothing overlaps the × close button. |
| Navigation | Unchanged: wrap-around, ← / → keys, Escape and backdrop close. |

## B. Sales product-card carousel

| Situation | Required behavior |
|---|---|
| Card with N > 1 photos | 36px prev/next buttons overlay the card photo at its left and right edges, vertically centred. No dots. |
| Arrow pressed | The card photo changes, with wrap-around (unchanged). The visible photo's accessible name becomes "{alt} — Photo i of N" / "{alt} — Foto i de N". |
| Photo clicked | The enlarged viewer opens on the photo currently shown (unchanged). |
| Card with 1 photo | No arrows, no position text. |

## C. Home Photos card

| Situation | Required behavior |
|---|---|
| Tiles | Plain images (no buttons or links) with alt text, no pointer or zoom cursor, no hover zoom, not in the tab order. |
| Click, tap or Enter on a tile | Nothing happens. |
| Random pick | Unchanged (more than 3 photos in the pool means a random 3 on each load). |
| "See more" | Goes to the locale's Photos page (unchanged). |

## D. Theme switch

| Situation | Required behavior |
|---|---|
| Markup | One `<button role="switch">` labelled "Dark theme" / "Tema oscuro". `aria-checked="true"` when the effective theme is dark. |
| Click anywhere on it (sun, moon or pill) | Flips to the other theme, saves it, and updates `aria-checked` and the highlighted icon. |
| Keyboard | Tab reaches one control; Enter or Space flips. |
| Unchanged | Hidden without JS; first visit follows the device; no flash; storage errors ignored; follows live device changes while no choice is saved. |

## E. Footer and contact

| Situation | Required behavior |
|---|---|
| Footer | Quote line first, copyright line second, on every page in both languages. |
| LinkedIn row | Handle "iamdavidcadavid"; link `https://www.linkedin.com/in/iamdavidcadavid`. |
