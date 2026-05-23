import { calculateReadTimeFromHtml, sanitizeRichText } from '../src/lib/richText';
import type {
  BlogPost,
  CareerRole,
  CareerSubmission,
  ContactSubmission,
  MetricStat,
  ProductDetailItem,
  ServiceDetailItem,
  SiteContent,
  SitePageMedia,
  SiteSettings,
  Slide,
  Testimonial,
  IndustryItem,
} from '../src/types';
import { badRequest } from './errors';

type UnknownRecord = Record<string, unknown>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+().\-\s]{6,40}$/;
const INTERNAL_PATH_PATTERN = /^\/[a-z0-9/_-]*$/i;

export function validateContactPayload(payload: unknown) {
  const data = asRecord(payload, 'contact submission');
  rejectHoneypot(data);

  return {
    name: readString(data.name, 'name', { min: 2, max: 120 }),
    email: readEmail(data.email, 'email'),
    phone: readPhone(data.phone, 'phone'),
    subject: readString(data.subject, 'subject', { min: 2, max: 120, fallback: 'General inquiry' }),
    message: readString(data.message, 'message', { min: 0, max: 5000, fallback: '' }),
  } satisfies Omit<ContactSubmission, 'id' | 'type' | 'createdAt'>;
}

export function validateCareerPayload(payload: unknown) {
  const data = asRecord(payload, 'career submission');
  rejectHoneypot(data);

  return {
    roleId: readIdentifier(data.roleId, 'roleId', 'general'),
    roleTitle: readString(data.roleTitle, 'roleTitle', {
      min: 2,
      max: 160,
      fallback: 'General application',
    }),
    name: readString(data.name, 'name', { min: 2, max: 120 }),
    email: readEmail(data.email, 'email'),
    experience: readString(data.experience, 'experience', {
      min: 2,
      max: 80,
      fallback: 'not-specified',
    }),
    portfolio: readUrlLike(data.portfolio, 'portfolio'),
    coverText: readString(data.coverText, 'coverText', { min: 0, max: 8000, fallback: '' }),
  } satisfies Omit<CareerSubmission, 'id' | 'type' | 'createdAt'>;
}

export function validateSiteContentPayload(payload: unknown): SiteContent {
  const data = asRecord(payload, 'site content');

  return {
    heroSlides: readArray(data.heroSlides, 'heroSlides').map((item, index) =>
      sanitizeSlide(item, index),
    ),
    services: readArray(data.services, 'services').map((item, index) =>
      sanitizeService(item, index),
    ),
    products: readArray(data.products, 'products').map((item, index) =>
      sanitizeProduct(item, index),
    ),
    industries: readArray(data.industries, 'industries').map((item, index) =>
      sanitizeIndustry(item, index),
    ),
    testimonials: readArray(data.testimonials, 'testimonials').map((item, index) =>
      sanitizeTestimonial(item, index),
    ),
    blogPosts: readArray(data.blogPosts, 'blogPosts').map((item, index) => sanitizeBlog(item, index)),
    careerRoles: readArray(data.careerRoles, 'careerRoles').map((item, index) =>
      sanitizeCareerRole(item, index),
    ),
    metrics: readArray(data.metrics, 'metrics').map((item, index) => sanitizeMetric(item, index)),
    siteSettings: sanitizeSiteSettings(data.siteSettings),
    pageMedia: sanitizePageMedia(data.pageMedia),
  };
}

function sanitizeSlide(value: unknown, index: number): Slide {
  const data = asRecord(value, `hero slide ${index + 1}`);
  return {
    id: readIdentifier(data.id, 'slide.id', `slide-${index + 1}`),
    title: readString(data.title, 'slide.title', { min: 3, max: 180 }),
    subtitle: readString(data.subtitle, 'slide.subtitle', { min: 3, max: 1000 }),
    ctaText: readString(data.ctaText, 'slide.ctaText', { min: 2, max: 120 }),
    ctaPath: readInternalPath(data.ctaPath, 'slide.ctaPath'),
    ...sanitizeMediaFields(data, `hero slide ${index + 1}`),
  };
}

function sanitizeService(value: unknown, index: number): ServiceDetailItem {
  const data = asRecord(value, `service ${index + 1}`);
  return {
    id: readIdentifier(data.id, 'service.id', `service-${index + 1}`),
    title: readString(data.title, 'service.title', { min: 3, max: 180 }),
    subtitle: readString(data.subtitle, 'service.subtitle', { min: 3, max: 1000 }),
    longDescription: readString(data.longDescription, 'service.longDescription', {
      min: 3,
      max: 4000,
    }),
    tagline: readString(data.tagline, 'service.tagline', { min: 3, max: 180 }),
    bulletTitle: readString(data.bulletTitle, 'service.bulletTitle', { min: 2, max: 160 }),
    bullets: readStringArray(data.bullets, 'service.bullets', { maxItems: 12, maxLength: 320 }),
    techTitle: readString(data.techTitle, 'service.techTitle', {
      min: 0,
      max: 160,
      fallback: '',
    }),
    techs: readStringArray(data.techs, 'service.techs', { maxItems: 16, maxLength: 120 }),
    features: readArray(data.features, 'service.features').map((feature, featureIndex) => {
      const item = asRecord(feature, `service feature ${featureIndex + 1}`);
      return {
        featureTitle: readString(item.featureTitle, 'service.features.featureTitle', {
          min: 2,
          max: 120,
        }),
        description: readString(item.description, 'service.features.description', {
          min: 2,
          max: 400,
        }),
        impact: readString(item.impact, 'service.features.impact', { min: 2, max: 240 }),
      };
    }),
    ...sanitizeMediaFields(data, `service ${index + 1}`),
  };
}

function sanitizeProduct(value: unknown, index: number): ProductDetailItem {
  const data = asRecord(value, `product ${index + 1}`);
  return {
    id: readIdentifier(data.id, 'product.id', `product-${index + 1}`),
    title: readString(data.title, 'product.title', { min: 3, max: 180 }),
    subtitle: readString(data.subtitle, 'product.subtitle', { min: 3, max: 1000 }),
    category: readString(data.category, 'product.category', { min: 2, max: 120 }),
    tagline: readString(data.tagline, 'product.tagline', { min: 3, max: 180 }),
    longDescription: readString(data.longDescription, 'product.longDescription', {
      min: 3,
      max: 4000,
    }),
    features: readStringArray(data.features, 'product.features', { maxItems: 16, maxLength: 320 }),
    advantageTitle: readString(data.advantageTitle, 'product.advantageTitle', {
      min: 2,
      max: 160,
    }),
    advantages: readArray(data.advantages, 'product.advantages').map((advantage, featureIndex) => {
      const item = asRecord(advantage, `product advantage ${featureIndex + 1}`);
      return {
        feature: readString(item.feature, 'product.advantages.feature', {
          min: 2,
          max: 140,
        }),
        standard: readString(item.standard, 'product.advantages.standard', {
          min: 2,
          max: 400,
        }),
        need: readString(item.need, 'product.advantages.need', { min: 2, max: 280 }),
      };
    }),
    processTitle: readString(data.processTitle, 'product.processTitle', { min: 2, max: 160 }),
    processes: readStringArray(data.processes, 'product.processes', {
      maxItems: 16,
      maxLength: 320,
    }),
    ...sanitizeMediaFields(data, `product ${index + 1}`),
  };
}

function sanitizeIndustry(value: unknown, index: number): IndustryItem {
  const data = asRecord(value, `industry ${index + 1}`);
  return {
    id: readIdentifier(data.id, 'industry.id', `industry-${index + 1}`),
    name: readString(data.name, 'industry.name', { min: 2, max: 140 }),
    tagline: readString(data.tagline, 'industry.tagline', { min: 2, max: 180 }),
    description: readString(data.description, 'industry.description', { min: 3, max: 1600 }),
    iconName: readString(data.iconName, 'industry.iconName', { min: 2, max: 80 }),
    challenges: readStringArray(data.challenges, 'industry.challenges', {
      maxItems: 10,
      maxLength: 280,
    }),
    solutions: readStringArray(data.solutions, 'industry.solutions', {
      maxItems: 10,
      maxLength: 280,
    }),
    ...sanitizeMediaFields(data, `industry ${index + 1}`),
  };
}

function sanitizeTestimonial(value: unknown, index: number): Testimonial {
  const data = asRecord(value, `testimonial ${index + 1}`);
  const rating = Number(data.rating);
  return {
    id: readIdentifier(data.id, 'testimonial.id', `testimonial-${index + 1}`),
    quote: readString(data.quote, 'testimonial.quote', { min: 3, max: 1400 }),
    author: readString(data.author, 'testimonial.author', { min: 2, max: 140 }),
    role: readString(data.role, 'testimonial.role', { min: 2, max: 140 }),
    company: readString(data.company, 'testimonial.company', { min: 2, max: 160 }),
    rating: Number.isFinite(rating) ? Math.min(5, Math.max(1, Math.round(rating))) : 5,
  };
}

function sanitizeBlog(value: unknown, index: number): BlogPost {
  const data = asRecord(value, `blog post ${index + 1}`);
  const content = sanitizeRichText(
    readString(data.content, 'blog.content', { min: 3, max: 50000, fallback: '<p></p>' }),
  );
  const status = data.status === 'draft' ? 'draft' : 'published';

  return {
    id: readIdentifier(data.id, 'blog.id', `blog-${index + 1}`),
    title: readString(data.title, 'blog.title', { min: 3, max: 180 }),
    summary: readString(data.summary, 'blog.summary', { min: 3, max: 500 }),
    content,
    category: readString(data.category, 'blog.category', { min: 2, max: 120 }),
    publishedAt: readIsoDate(data.publishedAt, 'blog.publishedAt'),
    author: readString(data.author, 'blog.author', { min: 2, max: 140 }),
    readTime: calculateReadTimeFromHtml(content),
    status,
    ...sanitizeMediaFields(data, `blog post ${index + 1}`),
  };
}

function sanitizeCareerRole(value: unknown, index: number): CareerRole {
  const data = asRecord(value, `career role ${index + 1}`);
  return {
    id: readIdentifier(data.id, 'career.id', `career-${index + 1}`),
    title: readString(data.title, 'career.title', { min: 2, max: 160 }),
    department: readString(data.department, 'career.department', { min: 2, max: 120 }),
    location: readString(data.location, 'career.location', { min: 2, max: 160 }),
    type: readString(data.type, 'career.type', { min: 2, max: 120 }),
    experience: readString(data.experience, 'career.experience', { min: 2, max: 120 }),
    summary: readString(data.summary, 'career.summary', { min: 3, max: 1200 }),
    requirements: readStringArray(data.requirements, 'career.requirements', {
      maxItems: 14,
      maxLength: 320,
    }),
    benefits: readStringArray(data.benefits, 'career.benefits', {
      maxItems: 14,
      maxLength: 320,
    }),
    isOpen: Boolean(data.isOpen),
  };
}

function sanitizeMetric(value: unknown, index: number): MetricStat {
  const data = asRecord(value, `metric ${index + 1}`);
  return {
    id: readIdentifier(data.id, 'metric.id', `metric-${index + 1}`),
    value: readString(data.value, 'metric.value', { min: 1, max: 80 }),
    label: readString(data.label, 'metric.label', { min: 2, max: 180 }),
    desc: readString(data.desc, 'metric.desc', { min: 2, max: 240 }),
  };
}

function sanitizeSiteSettings(value: unknown): SiteSettings {
  const data = asRecord(value, 'site settings');
  return {
    companyName: readString(data.companyName, 'siteSettings.companyName', { min: 2, max: 160 }),
    contactEmail: readEmail(data.contactEmail, 'siteSettings.contactEmail'),
    phone: readPhone(data.phone, 'siteSettings.phone'),
    whatsapp: readPhone(data.whatsapp, 'siteSettings.whatsapp'),
    officeLabel: readString(data.officeLabel, 'siteSettings.officeLabel', { min: 2, max: 120 }),
    officeAddressLines: readStringArray(data.officeAddressLines, 'siteSettings.officeAddressLines', {
      maxItems: 6,
      maxLength: 160,
    }),
    officeHours: readString(data.officeHours, 'siteSettings.officeHours', {
      min: 2,
      max: 160,
    }),
  };
}

function sanitizePageMedia(value: unknown): SitePageMedia {
  const data = asRecord(value, 'page media');
  return {
    servicesCatalogHero: sanitizePageMediaSlot(data.servicesCatalogHero, 'servicesCatalogHero'),
    productsCatalogHero: sanitizePageMediaSlot(data.productsCatalogHero, 'productsCatalogHero'),
    industriesHero: sanitizePageMediaSlot(data.industriesHero, 'industriesHero'),
    blogHero: sanitizePageMediaSlot(data.blogHero, 'blogHero'),
    careersHero: sanitizePageMediaSlot(data.careersHero, 'careersHero'),
    contactHero: sanitizePageMediaSlot(data.contactHero, 'contactHero'),
    aboutHero: sanitizePageMediaSlot(data.aboutHero, 'aboutHero'),
  };
}

function sanitizePageMediaSlot(value: unknown, label: string) {
  const data = asRecord(value, `page media slot ${label}`);
  return {
    title: readString(data.title, `${label}.title`, { min: 2, max: 120 }),
    description: readString(data.description, `${label}.description`, { min: 2, max: 320 }),
    ...sanitizeMediaFields(data, label),
  };
}

function sanitizeMediaFields(value: UnknownRecord, label: string) {
  return {
    image: readMediaUrl(value.image, `${label}.image`),
    video: readOptionalMediaUrl(value.video, `${label}.video`),
    poster: readOptionalMediaUrl(value.poster, `${label}.poster`),
    alt: readString(value.alt, `${label}.alt`, { min: 0, max: 240, fallback: '' }),
  };
}

function rejectHoneypot(data: UnknownRecord) {
  const honeypot = typeof data.website === 'string' ? data.website.trim() : '';
  if (honeypot) {
    throw badRequest('Spam submission rejected.');
  }
}

function asRecord(value: unknown, label: string): UnknownRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw badRequest(`Invalid ${label}.`);
  }
  return value as UnknownRecord;
}

function readArray(value: unknown, label: string) {
  if (!Array.isArray(value)) {
    throw badRequest(`${label} must be an array.`);
  }
  return value;
}

function readString(
  value: unknown,
  label: string,
  options: { min: number; max: number; fallback?: string },
) {
  const fallback = options.fallback ?? '';
  const nextValue = typeof value === 'string' ? value.trim() : fallback;

  if (!nextValue && options.min > 0) {
    throw badRequest(`${label} is required.`);
  }

  if (nextValue.length > options.max) {
    throw badRequest(`${label} exceeds the maximum allowed length.`);
  }

  if (nextValue && nextValue.length < options.min) {
    throw badRequest(`${label} is too short.`);
  }

  return nextValue;
}

function readStringArray(
  value: unknown,
  label: string,
  options: { maxItems: number; maxLength: number },
) {
  if (!Array.isArray(value)) {
    return [];
  }

  if (value.length > options.maxItems) {
    throw badRequest(`${label} contains too many items.`);
  }

  return value
    .map((item) => readString(item, label, { min: 0, max: options.maxLength, fallback: '' }))
    .filter(Boolean);
}

function readIdentifier(value: unknown, label: string, fallback: string) {
  const nextValue = typeof value === 'string' && value.trim() ? value.trim() : fallback;
  return nextValue
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function readEmail(value: unknown, label: string) {
  const nextValue = readString(value, label, { min: 5, max: 180 });
  if (!EMAIL_PATTERN.test(nextValue)) {
    throw badRequest(`${label} must be a valid email address.`);
  }
  return nextValue.toLowerCase();
}

function readPhone(value: unknown, label: string) {
  const nextValue = readString(value, label, { min: 6, max: 40 });
  if (!PHONE_PATTERN.test(nextValue)) {
    throw badRequest(`${label} must be a valid phone number.`);
  }
  return nextValue;
}

function readUrlLike(value: unknown, label: string) {
  const nextValue = readString(value, label, { min: 4, max: 300 });

  try {
    const parsed = new URL(nextValue);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error();
    }
    return parsed.toString();
  } catch {
    throw badRequest(`${label} must be a valid http or https URL.`);
  }
}

function readMediaUrl(value: unknown, label: string) {
  const nextValue = readString(value, label, { min: 1, max: 500 });
  return normalizeMediaUrl(nextValue, label);
}

function readOptionalMediaUrl(value: unknown, label: string) {
  const nextValue = readString(value, label, { min: 0, max: 500, fallback: '' });
  return nextValue ? normalizeMediaUrl(nextValue, label) : undefined;
}

function normalizeMediaUrl(value: string, label: string) {
  if (value.startsWith('/uploads/')) {
    return value;
  }

  try {
    const parsed = new URL(value);
    if (['http:', 'https:'].includes(parsed.protocol)) {
      return parsed.toString();
    }
  } catch {
    // fall through to validation error below
  }

  throw badRequest(`${label} must be a safe /uploads path or an absolute https URL.`);
}

function readIsoDate(value: unknown, label: string) {
  const nextValue = readString(value, label, { min: 10, max: 10 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(nextValue)) {
    throw badRequest(`${label} must use YYYY-MM-DD format.`);
  }
  return nextValue;
}

function readInternalPath(value: unknown, label: string) {
  const nextValue = readString(value, label, { min: 1, max: 200 });
  if (!INTERNAL_PATH_PATTERN.test(nextValue)) {
    throw badRequest(`${label} must be a valid internal path.`);
  }
  return nextValue;
}
