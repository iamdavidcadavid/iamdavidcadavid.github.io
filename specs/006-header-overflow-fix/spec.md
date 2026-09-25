# Feature Specification: Header Overflow Fix

**Feature Branch**: `006-header-overflow-fix`

**Created**: 2026-09-25

**Status**: Draft

**Input**: User description: "Fix the header horizontal scroll using the media query approach suggested previously"

The approach referred to is: keep the full desktop header (wordmark, navigation pill, language
switch and theme switch in one row), but make it slightly more compact only in the **compact
desktop range**: from 768px wide up to, but not including, 960px. That covers the widths where
the header doesn't fit today (768px to about 890px) plus a safety margin. Wide screens (960px and
up) keep today's look exactly; the phone header is untouched.

## Background (measured on the current site)

From the width where the desktop header starts (768px) up to about 885–890px, the header needs
about 871px (875px in Spanish) of room plus the scrollbar. It doesn't fit, so every page scrolls
sideways by up to about 85px (68px at 770px wide), in both languages. Nothing in the header can
shrink or wrap, and only the phone layout (below 768px) has tighter spacing.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - No sideways scroll on mid-size screens (Priority: P1)

A visitor on a small laptop, a tablet in landscape, a desktop window that isn't full width, or a
large screen zoomed in (for example 1280px at 150% zoom behaves like about 853px) opens any page.
The whole header fits on screen: the name, all navigation links, the language switch and the
theme switch are visible without scrolling sideways, and the page doesn't wobble left and right
when scrolled on a trackpad.

**Why this priority**: A sideways scroll makes the whole site feel broken and can hide part of
the header off screen. It affects every page at these widths, which is the entire scope of this
fix.

**Independent Test**: Set the window to 768, 800, 850, 900 and 959px wide, in English and
Spanish, and on each page confirm there is no horizontal scrollbar and every header item is fully
visible.

**Acceptance Scenarios**:

1. **Given** a window 768px wide, **When** a visitor opens any page in English or Spanish,
   **Then** the page has no horizontal scroll and the name, all five navigation links, the
   language switch and the theme switch are fully visible in one row.
2. **Given** any window width from 768px to 1280px, **When** a visitor opens any page, **Then**
   the header never makes the page wider than the window.
3. **Given** a window in the compact desktop range, **When** a visitor hovers, clicks or tabs
   through the navigation links, **Then** they behave as today (current page highlighted,
   visible focus outline, same destinations), and every link keeps a clickable area of at least
   24 × 24px (FR-005).
4. **Given** a page that hides the language switch (such as the 404 page or a blog post), **When**
   it is shown in the compact desktop range, **Then** it also has no horizontal scroll.

---

### User Story 2 - Wide and phone layouts stay exactly as they are (Priority: P2)

A visitor on a full-size desktop screen (960px and wider) or on a phone (narrower than 768px)
sees the header exactly as today. The fix only changes the compact desktop range.

**Why this priority**: The current wide and phone headers were just designed and approved
(feature 004). The fix must not change them outside the compact desktop range.

**Independent Test**: Compare the header at 1280px, 960px and 390px before and after the change:
positions and sizes of the name, navigation and switches must be the same.

**Acceptance Scenarios**:

1. **Given** a window 1280px wide, **When** a visitor opens any page, **Then** the header's
   spacing, sizes and positions are identical to today.
2. **Given** a window narrower than 768px, **When** a visitor opens any page, **Then** the phone
   header (name, theme switch and ☰ menu) is identical to today.
3. **Given** a window 960px wide or wider, **When** a visitor opens any page, **Then** the
   header is identical to today.

---

### Edge Cases

- **Longer Spanish labels**: the Spanish navigation is slightly wider than the English one
  ("Contacto", "Fotos"); in the compact desktop range the header must fit it with room to spare
  at 768px.
- **Browser zoom**: zooming a large screen in until it behaves like a width in the compact desktop
  range (e.g. 1280px at 150% ≈ 853px) must give the compact spacing, not a sideways scroll.
- **Scrollbar**: on systems with a visible vertical scrollbar, the available width is about 15px
  less than the window; the header must still fit.
- **Page content**: this fix covers the header. If any other part of a page were found to cause a
  sideways scroll at these widths, it is reported, not silently changed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: In the compact desktop range (from 768px wide up to, but not including, 960px: the
  width where today's header already fits, about 890px, plus a safety margin so a slightly longer
  label doesn't bring the overflow back), the full desktop header MUST fit within the window on
  every page, in both languages, with no horizontal scroll caused by the header.
- **FR-002**: In the compact desktop range, the header MUST keep all its items in one row and
  fully visible: the name, all navigation links, the language switch (where shown) and the theme
  switch. No item is hidden, truncated, wrapped onto a second line or moved into the ☰ menu.
- **FR-003**: The header MUST achieve this by reducing only spacing in the compact desktop range
  (the space around the page edges, between the header groups, and inside the navigation links).
  Text sizes, colours, the navigation pill shape and the switches' look stay as today.
- **FR-004**: At 960px and wider, the header MUST be identical to today. Below 768px, the phone
  header MUST be identical to today.
- **FR-005**: Navigation behaviour MUST be unchanged at every width: the current page stays
  highlighted, keyboard focus stays clearly visible and not clipped, and each link's clickable
  area stays at least 24 × 24px (WCAG 2.2 target size).
- **FR-006**: The fix MUST use only the existing design tokens (no new colours) and add no
  motion.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At 768, 800, 850, 900 and 959px wide, 0 pages scroll horizontally, in both languages
  and both themes (every page type: Home, Now, Contact, Blog list and post, Photos and album,
  Sales, 404).
- **SC-002**: At 768px wide with the Spanish labels, the header has at least 16px of free room
  before it would overflow.
- **SC-003**: At 1280px, 960px and 390px, header item positions and sizes differ from today's by
  0px.
- **SC-004**: 0 regressions in navigation: every link reaches the same page, the current page is
  highlighted, and the focus outline is fully visible at every width tested.

## Assumptions

- **"The media query approach suggested previously"** means: a more compact desktop header only
  in the compact desktop range (smaller page-edge margins, smaller link padding and gaps), as
  recommended over switching to the ☰ menu below ~900px. The exact values are a design decision
  for the plan, bounded by FR-003 and SC-002.
- **The site keeps its single 768px layout breakpoint** (phone vs desktop). The 960px threshold
  only adjusts spacing within the desktop layout; it isn't a new layout.
- **The page-edge margin in the compact desktop range** may apply to the whole page (header and
  content) or to the header only; either is acceptable as long as the header and content still
  line up on the same left edge.
- **The header icon is out of scope** (the owner decided not to add it).
