'use client';

import { FileText, FileCode, Film, FileArchive, Download, ExternalLink, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  formatFileSize,
  getCleanDisplayName,
  resolveStorageUrl,
} from '@/features/upload/utils/file.utils';
import { FileType } from '@/types/enum';

export interface PreviewableFile {
  fileUrl: string;
  fileType?: FileType | null;
  fileName?: string;
  fileSize?: number;
}

interface AssignmentFilePreviewModalProps {
  file: PreviewableFile | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignmentFilePreviewModal({
  file,
  isOpen,
  onOpenChange,
}: AssignmentFilePreviewModalProps) {
  if (!file) return null;

  const resolvedUrl = resolveStorageUrl(file.fileUrl);
  const displayName = getCleanDisplayName(file.fileUrl, file.fileName);
  const formattedSize = formatFileSize(file.fileSize);
  const lowerUrl = (file.fileUrl || '').toLowerCase();
  const isPdf = lowerUrl.includes('.pdf') || file.fileType === 'pdf';
  const isVideo =
    lowerUrl.includes('.mp4') || lowerUrl.includes('.webm') || file.fileType === 'video';
  const isImage =
    lowerUrl.includes('.jpg') ||
    lowerUrl.includes('.jpeg') ||
    lowerUrl.includes('.png') ||
    lowerUrl.includes('.webp');

  const getFileIcon = () => {
    if (lowerUrl.includes('.zip') || lowerUrl.includes('.rar')) {
      return <FileArchive className="size-5 text-amber-500" />;
    }
    if (
      lowerUrl.includes('.cpp') ||
      lowerUrl.includes('.py') ||
      lowerUrl.includes('.js') ||
      lowerUrl.includes('.ts')
    ) {
      return <FileCode className="size-5 text-blue-500" />;
    }
    if (isVideo) return <Film className="size-5 text-purple-500" />;
    return <FileText className="size-5 text-emerald-500" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[92vh] flex flex-col p-6 rounded-2xl border border-border bg-card shadow-2xl">
        <DialogHeader className="space-y-1 pb-3 border-b border-border/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
              {getFileIcon()}
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-bold text-foreground truncate">
                {displayName}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                {formattedSize && <span>Dung lượng: {formattedSize}</span>}
                <span>•</span>
                <span className="truncate">Đọc và xem tài liệu bài tập</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Viewer Body */}
        <div className="flex-1 overflow-y-auto py-3 min-h-[45vh] max-h-[68vh] flex items-center justify-center">
          {isPdf ? (
            <iframe
              src={resolvedUrl}
              title={displayName}
              className="w-full h-[65vh] rounded-xl border border-border bg-background"
            />
          ) : isVideo ? (
            <div className="w-full aspect-video rounded-xl overflow-hidden border border-border bg-black flex items-center justify-center">
              <video src={resolvedUrl} controls className="w-full h-full object-contain">
                Trình duyệt không hỗ trợ xem video trực tiếp.
              </video>
            </div>
          ) : isImage ? (
            <div className="w-full max-h-[65vh] flex items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/20 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolvedUrl}
                alt={displayName}
                className="max-h-[60vh] max-w-full object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="w-full max-w-md p-8 text-center rounded-2xl border border-border/80 bg-muted/30 space-y-3">
              <div className="size-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <Eye className="size-7" />
              </div>
              <h4 className="text-base font-semibold text-foreground">Đọc tài liệu đính kèm</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Định dạng tệp này được khuyến nghị mở hoặc tải về máy để xem với ứng dụng chuyên
                dụng.
              </p>
              <div className="pt-2">
                <Button
                  size="sm"
                  asChild
                  className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs gap-1.5"
                >
                  <a
                    href={resolvedUrl}
                    download={displayName}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="size-3.5" />
                    Tải tệp tin về máy
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <DialogFooter className="flex flex-row items-center justify-between pt-3 border-t border-border/70 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs rounded-xl"
          >
            Đóng
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="text-xs rounded-xl gap-1.5"
            >
              <a href={resolvedUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-3.5" />
                Mở trong tab mới
              </a>
            </Button>
            <Button
              type="button"
              size="sm"
              asChild
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs rounded-xl gap-1.5"
            >
              <a
                href={resolvedUrl}
                download={displayName}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="size-3.5" />
                Tải về máy
              </a>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
