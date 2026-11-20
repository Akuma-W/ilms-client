'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Video, Calendar, Clock, ArrowRight, Plus, ListVideo, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { meetingsService } from '../services/meetings.service';
import { CreateMeetingModal } from './create-meeting-modal';
import { MeetingListDialog } from './meeting-list-dialog';
import { CloseMeetingModal } from './close-meeting-modal';
import type { MeetingSession } from '@/types/meeting';

interface OverviewMeetingBannerProps {
  classId: string;
  isTeacher: boolean;
  isArchived?: boolean;
}

export function OverviewMeetingBanner({
  classId,
  isTeacher,
  isArchived = false,
}: OverviewMeetingBannerProps) {
  const router = useRouter();
  const [listOpen, setListOpen] = useState(false);
  const [closeLiveMeeting, setCloseLiveMeeting] = useState<MeetingSession | null>(null);

  const { data: meetings = [], mutate } = useSWR<MeetingSession[]>(
    `classes/${classId}/meetings`,
    () => meetingsService.getClassMeetings(classId),
    {
      revalidateOnFocus: true,
      refreshInterval: 15000,
    },
  );

  const now = new Date();
  const liveMeeting = meetings.find((m) => m.isLive && !m.endTime);
  const upcomingMeeting = meetings
    .filter(
      (m) =>
        (!liveMeeting || m.id !== liveMeeting.id) &&
        !m.isLive &&
        !m.endTime &&
        new Date(m.startTime) > now,
    )
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];

  const handleJoin = (meetingId: string) => {
    router.push(`/meetings/${meetingId}`);
  };

  if (!liveMeeting && !upcomingMeeting) {
    if (!isTeacher && meetings.length === 0) return null;

    return (
      <>
        <div className="p-4 rounded-2xl border border-dashed border-border bg-card/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Video className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Phòng học trực tuyến</h4>
              <p className="text-xs text-muted-foreground">
                {isTeacher
                  ? 'Khởi tạo phòng học tương tác, tự động điểm danh và gửi thông báo lịch học đến sinh viên.'
                  : 'Hiện chưa có buổi họp trực tiếp. Bạn có thể xem lại lịch sử các buổi học trước.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {meetings.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setListOpen(true)}
                className="text-xs h-8 gap-1.5 border-border"
                title="Xem danh sách lịch sử buổi học"
              >
                <ListVideo className="size-3.5 text-muted-foreground" />
                <span>Lịch sử ({meetings.length})</span>
              </Button>
            )}

            {isTeacher && !isArchived && (
              <CreateMeetingModal
                classId={classId}
                onSuccess={() => mutate()}
                trigger={
                  <Button
                    size="sm"
                    className="text-xs h-8 gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-medium"
                  >
                    <Plus className="size-3.5" />
                    <span>Lên lịch họp mới</span>
                  </Button>
                }
              />
            )}
          </div>
        </div>

        <MeetingListDialog
          classId={classId}
          meetings={meetings}
          isTeacher={isTeacher}
          isOpen={listOpen}
          onOpenChange={setListOpen}
          onRefresh={() => mutate()}
        />
      </>
    );
  }

  const upcomingDiff = upcomingMeeting
    ? Math.round((new Date(upcomingMeeting.startTime).getTime() - now.getTime()) / (60 * 1000))
    : 999;
  const isImminent = upcomingDiff <= 15;

  return (
    <>
      <div className="w-full space-y-3">
        {/* 1. LIVE MEETING BANNER */}
        {liveMeeting && (
          <div className="relative overflow-hidden rounded-2xl border-2 border-red-500/40 bg-linear-to-r from-red-500/10 via-purple-500/10 to-indigo-500/10 p-5 shadow-xs backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2.5">
                  <Badge className="bg-red-600 text-white hover:bg-red-700 text-xs font-bold px-2.5 py-0.5 gap-1.5 animate-pulse shadow-xs">
                    <span className="size-2 rounded-full bg-white animate-ping" />
                    <span>ĐANG DIỄN RA</span>
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3 text-red-500" />
                    <span>
                      Bắt đầu lúc{' '}
                      {new Date(liveMeeting.startTime).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground truncate">
                  {liveMeeting.title}
                </h3>

                {liveMeeting.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1 max-w-2xl">
                    {liveMeeting.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <Button
                  size="sm"
                  onClick={() => handleJoin(liveMeeting.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs h-9 px-4 gap-2 shadow-sm"
                  title="Tham gia phòng học ngay"
                >
                  <Video className="size-4" />
                  <span>Tham gia phòng học ngay</span>
                  <ArrowRight className="size-3.5" />
                </Button>

                {isTeacher && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCloseLiveMeeting(liveMeeting)}
                    className="h-9 text-xs text-red-600 hover:bg-red-500/10 border-red-500/30 gap-1.5 px-3"
                    title="Kết thúc buổi học này"
                  >
                    <PhoneOff className="size-3.5" />
                    <span className="hidden sm:inline">Kết thúc</span>
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setListOpen(true)}
                  className="text-xs h-9 px-3 border-border/80 bg-background/80 gap-1.5"
                  title="Xem toàn bộ lịch họp"
                >
                  <ListVideo className="size-3.5" />
                  <span className="hidden sm:inline">Lịch ({meetings.length})</span>
                </Button>

                {isTeacher && !isArchived && (
                  <CreateMeetingModal
                    classId={classId}
                    onSuccess={() => mutate()}
                    trigger={
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-9 px-3 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 gap-1.5 font-medium"
                        title="Lên lịch buổi học trực tuyến mới"
                      >
                        <Plus className="size-3.5" />
                        <span className="hidden sm:inline">Lên lịch mới</span>
                      </Button>
                    }
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. UPCOMING MEETING BANNER */}
        {!liveMeeting && upcomingMeeting && (
          <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className="size-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <Calendar className="size-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-purple-500/10 text-purple-700 dark:text-purple-300 font-semibold px-2 py-0"
                  >
                    {isImminent ? `Sắp bắt đầu (trong ${upcomingDiff}p)` : 'Buổi học sắp tới'}
                  </Badge>
                  <span className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                    {new Date(upcomingMeeting.startTime).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    - {new Date(upcomingMeeting.startTime).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-foreground truncate">
                  {upcomingMeeting.title}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {isTeacher || isImminent ? (
                <Button
                  size="sm"
                  onClick={() => handleJoin(upcomingMeeting.id)}
                  className="text-xs h-8 bg-purple-600 hover:bg-purple-700 text-white font-medium gap-1.5"
                  title={isTeacher ? 'Mở phòng họp' : 'Vào phòng chờ'}
                >
                  <Video className="size-3.5" />
                  <span>{isTeacher ? 'Vào phòng sớm' : 'Vào phòng chờ'}</span>
                </Button>
              ) : (
                <Badge variant="outline" className="text-xs text-muted-foreground py-1 px-2.5">
                  Chưa mở phòng (
                  {upcomingDiff > 60
                    ? `sau ${Math.round(upcomingDiff / 60)} giờ`
                    : `sau ${upcomingDiff} phút`}
                  )
                </Badge>
              )}

              <Button
                size="sm"
                variant="outline"
                onClick={() => setListOpen(true)}
                className="text-xs h-8 border-border"
                title="Xem danh sách tất cả các buổi học"
              >
                Tất cả lịch ({meetings.length})
              </Button>

              {isTeacher && !isArchived && (
                <CreateMeetingModal
                  classId={classId}
                  onSuccess={() => mutate()}
                  trigger={
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-8 px-2"
                      title="Lên lịch buổi học mới"
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        )}
      </div>

      <MeetingListDialog
        classId={classId}
        meetings={meetings}
        isTeacher={isTeacher}
        isOpen={listOpen}
        onOpenChange={setListOpen}
        onRefresh={() => mutate()}
      />

      {closeLiveMeeting && (
        <CloseMeetingModal
          meetingId={closeLiveMeeting.id}
          meetingTitle={closeLiveMeeting.title}
          isOpen={Boolean(closeLiveMeeting)}
          onOpenChange={(open) => !open && setCloseLiveMeeting(null)}
          onSuccess={() => mutate()}
        />
      )}
    </>
  );
}
