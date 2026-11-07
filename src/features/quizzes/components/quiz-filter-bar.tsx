'use client';

import { Button } from '@/components/ui/button';
import type { QuizFilterTab } from '@/types/quiz';
import type { Topic } from '@/types/topic';

interface QuizFilterBarProps {
  filterTab: QuizFilterTab;
  onFilterTabChange: (tab: QuizFilterTab) => void;
  totalQuizzesCount: number;
  openCount: number;
  completedCount: number;
  topics: Topic[];
  selectedTopicId: string;
  onTopicChange: (topicId: string) => void;
}

/**
 * Filter bar for Classroom Quizzes.
 * Provides tab-based status filters and a dropdown to filter by topic.
 */
export function QuizFilterBar({
  filterTab,
  onFilterTabChange,
  totalQuizzesCount,
  openCount,
  completedCount,
  topics = [],
  selectedTopicId,
  onTopicChange,
}: QuizFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        <Button
          type="button"
          variant={filterTab === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterTabChange('all')}
          className="h-8.5 text-xs font-semibold rounded-xl"
        >
          Tất cả ({totalQuizzesCount})
        </Button>

        <Button
          type="button"
          variant={filterTab === 'open' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterTabChange('open')}
          className="h-8.5 text-xs font-semibold rounded-xl"
        >
          Đang mở ({openCount})
        </Button>

        <Button
          type="button"
          variant={filterTab === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterTabChange('completed')}
          className="h-8.5 text-xs font-semibold rounded-xl"
        >
          Đã làm ({completedCount})
        </Button>

        <Button
          type="button"
          variant={filterTab === 'closed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterTabChange('closed')}
          className="h-8.5 text-xs font-semibold rounded-xl"
        >
          Đã kết thúc
        </Button>
      </div>

      {topics.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
            Chủ đề:
          </span>
          <select
            value={selectedTopicId}
            onChange={(e) => onTopicChange(e.target.value)}
            className="h-8.5 text-xs font-semibold rounded-xl border border-border bg-background px-2.5 focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="all">Tất cả chủ đề</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
