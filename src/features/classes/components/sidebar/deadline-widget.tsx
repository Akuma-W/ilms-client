'use client';

import { Calendar, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface DeadlineWidgetProps {
  classId?: string;
}

export function DeadlineWidget({ classId }: DeadlineWidgetProps) {
  // Mock upcoming deadlines for active classroom context
  const upcomingItems = classId
    ? [
        {
          id: '1',
          title: 'Bài tập 03: API Integration',
          due: 'Hôm nay 23:59',
          isUrgent: true,
          href: `/classes/${classId}/assignments`,
        },
        {
          id: '2',
          title: 'Trắc nghiệm: Next.js App Router',
          due: '12/11/2026',
          isUrgent: false,
          href: `/classes/${classId}/quizzes`,
        },
      ]
    : [];

  if (upcomingItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-4 text-center space-y-1.5 rounded-xl bg-white/80 dark:bg-slate-800/40 border border-indigo-200/80 dark:border-slate-800 p-3 shadow-2xs">
        <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 shadow-2xs">
          <Calendar className="w-4 h-4" />
        </div>
        <p className="text-[11px] font-bold text-slate-700">Không có hạn nộp gần</p>
      </div>
    );
  }

  return (
    <div className="space-y-2" data-class-id={classId}>
      {upcomingItems.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="block p-2.5 rounded-xl bg-white/95 hover:bg-white dark:bg-slate-800/70 dark:hover:bg-slate-800 border border-indigo-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-xs transition-all group"
        >
          <div className="flex items-start gap-2">
            {item.isUrgent ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-indigo-950 dark:group-hover:text-white truncate">
                {item.title}
              </p>
              <p className="text-[10px] mt-0.5 font-bold flex items-center gap-1">
                <span
                  className={
                    item.isUrgent
                      ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                      : 'text-amber-600 dark:text-amber-400 font-extrabold'
                  }
                >
                  {item.due}
                </span>
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
