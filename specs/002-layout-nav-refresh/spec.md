# Feature Specification: Layout, Navigation & Content Restructuring

**Feature Branch**: `002-layout-nav-refresh`

**Created**: 2026-09-22

**Status**: Draft

**Input**: User description: "1. The nav bar should be aligned to the left but inside the container with the content 2. The language button should also be inside the container with the content but aligned to the right 3. The Navbar should remain visible always on top when scrolling 4. The email button should show in the same style as the LinkedIn, github and youtube buttons and show an icon of a letter (the standard email icon) instead of text 5. The Github and youtube icons in the buttons should show the proper icon for those sites 6. The footer should show a quote saying 'All we have to decide is what to do with the time that is given us' - Gandalf. It should be placed below the existing copyright text 7. The home and about sections should be merged into one as just the Home 8. The contact section should be its own page and it should have an image as well 9. The blog grid should have two columns. The elements should have the same width and the same height (The largest height of both items in a row) 10. The hamburguer menu shown in mobile should be aligned to the left"

**Relationship to prior work**: This feature revises behavior already delivered under
[001-content-website](../001-content-website/spec.md). Where a requirement here supersedes a
specific FR from that spec, it is noted inline for traceability; 001's spec file itself is left
untouched as the historical record of that increment.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consistent, always-visible site header (Priority: P1)

A visitor on any page sees the navigation (or, on mobile, the hamburger control) aligned to the
left and the language switch aligned to the right, both sitting inside the same content-width
column as the rest of the page — and the header stays visible at the top of the screen no
matter how far they scroll, so navigation and language switching are always one click away.

**Why this priority**: This touches every single page and is a foundational, always-on piece of
chrome — it has the widest blast radius of any change in this batch and nothing else in this
feature depends on it being done last.

**Independent Test**: Load any page, resize across 375px/768px/1440px, and scroll down — verify
the header's contents stay aligned within the content column (nav/hamburger left, language
right) and the header itself never scrolls out of view.

**Acceptance Scenarios**:

1. **Given** a visitor on a desktop-width page, **When** the header renders, **Then** the full
   navigation bar sits at the left edge of the same content-width container the page body uses
   (not the full browser width), and the language-switch control sits at that container's right
   edge.
2. **Given** a visitor on a mobile-width page, **When** the header renders, **Then** the
   hamburger control sits at the left edge of that content-width container (not the right), and
   the language-switch control still sits at the right edge.
3. **Given** a visitor on any page, **When** they scroll down past where the header would
   normally be, **Then** the header remains visible, pinned to the top of the viewport.
4. **Given** a visitor on a mobile-width page, **When** they tap the hamburger control, **Then**
   the navigation links open as before (only the control's own position has moved).

---

### User Story 2 - A leaner Home page and a dedicated Contact page (Priority: P2)

A visitor on the Home page sees one continuous introduction to David Cadavid — with no separate
"About" heading or nav entry — and finds Contact as its own page with a dedicated URL, showing
an image alongside the existing contact information.

**Why this priority**: A meaningful information-architecture change that affects the nav
structure and two pages, but it's independent of the header styling work in US1 and can be
verified on its own.

**Independent Test**: Load `/` and confirm there is no separate "About" heading/anchor and the
introductory content simply reads as part of Home; load `/contact/` directly and confirm it
renders standalone with its own URL, the existing contact content, and an image.

**Acceptance Scenarios**:

1. **Given** a visitor opens the Home page, **When** it renders, **Then** the introductory
   biography content (previously under a separate "About" heading) appears as part of the Home
   page's own content, with no distinct "About" section heading.
2. **Given** a visitor looks at the site navigation, **When** they read the menu, **Then** it
   lists exactly Home, Contact, Blog, and Photos — "About" does not appear as its own entry.
   *(Supersedes 001-content-website's FR-002 and FR-018.)*
3. **Given** a visitor selects "Contact" in the navigation, **When** the page loads, **Then**
   they land on Contact's own dedicated URL (not an anchor/scroll position on Home), showing the
   existing friendly intro paragraph, the LinkedIn/GitHub/YouTube/email links, and an image.
   *(Supersedes 001-content-website's FR-007/FR-015 through FR-017's placement on Home.)*
4. **Given** a visitor navigates directly to the Contact page's URL, **When** it loads, **Then**
   all contact content and the image are present without requiring a visit to Home first.

---

### User Story 3 - Recognizable contact icons (Priority: P3)

A visitor looking at the Contact page's icon row can tell at a glance which icon leads to
LinkedIn, GitHub, YouTube, or email, because each one shows that platform's own recognizable
mark instead of a generic placeholder or plain text.

**Why this priority**: A visual-polish change confined to the contact icons; it depends on User
Story 2 only in the sense that it's easiest to verify once Contact has its own page, but the
icons themselves are a self-contained, independently testable change.

**Independent Test**: Load the Contact page and visually confirm all four icon-buttons share the
same style, with GitHub and YouTube showing their platforms' own marks and email showing a
standard envelope icon instead of the word "email".

**Acceptance Scenarios**:

1. **Given** a visitor views the Contact page, **When** they look at the email action, **Then**
   it is styled identically to the LinkedIn/GitHub/YouTube icon-buttons and shows a standard
   envelope/mail icon rather than the literal text "email". *(Supersedes
   001-content-website's FR-017's literal "email" text label.)*
2. **Given** a visitor views the Contact page, **When** they look at the GitHub and YouTube
   icon-buttons, **Then** each shows that platform's own recognizable icon rather than a generic
   placeholder mark.

---

### User Story 4 - A personal touch in the footer (Priority: P4)

A visitor who scrolls to the footer of any page sees, below the existing copyright line, a short
attributed quote that adds a bit of personality to the site.

**Why this priority**: Small, low-risk, purely additive content change with no dependencies on
anything else in this batch.

**Independent Test**: Load any page, scroll to the footer, and confirm both the copyright line
and the quote (with attribution) are present, quote below copyright.

**Acceptance Scenarios**:

1. **Given** a visitor on any page, **When** they view the footer, **Then** they see the
   existing copyright line followed by the quote "All we have to decide is what to do with the
   time that is given us" attributed to Gandalf.

---

### User Story 5 - A tidier two-column Blog grid (Priority: P5)

A visitor browsing the Blog page sees posts arranged in two even columns, where every pair of
posts in the same row match each other's width and height, instead of a single stacked column.

**Why this priority**: Purely visual change scoped to one page (the Blog list); independent of
every other story in this batch.

**Independent Test**: Load the Blog page with several posts and confirm they render in a
two-column grid where each row's two items share identical width and height (sized to the
taller of the two).

**Acceptance Scenarios**:

1. **Given** the Blog page has multiple posts, **When** it renders, **Then** the posts appear in
   a two-column grid rather than a single stacked list.
2. **Given** two posts sit in the same row of the grid, **When** one post's content is taller
   than the other's, **Then** both posts in that row render at the same width and at the height
   of the taller one.
3. **Given** the "Load More" control is used, **When** additional posts appear, **Then** they
   continue to fill the two-column grid the same way.

---

### Edge Cases

- When the Blog page has an odd number of visible posts, the final row's single post occupies
  one grid cell (the first column) rather than stretching across both columns.
- The sticky header must not permanently obscure page content on short viewports — content
  immediately below the header should not be hidden behind it after it becomes fixed in place.
- The sticky header applies on every page, including the hidden Sales and Easter Egg pages
  (which still share the same header per 001-content-website's FR-001).
- Opening the mobile hamburger menu still reveals the same dropdown of links as before; moving
  the hamburger control's own position (User Story 1) does not change where the opened menu
  itself appears.
- A visitor who bookmarked the old `#contact` anchor on the Home page will no longer land on
  meaningful content there once Contact becomes its own page; no redirect behavior is specified
  here (see Assumptions).

## Requirements *(mandatory)*

### Functional Requirements

**Site-wide header**

- **FR-001**: On every page, the navigation (full bar on wider viewports, hamburger control on
  narrower ones) and the language-switch control MUST render inside the same content-width
  container the rest of the page's content uses, not spanning the full browser width edge to
  edge.
- **FR-002**: Within that container, the navigation (or hamburger control) MUST be aligned to
  the left edge, and the language-switch control MUST be aligned to the right edge, at every
  viewport width.
- **FR-003**: The header MUST remain visible, pinned to the top of the viewport, while a visitor
  scrolls down any page.
- **FR-004**: On viewport widths below 768px, the hamburger control MUST appear at the left edge
  of the header rather than the right edge.

**Home & Contact restructuring**

- **FR-005**: The Home page's introductory/biography content MUST be presented as part of the
  Home page's own content, with no separate "About" section heading.
- **FR-006**: The site navigation MUST list exactly four entries — Home, Contact, Blog, and
  Photos — with no separate "About" entry.
- **FR-007**: Contact MUST be implemented as its own dedicated page, with its own URL, reachable
  via its own navigation entry — not as a section/anchor on the Home page.
- **FR-008**: The Contact page MUST display an image alongside its existing text and icon-link
  content.

**Icon-button consistency**

- **FR-009**: The email contact action MUST be styled as an icon-button matching the
  LinkedIn/GitHub/YouTube icon-buttons, displaying a standard envelope/mail icon instead of the
  literal text "email".
- **FR-010**: The GitHub and YouTube icon-buttons MUST display each platform's own recognizable
  icon.

**Footer**

- **FR-011**: The footer MUST display, below the existing copyright line, an attributed quote on
  every page, in the visitor's current language, per constitution Principle II (Bilingual
  Parity): in English, "All we have to decide is what to do with the time that is given us" —
  Gandalf; in Spanish, "Lo único que podemos decidir es qué hacer con el tiempo que se nos ha
  dado" — Gandalf.

**Blog grid**

- **FR-012**: The Blog page's posts MUST be arranged in a two-column grid rather than a single
  stacked column.
- **FR-013**: Within each row of the grid, both posts MUST render at the same width, and both
  MUST render at the same height — matching whichever of the two is taller.

### Key Entities

- No new data entities are introduced by this feature. It restyles/relocates existing content
  (About/Contact copy, social links, blog post list) defined in 001-content-website's data model.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At each of 375px, 768px, and 1440px viewport widths, on every page, the
  navigation/hamburger control and the language-switch control both fall within the page's
  content-width column — nav/hamburger flush to its left edge, language flush to its right.
- **SC-002**: A visitor scrolling to the bottom of any page's content never loses sight of the
  header and can use navigation or switch languages without scrolling back up.
- **SC-003**: A visitor can reach a fully self-contained Contact page — with intro text, all four
  contact icon-buttons, and an image — directly by URL, without first visiting Home.
- **SC-004**: The Home page contains the former About content with no separate "About" heading,
  and the navigation menu shows exactly four entries (Home, Contact, Blog, Photos).
- **SC-005**: A visitor can identify the LinkedIn, GitHub, YouTube, and email actions on the
  Contact page from their icons alone, with GitHub/YouTube showing each platform's own mark and
  email showing a standard mail icon.
- **SC-006**: Every page's footer shows the copyright line followed by the attributed Gandalf
  quote, in that page's own language (English or Spanish).
- **SC-007**: On a two-column-capable viewport, every row of the Blog grid shows two posts of
  identical width and identical height (matching the taller post in that row).

## Assumptions

- The sticky-header requirement (FR-003) applies uniformly across all pages sharing the common
  header, including the hidden Sales and Easter Egg pages, consistent with 001-content-website's
  FR-001 (shared header/footer).
- The Blog grid (FR-012/FR-013) applies at wider viewports; below the site's already-established
  768px breakpoint (see 001-content-website's Clarifications), it collapses to a single column
  for readability, since narrow-viewport behavior wasn't specified here and two fixed columns
  would be cramped on a phone screen.
- An odd final post in the Blog grid occupies a single cell rather than spanning both columns.
- The Contact page's image (FR-008) is a placeholder to be replaced later, consistent with
  001-content-website's placeholder-text convention (its FR-007); whether it reuses the Home
  page's existing placeholder photo or uses a different image is left as a content decision, not
  a structural one.
- "Proper icon" for GitHub and YouTube (FR-010) means each platform's own standard,
  recognizable brand mark, used only to identify the link's destination.
- No redirect is specified for the old `/#contact` anchor now that Contact is its own page; any
  existing bookmark to that anchor will simply land on the (now About-merged) Home page.
- The relative priority of these five user stories (P1–P5) reflects blast radius and
  independence, not an explicit ordering from the request; the site owner may resequence
  implementation without needing a new spec.
- The Spanish rendering of the footer quote (FR-011) is an original, natural translation for
  this site's own use, not a verbatim copy of any specific published translation; the site owner
  may substitute their preferred wording without needing a spec change.

## Amendments

**Amendment (2026-09-22, a)**: `/speckit-analyze` found that FR-011 (footer quote) didn't
address Spanish — `BaseLayout.astro`'s footer had never before carried translatable prose, so an
English-only quote would have silently broken constitution Principle II (Bilingual Parity,
NON-NEGOTIABLE) on every Spanish page. Added the Spanish wording directly to FR-011 and SC-006,
and an Assumption noting it's an original translation, not a reproduction of a specific
published one.
