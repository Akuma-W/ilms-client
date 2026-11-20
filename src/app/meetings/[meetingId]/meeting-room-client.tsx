'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';
import { PhoneOff, Users, Loader2, Clock, ShieldCheck, AlertCircle, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CloseMeetingModal } from '@/features/meetings/components/close-meeting-modal';
import { MeetingAttendeesSheet } from '@/features/meetings/components/meeting-attendees-sheet';
import { MeetingPrejoin } from '@/features/meetings/components/meeting-prejoin';
import {
  MeetingWaitingRoom,
  MeetingClosedDialog,
} from '@/features/meetings/components/meeting-waiting-room';
import { meetingsService } from '@/features/meetings/services/meetings.service';
import type { MeetingAttendance, MeetingTokenResponse } from '@/types/meeting';
import { useCurrentUser } from '@/features/user/hooks/use-current-user';

interface MeetingRoomClientProps {
  meetingId: string;
}

export function MeetingRoomClient({ meetingId }: MeetingRoomClientProps) {
  const router = useRouter();
  const { user: currentUser } = useCurrentUser();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinData, setJoinData] = useState<MeetingTokenResponse | null>(null);
  const [attendances, setAttendances] = useState<MeetingAttendance[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Pre-join state
  const [isPrejoinDone, setIsPrejoinDone] = useState(false);
  const [mediaSettings, setMediaSettings] = useState({ videoEnabled: true, audioEnabled: true });

  // UI drawers & modals
  const [showAttendees, setShowAttendees] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [isRoomClosedByHost, setIsRoomClosedByHost] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const isRoomNotStarted = Boolean(
    error &&
    (error.toLowerCase().includes('not started') ||
      error.toLowerCase().includes('chưa bắt đầu') ||
      error.toLowerCase().includes('chưa mở phòng')),
  );

  // 1. Fetch meeting token and attendee roster
  useEffect(() => {
    let mounted = true;

    meetingsService
      .joinMeeting(meetingId)
      .then((res) => {
        if (!mounted) return;
        setJoinData(res);

        meetingsService
          .getAttendances(meetingId)
          .then((atts) => {
            if (mounted) setAttendances(atts);
          })
          .catch(() => {});
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Không thể kết nối phòng học';
        setError(msg);
        if (
          !msg.toLowerCase().includes('not started') &&
          !msg.toLowerCase().includes('chưa bắt đầu')
        ) {
          toast.error(msg);
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [meetingId]);

  // Polling when student is in waiting room
  useEffect(() => {
    if (!isRoomNotStarted) return;
    const interval = setInterval(() => {
      meetingsService
        .joinMeeting(meetingId)
        .then((res) => {
          setJoinData(res);
          setError(null);
        })
        .catch(() => {});
    }, 4000);
    return () => clearInterval(interval);
  }, [isRoomNotStarted, meetingId]);

  // 2. Timer tick for meeting duration
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleLeave = () => {
    setIsLeaving(true);
    if (joinData?.session.classId) {
      router.push(`/classes/${joinData.session.classId}/overview`);
    } else {
      router.push('/classes');
    }
  };

  const handleDisconnected = () => {
    const isTeacherRole = currentUser?.role === 'teacher' || currentUser?.role === 'admin';
    if (isTeacherRole) {
      handleLeave();
    } else {
      setIsRoomClosedByHost(true);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-950 text-white gap-3">
        <Loader2 className="size-8 animate-spin text-purple-500" />
        <p className="text-sm text-zinc-400">Đang khởi tạo kết nối phòng học trực tuyến...</p>
      </div>
    );
  }

  if (isRoomNotStarted) {
    return (
      <MeetingWaitingRoom
        isRetrying={isRetrying}
        onRetry={() => {
          setIsRetrying(true);
          meetingsService
            .joinMeeting(meetingId)
            .then((res) => {
              setJoinData(res);
              setError(null);
            })
            .catch((err: unknown) => {
              const msg = err instanceof Error ? err.message : 'Phòng học chưa mở';
              setError(msg);
            })
            .finally(() => setIsRetrying(false));
        }}
        onBack={() => router.back()}
      />
    );
  }

  if (error || !joinData) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-950 text-white gap-4 p-4 text-center">
        <div className="size-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="size-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold">Không thể tham gia buổi học</h2>
          <p className="text-xs text-zinc-400 max-w-md">
            {error || 'Buổi họp không tồn tại hoặc đã kết thúc.'}
          </p>
        </div>
        <Button
          onClick={() => router.back()}
          className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs h-9 px-4 rounded-xl gap-1.5"
        >
          Quay lại
        </Button>
      </div>
    );
  }

  const session = joinData.session;
  const isTeacher = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  // 3. Pre-join screen check
  if (!isPrejoinDone) {
    return (
      <MeetingPrejoin
        meetingTitle={session.title || 'Phòng học trực tuyến'}
        isTeacher={isTeacher}
        onJoin={(settings) => {
          setMediaSettings(settings);
          setIsPrejoinDone(true);
        }}
        onBack={handleLeave}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-950 text-white overflow-hidden">
      {/* TOP HEADER BAR */}
      <header className="h-14 border-b border-zinc-800/80 bg-zinc-900/90 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20 backdrop-blur-md">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xs sm:text-sm font-semibold truncate max-w-50 sm:max-w-md">
              {session.title || 'Phòng học trực tuyến'}
            </h2>
            <Badge className="bg-red-600 text-white text-[10px] px-1.5 py-0 h-4 font-bold flex items-center gap-1 shrink-0">
              <span className="size-1.5 rounded-full bg-white animate-ping" />
              <span>LIVE</span>
            </Badge>
          </div>

          <p className="text-[11px] text-zinc-400 flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Clock className="size-3 text-zinc-500" />
              <span>{formatTime(elapsedSeconds)}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="size-3" />
              <span>
                {session.isGraded !== false ? 'Điểm danh tự động' : 'Phụ đạo / Thảo luận'}
              </span>
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowAttendees(true)}
            className="text-zinc-300 hover:text-white hover:bg-zinc-800 h-8 gap-1.5 text-xs px-2.5"
            title="Xem danh sách người tham gia"
          >
            <Users className="size-4 text-purple-400" />
            <span>{attendances.length || 1} người</span>
          </Button>

          {isTeacher ? (
            <Button
              size="sm"
              onClick={() => setCloseModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-medium text-xs h-8 px-3 gap-1.5"
              title="Kết thúc buổi học này"
            >
              <PhoneOff className="size-3.5" />
              <span className="hidden sm:inline">Kết thúc buổi học</span>
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={handleLeave}
              className="border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-white h-8 px-3 gap-1.5 text-xs font-medium"
              title="Rời khỏi phòng học"
            >
              <LogOut className="size-3.5" />
              <span>Rời phòng</span>
            </Button>
          )}
        </div>
      </header>

      {/* VIDEO ARENA */}
      <main className="flex-1 w-full h-[calc(100vh-3.5rem)] overflow-hidden relative">
        <LiveKitRoom
          video={mediaSettings.videoEnabled}
          audio={mediaSettings.audioEnabled}
          token={joinData.token}
          serverUrl={joinData.serverUrl}
          data-lk-theme="default"
          onDisconnected={handleDisconnected}
          onError={(err) => {
            const msg = (err.message || '').toLowerCase();
            if (
              isLeaving ||
              closeModalOpen ||
              isRoomClosedByHost ||
              msg.includes('unpublish') ||
              msg.includes('cancelled publication') ||
              msg.includes('user initiated disconnect') ||
              msg.includes('user-initiated abort') ||
              msg.includes('abort connection') ||
              msg.includes('websocket is closed') ||
              msg.includes('closed before the connection') ||
              msg.includes('datachannel') ||
              msg.includes('lossy') ||
              msg.includes('reliable') ||
              msg.includes('unexpectedly') ||
              msg.includes('closed') ||
              msg.includes('room deleted') ||
              msg.includes('could not establish pc connection')
            ) {
              return;
            }
            toast.error(err.message || 'Lỗi kết nối phòng học trực tuyến');
          }}
          className="h-full w-full"
        >
          <VideoConference />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </main>

      <MeetingAttendeesSheet
        isOpen={showAttendees}
        onOpenChange={setShowAttendees}
        attendances={attendances}
        currentUserId={currentUser?.id}
      />

      {session && (
        <CloseMeetingModal
          meetingId={session.id}
          meetingTitle={session.title}
          isOpen={closeModalOpen}
          onOpenChange={setCloseModalOpen}
          onSuccess={handleLeave}
        />
      )}

      {/* Thông báo kết thúc phòng học trang trọng cho sinh viên */}
      <MeetingClosedDialog isOpen={isRoomClosedByHost} onLeave={handleLeave} />
    </div>
  );
}
