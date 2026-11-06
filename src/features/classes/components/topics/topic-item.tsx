'use client';

import {
  ChevronDown,
  ChevronUp,
  Plus,
  Pencil,
  Trash2,
  FileText,
  Bookmark,
  ClipboardList,
  HelpCircle,
  Paperclip,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ResourceGroup } from './resource-group';
import type { UnifiedResource } from './resource-card';
import type { Topic } from '@/types/topic';

interface TopicItemProps {
  topic: Topic;
  index: number;
  classId: string;
  isExpanded: boolean;
  isTeacher?: boolean;
  mode?: 'overview' | 'materials';
  onToggleExpand: () => void;
  onAddResource?: (topicId: string) => void;
  onEditTopic?: (topic: Topic) => void;
  onDeleteTopic?: (topicId: string) => void;
  onPreviewResource?: (resource: UnifiedResource) => void;
  onEditResource?: (resource: UnifiedResource) => void;
  onDeleteResource?: (resource: UnifiedResource) => void;
}

/**
 * Accordion item representing one Topic with categorized resources.
 */
export function TopicItem({
  topic,
  index,
  classId,
  isExpanded,
  isTeacher = false,
  mode = 'overview',
  onToggleExpand,
  onAddResource,
  onEditTopic,
  onDeleteTopic,
  onPreviewResource,
  onEditResource,
  onDeleteResource,
}: TopicItemProps) {
  const materials: UnifiedResource[] = (topic.materials || []).map((m) => ({
    kind: 'material',
    data: m,
  }));
  const references: UnifiedResource[] = (topic.references || []).map((r) => ({
    kind: 'reference',
    data: r,
  }));
  const assignments: UnifiedResource[] = (topic.assignments || []).map((a) => ({
    kind: 'assignment',
    data: a,
  }));
  const quizzes: UnifiedResource[] = (topic.quizzes || []).map((q) => ({
    kind: 'quiz',
    data: q,
  }));

  const totalCount =
    mode === 'materials'
      ? materials.length + references.length
      : materials.length + references.length + assignments.length + quizzes.length;

  const addTooltipLabel = mode === 'materials' ? 'Thêm tài liệu' : 'Thêm tài nguyên';

  return (
    <div
      className={`rounded-xl border transition-all ${
        isExpanded
          ? 'border-cyan-500/40 bg-card shadow-sm'
          : 'border-border/80 bg-card/60 hover:border-border'
      }`}
    >
      {/* Topic Header Accordion Trigger */}
      <div
        onClick={onToggleExpand}
        className="flex items-center justify-between p-4 cursor-pointer select-none"
      >
        <div className="flex items-start gap-3 min-w-0 pr-4">
          <div
            className={`flex items-center justify-center size-8 rounded-lg shrink-0 mt-0.5 ${
              isExpanded
                ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <span className="text-xs font-semibold">{index + 1}</span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-foreground truncate">{topic.title}</h4>
              <span className="text-[11px] text-muted-foreground px-2 py-0.5 rounded-full bg-muted font-normal">
                {totalCount} {mode === 'materials' ? 'tài liệu' : 'tài nguyên'}
              </span>
            </div>

            {topic.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{topic.description}</p>
            )}
          </div>
        </div>

        {/* Right Action Icons with Tooltip */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isTeacher && (
            <>
              {onAddResource && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddResource(topic.id);
                      }}
                      className="size-8 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10"
                    >
                      <Plus className="size-4" />
                      <span className="sr-only">{addTooltipLabel}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">{addTooltipLabel}</TooltipContent>
                </Tooltip>
              )}

              {onEditTopic && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTopic(topic);
                      }}
                      className="size-8 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                      <span className="sr-only">Chỉnh sửa chủ đề</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Chỉnh sửa chủ đề</TooltipContent>
                </Tooltip>
              )}

              {onDeleteTopic && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTopic(topic.id);
                      }}
                      className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-3.5" />
                      <span className="sr-only">Xóa chủ đề</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Xóa chủ đề</TooltipContent>
                </Tooltip>
              )}
            </>
          )}

          <div className="text-muted-foreground p-1">
            {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </div>
        </div>
      </div>

      {/* Expanded Resource Groups Body */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-border/50 space-y-3">
          {totalCount === 0 && !isTeacher ? (
            <div className="py-6 text-center text-xs text-muted-foreground flex flex-col items-center justify-center">
              <Paperclip className="size-5 mb-1.5 opacity-40" />
              <span>Chủ đề này chưa có nội dung nào được đính kèm.</span>
            </div>
          ) : (
            <>
              {/* 1. Lectures / Materials */}
              <ResourceGroup
                title="Bài giảng"
                icon={<FileText className="size-3.5 text-cyan-500" />}
                items={materials}
                classId={classId}
                isTeacher={isTeacher}
                emptyMessage="Chưa có bài giảng nào."
                addTooltipText="Thêm bài giảng"
                onPreview={onPreviewResource}
                onEdit={onEditResource}
                onDelete={onDeleteResource}
                onAdd={onAddResource ? () => onAddResource(topic.id) : undefined}
              />

              {/* 2. References */}
              <ResourceGroup
                title="Tài liệu tham khảo"
                icon={<Bookmark className="size-3.5 text-emerald-500" />}
                items={references}
                classId={classId}
                isTeacher={isTeacher}
                emptyMessage="Chưa có tài liệu tham khảo nào."
                addTooltipText="Thêm tài liệu tham khảo"
                onPreview={onPreviewResource}
                onEdit={onEditResource}
                onDelete={onDeleteResource}
                onAdd={onAddResource ? () => onAddResource(topic.id) : undefined}
              />

              {/* 3 & 4. Assignments & Quizzes only in overview mode */}
              {mode === 'overview' && (
                <>
                  <ResourceGroup
                    title="Bài tập"
                    icon={<ClipboardList className="size-3.5 text-amber-500" />}
                    items={assignments}
                    classId={classId}
                    isTeacher={isTeacher}
                    emptyMessage="Chưa có bài tập nào."
                    addTooltipText="Thêm bài tập"
                    onEdit={onEditResource}
                    onDelete={onDeleteResource}
                  />

                  <ResourceGroup
                    title="Bài trắc nghiệm"
                    icon={<HelpCircle className="size-3.5 text-indigo-500" />}
                    items={quizzes}
                    classId={classId}
                    isTeacher={isTeacher}
                    emptyMessage="Chưa có bài trắc nghiệm nào."
                    addTooltipText="Thêm bài trắc nghiệm"
                    onEdit={onEditResource}
                    onDelete={onDeleteResource}
                  />
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
