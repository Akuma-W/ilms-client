'use client';

import { useMemo, useState } from 'react';
import { HelpCircle, Plus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DataPagination } from '@/components/shared/data-pagination';
import { ConfirmDeleteModal } from '@/components/common/confirm-delete-modal';
import { ClassTabToolbar } from '@/features/classes/components/layout/class-tab-toolbar';
import { ClassQuizCard } from '@/features/quizzes/components/class-quiz-card';
import { PublishQuizModal } from '@/features/quizzes/components/publish-quiz-modal';
import { EditPublicationModal } from '@/features/quizzes/components/edit-publication-modal';
import { QuizKpiStrip } from '@/features/quizzes/components/quiz-kpi-strip';
import { QuizFilterBar } from '@/features/quizzes/components/quiz-filter-bar';
import { quizPublicationsService } from '@/features/quizzes/services/quiz-publications.service';
import { getQuizDisplayStatus } from '@/features/quizzes/utils/quiz.utils';
import type { QuizClassItem, QuizFilterTab } from '@/types/quiz';
import type { Topic } from '@/types/topic';
import { useCurrentUser } from '@/features/user/hooks/use-current-user';

interface QuizzesClientProps {
  initialQuizzes: QuizClassItem[];
  topics: Topic[];
  classId: string;
  isTeacher: boolean;
  isArchived?: boolean;
}

export function QuizzesClient({
  initialQuizzes,
  topics = [],
  classId,
  isTeacher,
  isArchived = false,
}: QuizzesClientProps) {
  const { user: currentUser } = useCurrentUser();
  const roleCanEdit = isTeacher || currentUser?.role === 'admin';

  const [quizzes, setQuizzes] = useState<QuizClassItem[]>(initialQuizzes);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<QuizFilterTab>('all');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<QuizClassItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [unpublishModal, setUnpublishModal] = useState<{
    isOpen: boolean;
    publicationId: string | null;
    isUnpublishing: boolean;
  }>({
    isOpen: false,
    publicationId: null,
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

  const upcomingCount = useMemo(() => {
    return quizzes.filter((q) => getQuizDisplayStatus(q, now) === 'upcoming').length;
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
      if (filterTab === 'upcoming') {
        return status === 'upcoming';
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

  const handleConfirmUnpublish = async () => {
    if (!unpublishModal.publicationId) return;
    setUnpublishModal((prev) => ({ ...prev, isUnpublishing: true }));
    try {
      const res = await quizPublicationsService.unpublishQuiz(unpublishModal.publicationId);
      if (res.success) {
        toast.success(res.message);
        setQuizzes((prev) =>
          prev.filter((quiz) => quiz.publicationId !== unpublishModal.publicationId),
        );
        setUnpublishModal({ isOpen: false, publicationId: null, isUnpublishing: false });
      }
    } catch {
      toast.error('Gỡ bài thi thất bại. Vui lòng thử lại!');
      setUnpublishModal((prev) => ({ ...prev, isUnpublishing: false }));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* SECTION 1: Standardized ClassTabToolbar */}
      <ClassTabToolbar
        title="Bài thi & Trắc nghiệm"
        description="Kiểm tra trắc nghiệm, đánh giá mức độ tiếp thu và ôn luyện kiến thức bài học."
        icon={HelpCircle}
        iconColorClassName="text-rose-600 dark:text-rose-400"
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Tìm kiếm đề thi, chủ đề bài học..."
        actions={
          roleCanEdit &&
          !isArchived && (
            <Button
              onClick={() => setIsPublishModalOpen(true)}
              className="h-9 px-3.5 text-sm font-semibold rounded-lg gap-1.5 shadow-xs bg-rose-600 hover:bg-rose-700 text-white shrink-0"
            >
              <Plus className="size-4" />
              Xuất bản bài mới
            </Button>
          )
        }
      />

      {/* SECTION 2: KPI Summary Strip */}
      <QuizKpiStrip
        isTeacher={roleCanEdit}
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
        upcomingCount={upcomingCount}
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
          {roleCanEdit && !isArchived && (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {paginatedQuizzes.map((quiz) => (
              <ClassQuizCard
                key={quiz.id}
                quiz={quiz}
                classId={classId}
                isTeacher={roleCanEdit}
                isArchived={isArchived}
                onEditPublication={
                  !isArchived
                    ? (q) => {
                        setEditingQuiz(q);
                        setIsEditModalOpen(true);
                      }
                    : undefined
                }
                onUnpublish={
                  !isArchived
                    ? (publicationId) =>
                        setUnpublishModal({ isOpen: true, publicationId, isUnpublishing: false })
                    : undefined
                }
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <DataPagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={filteredQuizzes.length}
            limit={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Teacher Publish Modal */}
      <PublishQuizModal
        isOpen={isPublishModalOpen}
        onOpenChange={setIsPublishModalOpen}
        preselectedClassId={classId}
        topics={topics}
        onSuccess={async () => {
          const fresh = await quizPublicationsService.getClassPublications(classId);
          setQuizzes(fresh);
        }}
      />

      {/* Teacher Edit Publication Modal */}
      <EditPublicationModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        quizItem={editingQuiz}
        topics={topics}
        onSuccess={async () => {
          const fresh = await quizPublicationsService.getClassPublications(classId);
          setQuizzes(fresh);
        }}
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
