'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, Loader2, ShieldCheck, UserPlus, X } from 'lucide-react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSchoolTeachers } from '@/features/classes/hooks/use-school-teachers';
import { membersService } from '../services/members.service';
import type { SchoolTeacherItem } from '@/types/school';
import type { User } from '@/types/user';
import { Role, UserStatus } from '@/types/enum';
import { cn } from '@/lib/utils';

interface AddAssistantModalProps {
  classId: string;
  existingTeacherIds: string[];
  onAssistantAdded: (newMemberUser: User) => void;
}

export function AddAssistantModal({
  classId,
  existingTeacherIds,
  onAssistantAdded,
}: AddAssistantModalProps) {
  const [open, setOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<SchoolTeacherItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { teachers, isLoading } = useSchoolTeachers(search);

  // Filter out teachers already in the class
  const availableTeachers = teachers.filter((t) => !existingTeacherIds.includes(t.id));

  const handleConfirm = async () => {
    if (!selectedTeacher) {
      toast.error('Vui lòng chọn giảng viên để làm trợ giảng');
      return;
    }

    setIsSubmitting(true);
    try {
      const teacherUser: User = {
        id: selectedTeacher.id,
        fullName: selectedTeacher.fullName,
        email: selectedTeacher.email,
        role: Role.teacher,
        status: UserStatus.active,
        schoolId: '',
        avatar: selectedTeacher.avatarUrl || null,
        avatarUrl: selectedTeacher.avatarUrl || null,
        identityCode: null,
        createdAt: new Date(),
      };

      const res = await membersService.addAssistant(classId, teacherUser);
      if (res.success) {
        toast.success(res.message);
        onAssistantAdded(teacherUser);
        setSelectedTeacher(null);
        setOpen(false);
      }
    } catch {
      toast.error('Không thể thêm trợ giảng vào lớp. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 px-3 text-xs font-semibold gap-1.5 text-primary border-primary/30 hover:bg-primary/10 rounded-xl"
        >
          <UserPlus className="size-3.5" />
          <span>Thêm trợ giảng</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="z-100 sm:max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
            <ShieldCheck className="size-5 text-primary" />
            <span>Thêm trợ giảng vào lớp học</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Chọn giảng viên cùng trường để cấp quyền trợ giảng và cùng quản trị lớp học này.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <label className="text-xs font-bold text-foreground block">
            Tìm kiếm giảng viên trong trường
          </label>

          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={popoverOpen}
                className="w-full justify-between h-11 rounded-xl text-sm font-normal bg-background hover:bg-muted/40"
              >
                {selectedTeacher ? (
                  <div className="flex items-center gap-2 truncate">
                    <Avatar className="size-6 rounded-lg shrink-0">
                      <AvatarImage src={selectedTeacher.avatarUrl || undefined} />
                      <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                        {selectedTeacher.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-foreground truncate">
                      {selectedTeacher.fullName}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      ({selectedTeacher.email})
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">
                    Chọn giảng viên từ danh sách trường...
                  </span>
                )}
                <ChevronsUpDown className="size-4 opacity-50 shrink-0 ml-2" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="z-150 w-(--radix-popover-trigger-width) p-0 rounded-xl shadow-lg border border-border"
              align="start"
            >
              <Command shouldFilter={false} className="rounded-xl">
                <CommandInput
                  placeholder="Gõ tên giảng viên hoặc email để tìm..."
                  value={search}
                  onValueChange={setSearch}
                  className="h-9 text-xs"
                />
                <CommandList className="max-h-56">
                  {isLoading && (
                    <div className="p-3 text-xs text-muted-foreground text-center animate-pulse">
                      Đang tìm kiếm giảng viên...
                    </div>
                  )}
                  {!isLoading && availableTeachers.length === 0 && (
                    <CommandEmpty className="p-3 text-xs text-muted-foreground text-center">
                      Không tìm thấy giảng viên nào phù hợp.
                    </CommandEmpty>
                  )}
                  <CommandGroup>
                    {availableTeachers.map((t) => {
                      const isSelected = selectedTeacher?.id === t.id;
                      return (
                        <CommandItem
                          key={t.id}
                          value={t.id}
                          onSelect={() => {
                            setSelectedTeacher(t);
                            setPopoverOpen(false);
                          }}
                          className={cn(
                            'flex items-center justify-between px-3 py-2 text-xs rounded-lg cursor-pointer transition-colors',
                            isSelected && 'bg-primary/10 text-primary font-bold',
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Avatar className="size-7 rounded-lg shrink-0">
                              <AvatarImage src={t.avatarUrl || undefined} />
                              <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                                {t.fullName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="truncate">
                              <span className="font-semibold text-foreground block">
                                {t.fullName}
                              </span>
                              <span className="text-[11px] text-muted-foreground block truncate">
                                {t.email}
                              </span>
                            </div>
                          </div>
                          {isSelected && <Check className="size-4 text-primary ml-2 shrink-0" />}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {selectedTeacher && (
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="size-4 text-primary" />
                <span className="text-xs font-medium text-foreground">
                  Sẽ cấp quyền <strong>Trợ giảng</strong> cho tài khoản này.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTeacher(null)}
                className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                title="Bỏ chọn"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => setOpen(false)}
            className="rounded-xl text-xs h-9"
          >
            Hủy
          </Button>
          <Button
            type="button"
            disabled={!selectedTeacher || isSubmitting}
            onClick={handleConfirm}
            className="rounded-xl text-xs h-9 bg-primary text-primary-foreground font-semibold gap-1.5"
          >
            {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
            <span>Xác nhận thêm</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
