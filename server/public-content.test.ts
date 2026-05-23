import test from 'node:test';
import assert from 'node:assert/strict';
import { createSiteContentSeed } from '../src/data';
import { toPublicSiteContent } from './public-content';

test('toPublicSiteContent strips draft posts and closed roles', () => {
  const seed = createSiteContentSeed();
  seed.blogPosts = [
    ...seed.blogPosts,
    {
      id: 'draft-post',
      title: 'Draft post',
      summary: 'Draft summary',
      content: '<p>Draft</p>',
      category: 'Drafts',
      publishedAt: '2026-05-23',
      author: 'BetterHub Team',
      readTime: '1 min read',
      status: 'draft',
      image: '/uploads/page-blog-hero.png',
    },
  ];
  seed.careerRoles = [
    ...seed.careerRoles,
    {
      id: 'closed-role',
      title: 'Closed role',
      department: 'Ops',
      location: 'Dubai',
      type: 'Full-Time',
      experience: '3+ years',
      summary: 'Closed summary',
      requirements: ['Req'],
      benefits: ['Benefit'],
      isOpen: false,
    },
  ];

  const publicContent = toPublicSiteContent(seed);

  assert.equal(publicContent.blogPosts.some((post) => post.status === 'draft'), false);
  assert.equal(publicContent.careerRoles.some((role) => role.isOpen === false), false);
});
