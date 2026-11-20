'use client';

import { useEffect, useState } from 'react';
import { Award, GraduationCap, Loader2 } from 'lucide-react';
import { TeacherGradesView } from '@/features/grades/components/teacher-grades-view';
import { StudentGradesView } from '@/features/grades/components/student-grades-view';
import { gradesService } from '@/features/grades/services/grades.service';
import { gradeCategoriesService } from '@/features/grades/services/grade-categories.service';
import type { ClassGradeMatrixRow, GradeCategory, StudentGradeRecord } from '@/types/grade';
import { useCurrentUser } from '@/features/user/hooks/use-current-user';

interface GradesClientProps {
  classId: string;
  isTeacher: boolean;
  isArchived?: boolean;
}

export function GradesClient({ classId, isTeacher, isArchived = false }: GradesClientProps) {
  const { user: currentUser } = useCurrentUser();
  const roleCanEdit = isTeacher || currentUser?.role === 'admin';

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<GradeCategory[]>([]);
  const [matrixRows, setMatrixRows] = useState<ClassGradeMatrixRow[]>([]);
  const [studentRecord, setStudentRecord] = useState<StudentGradeRecord | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (roleCanEdit) {
      gradesService
        .getClassGradeMatrix(classId)
        .then((res) => {
          if (isMounted) {
            setCategories(res.categories);
            setMatrixRows(res.rows);
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      gradesService
        .getStudentGradeRecord(classId, currentUser?.id)
        .then((record) => {
          if (isMounted) {
            setStudentRecord(record);
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [classId, roleCanEdit, currentUser?.id]);

  const handleSaveBatch = async (
    updates: { studentId: string; categoryId: string; score: number }[],
  ) => {
    await gradesService.updateBatchGrades(classId, updates);
    // Refresh grade matrix
    const res = await gradesService.getClassGradeMatrix(classId);
    setCategories(res.categories);
    setMatrixRows(res.rows);
  };

  const handleSaveCategories = async (
    updated: {
      id?: string;
      name: string;
      weightPercent: number;
      orderIndex?: number;
      isDeleted?: boolean;
      sourceType?: GradeCategory['sourceType'];
      sourceId?: string | null;
      config?: GradeCategory['config'];
    }[],
  ) => {
    for (const item of updated) {
      if (item.isDeleted && item.id) {
        await gradeCategoriesService.deleteCategory(classId, item.id);
      } else if (!item.id && !item.isDeleted) {
        await gradeCategoriesService.createCategory(classId, {
          name: item.name,
          weight: item.weightPercent / 100,
          orderIndex: item.orderIndex,
          sourceType: item.sourceType,
          sourceId: item.sourceId || undefined,
          config: item.config || undefined,
        });
      } else if (item.id && !item.isDeleted) {
        await gradeCategoriesService.updateCategory(classId, item.id, {
          name: item.name,
          weight: item.weightPercent / 100,
          orderIndex: item.orderIndex,
          sourceType: item.sourceType,
          sourceId: item.sourceId || undefined,
          config: item.config || undefined,
        });
      }
    }
    const res = await gradesService.getClassGradeMatrix(classId);
    setCategories(res.categories);
    setMatrixRows(res.rows);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-90 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Đang tải dữ liệu bảng điểm...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {roleCanEdit ? (
              <GraduationCap className="h-6 w-6 text-primary" />
            ) : (
              <Award className="h-6 w-6 text-primary" />
            )}
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {roleCanEdit ? 'Quản lý bảng điểm lớp học' : 'Kết quả học tập & Bảng điểm'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {roleCanEdit
              ? 'Xem điểm danh sách lớp, tính toán tổng kết hệ 10 và cập nhật điểm theo cột trọng số.'
              : 'Theo dõi điểm số chi tiết từng hạng mục, bài tập và tiến độ hoàn thành môn học.'}
          </p>
        </div>
      </div>

      {/* Main View Presentation */}
      {roleCanEdit ? (
        <TeacherGradesView
          classId={classId}
          categories={categories}
          rows={matrixRows}
          onSaveBatch={handleSaveBatch}
          onSaveCategories={handleSaveCategories}
          onRefresh={async () => {
            const res = await gradesService.getClassGradeMatrix(classId);
            setCategories(res.categories);
            setMatrixRows(res.rows);
          }}
          isArchived={isArchived}
        />
      ) : studentRecord ? (
        <StudentGradesView record={studentRecord} classId={classId} />
      ) : (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Chưa có dữ liệu bảng điểm cho tài khoản này.
        </div>
      )}
    </div>
  );
}
