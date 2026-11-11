'use client';

import { useMemo } from 'react';
import { FilePreviewModal } from '@/components/resources/file-preview-modal';
import { fileToPreviewItem } from '@/features/topics/utils/resource.utils';
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

/**
 * Adapter component wrapping the universal FilePreviewModal for assignment files.
 */
export function AssignmentFilePreviewModal({
  file,
  isOpen,
  onOpenChange,
}: AssignmentFilePreviewModalProps) {
  const previewItem = useMemo(() => {
    if (!file) return null;
    return fileToPreviewItem(file);
  }, [file]);

  return (
    <FilePreviewModal
      item={previewItem}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    />
  );
}
