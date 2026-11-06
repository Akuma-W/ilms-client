'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ResourceCard, UnifiedResource } from './resource-card';

interface ResourceGroupProps {
  title: string;
  icon: React.ReactNode;
  items: UnifiedResource[];
  classId: string;
  isTeacher?: boolean;
  emptyMessage?: string;
  addTooltipText?: string;
  onPreview?: (item: UnifiedResource) => void;
  onEdit?: (item: UnifiedResource) => void;
  onDelete?: (item: UnifiedResource) => void;
  onAdd?: () => void;
}

/**
 * Section container for one category of topic resources (Lectures, References, Assignments, Quizzes).
 */
export function ResourceGroup({
  title,
  icon,
  items,
  classId,
  isTeacher = false,
  emptyMessage,
  addTooltipText,
  onPreview,
  onEdit,
  onDelete,
  onAdd,
}: ResourceGroupProps) {
  if (items.length === 0 && !isTeacher) {
    return null;
  }

  return (
    <div className="space-y-2">
      {/* Category Header */}
      <div className="flex items-center justify-between pt-2 pb-1">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-xs font-semibold text-foreground tracking-tight">{title}</span>
          <span className="text-[11px] text-muted-foreground px-1.5 py-0.2 rounded-full bg-muted font-normal">
            {items.length}
          </span>
        </div>

        {isTeacher && onAdd && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onAdd}
                className="size-6 text-muted-foreground hover:text-foreground"
              >
                <Plus className="size-3" />
                <span className="sr-only">{addTooltipText || `Thêm ${title.toLowerCase()}`}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {addTooltipText || `Thêm ${title.toLowerCase()}`}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Resources Grid / Empty State */}
      {items.length === 0 ? (
        <div className="p-3 text-center rounded-lg border border-dashed border-border/60 bg-muted/10 text-xs text-muted-foreground">
          {emptyMessage || `Chưa có ${title.toLowerCase()} nào được đính kèm.`}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {items.map((item) => (
            <ResourceCard
              key={`${item.kind}-${item.data.id}`}
              item={item}
              classId={classId}
              isTeacher={isTeacher}
              onPreview={onPreview}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
