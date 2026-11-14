'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Quiz } from '@/types/quiz';
import {
  Clock,
  HelpCircle,
  MoreVertical,
  Edit,
  Eye,
  Copy,
  Trash2,
  Lock,
  Globe,
  User,
  PlayCircle,
} from 'lucide-react';

interface QuizRepositoryCardProps {
  quiz: Quiz;
  isOwner: boolean;
  onClone?: (quiz: Quiz) => void;
  onDelete?: (quiz: Quiz) => void;
}

// Status badge config
const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  draft: {
    label: 'Bản nháp',
    className:
      'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  published: {
    label: 'Đã xuất bản',
    className:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
};

export function QuizRepositoryCard({ quiz, isOwner, onClone, onDelete }: QuizRepositoryCardProps) {
  const questionCount = quiz.totalQuestions ?? quiz.questions?.length ?? 0;
  const attemptCount = quiz.attemptCount ?? quiz.attempts?.length ?? 0;
  const hasAttemptCount = quiz.attemptCount !== undefined || quiz.attempts !== undefined;
  const statusBadge = isOwner && quiz.status !== 'published' ? STATUS_BADGE[quiz.status] : null;

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xs hover:shadow-md hover:border-rose-300/70 dark:hover:border-rose-500/40 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Top Accent Gradient Bar — Rose → Pink → Indigo */}
      <div className="h-1 w-full bg-linear-to-r from-rose-500 via-pink-500 to-indigo-500 shrink-0" />

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        {/* Row 1: Badges + Action Menu */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {quiz.visibility === 'public' ? (
              <Badge
                variant="outline"
                className="rounded-sm text-xs bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800 flex items-center gap-1"
              >
                <Globe className="h-3 w-3" />
                Công khai
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="rounded-sm text-xs bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 flex items-center gap-1"
              >
                <Lock className="h-3 w-3" />
                Riêng tư
              </Badge>
            )}

            {statusBadge && (
              <Badge variant="outline" className={`rounded-sm text-xs ${statusBadge.className}`}>
                {statusBadge.label}
              </Badge>
            )}
          </div>

          {/* Action Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Tùy chọn đề thi</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 rounded-md border border-slate-200 dark:border-slate-800 shadow-xs"
            >
              <DropdownMenuItem asChild className="text-sm cursor-pointer">
                <Link href={`/quizzes/${quiz.id}`} className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-slate-400" />
                  Xem chi tiết
                </Link>
              </DropdownMenuItem>

              {isOwner && (
                <DropdownMenuItem asChild className="text-sm cursor-pointer">
                  <Link href={`/quizzes/${quiz.id}/edit`} className="flex items-center gap-2">
                    <Edit className="h-4 w-4 text-blue-500" />
                    Chỉnh sửa đề
                  </Link>
                </DropdownMenuItem>
              )}

              {!isOwner && onClone && (
                <DropdownMenuItem
                  onClick={() => onClone(quiz)}
                  className="text-sm cursor-pointer flex items-center gap-2"
                >
                  <Copy className="h-4 w-4 text-indigo-500" />
                  Sao chép về kho
                </DropdownMenuItem>
              )}

              {isOwner && onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(quiz)}
                    className="text-sm cursor-pointer text-red-600 dark:text-red-400 flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Xóa đề thi
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Row 2: Title + Description */}
        <div className="flex-1 space-y-1.5">
          <Link href={`/quizzes/${quiz.id}`} className="block group/title">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover/title:text-rose-600 dark:group-hover/title:text-rose-400 transition-colors line-clamp-2 leading-snug">
              {quiz.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {quiz.description || 'Chưa có mô tả chi tiết cho đề thi này.'}
          </p>
        </div>

        {/* Row 3: Metadata Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          {/* Stats: time + questions + attempts */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 shrink-0">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {quiz.timeLimit} phút
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              {questionCount} câu
            </span>
            {hasAttemptCount && (
              <span className="flex items-center gap-1 shrink-0 text-indigo-500 dark:text-indigo-400 font-medium">
                <PlayCircle className="h-3.5 w-3.5" />
                {attemptCount} lượt
              </span>
            )}
          </div>

          {/* Creator */}
          {quiz.creator && (
            <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300 truncate max-w-30 shrink-0">
              <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{quiz.creator.fullName}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
