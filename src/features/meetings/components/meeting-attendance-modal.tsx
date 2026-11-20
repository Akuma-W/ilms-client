'use client';

import useSWR from 'swr';
import { Users, Clock, Loader2, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { meetingsService } from '../services/meetings.service';
import type { MeetingAttendance } from '@/types/meeting';

interface MeetingAttendanceModalProps {
  meetingId: string;
  meetingTitle: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MeetingAttendanceModal({
  meetingId,
  meetingTitle,
  isOpen,
  onOpenChange,
}: MeetingAttendanceModalProps) {
  const { data: attendances = [], isLoading } = useSWR<MeetingAttendance[]>(
    isOpen && meetingId ? `meetings/${meetingId}/attendances` : null,
    () => meetingsService.getAttendances(meetingId),
    { revalidateOnFocus: false },
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 border-border bg-card max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-5 pb-3 border-b border-border/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Users className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-foreground">
                  Danh sách Điểm danh Buổi học
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {meetingTitle}
                </DialogDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-semibold px-2.5 py-1">
              {attendances.length} sinh viên đã vào phòng
            </Badge>
          </div>
        </DialogHeader>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-border/60">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-blue-500" />
              <p className="text-xs">Đang tải danh sách điểm danh...</p>
            </div>
          ) : attendances.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Users className="size-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">Chưa có sinh viên nào tham gia</p>
              <p className="text-xs mt-1">
                Dữ liệu sẽ được tự động ghi nhận khi sinh viên bấm vào phòng học.
              </p>
            </div>
          ) : (
            attendances.map((att) => (
              <div
                key={att.id}
                className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="size-8 shrink-0 border border-border">
                    <AvatarImage src={att.avatarUrl || undefined} alt={att.studentName} />
                    <AvatarFallback className="text-xs font-bold bg-muted text-muted-foreground">
                      {att.studentName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {att.studentName}
                      </p>
                      {att.identityCode && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 h-4 font-mono"
                        >
                          {att.identityCode}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{att.studentEmail}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 space-y-0.5">
                  <div className="flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
                    <Calendar className="size-3" />
                    <span>
                      {new Date(att.joinedAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {att.durationMinutes !== null && att.durationMinutes !== undefined && (
                    <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <Clock className="size-2.5" />
                      <span>{att.durationMinutes} phút</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
