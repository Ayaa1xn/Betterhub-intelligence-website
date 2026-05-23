import { Facebook, Instagram, Linkedin } from 'lucide-react';
import Logo from './Logo';
import { useSiteContent } from '../context/SiteContentContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const {
    content: { siteSettings },
  } = useSiteContent();

  const officeAddress = siteSettings.officeAddressLines.join(', ');
  const openAdminPortal = () =>
    window.open(`${window.location.origin}/admin`, '_blank', 'noopener,noreferrer');

  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="bg-slate-950/80 py-4 sm:py-5">
        <div className="mx-auto max-w-[96rem] px-4 sm:px-8 xl:px-16 2xl:px-24">
          <div className="brand-constellation mx-auto max-w-4xl rounded-[1.2rem] px-4 py-3 sm:px-5 sm:py-3.5">
            <div className="brand-stepper text-center">
              <span className="brand-step-segment brand-step-1 brand-surface-text text-[0.9rem] font-black leading-none tracking-[0.015em] lowercase sm:text-[1.04rem] lg:text-[1.24rem]">
                better tech <span className="brand-step-separator" aria-hidden="true">·</span>
              </span>
              <span className="brand-step-segment brand-step-2 brand-surface-text text-[0.9rem] font-black leading-none tracking-[0.015em] lowercase sm:text-[1.04rem] lg:text-[1.24rem]">
                better trust <span className="brand-step-separator" aria-hidden="true">·</span>
              </span>
              <span className="brand-step-segment brand-step-3 brand-surface-text text-[0.9rem] font-black leading-none tracking-[0.015em] lowercase sm:text-[1.04rem] lg:text-[1.24rem]">
                better hub
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[96rem] px-4 py-10 sm:px-8 sm:py-11 xl:px-16 2xl:px-24">
        <div className="grid grid-cols-1 gap-9 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              aria-label="Go to BetterHub home page"
            >
              <Logo size="md" />
            </button>
            <p className="max-w-sm text-xs leading-relaxed text-slate-400">
              BetterHub Intelligence helps teams manage growth across software, infrastructure,
              digital platforms, and operational transformation work in the UAE market.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.linkedin.com/company/better-hub-intelligence/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0A66C2]/35 bg-[#0A66C2]/12 text-[#0A66C2] transition hover:-translate-y-0.5 hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white"
                aria-label="Visit BetterHub on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/betterhubintelligence?igsh=NmpoYW40aDRnNDRp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DD2A7B]/35 bg-gradient-to-br from-[#F58529]/12 via-[#DD2A7B]/14 to-[#8134AF]/14 text-[#E4405F] transition hover:-translate-y-0.5 hover:border-[#DD2A7B] hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white"
                aria-label="Visit BetterHub on Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61581660470935"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1877F2]/35 bg-[#1877F2]/12 text-[#1877F2] transition hover:-translate-y-0.5 hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
                aria-label="Visit BetterHub on Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#25D366]/35 bg-[#25D366]/12 text-[#25D366] transition hover:-translate-y-0.5 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
                aria-label="Chat with BetterHub on WhatsApp"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 448 512" aria-hidden="true">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                </svg>
              </a>
            </div>
          </div>

          <FooterColumn
            title="Website"
            links={[
              ['Home', '/'],
              ['About', '/about'],
              ['Services', '/services'],
              ['Products', '/products'],
              ['Blog', '/blog'],
            ]}
            onNavigate={onNavigate}
          />

          <FooterColumn
            title="Operations"
            links={[
              ['Careers', '/careers'],
              ['Industries', '/industries'],
              ['Contact', '/contact'],
              ['Sitemap', '/sitemap'],
              ['Privacy Policy', '/privacy-policy'],
              ['Admin', '__admin_new_tab__'],
              
            ]}
            
            onNavigate={onNavigate}
            onAdminOpen={openAdminPortal}
          />
          
          <div>
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.18em] text-white">
              {siteSettings.officeLabel}
            </span>
            <p className="text-xs leading-relaxed text-slate-300">{officeAddress}</p>
            <div className="space-y-2 pt-4 text-xs">
              <p className="font-semibold text-white">Direct Desk</p>
              <a href={`tel:${siteSettings.phone}`} className="font-bold text-blue-400 hover:underline">
                {siteSettings.phone}
              </a>
              <p className="pt-2 font-semibold text-white">Sales Email</p>
              <a
                href={`mailto:${siteSettings.contactEmail}`}
                className="font-bold text-blue-400 hover:underline"
              >
                {siteSettings.contactEmail}
              </a>
              <p className="pt-2 text-[11px] text-slate-500">{siteSettings.officeHours}</p>
            </div>
          </div>
          
        </div>

        <div className="mt-8 border-t border-slate-800/70 pt-4 text-center text-[11px] text-slate-500">
          © {new Date().getFullYear()} {siteSettings.companyName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  onNavigate,
  onAdminOpen,
}: {
  title: string;
  links: Array<[string, string]>;
  onNavigate: (path: string) => void;
  onAdminOpen?: () => void;
}) {
  return (
    <div>
      <span className="mb-4 block text-xs font-bold uppercase tracking-[0.18em] text-white">
        {title}
      </span>
      <ul className="space-y-3 text-xs text-slate-400">
        {links.map(([label, path]) => (
          <li key={path}>
            <button
              type="button"
              onClick={() => (path === '__admin_new_tab__' && onAdminOpen ? onAdminOpen() : onNavigate(path))}
              className="hover:text-white"
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
