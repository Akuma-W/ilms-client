'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  HelpCircle,
  Loader2,
  Play,
  Search,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { quizAttemptsService } from '@/features/quizzes/services/quiz-attempts.service';
import { formatQuizDateTime } from '@/features/quizzes/utils/quiz.utils';
import type { QuizClassStats, QuizPublication } from '@/types/quiz';
import type { User } from '@/types/user';

interface ClassQuizPublicationClientProps {
  classId: string;
  publicationId: string;
  publication: QuizPublication;
  isTeacher: boolean;
  currentUser: User | null;
}

export function ClassQuizPublicationClient({
  classId,
  publicationId,
  publication,
  isTeacher,
}: ClassQuizPublicationClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'submitted' | 'unsubmitted'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: stats, isLoading: isLoadingStats } = useSWR<QuizClassStats>(
    isTeacher ? ['class-quiz-stats', publicationId] : null,
    () => quizAttemptsService.getClassQuizStats(publicationId),
  );

  const now = new Date();
  const openTime = publication.openAt ? new Date(publication.openAt).getTime() : null;
  const closeTime = publication.closeAt ? new Date(publication.closeAt).getTime() : null;
  const isUpcoming = openTime ? now.getTime() < openTime : false;
  const isClosed = closeTime ? now.getTime() > closeTime : false;
  const isOpen = !isUpcoming && !isClosed;

  const students = stats?.students;
  const filteredStudents = useMemo(() => {
    if (!students) return [];
    return students.filter((student) => {
      const matchSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;

      if (activeTab === 'submitted') return student.isSubmitted;
      if (activeTab === 'unsubmitted') return !student.isSubmitted;
      return true;
    });
  }, [students, searchTerm, activeTab]);

  const completionRate =
    stats && stats.totalStudents > 0
      ? Math.round((stats.submittedCount / stats.totalStudents) * 100)
      : 0;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs h-8 px-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900"
          >
            <Link href={`/classes/${classId}/quizzes`}>
              <ArrowLeft className="size-4 mr-1" />
              <span>Trở về danh sách bài thi lớp</span>
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {isOpen && (
            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs gap-1">
              <Play className="size-3 fill-emerald-600" />
              Đang mở thi
            </Badge>
          )}
          {isUpcoming && (
            <Badge variant="outline" className="bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30 text-xs gap-1">
              <Clock className="size-3" />
              Sắp diễn ra
            </Badge>
          )}
          {isClosed && (
            <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs">
              Đã kết thúc
            </Badge>
          )}
          {publication.quizId && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs h-8 rounded-md gap-1.5 border-slate-300 dark:border-slate-700"
            >
              <Link href={`/quizzes/${publication.quizId}`}>
                <ExternalLink className="size-3.5 text-rose-500" />
                <span>Xem chi tiết đề</span>
              </Link>
            </Button>
          )}
          {isTeacher && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success('Đã tải xuống bảng điểm Excel của lớp!')}
              className="text-xs h-8 rounded-md gap-1.5"
            >
              <Download className="size-3.5" />
              <span>Xuất Excel</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Header Card */}
      <div className="p-6 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 bg-linear-to-r from-white via-rose-50/20 to-indigo-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/60 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                Bài trắc nghiệm lớp học
              </span>
              {publication.topic && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {publication.topic.title}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">
              {publication.quiz?.title || 'Đề thi trắc nghiệm'}
            </h1>
            {publication.quiz?.description && (
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-3xl">
                {publication.quiz.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-right">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Thời lượng</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-end gap-1">
                <Clock className="size-3.5 text-rose-500" />
                {publication.quiz?.timeLimit || 15} phút
              </p>
            </div>
          </div>
        </div>

        {/* Schedule Bar */}
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Calendar className="size-3.5 text-rose-500 shrink-0" />
          <span>
            Thời gian: <strong>{formatQuizDateTime(publication.openAt)}</strong> — <strong>{formatQuizDateTime(publication.closeAt)}</strong>
          </span>
        </div>
      </div>

      {/* Teacher View: Full Class Performance Analytics */}
      {isTeacher ? (
        <div className="space-y-6">
          {/* KPI Analytics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
              <p className="text-[11px] font-semibold text-slate-500">Sĩ số lớp</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{stats?.totalStudents ?? 0}</p>
            </div>
            <div className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/10 shadow-2xs">
              <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Đã nộp bài</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {stats?.submittedCount ?? 0} <span className="text-xs font-normal">({completionRate}%)</span>
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
              <p className="text-[11px] font-semibold text-slate-500">Chưa nộp bài</p>
              <p className="text-xl font-bold text-slate-700 dark:text-slate-300 mt-1">{stats?.notSubmittedCount ?? 0}</p>
            </div>
            <div className="p-4 rounded-xl border border-indigo-200/80 dark:border-indigo-900/40 bg-indigo-50/30 dark:bg-indigo-950/10 shadow-2xs">
              <p className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-400">Điểm trung bình</p>
              <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                {stats?.averageScore !== undefined ? `${stats.averageScore}/10` : '—'}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
              <p className="text-[11px] font-semibold text-slate-500">Điểm cao nhất</p>
              <p className="text-xl font-bold text-emerald-600 mt-1">{stats?.highestScore !== null ? `${stats?.highestScore}/10` : '—'}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
              <p className="text-[11px] font-semibold text-slate-500">Điểm thấp nhất</p>
              <p className="text-xl font-bold text-amber-600 mt-1">{stats?.lowestScore !== null ? `${stats?.lowestScore}/10` : '—'}</p>
            </div>
          </div>

          {/* Student Submissions List & Filter */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 w-fit">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    activeTab === 'all' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  Tất cả ({stats?.totalStudents ?? 0})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('submitted')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    activeTab === 'submitted' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  Đã nộp ({stats?.submittedCount ?? 0})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('unsubmitted')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    activeTab === 'unsubmitted' ? 'bg-white dark:bg-slate-900 text-slate-700 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  Chưa nộp ({stats?.notSubmittedCount ?? 0})
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Tìm học sinh theo tên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-8 text-xs rounded-md"
                />
              </div>
            </div>

            {/* Table */}
            {isLoadingStats ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <Loader2 className="size-5 animate-spin mx-auto mb-2 text-rose-500" />
                Đang tải dữ liệu kết quả của lớp...
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">Không tìm thấy sinh viên nào phù hợp.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                      <th className="py-2.5 px-3">Học sinh</th>
                      <th className="py-2.5 px-3">Trạng thái</th>
                      <th className="py-2.5 px-3 text-center">Điểm số</th>
                      <th className="py-2.5 px-3 text-right">Thời gian nộp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredStudents.map((st) => (
                      <tr key={st.studentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3">
                          <p className="font-bold text-slate-900 dark:text-white">{st.name}</p>
                          <p className="text-[11px] text-slate-400">{st.email}</p>
                        </td>
                        <td className="py-2.5 px-3">
                          {st.isSubmitted ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-sm">
                              <CheckCircle2 className="size-3" /> Đã nộp
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-sm">
                              <XCircle className="size-3" /> Chưa làm
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-sm">
                          {st.score !== null ? (
                            <span className={st.score >= 5 ? 'text-emerald-600' : 'text-red-500'}>
                              {st.score}/10
                            </span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-600">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-500">
                          {st.submittedAt ? formatQuizDateTime(st.submittedAt) : 'Chưa có'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Student View: Ready to take or view result */
        <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs mx-auto space-y-4">
          <HelpCircle className="size-12 text-rose-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sẵn sàng làm bài kiểm tra</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Đề thi gồm các câu hỏi trắc nghiệm khách quan với thời lượng {publication.quiz?.timeLimit || 15} phút.
              Hệ thống sẽ tự động tính giờ và thu bài khi hết thời gian.
            </p>
          </div>
          {isOpen ? (
            <Button
              asChild
              size="lg"
              className="text-sm font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs px-8"
            >
              <Link href={`/classes/${classId}/quizzes/${publicationId}/take`}>
                <Play className="size-4 mr-2 fill-white" />
                Bắt đầu làm bài thi ngay
              </Link>
            </Button>
          ) : isClosed ? (
            <p className="text-xs text-red-500 font-semibold">Đợt thi này đã kết thúc, bạn không thể nộp bài.</p>
          ) : (
            <p className="text-xs text-sky-600 font-semibold">Đợt thi chưa mở, vui lòng quay lại sau.</p>
          )}
        </div>
      )}
    </div>
  );
}
