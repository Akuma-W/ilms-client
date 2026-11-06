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
