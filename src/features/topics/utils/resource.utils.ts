import { FileType } from '@/types/enum';
import type { MaterialBadgeConfig } from '@/types/material';
import type { UnifiedResource } from '@/types/topic';
import type { PreviewItem } from '@/types/preview';
import { isDirectFileUrl, getCleanDisplayName } from '@/features/upload/utils/file.utils';

/**
 * Visual formatting and badge helpers for topic learning resources.
 */

export function getYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
  );
  return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function formatDateVi(dateStr?: string | Date | null): string {
  if (!dateStr) return '';
  try {
    const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export function getMaterialBadgeConfig(type: FileType): MaterialBadgeConfig {
  switch (type) {
    case 'video':
      return {
        label: 'Video',
        bg: 'bg-blue-500/10',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-500/20',
      };
    case 'pdf':
      return {
        label: 'PDF',
        bg: 'bg-red-500/10',
        text: 'text-red-700 dark:text-red-300',
        border: 'border-red-500/20',
      };
    case 'slide':
      return {
        label: 'Bài trình chiếu',
        bg: 'bg-orange-500/10',
        text: 'text-orange-700 dark:text-orange-300',
        border: 'border-orange-500/20',
      };
    case 'document':
      return {
        label: 'Tài liệu',
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-500/20',
      };
    default:
      return {
        label: 'Liên kết ngoài',
        bg: 'bg-purple-500/10',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-500/20',
      };
  }
}

export function resourceToPreviewItem(
  resource: UnifiedResource,
  topicTitle?: string,
): PreviewItem {
  if (resource.kind === 'material') {
    const badge = getMaterialBadgeConfig(resource.data.materialType);
    const hasExternal = Boolean(resource.data.externalUrl);
    return {
      id: resource.data.id,
      title: resource.data.title,
      fileUrl: hasExternal ? null : resource.data.fileUrl,
      externalUrl: hasExternal ? resource.data.externalUrl : null,
      fileType: resource.data.materialType,
      fileName: hasExternal ? undefined : getCleanDisplayName(resource.data.fileUrl),
      badgeLabel: badge.label,
      badgeBg: badge.bg,
      badgeText: badge.text,
      badgeBorder: badge.border,
      topicTitle,
      createdAt: resource.data.createdAt,
    };
  }

  if (resource.kind === 'reference') {
    const isFile = isDirectFileUrl(resource.data.url);
    return {
      id: resource.data.id,
      title: resource.data.title,
      fileUrl: isFile ? resource.data.url : null,
      externalUrl: isFile ? null : resource.data.url,
      fileType: isFile ? 'document' : 'link',
      fileName: isFile ? getCleanDisplayName(resource.data.url) : undefined,
      description: resource.data.description,
      badgeLabel: isFile ? 'Tệp tham khảo' : 'Tham khảo',
      badgeBg: 'bg-emerald-500/10',
      badgeText: 'text-emerald-700 dark:text-emerald-300',
      badgeBorder: 'border-emerald-500/20',
      topicTitle,
    };
  }

  if (resource.kind === 'assignment') {
    return {
      id: resource.data.id,
      title: resource.data.title,
      description: resource.data.description,
      badgeLabel: 'Bài tập',
      badgeBg: 'bg-amber-500/10',
      badgeText: 'text-amber-700 dark:text-amber-300',
      badgeBorder: 'border-amber-500/20',
      topicTitle,
      createdAt: resource.data.createdAt,
      materials: resource.data.materials?.map((m, idx) => ({
        id: m.id || `mat-${idx}`,
        title: getCleanDisplayName(m.fileUrl),
        fileUrl: m.fileUrl,
        fileType: m.fileType,
        fileName: getCleanDisplayName(m.fileUrl),
        badgeLabel: 'Đề bài đính kèm',
      })),
    };
  }

  return {
    id: resource.data.id,
    title: resource.data.title,
    badgeLabel: 'Trắc nghiệm',
    badgeBg: 'bg-indigo-500/10',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    badgeBorder: 'border-indigo-500/20',
    topicTitle,
  };
}

export function fileToPreviewItem(file: {
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string | null;
}): PreviewItem {
  const cleanName = file.fileName || getCleanDisplayName(file.fileUrl);
  return {
    title: cleanName,
    fileUrl: file.fileUrl,
    fileName: cleanName,
    fileSize: file.fileSize,
    fileType: file.fileType,
    badgeLabel: 'Tài liệu tệp tin',
    badgeBg: 'bg-cyan-500/10',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
    badgeBorder: 'border-cyan-500/20',
  };
}
