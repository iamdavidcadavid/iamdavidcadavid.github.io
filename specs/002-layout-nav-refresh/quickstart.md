# Quickstart: Validating Layout, Navigation & Content Restructuring

Manual validation guide (no automated test suite — consistent with 001). This **supplements**
001-content-website's `quickstart.md`; re-run that one too, since Blog/Home/Contact/nav changes
here could regress things it checks (translation-pending note, language-switch targets, etc.).

**Important**: every check below requires an actual browser (`npm run dev` or
`npm run build && npm run preview`), not just reading generated HTML — the two real bugs found
while building 001 (a CSS-specificity issue hiding modals, and zero-sized SVGs) were both
invisible in static output and only showed up by clicking through the running site. Sticky
positioning and CSS Grid row-height behavior are exactly the same kind of runtime-only checks.

## Setup

```bash
npm install   # if not already
npm run build && npm run preview
```

## Validation scenarios

### 1. Header: container alignment, sticky, hamburger position (FR-001–FR-004)

At each of 375px, 767px, 768px, and 1440px, on `/`, `/blog/`, `/contact/`, and `/sales/`:

- [ ] The nav (desktop) or hamburger (mobile) sits flush with the **left edge** of the same
      content column the page's own body text uses — not flush with the browser's edge.
- [ ] The language-switch link sits flush with that column's **right edge**.
- [ ] Below 768px, the hamburger button is on the **left**, not next to the language switch on
      the right.
- [ ] Scroll down the page by at least one full viewport height — the header stays pinned to
      the top and remains usable (click a nav link from a scrolled position and confirm it
      still works).
- [ ] Open the mobile hamburger menu — the dropdown appears and is *not* clipped or squeezed
      into the hamburger button's own narrow width (it should span the header, per
      research.md §2).

### 2. Home page (FR-005, FR-006)

- [ ] `/` and `/es/` show the former About content (bio + photo) with no separate "About"
      heading and no `#about` URL fragment involved.
- [ ] The nav shows exactly four items: Home, Contact, Blog, Photos — no "About".

### 3. Contact page (FR-007, FR-008)

- [ ] `/contact/` and `/es/contact/` load directly (not via a `/#contact` scroll) and show the
      existing intro paragraph, all contact icon-buttons, and an image.
- [ ] The image responds the same way About's photo does: beside the text on ≥768px, above the
      text on <768px (research.md §5 — verify this matches, since the spec only requires *an*
      image, not this specific layout).
- [ ] Following the nav's "Contact" link from any other page lands here directly.

### 4. Contact icon-buttons (FR-009, FR-010)

- [ ] The email action is styled identically to LinkedIn/GitHub/YouTube (same circular
      icon-button), showing an envelope glyph — not the text "email".
- [ ] GitHub's icon-button shows a GitHub-recognizable mark (not "gh" text).
- [ ] YouTube's icon-button shows a YouTube-recognizable mark (not a bare "▶" placeholder).
- [ ] LinkedIn's icon-button is unchanged ("in").
- [ ] Every icon-button still has an accessible name (inspect via the accessibility tree or
      screen reader — `aria-label` per platform) and is keyboard-reachable (Tab through them).

### 5. Footer quote (FR-011)

- [ ] On any English page, the footer shows the copyright line, then below it: "All we have to
      decide is what to do with the time that is given us" — Gandalf.
- [ ] On the equivalent Spanish page, the footer shows the Spanish quote ("Lo único que podemos
      decidir es qué hacer con el tiempo que se nos ha dado" — Gandalf), not the English one.

### 6. Blog two-column grid (FR-012, FR-013)

- [ ] At ≥768px, `/blog/` shows posts in two columns of equal width.
- [ ] Find (or temporarily create) a row where one post's excerpt is visibly longer than its
      row-mate's — confirm both posts in that row render at the same height (the shorter one's
      background/card stretches to match the taller one), not two different heights.
- [ ] Below 768px, the grid collapses to a single column.
- [ ] Click "Load More" — newly revealed posts continue to fill the two-column grid the same
      way, and equal-height-per-row still holds for the new rows.
- [ ] If the total post count is odd, confirm the last row's single post sits in the left column
      only, not stretched across both.

## Regression spot-check (001's quickstart, re-run)

- [ ] Language switch from `/blog/` still goes to `/es/blog/` (not `/es/`) — nav restructuring
      shouldn't have touched `LanguageSwitch.astro`, but confirm anyway.
- [ ] The `english-only-draft` blog post still shows its translation-pending note and still has
      no language-switch link.
- [ ] Sales page password gate, modal, and Load More still work (nothing in this feature should
      touch `SalesGate.astro`, but the header/global.css changes are shared, so re-verify).
- [ ] Sitemap/robots still exclude `/sales/` and `/easter-egg/` in both languages.
