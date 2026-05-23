import {
  Award,
  Compass,
  Network,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import SmartMedia from '../components/SmartMedia';
import { useSiteContent } from '../context/SiteContentContext';

export default function About() {
  const {
    content: { pageMedia },
  } = useSiteContent();
  const principles = [
    {
      title: 'Performance-First Delivery',
      description:
        'We treat speed, stability, and findability as product requirements, not polish that gets added after launch.',
      icon: Zap,
    },
    {
      title: 'Regional Execution',
      description:
        'Our delivery approach is shaped around UAE expectations, operational realities, and real compliance-sensitive environments.',
      icon: Compass,
    },
    {
      title: 'Security by Design',
      description:
        'From architecture decisions to deployment habits, we bias toward safer defaults, clearer ownership, and lower operational risk.',
      icon: ShieldCheck,
    },
    {
      title: 'Applied AI Thinking',
      description:
        'We focus on practical automation, better user journeys, and stronger internal workflows instead of trend-driven feature stuffing.',
      icon: Sparkles,
    },
  ];

  const pillars = [
    {
      title: 'Software Systems',
      description:
        'Web platforms, product engineering, internal tools, and custom business systems designed to scale cleanly.',
      icon: Target,
    },
    {
      title: 'Infrastructure & Networks',
      description:
        'Enterprise networking, cloud foundations, structured environments, and resilient delivery pipelines.',
      icon: Network,
    },
    {
      title: 'Operational Partnership',
      description:
        'We stay close to outcomes, helping teams prioritize the next move instead of disappearing after handover.',
      icon: Users,
    },
  ];

  const process = [
    {
      step: '01',
      title: 'Discover',
      description:
        'We clarify business goals, technical constraints, and what success should look like in measurable terms.',
    },
    {
      step: '02',
      title: 'Design',
      description:
        'We shape information architecture, delivery scope, and implementation choices before momentum turns into rework.',
    },
    {
      step: '03',
      title: 'Build',
      description:
        'We ship in focused iterations with clean code, real QA, and regular feedback loops across product and delivery teams.',
    },
    {
      step: '04',
      title: 'Evolve',
      description:
        'We monitor, improve, and expand the platform so the site keeps earning trust after the first release.',
    },
  ];

  return (
    <div className="bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950 py-24 dark:border-slate-800">
        <SmartMedia
          image={pageMedia.aboutHero.image}
          video={pageMedia.aboutHero.video}
          poster={pageMedia.aboutHero.poster}
          alt={pageMedia.aboutHero.alt || pageMedia.aboutHero.title}
          loading="eager"
          mediaClassName="absolute inset-0 h-full w-full object-cover opacity-[0.28] scale-[1.02]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.16),_transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-14 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="max-w-3xl space-y-6">
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Building digital systems that are fast, durable, and commercially useful.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-300">
              BetterHub combines software delivery, operational thinking, and technical discipline
              to help companies launch better websites, smarter products, and more reliable
              internal systems.
            </p>
          </div>

          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur">
              <div className="inline-flex rounded-2xl bg-white/10 p-3 text-blue-200">
                <Award className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-lg font-black text-white">Execution Standards</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                We care about architecture, quality, accessibility, maintainability, and business
                clarity at the same time.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur">
              <div className="inline-flex rounded-2xl bg-white/10 p-3 text-emerald-200">
                <Network className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-lg font-black text-white">Cross-Discipline Delivery</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Our work spans public websites, internal systems, infrastructure, and operational
                tooling without losing cohesion.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-20 transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              The way we work should make the business easier to run.
            </h2>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
              The best technical work reduces confusion, shortens decision cycles, and gives
              teams more confidence in what happens next.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <article
                  key={principle.title}
                  className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-700 dark:hover:shadow-slate-950/40"
                >
                  <div className="inline-flex rounded-2xl bg-blue-100 p-3 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-black text-slate-900 dark:text-white">
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {principle.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 py-20 transition-colors dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                One partner across product, platform, and operations.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                We help organizations move from disconnected effort into systems that actually work
                together: public presence, internal workflows, business logic, and the technical
                foundations underneath them.
              </p>
            </div>

            <div className="space-y-4">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="rounded-[1.5rem] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-slate-900 p-3 text-white dark:bg-slate-800">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">
                          {pillar.title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 transition-colors dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              A delivery rhythm built for clarity and momentum.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {process.map((item) => (
              <article
                key={item.step}
                className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950"
              >
                <span className="text-3xl font-black text-blue-200 dark:text-blue-950/90">
                  {item.step}
                </span>
                <h3 className="mt-5 text-lg font-black text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
