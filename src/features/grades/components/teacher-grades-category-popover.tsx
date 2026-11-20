'use client';

import useSWR from 'swr';
import { Settings2, RefreshCw, Award, ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { assignmentsService } from '@/features/assignments/services/assignments.service';
import { quizPublicationsService } from '@/features/quizzes/services/quiz-publications.service';
import type { GradeCategory } from '@/types/grade';

interface TeacherGradesCategoryPopoverProps {
  cat: GradeCategory;
  classId?: string;
  isArchived?: boolean;
  onConfigureColumn?: (category: GradeCategory) => void;
  onColumnSync?: (categoryId: string) => void;
  onColumnAttendance?: (categoryId: string) => void;
  onSort?: (categoryId: string) => void;
}

export function TeacherGradesCategoryPopover({
  cat,
  classId,
  isArchived = false,
  onConfigureColumn,
  onColumnSync,
  onColumnAttendance,
  onSort,
}: TeacherGradesCategoryPopoverProps) {
  const { data: assignments = [] } = useSWR(
    classId ? `classes/${classId}/assignments-mini` : null,
    () => assignmentsService.getAssignments(classId!),
    { revalidateOnFocus: false },
  );
  const { data: quizzes = [] } = useSWR(
    classId ? `classes/${classId}/quizzes-mini` : null,
    () => quizPublicationsService.getClassPublications(classId!),
    { revalidateOnFocus: false },
  );

  const getMechanismTitle = (category: GradeCategory) => {
    switch (category.sourceType) {
      case 'attendance':
        return 'Loại 1: Điểm chuyên cần';
      case 'assignment':
      case 'quiz':
        return 'Loại 2: Điểm theo bài tập & quiz';
      default:
        return 'Loại 3: Nhập tay thủ công';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="w-full flex flex-col items-center gap-0.5 p-1 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer text-center group"
          title="Nhấn để xem và sửa cấu hình điểm cột này"
        >
          <span className="truncate max-w-28 text-foreground font-semibold group-hover:text-primary transition-colors">
            {cat.name}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-muted-foreground font-normal">
              {Math.round(cat.weight > 1 ? cat.weight : cat.weight * 100)}%
            </span>
            {cat.sourceType === 'attendance' && (
              <span className="text-[9px] px-1 py-0 rounded font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400">
                Chuyên cần
              </span>
            )}
            {(cat.sourceType === 'assignment' || cat.sourceType === 'quiz') && (
              <span className="text-[9px] px-1 py-0 rounded font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
                Theo bài
              </span>
            )}
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent align="center" className="w-72 p-3.5 space-y-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-foreground text-sm truncate">{cat.name}</h5>
            <Badge variant="secondary" className="text-xs font-mono font-bold">
              {Math.round(cat.weight > 1 ? cat.weight : cat.weight * 100)}%
            </Badge>
          </div>
          <Badge
            variant="outline"
            className={`text-[10px] font-semibold ${
              cat.sourceType === 'attendance'
                ? 'border-purple-500/30 text-purple-600 bg-purple-500/10'
                : cat.sourceType === 'assignment' || cat.sourceType === 'quiz'
                  ? 'border-blue-500/30 text-blue-600 bg-blue-500/10'
                  : 'border-border text-muted-foreground'
            }`}
          >
            {getMechanismTitle(cat)}
          </Badge>
        </div>

        {/* Visual Configuration Breakdown */}
        {cat.sourceType === 'attendance' ? (
          <div className="space-y-1.5 p-2 rounded-lg bg-muted/40 border border-border/60">
            <span className="text-[10px] font-bold text-foreground block">
              Chi tiết các trụ cột tính điểm:
            </span>
            {(() => {
              const cfg =
                (cat.config as {
                  pillars?: {
                    meetings?: { weight?: number; minRate?: number };
                    materials?: { weight?: number; minRate?: number };
                    assignments?: { weight?: number; minRate?: number };
                    quizzes?: { weight?: number; minRate?: number };
                  };
                  thresholds?: {
                    meeting?: { minRate?: number };
                    material?: { minRate?: number };
                    assignment?: { minRate?: number };
                    quiz?: { minRate?: number };
                  };
                }) || {};
              const p = cfg.pillars;
              const t = cfg.thresholds;

              const pillarsList = [
                {
                  label: '1. Buổi học / Họp',
                  weight: Math.round((p?.meetings?.weight ?? 0.25) * 100),
                  thresh: p?.meetings?.minRate ?? t?.meeting?.minRate ?? 0,
                  unit: 'buổi',
                },
                {
                  label: '2. Bài giảng',
                  weight: Math.round((p?.materials?.weight ?? 0.25) * 100),
                  thresh: p?.materials?.minRate ?? t?.material?.minRate ?? 0,
                  unit: 'bài',
                },
                {
                  label: '3. Bài tập',
                  weight: Math.round((p?.assignments?.weight ?? 0.25) * 100),
                  thresh: p?.assignments?.minRate ?? t?.assignment?.minRate ?? 0,
                  unit: 'bài',
                },
                {
                  label: '4. Trắc nghiệm (Quiz)',
                  weight: Math.round((p?.quizzes?.weight ?? 0.25) * 100),
                  thresh: p?.quizzes?.minRate ?? t?.quiz?.minRate ?? 0,
                  unit: 'bài',
                },
              ];

              const activePillars = pillarsList.filter((item) => item.weight > 0);

              if (activePillars.length === 0) {
                return (
                  <p className="text-[11px] text-muted-foreground italic">
                    Chưa thiết lập trọng số các trụ cột chuyên cần.
                  </p>
                );
              }

              return (
                <div className="space-y-1 text-[11px]">
                  {activePillars.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between text-muted-foreground"
                    >
                      <span>{item.label}:</span>
                      <span className="font-medium text-foreground">
                        {item.weight}%{' '}
                        {item.thresh > 0 ? `(Ngưỡng ${item.thresh} ${item.unit})` : '(Toàn bộ)'}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        ) : cat.sourceType === 'assignment' || cat.sourceType === 'quiz' ? (
          <div className="space-y-1.5 p-2 rounded-lg bg-muted/40 border border-border/60">
            {(() => {
              const cfg =
                (cat.config as {
                  strategy?: string;
                  thresholdCount?: number;
                  items?: Array<{ id: string; type: string; title?: string }>;
                }) || {};
              const isHighest = cfg.strategy === 'highest';
              const isThreshold = cfg.strategy === 'threshold';
              const items =
                cfg.items || (cat.sourceId ? [{ id: cat.sourceId, type: cat.sourceType }] : []);
              const itemCount = items.length;
              return (
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Chiến lược tính:</span>
                    <span className="font-semibold text-primary">
                      {isHighest
                        ? 'Lấy điểm cao nhất'
                        : isThreshold
                          ? 'Đạt ngưỡng số bài'
                          : 'Trung bình cộng'}
                    </span>
                  </div>
                  {isThreshold && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Ngưỡng đạt đủ điểm:</span>
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        {cfg.thresholdCount || itemCount} / {itemCount} bài
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Số bài liên kết:</span>
                    <span className="font-semibold text-foreground">
                      {itemCount > 0 ? `${itemCount} bài` : 'Chưa chọn bài'}
                    </span>
                  </div>
                  {itemCount > 0 ? (
                    <div className="pt-1 border-t border-border/40 space-y-1">
                      <span className="text-[10px] font-semibold text-muted-foreground block">
                        Các bài được tính:
                      </span>
                      <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                        {items.map((i, idx) => {
                          const resolvedTitle =
                            i.title ||
                            (i.type === 'quiz'
                              ? quizzes.find((q) => q.publicationId === i.id || q.id === i.id)
                                  ?.title
                              : assignments.find((a) => a.id === i.id)?.title) ||
                            (i.type === 'quiz' ? 'Bài kiểm tra trắc nghiệm' : 'Bài tập quá trình');

                          return (
                            <div
                              key={i.id || idx}
                              className="flex items-center gap-1.5 text-[10px] text-foreground truncate"
                            >
                              <Badge
                                variant="secondary"
                                className={`text-[9px] px-1 py-0 font-medium ${
                                  i.type === 'quiz'
                                    ? 'bg-purple-500/10 text-purple-600'
                                    : 'bg-blue-500/10 text-blue-600'
                                }`}
                              >
                                {i.type === 'quiz' ? 'Quiz' : 'Bài tập'}
                              </Badge>
                              <span className="truncate" title={resolvedTitle}>
                                {resolvedTitle}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-amber-500 italic pt-0.5">
                      Nhấn &quot;Đồng bộ&quot; hoặc &quot;Sửa cấu hình&quot; để chọn các bài liên
                      kết.
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="p-2 rounded-lg bg-muted/40 border border-border/60 text-[11px] text-muted-foreground">
            Giảng viên chấm trực tiếp hoặc chỉnh sửa điểm thủ công trên ô điểm của từng sinh viên.
          </div>
        )}

        {!isArchived && (
          <div className="pt-2 border-t border-border/60 flex items-center gap-2">
            {onSort && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onSort(cat.id)}
                className="h-8 text-xs px-2 gap-1 text-muted-foreground hover:text-foreground"
                title="Sắp xếp danh sách sinh viên theo cột điểm này"
              >
                <ArrowUpDown className="size-3.5" />
                <span>Sort</span>
              </Button>
            )}

            {onConfigureColumn && (
              <Button
                type="button"
                size="sm"
                variant="default"
                onClick={() => onConfigureColumn(cat)}
                className="flex-1 h-8 text-xs gap-1.5 font-medium"
              >
                <Settings2 className="size-3.5" />
                <span>Sửa cấu hình điểm</span>
              </Button>
            )}

            {cat.sourceType === 'attendance' && onColumnAttendance && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onColumnAttendance(cat.id)}
                className="h-8 text-xs px-2.5 gap-1 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
                title="Tính điểm chuyên cần cho cột này"
              >
                <Award className="size-3.5" />
              </Button>
            )}

            {(cat.sourceType === 'assignment' || cat.sourceType === 'quiz') && onColumnSync && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onColumnSync(cat.id)}
                className="h-8 text-xs px-2.5 gap-1 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10"
                title="Đồng bộ điểm cho cột này"
              >
                <RefreshCw className="size-3.5" />
              </Button>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
