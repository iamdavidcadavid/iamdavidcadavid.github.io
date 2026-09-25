// Shared EN/ES interface strings (specs/004-design-restyle/contracts/ui-copy.md).
// Component-specific copy stays in each component's own table.

export type Locale = 'en' | 'es';

const en = {
  'nav.home': 'Home',
  'nav.now': 'Now',
  'nav.contact': 'Contact',
  'nav.blog': 'Blog',
  'nav.photos': 'Photos',
  'nav.menuToggle': 'Toggle navigation menu',
  'theme.dark': 'Dark theme',
  'lang.label': 'Language',

  'home.title': 'Hello — I am David',
  'home.subline': 'I build systems, help people grow, and occasionally lend my voice to a story.',
  'home.chip.engineer': 'Systems engineer',
  'home.chip.mentor': 'Mentor',
  'home.chip.speaker': 'Public speaker',
  'home.chip.voice': 'Voice actor',
  'home.about.title': 'A bit about me',
  'home.cta.hello': 'Say hello',
  'home.cta.now': 'What I am up to now',
  'home.photo.alt': 'David Cadavid',
  'home.now.title': 'Now',
  'home.now.more': 'Read more →',
  'home.writing.title': 'Latest writing',
  'home.writing.all': 'All posts →',
  'home.photos.title': 'Photos',
  'home.photos.more': 'See more →',
  'home.photos.empty': 'No photos yet.',
  'pill.enOnly': 'EN only',

  'blog.countOne': '1 post',
  'blog.countOther': '{n} posts',
  'blog.back': '← All posts',
  'blog.backBottom': '← Back to all posts',
  'blog.empty': 'Posts are still in the oven…',

  'photos.countZero': 'In the darkroom',
  'photos.countOne': '1 photo',
  'photos.countOther': '{n} photos',
  'photos.albumsOne': '1 album',
  'photos.albumsOther': '{n} albums',
  'photos.back': '← Photos',

  'now.earlier': 'Earlier updates',

  'viewer.close': 'Close',
  'viewer.prev': 'Previous photo',
  'viewer.next': 'Next photo',
  'viewer.position': 'Photo {i} of {n}',
} as const;

export type UIKey = keyof typeof en;

const es: Record<UIKey, string> = {
  'nav.home': 'Inicio',
  'nav.now': 'Ahora',
  'nav.contact': 'Contacto',
  'nav.blog': 'Blog',
  'nav.photos': 'Fotos',
  'nav.menuToggle': 'Abrir o cerrar el menú',
  'theme.dark': 'Tema oscuro',
  'lang.label': 'Idioma',

  'home.title': 'Hola, soy David',
  'home.subline':
    'Construyo sistemas, ayudo a las personas a crecer y, de vez en cuando, le presto mi voz a una historia.',
  'home.chip.engineer': 'Ingeniero de sistemas',
  'home.chip.mentor': 'Mentor',
  'home.chip.speaker': 'Conferencista',
  'home.chip.voice': 'Actor de voz',
  'home.about.title': 'Un poco sobre mí',
  'home.cta.hello': 'Salúdame',
  'home.cta.now': 'En qué ando ahora',
  'home.photo.alt': 'David Cadavid',
  'home.now.title': 'Ahora',
  'home.now.more': 'Leer más →',
  'home.writing.title': 'Lo último que escribí',
  'home.writing.all': 'Todas las entradas →',
  'home.photos.title': 'Fotos',
  'home.photos.more': 'Ver más →',
  'home.photos.empty': 'Aún no hay fotos.',
  'pill.enOnly': 'Solo en inglés',

  'blog.countOne': '1 entrada',
  'blog.countOther': '{n} entradas',
  'blog.back': '← Todas las entradas',
  'blog.backBottom': '← Volver a todas las entradas',
  'blog.empty': 'Las publicaciones todavía se están horneando…',

  'photos.countZero': 'En el cuarto oscuro',
  'photos.countOne': '1 foto',
  'photos.countOther': '{n} fotos',
  'photos.albumsOne': '1 álbum',
  'photos.albumsOther': '{n} álbumes',
  'photos.back': '← Fotos',

  'now.earlier': 'Actualizaciones anteriores',

  'viewer.close': 'Cerrar',
  'viewer.prev': 'Foto anterior',
  'viewer.next': 'Foto siguiente',
  'viewer.position': 'Foto {i} de {n}',
};

export const ui: Record<Locale, Record<UIKey, string>> = { en, es };

// The type above already requires every key in both languages; this also fails the build
// if a key is ever added to one language only via a cast or `any`.
const missing = (Object.keys(en) as UIKey[]).filter((k) => !es[k]);
if (missing.length > 0) {
  throw new Error(`ui.ts: Spanish copy missing for ${missing.join(', ')}`);
}

export function t(locale: string, key: UIKey, vars?: Record<string, string | number>): string {
  const table = ui[locale === 'es' ? 'es' : 'en'];
  let text = table[key];
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replace(`{${name}}`, String(value));
    }
  }
  return text;
}

type PluralBase = 'blog.count' | 'photos.count' | 'photos.albums';

export function plural(locale: string, base: PluralBase, n: number): string {
  if (n === 0 && base === 'photos.count') return t(locale, 'photos.countZero');
  const key = `${base}${n === 1 ? 'One' : 'Other'}` as UIKey;
  return t(locale, key, { n });
}
