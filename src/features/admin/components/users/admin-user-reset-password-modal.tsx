'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { KeyRound, Copy, Check, MailCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminUsersService } from '@/features/admin/services/admin-users.service';
import { AdminUser } from '@/types/admin';

interface AdminUserResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser | null;
}

export function AdminUserResetPasswordModal({
  open,
  onOpenChange,
  user,
}: AdminUserResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const res = await adminUsersService.resetPassword(
        user.id,
        newPassword.trim() ? { newPassword: newPassword.trim() } : undefined,
      );
      if (res.success && res.temporaryPassword) {
        setTemporaryPassword(res.temporaryPassword);
        toast.success('Đặt lại mật khẩu thành công và đã gửi email cho người dùng');
      } else {
        toast.error(res.message || 'Đặt lại mật khẩu thất bại');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Thao tác thất bại';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (temporaryPassword) {
      navigator.clipboard.writeText(temporaryPassword);
      setCopied(true);
      toast.success('Đã sao chép mật khẩu tạm thời');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setTemporaryPassword(null);
    setNewPassword('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-1">
            <KeyRound className="size-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
            Đặt lại mật khẩu người dùng
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Tài khoản: {user?.fullName} ({user?.email})
          </DialogDescription>
        </DialogHeader>

        {temporaryPassword ? (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2">
              <span className="text-xs font-semibold text-blue-900 dark:text-blue-300">
                Mật khẩu tạm thời mới:
              </span>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border font-mono text-base font-bold text-slate-900 dark:text-white">
                <span>{temporaryPassword}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 px-2"
                >
                  {copied ? (
                    <Check className="size-4 text-emerald-500" />
                  ) : (
                    <Copy className="size-4 text-slate-500" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900">
              <MailCheck className="size-4 shrink-0" />
              <span>Hệ thống đã tự động gửi mật khẩu này qua email cho người dùng.</span>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} className="rounded-xl w-full">
                Đã hiểu & Đóng
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Mật khẩu mới (Tùy chọn)</Label>
              <Input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Để trống để hệ thống tự sinh ngẫu nhiên chuỗi bảo mật"
                className="rounded-xl h-10 text-sm font-mono"
              />
              <p className="text-[11px] text-slate-400">
                Mật khẩu mới sẽ được mã hóa và gửi thông báo trực tiếp qua email đăng ký của người
                dùng.
              </p>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleClose} className="rounded-xl">
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {loading ? 'Đang cấp lại...' : 'Xác nhận Đặt lại Mật khẩu'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
