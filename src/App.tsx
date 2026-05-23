import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import SiteAssistant from './components/SiteAssistant';
import { navigateTo, normalizePath, parseRoute } from './lib/router';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Industries from './pages/Industries';
import Careers from './pages/Careers';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Sitemap from './pages/Sitemap';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Admin from './pages/Admin';
import { useSiteContent } from './context/SiteContentContext';
import { applyDocumentMetadata } from './lib/seo';

export default function App() {
  const { content, loadError } = useSiteContent();
  const [currentPath, setCurrentPath] = useState<string>(() => normalizePath(window.location.pathname));
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('betterhub-theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('betterhub-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (window.location.hash.startsWith('#/')) {
      const migratedPath = normalizePath(window.location.hash.slice(1));
      window.history.replaceState({}, '', migratedPath);
    }

    const handlePathChange = () => {
      setCurrentPath(normalizePath(window.location.pathname));
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    handlePathChange();
    window.addEventListener('popstate', handlePathChange);
    return () => window.removeEventListener('popstate', handlePathChange);
  }, []);

  const handleNavigate = (path: string) => {
    navigateTo(path);
    setCurrentPath(normalizePath(path));
  };

  const route = parseRoute(currentPath);

  useEffect(() => {
    const origin = window.location.origin;
    const baseTitle = content.siteSettings.companyName;
    const canonical = `${origin}${currentPath}`;
    const defaultDescription =
      'BetterHub Intelligence builds and manages modern digital systems across products, services, infrastructure, and content operations.';

    const makeImageUrl = (value?: string) =>
      value
        ? value.startsWith('http')
          ? value
          : `${origin}${value}`
        : undefined;

    switch (route.name) {
      case 'home':
        applyDocumentMetadata({
          title: `${baseTitle} | Products, Platforms, and Managed Digital Delivery`,
          description: content.heroSlides[0]?.subtitle || defaultDescription,
          canonical,
          image: makeImageUrl(content.heroSlides[0]?.image),
        });
        return;
      case 'about':
        applyDocumentMetadata({
          title: `About | ${baseTitle}`,
          description:
            'Learn how BetterHub Intelligence approaches software, infrastructure, digital platforms, and long-term operational clarity.',
          canonical,
          image: makeImageUrl(content.pageMedia.aboutHero.image),
        });
        return;
      case 'services':
        applyDocumentMetadata({
          title: `Services | ${baseTitle}`,
          description:
            'Explore BetterHub services across web development, AI, ecommerce, infrastructure, digital strategy, and smart systems delivery.',
          canonical,
          image: makeImageUrl(content.pageMedia.servicesCatalogHero.image),
        });
        return;
      case 'service-detail': {
        const service = content.services.find((item) => item.id === route.serviceId);
        applyDocumentMetadata({
          title: service ? `${service.title} | ${baseTitle}` : `Service | ${baseTitle}`,
          description: service?.subtitle || defaultDescription,
          canonical,
          image: makeImageUrl(service?.image),
        });
        return;
      }
      case 'products':
        applyDocumentMetadata({
          title: `Products | ${baseTitle}`,
          description:
            'Review BetterHub product suites for healthcare, education, HR, hospitality, and operational technology environments.',
          canonical,
          image: makeImageUrl(content.pageMedia.productsCatalogHero.image),
        });
        return;
      case 'product-detail': {
        const product = content.products.find((item) => item.id === route.productId);
        applyDocumentMetadata({
          title: product ? `${product.title} | ${baseTitle}` : `Product | ${baseTitle}`,
          description: product?.subtitle || defaultDescription,
          canonical,
          image: makeImageUrl(product?.image),
        });
        return;
      }
      case 'industries':
        applyDocumentMetadata({
          title: `Industries | ${baseTitle}`,
          description:
            'See how BetterHub adapts delivery for healthcare, education, retail, hospitality, logistics, and real estate operations.',
          canonical,
          image: makeImageUrl(content.pageMedia.industriesHero.image),
        });
        return;
      case 'careers':
        applyDocumentMetadata({
          title: `Careers | ${baseTitle}`,
          description:
            'Explore open roles and talent opportunities with BetterHub Intelligence across engineering, AI, platforms, and operations.',
          canonical,
          image: makeImageUrl(content.pageMedia.careersHero.image),
        });
        return;
      case 'blog':
        applyDocumentMetadata({
          title: `Insights | ${baseTitle}`,
          description:
            'Read BetterHub articles and explainers across AI, infrastructure, digital systems, ecommerce, and operational transformation.',
          canonical,
          image: makeImageUrl(content.pageMedia.blogHero.image),
        });
        return;
      case 'blog-detail': {
        const post = content.blogPosts.find((item) => item.id === route.blogId);
        applyDocumentMetadata({
          title: post ? `${post.title} | ${baseTitle}` : `Article | ${baseTitle}`,
          description: post?.summary || defaultDescription,
          canonical,
          image: makeImageUrl(post?.image),
          type: 'article',
        });
        return;
      }
      case 'contact':
        applyDocumentMetadata({
          title: `Contact | ${baseTitle}`,
          description:
            'Contact BetterHub Intelligence for product planning, service delivery, infrastructure work, and website management support.',
          canonical,
          image: makeImageUrl(content.pageMedia.contactHero.image),
        });
        return;
      case 'privacy-policy':
        applyDocumentMetadata({
          title: `Privacy Policy | ${baseTitle}`,
          description:
            'Review how BetterHub Intelligence collects, stores, and protects website, inquiry, recruitment, and administrative information.',
          canonical,
          robots: 'index,follow',
        });
        return;
      case 'sitemap':
        applyDocumentMetadata({
          title: `Sitemap | ${baseTitle}`,
          description: 'Browse the full BetterHub Intelligence website structure and page directory.',
          canonical,
        });
        return;
      case 'admin':
        applyDocumentMetadata({
          title: `Admin | ${baseTitle}`,
          description: 'Secure BetterHub administration console.',
          canonical,
          robots: 'noindex,nofollow',
        });
        return;
      default:
        applyDocumentMetadata({
          title: `${baseTitle}`,
          description: defaultDescription,
          canonical,
        });
    }
  }, [content, currentPath, route]);

  const renderCurrentPage = () => {
    switch (route.name) {
      case 'home':
        return (
          <Home
            onNavigate={handleNavigate}
            onOpenConsultation={() => setIsConsultationOpen(true)}
          />
        );
      case 'about':
        return <About />;
      case 'services':
        return <Services onNavigate={handleNavigate} />;
      case 'service-detail':
        return (
          <ServiceDetail
            serviceId={route.serviceId}
            onNavigate={handleNavigate}
            onOpenConsultation={() => setIsConsultationOpen(true)}
          />
        );
      case 'products':
        return <Products onNavigate={handleNavigate} />;
      case 'product-detail':
        return (
          <ProductDetail
            productId={route.productId}
            onNavigate={handleNavigate}
            onOpenConsultation={() => setIsConsultationOpen(true)}
          />
        );
      case 'industries':
        return <Industries />;
      case 'careers':
        return <Careers />;
      case 'blog':
        return <Blog onNavigate={handleNavigate} />;
      case 'blog-detail':
        return <BlogDetail blogId={route.blogId} onNavigate={handleNavigate} />;
      case 'sitemap':
        return <Sitemap onNavigate={handleNavigate} />;
      case 'contact':
        return <Contact />;
      case 'privacy-policy':
        return <PrivacyPolicy />;
      case 'admin':
        return <Admin />;
      default:
        return (
          <Home
            onNavigate={handleNavigate}
            onOpenConsultation={() => setIsConsultationOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {route.name !== 'admin' && (
        <Header
          currentPath={currentPath}
          onNavigate={handleNavigate}
          onOpenConsultation={() => setIsConsultationOpen(true)}
          theme={theme}
          setTheme={setTheme}
        />
      )}

      <main className={route.name === 'admin' ? 'min-h-screen' : 'min-h-screen pt-[84px] md:pt-[92px]'}>
        {route.name !== 'admin' && loadError ? (
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-xs font-semibold text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100">
            Live content could not be reached. The site is showing the latest built-in fallback content.
          </div>
        ) : null}
        {renderCurrentPage()}
      </main>

      {route.name !== 'admin' && <Footer onNavigate={handleNavigate} />}

      <ContactModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />

      {route.name !== 'admin' && <SiteAssistant onNavigate={handleNavigate} />}
    </div>
  );
}
