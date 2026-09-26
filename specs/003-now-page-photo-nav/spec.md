# Feature Specification: Now Page & Photo Navigation Polish

**Feature Branch**: `003-now-page-photo-nav`

**Created**: 2026-09-22

**Status**: Draft

**Input**: User description: "1. The navbar needs padding to the top and the bottom (try with 10px for each and if it is too big reduce it to at minimum 5px for each (This applies for mobile and desktop)
2. I wish to create a Now page. I want it to have an acordeon and layout similar to the one here: https://www.salomonmuriel.com/en/now/
3. Let's change the number of blog items loaded to 6
4. When clicking a photo, be it in the sales page or in the photos page, if a product (or album) has multiple photos, I want to be able to change the picture with arrows similar to how it is currently done for the product pictures in the page, without having to click outside the picture, select another one and opening it again in full size
5. The alt text of the photos should be shown just below the picture (aligned with the arrows)
6. If there is only one picture for a product or an album, the arrows are not shown"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse every photo of an album or product without leaving the enlarged view (Priority: P1)

A visitor opens a photo from the Photos page (or a product photo from the Sales page) into its enlarged, full-size view. If that album or product has more than one photo, the visitor can step forward and backward through all of that album's/product's photos directly from the enlarged view — using on-screen controls — without ever closing the enlarged view, picking a different thumbnail, and reopening it.

**Why this priority**: This is the most-used, highest-friction interaction on the site today. The current experience (close, choose a different thumbnail, reopen) makes browsing a multi-photo album or product tedious. It affects both public content (Photos) and the gated commercial content (Sales), making it the single highest-value fix.

**Independent Test**: Open a multi-photo album on the Photos page (or a multi-photo product on the Sales page, once unlocked) into its enlarged view; confirm the visitor can reach every photo in that set using only controls inside the enlarged view, and that each photo's descriptive text is shown below it, aligned with those controls.

**Acceptance Scenarios**:

1. **Given** an album/product with 3 photos, **When** a visitor opens the first photo in the enlarged view, **Then** next/previous controls are visible in the enlarged view.
2. **Given** the enlarged view is open on photo 1 of 3, **When** the visitor activates "next", **Then** photo 2 is shown in the same enlarged view (it does not close), and the descriptive text shown below the image updates to match photo 2.
3. **Given** the enlarged view is open on the last photo of a set, **When** the visitor activates "next", **Then** the view wraps around to the first photo (and "previous" from the first photo wraps to the last).
4. **Given** an album/product with only 1 photo, **When** a visitor opens it in the enlarged view, **Then** no next/previous controls are shown.
5. **Given** the enlarged view is open, **When** the visitor presses the left or right arrow key, **Then** the view steps to the previous or next photo respectively (when more than one photo exists).

---

### User Story 2 - Read a "Now" page describing what the site owner is currently focused on (Priority: P2)

A visitor navigates to a new "Now" page from the site's primary navigation. They immediately see the owner's most recent status update. Below it, earlier updates are listed collapsed, each labeled by date; the visitor can expand any prior update to read it, and collapse it again, without leaving the page.

**Why this priority**: This is wholly new content that extends the site's professional-representation goal, but it is additive rather than fixing an existing broken flow, so it ranks below the photo-navigation fix.

**Independent Test**: Navigate to the Now page; confirm the latest update is visible immediately, prior updates are present but collapsed, and expanding/collapsing a prior update works without a page reload.

**Acceptance Scenarios**:

1. **Given** the Now page has a latest update and two prior updates, **When** a visitor opens the page, **Then** the latest update is fully visible and the two prior updates appear collapsed, each showing only its date/label.
2. **Given** a prior update is collapsed, **When** the visitor clicks/taps it, **Then** it expands in place to show its full content.
3. **Given** a prior update is expanded, **When** the visitor clicks/taps it again, **Then** it collapses again.
4. **Given** the visitor is using a screen reader or keyboard only, **When** they reach a prior update's control, **Then** they can expand/collapse it without a mouse.
5. **Given** the site's bilingual requirement, **When** a Spanish-language visitor opens the Now page, **Then** the same latest-update-plus-collapsible-history layout is available in Spanish.
6. **Given** the primary navigation shown on every page, **When** a visitor looks at it, **Then** a link to the Now page is present alongside the existing Home, Contact, Blog, and Photos links.

---

### User Story 3 - See more blog posts before needing to load more (Priority: P3)

A visitor on the Blog page sees 6 posts initially (instead of the previous 5) before needing to use "Load More".

**Why this priority**: A small content-density tweak with low risk and low effort relative to the other items.

**Independent Test**: With 7 or more blog posts published, load the Blog page and count the posts visible before any "Load More" interaction.

**Acceptance Scenarios**:

1. **Given** 8 published posts in a language, **When** a visitor opens the Blog page in that language, **Then** exactly 6 posts are visible and a "Load More" control is present.
2. **Given** 5 or fewer published posts in a language, **When** a visitor opens the Blog page in that language, **Then** all of them are visible and no "Load More" control is shown.

---

### User Story 4 - Comfortable spacing around the navigation bar (Priority: P4)

A visitor looking at the header sees the navigation content (links, hamburger icon, logo area) with visible breathing room above and below it, rather than sitting flush against the top/bottom edge of the header bar — on both mobile and desktop.

**Why this priority**: Pure visual polish with no functional impact; lowest priority.

**Independent Test**: Load any page at both a mobile and a desktop viewport width and visually confirm the header's content is not touching the header bar's top or bottom edge.

**Acceptance Scenarios**:

1. **Given** a desktop viewport, **When** a visitor views the header, **Then** there is visible vertical space between the nav content and both the top and bottom edges of the header bar.
2. **Given** a mobile viewport, **When** a visitor views the header (hamburger icon visible), **Then** there is visible vertical space between the icon and both the top and bottom edges of the header bar, matching the desktop treatment.

---

### Edge Cases

- What happens when a photo in the enlarged view has no alt/caption text? The caption area below the image is simply empty/absent for that photo — no broken layout or placeholder error text.
- What happens on the Now page when there are no prior updates yet (only the latest one exists)? The page shows just the latest update; the collapsible history area is omitted rather than shown empty.
- What happens if a visitor rapidly steps through photos in the enlarged view? Each step immediately shows the corresponding photo and caption; no stacking of duplicate viewers.
- What happens to the sticky header's total height once vertical padding is added? The header remains sticky and functional; page content below it does not become hidden behind the taller header.

## Requirements *(mandatory)*

### Functional Requirements

**Photo/product enlarged-view navigation (Photos and Sales pages)**

- **FR-001**: When a visitor opens a photo (Photos page) or product photo (Sales page) in its enlarged, full-size view, and the containing album/product has more than one photo, the system MUST show next/previous controls within the enlarged view itself.
- **FR-002**: Activating next/previous in the enlarged view MUST immediately display the adjacent photo in the same enlarged view, without closing it.
- **FR-003**: Next/previous navigation MUST wrap around (from the last photo to the first, and from the first photo to the last).
- **FR-004**: When an album/product has exactly one photo, the enlarged view MUST NOT display next/previous controls.
- **FR-005**: The enlarged view MUST display the current photo's descriptive (alt) text directly below the photo, horizontally aligned with the next/previous controls.
- **FR-006**: The descriptive text shown MUST always match the photo currently displayed, updating immediately when the visitor navigates to a different photo.
- **FR-007**: Visitors MUST also be able to navigate to the adjacent photo in the enlarged view using the left/right arrow keys, consistent with the site's accessibility-by-default expectations.
- **FR-008**: This behavior MUST apply consistently on both the Photos page and the (password-gated) Sales page.

**Now page**

- **FR-009**: The system MUST provide a new "Now" page reachable from the site's primary navigation, alongside the existing Home, Contact, Blog, and Photos links.
- **FR-010**: The Now page MUST display the site owner's latest status update as immediately visible, primary content.
- **FR-011**: The Now page MUST list prior status updates below the latest one, each collapsed by default and identified by its date/label.
- **FR-012**: Visitors MUST be able to expand any prior update to read its full content, and collapse it again, independently of the other prior updates, without a page reload.
- **FR-013**: The Now page MUST be available in both English and Spanish, per the site's bilingual-parity principle.
- **FR-014**: The Now page's latest update and prior updates MUST use the site's existing placeholder-content convention, so the owner can replace them with real content later.
- **FR-015**: The Now page MUST NOT be excluded from navigation or search-engine indexing (unlike the Sales and Easter Egg pages) — it is ordinary public content.

**Blog page size**

- **FR-016**: The Blog page MUST display 6 posts per language before requiring "Load More" interaction, replacing the previous count of 5.

**Navbar spacing**

- **FR-017**: The header MUST provide visible vertical spacing between its content (nav links/hamburger icon) and the top/bottom edges of the header bar, on both mobile and desktop layouts.
- **FR-018**: The header's vertical spacing MUST be no less than 5px above and 5px below the content at any breakpoint.

### Key Entities

- **Now Update**: A single dated status entry on the Now page — a date/label, a title or short heading, and body content. Exactly one Now Update is the "latest" (shown expanded); all others are "prior" (shown collapsed until expanded by the visitor). Content is placeholder text until the owner supplies real updates.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can view every photo in a multi-photo album or product from the enlarged view using only controls inside that view — 0 close/reopen actions required.
- **SC-002**: 100% of single-photo albums/products show zero navigation controls in their enlarged view.
- **SC-003**: The caption shown below an enlarged photo matches the photo on screen in 100% of navigation steps (including wraparound).
- **SC-004**: A first-time visitor can locate and open the Now page from the main navigation in one click/tap from any page.
- **SC-005**: A visitor can read the owner's latest update immediately upon opening the Now page, and can reveal any prior update within one click/tap, without the page reloading.
- **SC-006**: The Blog page shows 6 posts per language before "Load More" is needed, verified with 7+ published posts.
- **SC-007**: On both mobile and desktop viewports, the header's nav content is visually separated (not flush) from the header bar's top and bottom edges.

## Assumptions

- The Now page is inserted into the primary navigation immediately after "Home" (order: Home, Now, Contact, Blog, Photos), since it is a personal-status page most naturally grouped with the site owner's identity content.
- The Now page's accordion allows any number of prior updates to be expanded at the same time (independent toggles), matching common accordion/FAQ conventions rather than a single-open-at-a-time behavior.
- "Now Update" entries are authored content the owner adds over time (mirroring the reference site's dated-entry pattern); this feature defines the page's structure and behavior, not a content-authoring workflow beyond the site's existing placeholder-content convention.
- The 10px navbar padding described in the input is a starting point, not a fixed requirement; the bounding requirement is "visible spacing, never less than 5px," which allows the implementer to land anywhere between 5px and 10px based on how the header looks once built.
- "Product pictures in the page" in item 4 of the input refers to the existing prev/next thumbnail-carousel controls already present on the Sales page for switching between a product's photos before enlarging one — this feature brings equivalent next/previous behavior into the enlarged view itself (and extends it to the Photos page), it does not change the existing thumbnail-level carousel.
- Changing the blog page size to 6 does not change the Sales page's items-per-load count, which the input did not mention.
