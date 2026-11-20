'use client';

import { CheckCircle2, Clock, Edit3, PhoneOff, Trash2, Users, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { MeetingSession } from '@/types/meeting';

interface MeetingListItemProps {
  meeting: MeetingSession;
  isTeacher: boolean;
  now: Date;
  onJoin: (id: string) => void;
  onClose: (meeting: MeetingSession) => void;
  onViewAttendance: (meeting: MeetingSession) => void;
  onEdit: (meeting: MeetingSession) => void;
  onDelete: (meeting: MeetingSession) => void;
}

export function MeetingListItem({
  meeting,
  isTeacher,
  now,
  onJoin,
  onClose,
  onViewAttendance,
  onEdit,
  onDelete,
}: MeetingListItemProps) {
  const startTime = new Date(meeting.startTime);
  const isLive = meeting.isLive && !meeting.endTime;
  const isUpcoming = !isLive && startTime > now && !meeting.endTime;

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        isLive
          ? 'border-purple-500/40 bg-purple-500/5 shadow-xs'
          : 'border-border/80 bg-muted/20 hover:bg-muted/40'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground truncate">{meeting.title}</h4>
            {isLive ? (
              <Badge className="bg-red-500 text-white hover:bg-red-600 text-[10px] font-bold px-2 py-0.5 gap-1 animate-pulse">
                <span className="size-1.5 rounded-full bg-white" />
                <span>ĐANG DIỄN RA</span>
              </Badge>
            ) : isUpcoming ? (
              <Badge
                variant="secondary"
                className="text-[10px] text-blue-600 dark:text-blue-400 font-medium"
              >
                Sắp diễn ra
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                Đã kết thúc
              </Badge>
            )}

            {meeting.isGraded !== false ? (
              <Badge
                variant="secondary"
                className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-300 font-medium border-purple-500/20"
              >
                Tính chuyên cần
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                Không tính điểm
              </Badge>
            )}
          </div>

          {meeting.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{meeting.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3 text-purple-500" />
              <span>
                {startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })},{' '}
                {startTime.toLocaleDateString('vi-VN')}
              </span>
            </span>

            {meeting.attendanceCount !== undefined && meeting.attendanceCount > 0 && (
              <span className="flex items-center gap-1">
                <Users className="size-3 text-blue-500" />
                <span>{meeting.attendanceCount} người đã vào</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isLive && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={() => onJoin(meeting.id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium gap-1.5 h-8 text-xs shadow-xs"
                  >
                    <Video className="size-3.5" />
                    <span>Tham gia</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Tham gia phòng học ngay</TooltipContent>
              </Tooltip>

              {isTeacher && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onClose(meeting)}
                      className="h-8 text-xs text-red-600 hover:bg-red-500/10 border-red-500/30 px-2.5"
                    >
                      <PhoneOff className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Kết thúc buổi học trực tuyến</TooltipContent>
                </Tooltip>
              )}
            </>
          )}

          {/* Cho phép giáo viên bắt đầu bất kỳ buổi học nào chưa kết thúc */}
          {!isLive && !meeting.endTime && isTeacher && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  onClick={() => onJoin(meeting.id)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium gap-1.5 h-8 text-xs shadow-xs"
                >
                  <Video className="size-3.5" />
                  <span>Mở phòng họp</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Mở phòng và bắt đầu buổi học này sớm</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onViewAttendance(meeting)}
                className="h-8 text-xs px-2 text-muted-foreground hover:text-foreground"
              >
                <CheckCircle2 className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Xem danh sách điểm danh</TooltipContent>
          </Tooltip>

          {isTeacher && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(meeting)}
                    className="h-8 text-xs px-2 text-muted-foreground hover:text-foreground"
                  >
                    <Edit3 className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Chỉnh sửa thông tin buổi học</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(meeting)}
                    className="h-8 text-xs px-2 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Xóa buổi học trực tuyến</TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
