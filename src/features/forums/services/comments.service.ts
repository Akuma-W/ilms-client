import { clientApiClient } from '@/lib/api/client-api-client';
import type {
  Comment,
  CreateCommentInput,
  UpdateCommentInput,
} from '@/types/forum';

/**
 * Client-side comments service for Browser Components (CSR, Mutations).
 * Connects directly to backend REST API under /api/v1/forums/:forumId/comments.
 */
export const commentsService = {
  /**
   * Adds a new comment or reply to an existing discussion.
   */
  async createComment(
    input: CreateCommentInput,
  ): Promise<{ success: boolean; data?: Comment; message: string }> {
    try {
      const { forumId, ...body } = input;
      const payload: Record<string, unknown> = {
        content: body.content,
        isAnonymous: body.isAnonymous ?? false,
      };
      if (body.parentId) {
        payload.parentId = body.parentId;
      }

      const res = await clientApiClient<Comment>(`/forums/${forumId}/comments`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res && res.success !== false && res.data) {
        return {
          success: true,
          data: res.data,
          message: 'Gửi bình luận thành công!',
        };
      }
      return {
        success: false,
        message: res?.message || 'Không thể gửi bình luận.',
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
   * Updates an existing comment.
   */
  async updateComment(
    forumId: string,
    commentId: string,
    input: UpdateCommentInput,
  ): Promise<{ success: boolean; data?: Comment; message: string }> {
    try {
      const res = await clientApiClient<Comment>(
        `/forums/${forumId}/comments/${commentId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(input),
        },
      );
      if (res && res.success !== false && res.data) {
        return { success: true, data: res.data, message: 'Đã cập nhật bình luận!' };
      }
      return {
        success: false,
        message: res?.message || 'Không thể cập nhật bình luận.',
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
   * Soft deletes a comment or reply.
   */
  async deleteComment(
    forumId: string,
    commentId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const res = await clientApiClient<unknown>(
        `/forums/${forumId}/comments/${commentId}`,
        {
          method: 'DELETE',
        },
      );
      if (res && res.success !== false) {
        return { success: true, message: 'Đã xóa bình luận thành công.' };
      }
      return {
        success: false,
        message: res?.message || 'Không thể xóa bình luận.',
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
