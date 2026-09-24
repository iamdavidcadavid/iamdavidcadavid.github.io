---

description: "Task list for the Site Design Restyle feature"
---

# Tasks: Site Design Restyle

**Input**: Design documents from `/specs/004-design-restyle/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Visual source of truth**: `design/README.md` (tokens, type, spacing, per-page notes),
`design/Home Redesign.dc.html` (artboards 2a–2e) and `design/Site Pages.dc.html` (sections 1–13,
15; section 14 is out of scope). When a task says "per the design", take exact sizes, radii,
spacing and motion from those files. Tasks don't restate them.

**Tests**: No separate test tasks. This project has no automated test suite (plan.md Technical
Context), so verification is the `quickstart.md` walkthrough in a real browser at every
checkpoint and in full in the final phase.

**Rules that apply to every task**:
- **Colors come only from tokens** in `src/styles/global.css`. No literal `#hex`, `rgb()`,
  `oklch()`, `color-mix()` with literals, or named colors in any other **code file** in `src/`
  (`.astro`, `.css`, `.ts`) (constitution design-token rule). Image files are exempt (see T041).
- **Where the design shows `--faint` text, use `--muted`.** Light `--faint` fails WCAG AA as text
  (research §4). `--faint` is only for non-text decoration: "↗" arrows, the `EN / ES` slash, the
  inactive theme icon. Mark those `aria-hidden="true"`.
- **Every animation goes inside `@media (prefers-reduced-motion: no-preference)`** (FR-007).
- **Every visible string exists in EN and ES.** Shared strings live in `src/i18n/ui.ts`, with keys
  and Spanish from `contracts/ui-copy.md`.
- **Keep all 001–003 behavior.** "Restyle" means markup and CSS only, unless a task says
  otherwise (FR-035).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unmet dependency)
- **[Story]**: Maps the task to US1–US5 from spec.md

---

## Phase 1: Setup

**Purpose**: Bring in the one new asset and the build-level config.

- [X] T001 Copy `design/assets/david.png` to `src/assets/david.png` (unchanged binary; it is optimized at build time by T015, research §5).
- [X] T002 In `astro.config.mjs`: import `fontProviders` from `astro/config` and add a top-level
      `fonts` array with two families from `fontProviders.google()`: `{ name: 'Young Serif',
      cssVariable: '--font-serif', weights: [400], styles: ['normal'], fallbacks: ['Georgia',
      'serif'] }` and `{ name: 'Onest', cssVariable: '--font-sans', weights: [300, 400, 500, 600],
      styles: ['normal', 'italic'], fallbacks: ['system-ui', 'sans-serif'] }`. If the build
      reports that Onest has no italic, remove `'italic'`; the browser synthesizes the only italic
      use, the footer quote. Also extend the sitemap `filter` to exclude `/404` as well:
      `!page.includes('/sales/') && !page.includes('/easter-egg/') && !page.includes('/404')`
      (FR-006, FR-034; research §1, §14). Run `npm run build` to confirm the fonts resolve.

---

## Phase 2: Foundational (blocks every story)

**Purpose**: New tokens, theme plumbing, motion and shared helpers. After this phase every page
renders in the new colors and fonts (layouts still old), so each story can then be built and
checked on its own.

**⚠️ No user-story work starts until this phase is done.**

- [X] T003 Rewrite the token section of `src/styles/global.css` (research §2–§3):
      - `:root { color-scheme: light dark; }`, `:root[data-theme="light"] { color-scheme: light; }`,
        `:root[data-theme="dark"] { color-scheme: dark; }`.
      - Define every token **once** as `light-dark(<light>, <dark>)` using the exact values in
        `design/README.md` → "Design tokens": `--bg`, `--surface`, `--sand`, `--ink`, `--body`,
        `--muted`, `--faint`, `--line`, `--blue`, `--blue-hover`, `--blue-ink`, `--blue-soft`,
        `--on-blue`, `--danger`.
      - Add the extra tokens: `--chip-mentor: oklch(0.64 0.11 150)`, `--chip-speaker: oklch(0.64
        0.12 45)`, `--chip-voice: oklch(0.64 0.11 330)`, `--backdrop: rgba(12,11,10,.82)`,
        `--on-backdrop: #ffffff`, shadow colors `--shadow-soft` / `--shadow-deep`
        (light/dark alphas from the README's `--shadow-pill` row), and the composed `--shadow-pill`,
        `--shadow-photo: 0 30px 60px -30px var(--shadow-deep)` and `--shadow-menu: 0 24px 48px
        -20px var(--shadow-deep)`.
      - **Delete** every old token (`--color-primary-blue`, `--color-secondary-*`,
        `--color-primary-green`, `--color-neutral-*`, `--color-white`, `--color-text`,
        `--color-background`, `--color-link`, `--color-accent`). Keep `--content-max-width` and
        `--breakpoint-md-px`. Add `--gutter: 48px` (20px below 768px).
      - Base: `body { background: var(--bg); color: var(--body); font-family: var(--font-sans); }`,
        headings `font-family: var(--font-serif); font-weight: 400; color: var(--ink);`, and
        `a { color: var(--blue-ink); }`.
      - Add a comment next to `--faint` stating the "non-text only" rule from research §4.
- [X] T004 In `src/styles/global.css` (after T003): add the motion system (research §12).
      Keyframes `slide-left` (from `opacity:0; translateX(-40px)`), `slide-right` (from
      `translateX(48px)`), `rise` (from `opacity:0; translateY(24px)`), `wobble` (rotate ±5°),
      `pulse` (scale 1 ↔ 0.9), `glow` (opacity .55→1, scale .82→1), plus utility classes
      `.anim-slide-left` (0.8s), `.anim-slide-right` (1s), `.anim-rise` (0.8s), all with
      `cubic-bezier(.2,.7,.2,1)` and `animation-fill-mode: both`, and delay classes `.delay-1`
      (0.12s), `.delay-2` (0.24s), `.delay-3` (0.15s), `.delay-4` (0.55s). Put **all** of it inside
      `@media (prefers-reduced-motion: no-preference)`. Also add shared utilities: `.card`
      (`--surface` background, radius 28px / 24px below 768px) and `.btn`, `.btn-blue`,
      `.btn-surface` (pill buttons with `--blue-hover` / `--sand` hover, per the design).
- [X] T005 [P] Delete `src/components/Carousel.astro`. It is imported nowhere (verified by grep)
      and uses the tokens T003 removes (research §17).
- [X] T006 Migrate every remaining old-token reference in `src/` to the new tokens so all pages
      render in the new palette before their restyle. Mapping: `--color-primary-blue` → `--blue`
      for fills and `--blue-ink` for text/links; `--color-white` → `--on-blue` for text on blue
      and `--surface` for backgrounds; `--color-neutral-900`/`--color-text` → `--ink`;
      `--color-neutral-700` → `--muted`; `--color-neutral-200` → `--line`;
      `--color-neutral-100` → `--surface`; `--color-background` → `--bg`; `--color-link` →
      `--blue-ink`; `--color-primary-green`, `--color-secondary-green` and
      `--color-secondary-blue` → `--blue-soft`. Three cases need different targets, because the
      general mapping would make text invisible in the dark theme (`/speckit-analyze` finding C1):
      - `--color-white` used for text **over the photo-viewer backdrop** (`.modal-caption`,
        `.modal-close` in `PhotoLightbox.astro`; `.sg-modal-caption`, `.sg-modal-close` in
        `SalesGate.astro`) → `--on-backdrop`.
      - The backdrop literals `background: rgba(0, 0, 0, 0.75)` (`.modal-backdrop` in
        `PhotoLightbox.astro`, `.sg-modal-backdrop` in `SalesGate.astro`) → `var(--backdrop)`.
      - `BlogList.astro`'s `.is-odd { background: color-mix(in srgb, var(--color-secondary-blue)
        20%, white) }` → `var(--sand)` (T022 later removes the alternating rows altogether).
      Replace `SalesGate.astro`'s `.sg-error { color: #b3261e }` with `var(--danger)`. Finish with
      `grep -rn "var(--color-" src` returning nothing, then toggle `data-theme="dark"` in DevTools
      and open a photo viewer and the Blog list to confirm all text is readable. This keeps the site
      publishable after any later phase — depends on T003, T005.
- [X] T007 [P] Create `src/i18n/ui.ts` (data-model.md → "UI copy dictionary"). Export `ui = { en:
      {...}, es: {...} }` with **every** shared key from `contracts/ui-copy.md` (nav, theme,
      lang, home, pill, blog, photos, now). Use a TypeScript type so both locales **MUST define
      the same set of keys** and a missing Spanish key fails the build. Export `t(locale, key,
      vars?)`, which replaces `{n}` from `vars`, and `plural(locale, baseKey, n)`, which picks
      `…One` or `…Other`.
- [X] T008 [P] Create `src/lib/format.ts`. Export `formatDate(date: Date, locale: 'en'|'es',
      style: 'long'|'medium'|'short')` using `toLocaleDateString(locale === 'en' ? 'en-US' :
      'es-ES', {..., timeZone: 'UTC' })` (carries forward 003's off-by-one fix). "long" gives
      "September 15, 2026" / "15 de septiembre de 2026"; "medium" gives "Sep 15, 2026" /
      "15 sept 2026" (the Home Now card, `/speckit-analyze` finding F1); "short" gives "Feb 16" /
      "16 feb". Also move `excerptFor(body,
      maxLines)` here verbatim from `src/components/BlogList.astro` (callers switch over in their
      own tasks), and add `firstParagraph(body: string | undefined): string`. It skips blank and
      `#` heading lines, takes the lines up to the next blank line, and joins them with single
      spaces. Content files wrap sentences across lines, so a line-based excerpt would cut mid-sentence
      (`/speckit-analyze` finding U1; research §7–§8).
- [X] T009 [P] Create `src/components/PageTitle.astro` (research §11). Props: `text: string`,
      optional `meta?: string` (e.g. a post count). Renders an `<h1>` in `--font-serif` at
      `clamp(44px, 6.5vw, 84px)`, line-height 1, letter-spacing −0.02em, followed by
      `<span class="dot">.</span>` in `--blue`, with class `anim-slide-left`. If `meta` is given,
      put it on the same row, right-aligned, in `--muted` 15px (per Site Pages §1) — depends on
      T003, T004.

**Checkpoint**: `npm run build` passes. Every page renders in the new colors and fonts with no
undefined variables (DevTools shows no invalid `var()`), in both themes. Toggle `data-theme` by
hand in DevTools to check dark.

---

## Phase 3: User Story 1 - A consistent new look, in light or dark, on every page (Priority: P1) 🎯 MVP

**Goal**: New header (wordmark, nav pill with active item, `EN / ES`, theme toggle), mobile menu
card, footer, and a remembered light/dark theme with no flash.

**Independent Test**: quickstart.md Scenario 1 on any existing page, in both themes, languages
and widths ([interaction-contract.md §A, §B](./contracts/interaction-contract.md)).

- [X] T010 [P] [US1] Create `src/components/ThemeToggle.astro` (contract §A, data-model.md "Theme
      preference"). Render a pill (`--surface`, 4px padding, `--shadow-pill`) with two 32px round
      `<button>`s: sun (11px filled dot) and moon (13px crescent via `box-shadow: inset -4px -2px 0 0
      currentColor`), labelled `t(locale,'theme.light')` / `t(locale,'theme.dark')` and 30px below
      768px. Render the pill **with `hidden`**, and have its script remove `hidden`, so it is absent
      without JS. Script:
      - the effective theme is `document.documentElement.dataset.theme`, otherwise
        `matchMedia('(prefers-color-scheme: dark)').matches`;
      - the active button gets `--ink` fill, its icon in `--surface`, and `aria-pressed="true"`;
        the inactive icon is `--faint`;
      - on click, set `dataset.theme` and write `localStorage.theme`. **Allowed values `"light"`,
        `"dark"`**. Wrap every storage access in `try/catch`.
- [X] T011 [P] [US1] Update `src/components/LanguageSwitch.astro` to render `EN / ES`: a link to
      the other language in `--muted`, the current language as plain text in `--ink` with
      `aria-current="true"` (both 14px/500), and an `aria-hidden` "/" in `--faint`, wrapped in an element
      with `aria-label={t(locale,'lang.label')}`. Keep the existing URL-building logic unchanged.
- [X] T012 [US1] Rewrite `src/components/NavBar.astro` (research §9–§10, routing contract "Active
      navigation mapping").
      - Labels come from `t(locale,'nav.*')` in the existing order Home, Now, Contact, Blog, Photos.
      - Compute the active item: strip a leading `/es` from `Astro.url.pathname`, then map the first
        segment `''|now|contact|blog|photos` to that item and anything else to none. Put
        `aria-current="page"` on the active link.
      - **Desktop (≥768px)**: a pill `<ul>` per the design, whose `[aria-current]` link has `--blue`
        fill and `--on-blue` text, and whose other links hover to `--sand`.
      - **Mobile**: build the menu on native `<details class="mobile-menu">` so it opens
        **without JavaScript** (`/speckit-analyze` finding A1).
        - The `<summary>` is the 44px menu button: three 20×2px bars, `aria-label={t(locale,
          'nav.menuToggle')}`, and the default disclosure marker hidden. Its expanded state is
          exposed natively.
        - The floating card is the `<details>` content: top 68px, 12px side insets, `--surface`,
          radius 24px, `--shadow-menu`, 200ms fade (motion-gated). It has 56px rows in serif 24px
          separated by `--line`, the active row in `--blue-ink` with an 8px `--blue` dot, and
          `<LanguageSwitch />` at the bottom unless a new `hideLanguageSwitch` prop is true.
        - Hide the whole `<details>` at ≥768px.
      - A small script adds enhancements only: Escape closes the menu (`open = false`) and returns
        focus to the `<summary>`, and a link click closes it. Without JS the menu still opens and
        closes by pressing the button, and every link works. Remove the old hamburger
        `is-open`/`aria-expanded` script.
      — depends on T007, T011.
- [X] T013 [US1] Update `src/layouts/BaseLayout.astro`.
      1. The **first** element in `<head>` is `<script is:inline>` that reads `localStorage.theme`
         in `try/catch` and, if it is `"light"` or `"dark"`, sets
         `document.documentElement.dataset.theme` (FR-004).
      2. Add `<Font cssVariable="--font-serif" preload />` and `<Font cssVariable="--font-sans"
         preload />` from `astro:assets`.
      3. Header: keep `position: sticky; top: 0` with an opaque `--bg` background (FR-012). Inside
         `.site-container`, place the wordmark link (`David Cadavid` plus a `--blue` "." in serif
         22px / 19px mobile, linking to `getRelativeLocaleUrl(locale,'/')`), `<NavBar
         hideLanguageSwitch={hideLanguageSwitch} />`, and a right cluster with `<LanguageSwitch />`
         (desktop only, omitted when `hideLanguageSwitch`) and `<ThemeToggle />`. Desktop padding
         is 24px 48px with three items spaced between. Mobile height is 68px, with the cluster
         order wordmark · toggle · menu button (use CSS `order`).
      4. Footer: same content, restyled per the design (`--surface`, 1px `--line` top border,
         `--muted`, © 15px, quote 14px italic).
      5. Remove the old 10px `padding-block` rule from 003; the design's values supersede it (spec
         Assumptions).
      — depends on T002, T010, T012.

**Checkpoint**: Run quickstart Scenario 1 in full. The site is shippable here: every page has the
new chrome and themes, and later stories restyle page bodies.

---

## Phase 4: User Story 2 - A Home page that introduces David at a glance (Priority: P2)

**Goal**: Hero with the real photo, role chips and about card, plus the Now, Latest writing and
Photos preview cards.

**Independent Test**: quickstart.md Scenario 2 against `design/Home Redesign.dc.html` 2a–2e.

- [X] T014 [P] [US2] Update `src/components/AboutSection.astro` into the "A bit about me" card:
      `.card` with padding 32px 36px (24px mobile) and an `<h2>` `t(locale,'home.about.title')` in
      serif 26px (22px mobile), followed by the **existing** EN/ES paragraphs in `--body`
      16px/1.7. Remove the photo block and the `profile-photo.svg` import.
- [X] T015 [US2] Create `src/components/HomeHero.astro` (FR-015, FR-016; research §5).
      - Grid `minmax(0,1fr) 540px`, gap 64px, centred; a single column below 768px in the order
        H1, subline, chips, about, photo, buttons.
      - Left column: `<h1>` `t(locale,'home.title')` with a `--blue` period (80px / 46px mobile,
        line-height 1.02); subline `t(locale,'home.subline')` (20px `--muted`, max 520px); four
        chips (`--surface` pills, 8px dots in `--blue`, `--chip-mentor`, `--chip-speaker`,
        `--chip-voice`, labels `home.chip.*`); `<AboutSection />`. These use the stagger
        `.anim-slide-left`, `.delay-1`, `.delay-2`.
      - Right column: `<Image src={david} alt={t(locale,'home.photo.alt')} widths={[540,1080]}
        sizes="(min-width: 768px) 540px, 100vw" format="webp" />` with 3:2 aspect ratio,
        `object-fit: contain` and radius 24, inside a 10px `--blue` frame (7px mobile, radius 34,
        `--shadow-photo`) with `.anim-slide-right .delay-3`.
      - Below the photo, centred buttons `.btn-blue` "Say hello" → locale `/contact/` and
        `.btn-surface` "What I'm up to now" → locale `/now/`, full-width 52px below 768px, with
        `.anim-rise .delay-4`.
      — depends on T001, T014.
- [X] T016 [P] [US2] Create `src/components/HomeNowCard.astro`. Props: `locale`. Load
      `getCollection('now', id.startsWith(locale+'/'))`, sort by `date` descending and take the
      first. Render a `.card` with the title `home.now.title` (serif 24px), the date
      `formatDate(date, locale, 'medium')` ("Sep 15, 2026", as in the design) in `--muted` 13px, a `--line` divider, the summary
      `firstParagraph(entry.body)` (from `src/lib/format.ts`, T008) in `--body` 17px, and `home.now.more` → locale `/now/` in
      `--blue-ink` pinned to the bottom (`margin-top: auto`) (research §7).
- [X] T017 [P] [US2] Create `src/components/HomeWritingCard.astro`. Props: `locale`. Take the 3
      newest `blog` posts in the locale by `pubDate`. Each row is a link: grid `58px 1fr 16px`, gap
      12px, 18px vertical padding, `--line` top border, with the date `formatDate(pubDate, locale,
      'short')` in `--muted` 13px, the title in 16px (plus `pill.enOnly` as an outline pill in
      `--muted` when `translationPending`), and an `aria-hidden` "↗" in `--faint`. Row hover goes
      `--blue-ink`. The header has `home.writing.title` (serif 24px) and `home.writing.all` → locale
      `/blog/`. With 0 posts, show `t(locale,'blog.empty')`, the blog's existing empty message,
      shared through `ui.ts` (spec Edge Cases; `/speckit-analyze` finding F2).
- [X] T018 [US2] In `src/components/PhotoLightbox.astro`, add a prop `layout?: 'grid' | 'tiles'`
      (default `'grid'`, today's behavior). For `'tiles'`, render the thumbnails in a `2fr 1fr` /
      two-row grid, the first tile spanning both rows, radius 14, with no text over photos and each
      button's `aria-label` equal to the photo alt. Do **not** change the viewer script (it already
      keeps `<img>` references and reads `src`/`alt` when a photo is shown; research §6).
- [X] T019 [US2] Create `src/components/HomePhotosCard.astro` (data-model.md "Home photo pool";
      contract §C). Props: `locale`. Build the pool from every album in the locale: `{src, alt}`
      from `photos[]`, **not** covers, in collection order.
      - Render a `.card` with the header `home.photos.title` (serif 24px) and `home.photos.more` →
        locale `/photos/`.
      - If the pool is empty, render `home.photos.empty` in `--muted`.
      - Otherwise render `<PhotoLightbox photos={pool.slice(0,3)} layout="tiles" locale={locale} />`
        inside a wrapper with `data-pool={JSON.stringify(pool)}`.
      - Client script: if the pool has **more than 3** photos, Fisher–Yates shuffle a copy and
        rewrite the `src`/`alt` (and the tile `aria-label`) of the **existing** tile `<img>`s with
        the first N. Otherwise do nothing.
      — depends on T018.
- [X] T020 [US2] Rewrite `src/pages/index.astro` and `src/pages/es/index.astro`. Remove the
      "Welcome to my site" banner (FR-018). Render `<HomeHero />`, then a section of three equal
      columns (gap 20px, stacked below 768px) containing `<HomeNowCard />`, `<HomeWritingCard />`
      and `<HomePhotosCard />`, each passed the page's locale. Keep document titles "David Cadavid"
      — depends on T015, T016, T017, T019.
- [X] T021 [US2] Delete `src/assets/placeholders/profile-photo.svg` (no longer imported after T014;
      confirm with grep) — depends on T014.

**Checkpoint**: Run quickstart Scenario 2 in both languages and themes. Check the Network tab
shows the optimized webp photo, not the 2 MB PNG.

---

## Phase 5: User Story 3 - Restyled reading pages: Blog, Photos, Now and Contact (Priority: P3)

**Goal**: Blog list, post, Photos, album and viewer, Now and Contact in the new look, with no
behavior change.

**Independent Test**: quickstart.md Scenario 3.

- [X] T022 [US3] Rewrite the list markup and CSS of `src/components/BlogList.astro` (FR-020, Site
      Pages §1).
      - One `.card` holding rows. Each row has the date (`formatDate(pubDate, locale, 'long')`) in
        a 150px column in `--muted`, and a title column: title in serif ~24px with an `aria-hidden`
        "↗" in `--faint`, the existing translation-pending pill restyled as a `--blue-soft` /
        `--blue-ink` pill, and the excerpt in 15px `--muted`. Rows are separated by `--line` and
        wrap below 768px.
      - Import `excerptFor` from `src/lib/format.ts` and delete the local copy.
      - Keep the `data-page-size={blogPageSize}` / Load More script **unchanged**, and restyle the
        button as `.btn-blue`.
      - Keep the empty-state branch as is; T036 restyles it.
- [X] T023 [P] [US3] Update `src/pages/blog/index.astro` and `src/pages/es/blog/index.astro`: replace
      the H1 and `.page-title` CSS with `<PageTitle text="Blog" meta={plural(locale,'blog.count',
      posts.length)} />`. Set the document `<title>` "Blog — David Cadavid" in both. Use the page
      gutter (`--gutter`) and `--content-max-width`.
- [X] T024 [P] [US3] Update `src/pages/blog/[slug].astro` and `src/pages/es/blog/[slug].astro`
      (FR-021, Site Pages §2).
      - 720px column with a `blog.back` link (`--blue-ink`, 14px/500) → locale `/blog/`.
      - The date `formatDate(pubDate, locale, 'long')` in `--muted` plus the existing pending pill.
      - `<h1>` in serif `clamp(36px, 4.6vw, 58px)`, then a `--line` divider.
      - Body styles in 17–19px / 1.75 `--body`: first paragraph 1.15em in `--ink`, `h2` serif
        1.5em, `blockquote` serif 1.4em in `--blue-ink`, images radius 20, `figcaption` 14px
        `--muted`.
      - A closing `.btn-surface` `blog.backBottom`.
      - Keep `hideLanguageSwitch` for translation-pending posts.
- [X] T025 [P] [US3] Update `src/components/AlbumGrid.astro` (FR-022, Site Pages §3). Grid
      `repeat(auto-fill, minmax(300px, 1fr))`, gap 20px. Each item is a `.card` with 12px padding
      holding a 4:3 cover (radius 20), a title in serif 22px and the count `plural(locale,
      'photos.count', album.data.photos.length)` in `--muted`. Hover lifts the card 4px (inside
      the reduced-motion media query).
- [X] T026 [P] [US3] Update `src/pages/photos/index.astro` and `src/pages/es/photos/index.astro`:
      `<PageTitle text={t(locale,'nav.photos')} />` and document titles "Photos — David Cadavid" /
      **"Fotos — David Cadavid"** (fixes today's English title on `/es/photos/`).
- [X] T027 [US3] Restyle the grid layout and the viewer in `src/components/PhotoLightbox.astro`
      (FR-023, Site Pages §4).
      - Grid: 4:3 photos, radius 20, hover scale 1.02 (motion-gated).
      - Viewer: backdrop `--backdrop`; image radius 14; prev/next 44px round `--blue` buttons with
        `--on-blue` glyphs; caption in `--on-backdrop` 14px; × close in `--on-backdrop`.
      - **Keep the script's behavior exactly as in 003**: wrap-around, caption sync, arrow keys,
        Escape, no prev/next for a single photo.
      — depends on T018 (same file).
- [X] T028 [P] [US3] Update `src/pages/photos/[album].astro` and `src/pages/es/photos/[album].astro`:
      add a `photos.back` link → locale `/photos/` above `<PageTitle text={album.data.title}
      meta={plural(locale,'photos.count', album.data.photos.length)} />`. The album title keeps the
      blue trailing period, like every other page title in the design.
- [X] T029 [P] [US3] Create `src/components/NowTimeline.astro` (FR-024, Site Pages §5). Props:
      `entries`, `locale`. Move the sort, latest/prior split and `render()` logic here from the two
      Now pages, using `formatDate` from `src/lib/format.ts`.
      - 760px column. The latest update sits in a `.card` with a date chip (`--blue-soft`
        background, `--blue-ink` text, 7px `--blue` dot), a serif `<h2>` title and the rendered
        content.
      - Then, only if prior entries exist, the label `now.earlier` (13px uppercase, letter-spacing
        .08em, `--muted`) over native `<details>` rows. Each `<summary>` holds the date (`--muted`)
        and the title (serif 20px), plus a 32px round +/− indicator in `--blue-ink` drawn with a
        CSS pseudo-element on `summary` that switches on `details[open]`. Use no `name` attribute
        and no JS (003 contract §B).
- [X] T030 [US3] Rewrite `src/pages/now/index.astro` and `src/pages/es/now/index.astro` to
      `getCollection('now', …)` for their locale and render `<PageTitle text={t(locale,'nav.now')}
      />` plus `<NowTimeline entries={entries} locale=… />`. Delete their inline markup, styles and
      `formatDate`. Document titles are "Now — David Cadavid" / "Ahora — David Cadavid" — depends
      on T029.
- [X] T031 [P] [US3] Rewrite the markup and CSS of `src/components/ContactSection.astro` (FR-025,
      Site Pages §6).
      - Flex with `flex-wrap: wrap-reverse` so the image sits above the text on phones.
      - Text column: a slot for the page's title and intro, then a `.card` of 4 link rows. Each
        row has a 44px `--blue` icon circle holding the **existing** inline SVG icons in
        `--on-blue`, the platform label (16px/500) over the handle (14px `--muted`), and an
        `aria-hidden` "↗" in `--faint`. Keep `contactLinks`, `contactLinkUrl` and the aria labels.
      - Image column: the existing `contact-photo.svg` at 4:5, radius 20, inside a `--blue` frame
        (`--shadow-photo`) with `.anim-slide-right .delay-3`.
- [X] T032 [US3] Update `src/pages/contact/index.astro` and `src/pages/es/contact/index.astro`: pass
      `<PageTitle text={t(locale,'nav.contact')} />` and the intro paragraph (local copy
      `contact.intro` EN/ES from `contracts/ui-copy.md`, `--muted`, max 560px) into
      `<ContactSection>`. Remove the old `.page-title` CSS — depends on T031.

**Checkpoint**: Run quickstart Scenario 3. Re-run 003's photo-viewer and Now-accordion checks.
Click all four contact links in both languages.

---

## Phase 6: User Story 4 - Restyled Sales, empty states and Easter egg (Priority: P4)

**Goal**: The gate and catalog in the new look with position dots, the no-JS card, the illustrated
empty states and the Easter egg.

**Independent Test**: quickstart.md Scenario 4.

- [X] T033 [US4] Restyle `src/components/SalesGate.astro` (FR-026, FR-027; contract §D; Site Pages
      §7–§8).
      - **Gate**: a `.card` in a 440px column with a 60px `--blue-soft` lock icon drawn in CSS
        (`aria-hidden`), the label, a 52px input (radius 14, `--bg` fill, `--line` border, focus
        `box-shadow: 0 0 0 3px var(--blue-soft)` with a `--blue` border), the error text in
        `--danger`, and a 52px `.btn-blue` Unlock. On a wrong password, add class `is-invalid` (a
        `--danger` border) and `aria-invalid="true"`. Clear both on the next submit.
      - **Catalog**: the same card grid as `AlbumGrid`. Each item has a 4:3 photo (radius 20, click
        opens the existing viewer), a control row with 36px `--blue` prev/next buttons and one 7px
        dot per photo, a name in serif 21px, the price in 16px/600 `--blue-ink`, and the
        description.
      - In `renderItem()`, create the dots only inside the existing `if (item.photos.length > 1)`
        branch. Update the active dot (`--blue`, others `--line`) in the existing prev/next
        handlers from `current`.
      - **Viewer** (`.sg-modal`, `SalesGate`'s own photo viewer, separate from `PhotoLightbox`;
        `/speckit-analyze` finding C2): restyle it to match T027 exactly. Backdrop
        `--backdrop`; image radius 14; prev/next 44px round `--blue` buttons with `--on-blue`
        glyphs; caption in `--on-backdrop` 14px; × close in `--on-backdrop`. Only CSS and markup
        change.
      - Keep the password check, `sessionStorage`, `salesPageSize`, Load More (restyled
        `.btn-blue`) and 003's viewer logic (`openModal`, `showAt`, `hidden` toggling, arrow
        keys, Escape) unchanged.
- [X] T034 [P] [US4] Restyle `src/components/SalesNoScript.astro` (FR-028, Site Pages §9): a centred
      480px `.card` with a 48px `--blue-soft` circle containing "!" in `--blue-ink`
      (`aria-hidden`) above the existing message. Keep `<noscript>` and the EN/ES copy.
- [X] T035 [P] [US4] Update `src/pages/sales/index.astro` and `src/pages/es/sales/index.astro`:
      `<PageTitle text="Sales" />` / `<PageTitle text="Ventas" />`, content in a centred 440px
      column, and remove the old `.page-title` CSS. Keep `noindex`.
- [X] T036 [US4] In `src/components/BlogList.astro`, replace the oven `<svg>` (which holds
      hard-coded hex colors) with a CSS-shape oven in `--blue` / `--surface` inside a centred `.card`
      whose glow dot uses the `glow` animation (1.6s, motion-gated), per Site Pages §10. Keep the
      existing message, now read from `t(locale,'blog.empty')` (same text, moved to `ui.ts` so
      T017 can share it), and `role="status"` (FR-029) — depends on T022 (same file).
- [X] T037 [US4] In `src/components/PhotoLightbox.astro`, replace the empty-state camera `<svg>`
      (hard-coded hex) with a CSS-shape camera in `--blue` whose lens pulses (`pulse`,
      motion-gated) inside a centred `.card`, per Site Pages §11. Keep the "Development in process…"
      / "En proceso de revelado…" message and `role="status"` — depends on T027 (same file).
- [X] T038 [P] [US4] Rewrite `src/pages/easter-egg/index.astro` and
      `src/pages/es/easter-egg/index.astro` (FR-030, Site Pages §12). Render a CSS-shape egg in
      `--surface` with a `--line` outline that wobbles (`wobble`, 2.4s, motion-gated), a serif `<h1>`
      with `egg.title` and a `--blue` accent, and a `.btn-surface` `egg.back` → locale Home. Use
      local EN/ES copy from `contracts/ui-copy.md`. **Keep `noindex={true}`** and the page's
      absence from nav and sitemap.

**Checkpoint**: Run quickstart Scenario 4, including JS disabled on `/sales/`.

---

## Phase 7: User Story 5 - Friendly error and maintenance pages (Priority: P5)

**Goal**: A bilingual 404 page served automatically by GitHub Pages, and a standalone maintenance
page.

**Independent Test**: quickstart.md Scenario 5.

- [X] T039 [P] [US5] Create `src/pages/404.astro` (FR-031, FR-034; contract §F; Site Pages §13;
      copy in `contracts/ui-copy.md` "404 page").
      - `BaseLayout` with `title="Page not found · Página no encontrada — David Cadavid"`,
        `noindex={true}` and `hideLanguageSwitch={true}`.
      - A centred 680px column holding the numeral "4", a ring, then "4": serif `clamp(110px, 16vw,
        210px)`. The middle "0" is a `0.72em` circle with a `0.14em` `--blue` border and a `--blue`
        centre dot, pulsing between scale 1 and 0.9 over 2.6s (motion-gated), with `aria-hidden`
        and a visually-hidden "404".
      - The EN `<h1>` (serif `clamp(28px, 3.4vw, 44px)`) and subline in `--muted`.
      - A `--line` divider, then a `<div lang="es">` with the Spanish line (serif 19px) and its
        subline (15px `--muted`).
      - Buttons `.btn-blue` "Go home · Ir al inicio" → `/` and `.btn-surface` "Read the blog ·
        Leer el blog" → `/blog/`.
      - The NavBar mapping already yields no active item for this page (T012).
- [X] T040 [P] [US5] Create `public/maintenance.html` (FR-033; research §15; Site Pages §15). It is
      a fully standalone HTML document and **MUST NOT reference any other site file** (no
      `/_astro/`, no fonts, no `global.css`).
      - Inline `<style>`: `:root { color-scheme: light dark; }` plus **only** the tokens it uses,
        as `light-dark()` copies of `global.css` values, under the comment "Keep in sync with
        src/styles/global.css (plan.md Complexity Tracking)".
      - Fonts: `Georgia, serif` for the wordmark, numeral and headings; `system-ui, sans-serif` for
        text.
      - Content: wordmark "David Cadavid." only, with no nav, switch or toggle. The "5", ring, "3"
        numeral as in T039. The EN heading and subline, then `lang="es"` Spanish lines. A "Reload
        · Recargar" button (`onclick="location.reload()"`) plus a plain `<a href="/">` fallback
        for no-JS.
      - `<html lang="en">`, `<meta name="robots" content="noindex">`, `<title>Maintenance ·
        Mantenimiento — David Cadavid</title>`.
      - The ring pulse is inside `@media (prefers-reduced-motion: no-preference)`.

**Checkpoint**: Run quickstart Scenario 5. Confirm in DevTools that `/maintenance.html` loads no
other files, and that `dist/sitemap-0.xml` has no `/404`.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Whole-site verification of the cross-cutting rules (tokens, contrast, motion,
bilingual copy, privacy) and regressions.

- [X] T041 Literal-color sweep over **code files only**:
      `grep -rnE "#[0-9a-fA-F]{3,8}\b|rgba?\(|oklch\(|hsla?\(|color-mix\(|\b(white|black)\b" src
      --include=*.astro --include=*.css --include=*.ts` should find color values **only** in
      `src/styles/global.css`. Ignore matches in comments, `white-space` and non-color words, and
      fix any real one by moving the value to a token. Two things are exempt: image files
      (`src/assets/**/*.svg`, `*.png`), because their colors are image content rather than
      component styling (`/speckit-analyze` finding I1), and `public/maintenance.html` (plan
      Complexity Tracking). Also confirm `grep -rn "var(--color-" src` is empty and that no
      `--faint` is used as a text `color` outside the decorative cases listed at the top of this
      file.
- [X] T042 Contrast audit (SC-002): run Lighthouse or axe in both `data-theme="light"` and
      `"dark"` on Home, Blog list, a post, Photos, an album with the viewer open, Now, Contact,
      Sales (locked and unlocked), 404 and `/maintenance.html`. Fix every contrast failure by
      pairing tokens (research §4). Do not change token values without the owner's approval
      (constitution design-token rule).
- [X] T043 Run `quickstart.md` Scenarios 1–6 end to end with `npm run build && npm run preview`
      in a real browser, at 1280px and 390px, light and dark, EN and ES. Include reduced motion
      (SC-005), JS disabled, blocked storage and a Network check for 0 third-party requests
      (SC-008). Compare each page side by side with its artboard (SC-001). Fix any mismatch.
- [X] T044 Regression pass (SC-004, FR-035): re-run the quickstart scenarios from
      `specs/003-now-page-photo-nav/quickstart.md` (viewer navigation and keyboard, Now accordion,
      blog page size 6 with Load More, sitemap inclusion of `/now/`) and 001's language-switch,
      translation-pending and sales password/session checks. Confirm 0 English interface strings
      on `/es/` pages (SC-007).
- [X] T045 **Owner review gate (before publishing)**: the owner reviews the proposed Spanish in
      `specs/004-design-restyle/contracts/ui-copy.md` (everything not marked "design"). Apply any
      edits to `src/i18n/ui.ts` and the local copy tables (`ContactSection.astro` intro, Easter
      egg pages), then rebuild and spot-check `/es/`. This is a human step. Implementation can
      finish with it open, but the feature is not published until it is checked (spec Assumptions;
      `/speckit-analyze` finding G1).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: none. T001 and T002 can run together.
- **Foundational (Phase 2)**: depends on Setup (T002 before the T003 build check). **Blocks all
  stories.** T003 → T004 (same file); T005 → T006; T007, T008, T009 are independent of each other
  (T009 needs T003/T004 classes).
- **User stories (Phases 3–7)**: all depend only on Foundational, so they can proceed in priority
  order or in parallel. There are same-file handoffs across stories (below).
- **Polish (Phase 8)**: after every story you intend to ship.

### User Story Dependencies

- **US1 (P1)**: Foundational only. T012 needs T007, T011; T013 needs T002, T010, T012.
- **US2 (P2)**: Foundational only for its own components. T015 needs T001, T014; T019 needs T018;
  T020 needs T015–T017, T019. It works without US1's header, but ship after US1 so Home has the new
  chrome.
- **US3 (P3)**: Foundational only, except **T027 must follow US2's T018** (both edit
  `PhotoLightbox.astro`). T030 needs T029; T032 needs T031.
- **US4 (P4)**: Foundational only, except **T036 follows US3's T022** (`BlogList.astro`) and
  **T037 follows US3's T027** (`PhotoLightbox.astro`).
- **US5 (P5)**: Foundational only. T039 relies on T012's no-active-item mapping, which works
  without it too since the 404 page simply has no match. T040 is fully standalone.

### Parallel Opportunities

- Setup: T001 ∥ T002.
- Foundational: T005 ∥ T007 ∥ T008 in parallel with T003; T009 after T004.
- US1: T010 ∥ T011, then T012, then T013.
- US2: T014 ∥ T016 ∥ T017 ∥ T018; then T015 and T019; then T020; T021 any time after T014.
- US3: T022 ∥ T023 ∥ T024 ∥ T025 ∥ T026 ∥ T029 ∥ T031 (and T028 once PageTitle exists); then T027
  (after T018), T030, T032.
- US4: T034 ∥ T035 ∥ T038 alongside T033; T036/T037 after their US3 predecessors.
- US5: T039 ∥ T040.
- Polish: T041–T044 are verification passes and can run in any order. T045 (owner review) runs
  any time after T007 and the local copy tables exist, and must be done before publishing.

---

## Parallel Example: User Story 3

```bash
# Different files, no unmet dependencies — run together once Phase 2 is done:
Task: "Rewrite list markup/CSS in src/components/BlogList.astro"
Task: "Update post layout in src/pages/blog/[slug].astro and src/pages/es/blog/[slug].astro"
Task: "Restyle cards in src/components/AlbumGrid.astro"
Task: "Create src/components/NowTimeline.astro"
Task: "Rewrite src/components/ContactSection.astro"
# Then, sequentially:
Task: "Restyle viewer in src/components/PhotoLightbox.astro"   # after US2's T018
Task: "Switch Now pages to NowTimeline"                          # after NowTimeline
```

---

## Implementation Strategy

### MVP First (US1)

1. Phase 1 (Setup) → Phase 2 (Foundational): the whole site is recoloured and re-fonted.
2. Phase 3 (US1): new chrome and light/dark theme on every page.
3. **Stop and validate** with quickstart Scenario 1. This is a coherent, shippable first step: the
   new identity and theme site-wide, with page bodies still in their old layouts but new colors.

### Incremental Delivery

1. US1 (chrome + theme) → validate → deploy.
2. US2 (Home) → validate → deploy. This is the highest-visibility page.
3. US3 (Blog, Photos, Now, Contact) → validate → deploy.
4. US4 (Sales, empty states, Easter egg) → validate → deploy.
5. US5 (404, maintenance) → validate → deploy.
6. Phase 8 across everything.

Each increment keeps every existing behavior working (FR-035), so any stopping point is safe to
publish.

---

## Notes

- [P] = different files and no unmet dependency. [USn] traces the task to spec.md.
- Same-file handoffs across stories: `PhotoLightbox.astro` (T018 → T027 → T037) and
  `BlogList.astro` (T022 → T036). Do them in that order.
- `src/styles/global.css` is only edited in Foundational (T003, T004). Per-component styles stay in
  scoped `<style>` blocks.
- Commit after each task or logical group, and validate at every checkpoint.

---

## Phase 9: Convergence

**Purpose**: A gap `/speckit-converge` found in the current code after `/speckit-implement`
completed T001–T044.

- [X] T046 Restore a meaningful, localized alt text on the Contact photo in `src/components/ContactSection.astro` (it is currently `alt=""`, which marks it as decorative; before this feature it was "Placeholder contact image"): EN "Placeholder contact image", ES "Imagen de contacto provisional", via the component's local copy table, and add the ES string to `contracts/ui-copy.md` for the T045 review per FR-035 / Constitution IV (contradicts)
