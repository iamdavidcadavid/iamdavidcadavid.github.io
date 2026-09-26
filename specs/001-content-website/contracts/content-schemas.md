# Content Schema Contracts

These are the Zod schemas `src/content.config.ts` MUST enforce for each Astro content
collection (see data-model.md for the narrative field descriptions). A content file that fails
its schema MUST fail the Astro build, not ship silently broken.

## `blog` collection

```ts
const blogSchema = z.object({
  title: z.string().min(1),
  pubDate: z.coerce.date(),
  translationPending: z.boolean().default(false),
});
```

## `albums` collection

```ts
const photoSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

const albumSchema = z.object({
  title: z.string().min(1),
  cover: photoSchema,
  photos: z.array(photoSchema).default([]),
});
```

## Sale catalog JSON (`public/sales-catalog.{en,es}.json`)

Not part of the Astro content-collection build pipeline (see research.md §7 for why), so this
schema is not auto-enforced by `astro build`. It is documented here as the contract a
`validate:sales` script (or manual review) checks before each deploy:

```ts
const saleItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.string().min(1),
  description: z.string().optional(),
  photos: z.array(photoSchema).min(1),
});

const saleCatalogSchema = z.array(saleItemSchema);
```

## Locale pairing rule

For every `en/<slug>` content entry, an `es/<slug>` entry (same slug) SHOULD eventually exist
per constitution Principle II. A missing counterpart is **not** a build failure (translation is
allowed to lag), but per Principle II it MUST never be a silent gap. The two collections handle
this differently, deliberately (see research.md §11 for the full rationale):

- **`blog`**: because individual posts are directly shared/bookmarked (FR-020, SC-009), the
  language that *does* have the post MUST say so — set `translationPending: true` on that entry,
  which both the list entry and the post's own page render as a visible "not yet available in
  [other language]" note (FR-027, SC-010). This is a rendering requirement on the component, not
  just a stored flag.
- **`albums`**: an album missing its locale counterpart simply has no generated route in that
  locale (per-locale `getStaticPaths()`, research.md §11) and does not appear in that language's
  grid at all. There is **no** synthetic "not available in this language" page — nothing ever
  links to a route that doesn't exist, so Principle II's "no silent gap" is satisfied by the
  missing album never being surfaced as a broken link in the first place, rather than by an
  explicit in-place message. (An earlier version of this document incorrectly promised such a
  message for albums; corrected during `/speckit-analyze` remediation, finding C2.)
