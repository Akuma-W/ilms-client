import { clientApiClient } from '@/lib/api/client-api-client';
import type {
  CreateForumInput,
  Forum,
  UpdateForumInput,
} from '@/types/forum';

/**
 * Client-side forums service for Browser Components (CSR, SWR, Mutations).
 * Connects directly to backend REST API under /api/v1/.
 */
export const forumsService = {
  /**
   * Fetches discussion topics for a classroom.
   */
  async getForums(classId: string): Promise<Forum[]> {
    try {
      const res = await clientApiClient<Forum[]>(`/classes/${classId}/forums`);
      if (res && res.success !== false) {
        if (Array.isArray(res.data)) {
          return res.data;
        }
        if (res.data && typeof res.data === 'object') {
          return Object.values(res.data) as Forum[];
        }
      }
      return [];
    } catch {
      return [];
    }
  },

  /**
   * Fetches single discussion topic with threaded comments.
   */
  async getForumDetail(forumId: string): Promise<Forum | null> {
    try {
      const res = await clientApiClient<Forum>(`/forums/${forumId}`);
      if (res && res.success !== false && res.data) {
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Creates a new discussion topic in a classroom.
   */
  async createForum(
    classId: string,
    input: CreateForumInput,
  ): Promise<{ success: boolean; data?: Forum; message: string }> {
    try {
      const res = await clientApiClient<Forum>(`/classes/${classId}/forums`, {
        method: 'POST',
        body: JSON.stringify(input),
      });
      if (res && res.success !== false && res.data) {
        return {
          success: true,
          data: res.data,
          message: 'Tạo chủ đề thảo luận thành công!',
        };
      }
      return {
        success: false,
        message: res?.message || 'Không thể tạo chủ đề thảo luận.',
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi kết nối máy chủ.';
      return {
        success: false,
        message: errorMsg,
      };
    }
  },

  /**
   * Updates an existing discussion topic.
   */
  async updateForum(
    forumId: string,
    input: UpdateForumInput,
  ): Promise<{ success: boolean; data?: Forum; message: string }> {
    try {
      const res = await clientApiClient<Forum>(`/forums/${forumId}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      });
      if (res && res.success !== false && res.data) {
        return { success: true, data: res.data, message: 'Đã cập nhật bài viết!' };
      }
      return {
        success: false,
        message: res?.message || 'Không thể cập nhật bài viết.',
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi kết nối máy chủ.';
      return {
        success: false,
        message: errorMsg,
      };
    }
  },

  /**
   * Soft deletes a discussion topic.
   */
  async deleteForum(forumId: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await clientApiClient<unknown>(`/forums/${forumId}`, {
        method: 'DELETE',
      });
      if (res && res.success !== false) {
        return { success: true, message: 'Đã xóa chủ đề thảo luận thành công.' };
      }
      return {
        success: false,
        message: res?.message || 'Không thể xóa chủ đề thảo luận.',
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi kết nối máy chủ.';
      return {
        success: false,
        message: errorMsg,
      };
    }
  },
};
