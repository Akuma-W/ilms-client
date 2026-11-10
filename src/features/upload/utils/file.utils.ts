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

/**
 * Resolves a storage key, relative path, or full URL to a reachable endpoint.
 */
export function resolveStorageUrl(urlOrPath?: string | null): string {
  if (!urlOrPath || typeof urlOrPath !== 'string') return '';
  const trimmed = urlOrPath.trim();
  if (trimmed.startsWith('blob:') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const apiBase = process.env.NEXT_PUBLIC_CLIENT_API_URL || 'http://localhost:5000/api/v1';
  const cleanPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  return `${apiBase}/storage/file?path=${encodeURIComponent(cleanPath)}`;
}

/**
 * Returns a human-friendly file name without query parameters and timestamp prefixes.
 */
export function getCleanDisplayName(urlOrPath?: string | null, fallbackName?: string): string {
  if (fallbackName && fallbackName.trim()) return fallbackName.trim();
  if (!urlOrPath) return 'Tệp đính kèm';
  try {
    const rawName = urlOrPath.split('?')[0].split('/').pop() || 'Tệp đính kèm';
    const cleaned = decodeURIComponent(rawName).replace(/^(\d{10,14}|[0-9a-fA-F-]{36})-/, '');
    return cleaned || 'Tệp đính kèm';
  } catch {
    return urlOrPath.split('/').pop() || 'Tệp đính kèm';
  }
}
