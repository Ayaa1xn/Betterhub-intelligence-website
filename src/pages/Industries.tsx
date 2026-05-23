import {
  Building2,
  GraduationCap,
  HeartPulse,
  HelpCircle,
  ShoppingBag,
  Truck,
  Utensils,
} from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import SmartMedia from '../components/SmartMedia';

export default function Industries() {
  const {
    content: { industries, pageMedia },
  } = useSiteContent();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse':
        return <HeartPulse className="h-5 w-5 text-rose-500" />;
      case 'GraduationCap':
        return <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-300" />;
      case 'ShoppingBag':
        return <ShoppingBag className="h-5 w-5 text-emerald-500" />;
      case 'UtensilsCrossed':
        return <Utensils className="h-5 w-5 text-amber-500" />;
      case 'Truck':
        return <Truck className="h-5 w-5 text-indigo-500 dark:text-indigo-300" />;
      case 'Building2':
        return <Building2 className="h-5 w-5 text-cyan-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="relative overflow-hidden border-b border-slate-200 bg-white py-20 transition-colors dark:border-slate-800 dark:bg-slate-900">
        <SmartMedia
          image={pageMedia.industriesHero.image}
          video={pageMedia.industriesHero.video}
          poster={pageMedia.industriesHero.poster}
          alt={pageMedia.industriesHero.alt || pageMedia.industriesHero.title}
          loading="eager"
          mediaClassName="absolute inset-0 h-full w-full object-cover opacity-[0.24] scale-[1.02]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Industry context shapes how BetterHub delivers
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-500 dark:text-slate-400">
            The operational needs of a clinic, school, retailer, or hotel are not the same. The
            work is stronger when that difference is treated as part of the system design.
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {industries.map((industry, index) => (
            <article
              key={industry.id}
              className={`group grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[1.05fr_1.12fr] ${
                index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              <div className="relative min-h-[340px] overflow-hidden bg-slate-100 dark:bg-slate-900 sm:min-h-[420px]">
                <SmartMedia
                  image={industry.image}
                  poster={industry.poster}
                  alt={industry.alt || industry.name}
                  mediaClassName="h-full w-full object-cover object-center transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-slate-950/5 to-transparent" />
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                    {getIcon(industry.iconName)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                      {industry.name}
                    </h2>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
                      {industry.tagline}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-8 text-slate-600 dark:text-slate-300">
                  {industry.description}
                </p>

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-rose-500">
                      Common pressure points
                    </h3>
                    <ul className="mt-3 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {industry.challenges.map((challenge) => (
                        <li key={challenge} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
                      BetterHub approach
                    </h3>
                    <ul className="mt-3 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {industry.solutions.map((solution) => (
                        <li key={solution} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
