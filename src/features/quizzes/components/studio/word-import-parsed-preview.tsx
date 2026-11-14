'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ParsedQuestion, ParsedQuizDocx } from '@/types/quiz';
import { QuestionType } from '@/types/enum';
import { CheckCircle2, Clock, FileText } from 'lucide-react';

interface ParsedPreviewProps {
  parsedResult: ParsedQuizDocx;
  selectedIndices: Set<number>;
  onToggle: (idx: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onTypeChange: (idx: number, type: QuestionType) => void;
}

// Badge color mapping for question types
function QuestionTypeBadge({ type }: { type: QuestionType }) {
  const configs: Record<QuestionType, { label: string; className: string }> = {
    multiple_select: {
      label: 'Nhiều đáp án',
      className:
        'rounded-sm text-xs bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
    },
    true_false: {
      label: 'Đúng / Sai',
      className:
        'rounded-sm text-xs bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    },
    multiple_choice: {
      label: '1 đáp án',
      className:
        'rounded-sm text-xs bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    },
  };
  const cfg = configs[type] ?? configs.multiple_choice;
  return (
    <Badge variant="secondary" className={cfg.className}>
      {cfg.label}
    </Badge>
  );
}

export function WordImportParsedPreview({
  parsedResult,
  selectedIndices,
  onToggle,
  onSelectAll,
  onDeselectAll,
  onTypeChange,
}: ParsedPreviewProps) {
  const total = parsedResult.questions.length;
  const allSelected = selectedIndices.size === total;

  return (
    <div className="flex-1 min-h-0 space-y-3 my-1">
      {/* Metadata banner */}
      {(parsedResult.title || parsedResult.timeLimit || parsedResult.description) && (
        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-md space-y-1.5">
          {parsedResult.title && (
            <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-rose-500 shrink-0" />
              {parsedResult.title}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            {parsedResult.timeLimit && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {parsedResult.timeLimit} phút
              </span>
            )}
            {parsedResult.description && (
              <span className="truncate max-w-xs">{parsedResult.description}</span>
            )}
          </div>
        </div>
      )}

      {/* Success banner + select controls */}
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-md border border-emerald-200 dark:border-emerald-800">
        <span className="flex items-center gap-1.5 font-medium text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          Bóc tách thành công {total} câu hỏi
        </span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Đã chọn: {selectedIndices.size} câu</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className="h-6 text-xs rounded-sm text-rose-600 hover:text-rose-700 px-2"
          >
            {allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
          </Button>
        </div>
      </div>

      {/* Selectable question list */}
      <ScrollArea className="h-72 border border-slate-200 dark:border-slate-800 rounded-md p-3 bg-white dark:bg-slate-900">
        <div className="space-y-3">
          {parsedResult.questions.map((q: ParsedQuestion, idx: number) => {
            const isSelected = selectedIndices.has(idx);
            return (
              <div
                key={idx}
                className={`p-3 rounded-md border text-xs transition-colors ${
                  isSelected
                    ? 'border-rose-400 bg-rose-50/30 dark:bg-rose-950/20'
                    : 'border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                {/* Row: checkbox + number + inline type dropdown */}
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggle(idx)}
                      className="rounded-sm text-rose-600 focus:ring-rose-500 shrink-0"
                    />
                    <span className="font-bold text-slate-900 dark:text-white truncate">
                      Câu {idx + 1} ({q.points} điểm)
                    </span>
                  </label>
                  {/* Inline type editor — allows teacher to fix parser result */}
                  <Select
                    value={q.questionType}
                    onValueChange={(val) => onTypeChange(idx, val as QuestionType)}
                  >
                    <SelectTrigger className="h-6 w-36 text-xs rounded-sm border-slate-300 dark:border-slate-700 px-2 shrink-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-md border border-slate-200 dark:border-slate-800 text-xs">
                      <SelectItem value="multiple_choice" className="text-xs">
                        <QuestionTypeBadge type={QuestionType.multiple_choice} />
                      </SelectItem>
                      <SelectItem value="multiple_select" className="text-xs">
                        <QuestionTypeBadge type={QuestionType.multiple_select} />
                      </SelectItem>
                      <SelectItem value="true_false" className="text-xs">
                        <QuestionTypeBadge type={QuestionType.true_false} />
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Question content */}
                <p className="text-slate-700 dark:text-slate-300 font-medium mb-2 pl-6">
                  {q.content}
                </p>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-6 border-l-2 border-slate-200 dark:border-slate-700">
                  {q.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className={`px-2 py-1 rounded-sm text-xs ${
                        opt.isCorrect
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}. {opt.content}
                      {opt.isCorrect && ' ✓'}
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <p className="mt-2 text-slate-500 italic text-xs pl-6 border-l-2 border-amber-400">
                    Giải thích: {q.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
