'use client';

import { useState } from 'react';
import {
  Ban,
  Check,
  CheckCircle2,
  Clock,
  GraduationCap,
  Loader2,
  MoreVertical,
  RotateCcw,
  ShieldCheck,
  Trash2,
  UserCog,
  UserX,
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
  onReApprove?: (memberId: string) => Promise<void>;
  onBan?: (memberId: string) => Promise<void>;
  onUnban?: (memberId: string) => Promise<void>;
  onUnbanAndApprove?: (memberId: string) => Promise<void>;
  onResetBan?: (memberId: string) => Promise<void>;
  onRemove?: (memberId: string) => Promise<void>;
  onChangeRole?: (memberId: string, newRole: Role) => Promise<void>;
}

export function MemberRow({
  member,
  isTeacher,
  canEditRole = false,
  onApprove,
  onReject,
  onReApprove,
  onBan,
  onUnban,
  onUnbanAndApprove,
  onResetBan,
  onRemove,
  onChangeRole,
}: MemberRowProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const isPending = member.status === EnrollmentStatus.pending;
  const isApproved = member.status === EnrollmentStatus.approved;
  const isRejected = member.status === EnrollmentStatus.rejected;
  const isSuspended = member.status === EnrollmentStatus.suspended;
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
              <span className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {member.user.fullName}
              </span>
              <span className="text-xs text-muted-foreground truncate">{member.user.email}</span>
            </div>
          </div>
        </TableCell>

        {/* 2. Student Code (MSSV) */}
        <TableCell className="py-3 px-4 text-xs font-mono font-medium text-muted-foreground">
          {member.user?.identityCode ||
            member.studentCode ||
            member.identityCode ||
            'Chưa cập nhật'}
        </TableCell>

        {/* 3. Role Badge */}
        <TableCell className="py-3 px-4">
          {isAssistant ? (
            <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/40 text-xs font-semibold gap-1.5 py-0.5 px-2.5">
              <ShieldCheck className="size-3.5 text-blue-600 dark:text-blue-400" />
              <span>Trợ giảng</span>
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-border text-foreground text-xs font-semibold gap-1.5 py-0.5 px-2.5"
            >
              <GraduationCap className="size-3.5" />
              <span>Sinh viên</span>
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
              className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-xs font-semibold gap-1 py-0.5 px-2"
            >
              <CheckCircle2 className="size-3" />
              <span>Đã tham gia</span>
            </Badge>
          ) : isPending ? (
            <Badge
              variant="outline"
              className="border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 text-xs font-semibold gap-1 py-0.5 px-2"
            >
              <Clock className="size-3" />
              <span>Chờ duyệt</span>
            </Badge>
          ) : isSuspended ? (
            <Badge
              variant="outline"
              className="border-destructive/40 text-destructive bg-destructive/10 text-xs font-semibold gap-1 py-0.5 px-2"
            >
              <Ban className="size-3" />
              <span>Bị cấm</span>
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-border text-muted-foreground text-xs font-semibold gap-1 py-0.5 px-2"
            >
              <UserX className="size-3" />
              <span>Từ chối</span>
            </Badge>
          )}
        </TableCell>

        {/* 6. Teacher Actions */}
        {isTeacher && (
          <TableCell className="py-3 px-4 text-right">
            <div className="flex items-center justify-end gap-1.5">
              {/* Actions for Pending Requests: Duyệt, Từ chối, Cấm */}
              {isPending && (
                <>
                  {onApprove && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isLoading}
                      onClick={() => handleAction(() => onApprove(member.id))}
                      className="h-8 px-2.5 text-xs text-emerald-600 border-emerald-500/40 hover:bg-emerald-500/10 font-semibold gap-1"
                    >
                      {isLoading ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Check className="size-3" />
                      )}
                      Duyệt
                    </Button>
                  )}
                  {onReject && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={isLoading}
                      onClick={() => handleAction(() => onReject(member.id))}
                      className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10 font-semibold gap-1"
                    >
                      <X className="size-3" />
                      Từ chối
                    </Button>
                  )}
                  {onBan && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={isLoading}
                      onClick={() => handleAction(() => onBan(member.id))}
                      className="h-8 px-2 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 font-semibold gap-1"
                      title="Cấm sinh viên này"
                    >
                      <Ban className="size-3" />
                      Cấm
                    </Button>
                  )}
                </>
              )}

              {/* Actions for Rejected Requests: Duyệt lại hoặc Cấm (kèm Xóa bản ghi) */}
              {isRejected && (
                <>
                  {onReApprove && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isLoading}
                      onClick={() => handleAction(() => onReApprove(member.id))}
                      className="h-8 px-2.5 text-xs text-primary border-primary/40 hover:bg-primary/10 font-semibold gap-1"
                    >
                      {isLoading ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <RotateCcw className="size-3" />
                      )}
                      Duyệt lại
                    </Button>
                  )}
                  {onBan && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isLoading}
                      onClick={() => handleAction(() => onBan(member.id))}
                      className="h-8 px-2 text-xs text-amber-600 border-amber-500/40 hover:bg-amber-500/10 font-semibold gap-1"
                    >
                      <Ban className="size-3" />
                      Cấm
                    </Button>
                  )}
                  {onRemove && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isLoading}
                      onClick={() => handleAction(() => onRemove(member.id))}
                      className="size-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                      title="Xóa bản ghi"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </>
              )}

              {/* Actions for Suspended: Duyệt vào lớp HOẶC Gỡ cấm cho đăng ký lại */}
              {isSuspended && (
                <>
                  {(onUnbanAndApprove || onUnban) && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isLoading}
                      onClick={() =>
                        handleAction(() =>
                          onUnbanAndApprove ? onUnbanAndApprove(member.id) : onUnban!(member.id),
                        )
                      }
                      className="h-8 px-2.5 text-xs text-emerald-600 border-emerald-500/40 hover:bg-emerald-500/10 font-semibold gap-1"
                    >
                      {isLoading ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Check className="size-3" />
                      )}
                      Duyệt vào lớp
                    </Button>
                  )}
                  {onResetBan && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isLoading}
                      onClick={() => handleAction(() => onResetBan(member.id))}
                      className="h-8 px-2 text-xs text-blue-600 border-blue-500/40 hover:bg-blue-500/10 font-semibold gap-1"
                      title="Gỡ cấm cho phép sinh viên nộp lại đơn xin vào lớp"
                    >
                      <RotateCcw className="size-3" />
                      Cho ĐK lại
                    </Button>
                  )}
                  {onRemove && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isLoading}
                      onClick={() => handleAction(() => onRemove(member.id))}
                      className="size-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                      title="Xóa vĩnh viễn"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </>
              )}

              {/* Actions for Approved Members: Đuổi khỏi lớp hoặc Cấm */}
              {isApproved && ((canEditRole && onChangeRole) || onBan || onRemove) && (
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
                    {canEditRole && onChangeRole && isAssistant && (
                      <DropdownMenuItem
                        onClick={() => handleAction(() => onChangeRole(member.id, Role.student))}
                        className="text-xs font-medium gap-2"
                      >
                        <UserCog className="size-4" />
                        <span>Chuyển về Sinh viên</span>
                      </DropdownMenuItem>
                    )}
                    {canEditRole && onChangeRole && !isAssistant && (
                      <DropdownMenuItem
                        onClick={() => handleAction(() => onChangeRole(member.id, Role.teacher))}
                        className="text-xs font-medium gap-2 text-primary"
                      >
                        <UserCog className="size-4" />
                        <span>Thăng làm Trợ giảng</span>
                      </DropdownMenuItem>
                    )}
                    {onBan && !isAssistant && (
                      <DropdownMenuItem
                        onClick={() => handleAction(() => onBan(member.id))}
                        className="text-xs font-medium gap-2 text-amber-600 focus:text-amber-600"
                      >
                        <Ban className="size-4" />
                        <span>Cấm khỏi lớp học</span>
                      </DropdownMenuItem>
                    )}
                    {onRemove && (
                      <DropdownMenuItem
                        onClick={() => handleAction(() => onRemove(member.id))}
                        className="text-xs font-medium gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 className="size-4" />
                        <span>Đuổi khỏi lớp học</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </TableCell>
        )}
      </TableRow>

      {/* Member Details Modal */}
      <MemberDetailDialog open={showDetail} onOpenChange={setShowDetail} member={member} />
    </>
  );
}
