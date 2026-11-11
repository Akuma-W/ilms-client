'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Bookmark, Edit, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  ResourceDropzone, ResourceLinkInput, ResourceBatchToolbar, ResourceQueueRow, ResourceTopicSelect,
} from '@/components/resources';
import { formatFileSize, inferMaterialTypeFromFileName, getBaseFileName, isDirectFileUrl } from '@/features/upload/utils/file.utils';
import { uploadService } from '@/features/upload/services/upload.service';
import { referencesService } from '../services/references.service';
import type { Topic } from '@/types/topic';
import type { Reference, StagedReferenceItem } from '@/types/reference';

interface ReferenceModalProps {
  topicId?: string;
  topics?: Topic[];
  isOpen: boolean;
  mode?: 'create' | 'edit';
  initialData?: Reference | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

/**
 * Unified modal for creating and editing references with file/link replacement.
 */
export function ReferenceModal({
  topicId,
  topics = [],
  isOpen,
  mode = 'create',
  initialData,
  onOpenChange,
  onSuccess,
}: ReferenceModalProps) {
  const isEdit = mode === 'edit';
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topicId || (topics[0]?.id ?? ''));
  const [stagedItems, setStagedItems] = useState<StagedReferenceItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (topicId) setSelectedTopicId(topicId);
    else if (topics.length > 0 && !selectedTopicId) setSelectedTopicId(topics[0].id);
  }, [topicId, topics, selectedTopicId]);

  useEffect(() => {
    if (!isOpen) return;
    if (isEdit && initialData) {
      setStagedItems([
        {
          id: initialData.id,
          title: initialData.title,
          url: initialData.url,
          description: initialData.description,
          subtitle: initialData.description || initialData.url,
          isFile: isDirectFileUrl(initialData.url),
          progress: 100,
          status: 'idle',
        },
      ]);
      if (initialData.topicId) setSelectedTopicId(initialData.topicId);
    } else {
      setStagedItems([]);
    }
  }, [isOpen, isEdit, initialData]);

  const handleFilesAdded = (files: File[]) => {
    if (files.length === 0) return;
    if (isEdit) {
      const file = files[0];
      setStagedItems([{
        id: initialData?.id || `${Date.now()}`,
        file,
        title: stagedItems[0]?.title || getBaseFileName(file.name),
        url: '',
        isFile: true,
        fileSizeFormatted: formatFileSize(file.size),
        subtitle: `Tệp mới: ${file.name} (${formatFileSize(file.size)})`,
        progress: 0,
        status: 'idle',
      }]);
      return;
    }
    const newItems: StagedReferenceItem[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      file,
      title: getBaseFileName(file.name),
      url: '',
      isFile: true,
      fileSizeFormatted: formatFileSize(file.size),
      subtitle: `Tệp tải lên (${formatFileSize(file.size)})`,
      progress: 0,
      status: 'idle',
    }));
    setStagedItems((prev) => [...prev, ...newItems]);
  };

  const handleLinkAdded = (url: string, customTitle?: string, description?: string) => {
    const domain = new URL(url).hostname;
    const title = customTitle || `Tài liệu tham khảo (${domain})`;
    const newItem: StagedReferenceItem = {
      id: initialData?.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: stagedItems[0]?.title || title,
      url,
      description: description ?? stagedItems[0]?.description,
      isFile: false,
      subtitle: description || url,
      progress: 100,
      status: 'idle',
    };
    if (isEdit) {
      setStagedItems([newItem]);
      return;
    }
    setStagedItems((prev) => [...prev, newItem]);
  };

  const handleApplyBatchTitle = (commonTitle: string, numbered: boolean) => {
    setStagedItems((prev) => prev.map((item, idx) => ({ ...item, title: numbered ? `${commonTitle} (Phần ${idx + 1})` : commonTitle })));
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onOpenChange(false);
    setStagedItems([]);
  };

  const uploadItemFile = async (item: StagedReferenceItem): Promise<string> => {
    if (!item.file) return item.url;
    const formData = new FormData();
    formData.append('file', item.file);
    const res = await uploadService.uploadFile(formData, 'references');
    if (!res.success || !res.data?.url) {
      throw new Error(res.message || 'Lỗi tải lên MinIO');
    }
    return res.data.key || res.data.url;
  };

  const handleSubmit = async () => {
    const targetTopicId = topicId || selectedTopicId;
    if (!targetTopicId) {
      toast.error('Vui lòng chọn chủ đề bài học trước khi lưu');
      return;
    }
    if (stagedItems.length === 0) {
      toast.error(isEdit ? 'Vui lòng chọn hoặc tải lên tệp/link tham khảo' : 'Vui lòng thêm ít nhất một tệp hoặc liên kết tham khảo');
      return;
    }

    setIsSubmitting(true);

    if (isEdit && initialData) {
      try {
        const item = stagedItems[0];
        setStagedItems([{ ...item, status: 'uploading', progress: 30 }]);
        const finalUrl = await uploadItemFile(item);
        setStagedItems([{ ...item, progress: 80 }]);

        await referencesService.updateReference(initialData.id, {
          title: item.title,
          url: finalUrl,
          description: item.description,
        });

        toast.success('Cập nhật tài liệu tham khảo thành công!');
        onSuccess();
        handleClose();
      } catch (err) {
        setStagedItems((prev) =>
          prev.map((i) => ({ ...i, status: 'error', error: err instanceof Error ? err.message : 'Lỗi khi cập nhật' })),
        );
        toast.error('Cập nhật tài liệu tham khảo thất bại');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    let successCount = 0;
    for (const item of stagedItems) {
      try {
        setStagedItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: 'uploading', progress: 30 } : i)));
        const finalUrl = await uploadItemFile(item);
        setStagedItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, progress: 80 } : i)));

        await referencesService.createReference(targetTopicId, {
          title: item.title,
          url: finalUrl,
          description: item.description,
        });

        setStagedItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: 'success', progress: 100 } : i)));
        successCount++;
      } catch (err) {
        setStagedItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'error', error: err instanceof Error ? err.message : 'Lỗi khi lưu' } : i)),
        );
      }
    }

    setIsSubmitting(false);
    if (successCount > 0) {
      toast.success(`Đã lưu thành công ${successCount}/${stagedItems.length} tài liệu vào chủ đề!`);
      onSuccess();
      handleClose();
    } else {
      toast.error('Lưu tài liệu tham khảo thất bại, vui lòng kiểm tra lại');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-xl max-h-[85vh] flex flex-col rounded-xl border border-border bg-card text-card-foreground shadow-xl p-5 overflow-hidden"
        onInteractOutside={(e) => isSubmitting && e.preventDefault()}
        onEscapeKeyDown={(e) => isSubmitting && e.preventDefault()}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 pb-3 border-b border-border/50 shrink-0">
          <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
            {isEdit ? <Edit className="size-4.5" /> : <Bookmark className="size-4.5" />}
          </div>
          <div>
            <DialogTitle className="text-base font-semibold text-foreground">
              {isEdit ? 'Chỉnh sửa tài liệu tham khảo' : 'Thêm tài liệu tham khảo'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              {isEdit
                ? 'Chỉnh sửa tiêu đề, mô tả hoặc thay đổi tệp tin/liên kết tham khảo.'
                : 'Hỗ trợ tải lên nhiều tệp (PDF, Word, Slide) hoặc dán liên kết web.'}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
          {topics.length > 0 && (
            <ResourceTopicSelect
              topics={topics}
              selectedTopicId={selectedTopicId}
              onTopicChange={setSelectedTopicId}
              disabled={isSubmitting}
              isReadOnly={Boolean(topicId || isEdit)}
            />
          )}

          {/* Dual Input Zone */}
          {(!isEdit || stagedItems.length === 0) && (
            <div className="space-y-2">
              <ResourceDropzone
                onFilesSelected={handleFilesAdded}
                disabled={isSubmitting}
                multiple={!isEdit}
                hintText={isEdit ? 'Kéo thả hoặc bấm để chọn tệp tài liệu tham khảo mới (PDF, Word, Slide...)' : 'Tải lên tài liệu tham khảo PDF, EPUB, Word, Slide... (tối đa 50MB)'}
              />
              <ResourceLinkInput
                onAddLink={handleLinkAdded}
                disabled={isSubmitting}
                showDescription={true}
                placeholder={isEdit ? 'Dán liên kết tài liệu đọc thêm mới...' : 'https://wikipedia.org/... hoặc liên kết tài liệu đọc thêm'}
              />
            </div>
          )}

          {/* Staging Queue */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <FileText className="size-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">
                  {isEdit ? 'Tài liệu tham khảo' : `Danh sách tài liệu tham khảo (${stagedItems.length})`}
                </span>
              </div>
              {isEdit && stagedItems.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={() => setStagedItems([])}
                  className="text-xs h-6 px-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
                >
                  Thay đổi tệp/link khác
                </Button>
              )}
            </div>

            {!isEdit && (
              <ResourceBatchToolbar
                itemCount={stagedItems.length}
                onApplyBatchTitle={handleApplyBatchTitle}
                disabled={isSubmitting}
              />
            )}

            {stagedItems.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-border/70 bg-muted/10 text-center text-xs text-muted-foreground">
                {isEdit
                  ? 'Chưa có tài liệu. Hãy kéo thả tệp mới hoặc dán liên kết phía trên để thay thế.'
                  : 'Chưa có tài liệu tham khảo nào. Hãy tải tệp hoặc dán liên kết phía trên.'}
              </div>
            ) : (
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-0.5">
                {stagedItems.map((item) => (
                  <ResourceQueueRow
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    materialType={item.isFile ? inferMaterialTypeFromFileName(item.title) : undefined}
                    subtitle={item.subtitle}
                    progress={item.progress}
                    status={item.status}
                    error={item.error}
                    disabled={isSubmitting}
                    onTitleChange={(newTitle) =>
                      setStagedItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, title: newTitle } : i)))
                    }
                    onRemove={() => setStagedItems((prev) => prev.filter((i) => i.id !== item.id))}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dialog Footer */}
        <DialogFooter className="gap-2 pt-3 border-t border-border/50 shrink-0">
          <Button variant="outline" size="sm" className="rounded-lg text-xs h-8.5" onClick={handleClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs h-8.5 px-4 font-medium"
            onClick={handleSubmit}
            disabled={isSubmitting || stagedItems.length === 0}
          >
            {isSubmitting ? 'Đang tải lên...' : isEdit ? 'Lưu thay đổi' : `Lưu ${stagedItems.length} tài liệu`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
