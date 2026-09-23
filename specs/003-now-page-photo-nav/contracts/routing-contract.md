# Routing Contract Deltas: Now Page & Photo Navigation Polish

This feature adds two new statically-generated routes and touches no others. All existing
routes from features 001/002 (`/`, `/contact/`, `/blog/`, `/blog/[slug]/`, `/photos/`,
`/photos/[album]/`, `/sales/`, `/easter-egg/`, and their `/es/` equivalents) are unaffected.

## New routes

| Route | Locale | Source file | Indexed / in sitemap? | In primary nav? |
|---|---|---|---|---|
| `/now/` | English (default, unprefixed) | `src/pages/now/index.astro` | Yes (no `astro.config.mjs` filter change needed — filter only excludes `/sales/`, `/easter-egg/`) | Yes — inserted after "Home" |
| `/es/now/` | Spanish | `src/pages/es/now/index.astro` | Yes | Yes — inserted after "Home" (Spanish label) |

Both routes are plain static pages (`output: 'static'`), generated at build time, with no
dynamic path segments — unlike `/blog/[slug]/` and `/photos/[album]/`, there is no per-entry
route; both languages' Now Update entries render inline on their single respective page.

## Language switch contract

`LanguageSwitch.astro` requires no changes: it already derives the equivalent URL in the other
locale by stripping the `/es` prefix (if present) from `Astro.url.pathname` and rebuilding with
`getRelativeLocaleUrl`. Since `/now/` and `/es/now/` are a direct mirror pair (same path shape as
every other page pair in the site), the existing generic logic produces the correct cross-link
with no special-casing.

## Navigation contract

`NavBar.astro`'s `links` array gains one entry between `Home` and `Contact`:

```text
Home → Now → Contact → Blog → Photos
```

This ordering applies identically in both languages (the array is rebuilt per-locale from the
same structure, each `href` built with `getRelativeLocaleUrl(locale, ...)`).

## Sitemap contract

No change to `astro.config.mjs`. The existing `sitemap({ filter: (page) => !page.includes('/sales/') && !page.includes('/easter-egg/') })`
already includes any page whose path does not contain `/sales/` or `/easter-egg/`, which covers
`/now/` and `/es/now/` by default (FR-015: the Now page must not be excluded from indexing).
