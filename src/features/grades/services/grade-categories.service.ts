import { clientApiClient } from '@/lib/api/client-api-client';
import {
  addMockCategory,
  deleteMockCategory,
  getMockCategories,
  updateMockCategory,
} from '@/mocks/classes/mock-grades';
import type { GradeCategory } from '@/types/grade';

// Service managing grade categories and weights for classroom grading structure
export const gradeCategoriesService = {
  // Retrieves all grade categories and weights for a class
  async getCategories(classId: string): Promise<GradeCategory[]> {
    try {
      const res = await clientApiClient<GradeCategory[]>(
        `/classes/${classId}/grade-categories`,
      );
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return Array.isArray(res.data) ? res.data : Object.values(res.data);
      }
    } catch {
      // Fallback to mock data if offline
    }

    return getMockCategories();
  },

  // Creates a new grade category with weight percentage and order index
  async createCategory(
    classId: string,
    name: string,
    weightPercent: number,
    orderIndex?: number,
  ): Promise<{ success: boolean; data: GradeCategory; message: string }> {
    try {
      const res = await clientApiClient<GradeCategory>(
        `/classes/${classId}/grade-categories`,
        {
          method: 'POST',
          body: JSON.stringify({
            name,
            weight: weightPercent / 100,
            ...(orderIndex !== undefined && { orderIndex }),
          }),
        },
      );
      if (res.success !== false && res.data) {
        return {
          success: true,
          data: res.data,
          message: 'Thêm cột điểm thành công!',
        };
      }
    } catch {
      // Fallback
    }

    const newCat = addMockCategory(name, weightPercent, orderIndex);
    return {
      success: true,
      data: newCat,
      message: 'Đã thêm loại điểm mới!',
    };
  },

  // Updates an existing grade category
  async updateCategory(
    classId: string,
    categoryId: string,
    name: string,
    weightPercent: number,
    orderIndex?: number,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await clientApiClient(
        `/classes/${classId}/grade-categories/${categoryId}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            name,
            weight: weightPercent / 100,
            ...(orderIndex !== undefined && { orderIndex }),
          }),
        },
      );
      return { success: true, message: 'Cập nhật loại điểm thành công!' };
    } catch {
      // Fallback
    }

    updateMockCategory(categoryId, name, weightPercent, orderIndex);
    return { success: true, message: 'Cập nhật loại điểm thành công!' };
  },

  // Deletes a grade category
  async deleteCategory(
    classId: string,
    categoryId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await clientApiClient(
        `/classes/${classId}/grade-categories/${categoryId}`,
        {
          method: 'DELETE',
        },
      );
      return { success: true, message: 'Đã xóa loại điểm khỏi bảng điểm!' };
    } catch {
      // Fallback
    }

    deleteMockCategory(categoryId);
    return { success: true, message: 'Đã xóa loại điểm khỏi bảng điểm!' };
  },
};
