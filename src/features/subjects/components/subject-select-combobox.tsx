'use client';

import { useState } from 'react';
import { BookOpen, Check, ChevronsUpDown } from 'lucide-react';
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
import { useSubjects } from '../hooks/use-subjects';
import { cn } from '@/lib/utils';
import type { Subject } from '@/types/subject';

interface SubjectSelectComboboxProps {
  value?: string;
  onValueChange: (subjectId: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function SubjectSelectCombobox({
  value,
  onValueChange,
  disabled = false,
  placeholder = 'Chọn môn học trực thuộc...',
}: SubjectSelectComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { subjects, isLoading } = useSubjects({ search: search.trim() || undefined });

  const selectedSubject = subjects.find((s) => s.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || isLoading}
          className="w-full justify-between h-10 rounded-xl text-sm font-normal bg-background hover:bg-muted/40"
        >
          {selectedSubject ? (
            <span className="flex items-center gap-1.5 truncate">
              <span className="font-bold text-primary">[{selectedSubject.code}]</span>
              <span className="truncate">{selectedSubject.name}</span>
              <span className="text-xs text-muted-foreground">({selectedSubject.credits} TC)</span>
            </span>
          ) : (
            <span className="text-muted-foreground truncate">{placeholder}</span>
          )}
          <ChevronsUpDown className="size-4 shrink-0 opacity-50 ml-2" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="z-150 w-(--radix-popover-trigger-width) p-0 rounded-xl shadow-lg border border-border"
        align="start"
      >
        <Command shouldFilter={false} className="rounded-xl">
          <CommandInput
            placeholder="Tìm kiếm mã môn (IT001...) hoặc tên môn..."
            value={search}
            onValueChange={setSearch}
            className="h-9 text-xs"
          />
          <CommandList className="max-h-56">
            {isLoading && (
              <div className="p-3 text-xs text-muted-foreground text-center animate-pulse">
                Đang tải danh sách môn học...
              </div>
            )}
            {!isLoading && subjects.length === 0 && (
              <CommandEmpty className="p-3 text-xs text-muted-foreground text-center">
                Không tìm thấy môn học nào.
              </CommandEmpty>
            )}
            <CommandGroup>
              {subjects.map((subject: Subject) => {
                const isSelected = value === subject.id;
                return (
                  <CommandItem
                    key={subject.id}
                    value={subject.id}
                    onSelect={() => {
                      onValueChange(subject.id);
                      setOpen(false);
                    }}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 text-xs rounded-lg cursor-pointer transition-colors',
                      isSelected && 'bg-primary/10 text-primary font-semibold',
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <BookOpen className="size-3.5 text-primary shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-primary mr-1.5">[{subject.code}]</span>
                        <span className="text-foreground">{subject.name}</span>
                        <span className="text-[11px] text-muted-foreground ml-1.5">
                          ({subject.credits} tín chỉ)
                        </span>
                      </div>
                    </div>
                    <Check
                      className={cn(
                        'size-4 text-primary shrink-0 ml-2',
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
  );
}
