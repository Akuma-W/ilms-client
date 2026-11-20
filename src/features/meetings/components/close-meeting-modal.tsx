'use client';

import { useState } from 'react';
import { PhoneOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { meetingsService } from '../services/meetings.service';

interface CloseMeetingModalProps {
  meetingId: string;
  meetingTitle: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CloseMeetingModal({
  meetingId,
  meetingTitle,
  isOpen,
  onOpenChange,
  onSuccess,
}: CloseMeetingModalProps) {
  const [forceCloseRoom, setForceCloseRoom] = useState<string>('true');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useSWRConfig();

  const handleConfirmClose = async () => {
    try {
      setIsSubmitting(true);
      const isForce = forceCloseRoom === 'true';

      await meetingsService.closeMeeting(meetingId, {
        forceCloseRoom: isForce,
      });

      // Automatically revalidate any active meeting data in SWR cache
      await mutate((key) => typeof key === 'string' && key.includes('meetings'), undefined, {
        revalidate: true,
      });

      toast.success(
        isForce
          ? 'Đã kết thúc và đóng phòng học cho tất cả thành viên!'
          : 'Đã đóng phiên học chính thức. Phòng vẫn mở để sinh viên thảo luận.',
      );

      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Không thể kết thúc buổi học');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-112.5 border-border bg-card">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <PhoneOff className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-foreground">
                Kết thúc Buổi học trực tuyến
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {meetingTitle}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-xs text-muted-foreground">
            Dữ liệu điểm danh của toàn bộ sinh viên đã tham gia sẽ được tự động lưu vết vào hệ
            thống. Vui lòng chọn cơ chế kết thúc phòng:
          </p>

          <RadioGroup
            value={forceCloseRoom}
            onValueChange={setForceCloseRoom}
            className="space-y-2.5"
            disabled={isSubmitting}
          >
            <div
              onClick={() => setForceCloseRoom('true')}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                forceCloseRoom === 'true'
                  ? 'border-red-500/50 bg-red-500/5'
                  : 'border-border/80 bg-muted/20 hover:bg-muted/40'
              }`}
            >
              <RadioGroupItem value="true" id="close-all" className="mt-0.5" />
              <div className="space-y-0.5 select-none">
                <Label
                  htmlFor="close-all"
                  className="text-xs font-semibold cursor-pointer text-foreground"
                >
                  Đóng phòng cho tất cả mọi người (Khuyên dùng)
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Phiên họp đã kết thúc hoàn toàn. Tất cả sinh viên sẽ tự động rời khỏi phòng.
                </p>
              </div>
            </div>

            <div
              onClick={() => setForceCloseRoom('false')}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                forceCloseRoom === 'false'
                  ? 'border-purple-500/50 bg-purple-500/5'
                  : 'border-border/80 bg-muted/20 hover:bg-muted/40'
              }`}
            >
              <RadioGroupItem value="false" id="leave-only" className="mt-0.5" />
              <div className="space-y-0.5 select-none">
                <Label
                  htmlFor="leave-only"
                  className="text-xs font-semibold cursor-pointer text-foreground"
                >
                  Chỉ kết thúc buổi giảng, để sinh viên ở lại thảo luận
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Ghi nhận kết thúc phiên giảng dạy nhưng không ngắt kết nối các sinh viên đang trao
                  đổi.
                </p>
              </div>
            </div>
          </RadioGroup>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmClose}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white font-medium gap-1.5"
            >
              {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
              <span>Xác nhận kết thúc</span>
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
