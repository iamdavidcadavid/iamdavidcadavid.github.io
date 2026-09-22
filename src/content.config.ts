import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogSchema = z.object({
  title: z.string().min(1),
  pubDate: z.coerce.date(),
  translationPending: z.boolean().default(false),
});

const photoSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

const albumSchema = z.object({
  title: z.string().min(1),
  cover: photoSchema,
  photos: z.array(photoSchema).default([]),
});

// Both collections are rooted one level above the locale split
// (src/content/blog/{en,es}/*.md, src/content/albums/{en,es}/*.yaml), so each
// entry's `id` is prefixed with its locale (e.g. "en/my-post", "es/my-post").
// Pages filter with `id.startsWith('en/')` / `id.startsWith('es/')` per locale.
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: blogSchema,
});

const albums = defineCollection({
  loader: glob({ base: './src/content/albums', pattern: '**/*.yaml' }),
  schema: albumSchema,
});

export const collections = { blog, albums };
