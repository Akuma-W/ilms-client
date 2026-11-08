'use client';

import { useState } from 'react';
import { Loader2, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { enrollmentService } from '@/features/classes/services/enrollment.service';
import { EnrollmentStatus } from '@/types/enum';
import type { Class } from '@/types/class';

interface JoinClassModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  classData: Class;
  onSuccess?: (status?: EnrollmentStatus) => void;
}

/**
 * Confirmation dialog for requesting enrollment into a class.
 */
export function JoinClassModal({
  isOpen,
  onOpenChange,
  classData,
  onSuccess,
}: JoinClassModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmJoin = async () => {
    setIsSubmitting(true);
    try {
      const enrollment = await enrollmentService.joinClass({
        classId: classData.id,
      });

      if (!enrollment) {
        toast.error('Gửi yêu cầu tham gia thất bại. Vui lòng thử lại sau.');
        return;
      }

      if (enrollment.status === EnrollmentStatus.approved) {
        toast.success('Tham gia lớp học thành công!');
      } else {
        toast.success(
          'Đã gửi yêu cầu tham gia lớp học thành công!\nVui lòng chờ giảng viên phê duyệt.',
        );
      }

      onSuccess?.(enrollment.status);
      onOpenChange(false);
    } catch {
      toast.error('Gửi yêu cầu thất bại. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center justify-center size-12 rounded-2xl bg-primary/10 text-primary mx-auto mb-1">
            <LogIn className="size-6" />
          </div>
          <DialogTitle className="text-center text-lg font-bold text-foreground">
            Yêu cầu tham gia lớp học
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Bạn đang gửi yêu cầu tham gia lớp học{' '}
            <strong className="text-foreground font-semibold">{classData.title}</strong> do giảng
            viên{' '}
            <strong className="text-foreground font-semibold">{classData.teacher?.fullName}</strong>{' '}
            phụ trách.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 pt-3">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
            className="rounded-xl h-10 text-sm"
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirmJoin}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-10 gap-2 shadow-xs"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LogIn className="size-4" />
            )}
            <span>Xác nhận gửi</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
