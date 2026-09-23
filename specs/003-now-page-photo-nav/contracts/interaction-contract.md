# Interaction Contract: Enlarged Photo Navigation & Now Page Accordion

This is a static site with no network APIs; the "contracts" below define the observable
behavior — the UI/DOM contract — that both enlarged-photo-view implementations
(`PhotoLightbox.astro` for the Photos page, `SalesGate.astro` for the Sales page) and the Now
page's accordion MUST satisfy identically, so the two galleries feel like one consistent feature.

## A. Enlarged photo view — shared behavior contract

Applies to both `PhotoLightbox.astro`'s `.modal` and `SalesGate.astro`'s `.sg-modal`.

**Preconditions**: An album (Photos) or item (Sales) with `N` photos, `N >= 1`, is being viewed
in its enlarged view (previously "the modal").

**State**: `currentIndex` (0-based, into that album's/item's own photo list — never across
albums/items) and `photos` (that album's/item's own photo list, each `{ src, alt }`).

**Rendering rule**:
- If `N > 1`: previous and next controls (buttons, one pointing "‹", one "›") and a caption
  element MUST be present. The caption element MUST render `photos[currentIndex].alt`.
- If `N === 1`: previous/next controls MUST NOT be present in the DOM (not merely visually
  hidden). The caption element MAY still be present, showing the single photo's alt text (FR-005
  applies regardless of photo count; FR-004's "no arrows" is specifically about the prev/next
  controls, not the caption).

**Behavior — activating "next"**:
1. `currentIndex := (currentIndex + 1) mod N`
2. The displayed image updates to `photos[currentIndex].src` / `.alt`.
3. The caption updates to `photos[currentIndex].alt`.
4. The enlarged view remains open throughout — it MUST NOT close and reopen.

**Behavior — activating "previous"**: identical to "next" but
`currentIndex := (currentIndex - 1 + N) mod N`.

**Behavior — keyboard**: while the enlarged view is open (`!modal.hidden`) and `N > 1`,
`ArrowRight` triggers the same effect as activating "next"; `ArrowLeft` triggers the same effect
as activating "previous". `Escape` continues to close the view (pre-existing behavior, unchanged).
Arrow-key handling MUST NOT fire when `N === 1` (there is nothing to navigate to) or when the
enlarged view is closed.

**Behavior — opening**: opening any thumbnail/slide sets `currentIndex` to that photo's position
within its own album's/item's photo list (not necessarily `0` — e.g. opening the second thumbnail
opens directly on `currentIndex = 1`).

**Non-goals**: navigating across different albums/items from within one enlarged view (the
contract is scoped to one album's/item's own photo list); this feature does not add a way to jump
from the last photo of album A into album B.

## B. Now page accordion — behavior contract

**Structure**: One always-expanded block for the latest update (not a `<details>` element — it
is not collapsible, it is simply the top of the page), followed by zero or more `<details>`
elements, one per prior update, each with a `<summary>` showing that entry's date and title.

**Behavior — expand/collapse**: Each `<details>` toggles independently via its native `open`
attribute (browser-native behavior — no `name` attribute is set on any of them, so any number may
be open simultaneously). No page reload or client-side script is required for this to function.

**Behavior — zero prior updates**: When only the latest update exists (no prior entries), the
`<details>` list MUST be omitted entirely rather than rendered empty.

**Bilingual contract**: The English page (`/now/`) renders only entries whose collection id starts
with `en/`; the Spanish page (`/es/now/`) renders only entries whose id starts with `es/` — same
filtering convention as `blog`/`albums`.
