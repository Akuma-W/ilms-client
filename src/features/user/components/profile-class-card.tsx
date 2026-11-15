'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getClassTheme } from '@/lib/ui/utils';
import type { Class } from '@/types/class';
import {
  Award,
  Calendar,
  ExternalLink,
  FileText,
  GraduationCap,
  HelpCircle,
  Layers,
  Users,
} from 'lucide-react';

interface ProfileClassCardProps {
  classItem: Class;
  isStudent: boolean;
}

export function ProfileClassCard({ classItem, isStudent }: ProfileClassCardProps) {
  const memberCount = classItem.totalStudents ?? 0;
  const topicCount = classItem.totalTopics ?? 0;
  const assignmentCount = classItem.totalAssignments ?? 0;
  const quizCount = classItem.totalQuizzes ?? 0;
  const classTheme = getClassTheme(classItem);

  const hasNoResources = topicCount === 0 && assignmentCount === 0 && quizCount === 0;

  return (
    <Card className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all">
      {/* Top Gradient Accent Bar based on class title */}
      <div className={cn('h-1.5 w-full bg-linear-to-r', classTheme.gradient)} />

      <div className="p-4 sm:p-5 space-y-3.5">
        {/* Top Header Badge & Course Code */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <span
              className={cn(
                'text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border',
                classTheme.badgeBg || 'bg-indigo-50 text-indigo-700 border-indigo-100',
              )}
            >
              {classItem.courseCode || 'Chưa có mã'}
            </span>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate mt-1">
              {classItem.title}
            </h4>
            <p className="text-xs text-slate-500 truncate">{classItem.subject}</p>
          </div>
          {classItem.semester && (
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
              {classItem.semester}
            </span>
          )}
        </div>

        {/* METRICS SECTION: Numeric counts only */}
        {!isStudent ? (
          /* Teacher Metrics Card: số chủ đề, số bài tập, số quiz, số thành viên */
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Layers className="size-3 text-purple-600" />
                <span>Chủ đề</span>
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{topicCount}</p>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <FileText className="size-3 text-blue-600" />
                <span>Bài tập</span>
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{assignmentCount}</p>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <HelpCircle className="size-3 text-amber-600" />
                <span>Quiz</span>
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{quizCount}</p>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Users className="size-3 text-indigo-600" />
                <span>Thành viên</span>
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{memberCount}</p>
            </div>
          </div>
        ) : (
          /* Student Metrics Card: Điểm trung bình, số bài tập, quiz đã làm, chuyên cần */
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2 rounded-xl bg-indigo-50/50 border border-indigo-100">
              <span className="text-[11px] text-indigo-700 flex items-center gap-1 font-medium">
                <Award className="size-3 text-indigo-600" />
                <span>Điểm trung bình</span>
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">Chưa có điểm</p>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <GraduationCap className="size-3 text-emerald-600" />
                <span>Chuyên cần</span>
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">100%</p>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <FileText className="size-3 text-blue-600" />
                <span>Bài tập</span>
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">0 / {assignmentCount}</p>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <HelpCircle className="size-3 text-amber-600" />
                <span>Quiz</span>
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">0 / {quizCount}</p>
            </div>
          </div>
        )}

        {/* Empty state alert when class has zero topics, assignments and quizzes */}
        {hasNoResources && (
          <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-800 font-medium text-center">
            Chưa có tài nguyên trong lớp
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="px-4 sm:px-5 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <Calendar className="size-3" />
          <span>
            {classItem.createdAt ? new Date(classItem.createdAt).toLocaleDateString('vi-VN') : '—'}
          </span>
        </span>
        <Button
          asChild
          size="sm"
          variant="ghost"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-0 h-auto"
        >
          <Link href={`/classes/${classItem.id}`} className="inline-flex items-center gap-1">
            <span>{isStudent ? 'Vào học ngay' : 'Quản trị lớp'}</span>
            <ExternalLink className="size-3" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
