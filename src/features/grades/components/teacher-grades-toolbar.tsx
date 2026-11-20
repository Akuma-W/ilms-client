'use client';

import {
  AlertTriangle,
  Award,
  Check,
  Download,
  Edit3,
  Loader2,
  RotateCcw,
  Search,
  Sparkles,
} from 'lucide-react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TeacherGradesToolbarProps {
  isEditing: boolean;
  searchTerm: string;
  isSaving: boolean;
  isAutoCalculating?: boolean;
  hasInvalidScore?: boolean;
  isArchived?: boolean;
  onSearchChange: (term: string) => void;
  onOpenAttendanceSummary?: () => void;
  onAutoCalculateAll?: () => void;
  onExportCsv: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveGrades: () => void;
}

export function TeacherGradesToolbar({
  isEditing,
  searchTerm,
  isSaving,
  isAutoCalculating = false,
  hasInvalidScore = false,
  isArchived = false,
  onSearchChange,
  onOpenAttendanceSummary,
  onAutoCalculateAll,
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
          {isArchived
            ? 'Lớp học đã được lưu trữ. Bảng điểm ở chế độ chỉ đọc.'
            : isEditing
              ? 'Đang ở chế độ chỉnh sửa điểm trực tiếp. Cột Tổng kết tự động tính toán lại theo thời gian thực.'
              : 'Bảng điểm ở chế độ xem. Bấm vào tiêu đề cột để xem cấu hình hoặc dùng các nút chức năng bên phải.'}
        </CardDescription>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Search Input */}
        <div className="relative w-full sm:w-48 shrink-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Tìm họ tên, MSSV..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8.5 h-9 text-xs rounded-xl"
          />
        </div>

        {/* 1. Nút Thống kê Chuyên cần */}
        {onOpenAttendanceSummary && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenAttendanceSummary}
            className="h-9 text-xs rounded-xl gap-1.5 font-medium border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
            title="Xem báo cáo thống kê chuyên cần và tiến độ 4 thành phần"
          >
            <Award className="size-3.5" />
            <span className="hidden sm:inline">Thống kê Chuyên cần</span>
          </Button>
        )}

        {/* 2. Nút Tính điểm Tự động */}
        {!isArchived && onAutoCalculateAll && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isEditing || isAutoCalculating}
            onClick={onAutoCalculateAll}
            className="h-9 text-xs rounded-xl gap-1.5 font-medium border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
            title="Tự động tính toán và cập nhật toàn bộ các cột điểm tự động (chuyên cần, bài tập, quiz)"
          >
            {isAutoCalculating ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Sparkles className="size-3.5" />
            )}
            <span>{isAutoCalculating ? 'Đang tính...' : 'Tính điểm Tự động'}</span>
          </Button>
        )}

        {/* 3. Nút Xuất CSV */}
        <Button
          variant="outline"
          size="sm"
          onClick={onExportCsv}
          className="h-9 text-xs rounded-xl gap-1.5 font-medium border-border"
          title="Xuất bảng điểm ra file CSV"
        >
          <Download className="size-3.5" />
          <span className="hidden sm:inline">Xuất CSV</span>
        </Button>

        {/* 4. Nút Sửa điểm / Lưu / Hủy */}
        <div className="flex items-center gap-1.5">
          {isArchived ? (
            <span className="text-xs text-muted-foreground italic px-2 py-1">Lớp đã lưu trữ</span>
          ) : !isEditing ? (
            <Button
              variant="default"
              size="sm"
              onClick={onStartEdit}
              className="h-9 text-xs rounded-xl gap-1.5 font-medium shadow-xs"
              title="Chỉnh sửa điểm trực tiếp trên bảng"
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
                title="Hủy bỏ các thay đổi chưa lưu"
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
                title="Lưu lại bảng điểm"
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
