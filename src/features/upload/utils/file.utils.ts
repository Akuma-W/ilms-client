import { FileType } from '@/types/enum';

/**
 * File utility functions for uploading, formatting, and type inference.
 */

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

export function isDirectFileUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const cleanUrl = url.split('?')[0].toLowerCase();
  const fileExtensions = [
    '.pdf',
    '.ppt',
    '.pptx',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.mp4',
    '.webm',
    '.zip',
    '.rar',
    '.txt',
    '.jpg',
    '.jpeg',
    '.png',
    '.epub',
  ];
  return fileExtensions.some((ext) => cleanUrl.endsWith(ext));
}

export function inferMaterialTypeFromFileName(fileName: string): FileType {
  const cleanName = fileName.split('?')[0].toLowerCase();

  if (cleanName.endsWith('.pdf')) return 'pdf' as FileType;
  if (cleanName.endsWith('.ppt') || cleanName.endsWith('.pptx') || cleanName.endsWith('.odp')) {
    return 'slide' as FileType;
  }
  if (
    cleanName.endsWith('.mp4') ||
    cleanName.endsWith('.mkv') ||
    cleanName.endsWith('.webm') ||
    cleanName.endsWith('.mov') ||
    cleanName.endsWith('.avi')
  ) {
    return 'video' as FileType;
  }
  if (
    cleanName.endsWith('.doc') ||
    cleanName.endsWith('.docx') ||
    cleanName.endsWith('.txt') ||
    cleanName.endsWith('.odt')
  ) {
    return 'document' as FileType;
  }
  if (cleanName.startsWith('http://') || cleanName.startsWith('https://')) {
    if (cleanName.includes('youtube.com') || cleanName.includes('youtu.be')) {
      return 'video' as FileType;
    }
    return 'link' as FileType;
  }

  return 'document' as FileType;
}

export function getBaseFileName(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex <= 0) return fileName;
  return fileName.substring(0, lastDotIndex);
}
