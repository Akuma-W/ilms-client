import { CLIENT_API_URL } from '@/config';
import type { UploadResult } from '@/types/upload';

/**
 * Universal file upload service communicating with MinIO storage controller.
 */
export const uploadService = {
  async uploadFile(formData: FormData, folder: string = 'materials'): Promise<UploadResult> {
    try {
      const targetUrl = `${CLIENT_API_URL}/storage/upload?folder=${encodeURIComponent(folder)}`;
      const res = await fetch(targetUrl, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }

      const json = await res.json();
      const payload = json.data || json;
      return {
        success: true,
        data: {
          url: payload.url || payload.fileUrl || '',
          key: payload.key || payload.fileKey || '',
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Tải lên tệp thất bại',
        data: null,
      };
    }
  },
};
