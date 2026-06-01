import { ArrowRight, CheckSquare, Sparkles } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import SmartMedia from '../components/SmartMedia';

interface ProductsProps {
  onNavigate: (path: string) => void;
}

export default function Products({ onNavigate }: ProductsProps) {
  const {
    content: { products, pageMedia },
  } = useSiteContent();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="relative overflow-hidden border-b border-slate-200 bg-slate-950 py-28 dark:border-slate-800">
        <SmartMedia
          image={pageMedia.productsCatalogHero.image}
          video={pageMedia.productsCatalogHero.video}
          poster={pageMedia.productsCatalogHero.poster}
          alt={pageMedia.productsCatalogHero.alt || pageMedia.productsCatalogHero.title}
          className="absolute inset-0"
          loading="eager"
          mediaClassName="absolute inset-0 h-full w-full object-cover opacity-[0.34] scale-[1.02]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_30%)]" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mt-6 text-4xl font-black tracking-tight text-white md:text-6xl">
            Product suites with room for operational tailoring
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-slate-300 md:text-base">
            Explore the platform foundations BetterHub uses to accelerate delivery without locking
            teams into rigid, one-size-fits-all systems.
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {products.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="relative h-56 overflow-hidden bg-slate-950">
                <SmartMedia
                  image={product.image}
                  poster={product.poster}
                  alt={product.alt || product.title}
                  className="absolute inset-0"
                  mediaClassName="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 to-transparent" />
              </div>

              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {product.title}
                </h2>
                <p className="mt-2 text-sm font-semibold italic text-blue-600 dark:text-blue-300">
                  {product.tagline}
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {product.subtitle}
                </p>

                <div className="mt-6 space-y-3">
                  {product.features.slice(0, 3).map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    >
                      <CheckSquare className="mt-1 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-300" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5 dark:border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Explore full platform
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate(`/product/${product.id}`)}
                    className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-sky-700"
                  >
                    Product detail
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
