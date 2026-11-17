'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MemberSectionCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  badgeLabel?: string;
  badgeClassName?: string;
  isOpen: boolean;
  onToggle: () => void;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function MemberSectionCard({
  title,
  icon: Icon,
  count,
  badgeLabel,
  badgeClassName,
  isOpen,
  onToggle,
  action,
  children,
}: MemberSectionCardProps) {
  return (
    <section className="space-y-4">
      {/* Section Header with Title and Horizontal Border */}
      <div
        className="flex items-center justify-between gap-3 py-2 border-b border-border/80 cursor-pointer rounded-md transition-colors hover:bg-muted/50"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2.5 pl-2 min-w-0">
          <div className="text-primary shrink-0">
            <Icon className="size-4.5" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-foreground truncate">{title}</h3>
          {count !== undefined && (
            <Badge
              variant="outline"
              className={cn(
                'text-xs font-semibold px-2 py-0.5 rounded-md border-border shrink-0',
                badgeClassName,
              )}
            >
              {badgeLabel || `${count}`}
            </Badge>
          )}
        </div>

        {/* Right side controls: Action button + Expanse toggle button */}
        <div
          className="flex items-center gap-2 shrink-0"
          onClick={(event) => event.stopPropagation()}
        >
          {action}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground gap-1.5"
            aria-expanded={isOpen}
          >
            <span>{isOpen ? 'Thu gọn' : 'Mở rộng'}</span>
            <ChevronDown
              className={cn(
                'size-4 transition-transform duration-200',
                isOpen ? 'rotate-180 text-foreground' : 'rotate-0',
              )}
            />
          </Button>
        </div>
      </div>

      {/* Section Body */}
      {isOpen && <div>{children}</div>}
    </section>
  );
}
