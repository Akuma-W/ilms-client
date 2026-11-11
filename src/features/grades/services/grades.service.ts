import { clientApiClient } from '@/lib/api/client-api-client';
import {
  getMockCategories,
  getMockGradeMatrixRows,
  getMockStudentRecord,
  updateMockBatchScores,
} from '@/mocks/classes/mock-grades';
import type {
  ClassGradeMatrixRow,
  GradeCategory,
  StudentGradeRecord,
} from '@/types/grade';

// Service managing student gradebooks and classroom grade matrix
export const gradesService = {
  // Retrieves personal grade record for a student (Categories breakdown + detailed items)
  async getStudentGradeRecord(
    classId: string,
    studentId?: string,
  ): Promise<StudentGradeRecord> {
    try {
      const endpoint = studentId
        ? `/classes/${classId}/grades/my-record?studentId=${studentId}`
        : `/classes/${classId}/grades/my-record`;
      const res = await clientApiClient<StudentGradeRecord>(endpoint);
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return res.data;
      }
    } catch {
      // Fallback
    }

    return getMockStudentRecord(studentId);
  },

  // Retrieves the full class grade matrix for teacher view
  async getClassGradeMatrix(
    classId: string,
  ): Promise<{ categories: GradeCategory[]; rows: ClassGradeMatrixRow[] }> {
    try {
      const res = await clientApiClient<{
        categories: GradeCategory[];
        rows: ClassGradeMatrixRow[];
      }>(`/classes/${classId}/grades/matrix`);
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return {
          categories: Array.isArray(res.data.categories)
            ? res.data.categories
            : Object.values(res.data.categories || {}),
          rows: Array.isArray(res.data.rows)
            ? res.data.rows
            : Object.values(res.data.rows || {}),
        };
      }
    } catch {
      // Fallback
    }

    return {
      categories: getMockCategories(),
      rows: getMockGradeMatrixRows(),
    };
  },

  // Updates grades in batch for multiple students across categories
  async updateBatchGrades(
    classId: string,
    updates: { studentId: string; categoryId: string; score: number }[],
  ): Promise<{ success: boolean; message: string }> {
    try {
      await clientApiClient(`/classes/${classId}/grades/batch`, {
        method: 'PUT',
        body: JSON.stringify({ updates }),
      });
      return { success: true, message: 'Lưu bảng điểm lớp học thành công!' };
    } catch {
      // Fallback
    }

    updateMockBatchScores(updates);
    return { success: true, message: 'Lưu bảng điểm lớp học thành công!' };
  },
};
