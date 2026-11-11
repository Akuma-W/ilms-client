'use client';

import { Award, BookOpen, CheckCircle2, Clock, FileText, HelpCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatScore, getGpa4 } from '../utils/grade.utils';
import type { StudentGradeRecord } from '@/types/grade';

interface StudentGradesViewProps {
  record: StudentGradeRecord;
}

/**
 * Personal gradebook for an enrolled student using compact, low-profile stat tiles,
 * Vietnamese MOET 4.0 GPA scale conversion, and index numbered shadcn tables.
 */
export function StudentGradesView({ record }: StudentGradesViewProps) {
  const gradedItemsCount = record.detailedItems.filter((i) => i.status === 'graded').length;
  const hasScore = record.finalScore !== null && record.finalScore !== undefined;

  return (
    <div className="space-y-6">
      {/* 4 Compact, Low-Profile Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Final Score */}
        <Card
          className={`shadow-2xs transition-all p-0 gap-3 ${
            !hasScore
              ? 'border border-border/80 bg-card/60'
              : record.isPassed
                ? 'border border-emerald-500/30 bg-emerald-500/5'
                : 'border border-rose-500/30 bg-rose-500/5'
          }`}
        >
          <CardHeader className="p-3 pb-1 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Điểm tổng kết
              </span>
              <Award
                className={`size-4 ${
                  !hasScore
                    ? 'text-muted-foreground'
                    : record.isPassed
                      ? 'text-emerald-500'
                      : 'text-rose-500'
                }`}
              />
            </div>
            <div className="pt-0 flex items-baseline gap-2">
              <span
                className={`text-xl sm:text-2xl font-bold ${
                  !hasScore
                    ? 'text-muted-foreground'
                    : record.isPassed
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {formatScore(record.finalScore)}
              </span>
              <span className="text-xs text-muted-foreground">/ 10</span>
              {hasScore && record.gpa4 !== null && (
                <span className="text-xs font-mono font-medium text-primary ml-auto">
                  GPA: {record.gpa4.toFixed(1)} / 4.0
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-3.5 pt-0">
            <span className="text-xs font-medium text-foreground/80">
              Xếp loại: {record.letterGrade || '—'}
            </span>
          </CardContent>
        </Card>

        {/* Card 2: Completion Rate */}
        <Card className="p-0 gap-3 border border-blue-500/30 bg-blue-500/5 shadow-2xs transition-all">
          <CardHeader className="p-3 sm:p-3.5 pb-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Tiến độ học tập
              </span>
              <BookOpen className="size-4 text-blue-500" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 pt-0.5">
              {record.completionRate}%
            </p>
          </CardHeader>
          <CardContent className="p-3 sm:p-3.5 pt-0">
            <span className="text-xs text-muted-foreground">Đã nộp bài tập & tham gia quiz</span>
          </CardContent>
        </Card>

        {/* Card 3: Course Status */}
        <Card
          className={`shadow-2xs transition-all p-0 gap-3 ${
            !hasScore
              ? 'border border-border/80 bg-card/60'
              : record.isPassed
                ? 'border border-emerald-500/30 bg-emerald-500/5'
                : 'border border-rose-500/30 bg-rose-500/5'
          }`}
        >
          <CardHeader className="p-3 sm:p-3.5 pb-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Kết quả học phần
              </span>
              {!hasScore ? (
                <Clock className="size-4 text-muted-foreground" />
              ) : record.isPassed ? (
                <CheckCircle2 className="size-4 text-emerald-500" />
              ) : (
                <XCircle className="size-4 text-rose-500" />
              )}
            </div>
            <p className="text-xl sm:text-2xl font-bold pt-0.5">
              {!hasScore ? (
                <span className="text-muted-foreground font-normal text-lg">Đang cập nhật</span>
              ) : record.isPassed ? (
                <span className="text-emerald-600 dark:text-emerald-400">Đạt yêu cầu</span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400">Chưa đạt</span>
              )}
            </p>
          </CardHeader>
          <CardContent className="p-3 sm:p-3.5 pt-0">
            <span className="text-xs text-muted-foreground">
              {hasScore ? 'Chuẩn đầu ra: ≥ 5.0' : 'Chưa có điểm tổng kết'}
            </span>
          </CardContent>
        </Card>

        {/* Card 4: Graded Items */}
        <Card className="p-0 gap-3 border border-amber-500/30 bg-amber-500/5 shadow-2xs transition-all">
          <CardHeader className="p-3 sm:p-3.5 pb-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Đầu điểm đã có
              </span>
              <Clock className="size-4 text-amber-500" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground pt-0.5">
              {gradedItemsCount}{' '}
              <span className="text-xs font-normal text-muted-foreground">
                / {record.detailedItems.length} hoạt động
              </span>
            </p>
          </CardHeader>
          <CardContent className="p-3 sm:p-3.5 pt-0">
            <span className="text-xs text-muted-foreground">Bài tập và kiểm tra định kỳ</span>
          </CardContent>
        </Card>
      </div>

      {/* Table 1: Category Breakdown with STT and GPA 4.0 Scale */}
      <Card className="border border-border/80 bg-card/90 shadow-xs overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Award className="size-5 text-primary" />
            <CardTitle className="text-base sm:text-lg font-bold">
              Điểm thành phần theo trọng số
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Bảng điểm phân bổ theo quy định môn học (tổng trọng số 100%)
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {record.categoryGrades.map((cat, idx) => {
              const gpaScore = getGpa4(cat.score);
              return (
                <TableRow
                  key={cat.categoryId}
                  className="border-b border-border/50 hover:bg-muted/30"
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
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      {/* Table 2: Detailed Assessment Items with STT */}
      <Card className="border border-border/80 bg-card/90 shadow-xs overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-border/50">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            <CardTitle className="text-base sm:text-lg font-bold">
              Chi tiết bài tập & kiểm tra
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Danh sách điểm số từng bài tập, quiz và nhận xét chi tiết từ giảng viên
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
                Điểm tối đa
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
                  {item.maxScore}
                </TableCell>
                <TableCell className="py-3 px-4 text-center font-medium text-sm sm:text-base text-foreground">
                  {formatScore(item.earnedScore)}
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
    </div>
  );
}
