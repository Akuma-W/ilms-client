'use client';

import { useState } from 'react';
import {
  FileText,
  FileCode,
  Film,
  FileArchive,
  Trash2,
  ExternalLink,
  Eye,
  Download,
} from 'lucide-react';
import {
  formatFileSize,
  getCleanDisplayName,
  resolveStorageUrl,
} from '@/features/upload/utils/file.utils';
import { Button } from '@/components/ui/button';
import { AssignmentFilePreviewModal } from './assignment-file-preview-modal';
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
  const [previewFile, setPreviewFile] = useState<QueuedFile | null>(null);

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
    <>
      <div className="space-y-2 mt-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
          <span>Danh sách tệp đính kèm ({files.length}):</span>
          <span className="text-[11px] italic">Bấm vào tệp để đọc hoặc xem trước</span>
        </div>
        <div className="space-y-2">
          {files.map((file, idx) => {
            const displayName = getCleanDisplayName(file.fileUrl, file.fileName);
            const formattedSize = formatFileSize(file.fileSize);
            const resolvedUrl = resolveStorageUrl(file.fileUrl);

            return (
              <div
                key={`${file.fileUrl}-${idx}`}
                className="group flex items-center justify-between gap-3 p-2.5 rounded-xl border border-border bg-card/60 text-sm hover:bg-card hover:border-amber-500/40 transition-colors"
              >
                {/* Clickable file item area */}
                <div
                  onClick={() => setPreviewFile(file)}
                  className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                  title="Bấm để đọc hoặc xem trước tệp"
                >
                  <div className="size-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0 group-hover:bg-amber-500/10 transition-colors">
                    {getFileIcon(file)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground text-xs line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {displayName}
                    </p>
                    {formattedSize && (
                      <p className="text-[11px] text-muted-foreground">{formattedSize}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setPreviewFile(file)}
                    className="size-7 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                    title="Đọc / Xem trước tệp"
                  >
                    <Eye className="size-3.5" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    asChild
                    className="size-7 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                    title="Tải tệp tin về máy"
                  >
                    <a
                      href={resolvedUrl}
                      download={displayName}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="size-3.5" />
                    </a>
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    asChild
                    className="size-7 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                    title="Mở liên kết trong tab mới"
                  >
                    <a href={resolvedUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="size-3.5" />
                    </a>
                  </Button>

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

      {/* File Preview and Reading Modal */}
      <AssignmentFilePreviewModal
        file={previewFile}
        isOpen={!!previewFile}
        onOpenChange={(open) => !open && setPreviewFile(null)}
      />
    </>
  );
}
