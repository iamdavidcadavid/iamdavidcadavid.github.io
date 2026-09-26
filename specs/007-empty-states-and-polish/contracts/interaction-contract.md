# Interaction Contract: Empty States and Polish

## A. Empty states (Now, Photos, Sales, album)

| Situation | Required behaviour |
|---|---|
| Section has content | Unchanged. No empty state rendered or visible. |
| Section empty in the current language | Centred card below the page title: illustration (decorative, hidden from screen readers) + message in the page language. The card has `role="status"`. |
| Motion allowed | The illustration's small loop (camera glow, hourglass pulse, tag wobble) plays. |
| Reduced motion | Illustration is static. |
| Sales, empty catalogue | Shown only after unlocking; the password gate is unchanged. No "Load more". |
| Home Now card, no entries | Title, the text "Nothing new yet." / "Aún no hay novedades.", and the card's usual "Read more →" / "Leer más →" link to the Now page. No date. |

## B. Copy-email button (Contact)

| Situation | Required behaviour |
|---|---|
| Page load with JS | A "Copy" / "Copiar" button appears after the email row's address, reachable by Tab, accessible name "Copy email address" / "Copiar dirección de correo". |
| No JS | No button. The email link works as today. |
| Activate (click, tap, Enter, Space) and copy succeeds | Clipboard holds exactly the address. Button text becomes "Copied" / "Copiado" and a polite live region announces it. Both revert after 2s; activating again restarts the 2s. |
| Copy fails / clipboard unavailable | A visible note and the live region say "Couldn't copy. Select and copy the address: contact@davidcadavid.com" (ES: "No se pudo copiar. Selecciona y copia la dirección: …"). The address in the note is plain text (not a link), so it can be selected by dragging or double-click. |
| Click the address itself | Opens the email app (`mailto:`), unchanged. |
| Narrow screens | Address and button wrap without sideways scroll; button ≥ 44px tall. |
| Focus | Visible `:focus-visible` outline on the button. |

## C. Home role tags

Five tags in order: Systems engineer, Mentor, Public speaker, Voice actor, Content creator (ES:
Ingeniero de sistemas, Mentor, Conferencista, Actor de voz, Creador de contenido), each with its
own dot colour. They wrap on narrow screens with no sideways scroll.
