import { ArrowRight, CheckCircle } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import SmartMedia from '../components/SmartMedia';

interface ServicesProps {
  onNavigate: (path: string) => void;
}

// High-performance custom vector illustration frames representing specific systems
const renderServiceVector = (id: string) => {
  switch (id) {
    case 'seo-web-dev':
      return (
        <svg viewBox="0 0 100 100" fill="none" className="absolute top-4 right-4 w-16 h-16 opacity-60 dark:opacity-85 text-emerald-500 dark:text-emerald-400 z-20 stroke-current pointer-events-none" strokeWidth="1">
          <rect x="5" y="10" width="90" height="80" rx="3" />
          <line x1="5" y1="25" x2="95" y2="25" />
          <circle cx="15" cy="17.5" r="2" />
          <circle cx="25" cy="17.5" r="2" />
          <circle cx="35" cy="17.5" r="2" />
          <path d="M20 75 L40 55 L60 65 L80 40" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="80" cy="40" r="3" fill="currentColor" />
          <path d="M15 45 l5-5-5-5 M35 35 l5 5-5 5" />
        </svg>
      );
    case 'mobile-apps':
      return (
        <svg viewBox="0 0 100 100" fill="none" className="absolute top-4 right-4 w-16 h-16 opacity-60 dark:opacity-85 text-blue-500 dark:text-blue-400 z-20 stroke-current pointer-events-none" strokeWidth="1">
          <rect x="25" y="10" width="50" height="80" rx="6" />
          <circle cx="50" cy="82" r="3" />
          <line x1="35" y1="20" x2="65" y2="20" />
          <circle cx="50" cy="45" r="10" strokeDasharray="2,2" />
          <circle cx="50" cy="45" r="4" fill="currentColor" />
          <path d="M15 45 H25 M75 45 H85 M50 22 V30" />
        </svg>
      );
    case 'digital-marketing':
      return (
        <svg viewBox="0 0 100 100" fill="none" className="absolute top-4 right-4 w-16 h-16 opacity-60 dark:opacity-85 text-purple-500 dark:text-purple-400 z-20 stroke-current pointer-events-none" strokeWidth="1">
          <path d="M15 20 H85 L60 75 H40 Z" />
          <line x1="30" y1="40" x2="70" y2="40" />
          <line x1="36" y1="55" x2="64" y2="55" />
          <path d="M50 75 V90 M40 90 H60" />
          <path d="M60 20 L75 35 L90 25" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <circle cx="90" cy="25" r="3.5" fill="currentColor" className="animate-pulse" />
        </svg>
      );
    case 'ecommerce-solutions':
      return (
        <svg viewBox="0 0 100 100" fill="none" className="absolute top-4 right-4 w-16 h-16 opacity-60 dark:opacity-85 text-amber-500 dark:text-amber-450 z-20 stroke-current pointer-events-none" strokeWidth="1">
          <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" />
          <circle cx="50" cy="15" r="3.5" fill="currentColor" />
          <circle cx="80" cy="32" r="3.5" fill="currentColor" />
          <circle cx="80" cy="68" r="3.5" fill="currentColor" />
          <circle cx="50" cy="85" r="3.5" fill="currentColor" />
          <circle cx="20" cy="68" r="3.5" fill="currentColor" />
          <circle cx="20" cy="32" r="3.5" fill="currentColor" />
          <line x1="50" y1="15" x2="50" y2="50" />
          <line x1="20" y1="32" x2="50" y2="50" />
          <line x1="80" y1="32" x2="50" y2="50" />
          <line x1="20" y1="68" x2="50" y2="50" />
          <line x1="80" y1="68" x2="50" y2="50" />
          <line x1="50" y1="85" x2="50" y2="50" />
        </svg>
      );
    case 'computer-networking':
      return (
        <svg viewBox="0 0 100 100" fill="none" className="absolute top-4 right-4 w-16 h-16 opacity-60 dark:opacity-85 text-teal-500 dark:text-teal-400 z-20 stroke-current pointer-events-none" strokeWidth="1">
          <rect x="15" y="15" width="70" height="20" rx="2" />
          <rect x="15" y="40" width="70" height="20" rx="2" />
          <rect x="15" y="65" width="70" height="20" rx="2" />
          <circle cx="25" cy="25" r="1.5" fill="currentColor" />
          <circle cx="32" cy="25" r="1.5" fill="currentColor" />
          <circle cx="25" cy="50" r="1.5" fill="currentColor" />
          <circle cx="32" cy="50" r="1.5" fill="currentColor" />
          <circle cx="25" cy="75" r="1.5" fill="currentColor" />
          <circle cx="32" cy="75" r="1.5" fill="currentColor" />
          <path d="M70 25 h10 v25 h-10 M75 37 H85" strokeWidth="1" />
        </svg>
      );
    case 'ai-solutions':
      return (
        <svg viewBox="0 0 100 100" fill="none" className="absolute top-4 right-4 w-16 h-16 opacity-60 dark:opacity-85 text-indigo-505 dark:text-indigo-400 z-20 stroke-current pointer-events-none" strokeWidth="1">
          <circle cx="20" cy="30" r="3" fill="currentColor" />
          <circle cx="20" cy="70" r="3" fill="currentColor" />
          <circle cx="50" cy="20" r="3" fill="currentColor" />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
          <circle cx="50" cy="80" r="3" fill="currentColor" />
          <circle cx="80" cy="35" r="3" fill="currentColor" />
          <circle cx="80" cy="65" r="3" fill="currentColor" />
          <line x1="20" y1="30" x2="50" y2="20" />
          <line x1="20" y1="30" x2="50" y2="50" />
          <line x1="20" y1="70" x2="50" y2="50" />
          <line x1="20" y1="70" x2="50" y2="80" />
          <line x1="50" y1="20" x2="80" y2="35" />
          <line x1="50" y1="50" x2="80" y2="35" />
          <line x1="50" y1="50" x2="80" y2="65" />
          <line x1="50" y1="80" x2="80" y2="65" />
          <circle cx="50" cy="50" r="6" className="animate-pulse" />
        </svg>
      );
    case 'elv-engineering':
      return (
        <svg viewBox="0 0 100 100" fill="none" className="absolute top-4 right-4 w-16 h-16 opacity-60 dark:opacity-85 text-rose-500 dark:text-rose-450 z-20 stroke-current pointer-events-none" strokeWidth="1">
          <path d="M10 10 h80 v80 h-80 z" strokeDasharray="4,2" />
          <path d="M40 30 h20 l12 25 H28 Z" />
          <circle cx="50" cy="40" r="4" fill="currentColor" />
          <line x1="28" y1="55" x2="15" y2="80" strokeDasharray="2,2" />
          <line x1="72" y1="55" x2="85" y2="80" strokeDasharray="2,2" />
          <circle cx="80" cy="20" r="5" />
          <line x1="80" y1="12" x2="80" y2="28" />
          <line x1="72" y1="20" x2="88" y2="20" />
        </svg>
      );
    default:
      return null;
  }
};

export default function Services({ onNavigate }: ServicesProps) {
  const {
    content: { services, pageMedia },
  } = useSiteContent();

  return (
    <div id="services-catalog-root" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Immersive Cinematic Hero Scene */}
      <div className="relative py-28 md:py-36 bg-slate-950 overflow-hidden border-b border-slate-200 dark:border-slate-800 flex items-center justify-center">
        {/* Full-bleed visual backdrop with motion parallax feel */}
        <div className="absolute inset-0 z-0">
          <SmartMedia
            image={pageMedia.servicesCatalogHero.image}
            video={pageMedia.servicesCatalogHero.video}
            poster={pageMedia.servicesCatalogHero.poster}
            alt={pageMedia.servicesCatalogHero.alt || pageMedia.servicesCatalogHero.title}
            className="absolute inset-0"
            loading="eager"
            mediaClassName="h-full w-full object-cover opacity-[0.36] scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/40 to-slate-950/95" />
          
          {/* Dynamic Moving Radial Laser Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c7_1px,transparent_1px),linear-gradient(to_bottom,#0284c7_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.07] pointer-events-none" />
          
          {/* Drifting Radial Glowing Overlays (Moving Pattern) */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Glowing blue radial orb */}
            <div className="hero-aura-float absolute -top-1/4 -left-1/4 h-[60vw] w-[60vw] max-w-[600px] rounded-full bg-blue-500/10 blur-[120px] mix-blend-screen dark:bg-blue-600/15" />
            {/* Glowing violet radial orb */}
            <div
              className="hero-aura-float absolute -bottom-1/4 -right-1/4 h-[70vw] w-[70vw] max-w-[700px] rounded-full bg-indigo-500/10 blur-[140px] mix-blend-screen dark:bg-purple-600/15"
              style={{ animationDelay: '-6s' }}
            />
            {/* Real center moving glowing radial gradient mask */}
            <div
              className="hero-aura-float absolute inset-0 bg-[radial-gradient(circle_at_35%_55%,rgba(59,130,246,0.12),transparent_40%)]"
              style={{ animationDelay: '-3s' }}
            />
          </div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white font-sans drop-shadow-sm">
            Enterprise Solutions Catalog
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans font-normal">
            Explore our specialized development, infrastructure building, and AI integration services. Built specifically to eliminate risk vector limits for GCC operations.
          </p>
          <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full" />
        </div>
      </div>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-12">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col md:flex-row overflow-hidden"
            >
              {/* Visual Side Backdrop Frame of Service */}
              <div className="md:w-2/5 h-64 md:h-auto min-h-[300px] relative overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0">
                <SmartMedia
                  image={service.image}
                  poster={service.poster}
                  alt={service.alt || service.title}
                  className="absolute inset-0"
                  mediaClassName="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/45 dark:from-slate-950/65 via-transparent to-transparent z-10" />
                
                {/* Embedded Specific High-Performance Vector Illustration Frame */}
                <div className="absolute inset-0 bg-slate-950/10 dark:bg-slate-950/20 mix-blend-overlay z-15 pointer-events-none" />
                {renderServiceVector(service.id)}

              </div>

              {/* Information / Capability Content Section */}
              <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="space-y-3.5">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight font-sans group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-bold italic font-sans">
                      "{service.tagline}"
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-normal">
                      {service.subtitle}
                    </p>
                  </div>

                  {/* Sub features preview checklist */}
                  <div className="pt-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <h3 className="text-[10px] font-black uppercase font-sans tracking-wider text-slate-400 dark:text-slate-500">
                      Standard Compliance & Implementation Parameters:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-600 dark:text-slate-300">
                      {service.bullets.map((bullet, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                          <span className="leading-relaxed font-sans">{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {service.techs && (
                    <p className="pt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                      {service.techs.join(' • ')}
                    </p>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between">
                  <button
                    onClick={() => onNavigate(`/service/${service.id}`)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-sm flex items-center space-x-2 transition-all cursor-pointer group-hover:px-7"
                  >
                    <span>View Specifications Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
