'use client';

import {
  FileText,
  Link as LinkIcon,
  Play,
  Download,
  ExternalLink,
  Layers,
  Calendar,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  getYouTubeEmbedUrl,
  getMaterialBadgeConfig,
  formatDateVi,
} from '../../utils/resource.utils';
import type { UnifiedResource } from '@/types/topic';

interface ResourcePreviewModalProps {
  resource: UnifiedResource | null;
  topicTitle?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Preview modal for video streaming, external links, and uploaded files.
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
                    className={`px-2 py-0.5 text-[11px] font-medium rounded border ${badge.bg} ${badge.text} ${badge.border}`}
                  >
                    {badge.label}
                  </span>
                );
              })()}
            {isReference && (
              <span className="px-2 py-0.5 text-[11px] font-medium rounded border bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20">
                Tài liệu tham khảo
              </span>
            )}
            {topicTitle && (
              <span className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                <Layers className="size-3 shrink-0" />
                {topicTitle}
              </span>
            )}
          </div>
          <DialogTitle className="text-base md:text-lg font-bold text-foreground">
            {title}
          </DialogTitle>
          {createdAt && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="size-3" />
              Đã cập nhật vào ngày {createdAt}
            </p>
          )}
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
                  return (
                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-border bg-black">
                      <video
                        src={resource.data.fileUrl}
                        controls
                        className="w-full h-full object-contain"
                      >
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
              <h4 className="text-sm font-semibold text-foreground">
                Liên kết tài nguyên bên ngoài
              </h4>
              <p className="text-xs text-muted-foreground mt-1 truncate max-w-md mx-auto">
                {resource.data.externalUrl}
              </p>
            </div>
          ) : isReference ? (
            <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
              <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <ExternalLink className="size-6" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">Tài liệu tham khảo mở rộng</h4>
              {resource.data.description && (
                <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                  {resource.data.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2 truncate max-w-md mx-auto font-mono">
                {resource.data.url}
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-center">
              <div className="size-12 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-3">
                <FileText className="size-6" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">Tệp tin học tập</h4>
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
            className="text-xs rounded-lg"
          >
            Đóng
          </Button>

          <div className="flex items-center gap-2">
            {isMaterial && resource.data.materialType === 'link' && (
              <Button
                size="sm"
                asChild
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg"
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
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs rounded-lg"
              >
                <a href={resource.data.fileUrl} target="_blank" rel="noopener noreferrer" download>
                  <Download className="size-3.5 mr-1.5" />
                  Tải tệp tin
                </a>
              </Button>
            )}

            {isReference && (
              <Button
                size="sm"
                asChild
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg"
              >
                <a href={resource.data.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-3.5 mr-1.5" />
                  Mở trang tham khảo
                </a>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
