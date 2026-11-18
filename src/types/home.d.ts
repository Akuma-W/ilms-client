import type { LucideIcon } from 'lucide-react';

export interface HomeBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  href: string;
}

export interface HomeFeature {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export interface HomeStep {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface HomeStat {
  value: string;
  label: string;
  icon: LucideIcon;
  color?: string;
}

export interface HomeAbout {
  badge: string;
  title: string;
  highlightTitle: string;
  description: string;
  image: string;
  stats: HomeStat[];
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
}
