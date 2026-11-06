'use client';

import React from 'react';
import { ChevronsUpDown, LucideIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface ClassTabToolbarProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColorClassName?: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  onToggleExpandAll?: () => void;
  showExpandAll?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Standardized header toolbar for class tabs (Overview, Materials, Assignments, Quizzes).
 * Ensures uniform typography, search controls, expand-all button, and action slot.
 */
export function ClassTabToolbar({
  title,
  description,
  icon: Icon,
  iconColorClassName = 'text-cyan-600 dark:text-cyan-400',
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Tìm kiếm...',
  onToggleExpandAll,
  showExpandAll = false,
  actions,
  className,
}: ClassTabToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60',
        className,
      )}
    >
      {/* Left: Title & Description */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <Icon className={cn('size-6 shrink-0', iconColorClassName)} />
          {title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      {/* Right: Search, Expand All & Action Slot */}
      <div className="flex items-center gap-2">
        <div className="relative w-48 sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8.5 text-sm h-9 rounded-lg"
          />
        </div>

        {showExpandAll && onToggleExpandAll && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onToggleExpandAll}
                className="size-9 shrink-0 rounded-lg"
              >
                <ChevronsUpDown className="size-4" />
                <span className="sr-only">Mở rộng / Thu gọn tất cả</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Mở rộng / Thu gọn tất cả</TooltipContent>
          </Tooltip>
        )}

        {actions}
      </div>
    </div>
  );
}
