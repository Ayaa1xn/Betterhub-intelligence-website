import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import SmartMedia from './SmartMedia';

interface HeroSliderProps {
  onNavigate: (path: string) => void;
}

export default function HeroSlider({ onNavigate }: HeroSliderProps) {
  const {
    content: { heroSlides },
  } = useSiteContent();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!heroSlides.length) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % heroSlides.length);
    }, 6800);

    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  if (!heroSlides.length) {
    return null;
  }

  const currentSlide = heroSlides[currentIndex];
  
  // Only render current, previous, and next slides to avoid rendering all slides
  const indicesToRender = useMemo(() => {
    const prev = (currentIndex - 1 + heroSlides.length) % heroSlides.length;
    const next = (currentIndex + 1) % heroSlides.length;
    return new Set([prev, currentIndex, next]);
  }, [currentIndex, heroSlides.length]);

  return (
    <section className="relative h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 contain-layout contain-paint">
        {heroSlides.map((slide, index) => {
          const isActive = index === currentIndex;
          const shouldRender = indicesToRender.has(index);
          
          if (!shouldRender) return null;

          return (
              <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              style={{ willChange: isActive ? 'opacity' : 'auto' }}
            >
              <SmartMedia
                image={slide.image}
                poster={slide.poster}
                alt={slide.alt || slide.title}
                loading={isActive ? 'eager' : 'lazy'}
                mediaClassName={`h-full w-full object-cover hero-slide-media ${
                  isActive ? 'hero-slide-media-active' : ''
                }`}
              />
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_35%),linear-gradient(90deg,rgba(2,6,23,0.96)_0%,rgba(2,6,23,0.78)_42%,rgba(2,6,23,0.7)_100%)]" />
            </div>
          );
        })}
      </div>

      <div className="relative z-10 mx-auto flex h-screen max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">

          <h1 className="max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
            {currentSlide.title}
          </h1>
          <p className="max-w-xl text-sm leading-8 text-slate-200 sm:text-base">
            {currentSlide.subtitle}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              type="button"
              onClick={() => onNavigate(currentSlide.ctaPath)}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
            >
              {currentSlide.ctaText}
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className="rounded-full border border-white/20 bg-slate-900/50 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-100 transition hover:border-white/30 hover:bg-slate-800/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Immediate Callback
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setCurrentIndex((currentIndex - 1 + heroSlides.length) % heroSlides.length)}
        className="absolute left-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-900/40 text-white/80 transition hover:border-white/20 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => setCurrentIndex((currentIndex + 1) % heroSlides.length)}
        className="absolute right-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-900/40 text-white/80 transition hover:border-white/20 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-2.5">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-12 bg-blue-500' : 'w-8 bg-white/25 hover:bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
