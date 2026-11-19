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
import { AdminUserStatusReasonModal } from '@/features/admin/components/users/admin-user-status-reason-modal';
import { AdminActionReasonModal } from '@/features/admin/components/shared/admin-action-reason-modal';

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

  // Status reason inspection modal state
  const [reasonModalUser, setReasonModalUser] = useState<AdminUser | null>(null);

  // Status action modal states (Lock / Ban / Unban)
  const [statusActionTarget, setStatusActionTarget] = useState<AdminUser | null>(null);
  const [statusActionType, setStatusActionType] = useState<'lock' | 'ban' | 'unban' | null>(null);
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);

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

  const handleToggleLock = (user: AdminUser) => {
    if (user.role === 'admin') {
      toast.error('Không thể khóa tài khoản quản trị viên');
      return;
    }

    if (user.status === 'locked') {
      setStatusActionTarget(user);
      setStatusActionType('unban'); // Re-activate
    } else {
      setStatusActionTarget(user);
      setStatusActionType('lock');
    }
  };

  const handleBanUser = (user: AdminUser) => {
    if (user.role === 'admin') {
      toast.error('Không thể đình chỉ tài khoản quản trị viên');
      return;
    }

    if (user.status === 'banned') {
      setStatusActionTarget(user);
      setStatusActionType('unban');
    } else {
      setStatusActionTarget(user);
      setStatusActionType('ban');
    }
  };

  const handleConfirmStatusAction = async (reason: string) => {
    if (!statusActionTarget || !statusActionType) return;

    setIsSubmittingStatus(true);
    setActionLoadingId(statusActionTarget.id);
    try {
      if (statusActionType === 'lock') {
        await adminUsersService.updateUser(statusActionTarget.id, {
          status: 'locked',
          statusReason: reason?.trim() || 'Tài khoản bị tạm khóa bởi quản trị viên',
        });
        toast.success('Đã tạm khóa tài khoản người dùng');
      } else if (statusActionType === 'ban') {
        await adminUsersService.updateUser(statusActionTarget.id, {
          status: 'banned',
          statusReason: reason?.trim() || 'Tài khoản bị đình chỉ bởi quản trị viên',
        });
        toast.success('Đã đình chỉ tài khoản người dùng');
      } else if (statusActionType === 'unban') {
        await adminUsersService.updateUser(statusActionTarget.id, {
          status: 'active',
          statusReason: '',
        });
        toast.success('Đã khôi phục tài khoản hoạt động bình thường');
      }
      mutate();
      setStatusActionTarget(null);
      setStatusActionType(null);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Thao tác thất bại';
      toast.error(errorMsg);
    } finally {
      setIsSubmittingStatus(false);
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
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-rose-950 dark:text-rose-100">
          Quản lý Người dùng toàn Hệ thống
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
        onViewStatusReason={setReasonModalUser}
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

      {/* View Status Reason Details Modal */}
      <AdminUserStatusReasonModal
        user={reasonModalUser}
        open={Boolean(reasonModalUser)}
        onOpenChange={(open) => !open && setReasonModalUser(null)}
      />

      {/* Sensitive Action Modal (Lock / Ban / Unban) */}
      <AdminActionReasonModal
        isOpen={Boolean(statusActionTarget && statusActionType)}
        onClose={() => {
          setStatusActionTarget(null);
          setStatusActionType(null);
        }}
        onConfirm={handleConfirmStatusAction}
        title={
          statusActionType === 'lock'
            ? 'Tạm khóa tài khoản người dùng'
            : statusActionType === 'ban'
              ? 'Đình chỉ tài khoản vĩnh viễn'
              : 'Khôi phục hoạt động tài khoản'
        }
        description={
          statusActionType === 'lock'
            ? 'Người dùng bị tạm khóa sẽ không thể đăng nhập hoặc tham gia các hoạt động lớp học.'
            : statusActionType === 'ban'
              ? 'Tài khoản bị đình chỉ sẽ bị chặn hoàn toàn quyền truy cập nền tảng.'
              : 'Gỡ bỏ trạng thái khóa/đình chỉ và cấp lại quyền truy cập cho người dùng.'
        }
        actionLabel={
          statusActionType === 'lock'
            ? 'Khóa tài khoản'
            : statusActionType === 'ban'
              ? 'Đình chỉ tài khoản'
              : 'Khôi phục tài khoản'
        }
        variant={
          statusActionType === 'ban'
            ? 'danger'
            : statusActionType === 'lock'
              ? 'warning'
              : 'default'
        }
        targetName={
          statusActionTarget
            ? `${statusActionTarget.fullName} (${statusActionTarget.email})`
            : undefined
        }
        placeholder={
          statusActionType === 'unban'
            ? 'Nhập lý do khôi phục tài khoản (tùy chọn)...'
            : 'Nhập lý do thực hiện hành động này...'
        }
        requireReason={statusActionType === 'ban'}
        isSubmitting={isSubmittingStatus}
      />
    </div>
  );
}
