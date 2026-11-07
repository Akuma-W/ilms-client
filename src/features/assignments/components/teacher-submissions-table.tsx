'use client';

import { useState } from 'react';
import {
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Search,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SubmissionRow } from './submission-row';
import { GradeSubmissionDialog } from './grade-submission-dialog';
import type { Assignment, Submission } from '@/types/assignment';

interface TeacherSubmissionsTableProps {
  assignment: Assignment;
  onGraded: (updatedSubmissions: Submission[]) => void;
}

const PAGE_SIZE = 5;

export function TeacherSubmissionsTable({ assignment, onGraded }: TeacherSubmissionsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_grade' | 'graded'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);

  const submissions = assignment.submissions || [];
  const totalStudents = assignment.totalStudents || Math.max(submissions.length, 10);
  const submittedCount = submissions.length;
  const gradedCount = submissions.filter((s) => s.score !== null && s.score !== undefined).length;
  const pendingGradingCount = submittedCount - gradedCount;

  // Filter submissions by search term and grading status
  const filteredSubmissions = submissions.filter((sub) => {
    const studentName = sub.student?.fullName || sub.student?.email || 'Sinh viên';
    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const isGraded = sub.score !== null && sub.score !== undefined;

    if (statusFilter === 'pending_grade') return matchesSearch && !isGraded;
    if (statusFilter === 'graded') return matchesSearch && isGraded;
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredSubmissions.length / PAGE_SIZE) || 1;
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginatedSubmissions = filteredSubmissions.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleStatusFilterChange = (status: 'all' | 'pending_grade' | 'graded') => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleOpenGradeDialog = (sub: Submission) => {
    setSelectedSubmission(sub);
    setDialogOpen(true);
  };

  const handleGradeSaved = (updatedSubmission: Submission) => {
    const updated = submissions.map((s) => (s.id === updatedSubmission.id ? updatedSubmission : s));
    onGraded(updated);
  };

  return (
    <div className="space-y-6">
      {/* 1. Prominent Section Header: Danh sách bài nộp của sinh viên */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
            <Users className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Danh sách bài nộp</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Theo dõi tiến độ nộp bài, xem bài làm và chấm điểm học thuật.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-semibold px-3 py-1 bg-muted">
            {submittedCount} / {totalStudents} đã nộp
          </Badge>
        </div>
      </div>

      {/* 2. Stat KPI Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl border border-border bg-card shadow-xs">
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
            <Users className="size-4 text-blue-500" /> Sĩ số lớp
          </p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalStudents}</p>
        </div>
        <div className="p-4 rounded-2xl border border-border bg-card shadow-xs">
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
            <Clock className="size-4 text-amber-500" /> Đã nộp bài
          </p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {submittedCount}{' '}
            <span className="text-xs font-normal text-muted-foreground">
              ({Math.round((submittedCount / totalStudents) * 100)}%)
            </span>
          </p>
        </div>
        <div className="p-4 rounded-2xl border border-border bg-card shadow-xs">
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="size-4 text-emerald-500" /> Đã chấm điểm
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {gradedCount}
          </p>
        </div>
        <div className="p-4 rounded-2xl border border-border bg-card shadow-xs">
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
            <Award className="size-4 text-purple-500" /> Cần chấm điểm
          </p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {pendingGradingCount}
          </p>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên sinh viên..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-10 text-sm rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            type="button"
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusFilterChange('all')}
            className="h-9 text-sm rounded-xl font-medium"
          >
            Tất cả ({submittedCount})
          </Button>
          <Button
            type="button"
            variant={statusFilter === 'pending_grade' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusFilterChange('pending_grade')}
            className="h-9 text-sm rounded-xl font-medium"
          >
            Cần chấm ({pendingGradingCount})
          </Button>
          <Button
            type="button"
            variant={statusFilter === 'graded' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusFilterChange('graded')}
            className="h-9 text-sm rounded-xl font-medium"
          >
            Đã chấm ({gradedCount})
          </Button>
        </div>
      </div>

      {/* 4. Submissions Table / Cards */}
      {filteredSubmissions.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-border bg-card/60 space-y-2">
          <Filter className="size-8 text-muted-foreground mx-auto stroke-1" />
          <p className="text-base font-medium text-foreground">Không có bài nộp nào phù hợp</p>
          <p className="text-sm text-muted-foreground">
            Chưa có sinh viên nào nộp bài hoặc không khớp với từ khóa tìm kiếm.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedSubmissions.map((sub) => (
            <SubmissionRow
              key={sub.id}
              submission={sub}
              assignment={assignment}
              onOpenGradeDialog={handleOpenGradeDialog}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {filteredSubmissions.length > PAGE_SIZE && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/60">
          <p className="text-xs text-muted-foreground font-medium">
            Hiển thị {(page - 1) * PAGE_SIZE + 1} -{' '}
            {Math.min(page * PAGE_SIZE, filteredSubmissions.length)} trên tổng số{' '}
            {filteredSubmissions.length} bài nộp
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={safePage <= 1}
              onClick={() => setPage(Math.max(1, safePage - 1))}
              className="h-8 px-2.5 text-xs font-medium gap-1 rounded-lg"
            >
              <ChevronLeft className="size-3.5" />
              <span>Trước</span>
            </Button>
            <span className="text-xs font-semibold px-2 text-foreground">
              Trang {safePage} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={safePage >= totalPages}
              onClick={() => setPage(Math.min(totalPages, safePage + 1))}
              className="h-8 px-2.5 text-xs font-medium gap-1 rounded-lg"
            >
              <span>Sau</span>
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Grade Submission Dialog */}
      <GradeSubmissionDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        submission={selectedSubmission}
        assignment={assignment}
        onGradeSaved={handleGradeSaved}
      />
    </div>
  );
}
