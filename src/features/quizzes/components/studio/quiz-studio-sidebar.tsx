'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ParsedQuestion } from '@/types/quiz';
import { QuestionType } from '@/types/enum';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  GripVertical,
  Calculator,
} from 'lucide-react';
import { ConfirmDeleteModal } from '@/components/common/confirm-delete-modal';

interface QuizStudioSidebarProps {
  questions: ParsedQuestion[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onAddQuestion: () => void;
  onDeleteQuestion: (index: number) => void;
  onMoveQuestion: (fromIndex: number, toIndex: number) => void;
  onResetAllQuestions: () => void;
  onOpenDistributeModal?: () => void;
}

export function QuizStudioSidebar({
  questions,
  selectedIndex,
  onSelectIndex,
  onAddQuestion,
  onDeleteQuestion,
  onMoveQuestion,
  onResetAllQuestions,
  onOpenDistributeModal,
}: QuizStudioSidebarProps) {
  const [showResetAlert, setShowResetAlert] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Helper badge for question types
  const renderMiniTypeBadge = (type: QuestionType) => {
    switch (type) {
      case QuestionType.multiple_select:
        return (
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
            Nhiều ĐA
          </span>
        );
      case QuestionType.true_false:
        return (
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
            Đúng/Sai
          </span>
        );
      default:
        return (
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">1 ĐA</span>
        );
    }
  };

  // Handles drag start
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', String(index));
  };

  // Handles drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  // Handles drag leave
  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  // Handles drop
  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      onMoveQuestion(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <aside className="w-72 sm:w-80 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 flex flex-col h-full overflow-hidden">
      {/* Header with Title & Reset Button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Câu hỏi
          </span>
          <Badge
            variant="secondary"
            className="rounded-sm text-[10px] h-5 px-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            {questions.length}
          </Badge>
        </div>

        {questions.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowResetAlert(true)}
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 h-7 px-2 rounded-sm"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Xóa toàn bộ
          </Button>
        )}
      </div>

      {/* Primary Action Button: Add Question & Distribute Points */}
      <div className="py-3 shrink-0 space-y-1.5">
        <Button
          onClick={onAddQuestion}
          size="sm"
          className="w-full text-sm font-medium h-9 rounded-md bg-rose-600 hover:bg-rose-700 text-white shadow-xs flex items-center justify-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Thêm câu hỏi mới
        </Button>

        {questions.length > 0 && onOpenDistributeModal && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenDistributeModal}
            className="w-full text-xs font-medium h-8 rounded-md border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5"
          >
            <Calculator className="h-3.5 w-3.5 text-rose-600" />
            Chia điểm cho toàn bộ câu
          </Button>
        )}
      </div>

      {/* Scrollable Question Cards List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {questions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Chưa có câu hỏi nào. Bấm nút trên hoặc Import Word để bắt đầu.
          </div>
        ) : (
          questions.map((q, idx) => {
            const isSelected = selectedIndex === idx;
            const isBeingDragged = draggedIndex === idx;
            const isTargeted = dragOverIndex === idx && draggedIndex !== idx;

            return (
              <div
                key={idx}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, idx)}
                onClick={() => onSelectIndex(idx)}
                className={`group p-2.5 rounded-md border text-xs cursor-pointer transition-all ${
                  isBeingDragged ? 'opacity-40' : ''
                } ${isTargeted ? 'border-t-2 border-t-rose-500 scale-[1.01]' : ''} ${
                  isSelected
                    ? 'border-rose-500 bg-white dark:bg-slate-900 shadow-xs ring-1 ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <GripVertical className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 shrink-0 cursor-grab" />
                    <span className="font-bold text-slate-800 dark:text-slate-100 shrink-0">
                      Câu {idx + 1}
                    </span>
                    {renderMiniTypeBadge(q.questionType)}
                  </div>

                  {/* Reorder Up/Down & Delete */}
                  <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveQuestion(idx, idx - 1);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === questions.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveQuestion(idx, idx + 1);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteQuestion(idx);
                      }}
                      className="p-1 text-red-400 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 truncate pl-5">
                  {q.content || 'Nội dung câu hỏi đang soạn...'}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Reset Confirmation Alert Dialog */}
      <ConfirmDeleteModal
        isOpen={showResetAlert}
        onOpenChange={setShowResetAlert}
        title="Xóa toàn bộ câu hỏi?"
        description={`Thao tác này sẽ xóa toàn bộ ${questions.length} câu hỏi đang soạn để làm lại từ đầu.\nThao tác không thể hoàn tác.`}
        deleteLabel="Xác nhận xóa hết"
        onConfirm={() => {
          onResetAllQuestions();
          setShowResetAlert(false);
        }}
      />
    </aside>
  );
}
