'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { Assignment, AssignmentFilterStatus } from '@/types/assignment';

interface AssignmentFilterTabsProps {
  currentTab: AssignmentFilterStatus;
  onChangeTab: (tab: AssignmentFilterStatus) => void;
  assignments: Assignment[];
  isTeacher: boolean;
  studentId?: string;
}

interface TabOption {
  key: AssignmentFilterStatus;
  label: string;
}

export function AssignmentFilterTabs({
  currentTab,
  onChangeTab,
  assignments,
  isTeacher,
  studentId,
}: AssignmentFilterTabsProps) {
  const tabs = useMemo<TabOption[]>(() => {
    if (isTeacher) {
      return [
        { key: 'all', label: 'Tất cả' },
        { key: 'pending', label: 'Đang mở nộp' },
        { key: 'overdue', label: 'Đã hết hạn' },
      ];
    }

    return [
      { key: 'all', label: 'Tất cả' },
      { key: 'pending', label: 'Cần làm' },
      { key: 'submitted', label: 'Đã nộp' },
      { key: 'graded', label: 'Đã có điểm' },
      { key: 'overdue', label: 'Quá hạn' },
    ];
  }, [isTeacher]);

  const counts = useMemo(() => {
    const now = new Date().getTime();
    const map: Record<AssignmentFilterStatus, number> = {
      all: assignments.length,
      pending: 0,
      submitted: 0,
      graded: 0,
      overdue: 0,
    };

    assignments.forEach((a) => {
      const isPastDue = a.dueAt ? new Date(a.dueAt).getTime() < now : false;
      const userSubmission = studentId
        ? a.submissions?.find((s) => s.studentId === studentId)
        : undefined;

      if (isTeacher) {
        if (isPastDue) map.overdue += 1;
        else map.pending += 1;
      } else {
        if (userSubmission) {
          if (userSubmission.score !== null && userSubmission.score !== undefined) {
            map.graded += 1;
          } else {
            map.submitted += 1;
          }
        } else {
          if (isPastDue) {
            map.overdue += 1;
          } else {
            map.pending += 1;
          }
        }
      }
    });

    return map;
  }, [assignments, isTeacher, studentId]);

  return (
    <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/60 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.key;
        const count = counts[tab.key] ?? 0;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChangeTab(tab.key)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
              isActive
                ? 'bg-background text-foreground shadow-xs border border-border/80'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50',
            )}
          >
            <span>{tab.label}</span>
            <span
              className={cn(
                'text-xs px-1.5 py-0.2 rounded-full font-mono',
                isActive
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
