'use client';

import { Users } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { MeetingAttendance } from '@/types/meeting';

interface MeetingAttendeesSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  attendances: MeetingAttendance[];
  currentUserId?: string;
  hostEmail?: string;
}

export function MeetingAttendeesSheet({
  isOpen,
  onOpenChange,
  attendances,
  currentUserId,
}: MeetingAttendeesSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="bg-zinc-900 border-zinc-800 text-white w-80 sm:w-96 p-0 flex flex-col"
      >
        <SheetHeader className="p-4 border-b border-zinc-800">
          <SheetTitle className="text-sm font-semibold text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="size-4 text-purple-400" />
              <span>Người tham gia ({attendances.length || 1})</span>
            </span>
            <Badge variant="outline" className="text-xs text-purple-400 border-purple-500/40">
              Đang hoạt động
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 divide-y divide-zinc-800/80">
          {attendances.map((att) => {
            const isMe =
              currentUserId && (att.studentId === currentUserId || att.id === currentUserId);

            return (
              <div key={att.id} className="py-2.5 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar className="size-8 shrink-0 border border-zinc-700">
                    <AvatarImage src={att.avatarUrl || undefined} />
                    <AvatarFallback className="text-xs bg-purple-600 text-white font-bold">
                      {att.studentName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-zinc-200 truncate">
                        {att.studentName}
                      </p>
                      {isMe && (
                        <Badge className="bg-zinc-700 text-zinc-200 text-[10px] px-1 py-0 h-3.5 font-normal">
                          Bạn
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 truncate">{att.studentEmail}</p>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className="text-[10px] text-emerald-400 border-emerald-500/30 flex items-center gap-1 shrink-0"
                >
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  <span>Đã vào</span>
                </Badge>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
