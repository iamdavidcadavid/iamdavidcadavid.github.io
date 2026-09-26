# Quickstart: Validating Empty States and Polish

## Setup

```bash
npm run build
```

```bash
npm run preview
```

Check each page scenario at 1280px and 390px, in light and dark, and in EN and ES.

## Scenario 1: Empty states (US1, contract §A)

1. With today's content, open Now, Photos, Sales (unlocked) and an album with photos. Nothing
   should look different from before.
2. Open `/photos/coming-soon/` (an album with no photos). It should still show the camera and
   "Development in process…" / "En proceso de revelado…".
3. **Now**: temporarily move `src/content/now/en/*.md` out of the project, rebuild, and open
   `/now/` and `/`. Expect the hourglass card with "Still figuring out what's next…" on `/now/`,
   and "Nothing new yet." in the Home Now card. `/es/now/` should still show its updates. Restore
   the files.
4. **Photos**: temporarily move `src/content/albums/es/*.yaml` out, rebuild, and open
   `/es/photos/`. Expect "0 álbumes" and the camera card with "En proceso de revelado…". Restore.
5. **Sales**: temporarily set both `public/sales-catalog.en.json` and `.es.json` to `[]`, rebuild
   (the check should pass), unlock `/sales/` and `/es/sales/`. Expect the tag card with "The
   shelves are empty for now…" / "Los estantes están vacíos por ahora…" and no "Load more".
   Restore.
6. In each case, the accessibility tree should show the card as a status with the message, and
   no illustration content. With reduced motion, the illustrations should not move.

## Scenario 2: Copy email (US2, contract §B)

1. `/contact/`: a "Copy" button appears after the email address. Activate it with the mouse, then
   with Tab + Enter and Tab + Space. Each time, pasting into a text field should give exactly the
   address, and the button should read "Copied" for about 2s.
2. Click the address itself: it should still open the email app.
3. `/es/contact/`: "Copiar" → "Copiado".
4. Simulate a failure (e.g. temporarily make `navigator.clipboard.writeText` reject in DevTools):
   the note "Couldn't copy. Select and copy the address: contact@davidcadavid.com" should
   appear, and double-clicking or dragging across the address in the note should select it.
5. With JS disabled, there should be no button.
6. At 390px, the row wraps with no sideways scroll.

## Scenario 3: Catalogue check (US3, build contract)

1. `npm run build` with valid catalogues: the three ✓ lines appear first, then the build runs.
2. Remove `price` from one item in `sales-catalog.es.json`: `npm run build` stops before Astro
   starts, naming the file, item index and field. Restore.
3. Add an `item-8` only to the EN catalogue: the build stops with the parity message. Restore.
4. Duplicate an ID within one file: the build stops with the duplicate message. Restore.
5. `npm run validate:sales` still works on its own.

## Scenario 4: Roles (US4, contract §C)

1. `/`: five tags ending in "Content creator", and the new summary line. `/es/`: "Creador de
   contenido" and the new Spanish summary line.
2. At 390px, tags wrap neatly; no sideways scroll.

## Scenario 5: Regressions

1. Contrast check in both themes on Home, Contact, and each empty state: 0 failures.
2. No literal colours outside `global.css`, no `var(--color-`.
3. 0 English strings on `/es/` pages, including the copy button's name and status.
4. 0 console errors.
