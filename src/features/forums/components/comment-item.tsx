'use client';

import { useState } from 'react';
import {
  CornerDownRight,
  MoreVertical,
  Pencil,
  Reply,
  ShieldCheck,
  Trash2,
  User2,
  VenetianMask,
} from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatForumDateTime, isEntityEdited } from '../utils/forum.utils';
import { Role } from '@/types/enum';
import type { Comment } from '@/types/forum';
import type { User } from '@/types/user';

interface CommentItemProps {
  comment: Comment;
  forumId: string;
  currentUser?: User | null;
  isTeacher?: boolean;
  onTriggerReply: (commentId: string, authorName: string) => void;
  onEditComment?: (commentId: string, newContent: string) => Promise<void>;
  onDeleteComment?: (commentId: string) => void;
  isNestedReply?: boolean;
}

/**
 * Individual comment component supporting recursive nested responses,
 * inline edit mode, full date with year, and soft delete placeholders.
 */
export function CommentItem({
  comment,
  forumId,
  currentUser,
  isTeacher = false,
  onTriggerReply,
  onEditComment,
  onDeleteComment,
  isNestedReply = false,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Soft deleted comment presentation
  if (comment.isDeleted) {
    return (
      <div className="space-y-3">
        <div
          className={`p-3.5 rounded-2xl border border-dashed border-border/80 bg-muted/40 text-xs text-muted-foreground italic flex items-center gap-2 ${
            isNestedReply ? 'bg-muted/20' : ''
          }`}
        >
          <Trash2 className="size-3.5 text-muted-foreground/60 shrink-0" />
          <span>Bình luận này đã bị xóa bởi tác giả hoặc giảng viên.</span>
        </div>

        {/* Retain child responses visible underneath */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="border-l-2 border-primary/20 pl-3 sm:pl-6 space-y-3 mt-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              <CornerDownRight className="size-3 text-primary" />
              <span>{comment.replies.length} phản hồi</span>
            </div>

            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                forumId={forumId}
                currentUser={currentUser}
                isTeacher={isTeacher}
                onTriggerReply={onTriggerReply}
                onEditComment={onEditComment}
                onDeleteComment={onDeleteComment}
                isNestedReply={true}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isOwnComment = Boolean(currentUser && comment.authorId === currentUser.id);
  const canDelete = isTeacher || isOwnComment;
  const canEdit = isOwnComment;
  const isTeacherAuthor = comment.author?.role === Role.teacher;

  const formattedDate = formatForumDateTime(comment.createdAt);
  const hasBeenEdited = isEntityEdited(comment.createdAt, comment.updatedAt);
  const formattedUpdatedDate = comment.updatedAt ? formatForumDateTime(comment.updatedAt) : '';

  const authorDisplayName = comment.isAnonymous
    ? 'Học viên ẩn danh'
    : comment.author?.fullName || 'Thành viên';

  const handleSaveEdit = async () => {
    if (!editContent.trim() || !onEditComment) return;
    setIsSavingEdit(true);
    try {
      await onEditComment(comment.id, editContent.trim());
      setIsEditing(false);
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={`p-4 rounded-2xl border transition-all ${
          isNestedReply
            ? 'bg-muted/30 border-border/60 shadow-2xs'
            : 'bg-card border-border/80 shadow-2xs'
        }`}
      >
        {/* Comment Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {comment.isAnonymous ? (
              <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-700">
                <VenetianMask className="size-4" />
              </div>
            ) : comment.author?.avatarUrl ? (
              <div className="relative size-8 rounded-full overflow-hidden shrink-0 border border-border/80">
                <Image
                  src={comment.author.avatarUrl}
                  alt={comment.author.fullName}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="size-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                <User2 className="size-4" />
              </div>
            )}

            <div className="flex flex-col min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs sm:text-sm font-semibold text-foreground truncate">
                  {authorDisplayName}
                </span>

                {isOwnComment && (
                  <Badge
                    variant="secondary"
                    className="text-[9px] px-1.5 py-0 h-4 bg-primary/10 text-primary border border-primary/20 font-medium"
                  >
                    Bạn
                  </Badge>
                )}

                {comment.isAnonymous && (
                  <Badge
                    variant="outline"
                    className="text-[9px] px-1.5 py-0 h-4 bg-slate-100 dark:bg-slate-800 text-muted-foreground border-slate-300 dark:border-slate-700"
                  >
                    Ẩn danh
                  </Badge>
                )}

                {isTeacherAuthor && (
                  <Badge className="text-[9px] px-1.5 py-0 h-4 bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 gap-1 font-semibold">
                    <ShieldCheck className="size-2.5" />
                    Giảng viên
                  </Badge>
                )}

                {/* Teacher moderation hint for anonymous student */}
                {isTeacher && comment.isAnonymous && comment.author && (
                  <span className="text-[11px] text-muted-foreground/80 font-normal truncate">
                    ({comment.author.fullName})
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                <span>{formattedDate}</span>
                {hasBeenEdited && (
                  <span className="text-[10px] text-muted-foreground/80 italic">
                    • Đã cập nhật {formattedUpdatedDate}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Menu (Edit / Delete) */}
          {((canEdit && onEditComment) || (canDelete && onDeleteComment)) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 rounded-lg text-muted-foreground hover:text-foreground shrink-0"
                >
                  <MoreVertical className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs">
                {canEdit && onEditComment && (
                  <DropdownMenuItem
                    onClick={() => {
                      setEditContent(comment.content);
                      setIsEditing(true);
                    }}
                    className="gap-2 cursor-pointer font-medium"
                  >
                    <Pencil className="size-3" />
                    <span>Sửa bình luận</span>
                  </DropdownMenuItem>
                )}
                {canDelete && onDeleteComment && (
                  <DropdownMenuItem
                    onClick={() => onDeleteComment(comment.id)}
                    className="text-rose-600 focus:text-rose-600 gap-2 cursor-pointer font-medium"
                  >
                    <Trash2 className="size-3" />
                    <span>Xóa bình luận</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Comment Content / Inline Edit Form */}
        {isEditing ? (
          <div className="space-y-2 pt-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              className="text-xs sm:text-sm rounded-xl resize-y min-h-15 max-h-40 bg-background/90"
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={isSavingEdit}
                className="h-7 px-2.5 text-xs rounded-lg"
              >
                Hủy
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSaveEdit}
                disabled={isSavingEdit || !editContent.trim()}
                className="h-7 px-3 text-xs font-semibold rounded-lg"
              >
                {isSavingEdit ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap pt-2">
            {comment.content}
          </p>
        )}

        {/* Reply Trigger Button */}
        {!isEditing && (
          <div className="pt-2 flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onTriggerReply(comment.id, authorDisplayName)}
              className="h-7 px-2 text-xs text-primary hover:text-primary/90 hover:bg-primary/5 gap-1.5 font-medium -ml-1 rounded-lg"
            >
              <Reply className="size-3" />
              <span>Trả lời</span>
            </Button>
          </div>
        )}
      </div>

      {/* Nested Replies List */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="border-l-2 border-primary/20 pl-3 sm:pl-6 space-y-3 mt-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            <CornerDownRight className="size-3 text-primary" />
            <span>{comment.replies.length} phản hồi</span>
          </div>

          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              forumId={forumId}
              currentUser={currentUser}
              isTeacher={isTeacher}
              onTriggerReply={onTriggerReply}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
              isNestedReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
