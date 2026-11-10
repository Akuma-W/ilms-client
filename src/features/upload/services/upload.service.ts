import { clientApiClient } from '@/lib/api/client-api-client';
import type { UploadResult } from '@/types/upload';

interface StorageUploadResponse {
  path: string;
  url: string;
}

/**
 * Universal file upload service communicating with MinIO storage controller.
 */
export const uploadService = {
  async uploadFile(formData: FormData, folder: string = 'general'): Promise<UploadResult> {
    try {
      const res = await clientApiClient<StorageUploadResponse>(
        `/storage/upload?folder=${encodeURIComponent(folder)}`,
        {
          method: 'POST',
          body: formData,
        },
      );

      if (res.success === false || !res.data) {
        return {
          success: false,
          message: res.message || 'Tải lên tệp thất bại',
          data: null,
        };
      }

      const payload = res.data;
      return {
        success: true,
        data: {
          url: payload.url || (payload as { fileUrl?: string }).fileUrl || '',
          key: payload.path || (payload as { key?: string }).key || '',
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
