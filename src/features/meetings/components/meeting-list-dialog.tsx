'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Video, Calendar, Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreateMeetingModal } from './create-meeting-modal';
import { MeetingAttendanceModal } from './meeting-attendance-modal';
import { CloseMeetingModal } from './close-meeting-modal';
import { EditMeetingModal } from './edit-meeting-modal';
import { MeetingListItem } from './meeting-list-item';
import { ConfirmDeleteModal } from '@/components/common/confirm-delete-modal';
import { meetingsService } from '../services/meetings.service';
import type { MeetingSession } from '@/types/meeting';

interface MeetingListDialogProps {
  classId?: string;
  meetings: MeetingSession[];
  isTeacher: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh?: () => void;
}

export function MeetingListDialog({
  classId,
  meetings,
  isTeacher,
  isOpen,
  onOpenChange,
  onRefresh,
}: MeetingListDialogProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming' | 'past'>('all');
  const [attendanceModal, setAttendanceModal] = useState<{
    isOpen: boolean;
    meetingId: string;
    meetingTitle: string;
  }>({ isOpen: false, meetingId: '', meetingTitle: '' });
  const [closeModal, setCloseModal] = useState<{
    isOpen: boolean;
    meetingId: string;
    meetingTitle: string;
  }>({ isOpen: false, meetingId: '', meetingTitle: '' });
  const [editMeeting, setEditMeeting] = useState<MeetingSession | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string;
    title: string;
    isDeleting: boolean;
  }>({ isOpen: false, id: '', title: '', isDeleting: false });

  const now = new Date();
  const resolvedClassId = classId || meetings[0]?.classId;

  const isLiveMeeting = (m: MeetingSession) => Boolean(m.isLive && !m.endTime);

  const filteredMeetings = meetings.filter((m) => {
    if (filter === 'live') return isLiveMeeting(m);
    if (filter === 'upcoming')
      return !isLiveMeeting(m) && new Date(m.startTime) > now && !m.endTime;
    if (filter === 'past') return m.endTime !== null || (!m.isLive && new Date(m.startTime) <= now);
    return true;
  });

  const handleJoin = (meetingId: string) => {
    onOpenChange(false);
    router.push(`/meetings/${meetingId}`);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
      await meetingsService.deleteMeeting(deleteModal.id);
      toast.success('Đã xóa buổi học trực tuyến và dọn dẹp lịch sử điểm danh!');
      setDeleteModal({ isOpen: false, id: '', title: '', isDeleting: false });
      onRefresh?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Không thể xóa buổi học');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-162.5 border-border bg-card max-h-[85vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-8 pt-5 pb-3 border-b border-border/80">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Video className="size-5" />
                </div>
                <div>
                  <DialogTitle className="text-base font-semibold text-foreground">
                    Lịch họp trực tuyến Lớp học
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    Danh sách các buổi học trực tuyến và lịch sử điểm danh.
                  </DialogDescription>
                </div>
              </div>

              {isTeacher && resolvedClassId && (
                <CreateMeetingModal
                  classId={resolvedClassId}
                  onSuccess={() => onRefresh?.()}
                  trigger={
                    <Button
                      size="sm"
                      className="text-xs h-8 gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-medium shrink-0"
                      title="Lên lịch buổi học mới"
                    >
                      <Plus className="size-3.5" />
                      <span>Lên lịch mới</span>
                    </Button>
                  }
                />
              )}
            </div>

            <div className="flex items-center gap-1.5 pt-3">
              <Button
                size="xs"
                variant={filter === 'all' ? 'secondary' : 'ghost'}
                onClick={() => setFilter('all')}
                className="text-xs h-7 px-2.5"
              >
                Tất cả ({meetings.length})
              </Button>
              <Button
                size="xs"
                variant={filter === 'live' ? 'secondary' : 'ghost'}
                onClick={() => setFilter('live')}
                className="text-xs h-7 px-2.5 text-purple-600 dark:text-purple-400"
              >
                Đang Live ({meetings.filter(isLiveMeeting).length})
              </Button>
              <Button
                size="xs"
                variant={filter === 'upcoming' ? 'secondary' : 'ghost'}
                onClick={() => setFilter('upcoming')}
                className="text-xs h-7 px-2.5"
              >
                Sắp tới (
                {
                  meetings.filter(
                    (m) => !isLiveMeeting(m) && new Date(m.startTime) > now && !m.endTime,
                  ).length
                }
                )
              </Button>
              <Button
                size="xs"
                variant={filter === 'past' ? 'secondary' : 'ghost'}
                onClick={() => setFilter('past')}
                className="text-xs h-7 px-2.5"
              >
                Đã kết thúc
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {filteredMeetings.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Calendar className="size-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">Không tìm thấy buổi họp nào</p>
                <p className="text-xs mt-1">Các buổi họp sẽ hiển thị tại đây khi được lên lịch.</p>
              </div>
            ) : (
              filteredMeetings.map((meeting) => (
                <MeetingListItem
                  key={meeting.id}
                  meeting={meeting}
                  isTeacher={isTeacher}
                  now={now}
                  onJoin={handleJoin}
                  onClose={(m) =>
                    setCloseModal({
                      isOpen: true,
                      meetingId: m.id,
                      meetingTitle: m.title,
                    })
                  }
                  onViewAttendance={(m) =>
                    setAttendanceModal({
                      isOpen: true,
                      meetingId: m.id,
                      meetingTitle: m.title,
                    })
                  }
                  onEdit={(m) => setEditMeeting(m)}
                  onDelete={(m) =>
                    setDeleteModal({
                      isOpen: true,
                      id: m.id,
                      title: m.title,
                      isDeleting: false,
                    })
                  }
                />
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <MeetingAttendanceModal
        meetingId={attendanceModal.meetingId}
        meetingTitle={attendanceModal.meetingTitle}
        isOpen={attendanceModal.isOpen}
        onOpenChange={(open) => setAttendanceModal((prev) => ({ ...prev, isOpen: open }))}
      />

      <CloseMeetingModal
        meetingId={closeModal.meetingId}
        meetingTitle={closeModal.meetingTitle}
        isOpen={closeModal.isOpen}
        onOpenChange={(open) => setCloseModal((prev) => ({ ...prev, isOpen: open }))}
        onSuccess={onRefresh}
      />

      <EditMeetingModal
        meeting={editMeeting}
        isOpen={Boolean(editMeeting)}
        onOpenChange={(open) => !open && setEditMeeting(null)}
        onSuccess={onRefresh}
      />

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, isOpen: open }))}
        title="Xác nhận xóa buổi học trực tuyến"
        description={`Bạn có chắc chắn muốn xóa "${deleteModal.title}"? Dữ liệu lịch sử và điểm danh của buổi họp này sẽ bị dọn dẹp hoàn toàn.`}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteModal.isDeleting}
      />
    </>
  );
}
