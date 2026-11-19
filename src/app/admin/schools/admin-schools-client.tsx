'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAdminSchools } from '@/features/admin/hooks/use-admin-schools';
import { adminSchoolService } from '@/features/admin/services/admin-schools.service';
import { AdminSchool } from '@/types/admin';
import { AdminSchoolsTable } from '@/features/admin/components/schools/admin-schools-table';
import { AdminSchoolModal } from '@/features/admin/components/schools/admin-school-modal';
import { AdminSchoolSubjectsSheet } from '@/features/admin/components/schools/admin-school-subjects-sheet';
import { AdminActionReasonModal } from '@/features/admin/components/shared/admin-action-reason-modal';
import { AdminImportModal } from '@/features/admin/components/shared/admin-import-modal';

const SCHOOL_IMPORT_COLUMNS = [
  { key: 'name', label: 'Tên trường học', sample: 'Đại học Bách Khoa', required: true },
  { key: 'shortname', label: 'Mã viết tắt', sample: 'HCMUT', required: true },
  { key: 'address', label: 'Địa chỉ', sample: '268 Lý Thường Kiệt, P.14, Q.10' },
  { key: 'city', label: 'Tỉnh/Thành phố', sample: 'Hồ Chí Minh' },
];

export function AdminSchoolsClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [status, setStatus] = useState<'active' | 'deactivated' | 'archived' | undefined>(
    undefined,
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<AdminSchool | null>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [inspectSchool, setInspectSchool] = useState<AdminSchool | null>(null);

  const [deleteTargetSchool, setDeleteTargetSchool] = useState<AdminSchool | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const limit = 10;

  const { schools, total, totalPages, mutate } = useAdminSchools({
    page,
    limit,
    search,
    city: city || undefined,
    status,
  });

  const handleOpenCreate = () => {
    setSelectedSchool(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (school: AdminSchool) => {
    setSelectedSchool(school);
    setModalOpen(true);
  };

  const handleOpenSubjects = (school: AdminSchool) => {
    setInspectSchool(school);
    setSheetOpen(true);
  };

  const handleDeleteClick = (school: AdminSchool) => {
    setDeleteTargetSchool(school);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetSchool) return;

    setIsDeleting(true);
    try {
      const res = await adminSchoolService.deleteSchool(deleteTargetSchool.id);
      if (res.success) {
        toast.success(res.message);
        mutate();
        setDeleteTargetSchool(null);
      } else {
        toast.error(res.message);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Thao tác xóa trường thất bại';
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImportSchools = async (rows: Record<string, string>[]) => {
    setIsImporting(true);
    let successCount = 0;
    const errors: string[] = [];

    for (const row of rows) {
      try {
        await adminSchoolService.createSchool({
          name: row.name.trim(),
          shortname: row.shortname.trim().toUpperCase(),
          address: row.address?.trim() || undefined,
          city: row.city?.trim() || undefined,
        });
        successCount++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
        errors.push(`${row.shortname}: ${msg}`);
      }
    }

    setIsImporting(false);
    setImportModalOpen(false);
    mutate();

    if (successCount > 0) {
      toast.success(`Đã thêm thành công ${successCount} trường học`);
    }
    if (errors.length > 0) {
      toast.error(`Có ${errors.length} mục thất bại: ${errors.slice(0, 3).join('; ')}`);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleCityChange = (val: string) => {
    setCity(val);
    setPage(1);
  };

  const handleStatusChange = (val?: 'active' | 'deactivated' | 'archived') => {
    setStatus(val);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-emerald-950 dark:text-emerald-100">
          Quản lý Trường học
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Thiết lập mạng lưới cơ sở đào tạo, phân bổ môn học và phân quyền không gian lớp
        </p>
      </div>

      {/* Schools Table Component */}
      <AdminSchoolsTable
        schools={schools}
        total={total}
        page={page}
        limit={limit}
        totalPages={totalPages}
        search={search}
        city={city}
        status={status}
        onSearchChange={handleSearchChange}
        onCityChange={handleCityChange}
        onStatusChange={handleStatusChange}
        onPageChange={setPage}
        onOpenCreateModal={handleOpenCreate}
        onOpenEditModal={handleOpenEdit}
        onOpenSubjectsSheet={handleOpenSubjects}
        onOpenImportModal={() => setImportModalOpen(true)}
        onDeleteSchool={handleDeleteClick}
        onRefresh={() => mutate()}
      />

      {/* School Create/Edit Modal */}
      <AdminSchoolModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        school={selectedSchool}
        onSuccess={() => mutate()}
      />

      {/* School Subjects Sheet */}
      <AdminSchoolSubjectsSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        school={inspectSchool}
        onSchoolsChanged={() => mutate()}
      />

      {/* Delete Confirmation Modal */}
      <AdminActionReasonModal
        isOpen={Boolean(deleteTargetSchool)}
        onClose={() => setDeleteTargetSchool(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa trường học"
        description="Lưu ý: Chỉ có thể xóa vĩnh viễn trường học khi trường chưa có môn học, lớp học và người dùng."
        actionLabel="Xác nhận xóa"
        variant="danger"
        targetName={
          deleteTargetSchool
            ? `${deleteTargetSchool.shortname} - ${deleteTargetSchool.name}`
            : undefined
        }
        requireReason={false}
        isSubmitting={isDeleting}
      />

      {/* Bulk CSV Import Modal */}
      <AdminImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImportSchools}
        title="Nhập danh sách trường học từ CSV"
        columns={SCHOOL_IMPORT_COLUMNS}
        sampleFileName="mau_danh_sach_truong_hoc"
        isSubmitting={isImporting}
      />
    </div>
  );
}
