import { ImageOff, PlayCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface SmartMediaProps {
  image?: string;
  video?: string;
  poster?: string;
  alt: string;
  className?: string;
  mediaClassName?: string;
  fallbackClassName?: string;
  loading?: 'eager' | 'lazy';
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  showVideoBadge?: boolean;
}

export default function SmartMedia({
  image,
  video,
  poster,
  alt,
  className = '',
  mediaClassName = '',
  fallbackClassName = '',
  loading = 'lazy',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  showVideoBadge = false,
}: SmartMediaProps) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setVideoFailed(false);
    setImageFailed(false);
  }, [image, video, poster]);

  const posterSource = useMemo(() => poster || image, [image, poster]);
  const shouldRenderVideo = Boolean(video) && !videoFailed;
  const shouldRenderImage = Boolean(image) && (!video || videoFailed) && !imageFailed;

  return (
    <div className={`overflow-hidden bg-slate-950 ${className}`}>
      {shouldRenderVideo ? (
        <video
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          preload="metadata"
          poster={posterSource}
          className={mediaClassName}
          onError={() => setVideoFailed(true)}
        >
          <source src={video} type={guessMime(video)} />
        </video>
      ) : shouldRenderImage ? (
        <img
          src={image}
          alt={alt}
          loading={loading}
          decoding="async"
          referrerPolicy="no-referrer"
          className={`${mediaClassName} object-cover`}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_35%),linear-gradient(135deg,#020617,#0f172a)] text-slate-300 ${fallbackClassName}`}
        >
          <div className="flex flex-col items-center gap-2 px-6 text-center">
            <ImageOff className="h-7 w-7 text-slate-500" />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Media unavailable
            </p>
            <p className="max-w-xs text-xs leading-6 text-slate-500">{alt}</p>
          </div>
        </div>
      )}

      {showVideoBadge && shouldRenderVideo ? (
        <div className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/65 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
          <PlayCircle className="h-3.5 w-3.5 text-blue-300" />
          Video
        </div>
      ) : null}
    </div>
  );
}

function guessMime(url: string) {
  if (url.endsWith('.mov')) {
    return 'video/quicktime';
  }

  if (url.endsWith('.webm')) {
    return 'video/webm';
  }

  return 'video/mp4';
}
