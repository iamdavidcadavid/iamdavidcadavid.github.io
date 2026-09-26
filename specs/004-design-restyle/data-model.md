# Phase 1 Data Model: Site Design Restyle

This feature changes presentation, not content. The existing content collections (`blog`,
`albums`, `now`) and the sales catalog JSON keep their schemas unchanged. It introduces two small
pieces of state and one shared lookup table.

## Theme preference (client-side only)

The visitor's chosen color theme. It lives only in their browser and is never sent anywhere.

| Aspect | Value |
|---|---|
| Storage | `localStorage` key `theme` |
| Allowed values | `"light"`, `"dark"`. Absent (or anything else) means "follow the device". |
| Reflected as | `data-theme="light" \| "dark"` on `<html>`. The attribute is absent when following the device. |
| Written by | `ThemeToggle` when the visitor clicks a theme button |
| Read by | The inline `<head>` script, before first paint, on every page |

**States and transitions**:

```text
(follow device) --click light--> light --click dark--> dark --click light--> light ...
```

There is no transition back to "follow device" from the UI. The design offers only two buttons. A
visitor who clears site data returns to "follow device".

**Validation**: Any stored value other than `"light"`/`"dark"` is ignored (treated as absent).
Every read and write is wrapped in `try/catch`. When storage is unavailable the toggle still
works for the current page and simply isn't remembered.

## Home photo pool (build-time, per locale)

Every photo available for the Home Photos card in one language.

| Field | Type | Source |
|---|---|---|
| `src` | string (URL) | `albums` collection → `photos[].src` |
| `alt` | string, non-empty | `albums` collection → `photos[].alt` (already required non-empty by the album schema) |

- **Scope**: all albums whose id starts with the page's locale (`en/` or `es/`), in collection
  order. Album covers are excluded; only album photos are included.
- **Delivery**: rendered into a `data-pool` JSON attribute on the card at build time. The first 3
  entries are also rendered as the initial tiles.
- **Size**: currently 3 photos per locale, since the "Coming soon" album is empty. With 3 or fewer,
  the client shuffle is skipped.
- **Empty pool**: the card shows the `home.photos.empty` message and no tiles.

## UI copy dictionary (build-time)

Shared EN/ES interface strings in `src/i18n/ui.ts`.

| Aspect | Value |
|---|---|
| Shape | `{ en: Record<Key, string>, es: Record<Key, string> }`. Both locales MUST define the same keys (a TypeScript type enforces this). |
| Interpolation | `{n}` placeholders, e.g. `blog.count` → "7 posts" / "7 entradas" |
| Plurals | Separate `…One` / `…Other` keys where counts appear (posts, photos) |
| Contents | Listed in full in [contracts/ui-copy.md](./contracts/ui-copy.md) |

**Validation**: Both languages must define the same set of keys, so an English-only key fails the
build (supports SC-007).
