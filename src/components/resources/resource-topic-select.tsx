'use client';

import { Layers } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Topic } from '@/types/topic';

interface ResourceTopicSelectProps {
  topics?: Topic[];
  selectedTopicId: string;
  onTopicChange: (topicId: string) => void;
  disabled?: boolean;
  isReadOnly?: boolean;
}

/**
 * Topic selector with read-only view when adding from a specific topic.
 */
export function ResourceTopicSelect({
  topics = [],
  selectedTopicId,
  onTopicChange,
  disabled = false,
  isReadOnly = false,
}: ResourceTopicSelectProps) {
  const selectedTopic = topics.find((t) => t.id === selectedTopicId);

  // When a topic is pre-selected / fixed, display a prominent read-only badge
  if (isReadOnly || (disabled && selectedTopic)) {
    return (
      <div className="space-y-1.5 w-full">
        <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
          <Layers className="size-3.5 text-emerald-500" />
          Chủ đề bài học
        </Label>
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/40 border border-border/70 text-sm font-medium text-foreground select-none">
          {selectedTopic?.orderIndex !== undefined && (
            <span className="flex items-center justify-center size-5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0">
              {selectedTopic.orderIndex}
            </span>
          )}
          <span className="truncate">{selectedTopic?.title || 'Chủ đề bài học'}</span>
          <span className="text-[11px] text-muted-foreground ml-auto whitespace-nowrap bg-muted px-2 py-0.5 rounded font-normal">
            Đang đính kèm
          </span>
        </div>
      </div>
    );
  }

  if (topics.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium flex items-center gap-1.5 text-foreground">
        <Layers className="size-3.5 text-emerald-500" />
        Chủ đề bài học <span className="text-destructive">*</span>
      </Label>

      <Select value={selectedTopicId} onValueChange={onTopicChange} disabled={disabled}>
        <SelectTrigger className="h-10 text-sm rounded-xl bg-background w-full max-w-full overflow-hidden text-left">
          <span className="truncate block flex-1 text-left">
            <SelectValue placeholder="Chọn chủ đề" />
          </span>
        </SelectTrigger>
        <SelectContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
          {topics.map((t) => (
            <SelectItem key={t.id} value={t.id} className="text-sm cursor-pointer max-w-full">
              <span className="truncate block">{t.title}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
