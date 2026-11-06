'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Play,
  FileText,
  Presentation,
  Link as LinkIcon,
  ClipboardList,
  HelpCircle,
  Eye,
  Download,
  ExternalLink,
  Pencil,
  Trash2,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getMaterialBadgeConfig, formatDateVi } from '../utils/resource.utils';
import { isDirectFileUrl } from '@/features/upload/utils/file.utils';
import { cn } from '@/lib/utils';
import type { UnifiedResource } from '@/types/topic';

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
        return <Play className="size-4.5 text-blue-500 shrink-0" />;
      case 'pdf':
        return <FileText className="size-4.5 text-red-500 shrink-0" />;
      case 'slide':
        return <Presentation className="size-4.5 text-orange-500 shrink-0" />;
      case 'document':
        return <FileText className="size-4.5 text-emerald-500 shrink-0" />;
      default:
        return <LinkIcon className="size-4.5 text-purple-500 shrink-0" />;
    }
  }
  if (item.kind === 'reference') {
    return isDirectFileUrl(item.data.url) ? (
      <FileText className="size-4.5 text-emerald-500 shrink-0" />
    ) : (
      <Globe className="size-4.5 text-emerald-500 shrink-0" />
    );
  }
  if (item.kind === 'assignment') {
    return <ClipboardList className="size-4.5 text-amber-500 shrink-0" />;
  }
  return <HelpCircle className="size-4.5 text-indigo-500 shrink-0" />;
}

function ResourceBadges({ item }: { item: UnifiedResource }) {
  if (item.kind === 'material') {
    const badge = getMaterialBadgeConfig(item.data.materialType);
    return (
      <span
        className={`px-2 py-0.5 text-xs font-medium rounded border ${badge.bg} ${badge.text} ${badge.border}`}
      >
        {badge.label}
      </span>
    );
  }
  if (item.kind === 'reference') {
    const isFile = isDirectFileUrl(item.data.url);
    return (
      <span className="px-2 py-0.5 text-xs font-medium rounded border bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20">
        {isFile ? 'Tệp tham khảo' : 'Tham khảo'}
      </span>
    );
  }
  if (item.kind === 'assignment') {
    return (
      <span className="px-2 py-0.5 text-xs font-medium rounded border bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20">
        Bài tập
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 text-xs font-medium rounded border bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20">
      Trắc nghiệm
    </span>
  );
}

function ActionBtn({
  icon: Icon,
  tooltip,
  onClick,
  href,
  download,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  download?: boolean;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {href ? (
          <Button
            asChild
            variant="ghost"
            size="icon"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'size-7 text-muted-foreground hover:text-foreground cursor-pointer',
              className,
            )}
          >
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              {...(download ? { download: true } : {})}
            >
              <Icon className="size-3.5" />
              <span className="sr-only">{tooltip}</span>
            </a>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(e);
            }}
            className={cn(
              'size-7 text-muted-foreground hover:text-foreground cursor-pointer',
              className,
            )}
          >
            <Icon className="size-3.5" />
            <span className="sr-only">{tooltip}</span>
          </Button>
        )}
      </TooltipTrigger>
      <TooltipContent side="top">{tooltip}</TooltipContent>
    </Tooltip>
  );
}

/**
 * Compact resource item row with Click-to-Preview interaction and Bậc 4 (text-base) typography.
 */
export function ResourceCard({
  item,
  classId,
  isTeacher = false,
  onPreview,
  onEdit,
  onDelete,
}: ResourceCardProps) {
  const router = useRouter();
  const title = item.data.title;
  const isRefFile = item.kind === 'reference' && isDirectFileUrl(item.data.url);

  const handleCardClick = () => {
    if (item.kind === 'material' || item.kind === 'reference') {
      onPreview?.(item);
    } else if (item.kind === 'assignment') {
      router.push(`/classes/${classId}/assignments/${item.data.id}`);
    } else if (item.kind === 'quiz') {
      router.push(`/classes/${classId}/quizzes/${item.data.id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-card/70 hover:bg-muted/40 hover:border-emerald-500/40 hover:shadow-xs transition-all cursor-pointer group"
    >
      {/* Left: Icon, Title (Bậc 4 - text-base) & Meta */}
      <div className="flex items-center gap-3 min-w-0 pr-2">
        <div className="size-9 rounded-lg bg-muted/60 flex items-center justify-center shrink-0 group-hover:bg-muted transition-colors">
          <ResourceIcon item={item} />
        </div>
        <div className="min-w-0">
          <p
            className="text-base font-semibold text-foreground truncate tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
            title={title}
          >
            {title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <ResourceBadges item={item} />
            {item.kind === 'assignment' && item.data.dueAt && (
              <span className="text-xs text-muted-foreground truncate">
                Hạn: {formatDateVi(item.data.dueAt)}
              </span>
            )}
            {item.kind === 'quiz' && item.data.timeLimit > 0 && (
              <span className="text-xs text-muted-foreground truncate">
                {item.data.timeLimit} phút
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Quick Action Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Preview Shortcut */}
        {(item.kind === 'material' || item.kind === 'reference') && onPreview && (
          <ActionBtn
            icon={Eye}
            tooltip="Xem trước"
            onClick={() => onPreview(item)}
            className="hover:text-emerald-600 dark:hover:text-emerald-400"
          />
        )}

        {/* Material Direct Action */}
        {item.kind === 'material' && (
          <>
            {item.data.materialType === 'link' ? (
              <ActionBtn
                icon={ExternalLink}
                tooltip="Mở liên kết"
                href={item.data.externalUrl || '#'}
              />
            ) : (
              <ActionBtn
                icon={Download}
                tooltip="Tải tệp tin"
                href={item.data.fileUrl || '#'}
                download={true}
              />
            )}
          </>
        )}

        {/* Reference Direct Action */}
        {item.kind === 'reference' && (
          <ActionBtn
            icon={isRefFile ? Download : ExternalLink}
            tooltip={isRefFile ? 'Tải tệp tham khảo' : 'Mở tài liệu tham khảo'}
            href={item.data.url}
            download={isRefFile}
          />
        )}

        {/* Teacher Edit & Delete Actions */}
        {isTeacher && (
          <>
            {onEdit && <ActionBtn icon={Pencil} tooltip="Chỉnh sửa" onClick={() => onEdit(item)} />}
            {onDelete && (
              <ActionBtn
                icon={Trash2}
                tooltip="Xóa tài nguyên"
                onClick={() => onDelete(item)}
                className="hover:text-destructive hover:bg-destructive/10"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
