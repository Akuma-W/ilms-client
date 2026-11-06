/**
 * Utility functions for classroom resources (materials, references, assignments, quizzes).
 */

export function getYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
  );
  return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function formatFileSize(bytes?: number | null): string {
  if (!bytes || bytes <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
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

import type { MaterialBadgeConfig } from '@/types/topic';

export function getMaterialBadgeConfig(type?: string): MaterialBadgeConfig {
  const configs: Record<string, MaterialBadgeConfig> = {
    pdf: {
      label: 'PDF',
      bg: 'bg-red-500/10',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-500/20',
    },
    slide: {
      label: 'Slide',
      bg: 'bg-orange-500/10',
      text: 'text-orange-700 dark:text-orange-300',
      border: 'border-orange-500/20',
    },
    video: {
      label: 'Video',
      bg: 'bg-blue-500/10',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-500/20',
    },
    document: {
      label: 'Tài liệu',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-500/20',
    },
    link: {
      label: 'Liên kết',
      bg: 'bg-purple-500/10',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-500/20',
    },
  };
  return configs[type || 'link'] || configs.link;
}
