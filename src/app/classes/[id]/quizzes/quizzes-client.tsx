'use client';

import { useMemo, useState } from 'react';
import { HelpCircle, Plus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ConfirmDeleteModal } from '@/components/common/confirm-delete-modal';
import { ClassTabToolbar } from '@/features/classes/components/layout/class-tab-toolbar';
import { ClassQuizCard } from '@/features/quizzes/components/class-quiz-card';
import { PublishQuizModal } from '@/features/quizzes/components/publish-quiz-modal';
import { QuizClassStatsModal } from '@/features/quizzes/components/quiz-class-stats-modal';
import { QuizKpiStrip } from '@/features/quizzes/components/quiz-kpi-strip';
import { QuizFilterBar } from '@/features/quizzes/components/quiz-filter-bar';
import { quizzesService } from '@/features/quizzes/services/quizzes.service';
import { getQuizDisplayStatus } from '@/features/quizzes/utils/quiz.utils';
import type { PublishQuizFormData } from '@/features/quizzes/schemas/quiz.schema';
import type { QuizClassItem, QuizFilterTab } from '@/types/quiz';
import type { Topic } from '@/types/topic';
import type { User } from '@/types/user';

interface QuizzesClientProps {
  initialQuizzes: QuizClassItem[];
  topics: Topic[];
  classId: string;
  isTeacher: boolean;
  currentUser?: User | null;
}

/**
 * Main Client component for Classroom Quizzes tab.
 * Connects ClassTabToolbar, KPI summary strip, status/topic filters, responsive grid,
 * and teacher modals for publishing, unpublishing, and class evaluation stats.
 */
export function QuizzesClient({
  initialQuizzes,
  topics = [],
  classId,
  isTeacher,
}: QuizzesClientProps) {
  const [quizzes, setQuizzes] = useState<QuizClassItem[]>(initialQuizzes);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<QuizFilterTab>('all');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modals state
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedStatsQuiz, setSelectedStatsQuiz] = useState<QuizClassItem | null>(null);
  const [unpublishModal, setUnpublishModal] = useState<{
    isOpen: boolean;
    quizId: string | null;
    isUnpublishing: boolean;
  }>({
    isOpen: false,
    quizId: null,
    isUnpublishing: false,
  });

  const now = useMemo(() => new Date(), []);

  // Calculate KPI metrics
  const openCount = useMemo(() => {
    return quizzes.filter((q) => {
      const status = getQuizDisplayStatus(q, now);
      return status === 'not_submitted_open' || status === 'submitted_open';
    }).length;
  }, [quizzes, now]);

  const completedCount = useMemo(() => {
    return quizzes.filter((q) => Boolean(q.currentUserAttempt?.submittedAt)).length;
  }, [quizzes]);

  const studentAvgScore = useMemo(() => {
    const scoredAttempts = quizzes
      .map((q) => q.currentUserAttempt?.score)
      .filter((s): s is number => s !== null && s !== undefined);
    if (scoredAttempts.length === 0) return 0;
    const sum = scoredAttempts.reduce((acc, curr) => acc + curr, 0);
    return Math.round((sum / scoredAttempts.length) * 10) / 10;
  }, [quizzes]);

  // Filter quizzes feed
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        q.title.toLowerCase().includes(query) ||
        (q.description || '').toLowerCase().includes(query) ||
        (q.topicName || '').toLowerCase().includes(query);

      if (!matchesSearch) return false;

      if (selectedTopicId !== 'all' && q.topicId !== selectedTopicId) {
        return false;
      }

      const status = getQuizDisplayStatus(q, now);
      if (filterTab === 'open') {
        return status === 'not_submitted_open' || status === 'submitted_open';
      }
      if (filterTab === 'completed') {
        return status === 'submitted_open' || status === 'submitted_closed';
      }
      if (filterTab === 'closed') {
        return status === 'not_submitted_closed' || status === 'submitted_closed';
      }

      return true;
    });
  }, [quizzes, searchQuery, selectedTopicId, filterTab, now]);

  const totalPages = Math.max(1, Math.ceil(filteredQuizzes.length / pageSize));

  const paginatedQuizzes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredQuizzes.slice(start, start + pageSize);
  }, [filteredQuizzes, currentPage, pageSize]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePublishQuiz = async (data: PublishQuizFormData, topicName?: string) => {
    try {
      const openAt = data.openAt ? new Date(data.openAt).toISOString() : new Date().toISOString();
      const closeAt = data.closeAt
        ? new Date(data.closeAt).toISOString()
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const res = await quizzesService.publishQuiz(
        classId,
        {
          quizId: data.quizId,
          topicId: data.topicId,
          openAt,
          closeAt,
        },
        topicName,
      );

      if (res.success && res.data) {
        toast.success(res.message);
        setQuizzes((prev) => [res.data, ...prev.filter((q) => q.id !== res.data.id)]);
        setCurrentPage(1);
      } else {
        toast.error('Không thể xuất bản bài thi. Vui lòng thử lại!');
      }
    } catch {
      toast.error('Có lỗi xảy ra khi xuất bản bài thi. Vui lòng thử lại!');
    }
  };

  const handleConfirmUnpublish = async () => {
    if (!unpublishModal.quizId) return;
    setUnpublishModal((prev) => ({ ...prev, isUnpublishing: true }));
    try {
      const res = await quizzesService.unpublishQuiz(classId, unpublishModal.quizId);
      if (res.success) {
        toast.success(res.message);
        setQuizzes((prev) => prev.filter((q) => q.id !== unpublishModal.quizId));
        setUnpublishModal({ isOpen: false, quizId: null, isUnpublishing: false });
      }
    } catch {
      toast.error('Gỡ bài thi thất bại. Vui lòng thử lại!');
      setUnpublishModal((prev) => ({ ...prev, isUnpublishing: false }));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* SECTION 1: Standardized ClassTabToolbar (Rose Crimson Token) */}
      <ClassTabToolbar
        title="Bài thi & Trắc nghiệm"
        description="Kiểm tra trắc nghiệm, đánh giá mức độ tiếp thu và ôn luyện kiến thức bài học."
        icon={HelpCircle}
        iconColorClassName="text-rose-600 dark:text-rose-400"
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Tìm kiếm đề thi, chủ đề bài học..."
        actions={
          isTeacher ? (
            <Button
              type="button"
              onClick={() => setIsPublishModalOpen(true)}
              className="h-9 px-3.5 text-sm font-semibold rounded-lg gap-1.5 shadow-xs bg-rose-600 hover:bg-rose-700 text-white shrink-0"
            >
              <Plus className="size-4" />
              <span>Xuất bản bài mới</span>
            </Button>
          ) : undefined
        }
      />

      {/* SECTION 2: KPI Summary Strip */}
      <QuizKpiStrip
        isTeacher={isTeacher}
        totalQuizzes={quizzes.length}
        openCount={openCount}
        completedCount={completedCount}
        studentAvgScore={studentAvgScore}
      />

      {/* SECTION 3: Filter Controls (Status Tabs + Topic Selector) */}
      <QuizFilterBar
        filterTab={filterTab}
        onFilterTabChange={(tab) => {
          setFilterTab(tab);
          setCurrentPage(1);
        }}
        totalQuizzesCount={quizzes.length}
        openCount={openCount}
        completedCount={completedCount}
        topics={topics}
        selectedTopicId={selectedTopicId}
        onTopicChange={(topicId) => {
          setSelectedTopicId(topicId);
          setCurrentPage(1);
        }}
      />

      {/* SECTION 4: Quiz Cards Grid */}
      {filteredQuizzes.length === 0 ? (
        <div className="py-14 px-4 text-center rounded-2xl border border-dashed border-border bg-card/60 space-y-3">
          <div className="size-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <Sparkles className="size-6" />
          </div>
          <h4 className="text-base font-bold text-foreground">
            Không tìm thấy bài trắc nghiệm nào
          </h4>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {searchQuery
              ? `Không có bài thi nào khớp với từ khóa "${searchQuery}". Vui lòng thử lại với từ khóa khác.`
              : 'Hiện chưa có bài trắc nghiệm nào trong danh mục hoặc chủ đề này.'}
          </p>
          {isTeacher && (
            <Button
              type="button"
              onClick={() => setIsPublishModalOpen(true)}
              className="h-9 px-4 text-sm font-semibold rounded-xl gap-1.5 shadow-xs bg-rose-600 hover:bg-rose-700 text-white"
            >
              <Plus className="size-4" />
              <span>Xuất bản bài trắc nghiệm đầu tiên</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedQuizzes.map((quiz) => (
              <ClassQuizCard
                key={quiz.id}
                quiz={quiz}
                classId={classId}
                isTeacher={isTeacher}
                onViewStats={(selected) => setSelectedStatsQuiz(selected)}
                onUnpublish={(quizId) =>
                  setUnpublishModal({ isOpen: true, quizId, isUnpublishing: false })
                }
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center pt-3">
              <Pagination className="mx-0 w-auto">
                <PaginationContent className="gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={
                        currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === currentPage}
                        onClick={() => setCurrentPage(p)}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}

      {/* Teacher Publish Modal */}
      <PublishQuizModal
        isOpen={isPublishModalOpen}
        onOpenChange={setIsPublishModalOpen}
        topics={topics}
        onSubmit={handlePublishQuiz}
      />

      {/* Teacher Class Evaluation Stats Modal */}
      <QuizClassStatsModal
        isOpen={Boolean(selectedStatsQuiz)}
        onOpenChange={(open) => !open && setSelectedStatsQuiz(null)}
        quiz={selectedStatsQuiz}
        classId={classId}
      />

      {/* Universal Unpublish Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={unpublishModal.isOpen}
        onOpenChange={(open) => setUnpublishModal((prev) => ({ ...prev, isOpen: open }))}
        title="Xác nhận gỡ bài trắc nghiệm khỏi lớp"
        description="Bạn có chắc chắn muốn gỡ bài trắc nghiệm này ra khỏi lớp học không? Đề thi gốc trong kho bài thi cá nhân của bạn vẫn được bảo toàn nguyên vẹn 100%."
        itemTypeLabel="bài trắc nghiệm"
        itemName="Đề thi đã chọn"
        isDeleting={unpublishModal.isUnpublishing}
        onConfirm={handleConfirmUnpublish}
      />
    </div>
  );
}
