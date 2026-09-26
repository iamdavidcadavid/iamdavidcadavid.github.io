# Quickstart: Validating UI Refinements

## Setup

```bash
npm run build
```

```bash
npm run preview
```

Check each scenario at 1280px and 390px, in light and dark, and in EN and ES, unless a step says
otherwise.

## Scenario 1: Photo viewer (US1, contract §A)

1. Open `/photos/weekend-hike/` and click a photo. There should be no visible description text,
   the arrows should sit left and right of the photo at its vertical middle, and the image's
   `alt` should still be set (DevTools).
2. Use the arrows and the ← / → keys to step through all 3 photos. The view should wrap around,
   the arrows should stay centred, and Escape should close it.
3. Repeat on `/sales/` after unlocking, with a multi-photo item (e.g. Item One). The result
   should be identical.
4. At 390px, both arrows should be fully visible and tappable, and the × should not overlap
   anything.
5. Open a single-photo Sales item. There should be no arrows.

## Scenario 2: Sales card carousel (US1, contract §B)

1. On an unlocked `/sales/` at both widths, multi-photo cards should show their arrows on the
   photo's left and right edges at its vertical middle, with no dots.
2. Press next. The card photo should change and wrap after the last one. In DevTools, the visible
   photo's accessible name should read "… — Photo 2 of 2" (and "Foto 2 de 2" on `/es/sales/`).
3. Click the card photo. The viewer should open on that same photo.
4. Single-photo cards should show no arrows.

## Scenario 3: Home and Now (US2, contract §C)

1. `/`: the heading should read "Hello — I am David." and the button "What I am up to now".
   `/es/` should be unchanged.
2. Click, tap and hover the Photos card tiles. Nothing should open and there should be no zoom or
   pointer. Tab through the page and confirm no stop lands on a photo. "See more" should go to
   `/photos/`.
3. `/now/`: the latest update's title should read "[PLACEHOLDER] What I am up to now".

## Scenario 4: Theme switch (US3, contract §D)

1. In dark, click the moon; the site should turn light. Click the moon again (or the sun); it
   should turn dark. Repeat from light.
2. Keyboard: Tab to the switch and press Space, then Enter. Each should flip the theme. A screen
   reader or the accessibility tree should show one switch, "Dark theme", on or off.
3. Reload and open another page. The chosen theme should persist. With JS disabled the switch
   should be hidden.

## Scenario 5: Footer and LinkedIn (US4, contract §E)

1. Any page, both languages: the quote should appear above the copyright line.
2. `/contact/` and `/es/contact/`: LinkedIn should show "iamdavidcadavid" and link to
   `https://www.linkedin.com/in/iamdavidcadavid`.

## Scenario 6: Regressions

1. Run the contrast check in both themes on Photos, the album with the viewer open, Sales
   (unlocked, viewer open), Home and Contact. There should be 0 failures.
2. Confirm there are no literal colours in `src` code files outside `global.css` and no
   `var(--color-` references.
3. Confirm there are 0 English interface strings on `/es/` pages (including the new switch label
   and the card position label) and no console errors.
