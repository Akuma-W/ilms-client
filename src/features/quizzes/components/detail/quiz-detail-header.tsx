'use client';

import { Badge } from '@/components/ui/badge';
import type { Quiz } from '@/types/quiz';
import { Clock, HelpCircle, User, Globe, Lock } from 'lucide-react';

interface QuizDetailHeaderProps {
  quiz: Quiz;
  isOwner: boolean;
}

export function QuizDetailHeader({ quiz, isOwner }: QuizDetailHeaderProps) {
  const questionCount = quiz.questions?.length ?? quiz.totalQuestions ?? 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xs overflow-hidden">
      {/* Top Rose Accent Bar */}
      <div className="h-1.5 w-full bg-linear-to-r from-rose-500 via-pink-500 to-indigo-500" />

      <div className="p-6 sm:p-8 space-y-4">
        {/* Badges & Status */}
        <div className="flex flex-wrap items-center gap-2">
          {quiz.visibility === 'public' ? (
            <Badge
              variant="outline"
              className="rounded-sm text-xs bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800 flex items-center gap-1"
            >
              <Globe className="h-3 w-3" />
              Đề thi công khai
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="rounded-sm text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 flex items-center gap-1"
            >
              <Lock className="h-3 w-3" />
              Đề thi riêng tư
            </Badge>
          )}

          {isOwner && quiz.status === 'draft' && (
            <Badge
              variant="outline"
              className="rounded-sm text-xs bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800"
            >
              Bản nháp (Chưa xuất bản)
            </Badge>
          )}
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {quiz.title}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {quiz.description || 'Chưa có mô tả chi tiết cho bài thi này.'}
          </p>
        </div>

        {/* Metadata Strip */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="h-4 w-4 text-rose-500" />
            Thời gian:{' '}
            <span className="text-slate-800 dark:text-slate-200">{quiz.timeLimit} phút</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <HelpCircle className="h-4 w-4 text-indigo-500" />
            Số câu hỏi:{' '}
            <span className="text-slate-800 dark:text-slate-200">{questionCount} câu</span>
          </div>

          {quiz.creator && (
            <div className="flex items-center gap-1.5 font-medium">
              <User className="h-4 w-4 text-slate-400" />
              Tác giả:{' '}
              <span className="text-slate-800 dark:text-slate-200">{quiz.creator.fullName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
