import { useWebsiteConfig } from "@/hooks/useConfig";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  withSlogan?: boolean;
  className?: string;
};

export function Logo({
  variant = 'light',
  size = 'md',
  withText = true,
  withSlogan = false,
  className
}: LogoProps) {
  const { slogan, logo } = useWebsiteConfig();

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

  const textColor = variant === 'light' ? 'text-white' : 'text-slate-900';

  const sloganColor = variant === 'light' ? 'text-blue-200' : 'text-slate-500';

  return (
    <Link href="/" className={cn('flex items-center gap-1 select-none cursor-pointer', className)}>
      <div className={cn('relative flex items-center justify-center shrink-0', sizeClasses[size])}>
        <Image
          src={logo}
          alt="Logo"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex flex-col leading-tight">
        {withText && (
          <div
            className={cn(
              'font-heading font-extrabold tracking-tight flex items-baseline',
              textSizes[size],
              textColor,
            )}
          >
            <span className="text-[#483d8b]">KEI</span>
            <span className="text-[#3096d5]">Verse</span>
          </div>
        )}

        {withSlogan && (
          <span
            className={cn('text-[9px] md:text-[11px] font-bold leading-none mt-1', sloganColor)}
          >
            {slogan}
          </span>
        )}
      </div>
    </Link>
  );
}
