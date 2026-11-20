'use client';

import { useState, useEffect } from 'react';
import { Clock, Loader2, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
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
import { Switch } from '@/components/ui/switch';
import { meetingsService } from '../services/meetings.service';
import type { MeetingSession, UpdateMeetingInput } from '@/types/meeting';

interface EditMeetingModalProps {
  meeting: MeetingSession | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditMeetingModal({
  meeting,
  isOpen,
  onOpenChange,
  onSuccess,
}: EditMeetingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [isGraded, setIsGraded] = useState(true);

  useEffect(() => {
    if (meeting) {
      setTitle(meeting.title || '');
      setDescription(meeting.description || '');
      setIsGraded(meeting.isGraded ?? true);
      if (meeting.startTime) {
        const d = new Date(meeting.startTime);
        const tzOffset = d.getTimezoneOffset() * 60000;
        setStartTime(new Date(d.getTime() - tzOffset).toISOString().slice(0, 16));
      }
    }
  }, [meeting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meeting) return;
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề buổi họp');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: UpdateMeetingInput = {
        title: title.trim(),
        description: description.trim() || undefined,
        startTime: startTime ? new Date(startTime).toISOString() : undefined,
        isGraded,
      };

      await meetingsService.updateMeeting(meeting.id, payload);
      toast.success('Cập nhật thông tin buổi họp thành công!');
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Không thể cập nhật buổi họp');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 border-border bg-card">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Edit3 className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-foreground">
                Chỉnh sửa Buổi học trực tuyến
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Cập nhật thông tin, thời gian bắt đầu và thiết lập tính điểm chuyên cần.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-meeting-title" className="text-xs font-medium">
              Tiêu đề buổi họp <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-meeting-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              maxLength={200}
              required
              className="text-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-meeting-desc" className="text-xs font-medium">
              Ghi chú & Nội dung chuẩn bị
            </Label>
            <Textarea
              id="edit-meeting-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              rows={3}
              maxLength={1000}
              className="text-sm resize-none"
            />
          </div>

          {/* Start Time */}
          <div className="space-y-1.5">
            <Label
              htmlFor="edit-meeting-start-time"
              className="text-xs font-medium flex items-center gap-1.5"
            >
              <Clock className="size-3.5 text-muted-foreground" />
              <span>Thời gian bắt đầu</span>
            </Label>
            <Input
              id="edit-meeting-start-time"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              disabled={isSubmitting}
              className="text-sm"
            />
          </div>

          {/* isGraded Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium cursor-pointer">Tính điểm chuyên cần</Label>
              <p className="text-[11px] text-muted-foreground">
                Bật để buổi học được tính vào tỷ lệ chuyên cần tự động của lớp.
              </p>
            </div>
            <Switch checked={isGraded} onCheckedChange={setIsGraded} disabled={isSubmitting} />
          </div>

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
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium gap-1.5"
            >
              {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
              <span>Lưu thay đổi</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
