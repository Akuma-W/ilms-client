'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ParsedQuestion } from '@/types/quiz';
import { QuestionType } from '@/types/enum';
import { changeParsedQuestionType } from '@/features/quizzes/utils/quiz.utils';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface QuizQuestionEditorProps {
  question: ParsedQuestion;
  questionNumber: number;
  onChange: (updated: ParsedQuestion) => void;
}

export function QuizQuestionEditor({
  question,
  questionNumber,
  onChange,
}: QuizQuestionEditorProps) {
  // Updates top level property of question
  const updateField = <K extends keyof ParsedQuestion>(key: K, value: ParsedQuestion[K]) => {
    onChange({
      ...question,
      [key]: value,
    });
  };

  // Handles changing question type
  const handleTypeChange = (newType: QuestionType) => {
    onChange(changeParsedQuestionType(question, newType));
  };

  // Toggles or sets correct option
  const handleToggleCorrect = (optIndex: number) => {
    if (question.questionType === QuestionType.multiple_select) {
      const nextOptions = question.options.map((opt, i) =>
        i === optIndex ? { ...opt, isCorrect: !opt.isCorrect } : opt,
      );
      updateField('options', nextOptions);
    } else {
      // Single choice or True/False: Only one correct option
      const nextOptions = question.options.map((opt, i) => ({
        ...opt,
        isCorrect: i === optIndex,
      }));
      updateField('options', nextOptions);
    }
  };

  // Updates specific option content
  const handleOptionContentChange = (optIndex: number, content: string) => {
    const nextOptions = question.options.map((opt, i) =>
      i === optIndex ? { ...opt, content } : opt,
    );
    updateField('options', nextOptions);
  };

  // Adds a new option
  const handleAddOption = () => {
    const nextOptions = [
      ...question.options,
      {
        content: '',
        isCorrect: false,
      },
    ];
    updateField('options', nextOptions);
  };

  // Deletes an option
  const handleDeleteOption = (optIndex: number) => {
    if (question.options.length <= 2) return;
    const nextOptions = question.options.filter((_, i) => i !== optIndex);
    updateField('options', nextOptions);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-6 shadow-xs space-y-6">
      {/* Top Question Config Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-bold text-base text-slate-900 dark:text-white">
            Câu hỏi số {questionNumber}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Question Type Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Loại câu:</span>
            <Select
              value={question.questionType}
              onValueChange={(val) => handleTypeChange(val as QuestionType)}
            >
              <SelectTrigger className="h-9 w-44 rounded-md text-sm border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-md border border-slate-200 dark:border-slate-800">
                <SelectItem value="multiple_choice" className="text-sm">
                  1 đáp án đúng
                </SelectItem>
                <SelectItem value="multiple_select" className="text-sm">
                  Nhiều đáp án đúng
                </SelectItem>
                <SelectItem value="true_false" className="text-sm">
                  Đúng / Sai
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Points Input */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Điểm:</span>
            <Input
              type="number"
              step="0.5"
              min="0.5"
              max="10"
              value={question.points}
              onChange={(e) =>
                updateField('points', Math.max(0.5, parseFloat(e.target.value) || 1.0))
              }
              className="w-16 h-9 rounded-md text-sm text-center font-semibold border-slate-300 dark:border-slate-700"
            />
          </div>
        </div>
      </div>

      {/* Question Content Textarea */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Nội dung câu hỏi
        </label>
        <Textarea
          rows={3}
          value={question.content}
          onChange={(e) => updateField('content', e.target.value)}
          placeholder="Nhập nội dung câu hỏi tại đây..."
          className="text-sm rounded-md border-slate-300 dark:border-slate-700 focus:border-rose-500 bg-white dark:bg-slate-900"
        />
      </div>

      {/* Options List */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Các phương án lựa chọn (Đánh dấu phương án đúng)
          </label>
          <div className="text-xs px-2 py-0.5 rounded-sm font-medium">
            {question.questionType === QuestionType.multiple_select && (
              <span className="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-sm border border-purple-200 dark:border-purple-800">
                Trắc nghiệm nhiều đáp án
              </span>
            )}
            {question.questionType === QuestionType.multiple_choice && (
              <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-sm border border-blue-200 dark:border-blue-800">
                Trắc nghiệm 1 đáp án
              </span>
            )}
            {question.questionType === QuestionType.true_false && (
              <span className="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-sm border border-amber-200 dark:border-amber-800">
                Trắc nghiệm Đúng/Sai
              </span>
            )}
          </div>
        </div>

        {question.questionType === QuestionType.true_false ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg pt-1">
            <button
              type="button"
              onClick={() => handleToggleCorrect(0)}
              className={`p-4 rounded-md border text-center font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2.5 ${
                question.options[0]?.isCorrect
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900'
              }`}
            >
              <CheckCircle2
                className={`h-5 w-5 ${
                  question.options[0]?.isCorrect
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
              <span>Đáp án: Đúng</span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleCorrect(1)}
              className={`p-4 rounded-md border text-center font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2.5 ${
                question.options[1]?.isCorrect
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900'
              }`}
            >
              <CheckCircle2
                className={`h-5 w-5 ${
                  question.options[1]?.isCorrect
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
              <span>Đáp án: Sai</span>
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-2.5">
              {question.options.map((option, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-2.5 rounded-md border transition-all ${
                    option.isCorrect
                      ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40'
                  }`}
                >
                  {/* Correct Radio / Checkbox Trigger */}
                  <button
                    type="button"
                    onClick={() => handleToggleCorrect(idx)}
                    className={`h-5 w-5 rounded-sm flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                      option.isCorrect
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                    }`}
                  >
                    {option.isCorrect && <CheckCircle2 className="h-4 w-4" />}
                  </button>

                  <span className="font-bold text-xs text-slate-500 shrink-0">
                    {String.fromCharCode(65 + idx)}.
                  </span>

                  {/* Option Content Input */}
                  <Input
                    type="text"
                    value={option.content}
                    onChange={(e) => handleOptionContentChange(idx, e.target.value)}
                    placeholder={`Nhập nội dung phương án ${String.fromCharCode(65 + idx)}...`}
                    className="flex-1 h-8 text-sm rounded-sm border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />

                  {/* Delete Option Button */}
                  {question.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteOption(idx)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded-sm cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Option Button */}
            {question.options.length < 6 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="text-xs h-8 rounded-md border-dashed border-slate-300 dark:border-slate-700 text-slate-600 hover:text-rose-600"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Thêm phương án
              </Button>
            )}
          </>
        )}
      </div>

      {/* Explanation Box */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Lời giải thích đáp án đúng (Tùy chọn)
        </label>
        <Textarea
          rows={2}
          value={question.explanation || ''}
          onChange={(e) => updateField('explanation', e.target.value)}
          placeholder="Giải thích vì sao phương án trên là chính xác để hỗ trợ học sinh ôn tập..."
          className="text-xs rounded-md border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/20"
        />
      </div>
    </div>
  );
}
