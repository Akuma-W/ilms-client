'use client';

import { Check, CheckCircle2, HelpCircle, Lock, X, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OptionInfo {
  id: string;
  content: string;
}

interface QuestionDetail {
  questionId: string;
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  explanation?: string | null;
  selectedOptionIds: string[];
  correctOptionIds: string[];
}

interface QuizResultQuestionItemProps {
  detail: QuestionDetail;
  questionNumber: number;
  questionContent?: string;
  options?: OptionInfo[];
  canViewAnswers?: boolean;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

// Question item view in quiz result report with conditional answer masking
export function QuizResultQuestionItem({
  detail,
  questionNumber,
  questionContent,
  options = [],
  canViewAnswers = true,
}: QuizResultQuestionItemProps) {
  const isCorrect = detail.isCorrect;

  // Masked styling when review is restricted (e.g. after_closed before deadline)
  const containerStyle = !canViewAnswers
    ? 'border-border/60 bg-card/60'
    : isCorrect
      ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10'
      : 'border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/10';

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 transition-all space-y-4 ${containerStyle}`}>
      {/* Question Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Câu {questionNumber}
          </span>
          {!canViewAnswers ? (
            <Badge
              variant="outline"
              className="bg-muted/80 text-muted-foreground border-border/70 text-[11px] gap-1 font-medium"
            >
              <Lock className="w-3 h-3 text-muted-foreground" />
              <span>Đã ghi nhận lựa chọn</span>
            </Badge>
          ) : isCorrect ? (
            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[11px] gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Đúng (+{detail.pointsEarned} đ)
            </Badge>
          ) : (
            <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 text-[11px] gap-1">
              <XCircle className="w-3.5 h-3.5 text-rose-500" />
              Sai (0 / {detail.maxPoints} đ)
            </Badge>
          )}
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {canViewAnswers
            ? `${detail.pointsEarned}/${detail.maxPoints} điểm`
            : `${detail.maxPoints} điểm`}
        </span>
      </div>

      {/* Question Content */}
      <p className="text-sm sm:text-base font-bold text-foreground leading-snug">
        {questionContent || `Câu hỏi #${questionNumber}`}
      </p>

      {/* Options Review Grid */}
      {options.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {options.map((opt, idx) => {
            const letter = OPTION_LETTERS[idx] || `${idx + 1}`;
            const isStudentSelected = detail.selectedOptionIds.includes(opt.id);
            const isSystemCorrect = detail.correctOptionIds.includes(opt.id);

            let optStyle = 'border-border/40 bg-card text-foreground';
            let icon: React.ReactNode = null;

            if (!canViewAnswers) {
              // Neutral student choice history without revealing correctness
              if (isStudentSelected) {
                optStyle =
                  'border-indigo-500/40 bg-indigo-500/10 text-foreground font-semibold ring-1 ring-indigo-500/30';
                icon = (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25"
                  >
                    Lựa chọn của bạn
                  </Badge>
                );
              } else {
                optStyle = 'opacity-60 border-border/40 bg-muted/20 text-muted-foreground';
              }
            } else {
              // Full answer review with correctness feedback
              if (isSystemCorrect && isStudentSelected) {
                optStyle =
                  'border-emerald-500 bg-emerald-500/15 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-500 font-semibold';
                icon = <Check className="w-4 h-4 text-emerald-500 stroke-3" />;
              } else if (isStudentSelected && !isSystemCorrect) {
                optStyle =
                  'border-rose-500 bg-rose-500/15 text-rose-950 dark:text-rose-100 ring-1 ring-rose-500 font-semibold';
                icon = <X className="w-4 h-4 text-rose-500 stroke-3" />;
              } else if (isSystemCorrect && !isStudentSelected) {
                optStyle =
                  'border-emerald-500 border-dashed bg-emerald-500/5 text-emerald-800 dark:text-emerald-300 font-medium';
                icon = <Check className="w-4 h-4 text-emerald-500" />;
              } else {
                optStyle = 'opacity-60 border-border/40 bg-muted/20 text-muted-foreground';
              }
            }

            return (
              <div
                key={opt.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-2.5 text-xs sm:text-sm ${optStyle}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-muted text-foreground flex items-center justify-center font-bold text-xs shrink-0">
                    {letter}
                  </span>
                  <span className="wrap-break-word font-medium">{opt.content}</span>
                </div>
                <div className="shrink-0">{icon}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Answer Masking Notice */}
      {!canViewAnswers && (
        <div className="p-3 rounded-xl bg-muted/30 border border-border/50 text-xs text-muted-foreground flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span>
            Đáp án chính thức và điểm số chi tiết sẽ được công bố sau khi đợt thi kết thúc.
          </span>
        </div>
      )}

      {/* Explanation Box */}
      {canViewAnswers && detail.explanation && (
        <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 text-xs text-foreground/90 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-indigo-500">
            <HelpCircle className="w-4 h-4" />
            <span>Giải thích đáp án:</span>
          </div>
          <p className="leading-relaxed pl-5 text-muted-foreground">{detail.explanation}</p>
        </div>
      )}
    </div>
  );
}
