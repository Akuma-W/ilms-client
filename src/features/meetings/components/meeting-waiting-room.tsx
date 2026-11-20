'use client';

import { Clock, Loader2, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

interface MeetingWaitingRoomProps {
  isRetrying: boolean;
  onRetry: () => void;
  onBack: () => void;
}

export function MeetingWaitingRoom({ isRetrying, onRetry, onBack }: MeetingWaitingRoomProps) {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-950 text-white gap-4 p-4 text-center">
      <div className="size-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center animate-pulse">
        <Clock className="size-8" />
      </div>
      <div className="space-y-1.5 max-w-md">
        <h2 className="text-lg font-bold">Phòng học chưa mở</h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Giảng viên chưa bắt đầu phiên học này. Bạn đang ở phòng chờ, hệ thống sẽ tự động đưa bạn
          vào lớp ngay khi giảng viên mở phòng...
        </p>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Button
          size="sm"
          onClick={onRetry}
          disabled={isRetrying}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-9 px-4 rounded-xl gap-2 font-medium"
        >
          <Loader2 className={`size-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>Thử kết nối lại ngay</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onBack}
          className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs h-9 px-4 rounded-xl"
        >
          Quay lại
        </Button>
      </div>
    </div>
  );
}

interface MeetingClosedDialogProps {
  isOpen: boolean;
  onLeave: () => void;
}

export function MeetingClosedDialog({ isOpen, onLeave }: MeetingClosedDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md border-border bg-card text-center py-6">
        <div className="size-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-2">
          <PhoneOff className="size-6" />
        </div>
        <DialogTitle className="text-base font-bold text-foreground">
          Buổi học trực tuyến đã kết thúc
        </DialogTitle>
        <DialogDescription className="text-xs text-muted-foreground mt-1">
          Giảng viên đã kết thúc phiên học trực tuyến và hệ thống đã lưu dữ liệu điểm danh của bạn.
        </DialogDescription>
        <div className="pt-4 flex justify-center">
          <Button
            onClick={onLeave}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-9 px-5 rounded-xl font-medium"
          >
            Quay về lớp học
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
