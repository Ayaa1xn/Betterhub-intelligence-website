export interface MediaFields {
  image: string;
  video?: string;
  poster?: string;
  alt?: string;
}

export interface Slide extends MediaFields {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaPath: string;
}

export interface ServiceDetailItem extends MediaFields {
  id: string;
  title: string;
  subtitle: string;
  longDescription: string;
  tagline: string;
  bulletTitle: string;
  bullets: string[];
  techTitle?: string;
  techs?: string[];
  features?: { featureTitle: string; description: string; impact: string }[];
}

export interface ProductDetailItem extends MediaFields {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  tagline: string;
  longDescription: string;
  features: string[];
  advantageTitle: string;
  advantages: { feature: string; standard: string; need: string }[];
  processTitle: string;
  processes: string[];
}

export interface IndustryItem extends MediaFields {
  id: string;
  name: string;
  tagline: string;
  description: string;
  iconName: string; // Lucide icon name mapping
  challenges: string[];
  solutions: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  clientName: string;
  industry: string;
  location: string;
  challenge: string;
  solution: string;
  results: string[];
  image: string;
}

export interface BlogPost extends MediaFields {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  publishedAt: string;
  author: string;
  readTime: string;
  status: 'draft' | 'published';
}

export interface SiteMediaSlot extends MediaFields {
  title: string;
  description: string;
}

export interface SitePageMedia {
  servicesCatalogHero: SiteMediaSlot;
  productsCatalogHero: SiteMediaSlot;
  industriesHero: SiteMediaSlot;
  blogHero: SiteMediaSlot;
  careersHero: SiteMediaSlot;
  contactHero: SiteMediaSlot;
  aboutHero: SiteMediaSlot;
}

export interface CareerRole {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  summary: string;
  requirements: string[];
  benefits: string[];
  isOpen: boolean;
}

export interface MetricStat {
  id: string;
  value: string;
  label: string;
  desc: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
}

export interface SiteSettings {
  companyName: string;
  contactEmail: string;
  phone: string;
  whatsapp: string;
  officeLabel: string;
  officeAddressLines: string[];
  officeHours: string;
}

export interface SiteContent {
  heroSlides: Slide[];
  services: ServiceDetailItem[];
  products: ProductDetailItem[];
  industries: IndustryItem[];
  testimonials: Testimonial[];
  blogPosts: BlogPost[];
  careerRoles: CareerRole[];
  metrics: MetricStat[];
  siteSettings: SiteSettings;
  pageMedia: SitePageMedia;
}

export interface ContactSubmission {
  id: string;
  type: 'contact';
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface CareerSubmission {
  id: string;
  type: 'career';
  roleId: string;
  roleTitle: string;
  name: string;
  email: string;
  experience: string;
  portfolio: string;
  coverText: string;
  createdAt: string;
}

export interface SiteSubmissions {
  contacts: ContactSubmission[];
  careers: CareerSubmission[];
}
