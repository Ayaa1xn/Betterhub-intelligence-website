import type { SiteContent } from '../src/types';

export function toPublicSiteContent(content: SiteContent): SiteContent {
  return {
    ...content,
    blogPosts: content.blogPosts.filter((post) => post.status === 'published'),
    careerRoles: content.careerRoles.filter((role) => role.isOpen),
  };
}
