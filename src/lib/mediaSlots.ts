import type { MediaFields, SiteContent } from '../types';

export interface MediaSlotDescriptor extends MediaFields {
  id: string;
  section: string;
  label: string;
  helper: string;
}

export function getMediaSlots(content: SiteContent): MediaSlotDescriptor[] {
  return [
    ...content.heroSlides.map((slide) => ({
      id: `hero:${slide.id}`,
      section: 'Hero Slides',
      label: slide.title,
      helper: 'Homepage hero rotation',
      image: slide.image,
      video: slide.video,
      poster: slide.poster,
      alt: slide.alt || slide.title,
    })),
    ...content.services.map((service) => ({
      id: `service:${service.id}`,
      section: 'Services',
      label: service.title,
      helper: 'Services listing and detail page media',
      image: service.image,
      video: service.video,
      poster: service.poster,
      alt: service.alt || service.title,
    })),
    ...content.products.map((product) => ({
      id: `product:${product.id}`,
      section: 'Products',
      label: product.title,
      helper: 'Products listing and detail page media',
      image: product.image,
      video: product.video,
      poster: product.poster,
      alt: product.alt || product.title,
    })),
    ...content.industries.map((industry) => ({
      id: `industry:${industry.id}`,
      section: 'Industries',
      label: industry.name,
      helper: 'Industry overview media',
      image: industry.image,
      video: industry.video,
      poster: industry.poster,
      alt: industry.alt || industry.name,
    })),
    ...content.blogPosts.map((post) => ({
      id: `blog:${post.id}`,
      section: 'Blog',
      label: post.title,
      helper: 'Blog cards and article header media',
      image: post.image,
      video: post.video,
      poster: post.poster,
      alt: post.alt || post.title,
    })),
    ...Object.entries(content.pageMedia).map(([key, slot]) => ({
      id: `page:${key}`,
      section: 'Page Media',
      label: slot.title,
      helper: slot.description,
      image: slot.image,
      video: slot.video,
      poster: slot.poster,
      alt: slot.alt || slot.title,
    })),
  ];
}

export function updateMediaSlot(
  content: SiteContent,
  slotId: string,
  patch: Partial<MediaFields>,
): SiteContent {
  const [scope, key] = slotId.split(':');

  switch (scope) {
    case 'hero':
      return {
        ...content,
        heroSlides: content.heroSlides.map((slide) =>
          slide.id === key ? { ...slide, ...patch } : slide,
        ),
      };
    case 'service':
      return {
        ...content,
        services: content.services.map((service) =>
          service.id === key ? { ...service, ...patch } : service,
        ),
      };
    case 'product':
      return {
        ...content,
        products: content.products.map((product) =>
          product.id === key ? { ...product, ...patch } : product,
        ),
      };
    case 'industry':
      return {
        ...content,
        industries: content.industries.map((industry) =>
          industry.id === key ? { ...industry, ...patch } : industry,
        ),
      };
    case 'blog':
      return {
        ...content,
        blogPosts: content.blogPosts.map((post) =>
          post.id === key ? { ...post, ...patch } : post,
        ),
      };
    case 'page':
      if (key && key in content.pageMedia) {
        return {
          ...content,
          pageMedia: {
            ...content.pageMedia,
            [key]: {
              ...content.pageMedia[key as keyof SiteContent['pageMedia']],
              ...patch,
            },
          },
        };
      }
      return content;
    default:
      return content;
  }
}
