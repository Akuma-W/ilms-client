'use client';

import {
  ArrowRight,
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

interface ForumCardProps {
  forum: Forum;
  classId: string;
  currentUser?: User | null;
  isTeacher?: boolean;
  onEdit?: (forum: Forum) => void;
  onDelete?: (forumId: string) => void;
}

/**
 * Facebook / Threads style feed card representing a single classroom discussion post.
 * Supports anonymous presentation, teacher author badges, and answer counters.
 */
export function ForumCard({
  forum,
  classId,
  currentUser,
  isTeacher = false,
  onEdit,
  onDelete,
}: ForumCardProps) {
  const canDelete = isTeacher || (currentUser && forum.createdBy === currentUser.id);
  const canEdit = currentUser && forum.createdBy === currentUser.id;

  const isTeacherAuthor = forum.author?.role === Role.teacher;
  const commentCount = forum.commentCount ?? forum.comments?.length ?? 0;
  const isUnanswered = commentCount === 0;

  const formattedDate = formatForumDateTime(forum.createdAt);
  const hasBeenEdited = isEntityEdited(forum.createdAt, forum.updatedAt);
  const formattedUpdatedDate = forum.updatedAt ? formatForumDateTime(forum.updatedAt) : '';

  return (
    <Card className="rounded-2xl border border-border/80 bg-card hover:border-border transition-all duration-200 shadow-2xs hover:shadow-xs overflow-hidden">
      <CardContent className="p-4 sm:p-4.5 space-y-2.5">
        {/* Post Author Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {forum.isAnonymous ? (
              <div className="size-9 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-700">
                <VenetianMask className="size-4.5" />
              </div>
            ) : forum.author?.avatarUrl ? (
              <div className="relative size-9 rounded-full overflow-hidden shrink-0 border border-border/80">
                <Image
                  src={forum.author.avatarUrl}
                  alt={forum.author.fullName}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="size-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                <User2 className="size-4.5" />
              </div>
            )}

            <div className="flex flex-col min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-sm font-semibold text-foreground truncate">
                  {forum.isAnonymous ? 'Học viên ẩn danh' : forum.author?.fullName || 'Thành viên'}
                </span>

                {currentUser && forum.createdBy === currentUser.id && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 h-4.5 bg-primary/10 text-primary border border-primary/20 font-medium"
                  >
                    Bạn
                  </Badge>
                )}

                {forum.isAnonymous && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 h-4.5 bg-slate-100 dark:bg-slate-800 text-muted-foreground border-slate-300 dark:border-slate-700"
                  >
                    Ẩn danh
                  </Badge>
                )}

                {isTeacherAuthor && (
                  <Badge className="text-[10px] px-2 py-0 h-4.5 bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 gap-1 font-semibold">
                    <ShieldCheck className="size-2.5" />
                    Giảng viên
                  </Badge>
                )}

                {/* Teacher moderation hint for anonymous student */}
                {isTeacher && forum.isAnonymous && forum.author && (
                  <span className="text-[11px] text-muted-foreground/80 font-normal truncate">
                    ({forum.author.fullName})
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <span>{formattedDate}</span>
                {hasBeenEdited && (
                  <span className="text-[11px] text-muted-foreground/80 italic">
                    • Đã cập nhật {formattedUpdatedDate}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Menu */}
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
                  <DropdownMenuItem
                    onClick={() => onEdit(forum)}
                    className="gap-2 cursor-pointer font-medium"
                  >
                    <Pencil className="size-3.5" />
                    <span>Sửa bài viết</span>
                  </DropdownMenuItem>
                )}
                {canDelete && onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(forum.id)}
                    className="text-rose-600 focus:text-rose-600 gap-2 cursor-pointer font-medium"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Xóa bài viết</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Post Title & Content */}
        <div className="space-y-1.5">
          <Link
            href={`/classes/${classId}/forums/${forum.id}`}
            className="block text-base sm:text-lg font-bold text-foreground hover:text-primary transition-colors leading-snug"
          >
            {forum.title}
          </Link>
          <p className="text-sm text-foreground/85 leading-relaxed line-clamp-2 whitespace-pre-wrap">
            {forum.content}
          </p>
        </div>

        {/* Post Footer: Response Count & CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <MessageSquare className="size-3.5 text-muted-foreground" />
            {isUnanswered ? (
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                Chưa có câu trả lời
              </span>
            ) : (
              <span className="text-muted-foreground">
                <strong className="text-foreground">{commentCount}</strong> câu trả lời
              </span>
            )}
          </div>

          <Link
            href={`/classes/${classId}/forums/${forum.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>Xem thảo luận</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
