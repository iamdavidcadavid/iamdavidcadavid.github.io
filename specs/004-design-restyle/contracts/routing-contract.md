# Routing Contract Deltas: Site Design Restyle

All routes from features 001–003 keep their URLs. This feature adds two files at the site root and
changes how the navigation marks the current page.

## New outputs

| Output | Source | Served when | In sitemap? | Indexed? | Language switch |
|---|---|---|---|---|---|
| `/404.html` | `src/pages/404.astro` | GitHub Pages serves it automatically for any missing path, including under `/es/` | No (explicit sitemap filter) | No (`noindex`) | None (EN + ES shown together) |
| `/maintenance.html` | `public/maintenance.html` (copied verbatim) | Only when the owner publishes it by hand. Never automatic on GitHub Pages. | No (not a page route) | No (`noindex` meta) | None (EN + ES shown together) |

No 500 page is built (spec FR-032).

## Sitemap filter

```text
exclude if the path contains: /sales/, /easter-egg/, /404
```

`/404` is added explicitly rather than relying on the sitemap integration's defaults.

## Active navigation mapping

The locale-agnostic path is the URL path with a leading `/es` removed. Its first segment decides
which nav item is active (rendered with `aria-current="page"`).

| First segment | Example paths | Active item (EN / ES) |
|---|---|---|
| *(empty)* | `/`, `/es/` | Home / Inicio |
| `now` | `/now/`, `/es/now/` | Now / Ahora |
| `contact` | `/contact/` | Contact / Contacto |
| `blog` | `/blog/`, `/blog/<slug>/` | Blog / Blog |
| `photos` | `/photos/`, `/photos/<album>/` | Photos / Fotos |
| `sales`, `easter-egg`, `404`, anything else | `/sales/`, `/es/easter-egg/` | none |

## Navigation order

Unchanged from 003: Home → Now → Contact → Blog → Photos. Labels are localized on Spanish pages
(spec FR-014): Inicio → Ahora → Contacto → Blog → Fotos.

## Language switch targets

Unchanged logic from 001: strip `/es`, rebuild with the other locale. Rendered as `EN / ES`, with
the current locale emphasized, in the desktop header and at the bottom of the mobile menu. Hidden
on translation-pending posts, the 404 page and the maintenance page.

## Home links

| Element | Target |
|---|---|
| Wordmark (every page) | Locale Home (`/` or `/es/`) |
| "Say hello" | Locale Contact |
| "What I'm up to now", Now card "Read more" | Locale Now |
| Latest writing rows | The post's locale URL |
| "All posts" | Locale Blog |
| "See more" (Photos card) | Locale Photos |
