import { useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { GradeMatrixRow } from './grade-matrix-row';
import { GradeAnalyticsCards } from './grade-analytics-cards';
import { CategoryManagementModal } from './category-management-modal';
import { TeacherGradesToolbar } from './teacher-grades-toolbar';
import { calculateFinalScore } from '../utils/grade.utils';
import { exportGradesToCsv } from '../utils/export.utils';
import type { ClassGradeMatrixRow, GradeCategory } from '@/types/grade';

interface TeacherGradesViewProps {
  categories: GradeCategory[];
  rows: ClassGradeMatrixRow[];
  onSaveBatch: (
    updates: { studentId: string; categoryId: string; score: number }[],
  ) => Promise<void>;
  onSaveCategories?: (
    updated: { id?: string; name: string; weightPercent: number; isDeleted?: boolean }[],
  ) => Promise<void>;
  className?: string;
}

const ITEMS_PER_PAGE = 10;

/**
 * Teacher grade matrix view with compact analytics cards, inline spreadsheet editing,
 * category management modal, CSV export, and stable shadcn Table/Pagination.
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

  // Filter students by search term
  const filteredRows = rows.filter((r) => {
    const nameMatch = r.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const codeMatch = r.studentCode.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || codeMatch;
  });

  const totalPages = Math.ceil(filteredRows.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginatedRows = filteredRows.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  // Overall classroom analytics
  const totalStudents = rows.length;
  const passingStudents = rows.filter((r) => r.finalScore >= 5.0).length;
  const averageClassScore =
    totalStudents > 0
      ? (rows.reduce((sum, r) => sum + r.finalScore, 0) / totalStudents).toFixed(2)
      : '0.00';

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

  return (
    <div className="space-y-6">
      {/* 3 Compact, Vibrant Analytics Cards */}
      <GradeAnalyticsCards
        totalStudents={totalStudents}
        averageScore={averageClassScore}
        passingStudents={passingStudents}
        passingRate={totalStudents > 0 ? Math.round((passingStudents / totalStudents) * 100) : 0}
      />

      {/* Main Grade Matrix Card */}
      <Card className="border border-border/80 bg-card/90 shadow-xs overflow-hidden">
        {/* Controls Toolbar */}
        <TeacherGradesToolbar
          isEditing={isEditing}
          searchTerm={searchTerm}
          categoryCount={categories.length}
          isSaving={isSaving}
          hasCategoriesHandler={Boolean(onSaveCategories)}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setPage(1);
          }}
          onOpenCategories={() => setIsCategoryModalOpen(true)}
          onExportCsv={() => exportGradesToCsv(categories, rows, className)}
          onStartEdit={() => setIsEditing(true)}
          onCancelEdit={handleCancelEdit}
          onSaveGrades={handleSaveGrades}
        />

        {/* Matrix Table with primary theme accent and bold headers */}
        <Table>
          <TableHeader className="bg-primary/5 dark:bg-primary/10 border-b border-primary/20">
            <TableRow className="border-b border-primary/20 text-xs font-bold uppercase tracking-wider">
              <TableHead className="py-3 px-3 text-center w-14 font-bold text-foreground">
                STT
              </TableHead>
              <TableHead className="py-3 px-4 w-28 font-bold text-foreground">MSSV</TableHead>
              <TableHead className="py-3 px-4 min-w-45 font-bold text-foreground">
                Sinh viên
              </TableHead>
              {categories.map((cat) => (
                <TableHead
                  key={cat.id}
                  className="py-3 px-3 text-center w-28 min-w-25 font-bold text-foreground"
                >
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-foreground">{cat.name}</span>
                    <span className="text-[11px] font-mono text-primary font-semibold">
                      {Math.round(cat.weight > 1 ? cat.weight : cat.weight * 100)}%
                    </span>
                  </div>
                </TableHead>
              ))}
              <TableHead className="py-3 px-3 text-center w-28 min-w-25 font-bold text-foreground">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-primary">Tổng kết</span>
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
                  colSpan={5 + categories.length}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  Không tìm thấy sinh viên nào phù hợp với từ khóa.
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row, idx) => {
                const studentDraft = draftScores[row.studentId] || row.scores;
                const computedScore = calculateFinalScore(categories, studentDraft);

                return (
                  <GradeMatrixRow
                    key={row.studentId}
                    row={row}
                    categories={categories}
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
        {totalPages > 1 && (
          <div className="p-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>
              Hiển thị {(safePage - 1) * ITEMS_PER_PAGE + 1} -{' '}
              {Math.min(safePage * ITEMS_PER_PAGE, filteredRows.length)} trên tổng số{' '}
              {filteredRows.length} sinh viên
            </span>
            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (safePage > 1) setPage(safePage - 1);
                    }}
                    className={safePage <= 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === safePage}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(p);
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (safePage < totalPages) setPage(safePage + 1);
                    }}
                    className={safePage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>

      {/* Category Management Modal */}
      {onSaveCategories && (
        <CategoryManagementModal
          isOpen={isCategoryModalOpen}
          onOpenChange={setIsCategoryModalOpen}
          categories={categories}
          onSaveCategories={onSaveCategories}
        />
      )}
    </div>
  );
}
