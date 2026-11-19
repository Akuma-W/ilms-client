'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { KeyRound, ShieldAlert, Loader2, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/shared/password-input';
import { Label } from '@/components/ui/label';
import { authService } from '@/features/auth/services/auth.service';
import { useCurrentUser } from '@/features/user/hooks/use-current-user';

export function MustChangePasswordModal() {
  const { user, mutateUser } = useCurrentUser();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isOpen = Boolean(user?.mustChangePassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword.trim()) {
      toast.error('Vui lòng nhập mật khẩu tạm thời hiện tại');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Mật khẩu mới phải có tối thiểu 8 ký tự');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=~`]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast.error('Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt');
      return;
    }

    if (newPassword.includes(' ')) {
      toast.error('Mật khẩu không được chứa khoảng trắng');
      return;
    }

    if (newPassword === oldPassword) {
      toast.error('Mật khẩu mới không được trùng với mật khẩu tạm thời');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không trùng khớp');
      return;
    }

    setIsLoading(true);
    try {
      await authService.changePassword({
        oldPassword: oldPassword.trim(),
        newPassword: newPassword.trim(),
      });

      toast.success('Đổi mật khẩu thành công! Tài khoản của bạn đã được bảo vệ.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      await mutateUser();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu tạm thời.';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md rounded-2xl border-amber-200 dark:border-amber-800 shadow-2xl [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="size-11 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-1">
            <KeyRound className="size-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
            Yêu cầu đổi mật khẩu mới
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Mật khẩu của bạn vừa được Quản trị viên đặt lại. Để đảm bảo an toàn, vui lòng tạo mật
            khẩu mới để tiếp tục sử dụng hệ thống.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300">
            <ShieldAlert className="size-4 shrink-0" />
            <span>Bạn cần hoàn tất đổi mật khẩu trước khi truy cập các tính năng khác.</span>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Mật khẩu tạm thời hiện tại *
            </Label>
            <PasswordInput
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Nhập mật khẩu tạm thời vừa dùng để đăng nhập"
              className="rounded-xl h-10 text-xs sm:text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Mật khẩu mới *
            </Label>
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tối thiểu 8 ký tự, 1 hoa, 1 số, 1 ký tự đặc biệt"
              className="rounded-xl h-10 text-xs sm:text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Xác nhận mật khẩu mới *
            </Label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              className="rounded-xl h-10 text-xs sm:text-sm"
              required
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                  <span>Đang cập nhật mật khẩu...</span>
                </>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <Check className="size-4" />
                  <span>Cập nhật mật khẩu & Tiếp tục</span>
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
