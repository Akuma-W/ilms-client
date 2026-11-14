'use client';

import { Check, CheckCircle2, HelpCircle, X, XCircle } from 'lucide-react';
import { QuestionType } from '@/types/enum';
import type { CheckedAnswerResult, QuizTakeOption } from '@/types/quiz';

interface QuizPlayOptionsProps {
  options: QuizTakeOption[];
  questionType: QuestionType;
  selectedOptionIds: string[];
  onToggleOption: (optionId: string) => void;
  disabled?: boolean;
  checkedResult?: CheckedAnswerResult | null;
}

const OPTION_THEMES = [
  {
    letter: 'A',
    badge: 'bg-rose-500 text-white shadow-md shadow-rose-500/30',
    idle: 'border-rose-500/30 hover:border-rose-400 bg-rose-500/10 hover:bg-rose-500/15 text-white',
    selected: 'border-rose-500 bg-rose-500/25 ring-2 ring-rose-400 text-white shadow-lg shadow-rose-500/20',
  },
  {
    letter: 'B',
    badge: 'bg-sky-500 text-white shadow-md shadow-sky-500/30',
    idle: 'border-sky-500/30 hover:border-sky-400 bg-sky-500/10 hover:bg-sky-500/15 text-white',
    selected: 'border-sky-500 bg-sky-500/25 ring-2 ring-sky-400 text-white shadow-lg shadow-sky-500/20',
  },
  {
    letter: 'C',
    badge: 'bg-amber-500 text-white shadow-md shadow-amber-500/30',
    idle: 'border-amber-500/30 hover:border-amber-400 bg-amber-500/10 hover:bg-amber-500/15 text-white',
    selected: 'border-amber-500 bg-amber-500/25 ring-2 ring-amber-400 text-white shadow-lg shadow-amber-500/20',
  },
  {
    letter: 'D',
    badge: 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30',
    idle: 'border-emerald-500/30 hover:border-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15 text-white',
    selected: 'border-emerald-500 bg-emerald-500/25 ring-2 ring-emerald-400 text-white shadow-lg shadow-emerald-500/20',
  },
  {
    letter: 'E',
    badge: 'bg-purple-500 text-white shadow-md shadow-purple-500/30',
    idle: 'border-purple-500/30 hover:border-purple-400 bg-purple-500/10 hover:bg-purple-500/15 text-white',
    selected: 'border-purple-500 bg-purple-500/25 ring-2 ring-purple-400 text-white shadow-lg shadow-purple-500/20',
  },
  {
    letter: 'F',
    badge: 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30',
    idle: 'border-indigo-500/30 hover:border-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/15 text-white',
    selected: 'border-indigo-500 bg-indigo-500/25 ring-2 ring-indigo-400 text-white shadow-lg shadow-indigo-500/20',
  },
  {
    letter: 'G',
    badge: 'bg-teal-500 text-white shadow-md shadow-teal-500/30',
    idle: 'border-teal-500/30 hover:border-teal-400 bg-teal-500/10 hover:bg-teal-500/15 text-white',
    selected: 'border-teal-500 bg-teal-500/25 ring-2 ring-teal-400 text-white shadow-lg shadow-teal-500/20',
  },
  {
    letter: 'H',
    badge: 'bg-pink-500 text-white shadow-md shadow-pink-500/30',
    idle: 'border-pink-500/30 hover:border-pink-400 bg-pink-500/10 hover:bg-pink-500/15 text-white',
    selected: 'border-pink-500 bg-pink-500/25 ring-2 ring-pink-400 text-white shadow-lg shadow-pink-500/20',
  },
];

export function QuizPlayOptions({
  options,
  questionType,
  selectedOptionIds,
  onToggleOption,
  disabled = false,
  checkedResult,
}: QuizPlayOptionsProps) {
  const isScrollable = options.length >= 7;

  return (
    <div className="w-full space-y-4">
      {/* Scrollable Container if 7+ options */}
      <div
        className={`w-full ${
          isScrollable
            ? 'max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20'
            : ''
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {options.map((opt, idx) => {
            const theme = OPTION_THEMES[idx % OPTION_THEMES.length];
            const isSelected = selectedOptionIds.includes(opt.id);
            const isMulti = questionType === QuestionType.multiple_select;

            let cardStyle = isSelected ? theme.selected : theme.idle;
            let statusIcon = null;

            // In immediate review mode with checkedResult
            if (checkedResult) {
              const isCorrectAnswer = checkedResult.correctOptionIds.includes(opt.id);
              if (isCorrectAnswer) {
                cardStyle =
                  'border-emerald-400 bg-emerald-600 text-white shadow-xl ring-2 ring-emerald-300';
                statusIcon = <Check className="w-5 h-5 text-white stroke-3" />;
              } else if (isSelected && !isCorrectAnswer) {
                cardStyle =
                  'border-rose-400 bg-rose-600 text-white shadow-xl ring-2 ring-rose-300';
                statusIcon = <X className="w-5 h-5 text-white stroke-3" />;
              } else {
                cardStyle = 'opacity-30 border-white/10 bg-white/5 text-slate-400';
              }
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={disabled}
                onClick={() => onToggleOption(opt.id)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between gap-3 select-none backdrop-blur-md ${
                  disabled
                    ? 'cursor-default'
                    : 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]'
                } ${cardStyle}`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-all ${
                      checkedResult ? 'bg-black/30 text-white' : theme.badge
                    }`}
                  >
                    {theme.letter}
                  </div>
                  <span className="text-sm sm:text-base font-semibold leading-snug wrap-break-word">
                    {opt.content}
                  </span>
                </div>

                <div className="shrink-0 flex items-center">
                  {statusIcon ? (
                    statusIcon
                  ) : isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-white text-slate-950 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-3" />
                    </div>
                  ) : (
                    <div
                      className={`w-5 h-5 rounded-${
                        isMulti ? 'md' : 'full'
                      } border-2 border-white/30`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Immediate Review Explanation Feedback Card */}
      {checkedResult && (
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-all animate-in fade-in-50 duration-300 backdrop-blur-md ${
            checkedResult.isCorrect
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm sm:text-base mb-1">
            {checkedResult.isCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Chính xác! (+{checkedResult.pointsEarned} điểm)</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>Chưa chính xác!</span>
              </>
            )}
          </div>
          {checkedResult.explanation && (
            <div className="mt-2 text-xs sm:text-sm text-slate-300 flex items-start gap-1.5 pt-2 border-t border-white/10">
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Giải thích:</strong> {checkedResult.explanation}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
