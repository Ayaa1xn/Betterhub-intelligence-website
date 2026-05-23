import { copyFile, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { normalizeSiteContent } from '../src/data';
import type { SiteContent } from '../src/types';

const rootDir = process.cwd();
const generatedDir = path.join(
  process.env.HOME || '',
  '.codex',
  'generated_images',
  '019e4480-1b47-7812-a36f-f78076da1a6d',
);
const uploadsDir = path.join(rootDir, 'data', 'uploads');
const contentPath = path.join(rootDir, 'data', 'site-content.json');

const generatedFiles = {
  serviceWeb: 'ig_0f29406023d0aadc016a10395fc06081918e59b8a4eb7e17e9.png',
  serviceMobileApps: 'ig_0f29406023d0aadc016a1039f4dce48191bb41350f0ebdd937.png',
  serviceAi: 'ig_0f29406023d0aadc016a103a84a9908191aa2d5ca8f1718daf.png',
  serviceHrms: 'ig_0f29406023d0aadc016a103abb3fd08191bb9a4fec107cd459.png',
  serviceSmartBuilding: 'ig_0f29406023d0aadc016a103afb92e08191a43d3cf23a5599b3.png',
  serviceEcommerce: 'ig_0f29406023d0aadc016a103b43a2308191af4a201371e67358.png',
  serviceNetworking: 'ig_0f29406023d0aadc016a103b9241c88191aa18892bfa9e4352.png',
  productHealthcare: 'ig_0f29406023d0aadc016a103bd2ba50819194541d2978eea042.png',
  productEducation: 'ig_0f29406023d0aadc016a103c1826f0819195b5baf94ee6c18e.png',
  productRestaurant: 'ig_0f29406023d0aadc016a103c5a84a081919f4064f933d8edfe.png',
  productLogistics: 'ig_0f29406023d0aadc016a103c9cc5f08191b2959da9a1f3a21d.png',
  productDigitalMarketing: 'ig_0f29406023d0aadc016a103d530d108191a2e53ce272d4679e.png',
  homeHeroWeb: 'ig_0e78fa68f7e53a16016a104e6496cc81918e7c2723215cc497.png',
  homeHeroAi: 'ig_0e78fa68f7e53a16016a104efdb61881918b64a0d73f81b963.png',
  homeHeroHrms: 'ig_0e78fa68f7e53a16016a104f59064c8191902acc248268a9df.png',
  homeHeroSmartBuilding: 'ig_0e78fa68f7e53a16016a104faefd908191a425970dd7232c01.png',
  homeHeroEcommerce: 'ig_0e78fa68f7e53a16016a10501cfcc08191ad7b3be847447f93.png',
  servicesCatalogHero: 'ig_0e78fa68f7e53a16016a105077f5508191b017fca6d5185cb5.png',
  blogHero: 'ig_0e78fa68f7e53a16016a1050cd51c481918e2d77b5d9164c7a.png',
  productsCatalogHero: 'ig_0555b9589cdb70ec016a116271686881918513b5df33123adc.png',
  industriesHero: 'ig_0f29406023d0aadc016a104a508c388191babd1997fa5fc887.png',
  careersHero: 'ig_0f29406023d0aadc016a104a9e78748191b8f513d4f461f85a.png',
  contactHero: 'ig_0f29406023d0aadc016a104b04b0c48191822db4387d9698b6.png',
  aboutHero: 'ig_0f29406023d0aadc016a104b584c808191aedcc9f86ebd1e4a.png',
  industryRetail: 'ig_0f29406023d0aadc016a104bbaf7188191abbbd3ea9e979d82.png',
  industryRealEstate: 'ig_0f29406023d0aadc016a104c0bacb0819196f7f4c4c2821f1a.png',
} as const;

const targetImages = {
  serviceWeb: '/uploads/generated-web-dev.png',
  serviceMobileApps: '/uploads/generated-mobile-apps.png',
  serviceAi: '/uploads/generated-ai.png',
  serviceHrms: '/uploads/generated-hrms.png',
  serviceSmartBuilding: '/uploads/generated-smart-building.png',
  serviceEcommerce: '/uploads/generated-ecommerce.png',
  serviceNetworking: '/uploads/generated-networking.png',
  productHealthcare: '/uploads/generated-healthcare.png',
  productEducation: '/uploads/generated-education.png',
  productRestaurant: '/uploads/generated-restaurant.png',
  productLogistics: '/uploads/generated-logistics.png',
  productDigitalMarketing: '/uploads/generated-digital-marketing.png',
  homeHeroWeb: '/uploads/home-hero-web-dev.png',
  homeHeroAi: '/uploads/home-hero-ai.png',
  homeHeroHrms: '/uploads/home-hero-hrms.png',
  homeHeroSmartBuilding: '/uploads/home-hero-smart-building.png',
  homeHeroEcommerce: '/uploads/home-hero-ecommerce.png',
  servicesCatalogHero: '/uploads/page-services-catalog.png',
  blogHero: '/uploads/page-blog-hero.png',
  productsCatalogHero: '/uploads/page-products-catalog.png',
  industriesHero: '/uploads/page-industries-overview.png',
  careersHero: '/uploads/page-careers-hero.png',
  contactHero: '/uploads/page-contact-hero.png',
  aboutHero: '/uploads/page-about-hero.png',
  industryRetail: '/uploads/industry-retail.png',
  industryRealEstate: '/uploads/industry-real-estate.png',
} as const;

const localImages = {
  industryHealthcare: '/uploads/industry-healthcare-portrait.jpg',
  industryEducation: '/uploads/industry-education-portrait.jpg',
  industryRetail: '/uploads/industry-retail-portrait.jpg',
  industryHospitality: '/uploads/industry-hospitality-portrait.jpg',
  industryLogistics: '/uploads/industry-logistics-portrait.jpg',
  industryRealEstate: '/uploads/industry-real-estate-portrait.jpg',
} as const;

for (const [key, fileName] of Object.entries(generatedFiles)) {
  const source = path.join(generatedDir, fileName);
  const destination = path.join(uploadsDir, path.basename(targetImages[key as keyof typeof targetImages]));
  await copyFile(source, destination);
}

createSlowVideo('home-hero-web-dev.png', 'home-hero-web-dev.mp4');
createSlowVideo('home-hero-ai.png', 'home-hero-ai.mp4');
createSlowVideo('home-hero-hrms.png', 'home-hero-hrms.mp4');
createSlowVideo('home-hero-smart-building.png', 'home-hero-smart-building.mp4');
createSlowVideo('home-hero-ecommerce.png', 'home-hero-ecommerce.mp4');
createSlowVideo('page-services-catalog.png', 'page-services-catalog.mp4');
createSlowVideo('page-careers-hero.png', 'page-careers-hero.mp4');

const raw = await readFile(contentPath, 'utf-8');
const content = normalizeSiteContent(JSON.parse(raw) as SiteContent);

const next: SiteContent = {
  ...content,
  heroSlides: content.heroSlides.map((slide) => {
    switch (slide.id) {
      case 'slide-1':
        return assignMedia(slide, targetImages.homeHeroWeb, '/uploads/home-hero-web-dev.mp4');
      case 'slide-2':
        return assignMedia(slide, targetImages.homeHeroAi, '/uploads/home-hero-ai.mp4');
      case 'slide-3':
        return assignMedia(slide, targetImages.homeHeroHrms, '/uploads/home-hero-hrms.mp4');
      case 'slide-4':
        return assignMedia(
          slide,
          targetImages.homeHeroSmartBuilding,
          '/uploads/home-hero-smart-building.mp4',
        );
      case 'slide-5':
        return assignMedia(
          slide,
          targetImages.homeHeroEcommerce,
          '/uploads/home-hero-ecommerce.mp4',
        );
      default:
        return slide;
    }
  }),
  services: content.services.map((service) => {
    switch (service.id) {
      case 'seo-web-dev':
        return assignMedia(service, targetImages.serviceWeb);
      case 'mobile-apps':
        return assignMedia(service, targetImages.serviceMobileApps);
      case 'digital-marketing':
        return assignMedia(service, targetImages.productDigitalMarketing);
      case 'ecommerce-solutions':
        return assignMedia(service, targetImages.serviceEcommerce);
      case 'computer-networking':
        return assignMedia(service, targetImages.serviceNetworking);
      case 'ai-solutions':
        return assignMedia(service, targetImages.serviceAi);
      case 'elv-engineering':
        return assignMedia(service, targetImages.serviceSmartBuilding);
      default:
        return service;
    }
  }),
  products: content.products.map((product) => {
    switch (product.id) {
      case 'his-medical':
        return assignMedia(product, targetImages.productHealthcare);
      case 'ems-education':
        return assignMedia(product, targetImages.productEducation);
      case 'hrms':
        return assignMedia(product, targetImages.serviceHrms);
      case 'pos-restaurant':
        return assignMedia(product, targetImages.productRestaurant);
      default:
        return product;
    }
  }),
  industries: content.industries.map((industry) => {
    switch (industry.id) {
      case 'healthcare':
        return assignMedia(industry, localImages.industryHealthcare);
      case 'education':
        return assignMedia(industry, localImages.industryEducation);
      case 'retail':
        return assignMedia(industry, localImages.industryRetail);
      case 'hospitality':
        return assignMedia(industry, localImages.industryHospitality);
      case 'logistics':
        return assignMedia(industry, localImages.industryLogistics);
      case 'realestate':
        return assignMedia(industry, localImages.industryRealEstate);
      default:
        return industry;
    }
  }),
  pageMedia: {
    ...content.pageMedia,
    servicesCatalogHero: assignMedia(
      content.pageMedia.servicesCatalogHero,
      targetImages.servicesCatalogHero,
      '/uploads/page-services-catalog.mp4',
    ),
    productsCatalogHero: assignMedia(
      content.pageMedia.productsCatalogHero,
      targetImages.productsCatalogHero,
    ),
    industriesHero: assignMedia(content.pageMedia.industriesHero, targetImages.industriesHero),
    blogHero: assignMedia(content.pageMedia.blogHero, targetImages.blogHero),
    careersHero: assignMedia(
      content.pageMedia.careersHero,
      targetImages.careersHero,
      '/uploads/page-careers-hero.mp4',
    ),
    contactHero: assignMedia(content.pageMedia.contactHero, targetImages.contactHero),
    aboutHero: assignMedia(content.pageMedia.aboutHero, targetImages.aboutHero),
  },
};

await writeFile(contentPath, `${JSON.stringify(next, null, 2)}\n`, 'utf-8');
console.log('Applied unique local media set with section-specific hero assets.');

function assignMedia<T extends { image: string; poster?: string; video?: string }>(
  item: T,
  image: string,
  video?: string,
) {
  return {
    ...item,
    image,
    poster: image,
    video,
  };
}

function createSlowVideo(imageName: string, outputName: string) {
  const inputPath = path.join(uploadsDir, imageName);
  const outputPath = path.join(uploadsDir, outputName);
  const args = [
    '-y',
    '-loop',
    '1',
    '-i',
    inputPath,
    '-vf',
    "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.00035,1.08)':d=240:s=1920x1080:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)',fps=30,format=yuv420p",
    '-t',
    '8',
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    outputPath,
  ];

  const result = spawnSync('/opt/homebrew/bin/ffmpeg', args, { stdio: 'pipe' });
  if (result.status !== 0) {
    throw new Error(`Could not create video for ${imageName}: ${result.stderr.toString()}`);
  }
}
