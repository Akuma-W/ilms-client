'use client';

import { useState } from 'react';
import { Globe, Loader2, Lock, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Class } from '@/types/class';

interface EditClassModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  classData: Class;
  onSuccess?: (updated: Class) => void;
}

/**
 * Modal dialog for teachers to update class details.
 */
export function EditClassModal({
  isOpen,
  onOpenChange,
  classData,
  onSuccess,
}: EditClassModalProps) {
  const [title, setTitle] = useState(classData.title);
  const [subject, setSubject] = useState(classData.subject);
  const [semester, setSemester] = useState(classData.semester || '');
  const [description, setDescription] = useState(classData.description || '');
  const [isPrivate, setIsPrivate] = useState<boolean>(classData.isPrivate ?? false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !semester.trim()) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const updated: Class = {
        ...classData,
        title: title.trim(),
        subject: subject.trim(),
        semester: semester.trim(),
        description: description.trim() || null,
        isPrivate,
      };
      toast.success('Cập nhật thông tin lớp học thành công!');
      onSuccess?.(updated);
      onOpenChange(false);
    } catch {
      toast.error('Cập nhật thất bại. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <Pencil className="size-5" />
              <DialogTitle className="text-lg font-bold text-foreground">
                Chỉnh sửa thông tin lớp học
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Thay đổi tiêu đề môn học, học kỳ hoặc mô tả giới thiệu lớp.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <div className="space-y-1.5">
              <Label htmlFor="edit-class-title" className="text-xs font-semibold text-foreground">
                Tên lớp học <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-class-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Nhập môn Lập trình IT001"
                className="h-10 text-sm rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-class-subject"
                  className="text-xs font-semibold text-foreground"
                >
                  Môn học <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-class-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="VD: Cấu trúc dữ liệu"
                  className="h-10 text-sm rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-class-semester"
                  className="text-xs font-semibold text-foreground"
                >
                  Học kỳ <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-class-semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="VD: HK2 (2025 - 2026)"
                  className="h-10 text-sm rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Chế độ hiển thị lớp học <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsPrivate(false)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                    !isPrivate
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold shadow-2xs'
                      : 'border-border bg-card/60 text-muted-foreground hover:bg-muted/40'
                  }`}
                >
                  <Globe className="size-4 shrink-0 text-emerald-500" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold">Công khai</p>
                    <p className="text-[11px] opacity-80 truncate">Mọi người đều tìm thấy</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPrivate(true)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                    isPrivate
                      ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold shadow-2xs'
                      : 'border-border bg-card/60 text-muted-foreground hover:bg-muted/40'
                  }`}
                >
                  <Lock className="size-4 shrink-0 text-amber-500" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold">Riêng tư</p>
                    <p className="text-[11px] opacity-80 truncate">Chỉ vào bằng mã mời</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="edit-class-description"
                className="text-xs font-semibold text-foreground"
              >
                Mô tả tổng quan môn học
              </Label>
              <textarea
                id="edit-class-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập giới thiệu tóm tắt mục tiêu môn học, đề cương..."
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring resize-y min-h-20 max-h-40"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/70">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
              className="rounded-xl h-10 text-sm"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-10 gap-2 shadow-xs"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Pencil className="size-4" />
              )}
              <span>Lưu thay đổi</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
