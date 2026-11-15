'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { authService } from '@/features/auth/services/auth.service';
import { toast } from 'sonner';
import { KeyRound, Loader2, Lock, ArrowLeft, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export function ChangePasswordCard() {
  const [isChanging, setIsChanging] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword) {
      toast.error('Vui lòng nhập mật khẩu hiện tại');
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

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không trùng khớp');
      return;
    }

    setIsLoading(true);
    try {
      await authService.changePassword({
        oldPassword,
        newPassword,
      });

      toast.success('Đổi mật khẩu thành công! Hãy dùng mật khẩu mới cho lần đăng nhập kế tiếp.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChanging(false);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsChanging(false);
  };

  return (
    <Card className="shadow-xs border border-slate-200/90 bg-white rounded-3xl overflow-hidden text-slate-800">
      <div className="h-1.5 w-full bg-linear-to-r from-amber-400 via-indigo-500 to-purple-600" />

      <CardHeader className="px-6 sm:px-8 pt-6 pb-4">
        <div className="flex items-center gap-2 text-indigo-600 mb-1">
          <KeyRound className="size-4.5" />
          <span className="text-xs font-bold uppercase tracking-wider">Cài đặt bảo mật</span>
        </div>
        <CardTitle className="text-xl font-bold text-slate-900">Bảo mật tài khoản & Mật khẩu</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-slate-500">
          Quản lý cơ chế xác thực và cập nhật mật khẩu để bảo vệ không gian học tập của bạn.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 sm:px-8 pb-8">
        <AnimatePresence mode="wait">
          {!isChanging ? (
            /* Initial state: Only masked password and Change Password button */
            <motion.div
              key="view-password"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-5 sm:p-6 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto"
            >
              <div className="flex items-center gap-3.5">
                <div className="size-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                  <Lock className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Mật khẩu đăng nhập</h4>
                  <p className="text-xs text-slate-500 font-mono tracking-widest mt-0.5">
                    ••••••••••••
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setIsChanging(true)}
                className="w-full sm:w-auto h-10 px-5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs"
              >
                <span>Đổi mật khẩu</span>
              </Button>
            </motion.div>
          ) : (
            /* Open state: Centered Change Password Form */
            <motion.div
              key="form-password"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="max-w-md mx-auto pt-2"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Nhập mật khẩu mới
                  </span>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                  >
                    <ArrowLeft className="size-3.5" />
                    <span>Hủy thao tác</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Mật khẩu hiện tại</Label>
                  <PasswordInput
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Nhập mật khẩu đang dùng"
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 rounded-xl h-10 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Mật khẩu mới</Label>
                  <PasswordInput
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 8 ký tự, 1 hoa, 1 số, 1 ký tự đặc biệt"
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 rounded-xl h-10 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Xác nhận mật khẩu mới</Label>
                  <PasswordInput
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 rounded-xl h-10 text-xs sm:text-sm"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    onClick={handleCancel}
                    className="flex-1 h-10 rounded-xl border-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-10 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <span className="flex items-center justify-center gap-1.5">
                        <Check className="size-4" />
                        <span>Xác nhận đổi</span>
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
