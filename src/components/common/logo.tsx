import { siteConfig } from '@/config';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  withSlogan?: boolean;
  className?: string;
}

export function Logo({
  variant = 'light',
  size = 'md',
  withText = true,
  withSlogan = false,
  className,
}: LogoProps) {
  const { name, slogan, logo } = siteConfig;

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-14 w-14',
    lg: 'h-24 w-24',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const textColor1 = variant === 'light' ? 'text-galaxy-blue' : 'text-blue-400';
  const textColor2 = variant === 'light' ? 'text-galaxy-purple' : 'text-purple-400';

  const sloganColor = variant === 'light' ? 'text-gray-500' : 'text-slate-500';

  return (
    <Link href="/" className={cn('flex items-center gap-1 select-none cursor-pointer', className)}>
      <div className={cn('relative flex items-center justify-center shrink-0', sizeClasses[size])}>
        <Image src={logo} fill alt={name} className="w-full h-full object-contain" />
      </div>

      <div className="flex flex-col leading-tight">
        {withText && (
          <div className={cn('font-bold leading-tight tracking-tight', textSizes[size])}>
            <span className={cn(textColor1)}>KEI</span>
            <span className={cn(textColor2)}>Verse</span>
          </div>
        )}

        {withSlogan && (
          <span
            className={cn(
              'text-[10px] text-gray-500 font-medium uppercase tracking-wider',
              sloganColor,
            )}
          >
            {slogan}
          </span>
        )}
      </div>
    </Link>
  );
}
