'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { GradeMatrixRow } from './grade-matrix-row';
import { GradeAnalyticsCards } from './grade-analytics-cards';
import { GradeStructureRibbon } from './grade-structure-ribbon';
import { CategoryManagementModal } from './category-management-modal';
import { TeacherGradesToolbar } from './teacher-grades-toolbar';
import { SyncGradesModal } from './sync-grades-modal';
import { AttendanceSummaryDrawer } from './attendance-summary-drawer';
import { GradeBreakdownModal } from './grade-breakdown-modal';
import { CalculateAttendanceModal } from './calculate-attendance-modal';
import { TeacherGradesTableHeader } from './teacher-grades-table-header';
import { gradeCalculationsService } from '../services/grade-calculations.service';
import { exportGradesToCsv } from '../utils/export.utils';
import { sortGradeRows, type GradeSortField, type GradeSortOrder } from '../utils/grade-sort.utils';
import { useGradeMatrix } from '../hooks/use-grade-matrix';
import type { ClassGradeMatrixRow, GradeCategory } from '@/types/grade';
import { DataPagination } from '@/components/shared/data-pagination';

interface TeacherGradesViewProps {
  classId?: string;
  categories: GradeCategory[];
  rows: ClassGradeMatrixRow[];
  onSaveBatch: (
    updates: { studentId: string; categoryId: string; score: number }[],
  ) => Promise<void>;
  onSaveCategories?: (
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
  ) => Promise<void>;
  onRefresh?: () => Promise<void>;
  className?: string;
  isArchived?: boolean;
}

const ITEMS_PER_PAGE = 10;

export function TeacherGradesView({
  classId = '',
  categories,
  rows,
  onSaveBatch,
  onSaveCategories,
  onRefresh,
  className = 'lop-hoc',
  isArchived = false,
}: TeacherGradesViewProps) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncTargetCategoryId, setSyncTargetCategoryId] = useState<string>('all');
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceTargetCategoryId, setAttendanceTargetCategoryId] = useState<string>('');
  const [isAttendanceDrawerOpen, setIsAttendanceDrawerOpen] = useState(false);

  const [breakdownModal, setBreakdownModal] = useState({
    isOpen: false,
    categoryId: '',
    categoryName: '',
    studentId: '',
    studentName: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoCalculating, setIsAutoCalculating] = useState(false);
  const [sortField, setSortField] = useState<GradeSortField>('index');
  const [sortOrder, setSortOrder] = useState<GradeSortOrder>('asc');

  const sortedCategories = [...categories].sort(
    (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0),
  );

  // Custom hook for matrix state, real-time recalculation & SWR automatic data sync
  const {
    isEditing,
    setIsEditing,
    draftScores,
    handleScoreChange,
    resetDraft,
    hasInvalidScore,
    getComputedFinalScore,
  } = useGradeMatrix({ rows, categories: sortedCategories });

  const handleSort = (field: GradeSortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      const isTextOrIndex =
        field === 'index' ||
        field === 'code' ||
        field === 'studentCode' ||
        field === 'name' ||
        field === 'studentName';
      setSortOrder(isTextOrIndex ? 'asc' : 'desc');
    }
    setPage(1);
  };

  const filteredRows = rows.filter((r) => {
    const term = searchTerm.toLowerCase();
    return r.studentName.toLowerCase().includes(term) || r.studentCode.toLowerCase().includes(term);
  });

  const sortedRows = sortGradeRows(
    filteredRows,
    sortField,
    sortOrder,
    isEditing ? draftScores : undefined,
  );
  const totalPages = Math.ceil(sortedRows.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginatedRows = sortedRows.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const totalStudents = rows.length;
  const gradedRows = rows.filter((r) => r.finalScore !== null && r.finalScore !== undefined);
  const passingStudents = gradedRows.filter((r) => (r.finalScore ?? 0) >= 5.0).length;
  const averageClassScore =
    gradedRows.length > 0
      ? (gradedRows.reduce((sum, r) => sum + (r.finalScore ?? 0), 0) / gradedRows.length).toFixed(2)
      : '—';
  const passingRate =
    gradedRows.length > 0 ? Math.round((passingStudents / gradedRows.length) * 100) : 0;

  const handleSaveGrades = async () => {
    if (hasInvalidScore) {
      toast.error('Có điểm không hợp lệ! Vui lòng chỉ nhập điểm trong khoảng từ 0 đến 10.');
      return;
    }
    setIsSaving(true);
    try {
      const updates: { studentId: string; categoryId: string; score: number }[] = [];
      const rowMap = new Map(rows.map((r) => [r.studentId, r]));

      Object.entries(draftScores).forEach(([studentId, scoresMap]) => {
        const originalRow = rowMap.get(studentId);
        Object.entries(scoresMap).forEach(([categoryId, score]) => {
          if (score !== null && !isNaN(score)) {
            const originalScore = originalRow?.scores[categoryId] ?? null;
            if (originalScore === null || Math.abs(originalScore - score) >= 0.001) {
              updates.push({ studentId, categoryId, score });
            }
          }
        });
      });

      if (updates.length === 0) {
        setIsEditing(false);
        toast.info('Không có thay đổi điểm nào cần lưu.');
        return;
      }

      await onSaveBatch(updates);
      setIsEditing(false);
      toast.success(`Đã cập nhật thành công ${updates.length} điểm!`);
    } catch {
      toast.error('Không thể lưu bảng điểm. Vui lòng thử lại!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoCalculateAll = async () => {
    if (!classId) return;
    setIsAutoCalculating(true);
    try {
      const syncRes = await gradeCalculationsService.syncGrades(classId);
      const hasAttendance = sortedCategories.some((c) => c.sourceType === 'attendance');
      if (hasAttendance) {
        await gradeCalculationsService.calculateAttendance(classId);
      }
      toast.success(syncRes.message || 'Tính điểm tự động toàn bộ lớp thành công!', {
        description: 'Bảng điểm và các cột tự động đã được làm mới.',
      });
      await onRefresh?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi tính điểm tự động');
    } finally {
      setIsAutoCalculating(false);
    }
  };

  const handleConfigureColumn = (cat: GradeCategory) => {
    if (cat.sourceType === 'attendance') {
      setAttendanceTargetCategoryId(cat.id);
      setIsAttendanceModalOpen(true);
    } else if (cat.sourceType === 'assignment' || cat.sourceType === 'quiz') {
      setSyncTargetCategoryId(cat.id);
      setIsSyncModalOpen(true);
    } else {
      setIsCategoryModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <GradeAnalyticsCards
        totalStudents={totalStudents}
        averageScore={averageClassScore}
        passingStudents={passingStudents}
        passingRate={passingRate}
      />

      {/* Grade Structure Ribbon (Placed on top of grade matrix, default collapsed) */}
      <GradeStructureRibbon
        categories={sortedCategories}
        isArchived={isArchived}
        onOpenManagement={() => setIsCategoryModalOpen(true)}
      />

      <Card className="rounded-2xl border border-border/80 shadow-xs overflow-hidden bg-card">
        <TeacherGradesToolbar
          isEditing={isEditing}
          searchTerm={searchTerm}
          isSaving={isSaving}
          isAutoCalculating={isAutoCalculating}
          hasInvalidScore={hasInvalidScore}
          isArchived={isArchived}
          onSearchChange={setSearchTerm}
          onOpenAttendanceSummary={() => setIsAttendanceDrawerOpen(true)}
          onAutoCalculateAll={handleAutoCalculateAll}
          onExportCsv={() => exportGradesToCsv(sortedCategories, sortedRows, className)}
          onStartEdit={() => setIsEditing(true)}
          onCancelEdit={resetDraft}
          onSaveGrades={handleSaveGrades}
        />

        <Table>
          <TeacherGradesTableHeader
            categories={sortedCategories}
            classId={classId}
            sortField={sortField}
            sortOrder={sortOrder}
            isArchived={isArchived}
            onSort={handleSort}
            onConfigureColumn={handleConfigureColumn}
            onColumnSync={(catId) => {
              setSyncTargetCategoryId(catId);
              setIsSyncModalOpen(true);
            }}
            onColumnAttendance={(catId) => {
              setAttendanceTargetCategoryId(catId);
              setIsAttendanceModalOpen(true);
            }}
          />

          <TableBody>
            {paginatedRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={sortedCategories.length + 5}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  {searchTerm
                    ? 'Không tìm thấy sinh viên nào phù hợp.'
                    : 'Chưa có sinh viên trong lớp học.'}
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row, idx) => {
                const studentDraft = draftScores[row.studentId];
                const computedScore = isEditing
                  ? getComputedFinalScore(row.studentId)
                  : row.finalScore;

                return (
                  <GradeMatrixRow
                    key={row.studentId}
                    row={row}
                    categories={sortedCategories}
                    index={(safePage - 1) * ITEMS_PER_PAGE + idx}
                    isEditing={isEditing}
                    draftScores={studentDraft}
                    onScoreChange={handleScoreChange}
                    onOpenBreakdown={(categoryId, categoryName, studentId, studentName) =>
                      setBreakdownModal({
                        isOpen: true,
                        categoryId,
                        categoryName,
                        studentId,
                        studentName,
                      })
                    }
                    computedFinalScore={computedScore}
                  />
                );
              })
            )}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-border/50">
          <DataPagination
            page={safePage}
            totalPages={totalPages}
            totalItems={sortedRows.length}
            limit={ITEMS_PER_PAGE}
            onPageChange={setPage}
          />
        </div>
      </Card>

      {onSaveCategories && !isArchived && (
        <CategoryManagementModal
          classId={classId}
          isOpen={isCategoryModalOpen}
          onOpenChange={setIsCategoryModalOpen}
          categories={sortedCategories}
          onSaveCategories={onSaveCategories}
        />
      )}

      {classId && (
        <>
          <CalculateAttendanceModal
            classId={classId}
            categories={sortedCategories}
            isOpen={isAttendanceModalOpen}
            onOpenChange={setIsAttendanceModalOpen}
            onSuccess={onRefresh}
            defaultCategoryId={attendanceTargetCategoryId}
            onChangeCalculationType={() => setIsCategoryModalOpen(true)}
          />

          <SyncGradesModal
            classId={classId}
            categories={sortedCategories}
            isOpen={isSyncModalOpen}
            onOpenChange={setIsSyncModalOpen}
            onSuccess={onRefresh}
            defaultCategoryId={syncTargetCategoryId}
            onChangeCalculationType={() => setIsCategoryModalOpen(true)}
          />

          <AttendanceSummaryDrawer
            classId={classId}
            isOpen={isAttendanceDrawerOpen}
            onOpenChange={setIsAttendanceDrawerOpen}
          />

          <GradeBreakdownModal
            classId={classId}
            categoryId={breakdownModal.categoryId}
            categoryName={breakdownModal.categoryName}
            studentId={breakdownModal.studentId}
            studentName={breakdownModal.studentName}
            isOpen={breakdownModal.isOpen}
            onOpenChange={(open) => setBreakdownModal((prev) => ({ ...prev, isOpen: open }))}
          />
        </>
      )}
    </div>
  );
}
