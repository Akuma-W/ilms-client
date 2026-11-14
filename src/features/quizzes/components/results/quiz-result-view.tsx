'use client';

import Link from 'next/link';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuizResultSummaryCard } from './quiz-result-summary-card';
import { QuizResultQuestionItem } from './quiz-result-question-item';
import type { Quiz, QuizAttemptResult } from '@/types/quiz';

interface QuizResultViewProps {
  result: QuizAttemptResult;
  quiz?: Quiz | null;
  onRetake?: () => void;
  retakeUrl?: string;
  backUrl: string;
  backLabel: string;
}

// Complete result and submission audit view for completed quiz attempts
export function QuizResultView({
  result,
  quiz,
  onRetake,
  retakeUrl,
  backUrl,
  backLabel,
}: QuizResultViewProps) {
  const canViewAnswers = result.canViewAnswers !== false;

  // Build question content & options map from quiz definition if available
  const questionMap = new Map(
    (quiz?.questions || []).map((q) => [
      q.id,
      {
        content: q.content,
        options: (q.options || []).map((opt) => ({ id: opt.id, content: opt.content })),
      },
    ])
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
          <Link href={backUrl}>
            <ArrowLeft className="w-4 h-4" />
            <span>{backLabel}</span>
          </Link>
        </Button>

        {retakeUrl ? (
          <Button asChild size="sm" className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
            <Link href={retakeUrl}>
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm lại bài này</span>
            </Link>
          </Button>
        ) : onRetake ? (
          <Button
            type="button"
            size="sm"
            onClick={onRetake}
            className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại bài này</span>
          </Button>
        ) : null}
      </div>

      {/* Summary Score Card */}
      <QuizResultSummaryCard
        result={result}
        quizTitle={quiz?.title}
        totalPoints={quiz?.totalPoints}
      />

      {/* Questions Review Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <h2 className="text-base font-bold text-foreground">Chi tiết từng câu hỏi</h2>
          <span className="text-xs text-muted-foreground">
            {result.details?.length || 0} câu hỏi
          </span>
        </div>

        <div className="space-y-4">
          {(result.details || []).map((detail, idx) => {
            const extra = questionMap.get(detail.questionId);
            return (
              <QuizResultQuestionItem
                key={detail.questionId || idx}
                detail={detail}
                questionNumber={idx + 1}
                questionContent={extra?.content}
                options={extra?.options || []}
                canViewAnswers={canViewAnswers}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
