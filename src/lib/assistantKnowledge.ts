import type { SiteContent } from '../types';

interface KnowledgeChunk {
  id: string;
  title: string;
  body: string;
  category: string;
  path?: string;
}

export interface KnowledgeMatch {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  path?: string;
  score: number;
}

export interface KnowledgeReply {
  lead: string;
  matches: KnowledgeMatch[];
}

export const ASSISTANT_SUGGESTIONS = [
  'Show me BetterHub services',
  'What products does BHI have?',
  'How do I apply for a job?',
  'How can I contact BetterHub?',
];

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'any',
  'are',
  'available',
  'as',
  'about',
  'at',
  'be',
  'by',
  'can',
  'current',
  'currently',
  'do',
  'does',
  'for',
  'from',
  'give',
  'has',
  'have',
  'how',
  'i',
  'in',
  'is',
  'it',
  'list',
  'me',
  'of',
  'offer',
  'on',
  'or',
  'our',
  'please',
  'show',
  'the',
  'tell',
  'to',
  'what',
  'which',
  'with',
  'you',
  'your',
]);

const PLACEHOLDER_DOCS: KnowledgeChunk[] = [
  {
    id: 'placeholder-docs-overview',
    title: 'Future knowledge base documents',
    body:
      'You can add SOPs, company profiles, pricing FAQs, onboarding guides, project delivery policies, support playbooks, and internal service notes here later. This assistant is designed to retrieve from local website content and future document snippets without depending on an online LLM.',
    category: 'Placeholder docs',
  },
];

const GREETING_PATTERNS = [
  /\bhi\b/,
  /\bhello\b/,
  /\bhey\b/,
  /\bgood morning\b/,
  /\bgood afternoon\b/,
  /\bgood evening\b/,
  /\bsalam\b/,
  /\bassalam(?:u alaikum|ualaikum)?\b/,
];

const THANKS_PATTERNS = [/\bthanks\b/, /\bthank you\b/, /\bappreciate it\b/];
const FAREWELL_PATTERNS = [/\bbye\b/, /\bgoodbye\b/, /\bsee you\b/, /\btalk later\b/];
const HELP_PATTERNS = [
  /\bhelp\b/,
  /\bwhat can you do\b/,
  /\bhow can you help\b/,
  /\bwhat do you do\b/,
  /\bmenu\b/,
  /\boptions\b/,
];

export function buildKnowledgeChunks(content: SiteContent): KnowledgeChunk[] {
  const serviceChunks: KnowledgeChunk[] = content.services.map((service) => ({
    id: `service-${service.id}`,
    title: service.title,
    body: [
      'BetterHub service services offering offerings capability capabilities solution solutions',
      service.tagline,
      service.subtitle,
      service.longDescription,
      service.bulletTitle,
      service.bullets.join(' '),
      service.techTitle || '',
      (service.techs || []).join(' '),
      (service.features || [])
        .map((feature) => `${feature.featureTitle} ${feature.description} ${feature.impact}`)
        .join(' '),
    ].join(' '),
    category: 'Service',
    path: `/service/${service.id}`,
  }));

  const productChunks: KnowledgeChunk[] = content.products.map((product) => ({
    id: `product-${product.id}`,
    title: product.title,
    body: [
      'BetterHub product products software platform platforms system systems catalog catalogue offering offerings',
      product.category,
      product.tagline,
      product.subtitle,
      product.longDescription,
      product.features.join(' '),
      product.advantageTitle,
      product.advantages
        .map((advantage) => `${advantage.feature} ${advantage.standard} ${advantage.need}`)
        .join(' '),
      product.processTitle,
      product.processes.join(' '),
    ].join(' '),
    category: 'Product',
    path: `/product/${product.id}`,
  }));

  const careerChunks: KnowledgeChunk[] = content.careerRoles.map((role) => ({
    id: `career-${role.id}`,
    title: role.title,
    body: [
      'BetterHub career careers hiring jobs job openings vacancies recruitment apply application cv resume',
      role.department,
      role.location,
      role.type,
      role.experience,
      role.summary,
      role.requirements.join(' '),
      role.benefits.join(' '),
      role.isOpen ? 'Open role accepting applications now.' : 'Currently closed role.',
    ].join(' '),
    category: 'Hiring',
    path: '/careers',
  }));

  const blogChunks: KnowledgeChunk[] = content.blogPosts.map((post) => ({
    id: `blog-${post.id}`,
    title: post.title,
    body: ['BetterHub blog blogs article articles insights posts', post.summary, stripHtml(post.content), post.category, post.author].join(' '),
    category: 'Blog',
    path: `/blog/${post.id}`,
  }));

  const serviceOverviewChunk: KnowledgeChunk = {
    id: 'service-overview',
    title: `${content.siteSettings.companyName} services overview`,
    body: `BetterHub services include ${content.services.map((service) => service.title).join(', ')}.`,
    category: 'Service',
    path: '/services',
  };

  const productOverviewChunk: KnowledgeChunk = {
    id: 'product-overview',
    title: `${content.siteSettings.companyName} products overview`,
    body: `BetterHub products include ${content.products.map((product) => product.title).join(', ')}.`,
    category: 'Product',
    path: '/products',
  };

  const careerOverviewChunk: KnowledgeChunk = {
    id: 'career-overview',
    title: `${content.siteSettings.companyName} careers overview`,
    body: `BetterHub careers and hiring include ${content.careerRoles.map((role) => role.title).join(', ')}.`,
    category: 'Hiring',
    path: '/careers',
  };

  const blogOverviewChunk: KnowledgeChunk = {
    id: 'blog-overview',
    title: `${content.siteSettings.companyName} blog overview`,
    body: `BetterHub blog posts include ${content.blogPosts.map((post) => post.title).join(', ')}.`,
    category: 'Blog',
    path: '/blog',
  };

  const contactChunk: KnowledgeChunk = {
    id: 'contact-details',
    title: `${content.siteSettings.companyName} contact details`,
    body: [
      content.siteSettings.contactEmail,
      content.siteSettings.phone,
      content.siteSettings.whatsapp,
      content.siteSettings.officeLabel,
      content.siteSettings.officeAddressLines.join(' '),
      content.siteSettings.officeHours,
      'Contact the BetterHub team for enquiries, consultations, sales, and project discussions.',
    ].join(' '),
    category: 'Contact',
    path: '/contact',
  };

  return [
    serviceOverviewChunk,
    ...serviceChunks,
    productOverviewChunk,
    ...productChunks,
    careerOverviewChunk,
    ...careerChunks,
    blogOverviewChunk,
    ...blogChunks,
    contactChunk,
    ...PLACEHOLDER_DOCS,
  ];
}

export function searchKnowledge(chunks: KnowledgeChunk[], query: string): KnowledgeMatch[] {
  const cleanedQuery = query.trim();
  if (!cleanedQuery) {
    return [];
  }

  const normalizedQuery = normalizeRetrievalText(cleanedQuery);
  const tokens = tokenize(cleanedQuery);

  return chunks
    .map((chunk) => {
      const title = normalizeRetrievalText(chunk.title);
      const body = normalizeRetrievalText(chunk.body);
      let score = 0;

      if (title.includes(normalizedQuery)) {
        score += 18;
      }

      if (body.includes(normalizedQuery)) {
        score += 12;
      }

      for (const token of tokens) {
        if (title.includes(token)) {
          score += 5;
        }
        if (body.includes(token)) {
          score += 2;
        }
        if (chunk.category.toLowerCase().includes(token)) {
          score += 1;
        }
      }

      return {
        id: chunk.id,
        title: chunk.title,
        excerpt: createExcerpt(chunk.body, tokens),
        category: chunk.category,
        path: chunk.path,
        score,
      };
    })
    .filter((chunk) => chunk.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);
}

export function answerKnowledgeQuery(chunks: KnowledgeChunk[], query: string): KnowledgeReply {
  const normalizedQuery = normalizeText(query);

  if (isBroadCatalogQuestion(normalizedQuery) && isProductQuestion(normalizedQuery)) {
    const productMatches = getCategoryMatches(chunks, 'Product', 4);
    return {
      lead: productMatches.length
        ? `BetterHub currently has ${formatTitleList(productMatches.map((match) => match.title))}.`
        : 'BetterHub currently has products listed in the Products section.',
      matches: productMatches,
    };
  }

  if (isBroadCatalogQuestion(normalizedQuery) && isServiceQuestion(normalizedQuery)) {
    const serviceMatches = getCategoryMatches(chunks, 'Service', 4);
    return {
      lead: serviceMatches.length
        ? `BetterHub currently offers ${formatTitleList(serviceMatches.map((match) => match.title))}.`
        : 'BetterHub currently offers services listed in the Services section.',
      matches: serviceMatches,
    };
  }

  if (isBroadCatalogQuestion(normalizedQuery) && isCareerQuestion(normalizedQuery)) {
    const careerMatches = getCategoryMatches(chunks, 'Hiring', 4);
    return {
      lead: careerMatches.length
        ? `BetterHub is currently hiring for ${formatTitleList(careerMatches.map((match) => match.title))}.`
        : 'BetterHub careers are available in the Careers section.',
      matches: careerMatches,
    };
  }

  if (isShortIntentMessage(normalizedQuery, GREETING_PATTERNS, 6)) {
    return {
      lead:
        'Hello. I can help with BetterHub services, products, careers, blog posts, and contact details. Ask me a direct question or use one of the quick prompts below.',
      matches: [],
    };
  }

  if (isShortIntentMessage(normalizedQuery, THANKS_PATTERNS, 8)) {
    return {
      lead:
        'You are welcome. If you want, I can help you find services, products, hiring information, blog posts, or contact details next.',
      matches: [],
    };
  }

  if (isShortIntentMessage(normalizedQuery, FAREWELL_PATTERNS, 8)) {
    return {
      lead: 'Any time. Come back whenever you want to check services, products, careers, or contact details.',
      matches: [],
    };
  }

  if (containsPattern(normalizedQuery, HELP_PATTERNS)) {
    return {
      lead:
        'I can help you find BetterHub services, products, hiring details, blog content, and contact information, and I can point you to the right page on the site.',
      matches: [],
    };
  }

  const matches = searchKnowledge(chunks, query);

  if (!matches.length || matches[0].score < 3) {
    return {
      lead:
        'I do not have a confident answer for that yet. Right now I can help best with BetterHub services, products, careers, blog posts, and contact details.',
      matches: [],
    };
  }

  if (isCareerQuestion(normalizedQuery)) {
    return {
      lead:
        'The Careers section is the right place for this. You can review active roles there and submit application details through the website.',
      matches,
    };
  }

  if (isContactQuestion(normalizedQuery)) {
    return {
      lead:
        'The Contact section is the best source for this. I found the most relevant BetterHub contact pages and details below.',
      matches,
    };
  }

  if (isBlogQuestion(normalizedQuery)) {
    return {
      lead:
        'I found the most relevant published content for that question. You can open any matching article or related page below.',
      matches,
    };
  }

  if (isServiceQuestion(normalizedQuery)) {
    return {
      lead: 'I found the most relevant BetterHub service pages for your question.',
      matches,
    };
  }

  if (isProductQuestion(normalizedQuery)) {
    return {
      lead: 'I found the most relevant BetterHub product pages for your question.',
      matches,
    };
  }

  return {
    lead:
      matches.length === 1
        ? 'I found one relevant BetterHub page that should help.'
        : 'I found a few relevant BetterHub pages that should help with this.',
    matches,
  };
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeText(value: string) {
  return normalizeRetrievalText(value);
}

function normalizeRetrievalText(value: string) {
  return value
    .toLowerCase()
    .replace(/\bbetter[\s-]?hub(?:ai| intelligence)?\b/g, 'betterhub')
    .replace(/\bbhi\b/g, 'betterhub')
    .replace(/[^a-z0-9\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function containsPattern(value: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(value));
}

function isShortIntentMessage(value: string, patterns: RegExp[], maxWords: number) {
  if (!value) {
    return false;
  }

  const wordCount = value.split(/\s+/).filter(Boolean).length;
  return wordCount <= maxWords && containsPattern(value, patterns);
}

function tokenize(value: string) {
  const baseTokens = normalizeRetrievalText(value)
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));

  const expandedTokens = baseTokens.flatMap((token) => {
    const variants = [token];

    if (token.endsWith('ies') && token.length > 4) {
      variants.push(`${token.slice(0, -3)}y`);
    } else if (token.endsWith('s') && token.length > 3) {
      variants.push(token.slice(0, -1));
    }

    return variants;
  });

  return Array.from(new Set(expandedTokens));
}

function createExcerpt(body: string, tokens: string[]) {
  const plainBody = stripHtml(body);
  if (!plainBody) {
    return 'No preview is available for this item yet.';
  }

  const normalizedBody = plainBody.toLowerCase();
  const matchedToken = tokens.find((token) => normalizedBody.includes(token));
  if (!matchedToken) {
    return truncate(plainBody, 190);
  }

  const startIndex = Math.max(0, normalizedBody.indexOf(matchedToken) - 55);
  return truncate(plainBody.slice(startIndex), 190);
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength).trim()}...` : value;
}

function isCareerQuestion(value: string) {
  return /\b(career|careers|job|jobs|apply|application|hiring|vacancy|vacancies|cv|resume)\b/.test(value);
}

function isContactQuestion(value: string) {
  return /\b(contact|email|phone|call|whatsapp|office|address|reach)\b/.test(value);
}

function isBlogQuestion(value: string) {
  return /\b(blog|blogs|article|articles|insight|insights|post|posts)\b/.test(value);
}

function isServiceQuestion(value: string) {
  return /\b(service|services|solution|solutions|seo|web|app|network|infrastructure|automation)\b/.test(value);
}

function isProductQuestion(value: string) {
  return /\b(product|products|hrms|his|erp|ems|pos|platform)\b/.test(value);
}

function isBroadCatalogQuestion(value: string) {
  return /\b(what|which|show|list|have|has|offer|available|current|currently)\b/.test(value);
}

function getCategoryMatches(chunks: KnowledgeChunk[], category: string, limit: number) {
  return chunks
    .filter((chunk) => chunk.category === category && !chunk.id.endsWith('-overview'))
    .slice(0, limit)
    .map((chunk) => ({
      id: chunk.id,
      title: chunk.title,
      excerpt: createExcerpt(chunk.body, tokenize(chunk.body).slice(0, 3)),
      category: chunk.category,
      path: chunk.path,
      score: 999,
    }));
}

function formatTitleList(titles: string[]) {
  if (!titles.length) {
    return 'products and services listed on the website';
  }

  if (titles.length === 1) {
    return titles[0];
  }

  if (titles.length === 2) {
    return `${titles[0]} and ${titles[1]}`;
  }

  return `${titles.slice(0, -1).join(', ')}, and ${titles[titles.length - 1]}`;
}
