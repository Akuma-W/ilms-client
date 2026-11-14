'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuizPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function QuizPagination({ page, totalPages, onPageChange }: QuizPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        className="text-sm h-8 rounded-md gap-1"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Trang trước
      </Button>
      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium px-3 tabular-nums">
        {page} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="text-sm h-8 rounded-md gap-1"
      >
        Trang sau
        <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
