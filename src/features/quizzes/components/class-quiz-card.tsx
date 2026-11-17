'use client';

import {
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  HelpCircle,
  MoreVertical,
  Pencil,
  Play,
  Trash2,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getQuizDisplayStatus, getQuizTimeRowText } from '../utils/quiz.utils';
import type { QuizClassItem } from '@/types/quiz';

interface ClassQuizCardProps {
  quiz: QuizClassItem;
  classId: string;
  isTeacher?: boolean;
  isArchived?: boolean;
  onViewStats?: (quiz: QuizClassItem) => void;
  onEditPublication?: (quiz: QuizClassItem) => void;
  onUnpublish?: (quizId: string) => void;
}

export function ClassQuizCard({
  quiz,
  classId,
  isTeacher = false,
  isArchived = false,
  onViewStats,
  onEditPublication,
  onUnpublish,
}: ClassQuizCardProps) {
  const displayStatus = getQuizDisplayStatus(quiz);
  const timeRowText = getQuizTimeRowText(quiz);
  const scoreAchieved = quiz.currentUserAttempt?.score;

  // Determine badge styling based on status
  const getStatusBadge = () => {
    if (isTeacher) {
      if (displayStatus === 'upcoming') {
        return (
          <Badge
            variant="outline"
            className="text-xs px-2.5 py-0.5 bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30 gap-1 font-semibold"
          >
            <Clock className="size-3" />
            <span>Sắp mở</span>
          </Badge>
        );
      }
      if (displayStatus === 'not_submitted_closed' || displayStatus === 'submitted_closed') {
        return (
          <Badge
            variant="outline"
            className="text-xs px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-muted-foreground border-slate-300 dark:border-slate-700 font-semibold"
          >
            <span>Đã đóng</span>
          </Badge>
        );
      }
      return (
        <Badge className="text-xs px-2.5 py-0.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 gap-1 font-semibold">
          <Play className="size-3" />
          <span>Đang mở</span>
        </Badge>
      );
    }

    switch (displayStatus) {
      case 'submitted_open':
      case 'submitted_closed':
        return (
          <Badge className="text-xs px-2.5 py-0.5 bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-500/30 gap-1 font-semibold">
            <CheckCircle2 className="size-3.5" />
            <span>
              Đã làm:{' '}
              {scoreAchieved !== null ? `${scoreAchieved}/${quiz.totalPoints ?? 10}` : 'Đã nộp'}
            </span>
          </Badge>
        );

      case 'not_submitted_open':
        return (
          <Badge className="text-xs px-2.5 py-0.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 gap-1 font-semibold">
            <Play className="size-3" />
            <span>Đang mở</span>
          </Badge>
        );

      case 'upcoming':
        return (
          <Badge
            variant="outline"
            className="text-xs px-2.5 py-0.5 bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30 gap-1 font-semibold"
          >
            <Clock className="size-3" />
            <span>Sắp mở</span>
          </Badge>
        );

      case 'not_submitted_closed':
        return (
          <Badge
            variant="outline"
            className="text-xs px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-muted-foreground border-slate-300 dark:border-slate-700 font-medium"
          >
            <span>Quá hạn</span>
          </Badge>
        );
    }
  };

  return (
    <Card className="rounded-xl border border-rose-200/80 dark:border-rose-900/50 bg-linear-to-br from-card via-card to-rose-50/70 dark:to-rose-950/30 hover:border-rose-400/80 dark:hover:border-rose-500/60 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between relative group">
      {/* Top Gradient Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-rose-500 via-pink-500 to-amber-500 opacity-85" />

      <CardContent className="p-3 sm:p-3.5 pt-3.5 sm:pt-4 space-y-2.5">
        {/* Top Meta: Topic Badge + Status Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            {quiz.topicName && (
              <Badge
                variant="outline"
                className="text-[11px] px-2 py-0.5 bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25 font-medium max-w-48 sm:max-w-60 justify-start inline-flex items-center"
                title={quiz.topicName}
              >
                <span className="truncate text-left block w-full">{quiz.topicName}</span>
              </Badge>
            )}
            {getStatusBadge()}
          </div>

          {/* Teacher Actions Dropdown */}
          {isTeacher && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 rounded-md text-muted-foreground hover:text-foreground shrink-0"
                >
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs">
                {onViewStats && (
                  <DropdownMenuItem
                    onClick={() => onViewStats(quiz)}
                    className="gap-2 cursor-pointer font-medium"
                  >
                    <BarChart3 className="size-3.5 text-primary" />
                    <span>Thống kê kết quả lớp</span>
                  </DropdownMenuItem>
                )}
                {onEditPublication && (
                  <DropdownMenuItem
                    onClick={() => onEditPublication(quiz)}
                    className="gap-2 cursor-pointer font-medium"
                  >
                    <Calendar className="size-3.5 text-indigo-500" />
                    <span>Chỉnh sửa đợt thi</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild className="gap-2 cursor-pointer font-medium">
                  <Link href={`/quizzes/${quiz.id}/edit`}>
                    <Pencil className="size-3.5" />
                    <span>Sửa đề thi gốc</span>
                  </Link>
                </DropdownMenuItem>
                {onUnpublish && (
                  <DropdownMenuItem
                    onClick={() => onUnpublish(quiz.publicationId)}
                    className="text-rose-600 focus:text-rose-600 gap-2 cursor-pointer font-medium"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Gỡ khỏi lớp học</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Quiz Title & Description */}
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug line-clamp-2">
            {quiz.title}
          </h3>
          {quiz.description && (
            <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2">
              {quiz.description}
            </p>
          )}
        </div>

        {/* Core Parameters Row */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 pt-0.5 text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-1">
            <Clock className="size-3.5 text-primary shrink-0" />
            <span>{quiz.timeLimit} phút</span>
          </div>

          <div className="flex items-center gap-1">
            <HelpCircle className="size-3.5 text-primary shrink-0" />
            <span>{quiz.questionCount ?? quiz.totalQuestions ?? '—'} câu</span>
          </div>

          <div className="flex items-center gap-1">
            <Award className="size-3.5 text-amber-500 shrink-0" />
            <span>Thang {quiz.totalPoints ? quiz.totalPoints : 10} điểm</span>
          </div>
        </div>

        {/* Participant Count: Visible for BOTH Students and Teachers */}
        {quiz.submittedCount !== undefined && quiz.totalStudents !== undefined && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium pt-0.5">
            <Users className="size-3.5 text-primary/80 shrink-0" />
            <span>
              <strong className="text-foreground">{quiz.submittedCount}</strong>/
              {quiz.totalStudents} bạn đã nộp
            </span>
          </div>
        )}

        {/* Standardized 4-State Time Row */}
        <div className="p-2 rounded-lg bg-card/85 dark:bg-card/50 border border-rose-200/60 dark:border-rose-900/40 flex items-center gap-2 text-xs font-medium text-foreground/90 shadow-2xs">
          <Calendar className="size-3.5 text-rose-500 shrink-0" />
          <span className="truncate">{timeRowText}</span>
        </div>
      </CardContent>

      {/* Card Footer Actions */}
      <div className="px-3 pb-3 pt-2 border-t border-rose-100/80 dark:border-rose-950/50 bg-rose-500/2 dark:bg-rose-500/3 flex items-center justify-between gap-2">
        {isTeacher ? (
          <div className="flex items-center justify-between w-full gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 px-3.5 text-sm font-semibold rounded-xl gap-1.5 w-full sm:w-auto"
            >
              <Link href={`/classes/${classId}/quizzes/${quiz.publicationId}`}>
                <BarChart3 className="size-4 text-primary" />
                <span>Xem thống kê lớp</span>
              </Link>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              asChild
              className="h-9 px-3 text-sm font-semibold rounded-xl gap-1.5 text-muted-foreground hover:text-foreground hidden sm:inline-flex"
            >
              <Link href={`/quizzes/${quiz.id}`}>
                <span>Chi tiết đề</span>
                <ExternalLink className="size-3.5" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="w-full">
            {displayStatus === 'submitted_open' || displayStatus === 'submitted_closed' ? (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full h-9 text-sm font-semibold rounded-xl gap-1.5"
              >
                <Link href={`/classes/${classId}/quizzes/${quiz.publicationId}`}>
                  <CheckCircle2 className="size-4 text-violet-500" />
                  <span>Xem chi tiết & kết quả</span>
                </Link>
              </Button>
            ) : displayStatus === 'not_submitted_open' ? (
              isArchived ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="w-full h-9 text-sm font-semibold rounded-xl opacity-60"
                >
                  Lớp học đã lưu trữ
                </Button>
              ) : (
                <Button
                  size="sm"
                  asChild
                  className="w-full h-9 text-sm font-semibold rounded-xl gap-1.5 shadow-xs bg-rose-600 hover:bg-rose-700 text-white"
                >
                  <Link href={`/classes/${classId}/quizzes/${quiz.publicationId}`}>
                    <Play className="size-4 fill-white" />
                    <span>Vào làm bài kiểm tra</span>
                  </Link>
                </Button>
              )
            ) : displayStatus === 'upcoming' ? (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="w-full h-9 text-sm font-semibold rounded-xl opacity-60"
              >
                Chưa đến thời gian làm bài
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="w-full h-9 text-sm font-semibold rounded-xl opacity-60"
              >
                Đã quá hạn nộp bài
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
