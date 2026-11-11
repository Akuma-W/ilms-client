'use client';

import { AlertTriangle, Check, Download, Edit3, RotateCcw, Search, Sliders } from 'lucide-react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TeacherGradesToolbarProps {
  isEditing: boolean;
  searchTerm: string;
  categoryCount: number;
  isSaving: boolean;
  hasCategoriesHandler: boolean;
  hasInvalidScore?: boolean;
  onSearchChange: (term: string) => void;
  onOpenCategories: () => void;
  onExportCsv: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveGrades: () => void;
}

/**
 * Top control toolbar for teacher grade matrix with search, category modal trigger,
 * CSV export, invalid score guard, and stabilized edit/save button group.
 */
export function TeacherGradesToolbar({
  isEditing,
  searchTerm,
  categoryCount,
  isSaving,
  hasCategoriesHandler,
  hasInvalidScore = false,
  onSearchChange,
  onOpenCategories,
  onExportCsv,
  onStartEdit,
  onCancelEdit,
  onSaveGrades,
}: TeacherGradesToolbarProps) {
  return (
    <CardHeader className="p-4 sm:p-5 border-b border-border/50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <CardTitle className="text-base sm:text-lg font-bold text-foreground">
            Bảng tổng hợp điểm lớp học
          </CardTitle>
          {isEditing && hasInvalidScore && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-md animate-pulse">
              <AlertTriangle className="size-3.5" /> Điểm phải từ 0 đến 10
            </span>
          )}
        </div>
        <CardDescription className="text-xs">
          {isEditing
            ? 'Đang ở chế độ chỉnh sửa điểm trực tiếp. Cột Tổng kết tự động tính toán lại theo thời gian thực.'
            : 'Bảng điểm ở chế độ chỉ đọc. Nhấn "Sửa điểm" để bắt đầu cập nhật.'}
        </CardDescription>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search Input */}
        <div className="relative w-full sm:w-56 shrink-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Tìm họ tên, MSSV..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8.5 h-9 text-xs rounded-xl"
          />
        </div>

        {/* Manage Categories Button */}
        {hasCategoriesHandler && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenCategories}
            className="h-9 text-xs rounded-xl gap-1.5 font-medium border-primary/30 text-primary hover:bg-primary/5"
          >
            <Sliders className="size-3.5" />
            <span>Loại điểm ({categoryCount})</span>
          </Button>
        )}

        {/* Export CSV Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onExportCsv}
          className="h-9 text-xs rounded-xl gap-1.5 font-medium"
        >
          <Download className="size-3.5" />
          <span>Xuất CSV</span>
        </Button>

        {/* Action Buttons: Stabilized group */}
        <div className="flex items-center gap-1.5">
          {!isEditing ? (
            <Button
              variant="default"
              size="sm"
              onClick={onStartEdit}
              className="h-9 text-xs rounded-xl gap-1.5 font-medium shadow-xs"
            >
              <Edit3 className="size-3.5" />
              <span>Sửa điểm</span>
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onCancelEdit}
                disabled={isSaving}
                className="h-9 text-xs rounded-xl gap-1.5 font-medium"
              >
                <RotateCcw className="size-3.5" />
                <span>Hủy</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={onSaveGrades}
                disabled={isSaving || hasInvalidScore}
                className="h-9 text-xs rounded-xl gap-1.5 font-medium shadow-xs bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white"
              >
                <Check className="size-3.5" />
                <span>{isSaving ? 'Đang lưu...' : 'Lưu bảng điểm'}</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </CardHeader>
  );
}
