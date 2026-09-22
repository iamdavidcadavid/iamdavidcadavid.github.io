export const blogPageSize = 5;
export const salesPageSize = 5;

// Front-end-only gate (see spec.md Assumptions) — not a secret, ships in the built
// JS bundle. The site owner should replace this placeholder before publishing.
export const salesPassword = 'changeme';

export type ContactPlatform = 'linkedin' | 'github' | 'youtube';

export interface ContactLink {
  platform: ContactPlatform;
  username: string;
}

export const contactLinks: ContactLink[] = [
  { platform: 'linkedin', username: 'cadaviddavid' },
  { platform: 'github', username: 'iamdavidcadavid' },
  { platform: 'youtube', username: 'iamdavidcadavid' },
];

export const contactEmail = 'contact@davidcadavid.com';

export function contactLinkUrl(link: ContactLink): string {
  switch (link.platform) {
    case 'linkedin':
      return `https://www.linkedin.com/in/${link.username}`;
    case 'github':
      return `https://github.com/${link.username}`;
    case 'youtube':
      return `https://www.youtube.com/@${link.username}`;
  }
}
