'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAdminClasses } from '@/features/admin/hooks/use-admin-classes';
import { useAdminSchools } from '@/features/admin/hooks/use-admin-schools';
import { adminClassesService } from '@/features/admin/services/admin-classes.service';
import { AdminClass } from '@/types/admin';
import { AdminClassesTable } from '@/features/admin/components/classes/admin-classes-table';
import { AdminClassModal } from '@/features/admin/components/classes/admin-class-modal';

export function AdminClassesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | undefined>(undefined);
  const [isArchivedFilter, setIsArchivedFilter] = useState<boolean | undefined>(undefined);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<AdminClass | null>(null);

  const limit = 10;

  // SWR custom hooks
  const { classes, total, totalPages, mutate } = useAdminClasses({
    page,
    limit,
    search,
    schoolId: selectedSchoolId,
    isArchived: isArchivedFilter,
  });

  const { schools } = useAdminSchools({ limit: 100 });

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
      await adminClassesService.toggleArchiveClass(cls.id);
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

  const handleDeleteClass = async (cls: AdminClass) => {
    const studentCount =
      cls.totalStudents ?? (cls as unknown as { currentStudents?: number }).currentStudents ?? 0;
    if (studentCount > 0) {
      toast.error('Không thể xóa lớp học đang có sinh viên ghi danh');
      return;
    }
    const classDisplayName = cls.title || (cls as unknown as { name?: string }).name || '';
    if (!confirm(`Bạn có chắc chắn muốn xóa lớp "${classDisplayName}"?`)) return;

    setActionLoadingId(cls.id);
    try {
      const res = await adminClassesService.deleteClass(cls.id);
      if (res.success) {
        toast.success(res.message);
        mutate();
      } else {
        toast.error(res.message);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Thao tác xóa thất bại';
      toast.error(errorMsg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleSchoolChange = (schoolId?: string) => {
    setSelectedSchoolId(schoolId);
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
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
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
        total={total}
        page={page}
        limit={limit}
        totalPages={totalPages}
        search={search}
        selectedSchoolId={selectedSchoolId}
        isArchivedFilter={isArchivedFilter}
        actionLoadingId={actionLoadingId}
        onSearchChange={handleSearchChange}
        onSchoolChange={handleSchoolChange}
        onArchiveFilterChange={handleArchiveFilterChange}
        onPageChange={setPage}
        onOpenCreateModal={handleOpenCreate}
        onOpenEditModal={handleOpenEdit}
        onToggleArchive={handleToggleArchive}
        onDeleteClass={handleDeleteClass}
      />

      {/* Class Create/Edit Modal */}
      <AdminClassModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        targetClass={selectedClass}
        onSuccess={() => mutate()}
      />
    </div>
  );
}
