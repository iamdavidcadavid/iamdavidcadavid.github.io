# Feature Specification: UI Refinements

**Feature Branch**: `005-ui-refinements`

**Created**: 2026-09-24

**Status**: Draft

**Input**: User description: "1. Place the copyright text below the quote in the footer
2. Change "I’m" to "I am" in the home page
3. Let's not make the photos clickable in the home page
4. For the photo carousels (in sales, in photos, and in all other sections were we are using it since I assume it is the same component) let's not display the alt text and let's move the arrows to be vertically centered
5. Change the linkedin link to iamdavidcadavid instead of cadaviddavid
6. Let's make the theme selector toggleable, meaning if it is "dark" and I click in the moon it changes to the light theme and viceversa"

## Clarifications

### Session 2026-09-24

- Q: Should item 4 also change the small photo carousel inside each Sales product card, or only
  the enlarged photo viewer? → A: Both. The card carousel gets its arrows on the photo's sides,
  vertically centred, and its position dots are removed.
- Q: Should the "I’m" on the Now page also change to "I am"? → A: Yes. The English Now page's
  latest-update title becomes "[PLACEHOLDER] What I am up to now".

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cleaner photo viewing (Priority: P1)

A visitor opens a photo from an album (Photos) or a product (Sales) in the enlarged photo viewer.
The photo is shown on its own, with no description text underneath, and the previous/next arrows
sit on either side of the photo at its vertical middle, so the eye stays on the image.

**Why this priority**: It changes the photo viewer, which appears on two pages (Photos and Sales)
and is the most visible of these refinements.

**Independent Test**: Open a multi-photo album and a multi-photo Sales item in the enlarged
viewer. Confirm no description text is visible, the arrows sit at the photo's left and right
edges at its vertical middle, and previous/next, wrap-around, arrow keys and Escape still work.

**Acceptance Scenarios**:

1. **Given** a multi-photo album, **When** a visitor opens a photo in the enlarged viewer,
   **Then** no description (alt) text is shown on screen, and the previous and next arrows are
   positioned at the left and right of the photo, vertically centred on it.
2. **Given** the enlarged viewer is open, **When** the visitor uses the arrows or the left/right
   arrow keys, **Then** the photo changes exactly as it does today (including wrap-around), and
   the arrows stay vertically centred on the new photo, even if it has a different height.
3. **Given** a single-photo album or item, **When** it is opened in the enlarged viewer,
   **Then** no arrows are shown (unchanged from today).
4. **Given** a visitor using a screen reader, **When** the enlarged viewer shows a photo,
   **Then** the photo's description is still available to assistive technology even though it is
   no longer displayed as visible text.
5. **Given** a Sales product card with several photos, **When** a visitor looks at it, **Then**
   the previous and next arrows sit on the left and right of the card photo, vertically centred
   on it, and there are no position dots. The arrows still change the card photo (with
   wrap-around), and clicking the photo still opens the enlarged viewer on that photo.
6. **Given** a Sales product card with one photo, **When** a visitor looks at it, **Then** no
   arrows are shown (unchanged).

---

### User Story 2 - A calmer Home page (Priority: P2)

A visitor on Home reads "Hello — I am David." and "What I am up to now" instead of the contracted
forms, and sees the photos in the Photos card as a simple preview that doesn't react to clicks.
They use "See more" to reach the albums.

**Why this priority**: Wording and interaction tweaks on the highest-traffic page. They're small,
but they're what visitors see first.

**Independent Test**: Load the English Home page. Confirm the heading and the button use "I am",
and clicking or tapping any photo in the Photos card does nothing (no viewer opens, no pointer or
zoom cursor), while "See more" still goes to Photos.

**Acceptance Scenarios**:

1. **Given** the English Home page, **When** it loads, **Then** the heading reads
   "Hello — I am David." and the button reads "What I am up to now".
2. **Given** the Spanish Home page, **When** it loads, **Then** its text is unchanged ("Hola, soy
   David.", "En qué ando ahora"), since Spanish has no equivalent contraction.
3. **Given** the Photos card on Home, **When** a visitor clicks, taps or presses Enter on a photo,
   **Then** nothing happens, and the photos are not reachable as controls with the keyboard.
4. **Given** the Photos card on Home, **When** a visitor hovers a photo, **Then** it shows no
   clickable affordance (no pointer or zoom cursor, no hover zoom).
5. **Given** the Photos card, **When** the visitor chooses "See more", **Then** they reach the
   Photos page (unchanged).
6. **Given** the English Now page, **When** it loads, **Then** the latest update's title reads
   "[PLACEHOLDER] What I am up to now".

---

### User Story 3 - A theme switch that simply flips (Priority: P3)

A visitor clicks the theme switch in the header. Whichever icon they click, the site flips to the
other theme: dark goes to light and light goes to dark.

**Why this priority**: Today, clicking the icon of the theme already showing does nothing, which
feels broken. Fixing it is a small, self-contained change.

**Independent Test**: In dark mode, click the moon and confirm the site turns light. Click it
again (or the sun) and confirm it turns dark. The choice is still remembered across pages.

**Acceptance Scenarios**:

1. **Given** the dark theme is showing, **When** the visitor clicks the moon, **Then** the site
   switches to the light theme.
2. **Given** the light theme is showing, **When** the visitor clicks the sun, **Then** the site
   switches to the dark theme.
3. **Given** either theme is showing, **When** the visitor clicks the other icon, **Then** the
   site switches to that other theme (same as today).
4. **Given** a keyboard or screen-reader user, **When** they reach the theme switch, **Then** it
   is announced as one control with its current state, and Enter or Space flips the theme.
5. **Given** the visitor flipped the theme, **When** they open another page or come back later,
   **Then** the chosen theme is still applied (existing behavior from feature 004).

---

### User Story 4 - Footer order and correct LinkedIn profile (Priority: P4)

A visitor sees the Gandalf quote first in the footer, with the copyright line below it. On
Contact, the LinkedIn row points to the right profile.

**Why this priority**: Two small corrections. The LinkedIn fix matters for contact (Principle V)
but is a one-value change.

**Independent Test**: On any page, confirm the footer shows the quote above the copyright line.
On Contact (both languages), confirm the LinkedIn row shows "iamdavidcadavid" and opens
`linkedin.com/in/iamdavidcadavid`.

**Acceptance Scenarios**:

1. **Given** any page in either language, **When** a visitor looks at the footer, **Then** the
   quote appears first and the copyright line appears below it.
2. **Given** the Contact page in either language, **When** a visitor looks at the LinkedIn row,
   **Then** the handle reads "iamdavidcadavid" and the link opens
   `https://www.linkedin.com/in/iamdavidcadavid`.

---

### Edge Cases

- **Photos of different heights in the viewer**: the arrows stay vertically centred on whichever
  photo is showing.
- **Narrow screens**: arrows centred beside a wide photo must not push the photo off screen or
  overlap the close button. The photo may shrink to make room, or the arrows may sit over the
  photo's edges, as long as both arrows stay fully visible and tappable.
- **Home Photos card with no photos**: unchanged (shows the empty message).
- **Theme switch without JavaScript**: unchanged (the switch is not shown; the site follows the
  device preference).
- **Browser storage blocked**: flipping still works for the current page and just isn't
  remembered (unchanged).

## Requirements *(mandatory)*

### Functional Requirements

**Photo viewer (Photos and Sales)**

- **FR-001**: The enlarged photo viewer MUST NOT display the photo's description (alt) text as
  visible text. This replaces feature 003's requirement to show it as a caption.
- **FR-002**: The photo's description MUST remain available to assistive technology (as the
  image's text alternative), per the constitution's accessibility principle.
- **FR-003**: In the enlarged viewer, the previous and next arrows MUST be placed at the left and
  right of the photo, vertically centred on it, and stay centred as photos of different sizes are
  shown.
- **FR-004**: All other viewer behavior MUST be kept: wrap-around, left/right arrow keys, Escape
  and backdrop to close, and no arrows for a single photo.
- **FR-005**: FR-001 to FR-004 MUST apply identically to the album viewer (Photos) and the Sales
  viewer.
- **FR-005a**: In each Sales product card with more than one photo, the previous and next arrows
  MUST sit on the left and right of the card photo, vertically centred on it, and the position
  dots MUST be removed. The card must keep a way to tell which photo is showing for assistive
  technology (for example, an accessible label on the photo such as "Photo 2 of 3"). Arrow
  behavior (wrap-around) and opening the enlarged viewer by clicking the photo are unchanged;
  single-photo cards still show no arrows.

**Home**

- **FR-006**: On the English Home and Now pages, "I’m" MUST read "I am" everywhere it appears:
  the Home heading ("Hello — I am David."), the Home button ("What I am up to now") and the Now
  page's latest-update title ("[PLACEHOLDER] What I am up to now"). Spanish text is unchanged.
- **FR-007**: The photos in the Home Photos card MUST NOT be interactive: no photo viewer opens,
  they are not keyboard-focusable controls, and they show no clickable hover affordance. They
  still show a random selection on each visit (feature 004 behavior) and keep their descriptions
  for assistive technology.
- **FR-008**: The Home Photos card's "See more" link MUST keep working.

**Theme switch**

- **FR-009**: Activating the theme switch MUST always flip to the other theme, whichever icon is
  activated: dark → light, light → dark.
- **FR-010**: The theme switch MUST be exposed to assistive technology as a single control that
  conveys the current theme, and MUST be operable with Enter and Space.
- **FR-011**: The existing theme behavior MUST be kept: the choice is remembered, the first visit
  follows the device, the correct theme applies from first paint, and the switch is hidden
  without JavaScript.

**Footer and contact**

- **FR-012**: The footer MUST show the quote first and the copyright line below it, on every page
  and in both languages.
- **FR-013**: The LinkedIn contact link MUST use the handle `iamdavidcadavid`: displayed as
  "iamdavidcadavid" and linking to `https://www.linkedin.com/in/iamdavidcadavid`, in both
  languages.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 0 photo descriptions are visible as text in the enlarged viewer on Photos and Sales,
  while 100% of viewer photos keep a text alternative for screen readers.
- **SC-002**: In the enlarged viewer and on every multi-photo Sales card, the arrows' vertical
  centre lines up with the photo's vertical centre (within a few pixels) for every photo in the
  seeded albums and Sales items, and Sales cards show 0 position dots.
- **SC-003**: 0 photo viewers open from the Home page, and the Home Photos card adds 0 photo stops
  to keyboard tab order.
- **SC-004**: One click or tap on the theme switch flips the theme 100% of the time, from either
  theme and on either icon.
- **SC-005**: The footer shows the quote above the copyright line on 100% of pages, in both
  languages.
- **SC-006**: The LinkedIn link on Contact opens the `iamdavidcadavid` profile in both languages.
- **SC-007**: 0 regressions in the viewer (wrap-around, keyboard, Escape), theme memory, the Home
  random photos, and the rest of the Contact links.

## Assumptions

- **"Carousels" in item 4 means the enlarged photo viewer and the Sales product-card carousel**
  (confirmed in Clarifications). The viewer exists on the Photos album pages and the Sales page;
  the album viewer and the Sales viewer are currently two separate implementations, and both get
  the same change (FR-005). The Sales card carousel gets side arrows and loses its dots
  (FR-005a). The Home Photos card will no longer open a viewer (item 3), so it isn't affected.
- **Item 2 covers every "I’m" on Home and on the Now page** (confirmed in Clarifications): the
  Home heading, the "What I’m up to now" button and the Now page's latest-update title.
- **The theme switch keeps its two-icon look** (sun and moon) but behaves as one toggle: a click
  anywhere on it flips the theme.
- **Supersedes earlier decisions**: feature 003's visible caption (FR-005/FR-006) and "caption
  aligned with the arrows" layout; feature 004's Home photo tiles opening the viewer (FR-017),
  its Sales card position dots (FR-027), and its two-button theme toggle with "pressed" states.
- The LinkedIn handle change is a correction supplied by the owner.
