# UI Copy Contract: Empty States and Polish

All keys live in `src/i18n/ui.ts` (the build fails if a Spanish value is missing).

## Changed

| Key | English | Spanish |
|---|---|---|
| `home.subline` | I build systems, help people grow, create content, and occasionally lend my voice to a story. | Construyo sistemas, ayudo a las personas a crecer, creo contenido y, de vez en cuando, le presto mi voz a una historia. |

## Added

| Key | English | Spanish | Used by |
|---|---|---|---|
| `home.chip.creator` | Content creator | Creador de contenido | Home role tags |
| `home.now.empty` | Nothing new yet. | Aún no hay novedades. | Home Now card |
| `now.empty` | Still figuring out what's next… | Todavía decidiendo qué sigue… | Now page empty state |
| `sales.empty` | The shelves are empty for now… | Los estantes están vacíos por ahora… | Sales empty state |
| `photos.empty` | Development in process… | En proceso de revelado… | Photos page and empty album (moved from `PhotoLightbox`'s local table) |
| `contact.copy` | Copy | Copiar | Copy button visible text |
| `contact.copyLabel` | Copy email address | Copiar dirección de correo | Copy button accessible name |
| `contact.copied` | Copied | Copiado | Button text + live region after success (2s) |
| `contact.copyFailed` | Couldn't copy. Select and copy the address: {email} | No se pudo copiar. Selecciona y copia la dirección: {email} | Visible note + live region on failure; `{email}` is replaced with the address as plain text |

## Removed

None. (`PhotoLightbox`'s local `emptyMessage` table is replaced by `photos.empty`.)
