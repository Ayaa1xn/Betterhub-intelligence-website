import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { formatLongDate } from '../lib/richText';
import SmartMedia from '../components/SmartMedia';

interface BlogProps {
  onNavigate: (path: string) => void;
}

export default function Blog({ onNavigate }: BlogProps) {
  const {
    content: { blogPosts, pageMedia },
  } = useSiteContent();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="relative overflow-hidden border-b border-slate-200 bg-white py-20 transition-colors dark:border-slate-800 dark:bg-slate-900">
        <SmartMedia
          image={pageMedia.blogHero.image}
          video={pageMedia.blogHero.video}
          poster={pageMedia.blogHero.poster}
          alt={pageMedia.blogHero.alt || pageMedia.blogHero.title}
          loading="eager"
          mediaClassName="absolute inset-0 h-full w-full object-cover opacity-[0.22] scale-[1.02]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Articles, explainers, and operational thinking
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-500 dark:text-slate-400">
            A public content stream focused on practical systems, structured growth, and the work
            that sits between delivery and long-term maintainability.
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
            >
              <div className="relative h-52 overflow-hidden bg-slate-950">
                <SmartMedia
                  image={post.image}
                  poster={post.poster}
                  alt={post.alt || post.title}
                  className="h-full w-full"
                  mediaClassName="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
                  {post.category}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    {formatLongDate(post.publishedAt)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-blue-500" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-black tracking-tight text-slate-900 transition group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-300">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                  {post.summary}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    By {post.author.split(',')[0]}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate(`/blog/${post.id}`)}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600 transition hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
                  >
                    Read article
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
