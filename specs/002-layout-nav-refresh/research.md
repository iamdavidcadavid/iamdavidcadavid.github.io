# Phase 0 Research: Layout, Navigation & Content Restructuring

All items below were resolved by reading the actual current implementation
(`src/layouts/BaseLayout.astro`, `src/components/NavBar.astro`, `ContactSection.astro`,
`BlogList.astro`, `global.css`) rather than assumed from the spec alone — this feature edits
working code, so the decisions here are grounded in what's actually there today. No
`NEEDS CLARIFICATION` markers remain.

## 1. Shared content-width container for the header

**Decision**: Add one new token and utility class to `global.css`:

```css
--content-max-width: 1100px;
```

```css
.site-container {
  max-width: var(--content-max-width);
  margin-inline: auto;
  padding-inline: 1.5rem;
}
```

`BaseLayout.astro`'s header wraps `NavBar` + `LanguageSwitch` in a `<div class="site-header-inner">`
using this class; `.site-header` itself stays full-width (so its background/border spans edge to
edge) while its *content* is inset to match the page body (FR-001/FR-002).

**Rationale**: 1100px matches the widest existing content container on the site (`AlbumGrid`'s
1100px), so the header reads as aligned with the page body without requiring a different,
impractical per-page dynamic width (page content ranges from 720px to 1100px today). This is a
reasonable, spec-compatible reading of "inside the same content-width container the rest of the
page's content uses" — FR-001 doesn't require pixel-exact matching per page, just that the header
isn't spanning the full browser width edge-to-edge.

**Alternatives considered**: A per-page header width (matching each page's own content
max-width exactly) — rejected as impractical for a single shared `BaseLayout`, and not actually
required by the spec's wording. Reusing an existing narrower width (e.g. 960px) — rejected
because the Blog grid (item 9) is about to need more horizontal room anyway (see §3), so 1100px
serves both needs with one token.

## 2. Sticky header, hamburger-left, without breaking the mobile dropdown

**Decision**: Three small, targeted CSS changes, no new wrapper element needed beyond §1's
`.site-header-inner`:

1. `.site-header`'s current rule (`display: flex; align-items: center; justify-content:
   space-between; gap: 1rem; padding: 1rem 1.5rem; background: ...; border-bottom: ...;`) is
   **replaced**, not extended: `.site-header { position: sticky; top: 0; z-index: 40; background:
   var(--color-white); border-bottom: 1px solid var(--color-neutral-200); }` — the flex layout
   and horizontal `padding-inline` move to the new `.site-header-inner.site-container` (§1)
   instead. (Kept below the existing modals'/gates' `z-index: 100`, so an open photo/sales modal
   still layers above the header.) **This replacement is load-bearing**: if `.site-header` keeps
   its old `padding: 1rem 1.5rem` alongside `.site-header-inner`'s own `padding-inline: 1.5rem`
   from `.site-container`, the two paddings stack to 3rem total and the header's content no
   longer actually lines up with the page body's own containers — silently defeating FR-001/
   FR-002, this feature's own P1 requirement, and SC-001. (Found during `/speckit-analyze`,
   finding I1.)
2. In `NavBar.astro`'s mobile media query, **delete** the existing
   `.navbar { position: relative; width: 100%; justify-content: flex-end; }` overrides entirely.
3. Leave `.nav-menu`'s mobile rule (`position: absolute; top: 100%; left: 0; right: 0;`)
   unchanged.

**Rationale**: This is why the current implementation has the hamburger drifting toward the
right edge next to the language switch instead of sitting at the true left edge (item 10): the
mobile-only `.navbar { width: 100%; justify-content: flex-end }` was an intentional-at-the-time
hack to force the button rightward, and it works by first stretching `.navbar` to the header's
full available width and then packing its single child (the button) against `.navbar`'s own
right edge. Removing both properties lets `.navbar` shrink back to its natural (hamburger-button)
width, which — combined with the header's own `justify-content: space-between` between the
`NavBar` and `LanguageSwitch` — puts the button at the true left edge and the language switch at
the true right edge, matching desktop.

The one thing that change could have broken: `.nav-menu`'s `left: 0; right: 0` needs a
*wide* positioned ancestor to stretch against, not the now-narrow `.navbar`. Per the CSS spec, an
absolutely-positioned element's containing block is its nearest ancestor with a `position` other
than `static` — and `.site-header` is now `position: sticky` (item 3, itself "positioned" for
this purpose), sitting above `.navbar` in the DOM. Since `.navbar` no longer claims
`position: relative` for itself, the browser's search for a positioned ancestor skips right past
the now-`static` `.navbar`/`.site-header-inner` and lands on `.site-header`, which spans the
full header width. So the opened dropdown menu continues to span the full header edge-to-edge
(a deliberate, and arguably better, choice for mobile touch targets — see the note in
`quickstart.md`), while the *collapsed* hamburger button sits inset at the container's left edge.
No extra wrapper or explicit `position: relative` needed anywhere — the existing DOM hierarchy
already provides the right containing block once the old override is removed.

**Alternatives considered**: Making `.nav-menu` position relative to a new dedicated
`position: relative` wrapper around just the button — rejected as an unnecessary extra element
when the already-sticky `.site-header` already serves as a valid containing block. Using
`position: fixed` instead of `sticky` for the header — rejected; `fixed` would require manually
compensating page content with a top-padding equal to the header's height (and that height can
change with content/viewport), whereas `sticky` participates in normal layout flow and needs no
such compensation.

## 3. Blog grid (two columns, equal width and height per row)

**Decision**: Change `BlogList.astro`'s `.blog-list` from a single-column stacked list
(`max-width: 720px`) to:

```css
.blog-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  max-width: var(--content-max-width); /* 1100px, from §1 */
}

@media (max-width: 767.98px) {
  .blog-list {
    grid-template-columns: 1fr;
  }
}
```

No JavaScript change needed for equal-width/equal-height: CSS Grid's default `align-items:
stretch` on grid items already makes every cell in a row match the row's tallest cell, and
`grid-template-columns: repeat(2, 1fr)` gives both columns identical width — this is exactly
FR-013's "same width... same height... matching whichever of the two is taller" as a *native*
Grid behavior, not something to compute manually. The existing `Load More` script (which toggles
`item.style.display`) needs no change — toggling an inline `display` on a grid item still
participates correctly in the grid.

**Rationale**: Matches the spec's Assumption that the grid collapses to one column below the
site's established 768px breakpoint. Reusing `--content-max-width` (1100px) from §1 gives the
grid enough room for two comfortably-sized columns instead of the old 720px single column.

**Alternatives considered**: Flexbox with `flex-wrap` — rejected; matching row heights across
wrapped flex rows requires either JS measurement or `align-items: stretch` tricks that are more
fragile than Grid's native per-row stretch behavior. A JS-measured "equalize heights" script —
rejected as unnecessary complexity when CSS Grid does this natively (constitution Principle III).

**Explicit decision on the existing alternating-color logic** (found underspecified during
`/speckit-analyze`, finding U2): `BlogList.astro`'s per-item `is-even`/`is-odd` class is left
unchanged — computed from raw array index, exactly as it is today. In a 2-column left-to-right
fill order, column parity is constant every row, so this renders as **two solid-colored
columns** (column 1 always the light/`is-even` treatment, column 2 always the
blue-tint/`is-odd` treatment), not a checkerboard. This is a deliberate choice, not an oversight:
within any row the two posts still read as visually distinct (satisfying 001's FR-026's
"adjacent entries... easy to tell apart"), and a clean two-tone-column look reads better for a
card grid than a busier checkerboard would. No template/JS change needed for this feature.

## 4. Home/About merge and Contact's promotion to its own page

**Decision**: `AboutSection.astro`'s only change is dropping `id="about"` — its content and
responsive text/photo layout are otherwise untouched, since the component was never labeled
"About" visually in the first place (no `<h2>About</h2>` exists today; it was only the `#about`
anchor + nav entry that made it a distinct "section"). `index.astro` (both locales) keeps
rendering `<AboutSection />` right after the banner, exactly as today, just without a `<ContactSection />`
call — that moves to the new `contact/index.astro` pages. `NavBar.astro`'s `links` array drops
the "About" entry and changes "Contact" from `${home}#contact` to `getRelativeLocaleUrl(locale,
'/contact/')`.

**Rationale**: Because `AboutSection` was already just an unlabeled content block (not a
visually distinct "section" with its own heading), "merging" it into Home requires no content
restructuring at all — only removing the anchor/nav-entry that made it independently
addressable. This keeps the change minimal, consistent with constitution Principle III.

**Alternatives considered**: Physically inlining `AboutSection`'s markup into `index.astro`
(removing the component boundary entirely) — rejected as unnecessary churn; the component
already renders exactly the content that belongs on Home, so keeping it as a component costs
nothing and stays easy to find/edit.

## 5. Contact page's image

**Decision**: New placeholder SVG at `src/assets/placeholders/contact-photo.svg`, visually
distinct from the About/Home placeholder photo (different icon motif — an envelope/message
glyph rather than the About page's person silhouette) so the two pages don't appear to show an
identical image. `ContactSection.astro` gains an `image`-bearing markup block using the same
responsive text/image pattern as `AboutSection` (image right of text on desktop ≥768px, image
above text on mobile) for visual consistency with the rest of the site.

**Rationale**: The spec leaves the image's specific source as a content decision (Assumptions).
Reusing the established responsive text/image pattern (rather than inventing a new layout)
keeps the site visually coherent and requires no new CSS pattern.

**Alternatives considered**: Reusing the exact same `profile-photo.svg` used on Home — rejected
as likely to read as a mistake (the same "photo" appearing twice with different context) rather
than intentional; a distinct placeholder better signals "this is a stand-in, to be replaced" on
each page independently.

## 6. GitHub / YouTube / email icons

**Decision**: Hand-authored inline SVG marks (circle badge, same `.icon` sizing/style already
used for LinkedIn's "in" monogram): a simplified GitHub "octocat" silhouette, a rounded-rectangle
with a play triangle for YouTube, and a standard envelope glyph for email. LinkedIn's existing
"in" text monogram is left unchanged.

**How email joins the icon-button list** (resolved during `/speckit-analyze`, finding U1):
`src/config/site.ts`'s `ContactPlatform` union gains `'email'`; `contactLinks` gains a fourth
entry `{ platform: 'email', username: contactEmail }` (reusing the `username` field to carry the
address — the field name predates this and stays as-is rather than introducing a discriminated
union for one extra case); `contactLinkUrl`'s switch gains `case 'email': return
\`mailto:${link.username}\`;`. `ContactSection.astro`'s existing `.map()` over `contactLinks`
then renders email exactly like the other three — same markup, same `aria-label` from
`platformLabels` (which also needs an `email: 'Email'` entry) — with no separate hand-coded
markup branch. This keeps the aria-label/keyboard-accessibility pattern uniform across all four
icon-buttons "for free" instead of needing a one-off case in the template.

**Rationale**: FR-010 explicitly scopes "proper icon" to GitHub and YouTube only — and that
scoping makes sense on inspection: LinkedIn's actual real-world icon *is* the lowercase "in"
mark, so the current implementation already satisfies "proper icon" for LinkedIn, which is
presumably why the request didn't list it. Using simplified, hand-drawn brand-recognizable
glyphs (rather than a specific copyrighted icon-pack asset) to indicate "this links to GitHub /
YouTube" is standard, non-infringing nominative use, consistent with how essentially every site
identifies outbound social links. No icon-library dependency is added (constitution
Principle III) — these are static, one-off inline SVGs, same pattern as the placeholder photos.

**Alternatives considered**: Adding an icon library (e.g., a package of brand SVGs) — rejected;
three one-off inline SVGs don't justify a new dependency for a small personal site. Upgrading
LinkedIn's mark too, for uniformity — rejected per the reasoning above (its current mark already
*is* the "proper" icon).

## 7. Footer quote — bilingual handling (resolved during `/speckit-analyze`, finding C1)

**Decision**: `BaseLayout.astro`'s footer branches on `Astro.currentLocale` (the same pattern
already used in `AboutSection.astro`/`ContactSection.astro`/`NavBar.astro`/`LanguageSwitch.astro`
for locale-specific copy), rendering the English quote on English pages and the Spanish
translation (spec.md FR-011) on Spanish pages. Both share the same `"— Gandalf"` attribution
(a proper noun, not translated — consistent with how platform names like "LinkedIn" aren't
translated elsewhere on the site).

**Rationale**: `BaseLayout.astro` is one shared component rendered verbatim for every `en`/`es`
page. Its only text before this feature was the copyright line (`© {year} David Cadavid` — no
translatable words), which is why it never needed locale branching. The Gandalf quote is
genuinely English/Spanish prose; skipping the branch would have put an untranslated,
unflagged piece of content on every Spanish page, conflicting with constitution Principle II
(Bilingual Parity, NON-NEGOTIABLE).

**Alternatives considered**: Leaving the quote English-only as a deliberate, documented
exception (the same pattern 001 used for the "email" button's literal label) — rejected here
specifically because that precedent came from an *explicit* user instruction to keep that one
word untranslated; nothing in this feature's request said the same about the footer quote, so
translating it is the constitution-compliant default rather than an exception that needs
justifying.
