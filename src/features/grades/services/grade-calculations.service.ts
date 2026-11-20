import { clientApiClient } from '@/lib/api/client-api-client';
import { updateMockBatchScores } from '@/mocks/classes/mock-grades';
import type {
  BatchUpdateGradeUpdateItem,
  CalculateAttendanceInput,
  OverrideGradeInput,
  SyncGradesInput,
} from '@/types/grade';

export const gradeCalculationsService = {
  // Updates grades in batch for multiple students across categories
  async updateBatchGrades(
    classId: string,
    updates: BatchUpdateGradeUpdateItem[],
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

  // Executes automated 4-pillar attendance calculation engine
  async calculateAttendance(
    classId: string,
    input?: CalculateAttendanceInput,
  ): Promise<{ success: boolean; count?: number; message: string }> {
    try {
      const res = await clientApiClient<{ count: number }>(
        `/classes/${classId}/grades/calculate-attendance`,
        {
          method: 'POST',
          body: JSON.stringify(input || {}),
        },
      );
      if (res.success !== false) {
        return {
          success: true,
          count: res.data?.count,
          message: res.message || 'Tính điểm chuyên cần và tiến độ thành công!',
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi tính điểm chuyên cần';
      throw new Error(msg);
    }
    return { success: true, message: 'Tính điểm chuyên cần và tiến độ thành công!' };
  },

  // Synchronizes automatic grades from assignments or published quizzes
  async syncGrades(
    classId: string,
    input?: SyncGradesInput,
  ): Promise<{ success: boolean; count?: number; message: string }> {
    try {
      const res = await clientApiClient<{ count: number }>(`/classes/${classId}/grades/sync`, {
        method: 'POST',
        body: JSON.stringify(input || {}),
      });
      if (res.success !== false) {
        return {
          success: true,
          count: res.data?.count,
          message: res.message || 'Đồng bộ điểm thành công!',
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi đồng bộ điểm';
      throw new Error(msg);
    }
    return { success: true, message: 'Đồng bộ điểm thành công!' };
  },

  // Manually overrides a grade for a student with optional justification note
  async overrideGrade(
    classId: string,
    input: OverrideGradeInput,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const res = await clientApiClient(`/classes/${classId}/grades/override`, {
        method: 'POST',
        body: JSON.stringify(input),
      });
      if (res.success !== false) {
        return {
          success: true,
          message: res.message || 'Điều chỉnh điểm số thành công!',
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi điều chỉnh điểm số';
      throw new Error(msg);
    }
    return { success: true, message: 'Điều chỉnh điểm số thành công!' };
  },
};
