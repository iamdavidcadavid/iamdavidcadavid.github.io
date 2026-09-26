# Build Contract: Sales Catalogue Check

## When it runs

| Command | Check runs? |
|---|---|
| `npm run build` (local) | Yes, first (npm `prebuild`) |
| GitHub publishing workflow (`npm run build`) | Yes, first |
| `npm run validate:sales` | Yes, on its own |
| `npm run dev` / `npm run preview` | No |
| `npx astro build` (bypassing npm) | No (documented limitation) |

## Output and exit code

Success (exit 0), then `astro build` continues:

```text
✓ public/sales-catalog.en.json — 7 item(s) valid
✓ public/sales-catalog.es.json — 7 item(s) valid
✓ EN and ES catalogues list the same 7 item(s)
```

Per-file failure (exit 1; `astro build` does not start; nothing is deployed):

```text
✗ public/sales-catalog.es.json failed validation:
  - 3.price: <reason>
```

Parity failure (exit 1):

```text
✗ item "item-8" is in sales-catalog.en.json but missing from sales-catalog.es.json
```

Duplicate ID (exit 1):

```text
✗ item "item-2" appears more than once in sales-catalog.en.json
```

Unreadable file (exit 1):

```text
✗ Could not read/parse public/sales-catalog.en.json: <reason>
```
