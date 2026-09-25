# Data Model: Header Overflow Fix

This feature has no data, content or stored state. The only "model" is the set of spacing values
per window-width range, which the header and page container read.

## Layout spacing tiers

| Tier | Window width | Layout | `--gutter` | Nav link padding (block / inline) | Nav pill gap | Header actions gap |
|---|---|---|---|---|---|---|
| Phone | < 768px | ☰ menu (unchanged) | 20px | n/a (phone menu) | n/a | 4px (unchanged) |
| Compact desktop *(new)* | 768px – 959.98px | Full desktop row | **24px** | 10px / **10px** | **4px** | **12px** |
| Desktop | ≥ 960px | Full desktop row (unchanged) | 48px | 10px / 18px | 6px | 20px |

## Rules

- The compact tier changes spacing only. Font sizes, colours, element order and visibility are
  the same as the desktop tier.
- Header and `<main>` both read `--gutter`, so they share the same left edge in every tier.
- The phone and desktop tiers must render exactly as today (spec FR-004, SC-003).
