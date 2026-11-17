'use client';

import { Paperclip } from 'lucide-react';
import { ResourceDropzone, ResourceLinkInput, ResourceQueueRow } from '@/components/resources';
import {
  formatFileSize,
  inferMaterialTypeFromFileName,
  getBaseFileName,
} from '@/features/upload/utils/file.utils';
import type { StagedMaterialItem } from '@/types/material';

interface TopicAttachmentsQueueProps {
  stagedItems: StagedMaterialItem[];
  setStagedItems: React.Dispatch<React.SetStateAction<StagedMaterialItem[]>>;
  isOpen: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function TopicAttachmentsQueue({
  stagedItems,
  setStagedItems,
  isOpen,
  onToggle,
  disabled = false,
}: TopicAttachmentsQueueProps) {
  const handleFilesAdded = (files: File[]) => {
    if (files.length === 0) return;

    const newItems: StagedMaterialItem[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      file,
      title: getBaseFileName(file.name),
      materialType: inferMaterialTypeFromFileName(file.name),
      fileSizeFormatted: formatFileSize(file.size),
      subtitle: `${file.name} (${formatFileSize(file.size)})`,
      progress: 0,
      status: 'idle',
    }));

    setStagedItems((prev) => [...prev, ...newItems]);
  };

  const handleLinkAdded = (url: string, title?: string) => {
    const isVideo =
      url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
    const newItem: StagedMaterialItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: title?.trim() || url,
      materialType: isVideo ? 'video' : 'link',
      externalUrl: url,
      subtitle: url,
      progress: 100,
      status: 'idle',
    };

    setStagedItems((prev) => [...prev, ...(newItem ? [newItem] : [])]);
  };

  const handleRemoveItem = (id: string) => {
    setStagedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    setStagedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: newTitle } : item)),
    );
  };

  return (
    <div className="pt-2 border-t border-border/60 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Paperclip className="size-3.5 text-primary" />
          <span>
            Đính kèm bài giảng & tài liệu (Tùy chọn)
            {stagedItems.length > 0 && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-[11px] bg-primary/10 text-primary font-bold">
                {stagedItems.length} mục
              </span>
            )}
          </span>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="text-xs text-primary font-medium hover:underline cursor-pointer"
        >
          {isOpen ? 'Thu gọn' : '+ Thêm nhiều file & link'}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-3 rounded-xl bg-muted/20 p-3.5 border border-border/70 text-xs">
          {/* Dropzone & Link Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ResourceDropzone
              onFilesSelected={handleFilesAdded}
              disabled={disabled}
              multiple
              className="py-5"
            />
            <div className="flex flex-col justify-center">
              <p className="text-xs font-semibold text-foreground mb-1.5">
                Hoặc thêm liên kết ngoài (Drive, YouTube, Docs...)
              </p>
              <ResourceLinkInput onAddLink={handleLinkAdded} disabled={disabled} />
            </div>
          </div>

          {/* Staged Items Queue */}
          {stagedItems.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border/50">
              <div className="flex items-center justify-between text-muted-foreground font-semibold">
                <span>Danh sách tệp & liên kết chuẩn bị tải lên:</span>
                <button
                  type="button"
                  onClick={() => setStagedItems([])}
                  className="hover:text-destructive cursor-pointer"
                >
                  Xóa tất cả
                </button>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {stagedItems.map((item) => (
                  <ResourceQueueRow
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    materialType={item.materialType}
                    subtitle={item.subtitle}
                    status={item.status}
                    progress={item.progress}
                    error={item.error}
                    onRemove={() => handleRemoveItem(item.id)}
                    onTitleChange={(newTitle) => handleTitleChange(item.id, newTitle)}
                    disabled={disabled}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
