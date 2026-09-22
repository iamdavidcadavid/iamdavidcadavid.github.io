# Routing Contract

Every URL the built site exposes, and what MUST be true about each one. This is the contract
that `quickstart.md`'s validation scenarios check against.

## Public, navigable, indexable routes

| English URL | Spanish URL | In nav? | In sitemap? |
|---|---|---|---|
| `/` | `/es/` | Yes (Home) | Yes |
| `/#about` | `/es/#about` | Yes (About, anchor on Home per FR-018) | Yes (as `/`) |
| `/#contact` | `/es/#contact` | Yes (Contact, anchor on Home per FR-018) | Yes (as `/`) |
| `/blog/` | `/es/blog/` | Yes | Yes |
| `/blog/<post-slug>/` (one per `blog` entry) | `/es/blog/<post-slug>/` | No (reached via `/blog/`, not its own nav item) | Yes |
| `/photos/` | `/es/photos/` | Yes | Yes |
| `/photos/<album-slug>/` (one per `albums` entry) | `/es/photos/<album-slug>/` | No (reached via `/photos/`, not its own nav item) | Yes |

Every row exists in both languages; `LanguageSwitch.astro` on any of these pages links to the
same row's other-language column (FR-011), via `getRelativeLocaleUrl()`. Individual post/album
pages are "No" under nav only because they aren't top-level nav *items* (there's no menu entry
per post) — they are otherwise ordinary public, indexable, shareable pages (FR-020, FR-028,
SC-009), unlike the hidden routes below.

## Hidden routes (reachable only by direct URL)

| English URL | Spanish URL | In nav? | In sitemap? | robots.txt | `<meta name="robots">` |
|---|---|---|---|---|---|
| `/sales/` | `/es/sales/` | No (FR-003) | No (FR-004) | `Disallow` | `noindex, nofollow` |
| `/easter-egg/` | `/es/easter-egg/` | No (FR-003) | No (FR-004) | `Disallow` | `noindex, nofollow` |

Neither hidden route is linked from `NavBar.astro`, `AboutSection.astro`, `ContactSection.astro`,
or any other component — grep for `sales` / `easter-egg` in `src/components/` and `src/pages/`
(outside the pages themselves) MUST return no matches, as a build-time or review-time check.

## Language switch contract

- On any page, the language-switch control's target MUST be the equivalent URL from the table
  above in the other language column — never just that language's Home page (FR-011).
- The default locale (`en`) is unprefixed; `es` is prefixed with `/es/`
  (`routing: { prefixDefaultLocale: false }`, per research.md §3).

## What is explicitly NOT part of this contract

- Individual Sale items do not get their own routes — all rendered within `/sales/` after the
  password gate, by design (research.md §7 and §11): giving them a URL would mean their data
  has to be reachable/renderable outside the password check, defeating SC-005.
