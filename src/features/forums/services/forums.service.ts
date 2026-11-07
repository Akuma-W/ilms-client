import { clientApiClient } from '@/lib/api/client-api-client';
import {
  createMockComment,
  createMockForum,
  deleteMockComment,
  deleteMockForum,
  getMockForumById,
  getMockForums,
  updateMockComment,
  updateMockForum,
} from '@/mocks/classes/mock-forums';
import { MOCK_CURRENT_USER } from '@/mocks/classes/mock-users';
import type {
  Comment,
  CreateCommentInput,
  CreateForumInput,
  Forum,
  UpdateCommentInput,
  UpdateForumInput,
} from '@/types/forum';
import type { User } from '@/types/user';

/**
 * Client-side forums service for Browser Components (CSR, SWR, Mutations).
 * Encapsulates clientApiClient and fallback to mock data when API errors or fails.
 */
export const forumsService = {
  /**
   * Fetches discussion topics for a class with automatic mock fallback.
   */
  async getForums(classId: string): Promise<Forum[]> {
    try {
      const res = await clientApiClient<Forum[]>(`/classes/${classId}/forums`);
      if (res && res.success !== false && Array.isArray(res.data)) {
        return res.data;
      }
      return getMockForums(classId);
    } catch {
      return getMockForums(classId);
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
      return getMockForumById(forumId);
    } catch {
      return getMockForumById(forumId);
    }
  },

  /**
   * Creates a new discussion topic.
   */
  async createForum(
    classId: string,
    input: CreateForumInput,
    currentUser?: User | null,
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
    } catch {
      // Fallback to in-memory mock
    }

    const mockItem = createMockForum(classId, input, currentUser || MOCK_CURRENT_USER);
    return {
      success: true,
      data: mockItem,
      message: 'Tạo chủ đề thảo luận thành công!',
    };
  },

  /**
   * Adds a new comment or reply to an existing discussion.
   */
  async createComment(
    input: CreateCommentInput,
    currentUser?: User | null,
  ): Promise<{ success: boolean; data?: Comment; message: string }> {
    try {
      const res = await clientApiClient<Comment>(`/forums/${input.forumId}/comments`, {
        method: 'POST',
        body: JSON.stringify(input),
      });
      if (res && res.success !== false && res.data) {
        return {
          success: true,
          data: res.data,
          message: 'Gửi bình luận thành công!',
        };
      }
    } catch {
      // Fallback to in-memory mock
    }

    const mockComment = createMockComment(input, currentUser || MOCK_CURRENT_USER);
    return {
      success: true,
      data: mockComment,
      message: 'Gửi bình luận thành công!',
    };
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
    } catch {
      // Fallback to mock
    }

    const mockUpdated = updateMockForum(forumId, input);
    return {
      success: true,
      data: mockUpdated || undefined,
      message: 'Đã cập nhật bài viết!',
    };
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
      const res = await clientApiClient<Comment>(`/forums/${forumId}/comments/${commentId}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      });
      if (res && res.success !== false && res.data) {
        return { success: true, data: res.data, message: 'Đã cập nhật bình luận!' };
      }
    } catch {
      // Fallback to mock
    }

    const mockUpdated = updateMockComment(forumId, commentId, input);
    return {
      success: true,
      data: mockUpdated || undefined,
      message: 'Đã cập nhật bình luận!',
    };
  },

  /**
   * Deletes a discussion topic.
   */
  async deleteForum(forumId: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await clientApiClient<unknown>(`/forums/${forumId}`, {
        method: 'DELETE',
      });
      if (res && res.success !== false) {
        return { success: true, message: 'Đã xóa chủ đề thảo luận.' };
      }
    } catch {
      // Fallback to mock
    }

    deleteMockForum(forumId);
    return { success: true, message: 'Đã xóa chủ đề thảo luận.' };
  },

  /**
   * Deletes a comment or reply.
   */
  async deleteComment(
    forumId: string,
    commentId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const res = await clientApiClient<unknown>(`/forums/${forumId}/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (res && res.success !== false) {
        return { success: true, message: 'Đã xóa bình luận.' };
      }
    } catch {
      // Fallback to mock
    }

    deleteMockComment(forumId, commentId);
    return { success: true, message: 'Đã xóa bình luận.' };
  },
};
