# Data Model: Empty States and Polish

No new content collections or stored data. Three existing shapes gain rules or uses.

## Sales catalogue (`public/sales-catalog.en.json`, `public/sales-catalog.es.json`)

An array of items. Per-file rules (unchanged, enforced by `scripts/validate-sales.mjs`):

| Field | Rule |
|---|---|
| `id` | string, min length 1 |
| `name` | string, min length 1 |
| `price` | string, min length 1 |
| `description` | optional string |
| `photos` | array of `{ src: string (min 1), alt: string (min 1) }`, **at least 1** |

New rules (FR-013a):
- **Unique IDs**: no `id` appears twice in the same file.
- **Parity**: the set of `id`s in EN equals the set in ES. Order may differ. Names, prices,
  descriptions and photo alt text may differ (they're localized).
- **Empty is valid**: `[]` passes, provided the other file is also `[]` (follows from parity).

When it runs: automatically before every `npm run build` (npm `prebuild`), and on its own via
`npm run validate:sales`. Output format: [contracts/build-contract.md](./contracts/build-contract.md).

## Empty state (`src/components/EmptyState.astro`, new)

| Prop | Type | Notes |
|---|---|---|
| `message` | string | Already localized by the caller (from `ui.ts`) |
| `illustration` | `'camera' \| 'hourglass' \| 'tag'` | CSS-shape drawing in `--blue`, `aria-hidden` |

Rendered as a centred `.card` with `role="status"`. Used by:

| Where | Condition | Illustration | Message key |
|---|---|---|---|
| Album page (`PhotoLightbox`) | album has 0 photos | camera | `photos.empty` |
| Photos page (`AlbumGrid`) | 0 albums in the locale | camera | `photos.empty` |
| Now page (`NowTimeline`) | 0 Now entries in the locale | hourglass | `now.empty` |
| Sales page (`SalesGate`, after unlock) | loaded catalogue has 0 items | tag | `sales.empty` |

Home "Now" card (`HomeNowCard`): with 0 entries, shows the plain text `home.now.empty` in place
of the date and summary (no illustration; matches the Home Photos and Writing cards' empty text).

## Home role tags (`HomeHero.astro`)

Ordered list of `{ key, dot }`: engineer (`--blue`), mentor (`--chip-mentor`), speaker
(`--chip-speaker`), voice (`--chip-voice`), **creator (`--chip-creator`, new token)**.
