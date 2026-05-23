import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createSiteContentSeed, normalizeSiteContent } from '../src/data';
import type { MediaFields, SiteContent, SiteMediaSlot } from '../src/types';

const rootDir = process.cwd();
const dataDir = path.join(rootDir, 'data');
const uploadsDir = path.join(dataDir, 'uploads');
const contentPath = path.join(dataDir, 'site-content.json');

const disabledVideoSlots = new Set([
  'hero:slide-3',
  'service:computer-networking',
  'product:hrms',
]);

const seed = createSiteContentSeed();
const cachedDownloads = new Map<string, string>();

await mkdir(uploadsDir, { recursive: true });

const current = normalizeSiteContent(
  JSON.parse(await readFile(contentPath, 'utf-8')) as SiteContent,
);

const localized: SiteContent = {
  ...current,
  heroSlides: await Promise.all(
    current.heroSlides.map((slide) =>
      localizeMediaSlot(
        `hero:${slide.id}`,
        slide,
        seed.heroSlides.find((candidate) => candidate.id === slide.id),
        slide.title,
      ),
    ),
  ),
  services: await Promise.all(
    current.services.map((service) =>
      localizeMediaSlot(
        `service:${service.id}`,
        service,
        seed.services.find((candidate) => candidate.id === service.id),
        service.title,
      ),
    ),
  ),
  products: await Promise.all(
    current.products.map((product) =>
      localizeMediaSlot(
        `product:${product.id}`,
        product,
        seed.products.find((candidate) => candidate.id === product.id),
        product.title,
      ),
    ),
  ),
  industries: await Promise.all(
    current.industries.map((industry) =>
      localizeMediaSlot(
        `industry:${industry.id}`,
        industry,
        seed.industries.find((candidate) => candidate.id === industry.id),
        industry.name,
      ),
    ),
  ),
  blogPosts: await Promise.all(
    current.blogPosts.map((post) =>
      localizeMediaSlot(
        `blog:${post.id}`,
        post,
        seed.blogPosts.find((candidate) => candidate.id === post.id),
        post.title,
      ),
    ),
  ),
  pageMedia: {
    servicesCatalogHero: await localizePageMediaSlot(
      'servicesCatalogHero',
      current.pageMedia.servicesCatalogHero,
      seed.pageMedia.servicesCatalogHero,
    ),
    productsCatalogHero: await localizePageMediaSlot(
      'productsCatalogHero',
      current.pageMedia.productsCatalogHero,
      seed.pageMedia.productsCatalogHero,
    ),
    industriesHero: await localizePageMediaSlot(
      'industriesHero',
      current.pageMedia.industriesHero,
      seed.pageMedia.industriesHero,
    ),
    blogHero: await localizePageMediaSlot(
      'blogHero',
      current.pageMedia.blogHero,
      seed.pageMedia.blogHero,
    ),
    careersHero: await localizePageMediaSlot(
      'careersHero',
      current.pageMedia.careersHero,
      seed.pageMedia.careersHero,
    ),
    contactHero: await localizePageMediaSlot(
      'contactHero',
      current.pageMedia.contactHero,
      seed.pageMedia.contactHero,
    ),
    aboutHero: await localizePageMediaSlot(
      'aboutHero',
      current.pageMedia.aboutHero,
      seed.pageMedia.aboutHero,
    ),
  },
};

await writeFile(contentPath, `${JSON.stringify(localized, null, 2)}\n`, 'utf-8');
console.log(`Localized media for ${countLocalizedSlots(localized)} slots into ${uploadsDir}`);

async function localizePageMediaSlot(
  key: string,
  currentSlot: SiteMediaSlot,
  seedSlot: SiteMediaSlot,
) {
  const media = await localizeFields(`page:${key}`, currentSlot, seedSlot, seedSlot.title);
  return {
    ...currentSlot,
    ...media,
  };
}

async function localizeMediaSlot<T extends MediaFields>(
  slotId: string,
  currentSlot: T,
  seedSlot: T | undefined,
  label: string,
) {
  if (!seedSlot) {
    return currentSlot;
  }

  return {
    ...currentSlot,
    ...(await localizeFields(slotId, currentSlot, seedSlot, label)),
  };
}

async function localizeFields(
  slotId: string,
  currentSlot: MediaFields,
  seedSlot: MediaFields,
  label: string,
) {
  const imageSource = seedSlot.image || currentSlot.image;
  if (!imageSource) {
    return currentSlot;
  }

  const image = await downloadAsset(`${slotId}:image`, imageSource);
  const shouldUseVideo = Boolean(seedSlot.video) && !disabledVideoSlots.has(slotId);
  const video = shouldUseVideo ? seedSlot.video : undefined;
  const posterSource = seedSlot.poster || seedSlot.image || currentSlot.poster || currentSlot.image;
  const poster = video ? await downloadAsset(`${slotId}:poster`, posterSource) : image;

  return {
    image,
    video,
    poster,
    alt: currentSlot.alt || seedSlot.alt || label,
  };
}

async function downloadAsset(slotKey: string, url: string) {
  if (cachedDownloads.has(url)) {
    return cachedDownloads.get(url)!;
  }

  const response = await fetch(url, {
    headers: {
      'user-agent': 'BetterHub Media Localizer/1.0',
      referer: 'https://www.pexels.com/',
      origin: 'https://www.pexels.com',
    },
  });

  if (!response.ok) {
    throw new Error(`Could not download ${url}: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || '';
  const extension = resolveExtension(url, contentType);
  const fileName = `${slugify(slotKey)}.${extension}`;
  const filePath = path.join(uploadsDir, fileName);
  const bytes = Buffer.from(await response.arrayBuffer());

  await writeFile(filePath, bytes);
  const publicPath = `/uploads/${fileName}`;
  cachedDownloads.set(url, publicPath);
  return publicPath;
}

function resolveExtension(url: string, contentType: string) {
  const pathname = new URL(url).pathname.toLowerCase();

  if (contentType.includes('quicktime') || pathname.endsWith('.mov')) {
    return 'mov';
  }
  if (contentType.includes('webm') || pathname.endsWith('.webm')) {
    return 'webm';
  }
  if (contentType.includes('png') || pathname.endsWith('.png')) {
    return 'png';
  }
  if (contentType.includes('webp') || pathname.endsWith('.webp')) {
    return 'webp';
  }
  if (contentType.includes('gif') || pathname.endsWith('.gif')) {
    return 'gif';
  }
  if (contentType.includes('mp4') || pathname.endsWith('.mp4')) {
    return 'mp4';
  }
  if (contentType.includes('jpeg') || contentType.includes('jpg') || pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) {
    return 'jpg';
  }

  return 'bin';
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function countLocalizedSlots(content: SiteContent) {
  return (
    content.heroSlides.length +
    content.services.length +
    content.products.length +
    content.industries.length +
    content.blogPosts.length +
    Object.keys(content.pageMedia).length
  );
}
