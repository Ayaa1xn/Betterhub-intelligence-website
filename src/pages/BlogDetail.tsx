import { ArrowLeft, Clock, CalendarDays } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { formatLongDate, sanitizeRichText } from '../lib/richText';
import SmartMedia from '../components/SmartMedia';

interface BlogDetailProps {
  blogId: string;
  onNavigate: (path: string) => void;
}

export default function BlogDetail({ blogId, onNavigate }: BlogDetailProps) {
  const {
    content: { blogPosts },
  } = useSiteContent();
  const post = blogPosts.find((item) => item.id === blogId);

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-24 text-center text-slate-800 dark:bg-slate-950 dark:text-slate-100">
        <h2 className="text-2xl font-black">Article Not Found</h2>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          The article you requested is unavailable or still in draft mode.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/blog')}
          className="mt-6 rounded-full bg-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          Return to Blog
        </button>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="border-b border-slate-200 bg-white py-20 transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => onNavigate('/blog')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </button>

          <div className="mt-8 space-y-6">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
              {post.category}
            </div>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
              {post.title}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {post.summary}
            </p>

            <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{post.author}</span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-blue-500" />
                {formatLongDate(post.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-blue-500" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <SmartMedia
            image={post.image}
            video={post.video}
            poster={post.poster}
            alt={post.alt || post.title}
            loading="eager"
            mediaClassName="h-72 w-full object-cover md:h-96"
            showVideoBadge
          />
          <div className="px-6 py-8 sm:px-8 md:px-12">
            <div
              className="rich-article"
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(post.content) }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
