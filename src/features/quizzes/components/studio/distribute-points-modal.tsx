'use client';

import { useState } from 'react';
import { Calculator, Check, Scale } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { QuestionType } from '@/types/enum';
import type { ParsedQuestion } from '@/types/quiz';

interface DistributePointsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  questions: ParsedQuestion[];
  onApplyPoints: (updatedPoints: number[]) => void;
}

function DistributePointsDialogBody({
  onOpenChange,
  questions,
  onApplyPoints,
}: Omit<DistributePointsModalProps, 'isOpen'>) {
  const [pointsList, setPointsList] = useState<number[]>(() =>
    questions.map((q) => (typeof q.points === 'number' ? q.points : 1.0)),
  );
  const [targetTotal, setTargetTotal] = useState<number>(() => {
    const sum = questions.reduce(
      (acc, q) => acc + (typeof q.points === 'number' ? q.points : 1.0),
      0,
    );
    return sum > 0 ? Number(sum.toFixed(2)) : 10.0;
  });

  // Distributes target score evenly across all questions
  const handleDistributeEvenly = (customTarget?: number) => {
    if (questions.length === 0) return;
    const total = customTarget !== undefined ? customTarget : targetTotal;
    const rawPerQuestion = total / questions.length;
    const rounded = Number(rawPerQuestion.toFixed(2));

    const nextPoints = questions.map(() => rounded);
    setPointsList(nextPoints);
  };

  // Updates single question point
  const handlePointChange = (idx: number, val: number) => {
    setPointsList((prev) => {
      const next = [...prev];
      next[idx] = Math.max(0, Number(val.toFixed(2)) || 0);
      return next;
    });
  };

  // Helper badge for question types
  const renderTypeBadge = (type: QuestionType) => {
    switch (type) {
      case QuestionType.multiple_select:
        return (
          <Badge
            variant="outline"
            className="text-[11px] font-medium border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/30"
          >
            Nhiều ĐA
          </Badge>
        );
      case QuestionType.true_false:
        return (
          <Badge
            variant="outline"
            className="text-[11px] font-medium border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30"
          >
            Đúng / Sai
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="text-[11px] font-medium border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30"
          >
            1 ĐA đúng
          </Badge>
        );
    }
  };

  const currentSum = pointsList.reduce((sum, p) => sum + p, 0);

  const handleApply = () => {
    onApplyPoints(pointsList);
    onOpenChange(false);
  };

  return (
    <DialogContent className="sm:max-w-xl rounded-md border border-slate-200 dark:border-slate-800 p-6">
      <DialogHeader>
        <DialogTitle className="text-base font-bold flex items-center gap-2">
          <Calculator className="w-5 h-5 text-rose-600" />
          Chia điểm cho toàn bộ câu hỏi
        </DialogTitle>
        <DialogDescription className="text-xs text-slate-500">
          Phân bổ đều điểm số theo thang điểm mong muốn hoặc điều chỉnh điểm chi tiết cho từng câu
          hỏi.
        </DialogDescription>
      </DialogHeader>

      {/* Top Controls: Target Total & Auto Distribute Button */}
      <div className="space-y-3 pt-2">
        <div className="p-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Tổng điểm mong muốn cho đề thi
            </span>
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                step="0.5"
                min="1"
                max="1000"
                value={targetTotal}
                onChange={(e) => setTargetTotal(Math.max(0.5, parseFloat(e.target.value) || 10))}
                className="w-24 h-8 text-sm font-bold text-center rounded-sm bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
              />
              <span className="text-xs text-slate-500">điểm</span>

              {/* Quick Scale Presets */}
              <div className="flex items-center gap-1 ml-2">
                <button
                  type="button"
                  onClick={() => {
                    setTargetTotal(10);
                    handleDistributeEvenly(10);
                  }}
                  className="text-[11px] px-2 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 font-medium text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Thang 10
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTargetTotal(100);
                    handleDistributeEvenly(100);
                  }}
                  className="text-[11px] px-2 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 font-medium text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Thang 100
                </button>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => handleDistributeEvenly()}
            className="text-xs h-8 rounded-md bg-rose-600 hover:bg-rose-700 text-white shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5" />
            Chia đều cho {questions.length} câu
          </Button>
        </div>

        {/* Questions Point Table */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden">
          <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
            <span className="w-20">Câu số</span>
            <span className="flex-1 text-center sm:text-left">Loại câu hỏi</span>
            <span className="w-28 text-right">Điểm số</span>
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {questions.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Đề thi chưa có câu hỏi nào để chia điểm.
              </div>
            ) : (
              questions.map((q, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <span className="w-20 font-bold text-slate-800 dark:text-slate-200">
                    Câu {idx + 1}
                  </span>
                  <div className="flex-1 text-center sm:text-left">
                    {renderTypeBadge(q.questionType)}
                  </div>
                  <div className="w-28 flex items-center justify-end gap-1.5">
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={pointsList[idx] ?? 1.0}
                      onChange={(e) => handlePointChange(idx, parseFloat(e.target.value))}
                      className="w-18 h-7 text-xs font-semibold text-center rounded-sm border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                    <span className="text-[11px] text-slate-400">đ</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Table Summary Footer */}
          <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Tổng cộng:{' '}
              <strong className="text-slate-800 dark:text-slate-100">{questions.length} câu</strong>
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Tổng điểm:{' '}
              <strong className="text-rose-600 dark:text-rose-400 text-sm">
                {currentSum.toFixed(2)}
              </strong>{' '}
              / {targetTotal} điểm
            </span>
          </div>
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-slate-200 dark:border-slate-800">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onOpenChange(false)}
          className="text-xs rounded-md"
        >
          Hủy bỏ
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleApply}
          className="text-xs rounded-md bg-rose-600 hover:bg-rose-700 text-white shadow-xs flex items-center gap-1.5"
        >
          <Check className="w-3.5 h-3.5" />
          Áp dụng thang điểm
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export function DistributePointsModal({
  isOpen,
  onOpenChange,
  questions,
  onApplyPoints,
}: DistributePointsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {isOpen && (
        <DistributePointsDialogBody
          onOpenChange={onOpenChange}
          questions={questions}
          onApplyPoints={onApplyPoints}
        />
      )}
    </Dialog>
  );
}
