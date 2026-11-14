'use client';

import { Badge } from '@/components/ui/badge';
import { QuestionType } from '@/types/enum';
import type { QuizTakeQuestion } from '@/types/quiz';

interface QuizPlayCardProps {
  question: QuizTakeQuestion;
  questionNumber: number;
}

export function QuizPlayCard({ question, questionNumber }: QuizPlayCardProps) {
  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case QuestionType.multiple_select:
        return 'Chọn nhiều đáp án';
      case QuestionType.true_false:
        return 'Đúng / Sai';
      case QuestionType.multiple_choice:
      default:
        return '1 đáp án đúng';
    }
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/4 backdrop-blur-md p-6 sm:p-8 shadow-xl transition-all text-center sm:text-left">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Câu {questionNumber}
          </span>
          <Badge variant="outline" className="text-[11px] font-medium border-white/20 bg-white/5 text-slate-300">
            {getQuestionTypeLabel(question.questionType)}
          </Badge>
        </div>
        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
          {question.points} điểm
        </span>
      </div>

      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-snug whitespace-pre-line">
        {question.content}
      </h2>
    </div>
  );
}
