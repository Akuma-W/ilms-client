'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { ClipboardList, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ClassTabToolbar } from '@/features/classes/components/layout/class-tab-toolbar';
import { ConfirmDeleteModal } from '@/components/common/confirm-delete-modal';
import { AssignmentFilterTabs } from '@/features/assignments/components/assignment-filter-tabs';
import { AssignmentCard } from '@/features/assignments/components/assignment-card';
import { assignmentsService } from '@/features/assignments/services/assignments.service';
import type { Assignment, AssignmentFilterStatus } from '@/types/assignment';
import type { Topic } from '@/types/topic';

interface AssignmentsClientProps {
  classId: string;
  initialAssignments?: Assignment[];
  isTeacher: boolean;
  studentId?: string;
  topics?: Topic[];
}

/**
 * Client Component for Classroom Assignments tab.
 * Adheres to Amber Orange theme, Clean Architecture, and Single Responsibility Principle.
 */
export function AssignmentsClient({
  classId,
  initialAssignments = [],
  isTeacher,
  studentId,
  topics = [],
}: AssignmentsClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState<AssignmentFilterStatus>('all');

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    assignment: Assignment | null;
    isDeleting: boolean;
  }>({ isOpen: false, assignment: null, isDeleting: false });

  // SWR for assignments with automatic revalidation on mount
  const { data: assignments = [], mutate } = useSWR(
    `classes/${classId}/assignments-data`,
    () => assignmentsService.getAssignments(classId),
    {
      fallbackData: initialAssignments,
    },
  );

  const topicMap = useMemo(() => {
    const map = new Map<string, string>();
    topics.forEach((t) => map.set(t.id, t.title));
    return map;
  }, [topics]);

  // Filter assignments based on search keyword and active status tab
  const filteredAssignments = useMemo(() => {
    const now = new Date().getTime();

    return assignments.filter((a) => {
      // 1. Search keyword filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = a.title.toLowerCase().includes(query);
        const matchesDesc = a.description?.toLowerCase().includes(query);
        const topicName = a.topicId ? topicMap.get(a.topicId)?.toLowerCase() : '';
        const matchesTopic = topicName?.includes(query);
        if (!matchesTitle && !matchesDesc && !matchesTopic) return false;
      }

      // 2. Status tab filter
      if (currentTab === 'all') return true;

      const isPastDue = a.dueAt ? new Date(a.dueAt).getTime() < now : false;
      const userSub = studentId ? a.submissions?.find((s) => s.studentId === studentId) : undefined;

      if (isTeacher) {
        if (currentTab === 'pending') return !isPastDue;
        if (currentTab === 'overdue') return isPastDue;
        return true;
      }

      // Student perspective
      if (currentTab === 'pending') return !userSub && !isPastDue;
      if (currentTab === 'submitted')
        return !!userSub && (userSub.score === null || userSub.score === undefined);
      if (currentTab === 'graded')
        return !!userSub && userSub.score !== null && userSub.score !== undefined;
      if (currentTab === 'overdue') return !userSub && isPastDue;

      return true;
    });
  }, [assignments, searchQuery, currentTab, isTeacher, studentId, topicMap]);

  const handleDeleteAssignment = (assignment: Assignment) => {
    setDeleteModal({
      isOpen: true,
      assignment,
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.assignment) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      const res = await assignmentsService.deleteAssignment(deleteModal.assignment.id);
      if (!res.success) throw new Error(res.message);
      toast.success('Xóa bài tập thành công!');
      mutate();
      setDeleteModal({ isOpen: false, assignment: null, isDeleting: false });
    } catch (error) {
      toast.error('Xóa bài tập thất bại', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại.',
      });
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const getEmptySubtitle = () => {
    if (searchQuery.trim()) {
      return 'Vui lòng thử tìm kiếm lại với tiêu đề hoặc chủ đề khác.';
    }
    if (isTeacher) {
      return 'Hãy bấm nút "Giao bài tập" ở trên để tạo đề bài đầu tiên cho lớp học.';
    }
    switch (currentTab) {
      case 'all':
      case 'pending':
        return 'Giảng viên chưa giao bài tập nào cho bạn.';
      case 'submitted':
        return 'Bạn chưa nộp bài tập nào.';
      case 'graded':
        return 'Giảng viên chưa chấm bài tập nào của bạn.';
      case 'overdue':
        return 'Bạn chưa có bài tập nào quá hạn.';
      default:
        return 'Giảng viên chưa giao bài tập nào cho bạn.';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Header Toolbar (ClassTabToolbar with Direct Action Button) */}
      <ClassTabToolbar
        title="Bài tập & Thực hành"
        description="Quản lý danh sách bài tập, thời hạn nộp bài và chấm điểm học thuật."
        icon={ClipboardList}
        iconColorClassName="text-amber-600 dark:text-amber-400"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Tìm kiếm bài tập..."
        actions={
          isTeacher && (
            <Button
              onClick={() => router.push(`/classes/${classId}/assignments/create`)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium gap-2 shadow-xs"
            >
              <Plus className="size-4" />
              <span>Giao bài tập</span>
            </Button>
          )
        }
      />

      {/* 2. Filter Status Tabs */}
      <AssignmentFilterTabs
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        assignments={assignments}
        isTeacher={isTeacher}
        studentId={studentId}
      />

      {/* 3. Assignments List */}
      {filteredAssignments.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-card/40">
          <div className="flex items-center justify-center size-12 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto mb-3">
            <Search className="size-6" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            {searchQuery
              ? 'Không tìm thấy bài tập nào phù hợp với từ khóa'
              : 'Chưa có bài tập nào trong phân loại này'}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
            {getEmptySubtitle()}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              classId={classId}
              isTeacher={isTeacher}
              studentId={studentId}
              topicTitle={assignment.topicId ? topicMap.get(assignment.topicId) : undefined}
              onDelete={handleDeleteAssignment}
            />
          ))}
        </div>
      )}

      {/* 4. Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onOpenChange={(open) => !open && setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
        title="Xác nhận xóa bài tập"
        description="Toàn bộ nội dung đề bài và danh sách bài nộp của sinh viên sẽ bị xóa vĩnh viễn."
        itemTypeLabel="bài tập"
        itemName={deleteModal.assignment?.title || ''}
        isDeleting={deleteModal.isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
