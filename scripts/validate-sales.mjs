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
/** Item IDs of each file that passed its own check, keyed by file path. */
const idsByFile = new Map();

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
      idsByFile.set(file, result.data.map((item) => item.id));
    }
  } catch (err) {
    hadError = true;
    console.error(`✗ Could not read/parse ${file}: ${err.message}`);
  }
}

const fileName = (file) => file.split('/').pop();

// Each ID may appear only once per catalogue.
let hasDuplicates = false;
for (const [file, ids] of idsByFile) {
  const counts = new Map();
  for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);
  for (const [id, count] of counts) {
    if (count > 1) {
      hadError = true;
      hasDuplicates = true;
      console.error(`✗ item "${id}" appears more than once in ${fileName(file)}`);
    }
  }
}

// Both languages must list the same items (Constitution II: bilingual parity). Only checked
// when both files passed on their own and have no duplicates, so one problem isn't reported
// twice (or next to a misleading ✓).
if (idsByFile.size === files.length && !hasDuplicates) {
  const [enFile, esFile] = files;
  const enIds = new Set(idsByFile.get(enFile));
  const esIds = new Set(idsByFile.get(esFile));
  let parityOk = true;
  for (const [fromFile, fromIds, toFile, toIds] of [
    [enFile, enIds, esFile, esIds],
    [esFile, esIds, enFile, enIds],
  ]) {
    for (const id of fromIds) {
      if (!toIds.has(id)) {
        parityOk = false;
        console.error(`✗ item "${id}" is in ${fileName(fromFile)} but missing from ${fileName(toFile)}`);
      }
    }
  }
  if (parityOk) {
    console.log(`✓ EN and ES catalogues list the same ${enIds.size} item(s)`);
  } else {
    hadError = true;
  }
}

if (hadError) {
  process.exit(1);
}
