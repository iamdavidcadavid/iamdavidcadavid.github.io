# Header Layout Contract

The visible behaviour the header guarantees at each window width. Spacing values are in
[data-model.md](../data-model.md).

| Window width | Guarantee |
|---|---|
| < 768px | Phone header exactly as today: name, theme switch, ☰ menu. |
| 768px – 959.98px | One row with the name, the navigation pill (5 links), the EN/ES switch (where the page shows it) and the theme switch. All fully visible, none wrapped or hidden. The page never scrolls sideways because of the header. With Spanish labels at 768px and a 15px scrollbar, at least 16px of the row stays free. |
| ≥ 960px | Desktop header exactly as today (0px difference at 1280px). |

## At every width

- Links go to the same pages, the current page is highlighted with the blue pill, hover shows
  the thin outline, and the keyboard focus outline is fully visible (not clipped).
- Every nav link's clickable area is at least 24 × 24px.
- The header's left edge lines up with the page content's left edge.
- Colours come from the design tokens only; there is no new motion.
