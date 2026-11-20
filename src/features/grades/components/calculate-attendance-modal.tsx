'use client';

import { useState, useEffect } from 'react';
import { Loader2, Sparkles, Settings, ShieldCheck } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { AttendancePillarItem } from './attendance-pillar-item';
import { AttendancePresetsBar } from './attendance-presets-bar';
import { gradeCalculationsService } from '../services/grade-calculations.service';
import { gradeCategoriesService } from '../services/grade-categories.service';
import { meetingsService } from '@/features/meetings/services/meetings.service';
import { materialsService } from '@/features/materials/services/materials.service';
import { assignmentsService } from '@/features/assignments/services/assignments.service';
import { quizPublicationsService } from '@/features/quizzes/services/quiz-publications.service';
import type { GradeCategory } from '@/types/grade';

interface CalculateAttendanceModalProps {
  classId: string;
  categories: GradeCategory[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  defaultCategoryId?: string;
  onChangeCalculationType?: () => void;
}

export function CalculateAttendanceModal({
  classId,
  categories,
  isOpen,
  onOpenChange,
  onSuccess,
  defaultCategoryId,
  onChangeCalculationType,
}: CalculateAttendanceModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [meetingWeight, setMeetingWeight] = useState(25);
  const [materialWeight, setMaterialWeight] = useState(25);
  const [assignmentWeight, setAssignmentWeight] = useState(25);
  const [quizWeight, setQuizWeight] = useState(25);
  const [meetingThreshold, setMeetingThreshold] = useState(4);
  const [materialThreshold, setMaterialThreshold] = useState(8);
  const [assignmentThreshold, setAssignmentThreshold] = useState(3);
  const [quizThreshold, setQuizThreshold] = useState(2);
  const [preserveOverrides, setPreserveOverrides] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totals, setTotals] = useState({ meetings: 0, materials: 0, assignments: 0, quizzes: 0 });

  useEffect(() => {
    if (!isOpen || !classId) return;
    void Promise.all([
      meetingsService
        .getClassMeetings(classId)
        .then((m) => setTotals((prev) => ({ ...prev, meetings: m.length })))
        .catch(() => {}),
      materialsService
        .getAllMaterialsWithTopic(classId)
        .then((r) => setTotals((prev) => ({ ...prev, materials: r.materials.length })))
        .catch(() => {}),
      assignmentsService
        .getAssignments(classId)
        .then((a) => setTotals((prev) => ({ ...prev, assignments: a.length })))
        .catch(() => {}),
      quizPublicationsService
        .getClassPublications(classId)
        .then((q) => setTotals((prev) => ({ ...prev, quizzes: q.length })))
        .catch(() => {}),
    ]);
  }, [isOpen, classId]);

  useEffect(() => {
    if (isOpen) {
      if (defaultCategoryId && categories.some((c) => c.id === defaultCategoryId)) {
        setSelectedCategoryId(defaultCategoryId);
      } else {
        const fallback = categories.find((c) => c.sourceType === 'attendance') || categories[0];
        if (fallback) {
          setSelectedCategoryId(fallback.id);
        }
      }
    } else {
      setSelectedCategoryId('');
    }
  }, [isOpen, defaultCategoryId, categories]);

  useEffect(() => {
    if (isOpen && selectedCategoryId) {
      const target = categories.find((c) => c.id === selectedCategoryId);
      if (target) {
        const config = target.config as {
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
        } | null;

        if (config?.pillars) {
          const p = config.pillars;
          setMeetingWeight(Math.round((p.meetings?.weight ?? 0.25) * 100));
          setMaterialWeight(Math.round((p.materials?.weight ?? 0.25) * 100));
          setAssignmentWeight(Math.round((p.assignments?.weight ?? 0.25) * 100));
          setQuizWeight(Math.round((p.quizzes?.weight ?? 0.25) * 100));

          if (p.meetings?.minRate !== undefined) setMeetingThreshold(p.meetings.minRate);
          if (p.materials?.minRate !== undefined) setMaterialThreshold(p.materials.minRate);
          if (p.assignments?.minRate !== undefined) setAssignmentThreshold(p.assignments.minRate);
          if (p.quizzes?.minRate !== undefined) setQuizThreshold(p.quizzes.minRate);
        } else if (config?.thresholds) {
          const t = config.thresholds;
          if (t.meeting?.minRate !== undefined) setMeetingThreshold(t.meeting.minRate);
          if (t.material?.minRate !== undefined) setMaterialThreshold(t.material.minRate);
          if (t.assignment?.minRate !== undefined) setAssignmentThreshold(t.assignment.minRate);
          if (t.quiz?.minRate !== undefined) setQuizThreshold(t.quiz.minRate);
        }
      }
    }
  }, [isOpen, selectedCategoryId, categories]);

  const targetCategory = categories.find((c) => c.id === selectedCategoryId);
  const totalWeight = meetingWeight + materialWeight + assignmentWeight + quizWeight;
  const isBalanced = totalWeight === 100;

  const applyPreset = (meet: number, mat: number, assign: number, quiz: number) => {
    setMeetingWeight(meet);
    setMaterialWeight(mat);
    setAssignmentWeight(assign);
    setQuizWeight(quiz);
  };

  const handleCalculate = async () => {
    if (!selectedCategoryId) {
      toast.error('Vui lòng chọn cột điểm áp dụng!');
      return;
    }
    if (!isBalanced) {
      toast.error('Tổng trọng số các hoạt động đánh giá phải đạt chính xác 100%!');
      return;
    }

    try {
      setIsSubmitting(true);
      await gradeCategoriesService.updateCategory(classId, selectedCategoryId, {
        sourceType: 'attendance',
        config: {
          strategy: 'attendance_threshold',
          pillars: {
            meetings: {
              weight: meetingWeight / 100,
              minRate: meetingWeight > 0 ? meetingThreshold : 0,
            },
            materials: {
              weight: materialWeight / 100,
              minRate: materialWeight > 0 ? materialThreshold : 0,
            },
            assignments: {
              weight: assignmentWeight / 100,
              minRate: assignmentWeight > 0 ? assignmentThreshold : 0,
            },
            quizzes: {
              weight: quizWeight / 100,
              minRate: quizWeight > 0 ? quizThreshold : 0,
            },
          },
        },
      });

      const res = await gradeCalculationsService.calculateAttendance(classId, {
        categoryId: selectedCategoryId,
        meetingWeight: meetingWeight / 100,
        materialWeight: materialWeight / 100,
        assignmentWeight: assignmentWeight / 100,
        quizWeight: quizWeight / 100,
        meetingThreshold: meetingWeight > 0 ? meetingThreshold : 0,
        materialThreshold: materialWeight > 0 ? materialThreshold : 0,
        assignmentThreshold: assignmentWeight > 0 ? assignmentThreshold : 0,
        quizThreshold: quizWeight > 0 ? quizThreshold : 0,
        preserveOverrides,
      });

      toast.success(res.message || 'Tính điểm đánh giá chuyên cần thành công!', {
        description: 'Điểm số của sinh viên đã được tự động tính và cập nhật vào bảng điểm.',
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi tính điểm chuyên cần');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130 border-border bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Sparkles className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-foreground">
                  Cấu hình Điểm Chuyên cần ({targetCategory?.name || 'Chuyên cần'})
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Thiết lập trọng số (0.0 - 1.0) và ngưỡng đạt tối đa cho 4 thành phần.
                </DialogDescription>
              </div>
            </div>

            {onChangeCalculationType && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onChangeCalculationType();
                }}
                className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground shrink-0 border-border"
                title="Chuyển sang Quản lý Cột điểm để đổi cách tính"
              >
                <Settings className="size-3.5" />
                <span className="hidden sm:inline">Đổi loại tính điểm</span>
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Quick Presets */}
          <AttendancePresetsBar
            totalWeight={totalWeight}
            isBalanced={isBalanced}
            onApplyPreset={applyPreset}
          />

          {/* 4 Pillars Matrix with Conditional Thresholds */}
          <div className="space-y-2.5">
            <AttendancePillarItem
              label="1. Buổi học / Họp trực tuyến"
              unit="buổi"
              weight={meetingWeight}
              threshold={meetingThreshold}
              totalCount={totals.meetings}
              onWeightChange={setMeetingWeight}
              onThresholdChange={setMeetingThreshold}
            />
            <AttendancePillarItem
              label="2. Đọc và nghiên cứu bài giảng"
              unit="bài"
              weight={materialWeight}
              threshold={materialThreshold}
              totalCount={totals.materials}
              onWeightChange={setMaterialWeight}
              onThresholdChange={setMaterialThreshold}
            />
            <AttendancePillarItem
              label="3. Hoàn thành bài tập quá trình"
              unit="bài"
              weight={assignmentWeight}
              threshold={assignmentThreshold}
              totalCount={totals.assignments}
              onWeightChange={setAssignmentWeight}
              onThresholdChange={setAssignmentThreshold}
            />
            <AttendancePillarItem
              label="4. Làm bài kiểm tra trắc nghiệm (Quiz)"
              unit="bài"
              weight={quizWeight}
              threshold={quizThreshold}
              totalCount={totals.quizzes}
              onWeightChange={setQuizWeight}
              onThresholdChange={setQuizThreshold}
            />
          </div>

          {/* Preserve overrides option */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-muted/30">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-500" />
                <Label
                  htmlFor="preserve-overrides-switch"
                  className="text-xs font-semibold text-foreground"
                >
                  Bảo lưu điểm đã sửa tay
                </Label>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Giữ nguyên điểm các sinh viên đã được giảng viên nhập thủ công trước đó.
              </p>
            </div>
            <Switch
              id="preserve-overrides-switch"
              checked={preserveOverrides}
              onCheckedChange={setPreserveOverrides}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="text-xs h-9 rounded-xl border-border"
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleCalculate}
            disabled={isSubmitting || !isBalanced}
            className="text-xs h-9 rounded-xl gap-1.5 font-medium shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Đang tính toán...</span>
              </>
            ) : (
              <>
                <Sparkles className="size-3.5" />
                <span>Áp dụng Điểm Chuyên cần</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
