'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MessageSquarePlus, Sparkles, VenetianMask } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createForumSchema, type CreateForumFormData } from '../schemas/forum.schema';
import { Role } from '@/types/enum';
import type { Forum } from '@/types/forum';
import type { User } from '@/types/user';

interface CreateForumModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateForumFormData) => Promise<void>;
  currentUser?: User | null;
  initialPrefix?: string;
  forumToEdit?: Forum | null;
}

const PREFIX_SUGGESTIONS = ['[Hỏi bài]', '[Thảo luận]', '[Thông báo]'];

/**
 * Large Facebook / Threads style post composer dialog.
 * Features prefix chips, wide textarea, anonymous toggle for students, and full validation.
 */
export function CreateForumModal({
  isOpen,
  onOpenChange,
  onSubmit,
  currentUser,
  initialPrefix = '',
  forumToEdit = null,
}: CreateForumModalProps) {
  const isStudent = currentUser?.role !== Role.teacher;
  const isEditing = Boolean(forumToEdit);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateForumFormData>({
    resolver: zodResolver(createForumSchema),
    defaultValues: {
      title: forumToEdit?.title || initialPrefix,
      content: forumToEdit?.content || '',
      isAnonymous: forumToEdit?.isAnonymous || false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (forumToEdit) {
        reset({
          title: forumToEdit.title,
          content: forumToEdit.content,
          isAnonymous: forumToEdit.isAnonymous,
        });
      } else {
        reset({
          title: initialPrefix,
          content: '',
          isAnonymous: false,
        });
      }
    }
  }, [isOpen, initialPrefix, forumToEdit, reset]);

  const handleSelectPrefix = (prefix: string) => {
    const currentTitle = getValues('title') || '';
    const stripped = currentTitle.replace(/^\[.*?\]\s*/, '');
    setValue('title', `${prefix} ${stripped}`.trimStart(), { shouldValidate: true });
  };

  const handleFormSubmit = async (values: CreateForumFormData) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-5 sm:p-6">
        <DialogHeader className="space-y-1 text-left pb-2 border-b border-border/60">
          <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <MessageSquarePlus className="size-5 text-primary" />
            <span>{isEditing ? 'Chỉnh sửa chủ đề thảo luận' : 'Tạo chủ đề thảo luận mới'}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? 'Cập nhật tiêu đề và nội dung bài thảo luận của bạn.'
              : 'Đặt câu hỏi hoặc chia sẻ thông tin học tập tới toàn thể thành viên trong lớp.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
          {/* Prefix Suggestions */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" />
              <span>Gợi ý loại chủ đề:</span>
            </Label>
            <div className="flex flex-wrap items-center gap-1.5">
              {PREFIX_SUGGESTIONS.map((pfx) => (
                <Button
                  key={pfx}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectPrefix(pfx)}
                  className="h-7 px-2.5 text-xs rounded-lg font-medium border-border/70 hover:border-primary/50 hover:text-primary"
                >
                  {pfx}
                </Button>
              ))}
            </div>
          </div>

          {/* Title Field */}
          <div className="space-y-1.5">
            <Label htmlFor="forum-title" className="text-xs font-bold text-foreground">
              Tiêu đề thảo luận <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="forum-title"
              placeholder="Ví dụ: [Hỏi bài] Khi nào cây AVL cần xoay kép?..."
              {...register('title')}
              className="h-10 text-sm font-medium rounded-xl"
            />
            {errors.title && (
              <p className="text-xs text-rose-500 font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* Content Field */}
          <div className="space-y-1.5">
            <Label htmlFor="forum-content" className="text-xs font-bold text-foreground">
              Nội dung chi tiết <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="forum-content"
              rows={6}
              placeholder="Mô tả cụ thể vấn đề bạn gặp phải, thuật toán, đoạn code hoặc thắc mắc cần giải đáp..."
              {...register('content')}
              className="text-sm rounded-xl resize-y min-h-35 max-h-70 leading-relaxed"
            />
            {errors.content && (
              <p className="text-xs text-rose-500 font-medium">{errors.content.message}</p>
            )}
          </div>

          {/* Anonymous Toggle (Only for Students) */}
          {isStudent && (
            <div className="p-3.5 rounded-xl border border-border/80 bg-muted/30 flex items-start gap-3">
              <input
                type="checkbox"
                id="is-anonymous-checkbox"
                {...register('isAnonymous')}
                className="mt-0.5 size-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer"
              />
              <div className="space-y-0.5">
                <Label
                  htmlFor="is-anonymous-checkbox"
                  className="text-xs font-bold text-foreground flex items-center gap-1.5 cursor-pointer"
                >
                  <VenetianMask className="size-3.5 text-primary" />
                  <span>Đăng bài ẩn danh</span>
                </Label>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Danh tính của bạn sẽ hiển thị là &ldquo;Học viên ẩn danh&rdquo; với các bạn cùng
                  lớp. Giảng viên vẫn có quyền kiểm duyệt an toàn học đường.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <DialogFooter className="pt-3 border-t border-border/50 flex flex-col sm:flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto text-xs rounded-xl"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto text-xs font-semibold rounded-xl gap-1.5 shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{isEditing ? 'Đang lưu...' : 'Đang đăng bài...'}</span>
                </>
              ) : (
                <span>{isEditing ? 'Lưu thay đổi' : 'Đăng thảo luận'}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
