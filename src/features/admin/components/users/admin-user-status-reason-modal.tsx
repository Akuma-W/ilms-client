'use client';

import { AlertTriangle, Clock, School, ShieldAlert, UserCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AdminUser } from '@/types/admin';
import {
  getRoleBadgeConfig,
  getUserStatusBadgeConfig,
  formatDateTime,
} from '@/features/admin/utils/admin-formatters';

interface AdminUserStatusReasonModalProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminUserStatusReasonModal({
  user,
  open,
  onOpenChange,
}: AdminUserStatusReasonModalProps) {
  if (!user) return null;

  const roleConfig = getRoleBadgeConfig(user.role);
  const statusConfig = getUserStatusBadgeConfig(user.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <div className="size-11 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-1">
            <ShieldAlert className="size-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
            Chi tiết trạng thái tài khoản
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Thông tin kiểm soát và lý do áp dụng trạng thái tài khoản trên hệ thống
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* User Profile Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border flex items-center gap-3">
            <Avatar className="size-10 ring-1 ring-slate-200 dark:ring-slate-700 shrink-0">
              <AvatarImage src={user.avatarUrl || ''} alt={user.fullName} />
              <AvatarFallback className="text-xs font-bold">
                {user.fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                  {user.fullName}
                </span>
                <Badge variant="outline" className={roleConfig.className}>
                  {roleConfig.label}
                </Badge>
              </div>
              <span className="text-xs text-slate-500 truncate">{user.email}</span>
            </div>
          </div>

          {/* Status & School Strip */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border bg-card space-y-1">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <UserCheck className="size-3 text-slate-400" />
                Trạng thái:
              </span>
              <div>
                <Badge variant="outline" className={statusConfig.className}>
                  {statusConfig.label}
                </Badge>
              </div>
            </div>

            <div className="p-3 rounded-xl border bg-card space-y-1">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <School className="size-3 text-slate-400" />
                Đơn vị trực thuộc:
              </span>
              <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                {user.school?.shortname || user.school?.name || 'Chưa phân bổ'}
              </p>
            </div>
          </div>

          {/* Reason Content Box */}
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
              <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Lý do ghi nhận từ Quản trị viên:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed pl-5 font-normal">
              {user.statusReason || 'Không có lý do cụ thể được đính kèm.'}
            </p>
          </div>

          {/* Timestamp Footer */}
          {user.updatedAt && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 px-1">
              <Clock className="size-3" />
              <span>Cập nhật lần cuối: {formatDateTime(user.updatedAt)}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)} className="rounded-xl w-full">
            Đã hiểu & Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
