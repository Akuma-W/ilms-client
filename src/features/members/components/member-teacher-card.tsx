'use client';

import { useState } from 'react';
import { Crown, Mail, MoreVertical, ShieldCheck, Trash2, User2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MemberDetailDialog } from './member-detail-dialog';
import { Role } from '@/types/enum';
import type { User } from '@/types/user';

interface MemberTeacherCardProps {
  teacher: User;
  isHead?: boolean;
  canEdit?: boolean;
  onChangeRole?: (newRole: Role) => void;
  onRemove?: () => void;
}

export function MemberTeacherCard({
  teacher,
  isHead = false,
  canEdit = false,
  onChangeRole,
  onRemove,
}: MemberTeacherCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const avatarSrc = teacher.avatar || teacher.avatarUrl || undefined;

  return (
    <>
      <Card
        className={`rounded-2xl transition-all duration-200 overflow-hidden relative cursor-pointer group ${
          isHead
            ? 'border-2 border-primary/50 bg-linear-to-br from-primary/10 via-card to-card shadow-sm hover:shadow-md'
            : 'border border-border/80 bg-card/80 shadow-2xs hover:border-border hover:shadow-sm'
        }`}
        onClick={() => setShowDetail(true)}
      >
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Avatar with Radix Avatar */}
          <Avatar
            className={`rounded-2xl shrink-0 overflow-hidden transition-all ${
              isHead
                ? 'size-16 ring-2 ring-primary/30 border-2 border-amber-400/80 bg-primary/15 shadow-xs'
                : 'size-13 border border-primary/20 bg-primary/10'
            }`}
          >
            <AvatarImage src={avatarSrc} alt={teacher.fullName} className="object-cover" />
            <AvatarFallback className="rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white font-bold text-lg">
              {teacher.fullName?.substring(0, 2).toUpperCase() || <User2 className="size-6" />}
            </AvatarFallback>
          </Avatar>

          {/* Details */}
          <div className="flex-1 space-y-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h4
                className={`font-bold text-foreground truncate group-hover:text-primary transition-colors ${
                  isHead ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                }`}
              >
                {teacher.fullName}
              </h4>

              {isHead ? (
                <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 text-xs font-bold gap-1 px-2.5 py-0.5 shadow-2xs">
                  <Crown className="size-3 text-amber-500" />
                  Giảng viên chủ nhiệm
                </Badge>
              ) : (
                <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-semibold gap-1 px-2.5 py-0.5">
                  <ShieldCheck className="size-3" />
                  Trợ giảng
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 truncate">
              <Mail className="size-3.5 shrink-0 text-muted-foreground/80" />
              <span>{teacher.email}</span>
            </p>
          </div>

          {/* Assistant Role Management Dropdown */}
          {!isHead && canEdit && (
            <div
              className="absolute top-3 right-3 sm:relative sm:top-auto sm:right-auto shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-foreground"
                  >
                    <MoreVertical className="size-4" />
                    <span className="sr-only">Tùy chọn</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {onChangeRole && (
                    <DropdownMenuItem
                      onClick={() => onChangeRole(Role.student)}
                      className="text-xs font-medium cursor-pointer"
                    >
                      <span>Chuyển thành sinh viên</span>
                    </DropdownMenuItem>
                  )}
                  {onRemove && (
                    <DropdownMenuItem
                      onClick={onRemove}
                      className="text-xs font-medium text-destructive focus:text-destructive cursor-pointer"
                    >
                      <Trash2 className="size-3.5 mr-2" />
                      <span>Xóa khỏi lớp học</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Member Details Modal */}
      <MemberDetailDialog
        open={showDetail}
        onOpenChange={setShowDetail}
        teacher={teacher}
        isHeadTeacher={isHead}
      />
    </>
  );
}
