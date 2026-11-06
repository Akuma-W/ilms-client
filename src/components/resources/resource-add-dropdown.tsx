'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TOPIC_RESOURCE_MENU_ITEMS } from '@/config';
import { cn } from '@/lib/utils';
import type { ResourceCreationType } from '@/types/topic';

export interface ResourceAddDropdownProps {
  mode?: 'overview' | 'materials' | 'assignments' | 'quizzes';
  variant?: 'icon' | 'button';
  label?: string;
  buttonClassName?: string;
  triggerClassName?: string;
  align?: 'start' | 'center' | 'end';
  onSelect: (type: ResourceCreationType) => void;
}

/**
 * Universal dropdown menu for creating learning resources (Lectures, References, Assignments, Quizzes).
 * Supports both compact icon variant (in topic rows) and labeled button variant (in tab toolbars).
 */
export function ResourceAddDropdown({
  mode = 'overview',
  variant = 'icon',
  label,
  buttonClassName,
  triggerClassName,
  align = 'end',
  onSelect,
}: ResourceAddDropdownProps) {
  const defaultLabel = mode === 'materials' ? 'Thêm tài liệu' : 'Thêm tài nguyên';
  const displayLabel = label || defaultLabel;

  const items = React.useMemo(() => {
    if (mode === 'materials') {
      return TOPIC_RESOURCE_MENU_ITEMS.filter(
        (item) => item.type === 'material' || item.type === 'reference',
      );
    }
    if (mode === 'assignments') {
      return TOPIC_RESOURCE_MENU_ITEMS.filter((item) => item.type === 'assignment');
    }
    if (mode === 'quizzes') {
      return TOPIC_RESOURCE_MENU_ITEMS.filter((item) => item.type === 'quiz');
    }
    return TOPIC_RESOURCE_MENU_ITEMS;
  }, [mode]);

  return (
    <DropdownMenu>
      {variant === 'icon' ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  'size-8 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10',
                  triggerClassName,
                )}
              >
                <Plus className="size-4" />
                <span className="sr-only">{displayLabel}</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">{displayLabel}</TooltipContent>
        </Tooltip>
      ) : (
        <DropdownMenuTrigger asChild>
          <Button
            className={cn(
              'h-9 rounded-lg px-3.5 gap-1.5 shrink-0 shadow-sm font-medium text-sm',
              buttonClassName ||
                'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600',
            )}
          >
            <Plus className="size-4" />
            <span>{displayLabel}</span>
          </Button>
        </DropdownMenuTrigger>
      )}

      <DropdownMenuContent
        align={align}
        className="w-72 p-1.5 space-y-1 bg-popover/95 backdrop-blur-md border-border/80 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {mode === 'materials' ? 'Chọn loại học liệu' : 'Chọn loại tài nguyên'}
        </div>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem
              key={item.type}
              onClick={() => onSelect(item.type)}
              className="flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-colors focus:bg-accent hover:bg-accent/80"
            >
              <div
                className={cn(
                  'p-1.5 rounded-md border shrink-0 mt-0.5',
                  item.bgColor,
                  item.borderColor,
                  item.color,
                )}
              >
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
