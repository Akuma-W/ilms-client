'use client';

import { useState } from 'react';
import { Video, Clock, Sparkles, Loader2, Repeat } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { meetingsService } from '../services/meetings.service';
import type { CreateMeetingInput } from '@/types/meeting';

interface CreateMeetingModalProps {
  classId: string;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function CreateMeetingModal({ classId, onSuccess, trigger }: CreateMeetingModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notifyStudents, setNotifyStudents] = useState(true);
  const [isGraded, setIsGraded] = useState(true);
  const [recurringWeeks, setRecurringWeeks] = useState('1');
  const [language] = useState<'vi' | 'en'>('vi');

  const [startTime, setStartTime] = useState(() => {
    const d = new Date(Date.now() + 15 * 60 * 1000);
    d.setMinutes(Math.ceil(d.getMinutes() / 5) * 5, 0, 0);
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề buổi họp');
      return;
    }

    try {
      setIsSubmitting(true);
      const weeksNum = parseInt(recurringWeeks, 10) || 1;
      const payload: CreateMeetingInput = {
        title: title.trim(),
        description: description.trim() || undefined,
        startTime: new Date(startTime).toISOString(),
        notifyStudents,
        isGraded,
        recurringWeeks: weeksNum,
        language,
      };

      await meetingsService.createMeeting(classId, payload);
      toast.success(
        weeksNum > 1
          ? `Đã tạo chuỗi ${weeksNum} buổi học trực tuyến định kỳ!`
          : 'Khởi tạo buổi học trực tuyến thành công!',
        {
          description: notifyStudents
            ? 'Hệ thống đã tự động gửi email thông báo kèm lịch hẹn đến sinh viên.'
            : undefined,
        },
      );

      setOpen(false);
      setTitle('');
      setDescription('');
      setIsGraded(true);
      setRecurringWeeks('1');
      onSuccess?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Không thể tạo buổi họp');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="gap-2 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xs font-medium"
          >
            <Video className="size-4" />
            <span>Tạo phòng học online</span>
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-125 border-border bg-card">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Sparkles className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-foreground">
                Lên lịch Buổi họp trực tuyến
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Khởi tạo phòng học và gửi lịch hẹn đến toàn bộ sinh viên.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="meeting-title" className="text-xs font-medium">
              Tiêu đề buổi họp <span className="text-red-500">*</span>
            </Label>
            <Input
              id="meeting-title"
              placeholder="VD: Buổi 3: Giải đáp thắc mắc Cấu trúc Cây nhị phân"
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
            <Label htmlFor="meeting-desc" className="text-xs font-medium">
              Nội dung chuẩn bị & Ghi chú (tùy chọn)
            </Label>
            <Textarea
              id="meeting-desc"
              placeholder="Các bạn đọc trước slide chương 3 và chuẩn bị sẵn laptop để thực hành code..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              rows={2}
              maxLength={1000}
              className="text-sm resize-none"
            />
          </div>

          {/* Start Time & Recurring Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="meeting-start-time"
                className="text-xs font-medium flex items-center gap-1.5"
              >
                <Clock className="size-3.5 text-muted-foreground" />
                <span>Thời gian bắt đầu</span>
              </Label>
              <Input
                id="meeting-start-time"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={isSubmitting}
                required
                className="text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium flex items-center gap-1.5">
                <Repeat className="size-3.5 text-muted-foreground" />
                <span>Lặp lại hàng tuần</span>
              </Label>
              <Select
                value={recurringWeeks}
                onValueChange={setRecurringWeeks}
                disabled={isSubmitting}
              >
                <SelectTrigger className="text-sm h-9">
                  <SelectValue placeholder="Số tuần lặp lại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Chỉ 1 buổi duy nhất</SelectItem>
                  <SelectItem value="2">2 tuần liên tiếp</SelectItem>
                  <SelectItem value="4">4 tuần (1 tháng)</SelectItem>
                  <SelectItem value="8">8 tuần (nửa kỳ)</SelectItem>
                  <SelectItem value="12">12 tuần (cả học kỳ)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Switch: Tính điểm chuyên cần */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium cursor-pointer">Tính điểm chuyên cần</Label>
              <p className="text-[11px] text-muted-foreground">
                Tự động tính vào tỷ lệ điểm danh chuyên cần của lớp khi sinh viên tham gia.
              </p>
            </div>
            <Switch checked={isGraded} onCheckedChange={setIsGraded} disabled={isSubmitting} />
          </div>

          {/* Switch: Gửi email */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium cursor-pointer">
                Gửi thông báo email cho sinh viên
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Đính kèm liên kết truy cập phòng họp trực tiếp qua email.
              </p>
            </div>
            <Switch
              checked={notifyStudents}
              onCheckedChange={setNotifyStudents}
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
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
              <span>Khởi tạo phòng học</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
