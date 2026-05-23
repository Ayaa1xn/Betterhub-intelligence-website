import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AppWindow,
  ArrowRight,
  Briefcase,
  ChevronDown,
  GraduationCap,
  HeartPulse,
  HelpCircle,
  Landmark,
  Menu,
  Monitor,
  Moon,
  Network,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sun,
  UserRound,
  X,
  Zap,
} from 'lucide-react';
import Logo from './Logo';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenConsultation: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export default function Header({
  currentPath,
  onNavigate,
  onOpenConsultation,
  theme,
  setTheme,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownCloseTimeout = useRef<number | null>(null);

  const openDropdown = (dropdownId: string) => {
    if (dropdownCloseTimeout.current) {
      clearTimeout(dropdownCloseTimeout.current);
      dropdownCloseTimeout.current = null;
    }
    setActiveDropdown(dropdownId);
  };

  const closeDropdown = () => {
    if (dropdownCloseTimeout.current) {
      clearTimeout(dropdownCloseTimeout.current);
    }
    dropdownCloseTimeout.current = window.setTimeout(() => {
      setActiveDropdown(null);
      dropdownCloseTimeout.current = null;
    }, 150);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (dropdownCloseTimeout.current) {
        clearTimeout(dropdownCloseTimeout.current);
      }
    };
  }, []);

  const navItems = useMemo(
    () => [
      { label: 'Home', path: '/' },
      {
        label: 'Products',
        path: '/products',
        dropdownId: 'products',
        items: [
          {
            name: 'Hospital Information System',
            desc: 'Medical software integrated with Nabidh and Malaffi.',
            path: '/product/his-medical',
            icon: HeartPulse,
          },
          {
            name: 'Education Management System',
            desc: 'School ERP aligned with KHDA and ADEK workflows.',
            path: '/product/ems-education',
            icon: GraduationCap,
          },
          {
            name: 'AI-Powered HRMS',
            desc: 'HR operations, payroll, and compliance automation.',
            path: '/product/hrms',
            icon: Briefcase,
          },
          {
            name: 'Restaurant POS',
            desc: 'Hospitality-first ordering, tax, and delivery sync.',
            path: '/product/pos-restaurant',
            icon: ShoppingBag,
          },
        ],
      },
      {
        label: 'Services',
        path: '/services',
        dropdownId: 'services',
        items: [
          {
            name: 'SEO-First Web Development',
            desc: 'Fast, modern web builds tuned for search and conversion.',
            path: '/service/seo-web-dev',
            icon: AppWindow,
          },
          {
            name: 'Mobile Application Design',
            desc: 'Cross-platform mobile products built for adoption.',
            path: '/service/mobile-apps',
            icon: Zap,
          },
          {
            name: 'Digital Strategy & GEO',
            desc: 'Brand visibility across search, answer engines, and content.',
            path: '/service/digital-marketing',
            icon: Sparkles,
          },
          {
            name: 'Headless E-Commerce',
            desc: 'Composable storefronts with local payment integrations.',
            path: '/service/ecommerce-solutions',
            icon: ShoppingBag,
          },
          {
            name: 'Enterprise Networking',
            desc: 'Cloud, on-prem, and zero-trust infrastructure delivery.',
            path: '/service/computer-networking',
            icon: Network,
          },
          {
            name: 'Artificial Intelligence Solutions',
            desc: 'Applied automation, private models, and operational AI.',
            path: '/service/ai-solutions',
            icon: Monitor,
          },
          {
            name: 'Advanced ELV Engineering',
            desc: 'Smart building, CCTV, access, and physical systems.',
            path: '/service/elv-engineering',
            icon: HelpCircle,
          },
        ],
      },
      { label: 'Industries', path: '/industries' },
      {
        label: 'Company',
        path: '/about',
        dropdownId: 'company',
        items: [
          {
            name: 'About BetterHub',
            desc: 'Our vision, capabilities, and delivery approach.',
            path: '/about',
            icon: Landmark,
          },
          {
            name: 'Careers',
            desc: 'Current openings and talent pipeline opportunities.',
            path: '/careers',
            icon: Briefcase,
          },
          {
            name: 'Knowledge Blog',
            desc: 'Articles, insights, and technical explainers.',
            path: '/blog',
            icon: Sparkles,
          },
          {
            name: 'Sitemap',
            desc: 'A complete visual directory of the website.',
            path: '/sitemap',
            icon: Network,
          },
        ],
      },
    ],
    [],
  );

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <div className="fixed left-0 top-0 z-50 w-full">
      <header
        className={`border-b border-slate-200/70 bg-white/95 backdrop-blur transition-all duration-300 dark:border-slate-800 dark:bg-slate-950/90 ${
          scrolled ? 'py-2 shadow-lg shadow-slate-900/5' : 'py-3'
        }`}
      >
        <div className="mx-auto flex max-w-[96rem] items-center justify-between gap-4 px-4 sm:px-8 xl:px-16 2xl:px-24">
          <button
            type="button"
            id="logo-brand-container"
            onClick={() => handleLinkClick('/')}
            className="-ml-1 flex items-center rounded-xl sm:-ml-2 xl:-ml-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            aria-label="Go to BetterHub home page"
          >
            <Logo
              size="xl"
              taglineClassName="logo-tagline-glint !text-[0.5rem] font-extrabold tracking-[0.2em] sm:!text-[0.52rem] lg:!text-[0.56rem]"
            />
          </button>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {navItems.map((item) => {
              const isActive =
                currentPath === item.path ||
                item.items?.some((subItem) => subItem.path === currentPath) ||
                false;

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.dropdownId && openDropdown(item.dropdownId)}
                  onMouseLeave={() => item.dropdownId && closeDropdown()}
                >
                  <button
                    type="button"
                    onClick={() => handleLinkClick(item.path)}
                    className={`inline-flex items-center gap-1 rounded-full px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] transition ${
                      isActive
                        ? 'bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-300'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-300'
                    } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500`}
                    aria-expanded={activeDropdown === item.dropdownId}
                  >
                    {item.label}
                    {item.items && <ChevronDown className="h-4 w-4" />}
                  </button>

                  {item.items && activeDropdown === item.dropdownId && (
                    <div
                      onMouseEnter={() => item.dropdownId && openDropdown(item.dropdownId)}
                      onMouseLeave={() => item.dropdownId && closeDropdown()}
                      className="absolute left-1/2 z-40 mt-3 w-[460px] -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900"
                    >
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400" />
                      <div className="mb-3 border-b border-slate-100 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:border-slate-700">
                        {item.label} Overview
                      </div>
                      <div className="space-y-2">
                        {item.items.map((subItem) => {
                          const Icon = subItem.icon;
                          const isSubActive = currentPath === subItem.path;
                          return (
                            <button
                              key={subItem.name}
                              type="button"
                              onClick={() => handleLinkClick(subItem.path)}
                              className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${
                                isSubActive
                                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                              } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500`}
                            >
                              <span className="mt-0.5 rounded-xl bg-slate-100 p-2 text-blue-600 dark:bg-slate-800 dark:text-blue-300">
                                <Icon className="h-4 w-4" />
                              </span>
                              <span className="flex-1">
                                <span className="block text-xs font-bold text-slate-900 dark:text-white">
                                  {subItem.name}
                                </span>
                                <span className="mt-1 block text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                                  {subItem.desc}
                                </span>
                              </span>
                              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onOpenConsultation}
              className="hidden items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:inline-flex"
            >
              <span>Speak with an Expert</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-blue-300"
              aria-label="Toggle light and dark theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('/admin')}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:bg-slate-800 dark:hover:text-blue-300"
              aria-label="Open admin portal"
              title="Admin"
            >
              <UserRound className="h-4.5 w-4.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((value) => !value)}
              className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100 hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-300 lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-5 shadow-xl dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <div className="mx-auto max-w-[96rem] space-y-5 sm:px-4">
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-slate-100 pb-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleLinkClick(item.path)}
                  className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900 dark:text-white"
                >
                  {item.label}
                </button>

                {item.items && (
                  <div className="mt-3 space-y-2 border-l border-slate-200 pl-4 dark:border-slate-700">
                    {item.items.map((subItem) => (
                      <button
                        key={subItem.name}
                        type="button"
                        onClick={() => handleLinkClick(subItem.path)}
                        className="flex w-full items-center justify-between gap-3 py-1 text-left text-xs text-slate-600 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300"
                      >
                        <span>{subItem.name}</span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="grid grid-cols-1 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleLinkClick('/admin')}
                className="rounded-full border border-blue-200 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:border-blue-900/40 dark:text-blue-300"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="rounded-full bg-blue-600 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
              >
                Speak with an Expert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
