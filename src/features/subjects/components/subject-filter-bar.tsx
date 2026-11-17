'use client';

import { BookOpen } from 'lucide-react';
import { useSubjects } from '../hooks/use-subjects';
import { cn } from '@/lib/utils';

interface SubjectFilterBarProps {
  selectedSubjectId?: string;
  onSelectSubject: (subjectId: string | null) => void;
}

export function SubjectFilterBar({ selectedSubjectId, onSelectSubject }: SubjectFilterBarProps) {
  const { subjects, isLoading } = useSubjects();

  if (isLoading && subjects.length === 0) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar animate-pulse">
        <div className="h-8 w-24 bg-muted/60 rounded-xl shrink-0" />
        <div className="h-8 w-36 bg-muted/60 rounded-xl shrink-0" />
        <div className="h-8 w-32 bg-muted/60 rounded-xl shrink-0" />
      </div>
    );
  }

  if (subjects.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Lọc theo môn học
        </span>
        {selectedSubjectId && (
          <button
            type="button"
            onClick={() => onSelectSubject(null)}
            className="text-[11px] text-primary font-medium hover:underline cursor-pointer"
          >
            Xóa bộ lọc môn
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {/* All subjects pill */}
        <button
          type="button"
          onClick={() => onSelectSubject(null)}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border cursor-pointer',
            !selectedSubjectId
              ? 'bg-primary text-primary-foreground border-primary shadow-xs'
              : 'bg-card text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground',
          )}
        >
          <BookOpen className="size-3.5" />
          <span>Tất cả môn ({subjects.length})</span>
        </button>

        {/* Individual subject pills */}
        {subjects.map((sub) => {
          const isSelected = selectedSubjectId === sub.id;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => onSelectSubject(isSelected ? null : sub.id)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border cursor-pointer',
                isSelected
                  ? 'bg-primary/10 text-primary border-primary font-bold shadow-2xs'
                  : 'bg-card text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground',
              )}
            >
              <span
                className={cn(
                  'text-[11px]',
                  isSelected ? 'text-primary' : 'text-muted-foreground font-mono',
                )}
              >
                [{sub.code}]
              </span>
              <span>{sub.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
