# UI Copy Contract: Site Design Restyle

Every interface string this feature adds or changes, in English and Spanish. The English text
comes from the design reference. **The Spanish column is a proposed translation for owner review
before publishing** (spec Assumptions), except where marked "design", which comes from the design
reference as-is.

Strings already on the site (placeholder content, sales form labels, Load More, the
translation-pending note, the footer quote, empty-state messages) keep their current EN/ES text.

Keys in `code` live in the shared dictionary `src/i18n/ui.ts`. Keys marked *(local)* stay in
their component's own copy table.

## Chrome

| Key | English | Spanish |
|---|---|---|
| `nav.home` | Home | Inicio |
| `nav.now` | Now | Ahora |
| `nav.contact` | Contact | Contacto |
| `nav.blog` | Blog | Blog |
| `nav.photos` | Photos | Fotos |
| `nav.menuToggle` (aria) | Toggle navigation menu | Abrir o cerrar el menú |
| `theme.light` (aria) | Light theme | Tema claro |
| `theme.dark` (aria) | Dark theme | Tema oscuro |
| `lang.label` (aria) | Language | Idioma |
| wordmark | David Cadavid. | David Cadavid. (not translated) |

## Page titles (H1 + document `<title>`)

| Page | English | Spanish |
|---|---|---|
| Blog | Blog. | Blog. |
| Photos | Photos. | Fotos. |
| Now | Now. | Ahora. |
| Contact | Contact. | Contacto. |
| Sales | Sales. | Ventas. |
| Document titles | "Photos — David Cadavid", etc. | "Fotos — David Cadavid", "Ahora — David Cadavid", etc. (fixes today's English titles on `/es/photos/`, `/es/blog/`) |

## Home

| Key | English | Spanish |
|---|---|---|
| `home.title` | Hello — I'm David. | Hola, soy David. |
| `home.subline` | I build systems, help people grow, and occasionally lend my voice to a story. | Construyo sistemas, ayudo a las personas a crecer y, de vez en cuando, le presto mi voz a una historia. |
| `home.chip.engineer` | Systems engineer | Ingeniero de sistemas |
| `home.chip.mentor` | Mentor | Mentor |
| `home.chip.speaker` | Public speaker | Conferencista |
| `home.chip.voice` | Voice actor | Actor de voz |
| `home.about.title` | A bit about me | Un poco sobre mí |
| `home.cta.hello` | Say hello | Salúdame |
| `home.cta.now` | What I'm up to now | En qué ando ahora |
| `home.photo.alt` | David Cadavid | David Cadavid |
| `home.now.title` | Now | Ahora |
| `home.now.more` | Read more → | Leer más → |
| `home.writing.title` | Latest writing | Lo último que escribí |
| `home.writing.all` | All posts → | Todas las entradas → |
| `pill.enOnly` | EN only | Solo en inglés *(only ever shown on English pages)* |
| `home.photos.title` | Photos | Fotos |
| `home.photos.more` | See more → | Ver más → |
| `home.photos.empty` | No photos yet. | Aún no hay fotos. |

## Blog

| Key | English | Spanish |
|---|---|---|
| `blog.countOne` / `blog.countOther` | 1 post / {n} posts | 1 entrada / {n} entradas |
| `blog.back` | ← All posts | ← Todas las entradas |
| `blog.backBottom` | ← Back to all posts | ← Volver a todas las entradas |
| `blog.empty` | Posts are still in the oven… *(existing text, moved into the shared dictionary)* | Las publicaciones todavía se están horneando… *(existing text)* |

## Photos

| Key | English | Spanish |
|---|---|---|
| `photos.countOne` / `photos.countOther` | 1 photo / {n} photos | 1 foto / {n} fotos |
| `photos.countZero` (album card with no photos, per Site Pages §3) | In the darkroom | En el cuarto oscuro |
| `photos.albumsOne` / `photos.albumsOther` (Photos page count, per Site Pages §3) | 1 album / {n} albums | 1 álbum / {n} álbumes |
| `photos.back` | ← Photos | ← Fotos |

## Now

| Key | English | Spanish |
|---|---|---|
| `now.earlier` | Earlier updates | Actualizaciones anteriores |

## Photo viewers (accessible names; shared by the album and Sales viewers)

| Key | English | Spanish |
|---|---|---|
| `viewer.close` | Close | Cerrar |
| `viewer.prev` | Previous photo | Foto anterior |
| `viewer.next` | Next photo | Foto siguiente |

## Contact *(local)*

| Key | English | Spanish |
|---|---|---|
| `contact.intro` | [PLACEHOLDER: I'd love to hear from you — whether it's about a project, an opportunity, or just to say hello. Here's how to reach me.] *(existing text)* | [MARCADOR DE POSICIÓN: Me encantaría saber de ti — ya sea por un proyecto, una oportunidad o solo para saludar. Así puedes encontrarme.] *(existing text, kept as-is)* |
| `contact.photoAlt` (image alt text) | Placeholder contact image *(existing text)* | Imagen de contacto provisional |

## Easter egg *(local)*

| Key | English | Spanish |
|---|---|---|
| `egg.title` | You found the secret page! | ¡Encontraste la página secreta! |
| `egg.back` | ← Back home | ← Volver al inicio |

## 404 page (bilingual on one page)

| Element | English | Spanish |
|---|---|---|
| Heading | This page doesn't exist. (design) | Esta página no existe. (design) |
| Subline | The link may be broken, or the page may have moved. (design) | Puede que el enlace esté roto o que la página se haya movido. (design) |
| Primary button | Go home · Ir al inicio (design) | *(same button)* |
| Secondary button | Read the blog · Leer el blog | *(same button; Spanish half added for Principle II)* |
| `<title>` | Page not found · Página no encontrada — David Cadavid | *(same)* |

## Maintenance page (bilingual on one page)

| Element | English | Spanish |
|---|---|---|
| Heading | Back in a moment. (design) | Volvemos en un momento. (design) |
| Subline | The site is getting some maintenance. (design) | El sitio está en mantenimiento. (design) |
| Button | Reload · Recargar (design) | *(same button)* |
| `<title>` | Maintenance · Mantenimiento — David Cadavid | *(same)* |
