import logoImage from '../assets/bhi-transparent-logo.png';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  taglineClassName?: string;
}

const fullLogoSizes = {
  sm: 'h-10 w-auto',
  md: 'h-12 w-auto',
  lg: 'h-14 w-auto',
  xl: 'h-[4.5rem] w-auto',
} as const;

const iconLogoSizes = {
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-[4.5rem] w-[4.5rem]',
} as const;

const taglineStyles = {
  sm: 'text-[0.5rem] tracking-[0.18em]',
  md: 'text-[0.54rem] tracking-[0.2em]',
  lg: 'text-[0.58rem] tracking-[0.22em]',
  xl: 'text-[0.62rem] tracking-[0.23em]',
} as const;

export default function Logo({
  className = '',
  iconOnly = false,
  size = 'md',
  showTagline = true,
  taglineClassName = '',
}: LogoProps) {
  const frameSize = iconOnly ? iconLogoSizes[size] : fullLogoSizes[size];
  const shouldShowTagline = showTagline && !iconOnly;

  return (
    <div className={`flex select-none ${className}`}>
      <div className="flex flex-col items-center">
        <div className={`overflow-hidden ${frameSize}`}>
          <img
            src={logoImage}
            alt={iconOnly ? 'BetterHub Intelligence icon' : 'BetterHub Intelligence'}
            className="h-full w-full object-contain"
            decoding="async"
            draggable={false}
            loading="eager"
          />
        </div>

        {shouldShowTagline ? (
          <p
            className={`mt-0.5 whitespace-nowrap text-center font-bold uppercase leading-none text-slate-700 dark:text-slate-300 ${taglineStyles[size]} ${taglineClassName}`}
          >
            Connecting Technology, Ideas, and Impact
          </p>
        ) : null}
      </div>
    </div>
  );
}
