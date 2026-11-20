'use client';

import { BookOpen, CheckCircle2, Clock, HelpCircle, Video } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AttendanceStudentItem } from '@/types/grade';

interface StudentAttendanceCardProps {
  summary: AttendanceStudentItem;
}

export function StudentAttendanceCard({ summary }: StudentAttendanceCardProps) {
  const pillars = [
    {
      title: 'Họp trực tuyến',
      icon: Video,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      actual: summary.attendedSessions,
      total: summary.totalSessions,
      rate: summary.sessionRate,
      unit: 'buổi',
    },
    {
      title: 'Bài giảng & Học liệu',
      icon: BookOpen,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      actual: summary.completedMaterials,
      total: summary.totalMaterials,
      rate: summary.materialRate,
      unit: 'bài',
    },
    {
      title: 'Bài tập đã nộp',
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      actual: summary.submittedAssignments || 0,
      total: summary.totalAssignments || 0,
      rate: summary.assignmentRate || 0,
      unit: 'bài',
    },
    {
      title: 'Trắc nghiệm Quiz',
      icon: HelpCircle,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      actual: summary.attemptedQuizzes || 0,
      total: summary.totalQuizzes || 0,
      rate: summary.quizRate || 0,
      unit: 'bài',
    },
  ];

  return (
    <Card className="border border-border/80 bg-card/90 shadow-xs overflow-hidden">
      <CardHeader className="p-4 sm:p-5 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="size-5 text-emerald-500" />
            <CardTitle className="text-base sm:text-lg font-bold">
              Đánh giá quá trình chuyên cần & tích lũy
            </CardTitle>
          </div>
          <Badge
            variant="outline"
            className="border-emerald-500/30 text-emerald-600 bg-emerald-500/10 text-xs"
          >
            Tiến độ 4 thành phần
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Theo dõi mức độ hoàn thành các hoạt động học tập trực tuyến, học liệu số, bài tập và bài
          trắc nghiệm
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className={`p-3.5 rounded-xl border ${p.borderColor} ${p.bgColor} flex flex-col justify-between gap-2.5`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{p.title}</span>
                  <div
                    className={`size-7 rounded-lg ${p.bgColor} flex items-center justify-center`}
                  >
                    <Icon className={`size-3.5 ${p.color}`} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold font-mono text-foreground">
                      {p.actual}{' '}
                      <span className="text-xs font-normal text-muted-foreground">
                        / {p.total} {p.unit}
                      </span>
                    </span>
                    <span className={`text-xs font-bold font-mono ${p.color}`}>
                      {Math.round(p.rate)}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-background/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        p.rate >= 100
                          ? 'bg-emerald-500'
                          : p.rate >= 50
                            ? 'bg-blue-500'
                            : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, p.rate))}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
