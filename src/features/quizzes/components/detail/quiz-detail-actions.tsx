'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Quiz } from '@/types/quiz';
import { Play, Share2, Edit, Copy, ArrowLeft } from 'lucide-react';

interface QuizDetailActionsProps {
  quiz: Quiz;
  isOwner: boolean;
  canPublish: boolean;
  onOpenPublishModal: () => void;
  onCloneQuiz: () => void;
}

export function QuizDetailActions({
  quiz,
  isOwner,
  canPublish,
  onOpenPublishModal,
  onCloneQuiz,
}: QuizDetailActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xs">
      {/* Back button */}
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="text-sm font-medium h-9 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Link href="/quizzes" className="flex items-center gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          Quay lại kho đề
        </Link>
      </Button>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Practice Quiz */}
        <Button
          asChild
          size="sm"
          className="text-sm font-medium h-9 rounded-md bg-rose-600 hover:bg-rose-700 text-white shadow-xs flex items-center gap-1.5"
        >
          <Link href={`/quizzes/${quiz.id}/take`}>
            <Play className="h-4 w-4 fill-white" />
            Làm bài thử
          </Link>
        </Button>

        {/* Publish to Class (Teacher or Admin) */}
        {canPublish && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenPublishModal}
            className="text-sm font-medium h-9 rounded-md border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-1.5"
          >
            <Share2 className="h-4 w-4 text-indigo-600" />
            Xuất bản vào lớp
          </Button>
        )}

        {/* Edit Quiz (Owner only) */}
        {isOwner && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="text-sm font-medium h-9 rounded-md border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
          >
            <Link href={`/quizzes/${quiz.id}/edit`}>
              <Edit className="h-4 w-4 text-blue-500" />
              Chỉnh sửa đề
            </Link>
          </Button>
        )}

        {/* Clone Quiz (When viewing other's public quiz) */}
        {!isOwner && quiz.visibility === 'public' && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCloneQuiz}
            className="text-sm font-medium h-9 rounded-md border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
          >
            <Copy className="h-4 w-4 text-indigo-500" />
            Sao chép về kho
          </Button>
        )}
      </div>
    </div>
  );
}
