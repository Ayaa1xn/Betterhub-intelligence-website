import { Zap, ShieldCheck, Search, Menu } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

function chooseIcon(metric: { value?: string; label?: string }) {
  const text = `${metric.value || ''} ${metric.label || ''}`.toLowerCase();
  if (/\b(speed|load|fast|<2s|\d+s)\b/i.test(text)) return Zap;
  if (/security|ssl|https|trust/i.test(text)) return ShieldCheck;
  if (/index|sitemap|xml|search|rank/i.test(text)) return Search;
  return Menu;
}

export default function Metrics() {
  const {
    content: { metrics },
  } = useSiteContent();

  return (
    <section className="border-b border-slate-200 bg-white py-16 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            The BetterHub Standard
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Why It Matters</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = chooseIcon(metric);

            return (
              <div
                key={metric.id}
                className="group rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-700 dark:hover:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-300">
                    {metric.value}
                  </span>
                  <span className="rounded-2xl bg-green-50 p-2.5 text-green-600 transition group-hover:bg-green-100 group-hover:text-green-700 dark:bg-green-900/20 dark:text-green-300 dark:group-hover:bg-green-950/30 dark:group-hover:text-green-200">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-800 dark:text-white">
                  {metric.label}
                </h3>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {metric.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
