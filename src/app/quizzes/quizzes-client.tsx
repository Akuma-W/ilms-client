'use client';

import { useState, useEffect, useCallback } from 'react';
import { QuizRepositoryToolbar } from '@/features/quizzes/components/repository/quiz-repository-toolbar';
import { QuizRepositoryCard } from '@/features/quizzes/components/repository/quiz-repository-card';
import { QuizDashboardHeader } from '@/features/quizzes/components/repository/quiz-dashboard-header';
import { QuizGridSkeleton } from '@/features/quizzes/components/repository/quiz-grid-skeleton';
import { QuizEmptyState } from '@/features/quizzes/components/repository/quiz-empty-state';
import { QuizPagination } from '@/features/quizzes/components/repository/quiz-pagination';
import { useQuizzes } from '@/features/quizzes/hooks/use-quizzes';
import { useCurrentUser } from '@/features/user/hooks/use-current-user';
import { quizzesService } from '@/features/quizzes/services/quizzes.service';
import type { PaginatedQuizzesResult, Quiz } from '@/types/quiz';
import type { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDeleteModal } from '@/components/common/confirm-delete-modal';

interface QuizzesClientProps {
  currentUser?: User | null;
  initialData: PaginatedQuizzesResult<Quiz> | null;
}

export function QuizzesClient({ currentUser, initialData }: QuizzesClientProps) {
  const { user } = useCurrentUser({ initialUser: currentUser });
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  // Delete modal state
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search input 350ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // SWR hook — fetches quizzes for current tab + search + page
  const query = {
    scope: activeTab === 'all' ? ('all' as const) : ('my' as const),
    search: debouncedSearch || undefined,
    page,
    limit: 12,
  };
  const usesInitialQuery = activeTab === 'all' && !debouncedSearch && page === 1;
  const { data, isLoading, error, mutate } = useQuizzes({
    query,
    initialData: usesInitialQuery ? (initialData ?? undefined) : undefined,
  });

  // Handles tab switch
  const handleTabChange = useCallback((tab: 'all' | 'my') => {
    setActiveTab(tab);
    setPage(1);
    setSearchTerm('');
  }, []);

  // Handles cloning a public quiz into personal library
  const handleCloneQuiz = async (quiz: Quiz) => {
    try {
      toast.loading('Đang sao chép đề thi về kho...');
      await quizzesService.cloneQuiz(quiz.id);
      toast.dismiss();
      toast.success(`Đã sao chép "${quiz.title}" về kho cá nhân!`);
      handleTabChange('my');
    } catch (err: unknown) {
      toast.dismiss();
      const msg = err instanceof Error ? err.message : 'Không thể sao chép đề thi';
      toast.error(msg);
    }
  };

  // Handles confirming quiz deletion
  const handleConfirmDelete = async () => {
    if (!quizToDelete) return;
    try {
      setIsDeleting(true);
      await quizzesService.deleteQuiz(quizToDelete.id);
      toast.success('Xóa đề thi thành công!');
      setQuizToDelete(null);
      mutate();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể xóa đề thi';
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Derived computed stats for KPI strip
  const totalItems = data?.meta.total ?? 0;
  const totalPages = data?.meta.totalPages ?? 1;
  const totalQuestions = data?.items.reduce(
    (sum, q) => sum + (q.totalQuestions ?? q.questions?.length ?? 0),
    0,
  );
  const totalAttempts = data?.items.reduce((sum, q) => sum + (q.attemptCount ?? 0), 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header + KPI strip */}
      <QuizDashboardHeader
        activeTab={activeTab}
        totalItems={totalItems}
        totalQuestions={totalQuestions}
        totalAttempts={totalAttempts}
      />

      {/* Toolbar: Tabs + Search + Create button */}
      <QuizRepositoryToolbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        publicCount={activeTab === 'all' ? totalItems : undefined}
        myCount={activeTab === 'my' ? totalItems : undefined}
      />

      {/* Error banner */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => mutate()}
            className="text-sm h-8 rounded-md shrink-0"
          >
            Thử lại
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && <QuizGridSkeleton count={6} />}

      {/* Empty State */}
      {!isLoading && !error && (!data || data.items.length === 0) && (
        <QuizEmptyState activeTab={activeTab} hasSearch={Boolean(debouncedSearch)} />
      )}

      {/* Quiz Card Grid */}
      {!isLoading && data && data.items.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((quiz) => {
              const isOwner = user?.id === quiz.createdBy;
              return (
                <QuizRepositoryCard
                  key={quiz.id}
                  quiz={quiz}
                  isOwner={isOwner}
                  onClone={!isOwner ? handleCloneQuiz : undefined}
                  onDelete={isOwner ? (item) => setQuizToDelete(item) : undefined}
                />
              );
            })}
          </div>

          <QuizPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteModal
        isOpen={Boolean(quizToDelete)}
        onOpenChange={() => setQuizToDelete(null)}
        title="Xác nhận xóa đề thi"
        description={`Bạn có chắc chắn muốn xóa đề thi ${quizToDelete?.title}? Toàn bộ câu hỏi và đáp án bên trong sẽ bị xóa vĩnh viễn và không thể khôi phục.`}
        itemName={quizToDelete?.title}
        itemTypeLabel="đề thi"
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
