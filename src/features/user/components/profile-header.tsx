'use client';

import { useState, useRef, useEffect } from 'react';
import type { User } from '@/types/user';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ROLE_CONFIG } from '@/config';
import { userService } from '../services/user.service';
import { toast } from 'sonner';
import { Camera, Loader2, BookOpen, Calendar, School, CheckCircle2 } from 'lucide-react';

interface ProfileHeaderProps {
  user: User;
  mutateUser: () => Promise<unknown>;
}

export function ProfileHeader({ user, mutateUser }: ProfileHeaderProps) {
  const roleConfig = ROLE_CONFIG[user.role];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [classCount, setClassCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchCount() {
      try {
        const res = await userService.getProfileClasses();
        if (isMounted) {
          if (Array.isArray(res?.data)) {
            setClassCount(res.data.length);
          } else if (res?.data) {
            setClassCount(Object.values(res.data).length);
          } else {
            setClassCount(0);
          }
        }
      } catch {
        if (isMounted) setClassCount(0);
      }
    }
    fetchCount();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn định dạng file ảnh (PNG, JPG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh tối đa là 5MB');
      return;
    }

    setAvatarPreview(URL.createObjectURL(file));
    setIsUploadingAvatar(true);

    try {
      const res = await userService.updateAvatar(file);
      if (res.success) {
        toast.success('Cập nhật ảnh đại diện thành công!');
        await mutateUser();
      } else {
        toast.error(res.message || 'Tải ảnh lên thất bại');
      }
    } catch {
      toast.error('Đã xảy ra lỗi khi tải ảnh lên');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <Card className="shadow-xs border border-slate-200/90 bg-white rounded-3xl overflow-hidden text-slate-800">
      {/* Decorative Top Banner */}
      <div className="h-28 bg-linear-to-r from-sky-100 via-indigo-100 to-purple-100 relative border-b border-indigo-100/60" />

      <CardContent className="px-6 sm:px-8 pb-6 pt-0 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-14">
          {/* Avatar and Identity Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            <div className="relative group">
              <Avatar className="size-24 sm:size-28 border-4 border-white shadow-md bg-white">
                <AvatarImage
                  src={avatarPreview || user.avatar || user.avatarUrl || undefined}
                  alt={user.fullName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-linear-to-br from-blue-600 to-indigo-600 text-white font-bold text-2xl sm:text-3xl">
                  {user.fullName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute inset-0 bg-slate-900/50 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 cursor-pointer"
                title="Đổi ảnh đại diện"
              >
                {isUploadingAvatar ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <>
                    <Camera className="size-5" />
                    <span className="text-[10px] font-semibold mt-0.5">Đổi ảnh</span>
                  </>
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">{user.fullName}</h2>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${roleConfig.className}`}
                >
                  {roleConfig.label}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <CheckCircle2 className="size-3" />
                  Đang hoạt động
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">{user.email}</p>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 sm:pt-0">
            {user.school?.name && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700">
                <School className="size-3.5 text-slate-500" />
                <span className="truncate max-w-45">
                  {user.school.shortname || user.school.name}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700">
              <BookOpen className="size-3.5 text-indigo-600" />
              <span>{classCount !== null ? `${classCount} lớp học` : '...'}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-600">
              <Calendar className="size-3.5 text-slate-400" />
              <span>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
