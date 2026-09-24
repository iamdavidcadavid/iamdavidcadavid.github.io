# Feature Specification: Site Design Restyle

**Feature Branch**: `004-design-restyle`

**Created**: 2026-09-24

**Status**: Draft

**Input**: User description: "update the design according to what is described in the design/README.md"

**Design reference**: `design/README.md` (tokens, typography, layout rules, per-page notes),
`design/Home Redesign.dc.html` (Home — turn 2, artboards 2a–2e, is final), and
`design/Site Pages.dc.html` (all other pages, sections 1–15, desktop 1280px and mobile 390px).
Where this spec says "matches the design reference," the exact colors, type sizes, spacing,
radii and motion come from those files; this spec does not restate them.

## Clarifications

### Session 2026-09-24

- Q: Should we build all three error pages from the design, even though GitHub Pages will only
  ever show the 404 one on its own? → A: Build the 404 and maintenance (503) pages; skip the
  500 page (it can never be shown on the current static host).
- Q: On Spanish pages, should the navigation labels be translated, or stay in English as they are
  today? → A: Translate them: "Inicio", "Ahora", "Contacto", "Blog", "Fotos".
- Q: Should the new header stay pinned to the top of the screen while scrolling, as it does
  today? → A: Yes, keep it pinned on all screen sizes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A consistent new look, in light or dark, on every page (Priority: P1)

A visitor lands on any page and sees the new visual identity: warm neutral backgrounds, a single
blue accent, a serif for headings and a clean sans for body text, and soft rounded cards. The
header shows the "David Cadavid." wordmark, a central navigation pill that highlights the section
they're in, an `EN / ES` language switch and a light/dark theme toggle. On first visit the site
follows their device's light/dark preference; if they pick a theme, the site remembers it on
every page and on later visits. On a phone, the header collapses to the wordmark, the theme
toggle and a menu button that opens a floating menu card.

**Why this priority**: Every other story depends on the shared tokens, typography, header, footer
and theme. Without this, no page can be restyled consistently.

**Independent Test**: Open any existing page (e.g. Blog) in light and dark, at desktop and
mobile widths; confirm the chrome (header, nav pill with the active item, language switch, theme
toggle, mobile menu, footer) matches the design reference, and that the chosen theme persists
across navigation and reload.

**Acceptance Scenarios**:

1. **Given** a first-time visitor whose device prefers dark mode, **When** they open any page,
   **Then** the page renders in the dark theme with no visible flash of the light theme.
2. **Given** a visitor on any page, **When** they switch the theme, **Then** the page changes
   theme immediately, and every page they open afterwards (including after closing and reopening
   the browser) uses the chosen theme.
3. **Given** a visitor on the Blog list or a blog post, **When** they look at the navigation,
   **Then** "Blog" is shown as the active item; on the Sales, Easter egg and error pages no item
   is active.
4. **Given** a visitor on a Spanish page, **When** they look at the header, **Then** `ES` is shown
   as the current language, every navigation label and all other interface text is in Spanish,
   and choosing `EN` takes them to the English version of the same page.
5. **Given** a translation-pending blog post, **When** a visitor opens it, **Then** the language
   switch is hidden (existing behavior preserved).
6. **Given** a phone-width screen, **When** the visitor opens the menu, **Then** a floating menu
   card shows the navigation rows (active row marked), with the `EN / ES` switch at the bottom.
7. **Given** a visitor who has asked their device to reduce motion, **When** any page loads,
   **Then** no entrance animations play and all content is shown in its final position.

---

### User Story 2 - A Home page that introduces David at a glance (Priority: P2)

A visitor opens Home and immediately sees "Hello — I'm David.", a one-line subline, four role
chips (Systems engineer, Mentor, Public speaker, Voice actor), an "A bit about me" card, and
David's real photo in a blue frame with "Say hello" and "What I'm up to now" buttons. Below, three
cards preview the rest of the site: the latest Now update, the latest blog posts, and a few photos.

**Why this priority**: Home is the first impression for recruiters, collaborators and clients
(Principle I). It is the most visible single page of the restyle.

**Independent Test**: Open Home at desktop and mobile widths in both languages; confirm the hero,
photo, buttons and the three preview cards match the design reference and every link/button goes
to the right place.

**Acceptance Scenarios**:

1. **Given** the Home page, **When** it loads, **Then** the hero text slides in from the left in
   sequence, the photo slides in from the right, and the buttons rise in, as in the design
   reference (unless the visitor prefers reduced motion).
2. **Given** the Home page, **When** the visitor activates "Say hello", **Then** they reach the
   Contact page; **When** they activate "What I'm up to now", **Then** they reach the Now page.
3. **Given** the Now preview card, **When** it renders, **Then** it shows the latest Now update's
   date and a short summary of it, plus a "Read more" link to the Now page.
4. **Given** the "Latest writing" card, **When** it renders, **Then** it lists up to the 3 most
   recent posts in the current language (date, title, link), marks translation-pending posts with
   an "EN only" pill, and has an "All posts" link to the Blog.
5. **Given** the Photos preview card, **When** the page is opened, **Then** it shows up to 3
   photos chosen at random from all albums in the current language (the selection can differ on
   each visit), with no text over them, and clicking one opens it in the photo viewer.
6. **Given** a phone-width screen, **When** Home loads, **Then** everything stacks in one column in
   this order: heading, subline, chips, about card, photo, full-width buttons, then the Now,
   Latest writing and Photos cards.

---

### User Story 3 - Restyled reading pages: Blog, Photos, Now and Contact (Priority: P3)

A visitor browses the Blog list, reads a post, looks through Photos and an album, reads the Now
page and opens Contact — each page uses the new look while keeping everything that works today.

**Why this priority**: These are the core content pages after Home; they already work and mainly
need to adopt the new look.

**Independent Test**: Open each of these pages at desktop and mobile widths in both themes and
both languages; compare with the design reference and repeat the existing behavior checks (Load
More, lightbox navigation and keyboard, Now expand/collapse, contact links).

**Acceptance Scenarios**:

1. **Given** the Blog list, **When** it loads, **Then** the heading shows the number of posts in
   that language, posts appear as rows (date, title, excerpt, optional "Not yet available in
   Spanish" pill) inside one card, and "Load More" still reveals posts in pages of the existing
   size.
2. **Given** a blog post, **When** it loads, **Then** it shows an "All posts" back link, the
   publish date, the title, the body in the new reading styles, and a closing "Back to all posts"
   button.
3. **Given** the Photos page, **When** it loads, **Then** albums appear as cards (cover, title,
   photo count) that lift slightly on hover.
4. **Given** an album, **When** the visitor opens a photo, **Then** the photo viewer opens with the
   new look (dark backdrop, rounded image, blue previous/next buttons, caption, close button) and
   keeps all behavior from feature 003: wrap-around, arrow keys, Escape to close, and no
   previous/next buttons for a single-photo album.
5. **Given** the Now page, **When** it loads, **Then** the latest update is in a card with a date
   chip, and earlier updates are listed under an "Earlier updates" label, each still expanding and
   collapsing independently, with a +/− indicator.
6. **Given** the Contact page, **When** it loads, **Then** the four contact methods appear as rows
   (icon circle, label, handle, arrow) in a card next to the framed contact photo; on a phone the
   photo sits above the text.

---

### User Story 4 - Restyled Sales, empty states and Easter egg (Priority: P4)

A visitor with the Sales password unlocks the catalog and browses items in the new card layout,
where each item shows position dots for its photos. Pages with no content yet show a friendly
illustrated card, and the hidden Easter egg page shows a wobbling egg.

**Why this priority**: These pages are hidden or rarely seen, so they matter less than the public
reading pages, but they must not be left in the old style.

**Independent Test**: Open Sales, try a wrong password, then unlock; browse item photos and open
one; disable JavaScript and reload Sales; view an empty blog and an empty album; open the Easter
egg — compare each with the design reference.

**Acceptance Scenarios**:

1. **Given** the Sales gate, **When** the visitor enters a wrong password, **Then** the "Incorrect
   password." message appears and the input shows the error state; **When** they enter the right
   one, **Then** the catalog unlocks (existing behavior and session memory preserved).
2. **Given** an unlocked catalog item with several photos, **When** the visitor uses its
   previous/next buttons, **Then** the photo changes and the matching position dot is highlighted;
   **Given** an item with one photo, **Then** no buttons or dots are shown.
3. **Given** the catalog, **When** "Load More" is used, **Then** more items appear in pages of the
   existing size.
4. **Given** JavaScript is disabled, **When** the visitor opens Sales, **Then** they see the
   restyled "JavaScript required" message card.
5. **Given** a language with no blog posts, or an album with no photos, **When** the visitor opens
   it, **Then** they see the restyled empty-state card with its animated illustration and the
   existing message.
6. **Given** the Easter egg page, **When** it loads, **Then** it shows a gently wobbling egg,
   "You found the secret page!" and a "Back home" button, in the visitor's language, and it stays
   hidden from navigation and search engines.

---

### User Story 5 - Friendly error and maintenance pages (Priority: P5)

A visitor who follows a broken link sees a friendly, on-brand "page not found" page in both
English and Spanish with a way back home. The site also has a matching "down for maintenance"
page the owner can publish by hand when needed.

**Why this priority**: New pages, not a restyle of existing ones; valuable but not blocking.

**Independent Test**: Visit a URL that doesn't exist and confirm the 404 page matches the design
reference and its buttons work; open the maintenance page directly and confirm the same.

**Acceptance Scenarios**:

1. **Given** a URL that doesn't exist, **When** a visitor opens it, **Then** they see the 404 page:
   the large "404" with the pulsing blue ring as its middle digit, the English message and subline,
   then the Spanish message and subline, a "Go home · Ir al inicio" button and a "Read the blog"
   button.
2. **Given** the maintenance (503) page, **When** it is shown, **Then** it shows only the
   wordmark (no navigation, language switch or theme toggle), the "503" copy and a
   "Reload · Recargar" button, and it works without any other site files.

---

### Edge Cases

- **JavaScript disabled**: pages still render and are readable in a default theme; the phone
  menu still opens and every navigation link works; the theme toggle must not appear to work when
  it can't; Sales shows its no-JS card (existing behavior).
- **Browser storage unavailable** (private mode, blocked storage): the theme still follows the
  device preference and the toggle still works for the current page; it just isn't remembered.
- **Fewer than 3 photos across all albums**: the Home Photos card shows the photos that exist;
  with none, it shows a short empty message instead of blank tiles.
- **Exactly 3 or fewer photos available**: every visit shows the same photos (order may vary);
  "random" only has an effect once there are more photos than tiles.
- **Fewer than 3 posts in a language**: "Latest writing" lists only what exists; with none, it
  shows the blog's existing empty message.
- **Spanish Home** "Latest writing": lists only Spanish posts, so no "EN only" pill appears there.
- **Long titles** in blog rows, cards and the Now history wrap without overlapping dates or icons.
- **Unknown locale on error pages**: the 404 and maintenance pages are served from the site root,
  so they show both languages rather than guessing one.
- **Reduced motion**: all entrance, hover-lift, wobble, pulse and glow animations are off.

## Requirements *(mandatory)*

### Functional Requirements

**Visual system and theme**

- **FR-001**: Every page MUST use the design token set from the design reference (backgrounds,
  surfaces, text, lines, blue accent, danger) and no other colors, per the constitution's design
  token rule. This replaces the previous "Warm Blue and Green" palette.
- **FR-002**: The site MUST offer a light and a dark theme with the token values given in the
  design reference for each.
- **FR-003**: On first visit the theme MUST follow the visitor's device light/dark preference;
  once the visitor picks a theme it MUST persist across pages and visits in that browser.
- **FR-004**: Pages MUST load directly in the correct theme, with no visible flash of the other
  theme.
- **FR-005**: Headings, the wordmark and card titles MUST use the serif typeface, and all other
  text the sans typeface, from the design reference.
- **FR-006**: Typefaces and all other assets MUST be served from the site itself, with no requests
  to third-party services, per the constitution's privacy constraint.
- **FR-007**: Page headings and content blocks MUST play the entrance animations described in the
  design reference, and MUST NOT animate at all when the visitor prefers reduced motion. The same
  applies to hover lifts, the Easter egg wobble, the empty-state glows and the error-page pulse.

**Shared chrome**

- **FR-008**: The desktop header MUST show the wordmark on the left, the navigation pill in the
  centre, and the language switch and theme toggle on the right, matching the design reference.
- **FR-009**: The navigation MUST highlight the item for the current section (Blog for the blog
  list and posts, Photos for albums); pages outside the navigation (Sales, Easter egg, error
  pages) MUST highlight none.
- **FR-010**: The language switch MUST show `EN / ES` with the current language emphasized and
  MUST link to the same page in the other language; it MUST stay hidden when a page sets it to
  hidden (translation-pending posts).
- **FR-011**: Below the site's single breakpoint (768px), the header MUST show the wordmark, the
  theme toggle and a menu button; the menu MUST open as a floating card with one row per
  navigation item (active row marked) and the language switch at the bottom.
- **FR-012**: The header MUST stay pinned to the top of the screen while scrolling, on both
  desktop and phone layouts (existing behavior from feature 002, confirmed in Clarifications). It
  MUST use an opaque background so scrolled content never shows through it, and the open mobile
  menu card MUST stay attached below it.
- **FR-013**: The footer MUST keep its current content (copyright and the localized Gandalf quote)
  in the new style.
- **FR-014**: All interface text, including navigation labels, button labels, card titles, section
  labels and pills, MUST appear in the visitor's language on both English and Spanish pages. The
  wordmark is the only exception. On Spanish pages the navigation reads "Inicio", "Ahora",
  "Contacto", "Blog", "Fotos".

**Home**

- **FR-015**: Home MUST show the hero from the design reference: "Hello — I'm David." heading, the
  subline, the four role chips, the "A bit about me" card (keeping the existing about copy), and
  David's photo (from `design/assets/david.png`) shown uncropped inside the blue frame.
- **FR-016**: Home MUST show a "Say hello" button linking to Contact and a "What I'm up to now"
  button linking to Now.
- **FR-017**: Home MUST show three preview cards: Now (latest update's date, a short summary,
  "Read more" link), Latest writing (up to 3 most recent posts in the current language with date,
  title and link, an "EN only" pill on translation-pending posts, and an "All posts" link), and
  Photos (up to 3 photos picked at random on each visit from all albums in the current language,
  a "See more" link, and a click on a photo opening the photo viewer).
- **FR-018**: The "Welcome to my site" banner and the placeholder profile image on Home MUST be
  removed.

**Content pages**

- **FR-019**: Page titles MUST use the large serif style from the design reference, ending in a
  blue period (e.g. "Blog.", "Photos.").
- **FR-020**: The Blog list MUST show the number of posts in that language and render posts as rows
  inside a single card (date, title, excerpt, optional translation-pending pill), keeping "Load
  More" and the existing page size.
- **FR-021**: A blog post page MUST show a back link to all posts, the publish date, the
  translation-pending pill when applicable, the title, the body in the new reading styles, and a
  closing "Back to all posts" button.
- **FR-022**: The Photos page MUST show albums as cards with cover, title and photo count.
- **FR-023**: An album page MUST show a back link to Photos, the title with the photo count, and the
  photo grid. The photo viewer MUST adopt the new look while keeping all behavior defined by
  feature 003 (previous/next with wrap-around, caption, arrow keys, Escape, no previous/next for a
  single photo).
- **FR-024**: The Now page MUST show the latest update in a card with a date chip, and the earlier
  updates under an "Earlier updates" label as independently expandable rows with a +/− indicator.
- **FR-025**: The Contact page MUST show a heading, an intro line and the four contact methods as
  rows (icon, label, handle, arrow) in a card, beside the existing contact image in a blue 4:5
  frame; on phones the image sits above the text. All four links MUST keep working in both
  languages.

**Sales, empty states and Easter egg**

- **FR-026**: The Sales gate MUST be restyled as in the design reference, with a visible error
  state on the input when the password is wrong, keeping the existing unlock and session
  behavior.
- **FR-027**: Catalog items MUST appear as cards; items with more than one photo MUST show
  previous/next buttons and position dots that follow the current photo; items with one photo
  MUST show neither. "Load More", the existing page size and the photo viewer behavior MUST be
  kept.
- **FR-028**: The no-JavaScript Sales message MUST be restyled as a centred card.
- **FR-029**: The blog and album empty states MUST be restyled as cards with the animated
  illustrations from the design reference, keeping their current messages and status role.
- **FR-030**: The Easter egg page MUST show a wobbling egg, "You found the secret page!" and a
  "Back home" button in the visitor's language, and MUST stay excluded from navigation, the
  sitemap and search indexing.

**Error pages**

- **FR-031**: The site MUST have a 404 page, shown for any URL that doesn't exist, with the code
  numeral (blue pulsing ring as the middle digit), English and Spanish messages, a "Go home · Ir
  al inicio" button and a "Read the blog" button, using the copy in the design reference.
- **FR-032**: The site MUST NOT include a 500 ("something went wrong") page: the current static
  host can never show one. The 500 design (Site Pages section 14) is out of scope until the
  hosting model changes.
- **FR-033**: The site MUST have a standalone maintenance (503) page with only the wordmark (no
  navigation, language switch or theme toggle), its copy from the design reference and a
  "Reload · Recargar" button; it MUST work without any other site files.
- **FR-034**: Error pages MUST be excluded from the sitemap and search indexing.

**Preservation**

- **FR-035**: All existing behavior and content MUST be kept, including: the English/Spanish page
  structure and language switch, blog and sales page sizes, the sales gate and its session
  memory, the photo viewer's keyboard support, translation-pending handling, the Now page's
  expand/collapse, placeholder copy, and exclusion of Sales and Easter egg from navigation and
  indexing.

### Key Entities

- **Theme preference**: the visitor's chosen theme (light or dark), or none (follow the device).
  Kept in the visitor's own browser only; never sent anywhere.
- **Home photo pool**: every photo (image and description) across all albums in a given language;
  the Home Photos card draws its random selection from this pool.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every page and state in scope from the design reference (Home 2a–2e; Site Pages
  1–13 and 15 — section 14, the 500 page, is out of scope per FR-032) matches its artboard at
  desktop (1280px) and mobile (390px) width in both themes, confirmed by side-by-side review with
  the owner.
- **SC-002**: 100% of text and interactive elements meet WCAG AA contrast in both the light and
  dark themes.
- **SC-003**: A chosen theme is still applied after navigating to 5 different pages and after
  closing and reopening the browser; a first-time visitor always sees their device's preferred
  theme, with no visible flash of the other one.
- **SC-004**: 0 regressions in the existing behavior listed in FR-035, verified in both languages.
- **SC-005**: With reduced motion turned on, 0 animations play on any page.
- **SC-006**: Opening any nonexistent URL shows the 404 page, and its "Go home" button reaches Home
  in one click.
- **SC-007**: 0 English interface strings appear on Spanish pages (outside the wordmark and the
  intentionally bilingual error pages).
- **SC-008**: Loading any page makes 0 requests to third-party services.
- **SC-009**: A visitor can reach Contact, Now, Blog and Photos from Home in one click each.

## Assumptions

- **Supersedes earlier layout decisions.** This feature replaces these earlier requirements with
  the design reference: 002's header layout (nav left, language right) and its two-column Blog
  grid; 002's contact icon-button row; 003's 5–10px header padding (FR-017/FR-018); and the
  styling (not the behavior) of 003's photo viewer and Now page. All behavior requirements from
  001–003 stay in force (FR-035).
- **Spanish copy for new interface text** (subline, chips, card titles, buttons, labels, pills,
  nav labels, Easter egg text) is written during implementation, as the design reference only
  shows English; the owner reviews it before publishing. The error pages' Spanish copy comes from
  the design reference.
- **Navigation labels are localized** on Spanish pages as "Inicio", "Ahora", "Contacto", "Blog"
  and "Fotos" (confirmed in Clarifications). Earlier features kept English labels on Spanish
  pages; FR-014 replaces that convention.
- **Error pages on GitHub Pages**: GitHub Pages shows a custom 404 page automatically, but it
  never produces 500 or 503 responses. The maintenance page is built so the owner can publish it
  by hand; the 500 page is not built (FR-032).
- **Fonts** (Young Serif and Onest) are free, openly licensed fonts, so they can be served from
  the site itself (FR-006) instead of loading them from Google's servers, which would share
  visitor data with a third party.
- **Home photo randomness** happens in the visitor's browser on each visit; without JavaScript
  the card shows a fixed selection.
- **The Home "Now" summary** is a short excerpt of the latest Now update in the current language.
- **The Contact image** stays the existing placeholder contact image, now in the blue 4:5 frame;
  only Home uses David's real photo.
- **Blog posts gain a visible publish date** (FR-021), which also closes an existing gap against
  the constitution's requirement that every article shows its publish date.
- **Hard-coded colors** flagged by the constitution v1.2.0 amendment (blog/album empty-state
  illustrations and the sales error color) are removed as part of FR-001 and FR-029.
- The site keeps its single 768px breakpoint and its static, no-server hosting model.
