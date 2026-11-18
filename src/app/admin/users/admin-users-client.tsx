'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAdminUsers } from '@/features/admin/hooks/use-admin-users';
import { useAdminSchools } from '@/features/admin/hooks/use-admin-schools';
import { adminUsersService } from '@/features/admin/services/admin-users.service';
import { AdminUser } from '@/types/admin';
import { AdminUsersTable } from '@/features/admin/components/users/admin-users-table';
import { AdminUserModal } from '@/features/admin/components/users/admin-user-modal';
import { AdminUserResetPasswordModal } from '@/features/admin/components/users/admin-user-reset-password-modal';

export function AdminUsersClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<'admin' | 'teacher' | 'student' | undefined>(undefined);
  const [status, setStatus] = useState<'active' | 'locked' | 'banned' | undefined>(undefined);
  const [schoolId, setSchoolId] = useState<string | undefined>(undefined);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetUser, setResetUser] = useState<AdminUser | null>(null);

  const limit = 10;

  // Custom SWR hooks
  const { users, total, totalPages, mutate } = useAdminUsers({
    page,
    limit,
    search,
    role,
    status,
    schoolId,
  });

  const { schools } = useAdminSchools({ limit: 100 });

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleOpenResetPassword = (user: AdminUser) => {
    setResetUser(user);
    setResetModalOpen(true);
  };

  const handleToggleLock = async (user: AdminUser) => {
    if (user.role === 'admin') {
      toast.error('Không thể khóa tài khoản quản trị viên');
      return;
    }

    const nextStatus = user.status === 'locked' ? 'active' : 'locked';
    setActionLoadingId(user.id);
    try {
      await adminUsersService.updateUser(user.id, { status: nextStatus });
      toast.success(
        nextStatus === 'active'
          ? 'Đã mở khóa tài khoản thành công'
          : 'Đã khóa tài khoản thành công',
      );
      mutate();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Thao tác thất bại';
      toast.error(errorMsg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleBanUser = async (user: AdminUser) => {
    if (user.role === 'admin') {
      toast.error('Không thể cấm hoặc xóa tài khoản quản trị viên');
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn vô hiệu hóa tài khoản "${user.fullName}"?`)) {
      return;
    }

    setActionLoadingId(user.id);
    try {
      const res = await adminUsersService.deleteUser(user.id);
      if (res.success) {
        toast.success(res.message);
        mutate();
      } else {
        toast.error(res.message);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Thao tác thất bại';
      toast.error(errorMsg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleRoleChange = (val?: 'admin' | 'teacher' | 'student') => {
    setRole(val);
    setPage(1);
  };

  const handleStatusChange = (val?: 'active' | 'locked' | 'banned') => {
    setStatus(val);
    setPage(1);
  };

  const handleSchoolChange = (val?: string) => {
    setSchoolId(val);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Quản trị Người dùng Toàn Hệ thống
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Quản lý tài khoản, phân quyền vai trò, mở/khóa truy cập và bảo vệ người dùng
        </p>
      </div>

      {/* Users Table */}
      <AdminUsersTable
        users={users}
        schools={schools}
        total={total}
        page={page}
        limit={limit}
        totalPages={totalPages}
        search={search}
        role={role}
        status={status}
        schoolId={schoolId}
        actionLoadingId={actionLoadingId}
        onSearchChange={handleSearchChange}
        onRoleChange={handleRoleChange}
        onStatusChange={handleStatusChange}
        onSchoolChange={handleSchoolChange}
        onPageChange={setPage}
        onOpenCreateModal={handleOpenCreate}
        onOpenEditModal={handleOpenEdit}
        onOpenResetPasswordModal={handleOpenResetPassword}
        onToggleLock={handleToggleLock}
        onBanUser={handleBanUser}
      />

      {/* Create / Edit User Modal */}
      <AdminUserModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        user={selectedUser}
        onSuccess={() => mutate()}
      />

      {/* Reset Password Modal */}
      <AdminUserResetPasswordModal
        open={resetModalOpen}
        onOpenChange={setResetModalOpen}
        user={resetUser}
      />
    </div>
  );
}
