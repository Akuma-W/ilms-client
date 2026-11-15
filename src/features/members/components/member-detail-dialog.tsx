'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Crown, GraduationCap, IdCard, Mail, ShieldCheck, User as UserIcon } from 'lucide-react';
import { EnrollmentStatus, Role } from '@/types/enum';
import type { ClassMember } from '@/types/member';
import type { User } from '@/types/user';

interface MemberDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: ClassMember | null;
  teacher?: User | null;
  isHeadTeacher?: boolean;
}

export function MemberDetailDialog({
  open,
  onOpenChange,
  member,
  teacher,
  isHeadTeacher = false,
}: MemberDetailDialogProps) {
  const targetUser = member?.user || teacher;
  if (!targetUser) return null;

  const fullName = targetUser.fullName || 'Người dùng';
  const email = targetUser.email;
  const avatarUrl = targetUser.avatar || targetUser.avatarUrl || undefined;
  const identityCode = member?.studentCode || targetUser.identityCode;
  const joinedDate = member?.joinedAt ? new Date(member.joinedAt).toLocaleDateString('vi-VN') : undefined;
  const isStudent = member?.role === Role.student || (!member && targetUser.role === Role.student);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border border-slate-200 text-slate-800 rounded-3xl p-6 shadow-2xl">
        <DialogHeader className="space-y-1 text-center sm:text-left">
          <DialogTitle className="text-lg font-bold text-slate-900">
            Thông tin thành viên lớp học
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Dữ liệu định danh được đồng bộ trong phạm vi không gian lớp học này.
          </DialogDescription>
        </DialogHeader>

        {/* User Card Header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 py-4 border-y border-slate-100">
          <Avatar className="size-16 rounded-2xl border-2 border-indigo-100 shadow-xs">
            <AvatarImage src={avatarUrl} alt={fullName} className="object-cover" />
            <AvatarFallback className="rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white font-bold text-lg">
              {fullName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1.5 text-center sm:text-left min-w-0">
            <h4 className="text-base font-bold text-slate-900 truncate">{fullName}</h4>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
              {isHeadTeacher ? (
                <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold gap-1 px-2.5 py-0.5">
                  <Crown className="size-3 text-amber-500" />
                  <span>Giảng viên chủ nhiệm</span>
                </Badge>
              ) : member?.role === Role.teacher || targetUser.role === Role.teacher ? (
                <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold gap-1 px-2.5 py-0.5">
                  <ShieldCheck className="size-3" />
                  <span>Trợ giảng</span>
                </Badge>
              ) : (
                <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold gap-1 px-2.5 py-0.5">
                  <GraduationCap className="size-3" />
                  <span>Sinh viên</span>
                </Badge>
              )}

              {member?.status === EnrollmentStatus.pending && (
                <Badge className="bg-amber-100 text-amber-800 text-xs font-medium">
                  Chờ duyệt
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-3 py-2 text-xs sm:text-sm">
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-2">
              <Mail className="size-4 text-slate-400" />
              <span>Email liên hệ</span>
            </span>
            <span className="font-semibold text-slate-900 font-mono select-all">{email}</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-2">
              <IdCard className="size-4 text-slate-400" />
              <span>{isStudent ? 'Mã số sinh viên (MSSV)' : 'Mã giảng viên'}</span>
            </span>
            <span className="font-semibold text-slate-900 font-mono">
              {identityCode || 'Chưa cập nhật'}
            </span>
          </div>

          {joinedDate && (
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <Calendar className="size-4 text-slate-400" />
                <span>Ngày tham gia</span>
              </span>
              <span className="font-semibold text-slate-900">{joinedDate}</span>
            </div>
          )}

          <div className="flex items-center justify-between py-1.5">
            <span className="text-slate-500 flex items-center gap-2">
              <UserIcon className="size-4 text-slate-400" />
              <span>Phạm vi hiển thị</span>
            </span>
            <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md text-xs border border-emerald-100">
              Nội bộ lớp học
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
