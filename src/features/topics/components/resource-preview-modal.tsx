'use client';

import {
  FileText,
  Link as LinkIcon,
  Play,
  Download,
  ExternalLink,
  Layers,
  Calendar,
  ClipboardList,
} from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getYouTubeEmbedUrl, getMaterialBadgeConfig, formatDateVi } from '../utils/resource.utils';
import {
  isDirectFileUrl,
  resolveStorageUrl,
  getCleanDisplayName,
} from '@/features/upload/utils/file.utils';
import type { UnifiedResource } from '@/types/topic';

interface ResourcePreviewModalProps {
  resource: UnifiedResource | null;
  topicTitle?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Preview modal for video streaming, external links, assignments, and uploaded files.
 */
export function ResourcePreviewModal({
  resource,
  topicTitle,
  isOpen,
  onOpenChange,
}: ResourcePreviewModalProps) {
  if (!resource) return null;

  const isMaterial = resource.kind === 'material';
  const isReference = resource.kind === 'reference';
  const isAssignment = resource.kind === 'assignment';

  const title = resource.data.title;
  const createdAt = formatDateVi(resource.data.createdAt);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-xl border border-border bg-card text-card-foreground shadow-xl p-6">
        <DialogHeader className="space-y-1 pb-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            {isMaterial &&
              (() => {
                const badge = getMaterialBadgeConfig(resource.data.materialType);
                return (
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded border ${badge.bg} ${badge.text} ${badge.border}`}
                  >
                    {badge.label}
                  </span>
                );
              })()}
            {isReference && (
              <span className="px-2 py-0.5 text-xs font-medium rounded border bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20">
                Tài liệu tham khảo
              </span>
            )}
            {isAssignment && (
              <span className="px-2 py-0.5 text-xs font-medium rounded border bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20">
                Bài tập
              </span>
            )}
            {topicTitle && (
              <span className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                <Layers className="size-3 shrink-0" />
                {topicTitle}
              </span>
            )}
          </div>
          <DialogTitle className="text-lg md:text-xl font-bold text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1">
            {createdAt ? (
              <>
                <Calendar className="size-3" />
                Đã cập nhật vào ngày {createdAt}
              </>
            ) : (
              'Xem trước chi tiết nội dung tài nguyên'
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Modal Body */}
        <div className="py-4">
          {isMaterial && resource.data.materialType === 'video' ? (
            <div className="space-y-3">
              {(() => {
                const ytEmbed = getYouTubeEmbedUrl(
                  resource.data.externalUrl || resource.data.fileUrl,
                );
                if (ytEmbed) {
                  return (
                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-border bg-black">
                      <iframe
                        src={ytEmbed}
                        title={title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  );
                }
                if (resource.data.fileUrl) {
                  const resolvedUrl = resolveStorageUrl(resource.data.fileUrl);
                  return (
                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-border bg-black">
                      <video src={resolvedUrl} controls className="w-full h-full object-contain">
                        Trình duyệt của bạn không hỗ trợ phát video này.
                      </video>
                    </div>
                  );
                }
                return (
                  <div className="p-8 text-center rounded-xl border border-border bg-muted/30">
                    <Play className="size-10 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">Video trực tuyến</p>
                  </div>
                );
              })()}
            </div>
          ) : isMaterial && resource.data.materialType === 'link' ? (
            <div className="p-6 rounded-xl border border-purple-500/20 bg-purple-500/5 text-center">
              <div className="size-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-3">
                <LinkIcon className="size-6" />
              </div>
              <h4 className="text-base font-semibold text-foreground">
                Liên kết tài nguyên bên ngoài
              </h4>
              <p className="text-sm text-muted-foreground mt-1 truncate max-w-md mx-auto">
                {resource.data.externalUrl}
              </p>
            </div>
          ) : isReference ? (
            <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
              <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <ExternalLink className="size-6" />
              </div>
              <h4 className="text-base font-semibold text-foreground">
                Tài liệu tham khảo mở rộng
              </h4>
              {resource.data.description && (
                <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto leading-relaxed">
                  {resource.data.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2 truncate max-w-md mx-auto font-mono">
                {resource.data.url}
              </p>
            </div>
          ) : isAssignment ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <ClipboardList className="size-4" />
                  <span>Yêu cầu & Hướng dẫn làm bài</span>
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {resource.data.description || 'Không có hướng dẫn văn bản cho bài tập này.'}
                </p>
              </div>

              {resource.data.materials && resource.data.materials.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground">
                    Tài liệu & đề bài đính kèm ({resource.data.materials.length}):
                  </h4>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {resource.data.materials.map((mat, idx) => {
                      const resolvedUrl = resolveStorageUrl(mat.fileUrl);
                      const name = getCleanDisplayName(mat.fileUrl, mat.fileName);
                      return (
                        <div
                          key={mat.id || idx}
                          className="flex items-center justify-between p-2 rounded-lg border border-border bg-card text-xs"
                        >
                          <div className="flex items-center gap-2 truncate flex-1 min-w-0 mr-2">
                            <FileText className="size-4 text-emerald-500 shrink-0" />
                            <span className="truncate font-medium">{name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                              className="h-7 px-2 text-[11px] rounded-md gap-1"
                            >
                              <a
                                href={resolvedUrl}
                                download={name}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="size-3" />
                                Tải về
                              </a>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-center">
              <div className="size-12 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-3">
                <FileText className="size-6" />
              </div>
              <h4 className="text-base font-semibold text-foreground">Tệp tin học tập</h4>
              <p className="text-xs text-muted-foreground mt-1 truncate max-w-md mx-auto">
                {isMaterial ? resource.data.fileUrl : 'Tệp đính kèm'}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <DialogFooter className="flex flex-row items-center justify-between sm:justify-between pt-3 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs rounded-lg cursor-pointer"
          >
            Đóng
          </Button>

          <div className="flex items-center gap-2">
            {isMaterial && resource.data.materialType === 'link' && (
              <Button
                size="sm"
                asChild
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg cursor-pointer"
              >
                <a
                  href={resource.data.externalUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="size-3.5 mr-1.5" />
                  Mở liên kết
                </a>
              </Button>
            )}

            {isMaterial && resource.data.materialType !== 'link' && resource.data.fileUrl && (
              <Button
                size="sm"
                asChild
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs rounded-lg cursor-pointer"
              >
                <a
                  href={resolveStorageUrl(resource.data.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <Download className="size-3.5 mr-1.5" />
                  Tải tệp tin
                </a>
              </Button>
            )}

            {isReference && (
              <Button
                size="sm"
                asChild
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg cursor-pointer"
              >
                <a
                  href={resolveStorageUrl(resource.data.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...(isDirectFileUrl(resource.data.url) ? { download: true } : {})}
                >
                  {isDirectFileUrl(resource.data.url) ? (
                    <>
                      <Download className="size-3.5 mr-1.5" />
                      Tải tệp tham khảo
                    </>
                  ) : (
                    <>
                      <ExternalLink className="size-3.5 mr-1.5" />
                      Mở trang tham khảo
                    </>
                  )}
                </a>
              </Button>
            )}

            {isAssignment && (
              <Button
                size="sm"
                asChild
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs rounded-lg cursor-pointer"
              >
                <Link
                  href={`/classes/${resource.data.classId}/assignments/${resource.data.id}`}
                  onClick={() => onOpenChange(false)}
                >
                  <ExternalLink className="size-3.5 mr-1.5" />
                  Xem chi tiết bài tập
                </Link>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
