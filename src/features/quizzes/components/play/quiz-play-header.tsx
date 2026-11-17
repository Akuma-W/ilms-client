'use client';

import { ArrowLeft, Clock, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatTimeRemaining } from '../../utils/quiz-taking.utils';

interface QuizPlayHeaderProps {
  title: string;
  currentIndex: number;
  totalQuestions: number;
  remainingSeconds: number;
  timeLimit: number;
  answeredCount: number;
  accumulatedPoints?: number;
  isImmediate?: boolean;
  onExitClick?: () => void;
  onSubmitClick: () => void;
  isSubmitting?: boolean;
}

export function QuizPlayHeader({
  title,
  currentIndex,
  totalQuestions,
  remainingSeconds,
  timeLimit,
  answeredCount,
  accumulatedPoints,
  isImmediate,
  onExitClick,
  onSubmitClick,
  isSubmitting,
}: QuizPlayHeaderProps) {
  const isTimeLimitActive = timeLimit > 0;
  const isUrgent = isTimeLimitActive && remainingSeconds <= 60 && remainingSeconds > 0;
  const progressPct =
    totalQuestions > 0 ? Math.round(((currentIndex + 1) / totalQuestions) * 100) : 0;

  return (
    <header className="h-16 shrink-0 w-full border-b border-white/10 bg-slate-950/95 backdrop-blur-md z-40">
      <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        {/* Left: Quiz Title & Current Question Indicator */}
        <div className="flex items-center gap-2.5 min-w-0">
          {onExitClick && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onExitClick}
              disabled={isSubmitting}
              className="text-slate-400 hover:text-white hover:bg-white/10 h-8 px-2 shrink-0"
              title="Rời phòng thi"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline ml-1 text-xs">Rời</span>
            </Button>
          )}

          <div className="flex flex-col min-w-0">
            <span className="text-xs text-slate-400 truncate font-medium max-w-44 sm:max-w-xs">
              {title}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                Câu {currentIndex + 1}
                <span className="text-slate-400 font-normal"> / {totalQuestions}</span>
              </span>
              <Badge
                variant="outline"
                className="text-[11px] px-1.5 py-0 border-white/20 bg-white/5 text-slate-300"
              >
                Đã làm {answeredCount}/{totalQuestions}
              </Badge>
              {isImmediate && accumulatedPoints !== undefined && (
                <Badge
                  variant="outline"
                  className="text-[11px] px-1.5 py-0 border-amber-500/30 bg-amber-500/10 text-amber-400 font-bold gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  {Math.round(accumulatedPoints * 100) / 100} đ
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Center: Wall-clock Timer */}
        {isTimeLimitActive && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-colors ${
              isUrgent
                ? 'bg-rose-500/20 text-rose-400 animate-pulse border border-rose-500/40'
                : 'bg-white/10 text-white border border-white/15'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-rose-400' : 'text-slate-400'}`} />
            <span>{formatTimeRemaining(remainingSeconds)}</span>
          </div>
        )}

        {/* Right: Submit Button */}
        <div>
          <Button
            type="button"
            size="sm"
            onClick={onSubmitClick}
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-3.5 h-8 gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nộp bài</span>
          </Button>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full h-1 bg-white/10">
        <div
          className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-rose-500 transition-all duration-300 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </header>
  );
}
