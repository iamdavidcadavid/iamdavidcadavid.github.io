# Routing Contract (supersedes 001-content-website's routing-contract.md for Home/About/Contact)

001's routing contract is otherwise unchanged (Blog, Photos, Sales, Easter Egg rows all stand as
written there). This file documents only the rows that change under this feature.

## Public, navigable, indexable routes — updated

| English URL | Spanish URL | In nav? | In sitemap? | Notes |
|---|---|---|---|---|
| `/` | `/es/` | Yes (Home) | Yes | Now includes the former About content directly; no `#about` anchor |
| `/contact/` | `/es/contact/` | Yes (Contact) | Yes | **NEW** — was previously a `#contact` anchor on Home, not a distinct URL |

## Removed from the nav contract

- **"About" as a navigation entry** — removed. Its content lives on `/`/`/es/` (FR-005), but it
  is no longer independently linked from the nav (FR-006).
- **`/#contact` / `/es/#contact` as the Contact target** — removed. The nav's "Contact" entry now
  points at `/contact/` / `/es/contact/` (FR-007). A visitor with an old bookmark to `/#contact`
  still reaches Home (per spec.md's Assumptions — no redirect is implemented for this).

## Nav entry count

Per FR-006: exactly four entries — Home, Contact, Blog, Photos (previously five: Home, About,
Contact, Blog, Photos).

## Header container contract (new)

- On every page, the navigation (or hamburger, on narrow viewports) and the language-switch
  control render inside a shared `max-width: 1100px` container (`.site-container`,
  research.md §1) — nav/hamburger at its left edge, language switch at its right edge
  (FR-001/FR-002).
- The header itself (background, border) is `position: sticky; top: 0;` and remains visible
  while scrolling, on every page including the hidden Sales/Easter Egg pages (FR-003).
- On viewport widths below 768px, the hamburger control sits at the container's left edge, not
  the right (FR-004). When opened, the dropdown menu spans the full header width edge-to-edge
  (a deliberate implementation choice, research.md §2) — this is independent of the
  collapsed-state left/right alignment contract above.
