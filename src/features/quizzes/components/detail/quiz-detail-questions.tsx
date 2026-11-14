'use client';

import { Badge } from '@/components/ui/badge';
import type { Question } from '@/types/quiz';
import { QuestionType } from '@/types/enum';
import { CheckCircle2, HelpCircle } from 'lucide-react';

interface QuizDetailQuestionsProps {
  questions: Question[];
  isOwner: boolean;
}

export function QuizDetailQuestions({ questions, isOwner }: QuizDetailQuestionsProps) {
  // Helper to render question type badge
  const renderQuestionTypeBadge = (type: QuestionType) => {
    switch (type) {
      case QuestionType.multiple_select:
        return (
          <Badge
            variant="secondary"
            className="rounded-sm text-xs bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
          >
            Nhiều đáp án
          </Badge>
        );
      case QuestionType.true_false:
        return (
          <Badge
            variant="secondary"
            className="rounded-sm text-xs bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
          >
            Đúng / Sai
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="rounded-sm text-xs bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
          >
            1 đáp án
          </Badge>
        );
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="py-12 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-md bg-white dark:bg-slate-900 p-6 space-y-2">
        <HelpCircle className="h-8 w-8 text-slate-400 mx-auto" />
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Đề thi này chưa có câu hỏi nào
        </h4>
        <p className="text-xs text-slate-500">
          {isOwner
            ? 'Hãy bấm nút "Chỉnh sửa đề" để soạn thêm câu hỏi hoặc nhập từ file Word mẫu.'
            : 'Tác giả đang biên soạn câu hỏi cho bài thi này.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          Danh sách câu hỏi ({questions.length})
        </h3>
        {!isOwner && (
          <span className="text-xs text-slate-400 italic">
            * Đáp án đúng và lời giải thích đã được ẩn để bảo mật đề thi
          </span>
        )}
      </div>

      <div className="space-y-4">
        {questions.map((question, idx) => (
          <div
            key={question.id || idx}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xs space-y-3.5"
          >
            {/* Question Header */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Câu {idx + 1}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  ({question.points || 1.0} điểm)
                </span>
              </div>
              {renderQuestionTypeBadge(question.questionType)}
            </div>

            {/* Question Content */}
            <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
              {question.content}
            </p>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {question.options?.map((option, optIdx) => {
                const isCorrect = isOwner && option.isCorrect;
                return (
                  <div
                    key={option.id || optIdx}
                    className={`p-3 rounded-md border text-xs flex items-center justify-between transition-colors ${
                      isCorrect
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-medium'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span>{option.content}</span>
                    </span>
                    {isCorrect && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Explanation box (Owner only) */}
            {isOwner && question.explanation && (
              <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-md text-xs text-amber-900 dark:text-amber-200 space-y-0.5">
                <span className="font-semibold block">Lời giải thích:</span>
                <p className="leading-relaxed">{question.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
