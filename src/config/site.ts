export const blogPageSize = 6;
export const salesPageSize = 5;

// Front-end-only gate (see spec.md Assumptions) — not a secret, ships in the built
// JS bundle. The site owner should replace this placeholder before publishing.
export const salesPassword = 'ventascadavid';

export type ContactPlatform = 'linkedin' | 'github' | 'youtube' | 'email';

export interface ContactLink {
  platform: ContactPlatform;
  // For 'email', this holds the address itself rather than a handle.
  username: string;
}

export const contactEmail = 'contact@davidcadavid.com';

export const contactLinks: ContactLink[] = [
  { platform: 'linkedin', username: 'iamdavidcadavid' },
  { platform: 'github', username: 'iamdavidcadavid' },
  { platform: 'youtube', username: 'iamdavidcadavid' },
  { platform: 'email', username: contactEmail },
];

export function contactLinkUrl(link: ContactLink): string {
  switch (link.platform) {
    case 'linkedin':
      return `https://www.linkedin.com/in/${link.username}`;
    case 'github':
      return `https://github.com/${link.username}`;
    case 'youtube':
      return `https://www.youtube.com/@${link.username}`;
    case 'email':
      return `mailto:${link.username}`;
  }
}
