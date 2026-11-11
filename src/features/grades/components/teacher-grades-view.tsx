'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TeacherGradesPagination } from './teacher-grades-pagination';
import { GradeMatrixRow } from './grade-matrix-row';
import { GradeAnalyticsCards } from './grade-analytics-cards';
import { CategoryManagementModal } from './category-management-modal';
import { TeacherGradesToolbar } from './teacher-grades-toolbar';
import { calculateFinalScore } from '../utils/grade.utils';
import { exportGradesToCsv } from '../utils/export.utils';
import { sortGradeRows, type GradeSortField, type GradeSortOrder } from '../utils/grade-sort.utils';
import type { ClassGradeMatrixRow, GradeCategory } from '@/types/grade';

interface TeacherGradesViewProps {
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
    }[],
  ) => Promise<void>;
  className?: string;
}

const ITEMS_PER_PAGE = 10;

/**
 * Teacher grade matrix view with compact analytics cards, inline spreadsheet editing,
 * sortable headers, input validation bounds [0, 10], and CSV export.
 */
export function TeacherGradesView({
  categories,
  rows,
  onSaveBatch,
  onSaveCategories,
  className = 'lop-hoc',
}: TeacherGradesViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [sortField, setSortField] = useState<GradeSortField>('index');
  const [sortOrder, setSortOrder] = useState<GradeSortOrder>('asc');

  // Categories ordered by sequence index
  const sortedCategories = [...categories].sort(
    (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0),
  );

  // Initialize draft scores map: studentId -> { categoryId -> score }
  const [draftScores, setDraftScores] = useState<Record<string, Record<string, number | null>>>(
    () => {
      const initial: Record<string, Record<string, number | null>> = {};
      rows.forEach((r) => {
        initial[r.studentId] = { ...r.scores };
      });
      return initial;
    },
  );

  // Validate all entered draft scores strictly between 0 and 10
  const hasInvalidScore = Object.values(draftScores).some((scoresMap) =>
    Object.values(scoresMap).some(
      (score) => score !== null && score !== undefined && (score < 0 || score > 10),
    ),
  );

  // Sort direction handler
  const handleSort = (field: GradeSortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder(field === 'finalScore' ? 'desc' : 'asc');
    }
    setPage(1);
  };

  // Filter students by search term
  const filteredRows = rows.filter((r) => {
    const nameMatch = r.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const codeMatch = r.studentCode.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || codeMatch;
  });

  // Apply sorting
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

  // Overall classroom analytics: compute only on students with graded records
  const totalStudents = rows.length;
  const gradedRows = rows.filter((r) => r.finalScore !== null && r.finalScore !== undefined);
  const passingStudents = gradedRows.filter(
    (r) => r.finalScore !== null && r.finalScore >= 5.0,
  ).length;
  const averageClassScore =
    gradedRows.length > 0
      ? (
          gradedRows.reduce((sum, r) => sum + (r.finalScore ?? 0), 0) / gradedRows.length
        ).toFixed(2)
      : '—';
  const passingRate =
    gradedRows.length > 0 ? Math.round((passingStudents / gradedRows.length) * 100) : 0;

  const handleScoreChange = (studentId: string, categoryId: string, score: number | null) => {
    setDraftScores((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [categoryId]: score,
      },
    }));
  };

  const handleCancelEdit = () => {
    const initial: Record<string, Record<string, number | null>> = {};
    rows.forEach((r) => {
      initial[r.studentId] = { ...r.scores };
    });
    setDraftScores(initial);
    setIsEditing(false);
    toast.info('Đã hủy các thay đổi chưa lưu.');
  };

  const handleSaveGrades = async () => {
    if (hasInvalidScore) {
      toast.error('Có điểm không hợp lệ! Vui lòng chỉ nhập điểm trong khoảng từ 0 đến 10.');
      return;
    }

    setIsSaving(true);
    try {
      const updates: { studentId: string; categoryId: string; score: number }[] = [];
      Object.entries(draftScores).forEach(([studentId, scoresMap]) => {
        Object.entries(scoresMap).forEach(([categoryId, score]) => {
          if (score !== null && !isNaN(score)) {
            updates.push({ studentId, categoryId, score });
          }
        });
      });

      await onSaveBatch(updates);
      setIsEditing(false);
      toast.success('Bảng điểm đã được cập nhật thành công!');
    } catch {
      toast.error('Không thể lưu bảng điểm. Vui lòng thử lại!');
    } finally {
      setIsSaving(false);
    }
  };

  const renderSortIndicator = (field: GradeSortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="size-3 text-muted-foreground/50 inline-block ml-1" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="size-3 text-primary inline-block ml-1" />
    ) : (
      <ArrowDown className="size-3 text-primary inline-block ml-1" />
    );
  };

  return (
    <div className="space-y-6">
      {/* 3 Compact Analytics Cards */}
      <GradeAnalyticsCards
        totalStudents={totalStudents}
        averageScore={averageClassScore}
        passingStudents={passingStudents}
        passingRate={passingRate}
      />

      {/* Main Grade Matrix Card */}
      <Card className="border border-border/80 bg-card/90 shadow-xs overflow-hidden">
        {/* Controls Toolbar */}
        <TeacherGradesToolbar
          isEditing={isEditing}
          searchTerm={searchTerm}
          categoryCount={sortedCategories.length}
          isSaving={isSaving}
          hasCategoriesHandler={Boolean(onSaveCategories)}
          hasInvalidScore={hasInvalidScore}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setPage(1);
          }}
          onOpenCategories={() => setIsCategoryModalOpen(true)}
          onExportCsv={() => exportGradesToCsv(sortedCategories, rows, className)}
          onStartEdit={() => setIsEditing(true)}
          onCancelEdit={handleCancelEdit}
          onSaveGrades={handleSaveGrades}
        />

        {/* Matrix Table with primary theme accent and sortable headers */}
        <Table>
          <TableHeader className="bg-primary/5 dark:bg-primary/10 border-b border-primary/20">
            <TableRow className="border-b border-primary/20 text-xs font-bold uppercase tracking-wider">
              <TableHead
                className="py-3 px-3 text-center w-14 font-bold text-foreground cursor-pointer select-none hover:bg-primary/10 transition-colors"
                onClick={() => handleSort('index')}
              >
                <span>STT</span>
                {renderSortIndicator('index')}
              </TableHead>
              <TableHead
                className="py-3 px-4 w-28 font-bold text-foreground cursor-pointer select-none hover:bg-primary/10 transition-colors"
                onClick={() => handleSort('code')}
              >
                <span>MSSV</span>
                {renderSortIndicator('code')}
              </TableHead>
              <TableHead
                className="py-3 px-4 min-w-45 font-bold text-foreground cursor-pointer select-none hover:bg-primary/10 transition-colors"
                onClick={() => handleSort('name')}
              >
                <span>Sinh viên</span>
                {renderSortIndicator('name')}
              </TableHead>
              {sortedCategories.map((cat) => (
                <TableHead
                  key={cat.id}
                  className="py-3 px-3 text-center w-28 min-w-25 font-bold text-foreground cursor-pointer select-none hover:bg-primary/10 transition-colors"
                  onClick={() => handleSort(cat.id)}
                >
                  <div className="flex flex-col items-center">
                    <div className="flex items-center">
                      <span className="font-bold text-foreground">{cat.name}</span>
                      {renderSortIndicator(cat.id)}
                    </div>
                    <span className="text-[11px] font-mono text-primary font-semibold">
                      {Math.round(cat.weight > 1 ? cat.weight : cat.weight * 100)}%
                    </span>
                  </div>
                </TableHead>
              ))}
              <TableHead
                className="py-3 px-3 text-center w-28 min-w-25 font-bold text-foreground cursor-pointer select-none hover:bg-primary/10 transition-colors"
                onClick={() => handleSort('finalScore')}
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <span className="font-bold text-primary">Tổng kết</span>
                    {renderSortIndicator('finalScore')}
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">Hệ 10</span>
                </div>
              </TableHead>
              <TableHead className="py-3 px-4 text-center w-36 min-w-32.5 font-bold text-foreground">
                Xếp loại
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5 + sortedCategories.length}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  Không tìm thấy sinh viên nào phù hợp với từ khóa.
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row, idx) => {
                const studentDraft = draftScores[row.studentId] || row.scores;
                const computedScore = calculateFinalScore(sortedCategories, studentDraft);

                return (
                  <GradeMatrixRow
                    key={row.studentId}
                    row={row}
                    categories={sortedCategories}
                    index={(safePage - 1) * ITEMS_PER_PAGE + idx}
                    isEditing={isEditing}
                    draftScores={studentDraft}
                    onScoreChange={handleScoreChange}
                    computedFinalScore={computedScore}
                  />
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <TeacherGradesPagination
          safePage={safePage}
          totalPages={totalPages}
          totalItems={sortedRows.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setPage}
        />
      </Card>

      {/* Category Management Modal */}
      {onSaveCategories && (
        <CategoryManagementModal
          isOpen={isCategoryModalOpen}
          onOpenChange={setIsCategoryModalOpen}
          categories={sortedCategories}
          onSaveCategories={onSaveCategories}
        />
      )}
    </div>
  );
}
