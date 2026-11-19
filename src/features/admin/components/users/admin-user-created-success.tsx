'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { KeyRound, Copy, Check, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface AdminUserCreatedSuccessProps {
  credentials: {
    email: string;
    fullName: string;
    temporaryPassword: string;
  };
  onFinish: () => void;
}

export function AdminUserCreatedSuccess({ credentials, onFinish }: AdminUserCreatedSuccessProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyPassword = () => {
    if (credentials.temporaryPassword) {
      navigator.clipboard.writeText(credentials.temporaryPassword);
      setCopied(true);
      toast.success('Đã sao chép mật khẩu khởi tạo');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4 py-2">
      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
        <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>
          Tài khoản <strong>{credentials.email}</strong> ({credentials.fullName}) đã được khởi tạo
          thành công!
        </span>
      </div>

      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2">
        <span className="text-xs font-semibold text-blue-900 dark:text-blue-300">
          Mật khẩu khởi tạo của tài khoản:
        </span>
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border font-mono text-base font-bold text-slate-900 dark:text-white">
          <span>{credentials.temporaryPassword}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopyPassword}
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

      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border">
        <KeyRound className="size-4 shrink-0 text-slate-400" />
        <span>
          Vui lòng lưu lại hoặc gửi mật khẩu này cho người dùng. Người dùng sẽ được yêu cầu đổi mật
          khẩu ngay khi đăng nhập lần đầu.
        </span>
      </div>

      <DialogFooter>
        <Button
          type="button"
          onClick={onFinish}
          className="rounded-xl w-full bg-rose-600 hover:bg-rose-700 text-white font-medium"
        >
          Đã lưu mật khẩu & Hoàn tất
        </Button>
      </DialogFooter>
    </div>
  );
}
