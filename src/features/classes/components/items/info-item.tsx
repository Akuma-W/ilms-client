'use client';

import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string | null;
  iconClass?: string;
  subtleBg?: string;
  color?: string;
}

/**
 * Compact, vibrant info tile displaying a key classroom attribute.
 */
export function InfoItem({ icon: Icon, label, value, iconClass, subtleBg, color }: InfoItemProps) {
  return (
    <Card className="group border border-border/80 bg-card/80 backdrop-blur-xs shadow-2xs hover:border-primary/50 hover:shadow-xs transition-all duration-200 py-4">
      <CardContent className="flex items-center gap-4 p-3 sm:p-3.5">
        <div
          className={cn(
            'size-10 rounded-xl flex items-center justify-center shrink-0 border border-primary/20 transition-all duration-200',
            subtleBg || color || 'bg-primary/10',
            iconClass || 'text-primary',
            'group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground',
          )}
        >
          <Icon className="size-5" />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-xs sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-0.5 truncate text-sm sm:text-base font-bold text-foreground">
            {value || '—'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
