import { ArrowRight, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import HeroSlider from '../components/HeroSlider';
import Metrics from '../components/Metrics';
import { useSiteContent } from '../context/SiteContentContext';
import SmartMedia from '../components/SmartMedia';

interface HomeProps {
  onNavigate: (path: string) => void;
  onOpenConsultation: () => void;
}

export default function Home({ onNavigate, onOpenConsultation }: HomeProps) {
  const {
    content: { products, services, testimonials },
  } = useSiteContent();

  return (
    <div className="bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      <HeroSlider onNavigate={onNavigate} />

      <section className="relative overflow-hidden border-b border-slate-200 bg-white py-20 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-6">
            <h2 className="max-w-xl text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              BetterHub: We Build Applications That Search Engines Love and Humans Adore
            </h2>
            <p className="max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300">
              Software, infrastructure, content operations, and customer-facing platforms need to
              move together. We help teams make those systems faster, cleaner, and much easier to
              manage over time.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('/about')}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                About BetterHub
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-start gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3 text-blue-600 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900 dark:text-white">
                  High-Performance Web Development with SEO in its DNA.
                </h3>
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                  A beautiful website that no one finds is just an expensive digital business card.
                  We integrate technical SEO into every line of code, ensuring your site ranks higher, loads faster,
                  and converts better from day one
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                'Reusable service and product structure',
                'Content publishing without code edits',
                'Clearer paths for inquiries and hiring',
                'A better base for future SEO and analytics',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Metrics />

      <section className="border-b border-slate-200 bg-slate-50 py-20 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Services built to be useful now and manageable later
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
              A focused look at the delivery areas BetterHub is built around.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => onNavigate(`/service/${service.id}`)}
                className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
              >
                <SmartMedia
                  image={service.image}
                  poster={service.poster}
                  alt={service.alt || service.title}
                  className="absolute inset-0"
                  mediaClassName="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/42 to-slate-950/10" />
                <div className="relative flex min-h-[320px] flex-col justify-end p-6">
                  <h3 className="text-lg font-bold text-white">{service.title}</h3>
                  <p className="mt-3 line-clamp-3 text-[12px] leading-6 text-slate-200">
                    {service.subtitle}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-200">
                    <span>View service details</span>
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-20 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
               Built platforms ready for deeper tailoring
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                A faster, cleaner path for teams that need tailored solutions without starting from scratch.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/products')}
              className="rounded-full border border-slate-200 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Browse all products
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => onNavigate(`/product/${product.id}`)}
                className="group flex flex-col gap-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-700 dark:hover:bg-slate-900 sm:flex-row"
              >
                <div className="h-36 w-full shrink-0 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:w-40">
                  <SmartMedia
                    image={product.image}
                    poster={product.poster}
                    alt={product.alt || product.title}
                    mediaClassName="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-300">
                      {product.title}
                    </h3>
                    <p className="mt-2 text-[12px] leading-6 text-slate-500 dark:text-slate-400">
                      {product.subtitle}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <span>Explore the platform</span>
                    <ArrowUpRight className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black tracking-tight md:text-4xl">
            Start with the part of the website or business system that is hardest to update today.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={onOpenConsultation}
              className="rounded-full bg-blue-600 px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-blue-700"
            >
              Speak with a Professional
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className="rounded-full border border-white/15 bg-white/5 px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-100 transition hover:bg-white/10"
            >
              Contact the Office
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
