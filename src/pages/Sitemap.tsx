import { ChevronRight, Network } from 'lucide-react';

interface SitemapProps {
  onNavigate: (path: string) => void;
}

export default function Sitemap({ onNavigate }: SitemapProps) {
  const mapStructure = [
    {
      group: 'Core Pages',
      links: [
        { name: 'Home', desc: 'Company overview, service previews, and product highlights.', path: '/' },
        { name: 'About', desc: 'Delivery philosophy, standards, and operating approach.', path: '/about' },
        { name: 'Contact', desc: 'Direct inquiry flow and office details.', path: '/contact' },
        { name: 'Privacy Policy', desc: 'Website privacy practices, rights, and data handling.', path: '/privacy-policy' },
      ],
    },
    {
      group: 'Products',
      links: [
        { name: 'Hospital Information System', desc: 'Clinical operations software overview.', path: '/product/his-medical' },
        { name: 'Education Management System', desc: 'School platform and reporting workflows.', path: '/product/ems-education' },
        { name: 'AI-Powered HRMS', desc: 'People operations and compliance platform.', path: '/product/hrms' },
        { name: 'Restaurant POS', desc: 'Hospitality-focused commerce system.', path: '/product/pos-restaurant' },
      ],
    },
    {
      group: 'Services',
      links: [
        { name: 'SEO-First Web Development', desc: 'Web platform design and delivery services.', path: '/service/seo-web-dev' },
        { name: 'Mobile Application Design', desc: 'Cross-platform product design and development.', path: '/service/mobile-apps' },
        { name: 'Digital Strategy & GEO', desc: 'Visibility, content, and answer-engine readiness.', path: '/service/digital-marketing' },
        { name: 'Headless E-Commerce', desc: 'Composable storefront and commerce delivery.', path: '/service/ecommerce-solutions' },
        { name: 'Enterprise Networking', desc: 'Cloud, network, and infrastructure support.', path: '/service/computer-networking' },
        { name: 'Artificial Intelligence Solutions', desc: 'Applied AI and operational automation.', path: '/service/ai-solutions' },
        { name: 'Advanced ELV Engineering', desc: 'Smart buildings and physical systems.', path: '/service/elv-engineering' },
      ],
    },
    {
      group: 'Content & Careers',
      links: [
        { name: 'Blog', desc: 'Published articles and explainers.', path: '/blog' },
        { name: 'Careers', desc: 'Hiring flows and applications.', path: '/careers' },
        { name: 'Admin', desc: 'Content management and website operations.', path: '/admin' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="relative overflow-hidden border-b border-slate-200 bg-white py-20 transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Network className="mx-auto h-10 w-10 text-blue-600 dark:text-blue-300" />
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Website Sitemap
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-500 dark:text-slate-400">
            A high-level map of the public pages, managed sections, and operational routes inside
            the website.
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {mapStructure.map((group) => (
            <div
              key={group.group}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <h2 className="border-b border-slate-200 pb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:border-slate-800 dark:text-blue-300">
                {group.group}
              </h2>

              <div className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <button
                    key={link.path}
                    type="button"
                    onClick={() => onNavigate(link.path)}
                    className="flex w-full items-start justify-between rounded-[1.5rem] border border-transparent p-4 text-left transition hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-950"
                  >
                    <span>
                      <span className="block text-sm font-bold text-slate-900 dark:text-white">
                        {link.name}
                      </span>
                      <span className="mt-1 block text-[12px] leading-6 text-slate-500 dark:text-slate-400">
                        {link.desc}
                      </span>
                    </span>
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
