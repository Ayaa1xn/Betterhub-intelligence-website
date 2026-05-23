import test from 'node:test';
import assert from 'node:assert/strict';
import { answerKnowledgeQuery, buildKnowledgeChunks, searchKnowledge } from './assistantKnowledge';
import type { SiteContent } from '../types';

const contentFixture: SiteContent = {
  heroSlides: [],
  services: [
    {
      id: 'seo-web-dev',
      title: 'SEO Web Development',
      subtitle: 'Fast, structured websites.',
      longDescription: 'A search-first website delivery service for performance and maintenance.',
      tagline: 'Web foundations built to rank.',
      bulletTitle: 'Capabilities',
      bullets: ['Technical SEO setup', 'Content structure'],
      techTitle: 'Stack',
      techs: ['React', 'TypeScript'],
      features: [{ featureTitle: 'Speed', description: 'Optimised assets', impact: 'Faster pages' }],
      image: '',
    },
  ],
  products: [
    {
      id: 'hrms',
      title: 'AI-Powered HRMS',
      category: 'HR platform',
      subtitle: 'Payroll and workforce workflows.',
      tagline: 'Built for UAE labour operations.',
      longDescription: 'Handles WPS, policies, and employee operations in one place.',
      features: ['Payroll automation', 'WPS compliance'],
      advantageTitle: 'Advantages',
      advantages: [{ feature: 'Compliance', standard: 'WPS workflows', need: 'Safer payroll' }],
      processTitle: 'Delivery',
      processes: ['Discovery', 'Setup'],
      image: '',
    },
  ],
  industries: [],
  testimonials: [],
  blogPosts: [
    {
      id: 'local-rag',
      title: 'Local RAG Guide',
      summary: 'How internal retrieval can work without a hosted LLM.',
      content: '<p>Use document chunks and local search.</p>',
      category: 'AI',
      publishedAt: '2026-05-20',
      author: 'BetterHub Team',
      readTime: '1 min read',
      image: '',
      status: 'published',
    },
  ],
  careerRoles: [
    {
      id: 'frontend-engineer',
      title: 'Frontend Engineer',
      department: 'Engineering',
      location: 'Dubai',
      type: 'Full-Time',
      experience: '3+ years',
      summary: 'Build interfaces and product journeys.',
      requirements: ['React', 'TypeScript'],
      benefits: ['Health cover'],
      isOpen: true,
    },
  ],
  metrics: [],
  pageMedia: {
    servicesCatalogHero: {
      title: 'Services Catalog Hero',
      description: 'Backdrop media used in the services listing page hero section.',
      image: '',
    },
    productsCatalogHero: {
      title: 'Products Catalog Hero',
      description: 'Backdrop media used in the products listing page hero section.',
      image: '',
    },
    industriesHero: {
      title: 'Industries Hero',
      description: 'Backdrop media used in the industries overview page hero section.',
      image: '',
    },
    blogHero: {
      title: 'Blog Hero',
      description: 'Backdrop media used in the blog listing page hero section.',
      image: '',
    },
    careersHero: {
      title: 'Careers Hero',
      description: 'Backdrop media used in the careers page hero section.',
      image: '',
    },
    contactHero: {
      title: 'Contact Hero',
      description: 'Backdrop media used in the contact page hero section.',
      image: '',
    },
    aboutHero: {
      title: 'About Hero',
      description: 'Backdrop media used in the about page hero section.',
      image: '',
    },
  },
  siteSettings: {
    companyName: 'BetterHub Intelligence',
    contactEmail: 'sales@betterhubai.com',
    phone: '+971 4 324 9406',
    whatsapp: '+971565227806',
    officeLabel: 'Deira Office',
    officeAddressLines: ['Deira Dubai'],
    officeHours: 'Mon-Fri 9-6',
  },
};

test('searchKnowledge surfaces the HRMS product for WPS questions', () => {
  const results = searchKnowledge(buildKnowledgeChunks(contentFixture), 'WPS compliance payroll');
  assert.equal(results[0]?.path, '/product/hrms');
});

test('searchKnowledge can retrieve placeholder document guidance', () => {
  const results = searchKnowledge(buildKnowledgeChunks(contentFixture), 'pricing faq documents later');
  assert.equal(results[0]?.category, 'Placeholder docs');
});

test('answerKnowledgeQuery handles greetings gracefully', () => {
  const reply = answerKnowledgeQuery(buildKnowledgeChunks(contentFixture), 'hi');
  assert.match(reply.lead, /hello/i);
  assert.equal(reply.matches.length, 0);
});

test('answerKnowledgeQuery handles thanks without surfacing retrieval cards', () => {
  const reply = answerKnowledgeQuery(buildKnowledgeChunks(contentFixture), 'thank you');
  assert.match(reply.lead, /welcome/i);
  assert.equal(reply.matches.length, 0);
});

test('answerKnowledgeQuery answers broad BHI product questions', () => {
  const reply = answerKnowledgeQuery(buildKnowledgeChunks(contentFixture), 'what products does bhi have');
  assert.match(reply.lead, /AI-Powered HRMS/i);
  assert.equal(reply.matches[0]?.path, '/product/hrms');
});
