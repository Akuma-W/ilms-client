'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Compass, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface QuizRepositoryToolbarProps {
  activeTab: 'all' | 'my';
  onTabChange: (tab: 'all' | 'my') => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  publicCount?: number;
  myCount?: number;
}

export function QuizRepositoryToolbar({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  publicCount,
  myCount,
}: QuizRepositoryToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
      {/* Prominent Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => onTabChange(val as 'all' | 'my')}
        className="w-full sm:w-auto"
      >
        <TabsList className="bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-1 rounded-md h-10 w-full sm:w-auto flex gap-0.5">
          <TabsTrigger
            value="all"
            className="flex-1 sm:flex-initial text-sm font-medium rounded-sm px-4 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-rose-600 dark:data-[state=active]:text-rose-400 data-[state=active]:font-semibold data-[state=active]:shadow-xs transition-all flex items-center gap-1.5"
          >
            <Compass className="h-4 w-4 shrink-0" />
            Khám phá thư viện đề
            {publicCount !== undefined && (
              <span className="ml-1 inline-flex items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-[10px] font-bold leading-none px-1.5 py-0.5 min-w-4.5">
                {publicCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="my"
            className="flex-1 sm:flex-initial text-sm font-medium rounded-sm px-4 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-rose-600 dark:data-[state=active]:text-rose-400 data-[state=active]:font-semibold data-[state=active]:shadow-xs transition-all flex items-center gap-1.5"
          >
            <BookOpen className="h-4 w-4 shrink-0" />
            Đề thi của tôi
            {myCount !== undefined && myCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold leading-none px-1.5 py-0.5 min-w-4.5">
                {myCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search + Create */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Tìm kiếm đề thi..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 text-sm rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </div>

        <Button
          asChild
          size="default"
          className="text-sm font-medium h-10 rounded-md bg-rose-600 hover:bg-rose-700 text-white shadow-xs shrink-0 flex items-center gap-1.5 px-4"
        >
          <Link href="/quizzes/create">
            <Plus className="h-4 w-4" />
            Tạo đề thi mới
          </Link>
        </Button>
      </div>
    </div>
  );
}
