'use client';

import useSWR from 'swr';
import { Award, Users, BookOpen, Video, FileText, HelpCircle, Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { gradebookService } from '../services/gradebook.service';
import type { AttendanceSummaryEntity } from '@/types/grade';

interface AttendanceSummaryDrawerProps {
  classId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AttendanceSummaryDrawer({
  classId,
  isOpen,
  onOpenChange,
}: AttendanceSummaryDrawerProps) {
  const { data, isLoading } = useSWR<AttendanceSummaryEntity | null>(
    isOpen && classId ? `classes/${classId}/attendance-summary` : null,
    () => gradebookService.getAttendanceSummary(classId),
    { revalidateOnFocus: false },
  );

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-2xl bg-card border-border p-0 flex flex-col"
      >
        <SheetHeader className="p-5 pb-3 border-b border-border/80">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="size-5" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold text-foreground">
                Thống kê Chuyên cần & Hoạt động Học tập
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                Theo dõi tiến độ thực tế 4 thành phần: Họp trực tuyến, Đọc bài giảng, Nộp bài tập và
                Làm quiz.
              </SheetDescription>
            </div>
          </div>

          {data && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
              <div className="p-2.5 rounded-xl border border-border bg-muted/30 text-center">
                <span className="text-[10px] text-muted-foreground">Buổi học trực tuyến</span>
                <p className="text-sm font-bold text-foreground">{data.totalSessions} buổi</p>
              </div>
              <div className="p-2.5 rounded-xl border border-border bg-muted/30 text-center">
                <span className="text-[10px] text-muted-foreground">Bài giảng & Tài liệu</span>
                <p className="text-sm font-bold text-foreground">{data.totalMaterials} bài</p>
              </div>
              <div className="p-2.5 rounded-xl border border-border bg-muted/30 text-center">
                <span className="text-[10px] text-muted-foreground">Bài tập quá trình</span>
                <p className="text-sm font-bold text-foreground">
                  {data.totalAssignments ?? 0} bài
                </p>
              </div>
              <div className="p-2.5 rounded-xl border border-border bg-muted/30 text-center">
                <span className="text-[10px] text-muted-foreground">Bài kiểm tra Quiz</span>
                <p className="text-sm font-bold text-foreground">{data.totalQuizzes ?? 0} đợt</p>
              </div>
            </div>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5 divide-y divide-border/60">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-emerald-500" />
              <p className="text-xs font-medium">Đang tổng hợp dữ liệu chuyên cần...</p>
            </div>
          ) : !data || data.students.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-2">
              <Users className="size-8 mx-auto opacity-40" />
              <p className="text-sm font-medium">Chưa có dữ liệu tiến độ chuyên cần</p>
              <p className="text-xs max-w-sm mx-auto">
                Lớp học chưa có dữ liệu tham gia hoạt động của sinh viên.
              </p>
            </div>
          ) : (
            data.students.map((student) => (
              <div
                key={student.studentId}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="size-9 shrink-0 border border-border">
                    <AvatarImage src={student.avatarUrl || undefined} alt={student.studentName} />
                    <AvatarFallback className="text-xs font-bold bg-muted text-muted-foreground">
                      {student.studentName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {student.studentName}
                      </p>
                      {student.studentCode && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 h-4 font-mono"
                        >
                          {student.studentCode}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {student.studentEmail}
                    </p>
                  </div>
                </div>

                {/* 4 Attendance Components Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] sm:min-w-72">
                  <div className="p-1.5 rounded-lg bg-muted/40 border border-border/50 flex flex-col">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Video className="size-2.5 text-purple-500 shrink-0" /> Họp:
                    </span>
                    <span className="font-semibold text-foreground">
                      {student.attendedSessions}/{student.totalSessions} ({student.sessionRate}%)
                    </span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-muted/40 border border-border/50 flex flex-col">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <BookOpen className="size-2.5 text-cyan-500 shrink-0" /> Bài giảng:
                    </span>
                    <span className="font-semibold text-foreground">
                      {student.completedMaterials}/{student.totalMaterials} ({student.materialRate}
                      %)
                    </span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-muted/40 border border-border/50 flex flex-col">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <FileText className="size-2.5 text-blue-500 shrink-0" /> Bài tập:
                    </span>
                    <span className="font-semibold text-foreground">
                      {student.submittedAssignments}/{student.totalAssignments} (
                      {student.assignmentRate}%)
                    </span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-muted/40 border border-border/50 flex flex-col">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <HelpCircle className="size-2.5 text-amber-500 shrink-0" /> Quiz:
                    </span>
                    <span className="font-semibold text-foreground">
                      {student.attemptedQuizzes}/{student.totalQuizzes} ({student.quizRate}%)
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
