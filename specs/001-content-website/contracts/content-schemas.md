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
allowed to lag), but per FR-010/Principle II it MUST be visibly flagged rather than silently
producing a broken link or an empty page in the other language — for blog posts, via
`translationPending: true` on whichever language exists; for albums, the missing-language page
should render a clear "not yet available in this language" state rather than a 404, since the
route itself (`/es/photos/`) always exists (routing is per-page, not per-entry).
