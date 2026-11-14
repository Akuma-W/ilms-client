'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Download, Upload, Clock, Loader2, Calculator } from 'lucide-react';

interface QuizStudioHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  timeLimit: number;
  onTimeLimitChange: (minutes: number) => void;
  onSave: () => void;
  isSaving: boolean;
  onOpenWordModal: () => void;
  onOpenDistributeModal?: () => void;
  totalQuestions?: number;
  totalPoints?: number;
}

// Fixed top header for quiz studio creator
export function QuizStudioHeader({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  timeLimit,
  onTimeLimitChange,
  onSave,
  isSaving,
  onOpenWordModal,
  onOpenDistributeModal,
  totalQuestions,
  totalPoints,
}: QuizStudioHeaderProps) {
  return (
    <header className="shrink-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2.5 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Back button & Title input */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            asChild
            variant="ghost"
            size="icon"
            title="Quay lại kho đề"
            className="h-8 w-8 rounded-sm shrink-0 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <Link href="/quizzes">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Quay lại kho đề</span>
            </Link>
          </Button>

          <div className="hidden xl:flex items-center gap-1 text-xs text-slate-400 shrink-0 font-medium border-r border-slate-200 dark:border-slate-800 pr-3 mr-1">
            <Link href="/classes" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
              Lớp học
            </Link>
            <span>/</span>
            <Link href="/chats" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
              Chat
            </Link>
            <span>/</span>
            <Link href="/quizzes" className="text-slate-700 dark:text-slate-200 font-semibold">
              Studio
            </Link>
          </div>

          <div className="flex-1 min-w-0 space-y-0.5">
            <Input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Nhập tên đề thi trắc nghiệm..."
              className="text-base sm:text-lg font-bold border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-rose-500 rounded-md h-9 px-2 bg-transparent text-slate-900 dark:text-white"
            />
            <Input
              type="text"
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              placeholder="Mô tả đề thi (không bắt buộc)"
              aria-label="Mô tả đề thi"
              className="h-7 border-transparent bg-transparent px-2 text-xs text-slate-600 hover:border-slate-300 dark:text-slate-400 dark:hover:border-slate-700"
            />
          </div>
        </div>

        {/* Right: Controls & Action buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Question & Score Meter */}
          {totalQuestions !== undefined && (
            <button
              type="button"
              onClick={onOpenDistributeModal}
              title="Nhấn để chia đều điểm hoặc sửa điểm từng câu"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 rounded-md border border-slate-200 hover:border-rose-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <Calculator className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
              <span className="text-rose-600 dark:text-rose-400 font-bold">{totalQuestions} câu</span>
              <span>•</span>
              <span>{(totalPoints ?? 0).toFixed(1)} điểm</span>
              <span className="text-[10px] text-slate-400 font-normal underline ml-0.5">Chia điểm</span>
            </button>
          )}

          {/* Time Limit Setting */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 text-xs">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <input
              type="number"
              min={1}
              max={300}
              value={timeLimit}
              onChange={(e) =>
                onTimeLimitChange(Math.min(300, Math.max(1, parseInt(e.target.value, 10) || 15)))
              }
              className="w-10 bg-transparent text-center font-bold text-slate-900 dark:text-white focus:outline-none"
            />
            <span className="text-slate-500">phút</span>
          </div>

          {/* Download Template Button */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-sm font-medium h-9 rounded-md border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <a href="/templates/quiz_template.docx" download="quiz_template.docx">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Tải mẫu
            </a>
          </Button>

          {/* Word Import Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenWordModal}
            className="text-sm font-medium h-9 rounded-md border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30"
          >
            <Upload className="h-3.5 w-3.5 mr-1.5 text-purple-600" />
            Import Word
          </Button>

          {/* Save Button */}
          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="text-sm font-medium h-9 rounded-md bg-rose-600 hover:bg-rose-700 text-white shadow-xs px-4"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1.5" />
                Lưu đề thi
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
