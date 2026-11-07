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
import { formatScore } from '../utils/grade.utils';
import type { StudentGradeRecord } from '@/types/grade';

interface StudentGradesViewProps {
  record: StudentGradeRecord;
}

/**
 * Personal gradebook for an enrolled student using compact, vibrant stat tiles and shadcn Table.
 * Complies with UI rules: primary tinted headers with bold headers and medium/normal weight cells.
 */
export function StudentGradesView({ record }: StudentGradesViewProps) {
  const gradedItemsCount = record.detailedItems.filter((i) => i.status === 'graded').length;

  return (
    <div className="space-y-6">
      {/* 4 Compact, Vibrant Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Final Score */}
        <Card
          className={`shadow-2xs hover:shadow-xs transition-all ${
            record.isPassed
              ? 'border border-emerald-500/30 bg-emerald-500/5'
              : 'border border-rose-500/30 bg-rose-500/5'
          }`}
        >
          <CardHeader className="p-3.5 sm:p-4 pb-1">
            <div className="flex items-center justify-between">
              <CardTitle
                className={`text-sm sm:text-base font-bold ${
                  record.isPassed
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-rose-700 dark:text-rose-300'
                }`}
              >
                Điểm tổng kết
              </CardTitle>
              <Award className="size-4 text-emerald-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-foreground pt-1 flex items-baseline gap-1.5">
              <span
                className={
                  record.isPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
                }
              >
                {formatScore(record.finalScore)}
              </span>
              <span className="text-xs font-normal text-muted-foreground">/ 10</span>
            </p>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-4 pt-0">
            <span className="text-xs font-semibold text-foreground/80">
              Xếp loại: {record.letterGrade}
            </span>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card className="border border-blue-500/30 bg-blue-500/5 shadow-2xs hover:shadow-xs transition-all">
          <CardHeader className="p-3.5 sm:p-4 pb-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm sm:text-base font-bold text-blue-700 dark:text-blue-300">
                Tiến độ học tập
              </CardTitle>
              <BookOpen className="size-4 text-blue-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 pt-1">
              {record.completionRate}%
            </p>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-4 pt-0">
            <span className="text-xs text-muted-foreground">Đã nộp bài tập & tham gia quiz</span>
          </CardContent>
        </Card>

        {/* Course Status */}
        <Card className="border border-purple-500/30 bg-purple-500/5 shadow-2xs hover:shadow-xs transition-all">
          <CardHeader className="p-3.5 sm:p-4 pb-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm sm:text-base font-bold text-purple-700 dark:text-purple-300">
                Kết quả học phần
              </CardTitle>
              {record.isPassed ? (
                <CheckCircle2 className="size-4 text-emerald-500" />
              ) : (
                <XCircle className="size-4 text-rose-500" />
              )}
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-foreground pt-1 flex items-center gap-1.5">
              {record.isPassed ? (
                <span className="text-emerald-600 dark:text-emerald-400">Đạt yêu cầu</span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400">Chưa đạt</span>
              )}
            </p>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-4 pt-0">
            <span className="text-xs text-muted-foreground">Chuẩn đầu ra: &ge; 5.0</span>
          </CardContent>
        </Card>

        {/* Graded Items */}
        <Card className="border border-amber-500/30 bg-amber-500/5 shadow-2xs hover:shadow-xs transition-all">
          <CardHeader className="p-3.5 sm:p-4 pb-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm sm:text-base font-bold text-amber-700 dark:text-amber-300">
                Đầu điểm đã có
              </CardTitle>
              <Clock className="size-4 text-amber-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-foreground pt-1">
              {gradedItemsCount}{' '}
              <span className="text-xs font-normal text-muted-foreground">
                / {record.detailedItems.length}
              </span>
            </p>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-4 pt-0">
            <span className="text-xs text-muted-foreground">Bài tập và kiểm tra định kỳ</span>
          </CardContent>
        </Card>
      </div>

      {/* Table 1: Category Breakdown using shadcn Table */}
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
                Điểm quy đổi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {record.categoryGrades.map((cat) => (
              <TableRow
                key={cat.categoryId}
                className="border-b border-border/50 hover:bg-muted/30"
              >
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
                  {formatScore(cat.weightedScore)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-primary/5 font-semibold border-t-2 border-primary/25">
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
                {formatScore(record.finalScore)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      {/* Table 2: Detailed assessment items using shadcn Table */}
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
            {record.detailedItems.map((item) => (
              <TableRow key={item.id} className="border-b border-border/50 hover:bg-muted/30">
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
