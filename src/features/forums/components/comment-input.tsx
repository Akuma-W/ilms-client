'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Reply, Send, VenetianMask, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createCommentSchema, type CreateCommentFormData } from '../schemas/forum.schema';
import { Role } from '@/types/enum';
import type { User } from '@/types/user';

interface CommentInputProps {
  forumId: string;
  parentId?: string | null;
  currentUser?: User | null;
  onSubmit: (data: CreateCommentFormData) => Promise<void>;
  placeholder?: string;
  isReply?: boolean;
  replyingTo?: { commentId: string; authorName: string } | null;
  onCancelReply?: () => void;
  onCancel?: () => void;
}

/**
 * Textarea composer for new comments or nested replies.
 * Includes anonymous toggle for student users and smooth form validation.
 */
export function CommentInput({
  parentId = null,
  currentUser,
  onSubmit,
  placeholder = 'Viết câu trả lời hoặc thảo luận của bạn...',
  isReply = false,
  replyingTo = null,
  onCancelReply,
  onCancel,
}: CommentInputProps) {
  const isStudent = currentUser?.role !== Role.teacher;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCommentFormData>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: '',
      isAnonymous: false,
      parentId,
    },
  });

  const handleFormSubmit = async (values: CreateCommentFormData) => {
    const targetParentId = replyingTo ? replyingTo.commentId : parentId;
    await onSubmit({
      ...values,
      parentId: targetParentId,
    });
    reset({
      content: '',
      isAnonymous: false,
      parentId: null,
    });
    onCancelReply?.();
    onCancel?.();
  };

  return (
    <Card
      className={`rounded-2xl border transition-all ${
        isReply || replyingTo
          ? 'border-primary/40 bg-primary/5 shadow-2xs mt-3'
          : 'border-border/80 bg-card shadow-xs'
      }`}
    >
      <CardContent className="p-4 sm:p-5 space-y-3">
        {/* Reply Target Indicator */}
        {replyingTo && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/25 text-xs text-foreground">
            <div className="flex items-center gap-1.5 font-medium truncate">
              <Reply className="size-3.5 text-primary shrink-0" />
              <span>
                Đang trả lời <strong>@{replyingTo.authorName}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={onCancelReply}
              className="text-muted-foreground hover:text-foreground shrink-0 cursor-pointer p-0.5 rounded-md hover:bg-primary/20"
              title="Hủy trả lời"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
          <Textarea
            rows={isReply || replyingTo ? 3 : 4}
            placeholder={
              replyingTo ? `Viết câu trả lời cho @${replyingTo.authorName}...` : placeholder
            }
            {...register('content')}
            className="text-sm rounded-xl resize-y min-h-20 max-h-55 bg-background/90"
          />
          {errors.content && (
            <p className="text-xs text-rose-500 font-medium">{errors.content.message}</p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Anonymous Toggle (for students) */}
            {isStudent ? (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`anon-comment-${parentId || 'main'}`}
                  {...register('isAnonymous')}
                  className="size-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer"
                />
                <Label
                  htmlFor={`anon-comment-${parentId || 'main'}`}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <VenetianMask className="size-3.5 text-primary" />
                  <span>Bình luận ẩn danh</span>
                </Label>
              </div>
            ) : (
              <div />
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {isReply && onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="h-8.5 text-xs rounded-xl"
                >
                  Hủy
                </Button>
              )}

              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="h-8.5 text-xs font-semibold rounded-xl gap-1.5 shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-3.5" />
                    <span>{isReply ? 'Gửi phản hồi' : 'Gửi bình luận'}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
