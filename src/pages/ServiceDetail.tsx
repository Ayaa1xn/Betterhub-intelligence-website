import { ArrowLeft, Award, CheckCircle2, Sparkles } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import SmartMedia from '../components/SmartMedia';

interface ServiceDetailProps {
  serviceId: string;
  onNavigate: (path: string) => void;
  onOpenConsultation: () => void;
}

export default function ServiceDetail({
  serviceId,
  onNavigate,
  onOpenConsultation,
}: ServiceDetailProps) {
  const {
    content: { services },
  } = useSiteContent();
  const service = services.find((item) => item.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-24 text-center text-slate-800 dark:bg-slate-950 dark:text-slate-100">
        <h2 className="text-2xl font-black">Service Not Found</h2>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          The requested service is unavailable right now.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/services')}
          className="mt-6 rounded-full bg-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
        >
          Return to Services
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="relative overflow-hidden border-b border-slate-200 bg-slate-950 transition-colors dark:border-slate-800">
        <SmartMedia
          image={service.image}
          poster={service.poster}
          alt={service.alt || service.title}
          className="absolute inset-0"
          loading="eager"
          mediaClassName="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="relative mx-auto flex min-h-[100svh] max-w-[120rem] flex-col px-4 pb-10 pt-28 sm:px-6 sm:pb-12 sm:pt-32 lg:px-10 lg:pb-14 lg:pt-36">
          <button
            type="button"
            onClick={() => onNavigate('/services')}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition hover:bg-white/16"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to services
          </button>
          <div className="mt-auto max-w-4xl rounded-[2rem] border border-white/20 bg-slate-950/28 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.32)] backdrop-blur-[2px] sm:p-8">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                {service.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base font-semibold italic leading-8 text-sky-200 md:text-lg">
                {service.tagline}
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-100 md:text-base">
                {service.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.35fr_0.9fr]">
          <div className="space-y-10">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <h2 className="flex items-center gap-2 border-b border-slate-200 pb-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-900 dark:border-slate-800 dark:text-white">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                Overview
              </h2>
              <p className="mt-5 text-sm leading-8 text-slate-600 dark:text-slate-300">
                {service.longDescription}
              </p>
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {service.bulletTitle}
              </h3>
              <div className="mt-4 space-y-4">
                {service.bullets.map((bullet) => (
                  <div
                    key={bullet}
                    className="flex items-start gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{bullet}</p>
                  </div>
                ))}
              </div>
            </div>

            {!!service.features?.length && (
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                  Technical parameters and business impact
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {service.features.map((feature) => (
                    <div key={feature.featureTitle} className="grid gap-4 px-6 py-5 md:grid-cols-3">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {feature.featureTitle}
                      </div>
                      <div className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {feature.description}
                      </div>
                      <div className="text-sm font-semibold leading-7 text-blue-600 dark:text-blue-300">
                        {feature.impact}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {!!service.techs?.length && (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="border-b border-slate-200 pb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-900 dark:border-slate-800 dark:text-white">
                  {service.techTitle || 'Technologies'}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {service.techs.join(', ')}
                </p>
              </div>
            )}

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Award className="mx-auto h-8 w-8 text-blue-600 dark:text-blue-300" />
              <h4 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                Structured delivery, clearer maintenance
              </h4>
              <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                This service can be delivered as a focused engagement or folded into a broader
                platform modernization effort.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-900 dark:text-white">
                Discuss this service
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                Connect with the team for scoping, delivery planning, or a walk-through of how this
                service would fit your current systems.
              </p>
              <button
                type="button"
                onClick={onOpenConsultation}
                className="mt-5 w-full rounded-full bg-blue-600 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-blue-700"
              >
                Start the conversation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
