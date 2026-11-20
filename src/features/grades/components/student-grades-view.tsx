'use client';

import { useState } from 'react';
import { Award, BookOpen, Clock, FileText, HelpCircle, Info } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatScore, getGpa4 } from '../utils/grade.utils';
import { StudentGradeStats } from './student-grade-stats';
import { StudentAttendanceCard } from './student-attendance-card';
import { GradeBreakdownModal } from './grade-breakdown-modal';
import type { StudentGradeRecord } from '@/types/grade';

interface StudentGradesViewProps {
  record: StudentGradeRecord;
  classId?: string;
}

export function StudentGradesView({ record, classId }: StudentGradesViewProps) {
  const [breakdownModal, setBreakdownModal] = useState<{
    isOpen: boolean;
    categoryId: string;
    categoryName: string;
  }>({
    isOpen: false,
    categoryId: '',
    categoryName: '',
  });

  return (
    <div className="space-y-6">
      {/* 4 Compact Analytics Cards */}
      <StudentGradeStats record={record} />

      {/* Attendance Summary Card (4 Pillars) */}
      {record.attendanceSummary && <StudentAttendanceCard summary={record.attendanceSummary} />}

      {/* Table 1: Category Breakdown */}
      <Card className="border border-border/80 bg-card/90 shadow-xs overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Award className="size-5 text-primary" />
            <CardTitle className="text-base sm:text-lg font-bold">
              Điểm thành phần theo trọng số
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Bảng điểm phân bổ theo quy định môn học (tổng trọng số 100%). Nhấn vào từng mục để xem
            chi tiết bài thành phần.
          </CardDescription>
        </CardHeader>
        <Table>
          <TableHeader className="bg-primary/5 dark:bg-primary/10 border-b border-primary/20">
            <TableRow className="border-b border-primary/20 text-xs font-bold uppercase tracking-wider">
              <TableHead className="py-3 px-3 text-center w-14 font-bold text-foreground">
                STT
              </TableHead>
              <TableHead className="py-3 px-4 font-bold text-foreground">
                Hạng mục đánh giá
              </TableHead>
              <TableHead className="py-3 px-4 text-center font-bold text-foreground">
                Tỷ lệ trọng số
              </TableHead>
              <TableHead className="py-3 px-4 text-center font-bold text-foreground">
                Điểm số (Thang 10)
              </TableHead>
              <TableHead className="py-3 px-4 text-center font-bold text-foreground">
                Điểm hệ 4 (GPA)
              </TableHead>
              <TableHead className="py-3 px-4 text-center font-bold text-foreground w-24">
                Chi tiết
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {record.categoryGrades.map((cat, idx) => {
              const gpaScore = getGpa4(cat.score);
              return (
                <TableRow
                  key={cat.categoryId}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="py-3 px-3 text-center text-xs sm:text-sm text-muted-foreground font-mono">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="py-3 px-4 font-medium text-sm sm:text-base text-foreground">
                    {cat.categoryName}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center font-mono text-xs sm:text-sm font-medium text-primary">
                    {Math.round(cat.weight > 1 ? cat.weight : cat.weight * 100)}%
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center font-medium text-sm sm:text-base text-foreground">
                    {formatScore(cat.score)}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center font-mono font-medium text-sm sm:text-base text-primary">
                    {gpaScore !== null ? gpaScore.toFixed(1) : '—'}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center">
                    {classId && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setBreakdownModal({
                            isOpen: true,
                            categoryId: cat.categoryId,
                            categoryName: cat.categoryName,
                          })
                        }
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-primary gap-1"
                        title="Xem chi tiết các bài thành phần"
                      >
                        <Info className="size-3.5" />
                        <span className="hidden sm:inline">Xem</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow className="bg-primary/5 font-semibold border-t-2 border-primary/25">
              <TableCell className="py-3.5 px-3 text-center text-xs font-mono text-muted-foreground">
                —
              </TableCell>
              <TableCell className="py-3.5 px-4 text-base font-bold text-foreground">
                Tổng kết môn học
              </TableCell>
              <TableCell className="py-3.5 px-4 text-center font-mono text-sm font-semibold text-primary">
                100%
              </TableCell>
              <TableCell className="py-3.5 px-4 text-center font-semibold text-base sm:text-lg text-foreground">
                {formatScore(record.finalScore)}
              </TableCell>
              <TableCell className="py-3.5 px-4 text-center font-mono font-semibold text-base sm:text-lg text-primary">
                {record.gpa4 !== null && record.gpa4 !== undefined ? record.gpa4.toFixed(1) : '—'}
              </TableCell>
              <TableCell className="py-3.5 px-4 text-center font-mono text-xs text-muted-foreground">
                —
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      {/* Table 2: Detailed Assessment Items */}
      <Card className="border border-border/80 bg-card/90 shadow-xs overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-border/50">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            <CardTitle className="text-base sm:text-lg font-bold">
              Chi tiết bài tập & kiểm tra
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Danh sách điểm số từng bài tập, quiz đã được quy đổi chuẩn thang điểm 10
          </CardDescription>
        </CardHeader>
        <Table>
          <TableHeader className="bg-primary/5 dark:bg-primary/10 border-b border-primary/20">
            <TableRow className="border-b border-primary/20 text-xs font-bold uppercase tracking-wider">
              <TableHead className="py-3 px-3 text-center w-14 font-bold text-foreground">
                STT
              </TableHead>
              <TableHead className="py-3 px-4 font-bold text-foreground">Tên hoạt động</TableHead>
              <TableHead className="py-3 px-4 text-center font-bold text-foreground">
                Phân loại
              </TableHead>
              <TableHead className="py-3 px-4 text-center font-bold text-foreground">
                Thang điểm
              </TableHead>
              <TableHead className="py-3 px-4 text-center font-bold text-foreground">
                Điểm đạt được
              </TableHead>
              <TableHead className="py-3 px-4 text-center font-bold text-foreground">
                Trạng thái
              </TableHead>
              <TableHead className="py-3 px-4 font-bold text-foreground">
                Nhận xét của giảng viên
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {record.detailedItems.map((item, idx) => (
              <TableRow key={item.id} className="border-b border-border/50 hover:bg-muted/30">
                <TableCell className="py-3 px-3 text-center text-xs sm:text-sm text-muted-foreground font-mono">
                  {idx + 1}
                </TableCell>
                <TableCell className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    {item.type === 'assignment' && (
                      <FileText className="size-4 text-blue-500 shrink-0" />
                    )}
                    {item.type === 'quiz' && (
                      <HelpCircle className="size-4 text-amber-500 shrink-0" />
                    )}
                    {item.type === 'attendance' && (
                      <Clock className="size-4 text-emerald-500 shrink-0" />
                    )}
                    <span className="font-medium text-sm sm:text-base text-foreground">
                      {item.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3 px-4 text-center">
                  <Badge variant="outline" className="text-xs font-medium">
                    {item.type === 'assignment'
                      ? 'Bài tập'
                      : item.type === 'quiz'
                        ? 'Trắc nghiệm'
                        : 'Chuyên cần'}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 px-4 text-center font-mono text-xs sm:text-sm font-normal text-muted-foreground">
                  <span>{item.maxScore}</span>
                  {item.originalMaxScore && item.originalMaxScore !== item.maxScore && (
                    <span className="block text-[10px] text-muted-foreground/75">
                      (Thang gốc: {item.originalMaxScore})
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-3 px-4 text-center font-medium text-sm sm:text-base text-foreground">
                  <div>{formatScore(item.earnedScore)}</div>
                  {item.rawScore !== null &&
                    item.rawScore !== undefined &&
                    item.originalMaxScore &&
                    item.originalMaxScore !== item.maxScore && (
                      <span className="block text-[10px] font-mono font-normal text-muted-foreground">
                        ({item.rawScore}/{item.originalMaxScore})
                      </span>
                    )}
                </TableCell>
                <TableCell className="py-3 px-4 text-center">
                  {item.status === 'graded' && (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-medium">
                      Đã chấm
                    </Badge>
                  )}
                  {item.status === 'pending' && (
                    <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-medium">
                      Chờ chấm
                    </Badge>
                  )}
                  {item.status === 'unsubmitted' && (
                    <Badge variant="secondary" className="text-xs font-medium">
                      Chưa nộp
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="py-3 px-4 text-xs sm:text-sm text-muted-foreground">
                  {item.feedback || 'Chưa có nhận xét'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Breakdown Modal */}
      {classId && (
        <GradeBreakdownModal
          classId={classId}
          categoryId={breakdownModal.categoryId}
          categoryName={breakdownModal.categoryName}
          isOpen={breakdownModal.isOpen}
          onOpenChange={(open) => setBreakdownModal((prev) => ({ ...prev, isOpen: open }))}
        />
      )}
    </div>
  );
}
