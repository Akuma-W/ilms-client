'use client';

import { useState } from 'react';
import {
  Calendar,
  Download,
  ExternalLink,
  FileArchive,
  FileCode,
  FileText,
  Layers,
  Link as LinkIcon,
  ArrowLeft,
  Eye,
  ClipboardList,
} from 'lucide-react';
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
  isDirectFileUrl,
  resolveStorageUrl,
} from '@/features/upload/utils/file.utils';
import { formatDateVi, getYouTubeEmbedUrl } from '@/features/topics/utils/resource.utils';
import type { PreviewItem } from '@/types/preview';

interface FilePreviewModalProps {
  item: PreviewItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Universal preview modal for learning materials, references, and assignment files.
 * Supports inline PDF reading, video playback, image viewer, and rich file metadata.
 */
export function FilePreviewModal({ item, isOpen, onOpenChange }: FilePreviewModalProps) {
  const [activeSubItem, setActiveSubItem] = useState<PreviewItem | null>(null);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setActiveSubItem(null);
    }
    onOpenChange(open);
  };

  if (!item) return null;

  const current = activeSubItem || item;
  const rawUrl = current.externalUrl || current.fileUrl || '';
  const resolvedUrl = rawUrl ? resolveStorageUrl(rawUrl) : '';
  const lowerUrl = rawUrl.toLowerCase();
  const displayName = current.fileName || getCleanDisplayName(rawUrl, current.title);
  const formattedSize = formatFileSize(current.fileSize);
  const createdAt = formatDateVi(current.createdAt);
  const ytEmbed = getYouTubeEmbedUrl(current.externalUrl || current.fileUrl);

  const isVideo =
    Boolean(ytEmbed) ||
    current.fileType === 'video' ||
    ['.mp4', '.webm', '.mov', '.mkv'].some((ext) => lowerUrl.includes(ext));

  const isPdf =
    current.fileType === 'pdf' ||
    lowerUrl.includes('.pdf') ||
    (current.fileType === 'slide' && lowerUrl.includes('.pdf'));

  const isImage =
    current.fileType === 'image' ||
    ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].some((ext) => lowerUrl.includes(ext));

  const isLinkOnly =
    !isDirectFileUrl(rawUrl) &&
    !isPdf &&
    !isVideo &&
    !isImage &&
    Boolean(current.externalUrl) &&
    current.fileType === 'link';

  const hasAssignmentMaterials =
    !activeSubItem && Boolean(item.materials && item.materials.length > 0);

  const getFileIcon = () => {
    if (lowerUrl.includes('.zip') || lowerUrl.includes('.rar')) {
      return <FileArchive className="size-6 text-amber-500" />;
    }
    if (['.cpp', '.py', '.js', '.ts', '.html', '.css', '.java'].some((e) => lowerUrl.includes(e))) {
      return <FileCode className="size-6 text-blue-500" />;
    }
    return <FileText className="size-6 text-cyan-600 dark:text-cyan-400" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-card text-card-foreground shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <DialogHeader className="space-y-1.5 pb-3 border-b border-border/50 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            {activeSubItem && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveSubItem(null)}
                className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-3" />
                Quay lại
              </Button>
            )}
            {current.badgeLabel && (
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded border ${
                  current.badgeBg || 'bg-cyan-500/10'
                } ${current.badgeText || 'text-cyan-700 dark:text-cyan-300'} ${
                  current.badgeBorder || 'border-cyan-500/20'
                }`}
              >
                {current.badgeLabel}
              </span>
            )}
            {current.topicTitle && (
              <span className="text-xs text-muted-foreground flex items-center gap-1 truncate max-w-xs">
                <Layers className="size-3 shrink-0" />
                {current.topicTitle}
              </span>
            )}
            {formattedSize && (
              <span className="text-xs text-muted-foreground">• Dung lượng: {formattedSize}</span>
            )}
          </div>
          <DialogTitle className="text-lg md:text-xl font-bold text-foreground truncate">
            {current.title}
          </DialogTitle>
          {createdAt && (
            <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="size-3" />
              Đăng ngày: {createdAt}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Viewer Body */}
        <div className="flex-1 overflow-y-auto py-3 min-h-[45vh] max-h-[68vh] flex flex-col justify-center">
          {isPdf ? (
            <iframe
              src={resolvedUrl}
              title={current.title}
              className="w-full h-[65vh] rounded-xl border border-border bg-background"
            />
          ) : isVideo ? (
            <div className="w-full aspect-video rounded-xl overflow-hidden border border-border bg-black flex items-center justify-center">
              {ytEmbed ? (
                <iframe
                  src={ytEmbed}
                  title={current.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={resolvedUrl} controls className="w-full h-full object-contain">
                  Trình duyệt không hỗ trợ xem video trực tiếp.
                </video>
              )}
            </div>
          ) : isImage ? (
            <div className="w-full max-h-[65vh] flex items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/20 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolvedUrl}
                alt={current.title}
                className="max-h-[60vh] max-w-full object-contain rounded-lg"
              />
            </div>
          ) : isLinkOnly ? (
            <div className="p-8 rounded-xl border border-purple-500/20 bg-purple-500/5 text-center max-w-md mx-auto my-auto space-y-3">
              <div className="size-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
                <LinkIcon className="size-6" />
              </div>
              <h4 className="text-base font-semibold text-foreground">Liên kết tài nguyên bên ngoài</h4>
              {current.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">{current.description}</p>
              )}
              <p className="text-xs text-muted-foreground truncate font-mono">{current.externalUrl}</p>
            </div>
          ) : hasAssignmentMaterials ? (
            <div className="space-y-4 my-auto">
              {current.description && (
                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    <ClipboardList className="size-4" />
                    <span>Yêu cầu & Hướng dẫn làm bài</span>
                  </div>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {current.description}
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground">
                  Tài liệu & đề bài đính kèm ({item.materials?.length}):
                </h4>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {item.materials?.map((mat, idx) => (
                    <div
                      key={mat.id || idx}
                      className="flex items-center justify-between p-3 rounded-xl border border-border bg-card text-xs hover:border-amber-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 truncate flex-1 min-w-0 mr-3">
                        <FileText className="size-4 text-emerald-500 shrink-0" />
                        <span className="truncate font-medium text-foreground">{mat.title}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActiveSubItem(mat)}
                          className="h-8 px-2.5 text-xs gap-1.5"
                        >
                          <Eye className="size-3.5" />
                          Xem trước
                        </Button>
                        <Button size="sm" variant="default" asChild className="h-8 px-2.5 text-xs gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white">
                          <a
                            href={resolveStorageUrl(mat.fileUrl)}
                            download={mat.title}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="size-3.5" />
                            Tải về
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-border/80 bg-muted/30 text-center max-w-md mx-auto my-auto space-y-3">
              <div className="size-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto">
                {getFileIcon()}
              </div>
              <h4 className="text-base font-semibold text-foreground">{displayName}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Định dạng tệp này được khuyến nghị mở trong tab mới hoặc tải về máy để xem với ứng
                dụng chuyên dụng.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="flex flex-row items-center justify-between sm:justify-between pt-3 border-t border-border/50 shrink-0">
          <Button variant="outline" size="sm" onClick={() => handleOpenChange(false)} className="text-xs rounded-xl">
            Đóng
          </Button>

          <div className="flex items-center gap-2">
            {ytEmbed && current.externalUrl && (
              <Button size="sm" asChild className="bg-red-600 hover:bg-red-700 text-white text-xs rounded-xl gap-1.5">
                <a href={current.externalUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-3.5" />
                  Mở trên YouTube
                </a>
              </Button>
            )}

            {resolvedUrl && !isLinkOnly && !ytEmbed && (
              <>
                <Button size="sm" variant="outline" asChild className="text-xs rounded-xl gap-1.5">
                  <a href={resolvedUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-3.5" />
                    Mở tab mới
                  </a>
                </Button>
                <Button size="sm" asChild className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs rounded-xl gap-1.5">
                  <a href={resolvedUrl} download={displayName} target="_blank" rel="noopener noreferrer">
                    <Download className="size-3.5" />
                    Tải tệp tin
                  </a>
                </Button>
              </>
            )}

            {isLinkOnly && current.externalUrl && (
              <Button size="sm" asChild className="bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-xl gap-1.5">
                <a href={current.externalUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-3.5" />
                  Mở liên kết
                </a>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
