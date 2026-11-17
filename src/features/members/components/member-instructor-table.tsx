'use client';

import { useState } from 'react';
import {
  Crown,
  Loader2,
  MoreVertical,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserCog,
  Users,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MemberDetailDialog } from './member-detail-dialog';
import { Role } from '@/types/enum';
import type { ClassMember } from '@/types/member';

interface MemberInstructorTableProps {
  instructors: ClassMember[];
  headTeacherId?: string;
  isHeadTeacher: boolean;
  onChangeRole?: (memberId: string, newRole: Role) => Promise<void>;
  onRemove?: (memberId: string) => Promise<void>;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function MemberInstructorTable({
  instructors,
  headTeacherId,
  isHeadTeacher,
  onChangeRole,
  onRemove,
  emptyTitle = 'Chưa có giảng viên hoặc trợ giảng',
  emptyDescription = 'Lớp học chưa có thông tin ban giảng huấn.',
}: MemberInstructorTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [detailMember, setDetailMember] = useState<ClassMember | null>(null);

  const handleAction = async (memberId: string, action: () => Promise<void>) => {
    setLoadingId(memberId);
    try {
      await action();
    } finally {
      setLoadingId(null);
    }
  };

  if (instructors.length === 0) {
    return (
      <div className="py-8 px-4 text-center rounded-lg border border-dashed border-border bg-card/60 space-y-2">
        <Users className="size-8 text-muted-foreground mx-auto stroke-1" />
        <h4 className="text-sm font-bold text-foreground">{emptyTitle}</h4>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-border/80 bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-primary/5 dark:bg-primary/10 border-b border-primary/20">
            <TableRow className="border-b border-primary/20 text-xs font-bold uppercase tracking-wider">
              <TableHead className="py-3 px-4 font-bold text-foreground">
                Giảng viên / Trợ giảng
              </TableHead>
              <TableHead className="py-3 px-4 font-bold text-foreground">Mã CB/GV</TableHead>
              <TableHead className="py-3 px-4 font-bold text-foreground">Vai trò</TableHead>
              <TableHead className="py-3 px-4 font-bold text-foreground">Ngày phân công</TableHead>
              <TableHead className="py-3 px-4 font-bold text-foreground">Trạng thái</TableHead>
              {isHeadTeacher && (
                <TableHead className="py-3 px-4 text-right font-bold text-foreground">
                  Thao tác
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {instructors.map((member) => {
              const isHead = member.userId === headTeacherId;
              const avatarSrc = member.user.avatar || member.user.avatarUrl || undefined;
              const isLoading = loadingId === member.id;

              return (
                <TableRow
                  key={member.id}
                  className="border-b border-border/60 hover:bg-muted/40 transition-colors"
                >
                  {/* 1. Profile information with click-to-view detail */}
                  <TableCell className="py-3 px-4">
                    <div
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => setDetailMember(member)}
                      title="Nhấn để xem thông tin giảng viên"
                    >
                      <Avatar className="size-9 rounded-xl border border-primary/20 shrink-0">
                        <AvatarImage
                          src={avatarSrc}
                          alt={member.user.fullName}
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-xl font-bold text-xs bg-primary/10 text-primary">
                          {member.user.fullName?.substring(0, 2).toUpperCase() || 'GV'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {member.user.fullName}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {member.user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* 2. Identity / Staff Code */}
                  <TableCell className="py-3 px-4 text-xs font-mono font-medium text-muted-foreground">
                    {member.user?.identityCode ||
                      member.studentCode ||
                      member.identityCode ||
                      'Chưa cập nhật'}
                  </TableCell>

                  {/* 3. Prominent Role Badge */}
                  <TableCell className="py-3 px-4">
                    {isHead ? (
                      <Badge className="bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/40 text-xs font-semibold gap-1.5 py-0.5 px-2.5">
                        <Crown className="size-3.5 text-amber-500 fill-amber-500" />
                        <span>Chủ nhiệm lớp</span>
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/40 text-xs font-semibold gap-1.5 py-0.5 px-2.5">
                        <ShieldCheck className="size-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Trợ giảng</span>
                      </Badge>
                    )}
                  </TableCell>

                  {/* 4. Joined date */}
                  <TableCell className="py-3 px-4 text-xs text-muted-foreground">
                    {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString('vi-VN') : '—'}
                  </TableCell>

                  {/* 5. Status Badge */}
                  <TableCell className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-xs font-semibold gap-1 py-0.5 px-2"
                    >
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <UserCheck className="size-3" />
                      <span>Đang giảng dạy</span>
                    </Badge>
                  </TableCell>

                  {/* 6. Teacher Operations */}
                  {isHeadTeacher && (
                    <TableCell className="py-3 px-4 text-right">
                      {isHead ? (
                        <span className="text-xs text-muted-foreground italic font-medium px-2 py-1">
                          Trưởng phụ trách
                        </span>
                      ) : !onChangeRole && !onRemove ? (
                        <span className="text-xs text-muted-foreground italic font-medium px-2 py-1">
                          Trợ giảng
                        </span>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={isLoading}
                              className="size-8 text-muted-foreground hover:text-foreground"
                            >
                              {isLoading ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <MoreVertical className="size-4" />
                              )}
                              <span className="sr-only">Tùy chọn trợ giảng</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            {onChangeRole && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleAction(member.id, () =>
                                    onChangeRole(member.id, Role.student),
                                  )
                                }
                                className="text-xs font-medium gap-2"
                              >
                                <UserCog className="size-4" />
                                <span>Chuyển về Sinh viên</span>
                              </DropdownMenuItem>
                            )}
                            {onRemove && (
                              <DropdownMenuItem
                                onClick={() => handleAction(member.id, () => onRemove(member.id))}
                                className="text-xs font-medium gap-2 text-destructive focus:text-destructive"
                              >
                                <Trash2 className="size-4" />
                                <span>Xóa khỏi ban trợ giảng</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Member Details Modal for Instructors */}
      <MemberDetailDialog
        open={Boolean(detailMember)}
        onOpenChange={(open) => !open && setDetailMember(null)}
        member={detailMember}
        isHeadTeacher={detailMember?.userId === headTeacherId}
      />
    </>
  );
}
