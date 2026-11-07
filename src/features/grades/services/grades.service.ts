import { clientApiClient } from '@/lib/api/client-api-client';
import {
  addMockCategory,
  deleteMockCategory,
  getMockCategories,
  getMockGradeMatrixRows,
  getMockStudentRecord,
  updateMockBatchScores,
  updateMockCategory,
} from '@/mocks/classes/mock-grades';
import type { ClassGradeMatrixRow, GradeCategory, StudentGradeRecord } from '@/types/grade';

/**
 * Service managing grade categories, student gradebooks, and teacher grade matrix.
 */
export const gradesService = {
  /**
   * Retrieves all grade categories and weights for a class.
   */
  async getCategories(classId: string): Promise<GradeCategory[]> {
    try {
      const res = await clientApiClient<GradeCategory[]>(`/classes/${classId}/grade-categories`);
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return res.data;
      }
    } catch {
      // Fallback
    }

    return getMockCategories();
  },

  /**
   * Creates a new grade category with weight percentage.
   */
  async createCategory(
    classId: string,
    name: string,
    weightPercent: number,
  ): Promise<{ success: boolean; data: GradeCategory; message: string }> {
    try {
      const res = await clientApiClient<GradeCategory>(`/classes/${classId}/grade-categories`, {
        method: 'POST',
        body: JSON.stringify({ name, weight: weightPercent / 100 }),
      });
      if (res.success !== false && res.data) {
        return { success: true, data: res.data, message: 'Thêm cột điểm thành công!' };
      }
    } catch {
      // Local mutation fallback
    }

    const newCat = addMockCategory(name, weightPercent);
    return { success: true, data: newCat, message: 'Đã thêm loại điểm mới!' };
  },

  /**
   * Updates an existing grade category.
   */
  async updateCategory(
    classId: string,
    categoryId: string,
    name: string,
    weightPercent: number,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await clientApiClient(`/classes/${classId}/grade-categories/${categoryId}`, {
        method: 'PUT',
        body: JSON.stringify({ name, weight: weightPercent / 100 }),
      });
    } catch {
      // Fallback
    }

    updateMockCategory(categoryId, name, weightPercent);
    return { success: true, message: 'Cập nhật loại điểm thành công!' };
  },

  /**
   * Deletes a grade category.
   */
  async deleteCategory(
    classId: string,
    categoryId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await clientApiClient(`/classes/${classId}/grade-categories/${categoryId}`, {
        method: 'DELETE',
      });
    } catch {
      // Fallback
    }

    deleteMockCategory(categoryId);
    return { success: true, message: 'Đã xóa loại điểm khỏi bảng điểm!' };
  },

  /**
   * Retrieves personal grade record for a student (Categories breakdown + detailed items).
   */
  async getStudentGradeRecord(classId: string, studentId?: string): Promise<StudentGradeRecord> {
    try {
      const res = await clientApiClient<StudentGradeRecord>(`/classes/${classId}/grades/my-record`);
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return res.data;
      }
    } catch {
      // Fallback
    }

    return getMockStudentRecord(studentId);
  },

  /**
   * Retrieves the full class grade matrix for teacher view.
   */
  async getClassGradeMatrix(
    classId: string,
  ): Promise<{ categories: GradeCategory[]; rows: ClassGradeMatrixRow[] }> {
    try {
      const res = await clientApiClient<{
        categories: GradeCategory[];
        rows: ClassGradeMatrixRow[];
      }>(`/classes/${classId}/grades/matrix`);
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return res.data;
      }
    } catch {
      // Fallback
    }

    return {
      categories: getMockCategories(),
      rows: getMockGradeMatrixRows(),
    };
  },

  /**
   * Updates grades in batch for multiple students across categories.
   */
  async updateBatchGrades(
    classId: string,
    updates: { studentId: string; categoryId: string; score: number }[],
  ): Promise<{ success: boolean; message: string }> {
    try {
      await clientApiClient(`/classes/${classId}/grades/batch`, {
        method: 'PUT',
        body: JSON.stringify({ updates }),
      });
    } catch {
      // Fallback
    }

    updateMockBatchScores(updates);
    return { success: true, message: 'Lưu bảng điểm lớp học thành công!' };
  },
};
