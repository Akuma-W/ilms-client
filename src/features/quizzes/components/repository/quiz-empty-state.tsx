'use client';

import { Button } from '@/components/ui/button';
import { BookOpen, Compass, Plus, Search } from 'lucide-react';
import Link from 'next/link';

interface QuizEmptyStateProps {
  activeTab: 'all' | 'my';
  hasSearch: boolean;
}

export function QuizEmptyState({ activeTab, hasSearch }: QuizEmptyStateProps) {
  const isPublicTab = activeTab === 'all';

  if (hasSearch) {
    return (
      <div className="py-16 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-md bg-slate-50/50 dark:bg-slate-900/20">
        <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full w-fit mx-auto mb-4">
          <Search className="h-7 w-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
          Không tìm thấy đề thi nào
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.
        </p>
      </div>
    );
  }

  return (
    <div className="py-16 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-md bg-slate-50/50 dark:bg-slate-900/20 mx-auto space-y-4 px-6">
      <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-full w-fit mx-auto">
        {isPublicTab ? <Compass className="h-8 w-8" /> : <BookOpen className="h-8 w-8" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          {isPublicTab ? 'Chưa có đề thi công khai nào' : 'Bạn chưa tạo đề thi nào'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isPublicTab
            ? 'Hãy là người đầu tiên xuất bản đề thi chất lượng lên thư viện chung.'
            : 'Bắt đầu biên soạn câu hỏi hoặc nhập nhanh từ file Word mẫu có sẵn.'}
        </p>
      </div>
      <Button
        asChild
        className="text-sm font-medium rounded-md bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
      >
        <Link href="/quizzes/create">
          <Plus className="h-4 w-4 mr-1.5" />
          Tạo đề thi mới
        </Link>
      </Button>
    </div>
  );
}
