import { ArrowLeft, Award, BookOpen, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import SmartMedia from '../components/SmartMedia';

interface ProductDetailProps {
  productId: string;
  onNavigate: (path: string) => void;
  onOpenConsultation: () => void;
}

export default function ProductDetail({
  productId,
  onNavigate,
  onOpenConsultation,
}: ProductDetailProps) {
  const {
    content: { products },
  } = useSiteContent();
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-24 text-center text-slate-800 dark:bg-slate-950 dark:text-slate-100">
        <h2 className="text-2xl font-black">Product Not Found</h2>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          The requested product is unavailable right now.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/products')}
          className="mt-6 rounded-full bg-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
        >
          Return to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="relative overflow-hidden border-b border-slate-200 bg-white py-20 transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => onNavigate('/products')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </button>
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.25fr_0.95fr] lg:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
                {product.category}
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
                {product.title}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600 dark:text-slate-300 md:text-base">
                {product.tagline}
              </p>
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <SmartMedia
                image={product.image}
                video={product.video}
                poster={product.poster}
                alt={product.alt || product.title}
                className="w-full h-full"
                loading="eager"
                mediaClassName="h-full w-full object-cover"
                showVideoBadge
              />
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.35fr_0.9fr]">
          <div className="space-y-10">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <h2 className="flex items-center gap-2 border-b border-slate-200 pb-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-900 dark:border-slate-800 dark:text-white">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                Product architecture
              </h2>
              <p className="mt-5 text-sm leading-8 text-slate-600 dark:text-slate-300">
                {product.longDescription}
              </p>
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Core features
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {product.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-300" />
                    <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                {product.advantageTitle}
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {product.advantages.map((advantage) => (
                  <div key={advantage.feature} className="grid gap-4 px-6 py-5 md:grid-cols-3">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {advantage.feature}
                    </div>
                    <div className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {advantage.standard}
                    </div>
                    <div className="text-sm font-semibold leading-7 text-emerald-600 dark:text-emerald-300">
                      {advantage.need}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {product.processTitle}
              </h3>
              <div className="mt-4 space-y-4 border-l border-slate-200 pl-5 dark:border-slate-800">
                {product.processes.map((process, index) => (
                  <div key={process} className="relative rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <span className="absolute -left-[29px] top-5 h-3 w-3 rounded-full bg-blue-600 ring-4 ring-slate-50 dark:bg-blue-300 dark:ring-slate-950" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      Phase {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{process}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Award className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-300" />
              <h4 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                Built for operational rollout
              </h4>
              <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                BetterHub products are positioned as foundations for delivery, not fixed boxes that
                force every team into the same workflow.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <ShieldAlert className="h-7 w-7 text-blue-600 dark:text-blue-300" />
              <h3 className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-900 dark:text-white">
                Request a walkthrough
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                Connect with the team to discuss implementation scope, operational fit, or a guided
                demo path for this product suite.
              </p>
              <button
                type="button"
                onClick={onOpenConsultation}
                className="mt-5 w-full rounded-full bg-blue-600 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-blue-700"
              >
                Book a consultation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
