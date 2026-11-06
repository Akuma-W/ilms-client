import { FileType } from '@/types/enum';
import type { MaterialBadgeConfig } from '@/types/material';

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
