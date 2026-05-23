export type AppRoute =
  | { name: 'home' }
  | { name: 'about' }
  | { name: 'services' }
  | { name: 'service-detail'; serviceId: string }
  | { name: 'products' }
  | { name: 'product-detail'; productId: string }
  | { name: 'industries' }
  | { name: 'careers' }
  | { name: 'blog' }
  | { name: 'blog-detail'; blogId: string }
  | { name: 'sitemap' }
  | { name: 'privacy-policy' }
  | { name: 'contact' }
  | { name: 'admin' };

export function parseRoute(pathname: string): AppRoute {
  const path = normalizePath(pathname);

  if (path === '/') return { name: 'home' };
  if (path === '/about') return { name: 'about' };
  if (path === '/services') return { name: 'services' };
  if (path === '/products') return { name: 'products' };
  if (path === '/industries') return { name: 'industries' };
  if (path === '/careers') return { name: 'careers' };
  if (path === '/blog') return { name: 'blog' };
  if (path === '/sitemap') return { name: 'sitemap' };
  if (path === '/privacy-policy') return { name: 'privacy-policy' };
  if (path === '/contact') return { name: 'contact' };
  if (path === '/admin') return { name: 'admin' };

  if (path.startsWith('/service/')) {
    return { name: 'service-detail', serviceId: path.replace('/service/', '') };
  }

  if (path.startsWith('/product/')) {
    return { name: 'product-detail', productId: path.replace('/product/', '') };
  }

  if (path.startsWith('/blog/')) {
    return { name: 'blog-detail', blogId: path.replace('/blog/', '') };
  }

  return { name: 'home' };
}

export function normalizePath(pathname: string) {
  if (!pathname || pathname === '#') return '/';
  const path = pathname.startsWith('#/')
    ? pathname.slice(1)
    : pathname.startsWith('#')
      ? pathname.slice(1)
      : pathname;

  const normalized = path.startsWith('/') ? path : `/${path}`;
  return normalized.length > 1 ? normalized.replace(/\/+$/, '') : normalized;
}

export function navigateTo(path: string) {
  const next = normalizePath(path);
  if (window.location.pathname !== next) {
    window.history.pushState({}, '', next);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  window.dispatchEvent(new PopStateEvent('popstate'));
}
