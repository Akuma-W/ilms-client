'use client';

import useSWR from 'swr';
import { Layers, AlertCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { gradebookService } from '../services/gradebook.service';
import type { GradeCategoryBreakdown } from '@/types/grade';
import { cn } from '@/lib/utils';

interface GradeBreakdownModalProps {
  classId: string;
  categoryId: string;
  categoryName: string;
  studentId?: string;
  studentName?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GradeBreakdownModal({
  classId,
  categoryId,
  categoryName,
  studentId,
  studentName,
  isOpen,
  onOpenChange,
}: GradeBreakdownModalProps) {
  const { data = null, isLoading } = useSWR<GradeCategoryBreakdown | null>(
    isOpen && classId && categoryId
      ? `classes/${classId}/categories/${categoryId}/breakdown/${studentId || 'class'}`
      : null,
    () => gradebookService.getGradeBreakdown(classId, categoryId, studentId),
    { revalidateOnFocus: false },
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 border-border bg-card">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Layers className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-foreground">
                Phân rã Điểm Thành phần
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {categoryName} {studentName ? `• ${studentName}` : ''}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="size-6 animate-spin text-purple-500" />
            <p className="text-xs">Đang tải chi tiết các bài thành phần...</p>
          </div>
        ) : !data ? (
          <div className="py-10 text-center text-muted-foreground">
            <AlertCircle className="size-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">Chưa có dữ liệu bài thành phần</p>
            <p className="text-xs mt-1">
              Cột điểm này có thể chưa được cấu hình hoặc hệ thống chưa đồng bộ.
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {/* Score summary banner */}
            <div className="p-3.5 rounded-xl border border-border bg-muted/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                  Chiến lược tính toán
                </span>
                <p className="text-xs font-medium text-foreground capitalize mt-0.5">
                  {data.strategy === 'manual'
                    ? 'Nhập tay bởi Giảng viên'
                    : data.strategy.replace('_', ' ')}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                  Điểm tổng kết cột
                </span>
                <p
                  className={cn(
                    'text-base font-black',
                    data.isOverridden
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-purple-600 dark:text-purple-400',
                  )}
                >
                  {data.finalScore !== null && data.finalScore !== undefined
                    ? data.finalScore.toFixed(2)
                    : '--'}
                </p>
              </div>
            </div>

            {/* Override alert if applicable */}
            {data.isOverridden && (
              <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200 text-xs space-y-2">
                <div className="flex items-center justify-between font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                    <span>Điểm đã được Giảng viên điều chỉnh trực tiếp</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-amber-500/20 text-[11px]">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">
                      Điểm tính toán từ hệ thống:
                    </span>
                    <span className="font-semibold text-foreground">
                      {data.rawScore !== null && data.rawScore !== undefined
                        ? `${Number(data.rawScore).toFixed(2)} đ`
                        : 'Chưa có'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">
                      Điểm Giảng viên nhập áp dụng:
                    </span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {data.overrideScore !== null && data.overrideScore !== undefined
                        ? `${Number(data.overrideScore).toFixed(2)} đ`
                        : `${Number(data.finalScore).toFixed(2)} đ`}
                    </span>
                  </div>
                </div>
                {data.overrideReason && (
                  <p className="text-[11px] text-muted-foreground italic">
                    Ghi chú: &quot;{data.overrideReason}&quot;
                  </p>
                )}
              </div>
            )}

            {/* Component Items List */}
            {data.items.length > 0 ? (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-foreground">
                  Danh sách các bài cấu thành ({data.items.length} bài)
                </span>
                <div className="divide-y divide-border/60 rounded-xl border border-border overflow-hidden">
                  {data.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-card flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 uppercase">
                            {item.type === 'meeting'
                              ? 'Buổi học'
                              : item.type === 'material'
                                ? 'Bài giảng'
                                : item.type === 'assignment'
                                  ? 'Bài tập'
                                  : item.type === 'quiz'
                                    ? 'Quiz'
                                    : item.type === 'manual'
                                      ? 'Nhập tay'
                                      : item.type}
                          </Badge>
                          <p className="font-medium text-foreground truncate">{item.title}</p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          {item.rate !== undefined && item.rate !== null && (
                            <span>Tiến độ: {Math.round(item.rate)}%</span>
                          )}
                          {item.weight !== undefined && (
                            <span>
                              • Trọng số:{' '}
                              {Math.round(item.weight > 1 ? item.weight : item.weight * 100)}%
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div>
                          <span className="font-bold text-foreground">
                            {item.score !== null && item.score !== undefined
                              ? item.score.toFixed(2)
                              : '--'}
                          </span>
                          <span className="text-muted-foreground text-[10px]">
                            {' '}
                            / {item.maxScore}
                          </span>
                        </div>
                        {item.score !== null &&
                          item.score !== undefined &&
                          item.weight !== undefined &&
                          item.type !== 'manual' && (
                            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                              Đóng góp:{' '}
                              {(
                                item.score * (item.weight > 1 ? item.weight / 100 : item.weight)
                              ).toFixed(2)}{' '}
                              đ
                            </p>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-border/80 bg-muted/20 text-center text-xs text-muted-foreground">
                Cột điểm này được Giảng viên nhập trực tiếp trên bảng điểm hoặc chưa chọn bài
                tập/quiz liên kết.
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
