import { clientApiClient } from '@/lib/api/client-api-client';
import {
  getMockCategories,
  getMockGradeMatrixRows,
  getMockStudentRecord,
} from '@/mocks/classes/mock-grades';
import type {
  AttendanceSummaryEntity,
  ClassGradeMatrixRow,
  GradeCategory,
  GradeCategoryBreakdown,
  StudentGradeRecord,
} from '@/types/grade';

export const gradebookService = {
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
          rows: Array.isArray(res.data.rows) ? res.data.rows : Object.values(res.data.rows || {}),
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

  // Retrieves personal grade record for a student (Categories breakdown + detailed items)
  async getStudentGradeRecord(classId: string, studentId?: string): Promise<StudentGradeRecord> {
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

  // Retrieves 4-pillar attendance and progress summary for the entire classroom
  async getAttendanceSummary(classId: string): Promise<AttendanceSummaryEntity | null> {
    try {
      const res = await clientApiClient<AttendanceSummaryEntity>(
        `/classes/${classId}/grades/attendance-summary`,
      );
      if (res.success !== false && res.data) {
        return res.data;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  // Retrieves breakdown items for composite or calculated grade categories
  async getGradeBreakdown(
    classId: string,
    categoryId: string,
    studentId?: string,
  ): Promise<GradeCategoryBreakdown | null> {
    try {
      const endpoint = studentId
        ? `/classes/${classId}/grades/categories/${categoryId}/breakdown?studentId=${studentId}`
        : `/classes/${classId}/grades/categories/${categoryId}/breakdown`;
      const res = await clientApiClient<GradeCategoryBreakdown>(endpoint);
      if (res.success !== false && res.data) {
        return res.data;
      }
    } catch {
      // Fallback
    }
    return null;
  },
};
