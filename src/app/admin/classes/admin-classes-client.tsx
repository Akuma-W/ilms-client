'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAdminClasses } from '@/features/admin/hooks/use-admin-classes';
import { useAdminSchools, useAdminSchoolSubjects } from '@/features/admin/hooks/use-admin-schools';
import { adminClassesService } from '@/features/admin/services/admin-classes.service';
import { AdminClass } from '@/types/admin';
import { AdminClassesTable } from '@/features/admin/components/classes/admin-classes-table';
import { AdminClassModal } from '@/features/admin/components/classes/admin-class-modal';
import { AdminActionReasonModal } from '@/features/admin/components/shared/admin-action-reason-modal';

export function AdminClassesClient() {
  const searchParams = useSearchParams();
  const initialSchoolId = searchParams.get('schoolId') || undefined;
  const initialSubjectId = searchParams.get('subjectId') || undefined;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | undefined>(initialSchoolId);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | undefined>(initialSubjectId);
  const [isArchivedFilter, setIsArchivedFilter] = useState<boolean | undefined>(undefined);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<AdminClass | null>(null);

  const [deleteTargetClass, setDeleteTargetClass] = useState<AdminClass | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const limit = 10;

  // SWR custom hooks
  const { classes, total, totalPages, mutate } = useAdminClasses({
    page,
    limit,
    search,
    schoolId: selectedSchoolId,
    subjectId: selectedSubjectId,
    isArchived: isArchivedFilter,
  });

  const { schools } = useAdminSchools({ limit: 100 });
  const { subjects } = useAdminSchoolSubjects(selectedSchoolId);

  const handleOpenCreate = () => {
    setSelectedClass(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cls: AdminClass) => {
    setSelectedClass(cls);
    setModalOpen(true);
  };

  const handleToggleArchive = async (cls: AdminClass) => {
    setActionLoadingId(cls.id);
    try {
      await adminClassesService.toggleArchiveClass(cls.id, cls.isArchived);
      toast.success(
        cls.isArchived ? 'Đã mở lại lớp học thành công' : 'Đã lưu trữ lớp học thành công',
      );
      mutate();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Thao tác thất bại';
      toast.error(errorMsg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteClick = (cls: AdminClass) => {
    setDeleteTargetClass(cls);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetClass) return;

    setIsDeleting(true);
    try {
      const res = await adminClassesService.deleteClass(deleteTargetClass.id);
      if (res.success) {
        toast.success(res.message);
        mutate();
        setDeleteTargetClass(null);
      } else {
        toast.error(res.message);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Thao tác xóa thất bại';
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleSchoolChange = (schoolId?: string) => {
    setSelectedSchoolId(schoolId);
    setSelectedSubjectId(undefined);
    setPage(1);
  };

  const handleSubjectChange = (subjectId?: string) => {
    setSelectedSubjectId(subjectId);
    setPage(1);
  };

  const handleArchiveFilterChange = (isArchived?: boolean) => {
    setIsArchivedFilter(isArchived);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-violet-950 dark:text-violet-100">
          Quản lý Lớp học Hệ thống
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Giám sát hoạt động giảng dạy, hỗ trợ không gian lớp và kiểm soát quy mô lớp học
        </p>
      </div>

      {/* Classes Table */}
      <AdminClassesTable
        classes={classes}
        schools={schools}
        subjects={subjects}
        total={total}
        page={page}
        limit={limit}
        totalPages={totalPages}
        search={search}
        selectedSchoolId={selectedSchoolId}
        selectedSubjectId={selectedSubjectId}
        isArchivedFilter={isArchivedFilter}
        actionLoadingId={actionLoadingId}
        onSearchChange={handleSearchChange}
        onSchoolChange={handleSchoolChange}
        onSubjectChange={handleSubjectChange}
        onArchiveFilterChange={handleArchiveFilterChange}
        onPageChange={setPage}
        onOpenCreateModal={handleOpenCreate}
        onOpenEditModal={handleOpenEdit}
        onToggleArchive={handleToggleArchive}
        onDeleteClass={handleDeleteClick}
      />

      {/* Class Create/Edit Modal */}
      <AdminClassModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        targetClass={selectedClass}
        onSuccess={() => mutate()}
      />

      {/* Delete Confirmation Modal */}
      <AdminActionReasonModal
        isOpen={Boolean(deleteTargetClass)}
        onClose={() => setDeleteTargetClass(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa lớp học"
        description="Lưu ý: Chỉ có thể xóa lớp học khi chưa có sinh viên nào ghi danh."
        actionLabel="Xác nhận xóa"
        variant="danger"
        targetName={deleteTargetClass?.title}
        requireReason={false}
        isSubmitting={isDeleting}
      />
    </div>
  );
}
