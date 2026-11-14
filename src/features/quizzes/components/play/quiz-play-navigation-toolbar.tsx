'use client';

import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Send, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CheckedAnswerResult } from '@/types/quiz';

interface QuizPlayNavigationToolbarProps {
  currentIndex: number;
  totalQuestions: number;
  isImmediate: boolean;
  isLastQuestion: boolean;
  isSubmitting: boolean;
  isCheckingAnswer: boolean;
  hasSelectedOptions: boolean;
  currentCheckedResult: CheckedAnswerResult | null;
  accumulatedPoints?: number;
  onPrev: () => void;
  onNext: () => void;
  onCheckAnswer: () => void;
  onSubmit: () => void;
}

export function QuizPlayNavigationToolbar({
  currentIndex,
  isImmediate,
  isLastQuestion,
  isSubmitting,
  isCheckingAnswer,
  hasSelectedOptions,
  currentCheckedResult,
  accumulatedPoints = 0,
  onPrev,
  onNext,
  onCheckAnswer,
  onSubmit,
}: QuizPlayNavigationToolbarProps) {
  return (
    <div className="w-full h-20 shrink-0 border-t border-white/10 bg-slate-950/95 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between gap-4 z-40">
      {/* Back button */}
      <div>
        {!isImmediate && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={currentIndex === 0 || isSubmitting}
            onClick={onPrev}
            className="gap-2 text-sm font-semibold h-11 px-5 rounded-xl border-white/20 bg-white/5 hover:bg-white/10 text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Câu trước</span>
          </Button>
        )}
      </div>

      {/* Immediate mode accumulated points indicator */}
      {isImmediate && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Điểm tích lũy: {accumulatedPoints} đ</span>
        </div>
      )}

      {/* Action / Next / Submit button */}
      <div>
        {isImmediate ? (
          !currentCheckedResult ? (
            <Button
              type="button"
              size="lg"
              disabled={!hasSelectedOptions || isCheckingAnswer}
              onClick={onCheckAnswer}
              className="gap-2 text-sm font-bold h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
            >
              {isCheckingAnswer ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang kiểm tra...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kiểm tra đáp án</span>
                </>
              )}
            </Button>
          ) : isLastQuestion ? (
            <Button
              type="button"
              size="lg"
              disabled={isSubmitting}
              onClick={onSubmit}
              className="gap-2 text-sm font-bold h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang nộp...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Hoàn thành & Xem kết quả</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              size="lg"
              onClick={onNext}
              className="gap-2 text-sm font-bold h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
            >
              <span>Câu tiếp theo</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )
        ) : isLastQuestion ? (
          <Button
            type="button"
            size="lg"
            disabled={isSubmitting}
            onClick={onSubmit}
            className="gap-2 text-sm font-bold h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
          >
            <Send className="w-4 h-4" />
            <span>Nộp bài thi</span>
          </Button>
        ) : (
          <Button
            type="button"
            size="lg"
            onClick={onNext}
            className="gap-2 text-sm font-bold h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
          >
            <span>Câu tiếp theo</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
