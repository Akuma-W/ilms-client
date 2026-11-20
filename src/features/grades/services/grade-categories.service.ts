import { clientApiClient } from '@/lib/api/client-api-client';
import {
  addMockCategory,
  deleteMockCategory,
  getMockCategories,
  updateMockCategory,
} from '@/mocks/classes/mock-grades';
import type {
  CreateGradeCategoryInput,
  GradeCategory,
  UpdateGradeCategoryInput,
} from '@/types/grade';

export const gradeCategoriesService = {
  // Retrieves all grade categories and weights for a class
  async getCategories(classId: string): Promise<GradeCategory[]> {
    try {
      const res = await clientApiClient<GradeCategory[]>(`/classes/${classId}/grades/categories`);
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
    input: CreateGradeCategoryInput | string,
    weightPercent?: number,
    orderIndex?: number,
  ): Promise<{ success: boolean; data: GradeCategory; message: string }> {
    const payload =
      typeof input === 'string'
        ? {
            name: input,
            weight: (weightPercent || 10) / 100,
            ...(orderIndex !== undefined && { orderIndex }),
          }
        : input;

    try {
      const res = await clientApiClient<GradeCategory>(`/classes/${classId}/grades/categories`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
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

    const name = typeof input === 'string' ? input : input.name;
    const weight = typeof input === 'string' ? weightPercent || 10 : input.weight * 100;
    const newCat = addMockCategory(name, weight, orderIndex);
    return {
      success: true,
      data: newCat,
      message: 'Đã thêm loại điểm mới!',
    };
  },

  // Updates an existing grade category with optional source linkage and strategy
  async updateCategory(
    classId: string,
    categoryId: string,
    input: UpdateGradeCategoryInput | string,
    weightPercent?: number,
    orderIndex?: number,
  ): Promise<{ success: boolean; message: string }> {
    const payload =
      typeof input === 'string'
        ? {
            name: input,
            weight: (weightPercent || 10) / 100,
            ...(orderIndex !== undefined && { orderIndex }),
          }
        : input;

    try {
      await clientApiClient(`/classes/${classId}/grades/categories/${categoryId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      return { success: true, message: 'Cập nhật loại điểm thành công!' };
    } catch {
      // Fallback
    }

    const name = typeof input === 'string' ? input : input.name || '';
    const weight = typeof input === 'string' ? weightPercent || 10 : (input.weight || 0.1) * 100;
    updateMockCategory(categoryId, name, weight, orderIndex);
    return { success: true, message: 'Cập nhật loại điểm thành công!' };
  },

  // Deletes a grade category
  async deleteCategory(
    classId: string,
    categoryId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await clientApiClient(`/classes/${classId}/grades/categories/${categoryId}`, {
        method: 'DELETE',
      });
      return { success: true, message: 'Đã xóa loại điểm khỏi bảng điểm!' };
    } catch {
      // Fallback
    }

    deleteMockCategory(categoryId);
    return { success: true, message: 'Đã xóa loại điểm khỏi bảng điểm!' };
  },
};
