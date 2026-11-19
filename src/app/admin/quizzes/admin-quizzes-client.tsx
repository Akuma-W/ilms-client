'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAdminQuizzes } from '@/features/admin/hooks/use-admin-quizzes';
import { adminQuizzesService } from '@/features/admin/services/admin-quizzes.service';
import { AdminQuiz } from '@/types/admin';
import { AdminQuizzesTable } from '@/features/admin/components/quizzes/admin-quizzes-table';
import { AdminQuizPreviewModal } from '@/features/admin/components/quizzes/admin-quiz-preview-modal';
import { AdminQuizTakedownModal } from '@/features/admin/components/quizzes/admin-quiz-takedown-modal';
import { AdminActionReasonModal } from '@/features/admin/components/shared/admin-action-reason-modal';

export function AdminQuizzesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private' | undefined>(undefined);
  const [status, setStatus] = useState<'published' | 'draft' | undefined>(undefined);

  const [previewQuizId, setPreviewQuizId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [takedownQuiz, setTakedownQuiz] = useState<AdminQuiz | null>(null);
  const [takedownOpen, setTakedownOpen] = useState(false);

  const [deleteQuiz, setDeleteQuiz] = useState<AdminQuiz | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const limit = 10;

  const { quizzes, total, totalPages, mutate } = useAdminQuizzes({
    page,
    limit,
    search,
    visibility,
    status,
  });

  const handlePreview = (quiz: AdminQuiz) => {
    setPreviewQuizId(quiz.id);
    setPreviewOpen(true);
  };

  const handleTakedown = (quiz: AdminQuiz) => {
    setTakedownQuiz(quiz);
    setTakedownOpen(true);
  };

  const handleForceDelete = (quiz: AdminQuiz) => {
    setDeleteQuiz(quiz);
    setDeleteOpen(true);
  };

  const onConfirmForceDelete = async (reason: string) => {
    if (!deleteQuiz) return;
    setIsDeleting(true);
    try {
      const res = await adminQuizzesService.forceDeleteQuiz(deleteQuiz.id, reason);
      if (res.success) {
        toast.success(res.message);
        setDeleteOpen(false);
        mutate();
      } else {
        toast.error(res.message);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Xóa cưỡng chế thất bại';
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleVisibilityChange = (val?: 'public' | 'private') => {
    setVisibility(val);
    setPage(1);
  };

  const handleStatusChange = (val?: 'published' | 'draft') => {
    setStatus(val);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-amber-950 dark:text-amber-100">
          Quản lý Bài trắc nghiệm & Kiểm duyệt Bản quyền
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Giám sát nội dung khảo thí toàn hệ thống, kiểm duyệt bản quyền và xử lý đề thi vi phạm
        </p>
      </div>

      {/* Quizzes Table */}
      <AdminQuizzesTable
        quizzes={quizzes}
        total={total}
        page={page}
        limit={limit}
        totalPages={totalPages}
        search={search}
        visibility={visibility}
        status={status}
        onSearchChange={handleSearchChange}
        onVisibilityChange={handleVisibilityChange}
        onStatusChange={handleStatusChange}
        onPageChange={setPage}
        onPreview={handlePreview}
        onTakedown={handleTakedown}
        onForceDelete={handleForceDelete}
      />

      {/* Audit Preview Modal */}
      <AdminQuizPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        quizId={previewQuizId}
      />

      {/* Copyright Takedown Modal */}
      <AdminQuizTakedownModal
        open={takedownOpen}
        onOpenChange={setTakedownOpen}
        quiz={takedownQuiz}
        onSuccess={() => mutate()}
      />

      {/* Universal Action Reason Modal for Quiz Force Delete */}
      <AdminActionReasonModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Gỡ bỏ cưỡng chế đề thi vi phạm"
        targetName={deleteQuiz?.title}
        description="Lưu ý: Hành động này sẽ xóa vĩnh viễn đề thi, câu hỏi và toàn bộ kết quả thi liên quan khỏi hệ thống do vi phạm bản quyền."
        placeholder="Nhập lý do xóa ép buộc (VD: Vi phạm bản quyền nghiêm trọng, nội dung không phù hợp...)"
        actionLabel="Xác nhận xóa vĩnh viễn"
        variant="danger"
        requireReason={true}
        isSubmitting={isDeleting}
        onConfirm={onConfirmForceDelete}
      />
    </div>
  );
}
