# Feature Specification: Empty States and Polish

**Feature Branch**: `007-empty-states-and-polish`

**Created**: 2026-09-26

**Status**: Draft

**Input**: User description: "Create empty page for: Now, Sales, Photos. Add a button to copy the email to clipboard or how to handle email better? Is the scripts/validate-sales.js file executed as part of the build? if not, let's add that to the build process and if the validation fails, the build fails. Add "Content creator" to the list of roles in the About section, and update the "home.subline" based on that."

## Background (current behaviour)

- **Empty pages**: Blog already shows a friendly empty state (an oven illustration and "Posts are
  still in the oven…"), and an album with no photos shows a camera and "Development in
  process…". Three sections have nothing equivalent:
  - **Now** with no updates shows only the page title, with nothing below.
  - **Photos** with no albums shows the title ("0 albums") above a blank area.
  - **Sales** with an empty catalogue shows, after unlocking, only the page title and a blank
    area.
- **Email**: the Contact page lists the email address as a link that opens the visitor's email
  app. Visitors without an email app configured (common on shared or work computers) get
  nothing useful, and there's no quick way to copy the address.
- **Sales catalogue check**: a separate check for the two Sales catalogue files exists, but it
  only runs when someone remembers to run it by hand. It is **not** part of building or
  publishing the site, so a broken catalogue can go live unnoticed.
- **Roles**: the Home hero shows four role tags (Systems engineer, Mentor, Public speaker, Voice
  actor) and a one-line summary: "I build systems, help people grow, and occasionally lend my
  voice to a story."

## Clarifications

### Session 2026-09-26

- Q: How should the Contact page handle the email address? → A: Keep the email link (opens the
  email app) and add a "Copy" / "Copiar" button next to it.
- Q: What should the new Home summary line say? → A: EN "I build systems, help people grow, create
  content, and occasionally lend my voice to a story." ES "Construyo sistemas, ayudo a las
  personas a crecer, creo contenido y, de vez en cuando, le presto mi voz a una historia."
- Q: Should the build also fail if the English and Spanish Sales catalogues don't list the same
  items (same item IDs)? → A: Yes. Fail the build and name the IDs missing from each catalogue.
- Q: Are the proposed empty-state messages right? → A: Yes, as proposed (Now: "Still figuring out
  what's next…" / "Todavía decidiendo qué sigue…"; Sales: "The shelves are empty for now…" / "Los
  estantes están vacíos por ahora…"; Home Now card: "Nothing new yet." / "Aún no hay
  novedades."; Photos reuses "Development in process…" / "En proceso de revelado…").

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Friendly empty Now, Photos and Sales pages (Priority: P1)

A visitor opens Now, Photos or Sales (after unlocking) at a time when that section has no
content yet. Instead of a blank area, they see a short, friendly message in the same style as the
Blog's empty state, so the site feels intentional rather than broken.

**Why this priority**: The site is about to replace placeholders with real content, and some
sections will start empty. A blank page looks like an error to visitors and recruiters.

**Independent Test**: Temporarily remove all Now updates, all albums and all Sales items (in both
languages), open each page in EN and ES, and confirm each shows its empty-state card and message.
Restore the content and confirm the normal pages return.

**Acceptance Scenarios**:

1. **Given** there are no Now updates in a language, **When** a visitor opens that language's Now
   page, **Then** they see the page title followed by an empty-state card with an
   illustration and the message "Still figuring out what's next…" (ES: "Todavía decidiendo qué
   sigue…").
2. **Given** there are no albums in a language, **When** a visitor opens that language's Photos
   page, **Then** they see the page title (with "0 albums" / "0 álbumes") followed by the same
   camera empty state already used for an empty album: "Development in process…" (ES: "En
   proceso de revelado…").
3. **Given** the Sales catalogue for a language is empty, **When** a visitor unlocks that
   language's Sales page, **Then** they see an empty-state card with an illustration and the
   message "The shelves are empty for now…" (ES: "Los estantes están vacíos por ahora…"), and no
   "Load more" button.
4. **Given** a section has content, **When** a visitor opens it, **Then** it looks exactly as
   today (no empty state).
5. **Given** there are no Now updates in a language, **When** a visitor opens Home in that
   language, **Then** the Home "Now" card shows a short message "Nothing new yet." (ES: "Aún no
   hay novedades.") instead of an empty card, and its button still goes to the Now page.

---

### User Story 2 - An easier way to get the email address (Priority: P2)

A visitor on the Contact page wants to email David. They can still click the address to open
their email app, and they can also copy the address with one click and paste it wherever they
write email (for example a web mail tab). They get clear confirmation that it was copied.

**Why this priority**: Contact is the site's main goal (Principle V). Email links fail silently
for many visitors; copying is the most common fallback.

**Independent Test**: On Contact (EN and ES), use the copy control, paste into a text field, and
confirm the exact address was copied and a confirmation was shown. Also click the address and
confirm it still opens the email app.

**Acceptance Scenarios**:

1. **Given** the Contact page, **When** a visitor activates the "Copy" button next to
   the email address (mouse, touch or keyboard), **Then** the address is placed on their clipboard and a
   visible confirmation ("Copied" / "Copiado") appears for about 2 seconds, also announced to
   screen readers.
2. **Given** the Contact page, **When** a visitor clicks the email address itself, **Then** it
   opens their email app with the address filled in, as today.
3. **Given** a browser where copying isn't allowed, **When** the visitor activates the copy
   control, **Then** they see a short message that repeats the address as plain, selectable
   text ("Couldn't copy. Select and copy the address: contact@…" / "No se pudo copiar.
   Selecciona y copia la dirección: contact@…"), so they can copy it by hand.
4. **Given** JavaScript is turned off, **When** a visitor opens Contact, **Then** the copy
   control is not shown and the email link works as today.


---

### User Story 3 - A broken Sales catalogue can never go live (Priority: P2)

When the site is built (on the owner's computer or during publishing), the two Sales catalogue
files are checked automatically. If either is invalid, the build stops with a clear message
naming the file and the problem, and nothing is published, so the live site keeps working.

**Why this priority**: Answers the owner's question: the check does **not** run today. A broken
catalogue would only be noticed by a visitor seeing an empty or broken Sales page.

**Independent Test**: Introduce an error in a catalogue (e.g. remove an item's price), run the
normal build and confirm it fails with a message naming the file and field. Fix it and confirm
the build succeeds.

**Acceptance Scenarios**:

1. **Given** both catalogue files are valid, **When** the site is built, **Then** the build
   succeeds and reports that both catalogues passed.
2. **Given** a catalogue file has an invalid item (e.g. a missing name, price or photo, or a
   photo without a description), **When** the site is built, **Then** the build fails before
   producing the site and the message names the file, the item position and the field.
3. **Given** a catalogue file is missing or isn't readable data, **When** the site is built,
   **Then** the build fails with a message naming that file.
4. **Given** a catalogue problem is pushed to the publishing branch, **When** automatic
   publishing runs, **Then** it fails and the currently live site stays unchanged.
5. **Given** an empty catalogue (no items), **When** the site is built, **Then** the build
   succeeds (an empty catalogue is valid and shows the US1 empty state), as long as the other
   language's catalogue is empty too.
6. **Given** an item ID appears in one language's catalogue but not the other's, **When** the
   site is built, **Then** the build fails and the message lists each missing ID and the
   catalogue it's missing from.

---

### User Story 4 - "Content creator" role (Priority: P3)

A visitor on Home sees "Content creator" among David's roles, and the summary line reflects it.

**Why this priority**: A small but real profile update (Principle I: keep the profile current).

**Independent Test**: Open Home in EN and ES and confirm the fifth role tag and the new summary
line.

**Acceptance Scenarios**:

1. **Given** the English Home page, **When** it loads, **Then** the role tags read: Systems
   engineer, Mentor, Public speaker, Voice actor, Content creator.
2. **Given** the Spanish Home page, **When** it loads, **Then** the fifth tag reads "Creador de
   contenido".
3. **Given** either Home page, **When** it loads, **Then** the summary line reads "I build
   systems, help people grow, create content, and occasionally lend my voice to a story." (ES:
   "Construyo sistemas, ayudo a las personas a crecer, creo contenido y, de vez en cuando, le
   presto mi voz a una historia.").
4. **Given** a phone-width screen, **When** Home loads, **Then** the five tags wrap neatly with
   no sideways scroll.


---

### Edge Cases

- **Only one language is empty**: each language's page shows its own empty state independently
  (e.g. English Now has updates but Spanish Now doesn't).
- **Album exists but has no photos**: unchanged (camera empty state inside the album, as today).
- **Sales catalogue fails to load** (network error): unchanged from today; this feature only
  covers an empty catalogue that loaded successfully.
- **Very long email address**: the address and copy control wrap on narrow screens without
  sideways scroll.
- **Copy used twice quickly**: the confirmation restarts its timer; it never stacks.
- **Catalogue check on a fresh machine**: the check needs nothing beyond what building the site
  already installs.

## Requirements *(mandatory)*

### Functional Requirements

**Empty states**

- **FR-001**: The Now page MUST show an empty-state card (illustration + message, in the same
  visual style as the Blog empty state) when there are no Now updates in that language.
- **FR-002**: The Photos page MUST show the existing camera empty state ("Development in
  process…" / "En proceso de revelado…") when there are no albums in that language.
- **FR-003**: The unlocked Sales page MUST show an empty-state card (illustration + message) and
  no "Load more" button when that language's catalogue has no items.
- **FR-004**: The Home "Now" card MUST show a short "nothing yet" message when there are no Now
  updates in that language.
- **FR-005**: Every empty-state message and illustration MUST exist in EN and ES, be announced to
  screen readers as a status, keep illustrations hidden from screen readers, follow the site's
  empty-state design (centred surface card, illustration in the accent blue), and animate only
  when the visitor allows motion.
- **FR-006**: Pages with content MUST look and behave exactly as today.

**Email**

- **FR-007**: The Contact page MUST keep the email address as a link that opens the visitor's email
  app, and MUST add a "Copy" button (ES: "Copiar") next to it that copies the address in one step,
  with a visible and screen-reader-announced confirmation ("Copied" / "Copiado") in the page's
  language.
- **FR-008**: If copying fails or isn't available, the visitor MUST get a short message that
  includes the address as plain, selectable text (not a link, which can't easily be selected by
  dragging), announced to screen readers.
- **FR-009**: Without JavaScript, the copy control MUST NOT be shown, and the email address MUST
  still be usable as today.

**Sales catalogue check**

- **FR-010**: Building the site MUST run the Sales catalogue check first, for both languages,
  using the same rules as the existing check.
- **FR-011**: If either catalogue fails the check, the build MUST fail with a message naming the
  file, item and field, and MUST NOT produce or publish a site.
- **FR-012**: The check MUST run in automatic publishing too, so an invalid catalogue on the
  publishing branch never reaches the live site.
- **FR-013**: The check MUST still be runnable on its own, as today.
- **FR-013a**: The check MUST also fail when the English and Spanish catalogues don't contain the
  same set of item IDs, listing each missing ID and the catalogue it's missing from
  (Constitution II: bilingual parity), and when a catalogue repeats an item ID. Item order may
  differ.

**Roles**

- **FR-014**: The Home role tags MUST include "Content creator" (ES: "Creador de contenido") as
  the fifth tag, with its own dot colour taken from the site's colour palette.
- **FR-015**: The Home summary line MUST read, in English, "I build systems, help people grow,
  create content, and occasionally lend my voice to a story." and, in Spanish, "Construyo
  sistemas, ayudo a las personas a crecer, creo contenido y, de vez en cuando, le presto mi voz a
  una historia."


## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: With no content, 0 of the 6 pages (Now, Photos, Sales in EN and ES) show a blank
  content area; each shows its empty-state message.
- **SC-002**: A visitor can copy the email address in 1 click or tap, and 100% of copies paste as
  the exact address.
- **SC-003**: 100% of builds with an invalid Sales catalogue, or with EN/ES catalogues listing
  different items, fail before producing the site, and 0 such catalogues reach the live site.
- **SC-004**: Home shows 5 role tags in both languages, and the summary line mentions content
  creation in both.
- **SC-005**: 0 regressions: pages with content, the email link, the Sales gate and the Home
  layout at 1280px and 390px look and behave as before, and all new text passes contrast in both
  themes.

## Assumptions

- **"Create empty page"** means an empty state for when those sections have no content, like the
  Blog's existing "oven" state, not new blank routes. Now, Sales and Photos pages already exist.
- **Photos reuses the camera illustration** from the empty album state, so "no photos yet" looks
  the same whether there are no albums or an album is empty.
- **The illustrations for Now and Sales** are new, simple shapes in the same style (for example
  an hourglass for Now and a price tag for Sales); the exact drawing is a design decision for the
  plan.
- **The "About section" roles** are the role tags in the Home hero (the only place roles are
  listed). The About card's text is unchanged.
- **The catalogue check keeps its current per-file rules** (every item needs an id, name, price
  and at least one photo, and every photo needs a description) and adds one cross-file rule: both
  catalogues must contain the same item IDs (FR-013a). Names, prices and descriptions may differ
  between languages.
- **The new role's dot colour** is a new palette colour added to the design tokens (like the four
  existing role colours), since the constitution requires every colour to come from the tokens.
- **Empty-state copy** (messages in US1) was confirmed by the owner (see Clarifications).
