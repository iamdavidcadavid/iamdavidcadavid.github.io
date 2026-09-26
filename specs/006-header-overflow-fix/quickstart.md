# Quickstart: Validating the Header Overflow Fix

## Setup

```bash
npm run build
```

```bash
npm run preview
```

Record the header's item positions at 1280px, 960px and 390px **before** making the change and
save them to `specs/006-header-overflow-fix/baseline.json` (for Scenario 3).

## Scenario 1: No sideways scroll (US1, contract rows 2)

At window widths 768, 800, 850, 900 and 959px, in EN and ES, light and dark, open Home, Now,
Contact, Blog (list and one post), Photos (list and one album), Sales and a 404 URL. On each:

1. `document.documentElement.scrollWidth - document.documentElement.clientWidth` is `0`.
2. The name, all 5 nav links, EN/ES (where shown) and the theme switch are fully inside the
   window, on one row.

## Scenario 2: Spare room (SC-002)

On `/es/` at 768px, measure the free space in the header row (row content width minus the sum of
its items and gaps). It should be at least 16px (expected: about 22px with a 15px scrollbar).

## Scenario 3: Unchanged wide and phone headers (US2, SC-003)

At 1280px and 390px, compare the header items' positions and sizes with the "before" record.
Every value should match exactly. Also check 960px: the spacing should be the desktop values
(48px margins, 18px link padding).

## Scenario 4: Navigation still works (FR-005, SC-004)

In the compact range: hover a link (thin outline), check the current page is highlighted, Tab
through the nav (focus outline fully visible), and follow each link. Each link's box should be at
least 24 × 24px.

## Scenario 5: Alignment and regressions

1. In the compact range, the header name's left edge lines up with the page content's left edge.
2. The contrast check and the literal-colour sweep from feature 005 show no change, and there are
   no console errors.
