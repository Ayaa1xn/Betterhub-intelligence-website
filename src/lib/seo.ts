export interface SeoMetadata {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  robots?: string;
  type?: 'website' | 'article';
}

export function applyDocumentMetadata(metadata: SeoMetadata) {
  document.title = metadata.title;
  setMetaTag('name', 'description', metadata.description);
  setMetaTag('name', 'robots', metadata.robots || 'index,follow');
  setMetaTag('property', 'og:title', metadata.title);
  setMetaTag('property', 'og:description', metadata.description);
  setMetaTag('property', 'og:url', metadata.canonical);
  setMetaTag('property', 'og:type', metadata.type || 'website');
  setMetaTag('name', 'twitter:card', metadata.image ? 'summary_large_image' : 'summary');

  if (metadata.image) {
    setMetaTag('property', 'og:image', metadata.image);
  } else {
    removeMetaTag('property', 'og:image');
  }

  setCanonicalLink(metadata.canonical);
}

function setMetaTag(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function setCanonicalLink(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

function removeMetaTag(attribute: 'name' | 'property', key: string) {
  const element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  element?.remove();
}
