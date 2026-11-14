'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Eye,
  HelpCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { quizAttemptsService } from '@/features/quizzes/services/quiz-attempts.service';
import { formatQuizDateTime, mapQuizPublicationToClassItem } from '@/features/quizzes/utils/quiz.utils';
import { ClassQuizStatsKpi } from '@/features/quizzes/components/stats/class-quiz-stats-kpi';
import { ClassQuizScoreChart } from '@/features/quizzes/components/stats/class-quiz-score-chart';
import { ClassQuizStudentsTable } from '@/features/quizzes/components/stats/class-quiz-students-table';
import { EditPublicationModal } from '@/features/quizzes/components/edit-publication-modal';
import { ClassStudentAttemptHistory } from '@/features/quizzes/components/class-student-attempt-history';
import { ReviewMode } from '@/types/enum';
import type { QuizAttempt, QuizClassStats, QuizPublication } from '@/types/quiz';
import type { User } from '@/types/user';

interface ClassQuizPublicationClientProps {
  classId: string;
  publicationId: string;
  publication: QuizPublication;
  isTeacher: boolean;
  currentUser: User | null;
}

// Detailed class quiz publication dashboard with analytics and student history
export function ClassQuizPublicationClient({
  classId,
  publicationId,
  publication,
  isTeacher,
}: ClassQuizPublicationClientProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: stats, isLoading: isLoadingStats } = useSWR<QuizClassStats>(
    isTeacher ? ['class-quiz-stats', publicationId] : null,
    () => quizAttemptsService.getClassQuizStats(publicationId),
  );

  const { data: userAttempts = [] } = useSWR<QuizAttempt[]>(
    !isTeacher && publication.quizId
      ? ['class-student-quiz-attempts', publication.quizId, publicationId]
      : null,
    () => quizAttemptsService.getUserAttempts(publication.quizId, publicationId),
  );

  const totalPoints = publication.quiz?.totalPoints || 10;
  const now = new Date();
  const openTime = publication.openAt ? new Date(publication.openAt).getTime() : null;
  const closeTime = publication.closeAt ? new Date(publication.closeAt).getTime() : null;
  const isUpcoming = openTime ? now.getTime() < openTime : false;
  const isClosed = closeTime ? now.getTime() > closeTime : false;
  const isOpen = !isUpcoming && !isClosed;

  const latestAttempt = publication.latestUserAttempt;
  const hasSubmitted = !!latestAttempt?.submittedAt;
  const quizClassItem = mapQuizPublicationToClassItem(publication, classId);

  const getReviewModeLabel = (mode?: ReviewMode) => {
    switch (mode) {
      case ReviewMode.immediate:
        return 'Xem đáp án sau mỗi câu trả lời';
      case ReviewMode.after_closed:
        return 'Xem đáp án sau khi hết hạn đợt thi';
      case ReviewMode.never:
        return 'Không hiển thị đáp án';
      case ReviewMode.after_submission:
      default:
        return 'Xem đáp án sau khi nộp bài';
    }
  };

  // Export CSV of classroom students scores
  const handleExportCSV = () => {
    if (!stats || !stats.students || stats.students.length === 0) {
      toast.info('Chưa có dữ liệu học sinh để xuất file');
      return;
    }
    const header = 'Họ và tên,Email,MSSV,Trạng thái,Điểm số,Thời gian nộp\n';
    const rows = stats.students
      .map((st) => {
        const score = st.score !== null ? `${st.score}` : '';
        const status = st.isSubmitted ? 'Đã nộp' : 'Chưa làm';
        const time = st.submittedAt ? formatQuizDateTime(st.submittedAt) : '';
        return `"${st.name}","${st.email}","${st.identityCode || ''}","${status}","${score}","${time}"`;
      })
      .join('\n');

    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bang_diem_${publication.quiz?.title || 'quiz'}_${classId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Đã tải xuống bảng điểm CSV của lớp!');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/50">
        <Button asChild variant="ghost" size="sm" className="text-xs h-8 px-2 text-muted-foreground w-fit">
          <Link href={`/classes/${classId}/quizzes`}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Trở về danh sách bài thi lớp</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2 flex-wrap">
          {isOpen && (
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs gap-1">
              <Play className="w-3 h-3 fill-emerald-600" />
              Đang mở thi
            </Badge>
          )}
          {isUpcoming && (
            <Badge variant="outline" className="bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30 text-xs gap-1">
              <Clock className="w-3 h-3" />
              Sắp diễn ra
            </Badge>
          )}
          {isClosed && (
            <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">
              Đã kết thúc
            </Badge>
          )}
          {publication.quizId && (
            <Button asChild variant="outline" size="sm" className="text-xs h-8 gap-1.5">
              <Link href={`/quizzes/${publication.quizId}`}>
                <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
                <span>Xem chi tiết đề</span>
              </Link>
            </Button>
          )}
          {isTeacher && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                className="text-xs h-8 gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>Chỉnh sửa đợt thi</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="text-xs h-8 gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất CSV</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Header Card */}
      <div className="p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-rose-500/10 text-rose-500 border border-rose-500/20">
                Bài trắc nghiệm lớp học
              </span>
              {publication.topic && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  {publication.topic.title}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
              {publication.quiz?.title || 'Đề thi trắc nghiệm'}
            </h1>
            {publication.quiz?.description && (
              <p className="text-xs text-muted-foreground max-w-3xl">
                {publication.quiz.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3 py-1.5 rounded-lg border border-border/60 bg-muted/30 text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Thời lượng</p>
              <p className="text-sm font-bold text-foreground flex items-center justify-end gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                {publication.quiz?.timeLimit || 15} phút
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-lg border border-border/60 bg-muted/30 text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Thang điểm</p>
              <p className="text-sm font-bold text-emerald-500">
                {totalPoints} đ
              </p>
            </div>
          </div>
        </div>

        {/* Schedule & Review Mode Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground pt-3 border-t border-border/40">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>
              Thời gian: <strong>{formatQuizDateTime(publication.openAt)}</strong> — <strong>{formatQuizDateTime(publication.closeAt)}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-500 font-medium">
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span>{getReviewModeLabel(publication.reviewMode)}</span>
          </div>
        </div>
      </div>

      {/* Teacher View: Full Class Performance Analytics */}
      {isTeacher ? (
        <div className="space-y-6">
          <ClassQuizStatsKpi stats={stats} totalPoints={totalPoints} />
          <ClassQuizScoreChart attempts={stats?.students || []} totalPoints={totalPoints} />
          <ClassQuizStudentsTable
            students={stats?.students || []}
            classId={classId}
            publicationId={publicationId}
            totalPoints={totalPoints}
            isLoading={isLoadingStats}
          />
        </div>
      ) : (
        /* Student View: Action card and Personal attempt history */
        <div className="space-y-6">
          <div className="p-8 text-center rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-xs mx-auto space-y-5 max-w-2xl">
            {hasSubmitted ? (
              <>
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">Bạn đã nộp bài thi này</h3>
                  <p className="text-xs text-muted-foreground">
                    Điểm số đạt được:{' '}
                    <strong className="text-emerald-500 text-base">
                      {latestAttempt?.score !== null ? `${latestAttempt?.score}/${totalPoints} đ` : 'Đang xử lý'}
                    </strong>
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {latestAttempt?.id && (
                    <Button asChild size="default" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5">
                      <Link href={`/classes/${classId}/quizzes/${publicationId}/attempts/${latestAttempt.id}`}>
                        <ExternalLink className="w-4 h-4" />
                        <span>Xem lại bài làm chi tiết</span>
                      </Link>
                    </Button>
                  )}
                  {isOpen && (
                    <Button asChild variant="outline" size="default" className="gap-1.5">
                      <Link href={`/classes/${classId}/quizzes/${publicationId}/take`}>
                        <RotateCcw className="w-4 h-4" />
                        <span>Làm lại bài thi</span>
                      </Link>
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto">
                  <HelpCircle className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">Sẵn sàng làm bài kiểm tra</h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Đề thi gồm các câu hỏi trắc nghiệm khách quan với thời lượng {publication.quiz?.timeLimit || 15} phút.
                    Hệ thống sẽ tự động tính giờ và thu bài khi hết thời gian.
                  </p>
                </div>
                {isOpen ? (
                  <Button
                    asChild
                    size="lg"
                    className="text-sm font-semibold rounded-xl bg-linear-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white shadow-md px-8"
                  >
                    <Link href={`/classes/${classId}/quizzes/${publicationId}/take`}>
                      <Play className="w-4 h-4 mr-2 fill-white" />
                      Bắt đầu làm bài thi ngay
                    </Link>
                  </Button>
                ) : isClosed ? (
                  <p className="text-xs text-rose-500 font-semibold">Đợt thi này đã kết thúc, bạn không thể nộp bài.</p>
                ) : (
                  <p className="text-xs text-sky-500 font-semibold">Đợt thi chưa mở, vui lòng quay lại sau.</p>
                )}
              </>
            )}
          </div>

          {/* Student Attempt History List Component */}
          <ClassStudentAttemptHistory
            userAttempts={userAttempts}
            totalPoints={totalPoints}
            classId={classId}
            publicationId={publicationId}
          />
        </div>
      )}

      {/* Teacher Edit Publication Modal */}
      {quizClassItem && (
        <EditPublicationModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          quizItem={quizClassItem}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
}
