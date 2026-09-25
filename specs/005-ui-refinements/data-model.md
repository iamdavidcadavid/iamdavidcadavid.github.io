# Phase 1 Data Model: UI Refinements

This feature adds no entities and changes no content schema.

| Item | Change |
|---|---|
| Theme preference (`localStorage.theme`) | No change: allowed values stay `"light"` / `"dark"`, and absent means follow the device. Only the control that writes it changes (see [interaction-contract.md](./contracts/interaction-contract.md) §D). |
| Home photo pool | No change: same build-time pool and random pick; the tiles are now plain images. |
| Contact link (`site.ts` → `contactLinks`) | LinkedIn `username` changes from `cadaviddavid` to `iamdavidcadavid`. The link and the displayed handle both derive from this one value. |
| Now update (`src/content/now/en/latest-update.md`) | The title text changes to "[PLACEHOLDER] What I am up to now". The schema is unchanged. |
