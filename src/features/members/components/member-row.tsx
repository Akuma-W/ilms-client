'use client';

import { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  GraduationCap,
  Loader2,
  MoreVertical,
  ShieldCheck,
  Trash2,
  UserCog,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { EnrollmentStatus, Role } from '@/types/enum';
import type { ClassMember } from '@/types/member';

interface MemberRowProps {
  member: ClassMember;
  isTeacher: boolean;
  canEditRole?: boolean;
  onApprove?: (memberId: string) => Promise<void>;
  onReject?: (memberId: string) => Promise<void>;
  onRemove?: (memberId: string) => Promise<void>;
  onChangeRole?: (memberId: string, newRole: Role) => Promise<void>;
}

/**
 * Single table row rendering a class member using shadcn TableCell.
 * Displays user identity, student code, role badge, enrollment status, and role management.
 */
export function MemberRow({
  member,
  isTeacher,
  canEditRole = false,
  onApprove,
  onReject,
  onRemove,
  onChangeRole,
}: MemberRowProps) {
  const [isLoading, setIsLoading] = useState(false);

  const isPending = member.status === EnrollmentStatus.pending;
  const isApproved = member.status === EnrollmentStatus.approved;
  const isAssistant = member.role === Role.teacher;

  const handleAction = async (action: () => Promise<void> | undefined) => {
    setIsLoading(true);
    try {
      await action();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TableRow className="border-b border-border/60 hover:bg-muted/40 transition-colors">
      {/* 1. Student Identity */}
      <TableCell className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 overflow-hidden border border-primary/20">
            {member.user.avatarUrl ? (
              <Image
                src={member.user.avatarUrl}
                alt={member.user.fullName}
                width={36}
                height={36}
                className="size-full object-cover rounded-xl"
              />
            ) : (
              member.user.fullName.charAt(0)
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base font-medium text-foreground truncate">
              {member.user.fullName}
            </span>
            <span className="text-xs text-muted-foreground truncate">{member.user.email}</span>
          </div>
        </div>
      </TableCell>

      {/* 2. Student Code (MSSV) */}
      <TableCell className="py-3 px-4 text-xs sm:text-sm font-mono font-medium text-muted-foreground">
        {member.studentCode || '22520101'}
      </TableCell>

      {/* 3. Role Badge */}
      <TableCell className="py-3 px-4">
        {isAssistant ? (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-semibold gap-1">
            <ShieldCheck className="size-3" />
            Trợ giảng
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="border-border text-foreground text-xs font-medium gap-1"
          >
            <GraduationCap className="size-3 text-muted-foreground" />
            Sinh viên
          </Badge>
        )}
      </TableCell>

      {/* 4. Joined Date */}
      <TableCell className="py-3 px-4 text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
        {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString('vi-VN') : '—'}
      </TableCell>

      {/* 5. Enrollment Status */}
      <TableCell className="py-3 px-4">
        {isApproved ? (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold gap-1">
            <CheckCircle2 className="size-3" />
            Chính thức
          </Badge>
        ) : isPending ? (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold gap-1">
            <Clock className="size-3" />
            Chờ duyệt
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-xs">
            Từ chối
          </Badge>
        )}
      </TableCell>

      {/* 6. Teacher Actions */}
      {isTeacher && (
        <TableCell className="py-3 px-4 text-right">
          <div className="flex items-center justify-end gap-1.5">
            {isPending && onApprove && onReject && (
              <>
                <Button
                  type="button"
                  size="sm"
                  disabled={isLoading}
                  onClick={() => handleAction(() => onApprove(member.id))}
                  className="h-8 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold gap-1 shadow-xs"
                >
                  {isLoading ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Check className="size-3" />
                  )}
                  <span>Duyệt</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  title="Từ chối yêu cầu tham gia lớp"
                  disabled={isLoading}
                  onClick={() => handleAction(() => onReject(member.id))}
                  className="h-8 px-2.5 text-destructive hover:bg-destructive/10 border-destructive/30 rounded-lg text-xs font-semibold gap-1"
                >
                  <X className="size-3" />
                  <span>Từ chối</span>
                </Button>
              </>
            )}

            {isApproved && canEditRole && onChangeRole && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground rounded-lg"
                    title="Chỉnh sửa vai trò"
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 rounded-xl">
                  {isAssistant ? (
                    <DropdownMenuItem
                      onClick={() => handleAction(() => onChangeRole(member.id, Role.student))}
                      className="text-xs font-medium gap-2"
                    >
                      <GraduationCap className="size-4" />
                      <span>Đổi thành Sinh viên</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => handleAction(() => onChangeRole(member.id, Role.teacher))}
                      className="text-xs font-medium gap-2 text-primary"
                    >
                      <UserCog className="size-4" />
                      <span>Thăng làm Trợ giảng</span>
                    </DropdownMenuItem>
                  )}
                  {onRemove && (
                    <DropdownMenuItem
                      onClick={() => handleAction(() => onRemove(member.id))}
                      className="text-xs font-medium gap-2 text-destructive focus:text-destructive"
                    >
                      <Trash2 className="size-4" />
                      <span>Xóa khỏi lớp học</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {isApproved && (!canEditRole || !onChangeRole) && onRemove && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isLoading}
                onClick={() => handleAction(() => onRemove(member.id))}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                title="Xóa khỏi lớp học"
              >
                <Trash2 className="size-3.5" />
              </Button>
            )}
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}
