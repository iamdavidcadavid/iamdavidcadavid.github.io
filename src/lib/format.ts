// Date and excerpt helpers shared by pages and components.

type DateStyle = 'long' | 'medium' | 'short';

const dateOptions: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  long: { year: 'numeric', month: 'long', day: 'numeric' },
  medium: { year: 'numeric', month: 'short', day: 'numeric' },
  short: { month: 'short', day: 'numeric' },
};

// Content dates are plain YYYY-MM-DD values that parse as UTC midnight; formatting them in
// UTC keeps visitors west of UTC from seeing the previous day.
export function formatDate(date: Date, locale: string, style: DateStyle): string {
  return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    ...dateOptions[style],
    timeZone: 'UTC',
  });
}

export function excerptFor(body: string | undefined, maxLines = 3): string {
  if (!body) return '';
  const lines = body
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#'));
  return lines.slice(0, maxLines).join(' ');
}

// Content files wrap sentences across lines, so a summary must take the whole first
// paragraph (up to the first blank line) rather than the first line.
export function firstParagraph(body: string | undefined): string {
  if (!body) return '';
  const lines = body.split('\n').map((l) => l.trim());
  const collected: string[] = [];
  for (const line of lines) {
    if (line.length === 0) {
      if (collected.length > 0) break;
      continue;
    }
    if (collected.length === 0 && line.startsWith('#')) continue;
    collected.push(line);
  }
  return collected.join(' ');
}
