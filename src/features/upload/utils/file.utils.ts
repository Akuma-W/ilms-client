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
  const target = url.includes('path=')
    ? decodeURIComponent(url.split('path=')[1].split('&')[0])
    : url.split('?')[0];
  const cleanUrl = target.toLowerCase();
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
 * Resolves a storage key, relative path, or legacy MinIO/external URL to a reachable endpoint.
 */
export function resolveStorageUrl(urlOrPath?: string | null): string {
  if (!urlOrPath || typeof urlOrPath !== 'string') return '';
  const trimmed = urlOrPath.trim();
  if (trimmed.startsWith('blob:') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  const apiBase = process.env.NEXT_PUBLIC_CLIENT_API_URL || 'http://localhost:5000/api/v1';

  // Already a storage proxy URL
  if (trimmed.includes('/storage/file?path=')) {
    return trimmed;
  }

  // Check if it's an HTTP/HTTPS URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const parsed = new URL(trimmed);
      const isMinioHost =
        parsed.port === '9000' ||
        parsed.port === '9090' ||
        parsed.hostname.includes('minio') ||
        parsed.hostname === 'files.localhost';
      const hasMinioSignature =
        parsed.searchParams.has('X-Amz-Signature') ||
        parsed.searchParams.has('X-Amz-Algorithm');
      const hasBucketPath =
        parsed.pathname.includes('/keiverse/') ||
        parsed.pathname.includes('/ilms-bucket/');

      // If it's a legacy MinIO presigned or direct link saved in DB, extract object key
      if (isMinioHost || hasMinioSignature || hasBucketPath) {
        const rawPath = parsed.pathname.replace(/^\/+/, '');
        const segments = rawPath.split('/');
        let cleanObjectKey = rawPath;
        if (
          segments.length > 1 &&
          (segments[0] === 'keiverse' ||
            segments[0] === 'ilms-bucket' ||
            isMinioHost)
        ) {
          cleanObjectKey = segments.slice(1).join('/');
        }
        return `${apiBase}/storage/file?path=${encodeURIComponent(cleanObjectKey)}`;
      }

      // Truly external URL (YouTube, Google Drive, web reference, etc.)
      return trimmed;
    } catch {
      return trimmed;
    }
  }

  // Relative storage path/key (e.g. 'materials/123.pdf', 'assignments/abc.docx')
  const cleanPath = trimmed.split('?')[0].replace(/^\/+/, '');
  return `${apiBase}/storage/file?path=${encodeURIComponent(cleanPath)}`;
}

/**
 * Returns a human-friendly file name without query parameters and timestamp prefixes.
 */
export function getCleanDisplayName(urlOrPath?: string | null, fallbackName?: string): string {
  if (fallbackName && fallbackName.trim()) return fallbackName.trim();
  if (!urlOrPath) return 'Tệp đính kèm';
  try {
    const target = urlOrPath.includes('path=')
      ? decodeURIComponent(urlOrPath.split('path=')[1].split('&')[0])
      : urlOrPath.split('?')[0];
    const rawName = target.split('/').pop() || 'Tệp đính kèm';
    const cleaned = decodeURIComponent(rawName).replace(/^(\d{10,14}|[0-9a-fA-F-]{36})-/, '');
    return cleaned || 'Tệp đính kèm';
  } catch {
    return urlOrPath.split('/').pop() || 'Tệp đính kèm';
  }
}
