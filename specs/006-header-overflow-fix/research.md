# Research: Header Overflow Fix

All figures were measured in the browser on the current build (feature 005). Widths are the
rendered widths of the header's parts at the desktop layout.

## 1. Where the width goes today

| Part | EN | ES |
|---|---|---|
| Page-edge margins (`--gutter` 48px × 2) | 96 | 96 |
| Wordmark "David Cadavid." (22px, `nowrap`) | 166 | 166 |
| Gap wordmark → nav (`.site-header-inner` gap) | 16 | 16 |
| Nav pill (5 links, `padding: 10px 18px`, 6px gaps, 6px pill padding) | 427 | 431 |
| Gap nav → actions | 16 | 16 |
| Actions (EN/ES switch, 20px gap, theme switch) | 150 | 150 |
| **Total** | **871** | **875** |

With a classic 15px vertical scrollbar, the header fits only from a window of about 890px (ES).
Between 768px and that width the page scrolls sideways (68px at 770px, 42–46px at 800px).

## 2. Spacing values for the compact range

**Decision**: In the compact range, use:

| Setting | Today | Compact | Saves (ES) |
|---|---|---|---|
| `--gutter` (page-edge margin, each side) | 48px | 24px | 48px |
| Nav link padding (left/right) | 18px | 10px | 80px |
| Nav pill gap between links | 6px | 4px | 8px |
| Header actions gap (EN/ES ↔ theme switch) | 20px | 12px | 8px |

Resulting header width in ES: 48 + 166 + 16 + 343 + 16 + 142 = **731px**. At 768px with a 15px
scrollbar the room is 753px, leaving **22px** free (SC-002 needs ≥ 16px). Without a scrollbar it
leaves 37px. English is 4px narrower.

**Rationale**: Only spacing changes (FR-003). The two big contributors are the page margins and
the link padding; the two small gaps close the remaining distance to the SC-002 margin. The
vertical link padding (10px) is unchanged, so links stay about 40px tall, and the narrowest link
("Blog", about 31px of text) stays about 51px wide: well above the 24 × 24px target (FR-005).

**Alternatives considered**:
- *24px gutter + 12px link padding only* (the first estimate): 767px in ES, which overflows at
  768px with a scrollbar by 14px. Rejected.
- *Smaller nav font or wordmark*: changes text size, which FR-003 excludes.
- *Move the language switch into the ☰ menu below ~900px*: hides an item (FR-002) and adds a
  layout change. Rejected by the owner in favour of spacing.

## 3. Upper bound of the compact range

**Decision**: The compact spacing applies from 768px up to **959.98px** (`min-width: 768px` and
`max-width: 959.98px`). From 960px up, everything is as today.

**Rationale**: At today's spacing the header needs 875px + ~15px scrollbar ≈ 890px. Ending the
range at 900px would leave only ~10px of slack in Spanish, so any future label change would
overflow again. 960px gives about 70px of slack with today's spacing while still keeping the
approved 48px margins on every common laptop and desktop width (≥ 1024px). The spec defines
the compact desktop range as 768px up to (not including) 960px: the ~890px fit point plus this
safety margin (FR-001, FR-004).

**Alternatives considered**: 900px (too little slack, see above); 1024px (would change the look on
1000px-wide windows for no benefit).

## 4. Where the compact page margin applies

**Decision**: Override the `--gutter` token in the compact range (in `global.css`, next to the
existing phone override), so the page content and the header keep the same left edge.

**Rationale**: `--gutter` is used only by `.site-container`, which wraps both the header row and
`<main>`. Changing the token keeps them aligned (spec Assumptions) and follows the existing
pattern of overriding it for phones. Content gets 48px more width in this range, which can only
reduce overflow risk elsewhere.

**Alternatives considered**: A header-only padding override. It would put the name 24px further
left than the page content, which looks misaligned.

## 5. Breakpoint rule

**Decision**: Keep 768px as the only layout breakpoint (phone ↔ desktop). The 960px threshold
only adjusts spacing inside the desktop layout; no element changes position, order or
visibility there. The `global.css` note about the literal 768px is extended to name this
spacing-only threshold, so a later change doesn't mistake it for a layout breakpoint.

## 6. What doesn't change

Text sizes, colours (tokens only, FR-006), the pill's shape and shadow, the switches, hover,
current-page and focus styles, and motion (none added). No script changes.
