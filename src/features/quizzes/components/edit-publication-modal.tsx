'use client';

import { useEffect, useState } from 'react';
import { Calendar, Eye, FolderKanban, Loader2, Save } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { quizPublicationsService } from '../services/quiz-publications.service';
import { formatDateTimeLocal } from '../utils/quiz.utils';
import { ReviewMode } from '@/types/enum';
import type { QuizClassItem } from '@/types/quiz';
import type { Topic } from '@/types/topic';

interface EditPublicationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  quizItem: QuizClassItem | null;
  topics?: Topic[];
  onSuccess?: () => void;
}

// Modal dialog allowing teachers to edit classroom quiz publication schedule and review mode
export function EditPublicationModal({
  isOpen,
  onOpenChange,
  quizItem,
  topics = [],
  onSuccess,
}: EditPublicationModalProps) {
  const [openAt, setOpenAt] = useState('');
  const [closeAt, setCloseAt] = useState('');
  const [topicId, setTopicId] = useState<string>('unselected');
  const [reviewMode, setReviewMode] = useState<ReviewMode>(ReviewMode.after_submission);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && quizItem) {
      setOpenAt(quizItem.openAt ? formatDateTimeLocal(new Date(quizItem.openAt)) : '');
      setCloseAt(quizItem.closeAt ? formatDateTimeLocal(new Date(quizItem.closeAt)) : '');
      setTopicId(quizItem.topicId || 'unselected');
      setReviewMode(quizItem.reviewMode || ReviewMode.after_submission);
    }
  }, [isOpen, quizItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizItem || isSubmitting) return;

    if (openAt && closeAt && new Date(openAt) >= new Date(closeAt)) {
      toast.error('Thời gian mở phải trước thời gian đóng bài thi');
      return;
    }

    try {
      setIsSubmitting(true);
      await quizPublicationsService.updatePublication(quizItem.publicationId, {
        openAt: openAt ? new Date(openAt).toISOString() : null,
        closeAt: closeAt ? new Date(closeAt).toISOString() : null,
        topicId: topicId !== 'unselected' ? topicId : null,
        reviewMode,
      });

      toast.success('Cập nhật đợt thi thành công!');
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể cập nhật đợt thi';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!quizItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            Chỉnh sửa đợt thi: {quizItem.title}
          </DialogTitle>
          <DialogDescription>
            Điều chỉnh lịch mở/đóng bài và chế độ xem đáp án cho học sinh trong lớp.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Topic Assignment */}
          {topics.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-xs font-medium flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-muted-foreground" />
                Chủ đề môn học
              </Label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="unselected">-- Không gắn chủ đề --</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Time Schedules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-openAt" className="text-xs font-medium">
                Thời gian mở đề
              </Label>
              <Input
                id="edit-openAt"
                type="datetime-local"
                value={openAt}
                onChange={(e) => setOpenAt(e.target.value)}
              />
              <span className="text-[11px] text-muted-foreground">Để trống = Mở ngay lập tức</span>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-closeAt" className="text-xs font-medium">
                Hạn chót nộp bài
              </Label>
              <Input
                id="edit-closeAt"
                type="datetime-local"
                value={closeAt}
                onChange={(e) => setCloseAt(e.target.value)}
              />
              <span className="text-[11px] text-muted-foreground">Để trống = Không giới hạn hạn</span>
            </div>
          </div>

          {/* Review Mode Option */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-reviewMode" className="text-xs font-medium flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-muted-foreground" />
              Chế độ xem đáp án của học sinh
            </Label>
            <select
              id="edit-reviewMode"
              value={reviewMode}
              onChange={(e) => setReviewMode(e.target.value as ReviewMode)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value={ReviewMode.after_submission}>
                Xem đáp án sau khi nộp bài (Phổ biến)
              </option>
              <option value={ReviewMode.immediate}>
                Xem đáp án tức thì sau mỗi câu (Luyện tập)
              </option>
              <option value={ReviewMode.after_closed}>
                Xem sau khi toàn lớp kết thúc (Thi chính thức)
              </option>
              <option value={ReviewMode.never}>
                Không cho xem đáp án
              </option>
            </select>
          </div>

          <DialogFooter className="pt-3 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
