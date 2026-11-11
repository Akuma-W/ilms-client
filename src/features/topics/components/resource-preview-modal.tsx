'use client';

import { useMemo } from 'react';
import { FilePreviewModal } from '@/components/resources/file-preview-modal';
import { resourceToPreviewItem } from '../utils/resource.utils';
import type { UnifiedResource } from '@/types/topic';

interface ResourcePreviewModalProps {
  resource: UnifiedResource | null;
  topicTitle?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Adapter component wrapping the universal FilePreviewModal for topic resources.
 */
export function ResourcePreviewModal({
  resource,
  topicTitle,
  isOpen,
  onOpenChange,
}: ResourcePreviewModalProps) {
  const previewItem = useMemo(() => {
    if (!resource) return null;
    return resourceToPreviewItem(resource, topicTitle);
  }, [resource, topicTitle]);

  return (
    <FilePreviewModal
      item={previewItem}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    />
  );
}
