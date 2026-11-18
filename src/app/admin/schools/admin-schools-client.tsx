'use client';

import { useState } from 'react';
import { useAdminSchools } from '@/features/admin/hooks/use-admin-schools';
import { AdminSchool } from '@/types/admin';
import { AdminSchoolsTable } from '@/features/admin/components/schools/admin-schools-table';
import { AdminSchoolModal } from '@/features/admin/components/schools/admin-school-modal';
import { AdminSchoolSubjectsSheet } from '@/features/admin/components/schools/admin-school-subjects-sheet';

export function AdminSchoolsClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive' | undefined>(undefined);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<AdminSchool | null>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [inspectSchool, setInspectSchool] = useState<AdminSchool | null>(null);

  const limit = 10;

  const { schools, total, totalPages, mutate } = useAdminSchools({
    page,
    limit,
    search,
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

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusChange = (val?: 'active' | 'inactive') => {
    setStatus(val);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Quản lý Trường học & Học viện
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
        status={status}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onPageChange={setPage}
        onOpenCreateModal={handleOpenCreate}
        onOpenEditModal={handleOpenEdit}
        onOpenSubjectsSheet={handleOpenSubjects}
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
      />
    </div>
  );
}
