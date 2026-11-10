'use client';

import { useMemo, useState } from 'react';
import { HelpCircle, MessageSquare, Plus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { ForumCard } from '@/features/forums/components/forum-card';
import { CreateForumModal } from '@/features/forums/components/create-forum-modal';
import { forumsService } from '@/features/forums/services/forums.service';
import type { CreateForumFormData } from '@/features/forums/schemas/forum.schema';
import type { Forum, ForumFilterTab } from '@/types/forum';
import type { User } from '@/types/user';

interface ForumsClientProps {
  initialForums: Forum[];
  classId: string;
  isTeacher: boolean;
  currentUser?: User | null;
}

/**
 * Main Client component for Class Forums tab.
 * Integrates ClassTabToolbar, Facebook-style quick composer, filter tabs, feed, and modals.
 */
export function ForumsClient({
  initialForums,
  classId,
  isTeacher,
  currentUser,
}: ForumsClientProps) {
  const [forums, setForums] = useState<Forum[]>(initialForums);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<ForumFilterTab>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [initialPrefix, setInitialPrefix] = useState('');
  const [editingForum, setEditingForum] = useState<Forum | null>(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    forumId: string | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    forumId: null,
    isDeleting: false,
  });

  // Calculate statistics
  const unansweredCount = useMemo(() => {
    return forums.filter((f) => (f.commentCount ?? f.comments?.length ?? 0) === 0).length;
  }, [forums]);

  const myPostsCount = useMemo(() => {
    if (!currentUser) return 0;
    return forums.filter((f) => f.createdBy === currentUser.id).length;
  }, [forums, currentUser]);

  // Filtered forums feed
  const filteredForums = useMemo(() => {
    return forums.filter((f) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        f.title.toLowerCase().includes(query) ||
        f.content.toLowerCase().includes(query) ||
        (f.author?.fullName || '').toLowerCase().includes(query);

      if (!matchesSearch) return false;

      const commentCount = f.commentCount ?? f.comments?.length ?? 0;
      if (filterTab === 'unanswered') {
        return commentCount === 0;
      }
      if (filterTab === 'my_posts' && currentUser) {
        return f.createdBy === currentUser.id;
      }

      return true;
    });
  }, [forums, searchQuery, filterTab, currentUser]);

  const totalPages = Math.max(1, Math.ceil(filteredForums.length / pageSize));

  const paginatedForums = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredForums.slice(start, start + pageSize);
  }, [filteredForums, currentPage, pageSize]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterTabChange = (tab: ForumFilterTab) => {
    setFilterTab(tab);
    setCurrentPage(1);
  };

  const handleOpenCreateModal = (prefix?: string) => {
    setEditingForum(null);
    setInitialPrefix(prefix || '');
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (forum: Forum) => {
    setEditingForum(forum);
    setIsCreateModalOpen(true);
  };

  const handleCreateOrUpdateForum = async (data: CreateForumFormData) => {
    if (editingForum) {
      const res = await forumsService.updateForum(editingForum.id, data);
      if (res.success && res.data) {
        toast.success(res.message);
        setForums((prev) => prev.map((f) => (f.id === editingForum.id ? (res.data as Forum) : f)));
      } else {
        toast.error('Không thể cập nhật bài viết. Vui lòng thử lại!');
      }
    } else {
      const res = await forumsService.createForum(classId, data);
      if (res.success && res.data) {
        toast.success(res.message);
        setForums((prev) => [res.data as Forum, ...prev]);
        setCurrentPage(1);
      } else {
        toast.error('Không thể tạo chủ đề thảo luận. Vui lòng thử lại!');
      }
    }
  };

  const handleDeleteRequest = (forumId: string) => {
    setDeleteModal({
      isOpen: true,
      forumId,
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.forumId) return;

    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      const res = await forumsService.deleteForum(deleteModal.forumId);
      if (res.success) {
        toast.success(res.message);
        setForums((prev) => prev.filter((f) => f.id !== deleteModal.forumId));
        setDeleteModal({ isOpen: false, forumId: null, isDeleting: false });
      }
    } catch {
      toast.error('Xóa bài viết thất bại. Vui lòng thử lại!');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* SECTION 1: Standardized ClassTabToolbar */}
      <ClassTabToolbar
        title="Diễn đàn trao đổi"
        description="Không gian trao đổi bài học, hỏi đáp thắc mắc và thảo luận chuyên môn."
        icon={MessageSquare}
        iconColorClassName="text-indigo-600 dark:text-indigo-400"
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Tìm kiếm câu hỏi, nội dung thảo luận..."
        actions={
          <Button
            type="button"
            onClick={() => handleOpenCreateModal()}
            className="h-9 px-3.5 text-sm font-semibold rounded-lg gap-1.5 shadow-xs bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
          >
            <Plus className="size-4" />
            <span>Đặt câu hỏi</span>
          </Button>
        }
      />

      {/* Teacher Alert for Unanswered Questions */}
      {isTeacher && unansweredCount > 0 && (
        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <HelpCircle className="size-4 text-amber-500 shrink-0" />
            <span>
              Lớp học hiện có <strong>{unansweredCount}</strong> câu hỏi đang chờ giảng viên giải
              đáp.
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleFilterTabChange('unanswered')}
            className="h-7 px-2.5 text-xs rounded-lg font-semibold border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 shrink-0"
          >
            Xem ngay
          </Button>
        </div>
      )}

      {/* Filter Tabs & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Button
            type="button"
            variant={filterTab === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterTabChange('all')}
            className="h-8 text-xs rounded-xl font-medium"
          >
            Tất cả ({forums.length})
          </Button>

          {isTeacher && (
            <Button
              type="button"
              variant={filterTab === 'unanswered' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterTabChange('unanswered')}
              className="h-8 text-xs rounded-xl font-medium"
            >
              Chưa trả lời ({unansweredCount})
            </Button>
          )}

          {currentUser && (
            <Button
              type="button"
              variant={filterTab === 'my_posts' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterTabChange('my_posts')}
              className="h-8 text-xs rounded-xl font-medium"
            >
              Câu hỏi của tôi ({myPostsCount})
            </Button>
          )}
        </div>

        <Badge
          variant="outline"
          className="text-xs px-2.5 py-1 text-muted-foreground self-start sm:self-auto"
        >
          Hiển thị <strong>{filteredForums.length}</strong> chủ đề
        </Badge>
      </div>

      {/* SECTION 2: Discussion Feed */}
      {filteredForums.length === 0 ? (
        <div className="py-14 px-4 text-center rounded-2xl border border-dashed border-border bg-card/60 space-y-3">
          <div className="size-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Sparkles className="size-6" />
          </div>
          <h4 className="text-base font-bold text-foreground">Không tìm thấy bài thảo luận nào</h4>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {searchQuery
              ? `Không có chủ đề nào khớp với từ khóa "${searchQuery}". Vui lòng thử lại với từ khóa khác.`
              : 'Chưa có bài thảo luận nào trong danh mục này. Hãy là người đầu tiên đặt câu hỏi cho lớp!'}
          </p>
          <Button
            type="button"
            onClick={() => handleOpenCreateModal()}
            className="h-9 px-4 text-xs font-semibold rounded-xl gap-1.5 shadow-xs bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="size-4" />
            <span>Tạo câu hỏi đầu tiên</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3.5">
            {paginatedForums.map((forum) => (
              <ForumCard
                key={forum.id}
                forum={forum}
                classId={classId}
                currentUser={currentUser}
                isTeacher={isTeacher}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteRequest}
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

      {/* Create / Edit Forum Modal */}
      <CreateForumModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateOrUpdateForum}
        currentUser={currentUser}
        initialPrefix={initialPrefix}
        forumToEdit={editingForum}
      />

      {/* Universal Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, isOpen: open }))}
        title="Xác nhận xóa chủ đề thảo luận"
        description="Bạn có chắc chắn muốn xóa bài thảo luận này không? Toàn bộ các câu trả lời liên quan cũng sẽ bị xóa và hành động này không thể hoàn tác."
        itemTypeLabel="chủ đề thảo luận"
        itemName="Bài viết"
        isDeleting={deleteModal.isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
