'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, Loader2, Filter, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { gradeCalculationsService } from '../services/grade-calculations.service';
import { gradeCategoriesService } from '../services/grade-categories.service';
import { assignmentsService } from '@/features/assignments/services/assignments.service';
import { quizPublicationsService } from '@/features/quizzes/services/quiz-publications.service';
import { SyncGradesItemPicker } from './sync-grades-item-picker';
import { SyncGradesStrategySelector } from './sync-grades-strategy-selector';
import type { GradeCategory } from '@/types/grade';
import type { Assignment } from '@/types/assignment';
import type { QuizClassItem } from '@/types/quiz';

interface SyncGradesModalProps {
  classId: string;
  categories: GradeCategory[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  defaultCategoryId?: string;
  onChangeCalculationType?: () => void;
}

export function SyncGradesModal({
  classId,
  categories,
  isOpen,
  onOpenChange,
  onSuccess,
  defaultCategoryId,
  onChangeCalculationType,
}: SyncGradesModalProps) {
  const eligibleCategories = categories.filter(
    (c) => c.sourceType === 'assignment' || c.sourceType === 'quiz' || c.sourceType === 'manual',
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<QuizClassItem[]>([]);

  // Selection state
  const [selectedItems, setSelectedItems] = useState<
    Array<{ id: string; type: 'assignment' | 'quiz'; title?: string }>
  >([]);
  const [strategy, setStrategy] = useState<'average' | 'highest' | 'threshold'>('average');
  const [thresholdCount, setThresholdCount] = useState<number>(1);

  useEffect(() => {
    if (isOpen) {
      const fallbackId =
        categories.find(
          (c) =>
            c.sourceType === 'assignment' || c.sourceType === 'quiz' || c.sourceType === 'manual',
        )?.id || '';
      const targetId = defaultCategoryId || fallbackId;
      setSelectedCategoryId(targetId);

      if (classId) {
        assignmentsService
          .getAssignments(classId)
          .then(setAssignments)
          .catch(() => {});
        quizPublicationsService
          .getClassPublications(classId)
          .then(setQuizzes)
          .catch(() => {});
      }
    }
  }, [isOpen, defaultCategoryId, classId, categories]);

  // Load existing configuration when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      const cat = categories.find((c) => c.id === selectedCategoryId);
      if (cat) {
        const config =
          (cat.config as {
            items?: Array<{ id: string; type: 'assignment' | 'quiz'; title?: string }>;
            strategy?: 'average' | 'highest' | 'threshold';
            thresholdCount?: number;
          }) || {};

        if (config.items && config.items.length > 0) {
          setSelectedItems(config.items);
        } else if (cat.sourceId) {
          const type = cat.sourceType === 'quiz' ? 'quiz' : 'assignment';
          setSelectedItems([{ id: cat.sourceId, type }]);
        } else {
          setSelectedItems([]);
        }
        setStrategy(
          config.strategy === 'highest'
            ? 'highest'
            : config.strategy === 'threshold'
              ? 'threshold'
              : 'average',
        );
        setThresholdCount(config.thresholdCount || config.items?.length || 1);
      }
    }
  }, [selectedCategoryId, categories]);

  const toggleItem = (id: string, type: 'assignment' | 'quiz', title?: string) => {
    setSelectedItems((prev) => {
      const exists = prev.some((item) => item.id === id);
      if (exists) {
        return prev.filter((item) => item.id !== id);
      }
      return [...prev, { id, type, title }];
    });
  };

  const handleSelectAll = () => {
    const allAssignments = assignments.map((a) => ({
      id: a.id,
      type: 'assignment' as const,
      title: a.title,
    }));
    const allQuizzes = quizzes.map((q) => ({
      id: q.publicationId || q.id,
      type: 'quiz' as const,
      title: q.title,
    }));
    setSelectedItems([...allAssignments, ...allQuizzes]);
  };

  const handleDeselectAll = () => setSelectedItems([]);

  const handleSync = async () => {
    if (!selectedCategoryId) {
      toast.error('Vui lòng chọn cột điểm cần đồng bộ!');
      return;
    }
    const targetCat = categories.find((c) => c.id === selectedCategoryId);
    if (!targetCat) return;

    try {
      setIsSubmitting(true);
      const primaryType =
        selectedItems.some((i) => i.type === 'quiz') &&
        !selectedItems.some((i) => i.type === 'assignment')
          ? 'quiz'
          : 'assignment';

      await gradeCategoriesService.updateCategory(classId, targetCat.id, {
        sourceType: primaryType,
        sourceId: selectedItems.length === 1 ? selectedItems[0].id : undefined,
        config: {
          items: selectedItems,
          strategy,
          ...(strategy === 'threshold' && { thresholdCount }),
        },
      });

      const res = await gradeCalculationsService.syncGrades(classId, {
        categoryId: selectedCategoryId,
      });

      const strategyLabel =
        strategy === 'highest'
          ? 'lấy điểm cao nhất'
          : strategy === 'threshold'
            ? `đạt ngưỡng (${thresholdCount} bài)`
            : 'trung bình cộng';

      toast.success(res.message || 'Đồng bộ điểm thành công!', {
        description: `Đã tính điểm ${strategyLabel} từ ${selectedItems.length} bài.`,
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi đồng bộ điểm');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-140 border-border bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <RefreshCw className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-foreground">
                Đồng bộ Điểm Theo Bài
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Tổng hợp điểm tự động từ các bài tập và bài trắc nghiệm Quiz được chọn.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Target Column Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="target-category" className="text-xs font-semibold text-foreground">
                Chọn cột điểm cần đồng bộ
              </Label>
              {onChangeCalculationType && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    onChangeCalculationType();
                  }}
                  className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium"
                >
                  <Settings2 className="size-3" />
                  <span>Đổi loại tính điểm</span>
                </button>
              )}
            </div>
            <select
              id="target-category"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              disabled={isSubmitting}
              className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            >
              {eligibleCategories.length === 0 ? (
                <option value="">Không có cột điểm nào khả dụng</option>
              ) : (
                eligibleCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({Math.round(cat.weight > 1 ? cat.weight : cat.weight * 100)}%) - [
                    {cat.sourceType === 'assignment' || cat.sourceType === 'quiz'
                      ? 'Loại 2: Theo bài'
                      : 'Loại 3: Nhập tay'}
                    ]
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Detailed configuration when a column is chosen */}
          {Boolean(selectedCategoryId) && (
            <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-3.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Filter className="size-3.5 text-blue-500" />
                <span>Nguồn dữ liệu & Chiến lược tính điểm</span>
              </div>

              {/* Item Checkbox Picker */}
              <SyncGradesItemPicker
                assignments={assignments}
                quizzes={quizzes}
                selectedItems={selectedItems}
                onToggleItem={toggleItem}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
              />

              {/* Strategy Selector */}
              <SyncGradesStrategySelector
                strategy={strategy}
                setStrategy={setStrategy}
                thresholdCount={thresholdCount}
                setThresholdCount={setThresholdCount}
                itemCount={selectedItems.length}
              />
            </div>
          )}
        </div>

        <DialogFooter className="pt-2 gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSync}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Đang đồng bộ...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4" />
                <span>Bắt đầu đồng bộ</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
