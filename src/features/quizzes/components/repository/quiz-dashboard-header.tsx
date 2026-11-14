'use client';

import { BookOpen, Compass, HelpCircle, PlayCircle } from 'lucide-react';

interface QuizDashboardHeaderProps {
  activeTab: 'all' | 'my';
  totalItems: number;
  totalQuestions?: number;
  totalAttempts?: number;
}

// KPI stat tile component
function StatTile({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <div className={`p-1.5 rounded-sm ${accent}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-none mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{value}</p>
      </div>
    </div>
  );
}

export function QuizDashboardHeader({
  activeTab,
  totalItems,
  totalQuestions,
  totalAttempts,
}: QuizDashboardHeaderProps) {
  const isPublicTab = activeTab === 'all';

  return (
    <div className="space-y-4">
      {/* Title row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            {isPublicTab ? (
              <Compass className="h-7 w-7 text-rose-500 shrink-0" />
            ) : (
              <BookOpen className="h-7 w-7 text-indigo-500 shrink-0" />
            )}
            {isPublicTab ? 'Thư viện đề thi cộng đồng' : 'Kho đề thi của tôi'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {isPublicTab
              ? 'Khám phá ngân hàng đề thi công khai từ cộng đồng giáo viên và học sinh toàn trường.'
              : 'Biên soạn, quản lý đề thi cá nhân và xuất bản vào lớp học.'}
          </p>
        </div>
      </div>

      {/* KPI strip */}
      <div className="flex flex-wrap gap-3">
        <StatTile
          icon={HelpCircle}
          label={isPublicTab ? 'Đề thi công khai' : 'Đề thi của tôi'}
          value={`${totalItems} đề`}
          accent="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
        />
        {totalQuestions !== undefined && (
          <StatTile
            icon={HelpCircle}
            label="Câu hỏi trong trang"
            value={`${totalQuestions} câu`}
            accent="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
          />
        )}
        {totalAttempts !== undefined && totalAttempts > 0 && (
          <StatTile
            icon={PlayCircle}
            label="Lượt làm trong trang"
            value={`${totalAttempts} lượt`}
            accent="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
          />
        )}
      </div>
    </div>
  );
}
