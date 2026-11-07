'use client';

import {
  ArrowLeft,
  MessageSquare,
  MoreVertical,
  Pencil,
  ShieldCheck,
  Trash2,
  User2,
  VenetianMask,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatForumDateTime, isEntityEdited } from '../utils/forum.utils';
import { Role } from '@/types/enum';
import type { Forum } from '@/types/forum';
import type { User } from '@/types/user';

interface ForumDetailViewProps {
  forum: Forum;
  classId: string;
  currentUser?: User | null;
  isTeacher?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

/**
 * Main article / discussion view displayed at the top of the detail page.
 */
export function ForumDetailView({
  forum,
  classId,
  currentUser,
  isTeacher = false,
  onEdit,
  onDelete,
}: ForumDetailViewProps) {
  const canDelete = isTeacher || (currentUser && forum.createdBy === currentUser.id);
  const canEdit = currentUser && forum.createdBy === currentUser.id;

  const isTeacherAuthor = forum.author?.role === Role.teacher;
  const commentCount = forum.commentCount ?? forum.comments?.length ?? 0;

  const formattedDate = formatForumDateTime(forum.createdAt);
  const hasBeenEdited = isEntityEdited(forum.createdAt, forum.updatedAt);
  const formattedUpdatedDate = forum.updatedAt ? formatForumDateTime(forum.updatedAt) : '';

  return (
    <div className="space-y-4">
      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1.5 -ml-2"
        >
          <Link href={`/classes/${classId}/forums`}>
            <ArrowLeft className="size-3.5" />
            <span>Quay lại diễn đàn</span>
          </Link>
        </Button>
      </div>

      {/* Main Forum Card */}
      <Card className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <CardContent className="p-5 sm:p-7 space-y-5">
          {/* Header with author info */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-border/60">
            <div className="flex items-center gap-3.5 min-w-0">
              {forum.isAnonymous ? (
                <div className="size-11 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-700">
                  <VenetianMask className="size-5.5" />
                </div>
              ) : forum.author?.avatarUrl ? (
                <div className="relative size-11 rounded-full overflow-hidden shrink-0 border border-border/80">
                  <Image
                    src={forum.author.avatarUrl}
                    alt={forum.author.fullName}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="size-11 rounded-full bg-primary/10 text-primary font-bold text-base flex items-center justify-center shrink-0 border border-primary/20">
                  <User2 className="size-5.5" />
                </div>
              )}

              <div className="flex flex-col min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-bold text-foreground truncate">
                    {forum.isAnonymous
                      ? 'Học viên ẩn danh'
                      : forum.author?.fullName || 'Thành viên'}
                  </span>

                  {forum.isAnonymous && (
                    <Badge
                      variant="outline"
                      className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-muted-foreground border-slate-300 dark:border-slate-700"
                    >
                      Ẩn danh
                    </Badge>
                  )}

                  {isTeacherAuthor && (
                    <Badge className="text-xs px-2.5 py-0.5 bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 gap-1 font-semibold">
                      <ShieldCheck className="size-3" />
                      Giảng viên
                    </Badge>
                  )}

                  {/* Teacher moderation hint for anonymous student */}
                  {isTeacher && forum.isAnonymous && forum.author && (
                    <span className="text-xs text-muted-foreground/80 font-normal truncate">
                      ({forum.author.fullName})
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                  <span>{formattedDate}</span>
                  {hasBeenEdited && (
                    <span className="text-[11px] text-muted-foreground/80 italic">
                      • Đã cập nhật {formattedUpdatedDate}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Menu options */}
            {((canEdit && onEdit) || (canDelete && onDelete)) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-lg text-muted-foreground hover:text-foreground shrink-0"
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="text-xs">
                  {canEdit && onEdit && (
                    <DropdownMenuItem onClick={onEdit} className="gap-2 cursor-pointer font-medium">
                      <Pencil className="size-3.5" />
                      <span>Sửa bài viết</span>
                    </DropdownMenuItem>
                  )}
                  {canDelete && onDelete && (
                    <DropdownMenuItem
                      onClick={onDelete}
                      className="text-rose-600 focus:text-rose-600 gap-2 cursor-pointer font-medium"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Xóa bài thảo luận</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Title & Body */}
          <div className="space-y-3">
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight leading-snug">
              {forum.title}
            </h1>
            <p className="text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {forum.content}
            </p>
          </div>

          {/* Footer counts */}
          <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-medium">
              <MessageSquare className="size-4 text-primary" />
              <span>
                <strong className="text-foreground">{commentCount}</strong> bình luận và câu trả lời
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
