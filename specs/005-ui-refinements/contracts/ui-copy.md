# UI Copy Contract: UI Refinements

Changes to the shared dictionary `src/i18n/ui.ts` and one content file. Everything else keeps
the feature 004 copy ([004 ui-copy.md](../../004-design-restyle/contracts/ui-copy.md)).

## Changed

| Key / location | English (new) | Spanish |
|---|---|---|
| `home.title` | Hello — I am David *(was "I’m")* | Hola, soy David *(unchanged)* |
| `home.cta.now` | What I am up to now *(was "I’m")* | En qué ando ahora *(unchanged)* |
| `src/content/now/en/latest-update.md` title | [PLACEHOLDER] What I am up to now *(was "I'm")* | *(Spanish file unchanged)* |

## Added

| Key | English | Spanish | Used by |
|---|---|---|---|
| `viewer.position` | Photo {i} of {n} | Foto {i} de {n} | Sales card photo accessible name |

## Removed

| Key | Reason |
|---|---|
| `theme.light` | The theme switch is now one control labelled with `theme.dark` ("Dark theme" / "Tema oscuro"). |
