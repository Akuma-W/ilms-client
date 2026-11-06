'use client';

import {
  FileText,
  Presentation,
  Play,
  Globe,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FileType } from '@/types/enum';
import { cn } from '@/lib/utils';

interface ResourceQueueRowProps {
  id: string;
  title: string;
  materialType?: FileType;
  subtitle?: string;
  progress?: number;
  status?: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
  onTitleChange: (newTitle: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

function ItemIcon({ materialType }: { materialType?: FileType }) {
  switch (materialType) {
    case 'video':
      return <Play className="size-4 text-blue-500 shrink-0" />;
    case 'pdf':
      return <FileText className="size-4 text-red-500 shrink-0" />;
    case 'slide':
      return <Presentation className="size-4 text-orange-500 shrink-0" />;
    case 'document':
      return <FileText className="size-4 text-emerald-500 shrink-0" />;
    default:
      return <Globe className="size-4 text-purple-500 shrink-0" />;
  }
}

/**
 * Single item row in the staging queue.
 */
export function ResourceQueueRow({
  title,
  materialType,
  subtitle,
  progress = 0,
  status = 'idle',
  error,
  onTitleChange,
  onRemove,
  disabled = false,
}: ResourceQueueRowProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 p-2.5 rounded-xl border transition-colors',
        status === 'error'
          ? 'border-destructive/40 bg-destructive/5'
          : status === 'success'
            ? 'border-emerald-500/40 bg-emerald-500/5'
            : 'border-border/80 bg-background/80 hover:border-border',
      )}
    >
      <div className="flex items-center justify-center size-8 rounded-lg bg-muted shrink-0">
        <ItemIcon materialType={materialType} />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            disabled={disabled || status === 'uploading'}
            placeholder="Nhập tiêu đề..."
            className="h-7 text-xs font-medium bg-transparent border-transparent hover:border-border focus:border-ring rounded px-1.5 -ml-1.5"
          />
        </div>

        {subtitle && (
          <p className="text-[11px] text-muted-foreground truncate pl-0.5">{subtitle}</p>
        )}

        {status === 'uploading' && (
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {status === 'error' && error && (
          <p className="text-[11px] text-destructive truncate">{error}</p>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {status === 'uploading' && <Loader2 className="size-4 text-emerald-500 animate-spin" />}
        {status === 'success' && <CheckCircle2 className="size-4 text-emerald-500" />}
        {status === 'error' && <AlertCircle className="size-4 text-destructive" />}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onRemove}
              disabled={disabled || status === 'uploading'}
              className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span className="sr-only">Xóa khỏi danh sách</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Xóa khỏi danh sách</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
