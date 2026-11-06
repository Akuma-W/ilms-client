'use client';

import Link from 'next/link';
import {
  Play,
  FileText,
  Presentation,
  Link as LinkIcon,
  Bookmark,
  ClipboardList,
  HelpCircle,
  Eye,
  Download,
  ExternalLink,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getMaterialBadgeConfig, formatDateVi } from '../../utils/resource.utils';
import type { Material, Reference } from '@/types/topic';
import type { Assignment } from '@/types/assignment';
import type { Quiz } from '@/types/quiz';

export type UnifiedResource =
  | { kind: 'material'; data: Material }
  | { kind: 'reference'; data: Reference }
  | { kind: 'assignment'; data: Assignment }
  | { kind: 'quiz'; data: Quiz };

interface ResourceCardProps {
  item: UnifiedResource;
  classId: string;
  isTeacher?: boolean;
  onPreview?: (item: UnifiedResource) => void;
  onEdit?: (item: UnifiedResource) => void;
  onDelete?: (item: UnifiedResource) => void;
}

function ResourceIcon({ item }: { item: UnifiedResource }) {
  if (item.kind === 'material') {
    switch (item.data.materialType) {
      case 'video':
        return <Play className="size-4 text-blue-500 shrink-0" />;
      case 'pdf':
        return <FileText className="size-4 text-red-500 shrink-0" />;
      case 'slide':
        return <Presentation className="size-4 text-orange-500 shrink-0" />;
      case 'document':
        return <FileText className="size-4 text-emerald-500 shrink-0" />;
      default:
        return <LinkIcon className="size-4 text-purple-500 shrink-0" />;
    }
  }
  if (item.kind === 'reference') {
    return <Bookmark className="size-4 text-emerald-500 shrink-0" />;
  }
  if (item.kind === 'assignment') {
    return <ClipboardList className="size-4 text-amber-500 shrink-0" />;
  }
  return <HelpCircle className="size-4 text-indigo-500 shrink-0" />;
}

function ResourceBadges({ item }: { item: UnifiedResource }) {
  if (item.kind === 'material') {
    const badge = getMaterialBadgeConfig(item.data.materialType);
    return (
      <span
        className={`px-2 py-0.5 text-[11px] font-medium rounded border ${badge.bg} ${badge.text} ${badge.border}`}
      >
        {badge.label}
      </span>
    );
  }
  if (item.kind === 'reference') {
    return (
      <span className="px-2 py-0.5 text-[11px] font-medium rounded border bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20">
        Tham khảo
      </span>
    );
  }
  if (item.kind === 'assignment') {
    return (
      <span className="px-2 py-0.5 text-[11px] font-medium rounded border bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20">
        Bài tập
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 text-[11px] font-medium rounded border bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20">
      Trắc nghiệm
    </span>
  );
}

/**
 * Compact resource item row with icon-only action buttons and tooltips.
 */
export function ResourceCard({
  item,
  classId,
  isTeacher = false,
  onPreview,
  onEdit,
  onDelete,
}: ResourceCardProps) {
  const title = item.data.title;

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors group">
      {/* Left: Icon, Title & Meta */}
      <div className="flex items-center gap-2.5 min-w-0 pr-2">
        <ResourceIcon item={item} />
        <div className="min-w-0">
          <p className="text-xs font-medium text-foreground truncate">{title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <ResourceBadges item={item} />
            {item.kind === 'assignment' && item.data.dueAt && (
              <span className="text-[11px] text-muted-foreground truncate">
                Hạn: {formatDateVi(item.data.dueAt)}
              </span>
            )}
            {item.kind === 'quiz' && item.data.timeLimit > 0 && (
              <span className="text-[11px] text-muted-foreground truncate">
                {item.data.timeLimit} phút
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Compact Action Buttons with Tooltip */}
      <div className="flex items-center gap-1 shrink-0">
        {item.kind === 'material' && (
          <>
            {onPreview && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onPreview(item)}
                    className="size-7 text-muted-foreground hover:text-cyan-600 dark:hover:text-cyan-400"
                  >
                    <Eye className="size-3.5" />
                    <span className="sr-only">Xem trước</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Xem trước tài liệu</TooltipContent>
              </Tooltip>
            )}

            {item.data.materialType === 'link' ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-foreground"
                  >
                    <a
                      href={item.data.externalUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="size-3.5" />
                      <span className="sr-only">Mở liên kết</span>
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Mở liên kết gốc</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-foreground"
                  >
                    <a
                      href={item.data.fileUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <Download className="size-3.5" />
                      <span className="sr-only">Tải tệp tin</span>
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Tải tệp tin</TooltipContent>
              </Tooltip>
            )}
          </>
        )}

        {item.kind === 'reference' && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground hover:text-foreground"
              >
                <a href={item.data.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-3.5" />
                  <span className="sr-only">Mở tài liệu tham khảo</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Mở tài liệu tham khảo</TooltipContent>
          </Tooltip>
        )}

        {item.kind === 'assignment' && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground hover:text-foreground"
              >
                <Link href={`/classes/${classId}/assignments/${item.data.id}`}>
                  <Eye className="size-3.5" />
                  <span className="sr-only">Chi tiết bài tập</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Xem chi tiết bài tập</TooltipContent>
          </Tooltip>
        )}

        {item.kind === 'quiz' && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground hover:text-foreground"
              >
                <Link href={`/classes/${classId}/quizzes/${item.data.id}`}>
                  <Eye className="size-3.5" />
                  <span className="sr-only">Chi tiết trắc nghiệm</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Làm bài / Xem trắc nghiệm</TooltipContent>
          </Tooltip>
        )}

        {/* Teacher Edit & Delete Actions */}
        {isTeacher && (
          <>
            {onEdit && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item)}
                    className="size-7 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="size-3.5" />
                    <span className="sr-only">Chỉnh sửa</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Chỉnh sửa</TooltipContent>
              </Tooltip>
            )}

            {onDelete && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item)}
                    className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3.5" />
                    <span className="sr-only">Xóa</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Xóa tài nguyên</TooltipContent>
              </Tooltip>
            )}
          </>
        )}
      </div>
    </div>
  );
}
