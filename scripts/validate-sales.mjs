import { readFile } from 'node:fs/promises';
import { z } from 'zod';

const photoSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

const saleItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.string().min(1),
  description: z.string().optional(),
  photos: z.array(photoSchema).min(1),
});

const saleCatalogSchema = z.array(saleItemSchema);

const files = ['public/sales-catalog.en.json', 'public/sales-catalog.es.json'];

let hadError = false;

for (const file of files) {
  try {
    const raw = await readFile(file, 'utf-8');
    const data = JSON.parse(raw);
    const result = saleCatalogSchema.safeParse(data);
    if (!result.success) {
      hadError = true;
      console.error(`✗ ${file} failed validation:`);
      for (const issue of result.error.issues) {
        console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
      }
    } else {
      console.log(`✓ ${file} — ${result.data.length} item(s) valid`);
    }
  } catch (err) {
    hadError = true;
    console.error(`✗ Could not read/parse ${file}: ${err.message}`);
  }
}

if (hadError) {
  process.exit(1);
}
