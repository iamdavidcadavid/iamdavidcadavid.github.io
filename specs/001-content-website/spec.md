# Feature Specification: Personal Content Website (Home, About, Contact, Blog, Photos, Sales, Easter Egg)

**Feature Branch**: `001-content-website`

**Created**: 2026-09-22

**Status**: Draft

**Input**: User description: "I want to build a content based website with the following pages: Home, About, Contact, Blog, Photos, Sales, Easter Egg. All pages share a header and footer. The site has a navigation menu that collapses into a hamburger menu when it can't fit, and the two menus are never shown at once. Sales and Easter Egg must not appear in navigation or be linked from other pages, and must not be crawled/indexed — reachable only by direct URL. Placeholder tags are used for text that must be replaced manually. Home has a welcome banner, an About section (text + placeholder photo of David Cadavid, text/image sides swap between desktop and mobile), and a Contact section (friendly intro paragraph, icon links to LinkedIn/GitHub/YouTube, and a mailto 'email' button to contact@davidcadavid.com). Blog shows a paginated list of posts (title + first 2-3 lines, alternating colors, configurable page size, 'Load More' button, bread-oven loading animation when empty). Photos shows a grid of albums (cover + title) that open to a photo list, with a click-to-enlarge modal. Sales is a password-protected (front-end only) catalog of items (name, price, optional description, photo carousel with enlarge) using the same Load More pagination as Blog. Easter Egg can start empty and will later hold funny images/text."

**Amendment (2026-09-22)**: Updated per constitution v1.1.0, which added a ratified brand color
palette ("Warm Blue and Green": Primary Blue `#454DBF`, Secondary Blue `#90B4D4`, Secondary
Green `#BFCF74`, Primary Green `#88AB4D`) to the project's Technical Constraints. Added FR-009,
SC-008, and a supporting assumption to require this feature's visual design to draw from that
palette; renumbered FR-009 through FR-031 to FR-010 through FR-032 accordingly.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Learn about David and get in touch (Priority: P1)

A visitor lands on the Home page, reads a short introduction and background about David
Cadavid, and finds a friendly, clear way to reach out about work or collaboration
opportunities.

**Why this priority**: This is the entire point of the site per its stated purpose — showcase
the professional profile and enable contact/hiring. Without this, the site delivers no value.

**Independent Test**: Load the Home page directly and verify the welcome banner, About text
with photo, and Contact section (social links + mailto) are all present and functional,
without needing any other page to exist.

**Acceptance Scenarios**:

1. **Given** a visitor opens the Home page, **When** the page loads, **Then** a welcoming
   banner, an About section (short paragraph(s) plus a photo of David Cadavid), and a Contact
   section are all visible on the page.
2. **Given** a visitor is viewing the Home page on a desktop-width screen, **When** they look
   at the About section, **Then** the text appears to the left of the photo and the photo to
   the right.
3. **Given** a visitor is viewing the Home page on a mobile-width screen, **When** they look at
   the About section, **Then** the photo appears above the text.
4. **Given** a visitor reads the Contact section, **When** they view it, **Then** they see a
   short, friendly-toned invitation to get in touch, followed by icon links to LinkedIn
   (`cadaviddavid`), GitHub (`iamdavidcadavid`), and YouTube (`iamdavidcadavid`), and a
   button labeled "email".
5. **Given** a visitor clicks the "email" button, **When** their device has an email
   application configured, **Then** a new email addressed to `contact@davidcadavid.com` is
   opened for them to compose.
6. **Given** a visitor clicks a social icon link, **When** the link opens, **Then** it leads to
   the corresponding LinkedIn, GitHub, or YouTube profile for the stated username.

---

### User Story 2 - Browse blog articles (Priority: P2)

A visitor navigates to the Blog page to read what David has written, sees a list of posts, and
can load more posts at their own pace without the page becoming cluttered or slow.

**Why this priority**: The blog is the site's ongoing content channel and a secondary but
important reason for repeat visits; it is not required for the site's core "get in touch"
purpose to work, so it ranks after Home.

**Independent Test**: Load the Blog page directly with a sample set of posts and verify the
initial list, alternating styling, "Load More" behavior, and the empty-state animation each
work without depending on the Home, Photos, or Sales pages.

**Acceptance Scenarios**:

1. **Given** more blog posts exist than the configured initial page size, **When** the Blog
   page loads, **Then** only the configured number of posts (default 5) are shown, each
   displaying its title and the first two to three lines of its text.
2. **Given** the visible list does not yet include every post, **When** the visitor looks at
   the bottom of the list, **Then** a "Load More" control is displayed.
3. **Given** the visitor activates "Load More", **When** more posts remain, **Then** the same
   configured number of additional posts is appended to the list.
4. **Given** every available post is now shown, **When** the visitor looks at the list,
   **Then** the "Load More" control is no longer displayed.
5. **Given** consecutive posts in the list, **When** the visitor scans down the page, **Then**
   adjacent post entries alternate between two distinct visual treatments (e.g., background
   colors) so they are easy to tell apart.
6. **Given** there are no blog posts at all, **When** the visitor opens the Blog page,
   **Then** an animation depicting a bread oven is shown in place of the list, indicating
   posts are still "baking".

---

### User Story 3 - Browse photo albums (Priority: P3)

A visitor opens the Photos page, browses a grid of albums, opens one to see its pictures, and
enlarges any picture that catches their eye.

**Why this priority**: Photos add personality and depth to the profile but are not essential
to the core contact/hire goal, and are independent of the blog.

**Independent Test**: Load the Photos page directly with sample albums and verify the grid,
album drill-down, and enlarge-on-click modal all work without any dependency on other pages.

**Acceptance Scenarios**:

1. **Given** one or more photo albums exist, **When** the visitor opens the Photos page,
   **Then** a grid is shown with each album's cover image and title.
2. **Given** the visitor clicks an album, **When** the album opens, **Then** the list of
   photos belonging to that album is displayed.
3. **Given** the visitor clicks a photo inside an open album, **When** the photo is selected,
   **Then** a modal appears showing that photo at a larger size.

---

### User Story 4 - Shop a private sales catalog via a direct link (Priority: P4)

Someone who has been given the private Sales page URL enters the configured password and
browses a catalog of items for sale, viewing each item's details and photos.

**Why this priority**: Sales is an intentionally hidden, niche feature meant for a small,
direct-linked audience rather than general site visitors, so it ranks below the publicly
navigable pages.

**Independent Test**: Navigate directly to the Sales page URL (bypassing navigation, since none
exists), verify the page is unreachable without the correct password, and that once unlocked
the catalog, carousel, and Load More behavior work independently of Blog/Photos.

**Acceptance Scenarios**:

1. **Given** a visitor navigates directly to the Sales page URL, **When** the page loads,
   **Then** no item names, prices, descriptions, or photos are visible until a password has
   been entered.
2. **Given** the visitor enters an incorrect password, **When** they submit it, **Then** access
   is denied and no item content is revealed.
3. **Given** the visitor enters the correct, site-owner-configured password, **When** they
   submit it, **Then** the list of items for sale becomes visible.
4. **Given** an item has one or more photos, **When** the visitor views that item, **Then** the
   photos are presented in a carousel and can be clicked to view enlarged.
5. **Given** more items exist than the configured initial page size, **When** the visitor
   reaches the bottom of the visible items, **Then** a "Load More" control behaves the same
   way as on the Blog page (appends the next batch, disappears once all items are shown).
6. **Given** the Sales page exists, **When** any other page's navigation, links, sitemap, or
   search engine results are inspected, **Then** no reference to the Sales page is found.

---

### User Story 5 - Discover the hidden Easter Egg page (Priority: P5)

A visitor who happens to know or guesses the Easter Egg URL opens it directly and finds a
lighthearted, unlisted page.

**Why this priority**: Explicitly a low-stakes bonus feature with no required content yet;
included for completeness of the site's page structure.

**Independent Test**: Navigate directly to the Easter Egg page URL and verify it loads
successfully, contains no navigation entry point anywhere else on the site, and is excluded
from search indexing — regardless of whether any other page exists yet.

**Acceptance Scenarios**:

1. **Given** a visitor navigates directly to the Easter Egg page URL, **When** the page loads,
   **Then** the page renders successfully even if it currently has no content beyond a
   placeholder.
2. **Given** the Easter Egg page exists, **When** any other page's navigation, links, sitemap,
   or search engine results are inspected, **Then** no reference to the Easter Egg page is
   found.

---

### Edge Cases

- What happens when the browser window is resized across the point where the full navigation
  menu would no longer fit — does the switch to the hamburger menu happen without ever briefly
  showing both, or neither, menu?
- How does the Blog page behave when the number of remaining posts is smaller than the
  configured page size (the last "Load More" click reveals fewer items than usual, and the
  control then correctly disappears)?
- How does the Photos page behave if an album has no photos in it yet?
- How does the Sales page behave if the site owner has not yet configured a password, or if the
  visitor's browser has stored a previously correct password from an earlier visit?
- What happens if a visitor tries to access the Sales or Easter Egg page from a device/browser
  with JavaScript disabled, given the password gate is client-side only?
- What happens when a visitor follows a shared/bookmarked link to a specific blog post, photo
  album, or Sales item directly, rather than arriving via the page's default list view?
- How is a language preference (English/Spanish, per the project constitution) retained when a
  visitor navigates between Home, Blog, Photos, and the hidden pages?

## Requirements *(mandatory)*

### Functional Requirements

**Site-wide structure**

- **FR-001**: The site MUST present the same header and the same footer, with identical
  content and layout, on every page (Home, About, Contact, Blog, Photos, Sales, Easter Egg).
- **FR-002**: The site MUST provide a navigation menu offering direct access to Home, About,
  Contact, Blog, and Photos only.
- **FR-003**: The Sales and Easter Egg pages MUST NOT appear in the navigation menu and MUST
  NOT be linked to from any other page on the site; they are reachable only by a visitor
  entering their exact URL directly.
- **FR-004**: The Sales and Easter Egg pages MUST be excluded from search engine crawling and
  indexing (e.g., via no-index directives) and MUST be excluded from any sitemap the site
  publishes.
- **FR-005**: When the viewport is too narrow to display the full navigation menu, the site
  MUST show a hamburger-style menu control that provides the same links instead.
- **FR-006**: The full navigation menu and the hamburger menu MUST NOT both be visible at the
  same time; exactly one of the two MUST be shown at any given viewport width.
- **FR-007**: All body copy that is not yet final MUST be represented using clearly marked
  placeholder text (and a placeholder image where a photo is required) so it can be found and
  replaced later.
- **FR-008**: Consistent with the project constitution, every page in this feature MUST be
  presented in English (default) and Spanish, with a visible, working control for switching
  between them.
- **FR-009**: The site's visual design (backgrounds, buttons, links, headers, footers, and
  other accents) MUST use the project's ratified brand palette — Primary Blue `#454DBF`,
  Secondary Blue `#90B4D4`, Secondary Green `#BFCF74`, Primary Green `#88AB4D` — rather than
  arbitrary colors, with neutrals (white/black/grays) used alongside it for text and
  backgrounds wherever a palette color would not meet accessibility contrast requirements.

**Home page**

- **FR-010**: The Home page MUST display a welcoming banner section with introductory text
  (e.g., "Welcome to my site").
- **FR-011**: The Home page MUST display an About section containing one or more short
  paragraphs of biography text alongside a photo of David Cadavid (placeholder text and image
  acceptable).
- **FR-012**: On desktop-width viewports, the About section MUST place the text to the left and
  the photo to the right; on mobile-width viewports, the photo MUST appear above the text.
- **FR-013**: The Home page MUST display a Contact section that opens with a short paragraph,
  written in a kind and friendly tone, inviting the visitor to get in touch.
- **FR-014**: The Contact section MUST include icon links to LinkedIn (username
  `cadaviddavid`), GitHub (username `iamdavidcadavid`), and YouTube (username
  `iamdavidcadavid`).
- **FR-015**: The Contact section MUST include a button labeled "email" that opens the
  visitor's default email application with a new message addressed to
  `contact@davidcadavid.com`.
- **FR-016**: The site's "About" and "Contact" navigation entries MUST bring the visitor to
  this same About/Contact content on the Home page.

**Blog page**

- **FR-017**: The Blog page MUST display a list of blog post entries, each showing its title
  and the first two to three lines of its text.
- **FR-018**: The Blog page MUST initially display up to a configurable number of posts, with a
  default of 5.
- **FR-019**: While additional posts remain beyond what is currently shown, the Blog page MUST
  display a "Load More" control.
- **FR-020**: Activating "Load More" MUST append the next batch of posts, using the same
  configured count as the initial page size.
- **FR-021**: Once all available posts have been loaded, the "Load More" control MUST no longer
  be displayed.
- **FR-022**: When there are no blog posts to show, the Blog page MUST display a bread-oven
  themed loading animation instead of an empty list.
- **FR-023**: Adjacent entries in the blog list MUST alternate between two distinct visual
  treatments, drawn from the brand palette (FR-009), so consecutive posts are visually
  distinguishable.

**Photos page**

- **FR-024**: The Photos page MUST display a grid of photo albums, each showing a cover image
  and the album's title.
- **FR-025**: Selecting an album MUST display the list of photos contained within it.
- **FR-026**: Selecting a photo within an open album MUST display that photo enlarged in a
  modal overlay.

**Sales page (hidden)**

- **FR-027**: The Sales page MUST require a visitor to enter a password before any item
  content (names, prices, descriptions, photos) is shown.
- **FR-028**: The password required to unlock the Sales page MUST be configurable by the site
  owner directly within the page's own source/configuration, and validated entirely in the
  browser (no server-side component).
- **FR-029**: Each item on the Sales page MUST display a name, a price, an optional
  description, and one or more photos.
- **FR-030**: Item photos on the Sales page MUST be presented in a carousel and MUST enlarge
  when clicked.
- **FR-031**: The Sales item list MUST use the same progressive loading behavior as the Blog
  list: a configurable initial count, a "Load More" control that appends the same-size batch,
  and no "Load More" control once every item has been loaded.

**Easter Egg page (hidden)**

- **FR-032**: The Easter Egg page MUST exist as a working, directly reachable page that loads
  successfully even before any real content has been added to it.

### Key Entities

- **Blog Post**: A single article — title, body text (from which the first 2-3 lines are shown
  in the list), publish order/date, and English/Spanish content variants.
- **Photo Album**: A named collection of photos — title, cover image, ordered list of member
  Photos.
- **Photo**: A single image belonging to a Photo Album (or attached to a Sale Item) — image
  asset and optional caption.
- **Sale Item**: A catalog entry on the Sales page — name, price, optional description, one or
  more Photos, display order.
- **Contact Link**: An outbound profile reference shown in the Contact section — platform
  (LinkedIn, GitHub, YouTube), username/handle, destination URL.
- **Navigation Entry**: A link surfaced in the site's menu — label, target page/section, and
  whether it is publicly listed (Sales and Easter Egg are deliberately excluded).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can find at least one way to contact the site owner within
  10 seconds of the Home page finishing loading, without scrolling past the Contact section.
- **SC-002**: At every viewport width, exactly one navigation style (full menu or hamburger) is
  visible — automated or manual checks across representative breakpoints find zero cases of
  both or neither appearing.
- **SC-003**: A visitor can read through an entire blog archive of any size using only the
  "Load More" control, with each click adding the same configured number of posts and no
  errors or broken states along the way.
- **SC-004**: 100% of the site's navigation menu items, sitemap entries, and inter-page links
  exclude the Sales and Easter Egg pages, and both pages are marked to be excluded from search
  engine indexing.
- **SC-005**: No item name, price, description, or photo on the Sales page is visible or
  present in the page prior to a visitor supplying the correct password.
- **SC-006**: A visitor can go from the Photos grid to viewing any individual photo at enlarged
  size in no more than 2 clicks (album, then photo).
- **SC-007**: Every page covered by this feature renders correctly in both English and Spanish,
  with a visible control that lets a visitor switch between them from any page.
- **SC-008**: Every page's colors (backgrounds, buttons, links, and accents) are drawn from the
  ratified brand palette, and every text/interactive element using a palette color meets
  standard accessibility contrast thresholds against its background.

## Assumptions

- The Home page embeds the About and Contact content directly as sections; the site's "About"
  and "Contact" navigation entries take visitors to those sections on the Home page rather than
  to separate pages that duplicate the same content.
- Blog posts, photo albums/photos, and Sales items are maintained by the site owner as static
  content (e.g., structured content files edited directly), consistent with the project
  constitution's static-site, no-backend approach — there is no visitor-facing or admin content
  management interface.
- The configurable "initial count / Load More batch size" for the Blog and Sales lists is set
  by the site owner in the site's own source/configuration, not through a runtime settings
  screen.
- The Sales password is a single value chosen by the site owner and checked entirely in the
  browser; per the explicit requirement, this is understood to be a casual front-end-only gate
  rather than real access control, and is not expected to stop a technically capable visitor
  from viewing the underlying page source.
- Once a visitor enters the correct Sales password, that access is remembered for the rest of
  the browsing session so they are not re-prompted on every page reload during that visit.
- "Placeholder tags" means clearly marked placeholder text and images (e.g., bracketed tokens
  or an obviously-fake sample photo) that a later manual pass can find and replace; this spec
  does not prescribe the exact placeholder format.
- Per the already-ratified project constitution, all pages in this feature must ultimately ship
  in both English and Spanish; the specific translated copy is out of scope here and will use
  placeholders the same way single-language content does.
- The Blog, Photos, and Sales catalogs are personal-site scale (dozens, not many thousands, of
  entries) — no requirement is made for large-scale catalog performance.
- The Easter Egg page needs no functional requirements beyond existing and being reachable; its
  eventual content (images, in-jokes) is explicitly deferred to a future update.
- The constitution's brand palette (Primary Blue `#454DBF`, Secondary Blue `#90B4D4`, Secondary
  Green `#BFCF74`, Primary Green `#88AB4D`) defines the allowed colors, but which specific
  color plays which role (e.g., primary button vs. link vs. alternating blog-item background)
  is a visual-design decision left to the planning/implementation phase, provided every choice
  stays within the palette and satisfies contrast requirements — lighter palette colors such as
  `#BFCF74` are expected to need a neutral pairing when used for text rather than being used as
  standalone body-text color.
