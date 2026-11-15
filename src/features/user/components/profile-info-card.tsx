'use client';

import { useState } from 'react';
import type { User } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userService } from '../services/user.service';
import { toast } from 'sonner';
import {
  Edit3,
  Check,
  X,
  Shield,
  Calendar,
  Loader2,
  Lock,
  UserCheck,
} from 'lucide-react';

interface ProfileInfoCardProps {
  user: User;
  mutateUser: () => Promise<unknown>;
}

export function ProfileInfoCard({ user, mutateUser }: ProfileInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName || '');
  const [identityCode, setIdentityCode] = useState(user.identityCode || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Họ và tên không được để trống');
      return;
    }

    setIsSaving(true);
    try {
      const res = await userService.updateProfile({
        fullName: fullName.trim(),
        identityCode: identityCode.trim() || undefined,
      });

      if (res.success) {
        toast.success('Cập nhật thông tin hồ sơ thành công!');
        setIsEditing(false);
        await mutateUser();
      } else {
        toast.error(res.message || 'Cập nhật thất bại');
      }
    } catch {
      toast.error('Đã xảy ra lỗi khi lưu thông tin');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFullName(user.fullName || '');
    setIdentityCode(user.identityCode || '');
    setIsEditing(false);
  };

  return (
    <Card className="shadow-xs border border-slate-200/90 bg-white rounded-3xl overflow-hidden text-slate-800">
      <CardHeader className="px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100 flex flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <UserCheck className="size-4.5" />
            <span className="text-xs font-bold uppercase tracking-wider">Hồ sơ cá nhân</span>
          </div>
          <CardTitle className="text-xl font-bold text-slate-900">Thông tin tài khoản</CardTitle>
          <CardDescription className="text-xs sm:text-sm text-slate-500">
            Dữ liệu định danh được áp dụng cho toàn bộ hoạt động học tập trên hệ thống KEIVerse.
          </CardDescription>
        </div>

        <div>
          {!isEditing ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="bg-white hover:bg-slate-50 text-indigo-700 border-indigo-200 rounded-xl shadow-xs font-semibold gap-1.5 text-xs"
            >
              <Edit3 className="size-3.5" />
              <span>Chỉnh sửa</span>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="bg-white hover:bg-slate-50 text-slate-600 border-slate-200 rounded-xl shadow-xs text-xs"
              >
                <X className="size-3.5 mr-1" />
                Hủy
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-xs font-semibold text-xs gap-1"
              >
                {isSaving ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Check className="size-3.5" />
                )}
                Lưu
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-6 sm:px-8 py-6">
        {isEditing ? (
          /* Edit Mode Form */
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="profile-fullName" className="text-xs font-semibold text-slate-700">
                  Họ và tên
                </Label>
                <Input
                  id="profile-fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-10 text-xs sm:text-sm rounded-xl bg-white border-indigo-400 text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profile-identityCode" className="text-xs font-semibold text-slate-700">
                  {user.role === 'student' ? 'Mã số sinh viên (MSSV)' : 'Mã số giảng viên (MSGV)'}
                </Label>
                <Input
                  id="profile-identityCode"
                  value={identityCode}
                  onChange={(e) => setIdentityCode(e.target.value)}
                  placeholder="Nhập mã định danh..."
                  className="h-10 text-xs sm:text-sm rounded-xl bg-white border-indigo-400 text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </form>
        ) : (
          /* View Mode: Text has 100% opacity, pure black / dark readable text */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-1">
              <span className="text-xs font-medium text-slate-500 block">Họ và tên</span>
              <p className="text-sm font-bold text-slate-900 opacity-100">{user.fullName}</p>
            </div>

            {/* Email */}
            <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 block">Địa chỉ Email</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Lock className="size-3" /> Cố định
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-900 opacity-100 font-mono">{user.email}</p>
            </div>

            {/* Identity Code (MSSV / MSGV) */}
            <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-1">
              <span className="text-xs font-medium text-slate-500 block">
                {user.role === 'student' ? 'Mã số sinh viên (MSSV)' : 'Mã số giảng viên (MSGV)'}
              </span>
              <p className="text-sm font-bold text-slate-900 opacity-100 font-mono">
                {user.identityCode || 'Chưa cập nhật'}
              </p>
            </div>

            {/* School Affiliation */}
            <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-1">
              <span className="text-xs font-medium text-slate-500 block">Trường học trực thuộc</span>
              <p className="text-sm font-semibold text-slate-900 opacity-100 truncate">
                {user.school?.name ? `(${user.school.shortname}) ${user.school.name}` : 'Chưa liên kết trường'}
              </p>
            </div>
          </div>
        )}

        {/* Metadata Footer */}
        <div className="pt-5 mt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="size-3.5 text-slate-400" />
            <span>
              Thành viên từ:{' '}
              <strong className="text-slate-900 font-semibold opacity-100">
                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="size-3.5 text-slate-400" />
            <span>
              Trạng thái tài khoản:{' '}
              <strong className="text-emerald-700 font-bold opacity-100">
                {user.status === 'active' ? 'Đang hoạt động' : user.status}
              </strong>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
