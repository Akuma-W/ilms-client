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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { MemberDetailDialog } from './member-detail-dialog';
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
  const [showDetail, setShowDetail] = useState(false);

  const isPending = member.status === EnrollmentStatus.pending;
  const isApproved = member.status === EnrollmentStatus.approved;
  const isAssistant = member.role === Role.teacher;
  const avatarSrc = member.user.avatar || member.user.avatarUrl || undefined;

  const handleAction = async (action: () => Promise<void> | undefined) => {
    setIsLoading(true);
    try {
      await action();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TableRow className="border-b border-border/60 hover:bg-muted/40 transition-colors">
        {/* 1. Student Identity with interactive click */}
        <TableCell className="py-3 px-4">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setShowDetail(true)}
            title="Nhấn để xem thông tin lớp học"
          >
            <Avatar className="size-9 rounded-xl border border-primary/20 shrink-0">
              <AvatarImage src={avatarSrc} alt={member.user.fullName} className="object-cover" />
              <AvatarFallback className="rounded-xl font-bold text-xs bg-primary/10 text-primary">
                {member.user.fullName?.substring(0, 2).toUpperCase() || 'SV'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm sm:text-base font-medium text-foreground truncate group-hover:text-primary transition-colors">
                {member.user.fullName}
              </span>
              <span className="text-xs text-muted-foreground truncate">{member.user.email}</span>
            </div>
          </div>
        </TableCell>

        {/* 2. Student Code (MSSV) */}
        <TableCell className="py-3 px-4 text-xs sm:text-sm font-mono font-medium text-muted-foreground">
          {member.studentCode || member.user.identityCode || 'Chưa có'}
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
              <GraduationCap className="size-3" />
              Sinh viên
            </Badge>
          )}
        </TableCell>

        {/* 4. Join Date */}
        <TableCell className="py-3 px-4 text-xs text-muted-foreground">
          {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString('vi-VN') : '—'}
        </TableCell>

        {/* 5. Status Badge */}
        <TableCell className="py-3 px-4">
          {isApproved ? (
            <Badge
              variant="outline"
              className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-xs gap-1"
            >
              <CheckCircle2 className="size-3" />
              Đã tham gia
            </Badge>
          ) : isPending ? (
            <Badge
              variant="outline"
              className="border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 text-xs gap-1"
            >
              <Clock className="size-3" />
              Chờ duyệt
            </Badge>
          ) : (
            <Badge variant="outline" className="border-border text-muted-foreground text-xs">
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
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => handleAction(() => onApprove(member.id))}
                    className="h-8 px-2.5 text-xs text-emerald-600 border-emerald-500/40 hover:bg-emerald-500/10 font-semibold gap-1"
                  >
                    {isLoading ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                    Duyệt
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={isLoading}
                    onClick={() => handleAction(() => onReject(member.id))}
                    className="h-8 px-2.5 text-xs text-destructive hover:bg-destructive/10 font-semibold gap-1"
                  >
                    <X className="size-3" />
                    Từ chối
                  </Button>
                </>
              )}

              {isApproved && canEditRole && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isLoading}
                      className="size-8 text-muted-foreground hover:text-foreground"
                    >
                      <MoreVertical className="size-4" />
                      <span className="sr-only">Tùy chọn</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    {onChangeRole && isAssistant && (
                      <DropdownMenuItem
                        onClick={() => handleAction(() => onChangeRole(member.id, Role.student))}
                        className="text-xs font-medium gap-2"
                      >
                        <UserCog className="size-4" />
                        <span>Chuyển về Sinh viên</span>
                      </DropdownMenuItem>
                    )}
                    {onChangeRole && !isAssistant && (
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
                  className="size-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                  title="Xóa khỏi lớp học"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              )}
            </div>
          </TableCell>
        )}
      </TableRow>

      {/* Member Details Modal */}
      <MemberDetailDialog
        open={showDetail}
        onOpenChange={setShowDetail}
        member={member}
      />
    </>
  );
}
