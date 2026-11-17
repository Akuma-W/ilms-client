'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, UserPlus, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useSchoolTeachers } from '../../hooks/use-school-teachers';
import type { SchoolTeacherItem } from '@/types/school';
import { cn } from '@/lib/utils';

interface AssistantTeacherSelectProps {
  value?: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}

/**
 * Searchable multi-select dropdown using Shadcn Combobox (Popover + Command)
 * to assign fellow school teachers as class assistants.
 */
export function AssistantTeacherSelect({
  value = [],
  onChange,
  disabled = false,
}: AssistantTeacherSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { teachers, isLoading } = useSchoolTeachers(search);

  const handleToggle = (teacherId: string) => {
    if (value.includes(teacherId)) {
      onChange(value.filter((id) => id !== teacherId));
    } else {
      onChange([...value, teacherId]);
    }
  };

  const handleRemove = (teacherId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((id) => id !== teacherId));
  };

  return (
    <div className="space-y-2">
      {/* Selected Assistant Chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-muted/40 border border-border/80 rounded-xl min-h-10 items-center">
          {value.map((id) => {
            const teacher = teachers.find((t: SchoolTeacherItem) => t.id === id);
            return (
              <Badge
                key={id}
                variant="secondary"
                className="gap-1.5 py-1 px-2.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20"
              >
                <UserPlus className="size-3 text-blue-600 dark:text-blue-400" />
                <span>{teacher?.fullName ?? 'Giảng viên trợ giảng'}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => handleRemove(id, e)}
                    className="hover:text-destructive rounded-full focus:outline-hidden ml-0.5 cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Shadcn Popover + Command Combobox */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between h-10 rounded-xl text-sm font-normal bg-background hover:bg-muted/40"
          >
            <span className="text-muted-foreground truncate">
              {value.length > 0
                ? `Đã chọn ${value.length} trợ giảng`
                : 'Tìm và chọn trợ giảng trong trường...'}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 opacity-50 ml-2" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="z-150 w-(--radix-popover-trigger-width) p-0 rounded-xl shadow-lg border border-border"
          align="start"
        >
          <Command shouldFilter={false} className="rounded-xl">
            <CommandInput
              placeholder="Tìm kiếm theo tên hoặc email giảng viên..."
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
              {!isLoading && teachers.length === 0 && (
                <CommandEmpty className="p-3 text-xs text-muted-foreground text-center">
                  Không tìm thấy giảng viên nào.
                </CommandEmpty>
              )}
              <CommandGroup>
                {teachers.map((teacher: SchoolTeacherItem) => {
                  const isSelected = value.includes(teacher.id);
                  return (
                    <CommandItem
                      key={teacher.id}
                      value={teacher.id}
                      onSelect={() => handleToggle(teacher.id)}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 text-xs rounded-lg cursor-pointer transition-colors',
                        isSelected &&
                          'bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold',
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar className="size-6 text-[10px]">
                          <AvatarImage src={teacher.avatarUrl ?? undefined} />
                          <AvatarFallback>
                            {teacher.fullName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="truncate">
                          <p className="font-semibold text-foreground truncate">
                            {teacher.fullName}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {teacher.email}
                          </p>
                        </div>
                      </div>
                      <Check
                        className={cn(
                          'size-4 text-blue-600 dark:text-blue-400 shrink-0 ml-2',
                          isSelected ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
