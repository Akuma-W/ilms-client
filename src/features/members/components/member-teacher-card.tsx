'use client';

import { Crown, GraduationCap, Mail, MoreVertical, ShieldCheck, Trash2, User2 } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Role } from '@/types/enum';
import type { User } from '@/types/user';

interface MemberTeacherCardProps {
  teacher: User;
  isHead?: boolean;
  canEdit?: boolean;
  onChangeRole?: (newRole: Role) => void;
  onRemove?: () => void;
}

/**
 * Featured profile card for class instructors and teaching assistants.
 * Prominently highlights the Head Teacher with distinctive accents.
 * Supports role modification (demote to student, remove) for teaching assistants.
 */
export function MemberTeacherCard({
  teacher,
  isHead = false,
  canEdit = false,
  onChangeRole,
  onRemove,
}: MemberTeacherCardProps) {
  return (
    <Card
      className={`rounded-2xl transition-all duration-200 overflow-hidden relative ${
        isHead
          ? 'border-2 border-primary/50 bg-linear-to-br from-primary/10 via-card to-card shadow-sm'
          : 'border border-border/80 bg-card/80 shadow-2xs hover:border-border'
      }`}
    >
      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Avatar */}
        <div
          className={`relative rounded-2xl flex items-center justify-center text-primary font-bold shrink-0 overflow-hidden transition-all ${
            isHead
              ? 'size-16 ring-2 ring-primary/30 border-2 border-amber-400/80 bg-primary/15 text-2xl shadow-xs'
              : 'size-13 border border-primary/20 bg-primary/10 text-xl'
          }`}
        >
          {teacher.avatarUrl ? (
            <Image
              src={teacher.avatarUrl}
              alt={teacher.fullName}
              fill
              sizes={isHead ? '64px' : '52px'}
              className="object-cover"
            />
          ) : (
            <User2 className={isHead ? 'size-7' : 'size-5'} />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 space-y-1 text-center sm:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h4
              className={`font-bold text-foreground truncate ${
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

        {/* Assistant Role Management Dropdown (Visible only to Head Teacher) */}
        {!isHead && canEdit && (
          <div className="absolute top-3 right-3 sm:relative sm:top-auto sm:right-auto shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                  title="Tùy chọn trợ giảng"
                >
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 text-xs">
                {onChangeRole && (
                  <DropdownMenuItem
                    onClick={() => onChangeRole(Role.student)}
                    className="gap-2 text-xs font-medium"
                  >
                    <GraduationCap className="size-3.5 text-primary" />
                    <span>Đổi thành Sinh viên</span>
                  </DropdownMenuItem>
                )}
                {onRemove && (
                  <DropdownMenuItem
                    onClick={onRemove}
                    className="gap-2 text-xs font-medium text-rose-600 focus:text-rose-600"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Xóa khỏi lớp học</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
