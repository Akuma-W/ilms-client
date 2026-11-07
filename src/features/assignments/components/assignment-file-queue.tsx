'use client';

import { FileText, FileCode, Film, FileArchive, Trash2, ExternalLink } from 'lucide-react';
import { formatFileSize } from '@/features/upload/utils/file.utils';
import { Button } from '@/components/ui/button';
import { FileType } from '@/types/enum';

interface QueuedFile {
  fileUrl: string;
  fileType?: FileType | null;
  fileName?: string;
  fileSize?: number;
}

interface AssignmentFileQueueProps {
  files: QueuedFile[];
  onRemove?: (index: number) => void;
  readonly?: boolean;
}

export function AssignmentFileQueue({
  files,
  onRemove,
  readonly = false,
}: AssignmentFileQueueProps) {
  if (!files || files.length === 0) return null;

  const getFileIcon = (file: QueuedFile) => {
    const name = (file.fileName || file.fileUrl).toLowerCase();
    if (name.endsWith('.zip') || name.endsWith('.rar') || name.endsWith('.7z')) {
      return <FileArchive className="size-4 text-amber-500" />;
    }
    if (
      name.endsWith('.cpp') ||
      name.endsWith('.py') ||
      name.endsWith('.js') ||
      name.endsWith('.ts')
    ) {
      return <FileCode className="size-4 text-blue-500" />;
    }
    if (file.fileType === 'video' || name.endsWith('.mp4') || name.endsWith('.webm')) {
      return <Film className="size-4 text-purple-500" />;
    }
    return <FileText className="size-4 text-emerald-500" />;
  };

  return (
    <div className="space-y-2 mt-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
        <span>Danh sách tệp đính kèm ({files.length}):</span>
      </div>
      <div className="space-y-2">
        {files.map((file, idx) => {
          const displayName = file.fileName || file.fileUrl.split('/').pop() || `Tệp ${idx + 1}`;
          const formattedSize = formatFileSize(file.fileSize);

          return (
            <div
              key={`${file.fileUrl}-${idx}`}
              className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-border bg-card/60 text-sm hover:bg-card transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="size-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                  {getFileIcon(file)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-xs line-clamp-1">{displayName}</p>
                  {formattedSize && (
                    <p className="text-[11px] text-muted-foreground">{formattedSize}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-7 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Mở liên kết tệp"
                >
                  <ExternalLink className="size-3.5" />
                </a>

                {!readonly && onRemove && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(idx)}
                    className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                    title="Xóa tệp này"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
