'use client';

import { useState } from 'react';
import { BookOpen, Check, ChevronsUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useSubjects } from '../hooks/use-subjects';
import { cn } from '@/lib/utils';
import type { Subject } from '@/types/subject';

interface SubjectFilterComboboxProps {
  selectedSubjectId?: string;
  onSelectSubject: (subjectId: string | null) => void;
  className?: string;
}

export function SubjectFilterCombobox({
  selectedSubjectId,
  onSelectSubject,
  className,
}: SubjectFilterComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { subjects, isLoading } = useSubjects({ search: search.trim() || undefined });

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full md:w-80 h-11 justify-between rounded-xl text-sm font-medium bg-card hover:bg-muted/50 border-border/80 shadow-2xs transition-colors',
            selectedSubject && 'border-primary/40 bg-primary/5 text-primary',
            className,
          )}
        >
          <div className="flex items-center gap-2 truncate min-w-0">
            <BookOpen
              className={cn(
                'size-4 shrink-0',
                selectedSubject ? 'text-primary' : 'text-muted-foreground',
              )}
            />
            {selectedSubject ? (
              <span className="truncate">
                <strong className="font-bold mr-1">[{selectedSubject.code}]</strong>
                <span>{selectedSubject.name}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">Tất cả môn học</span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            {selectedSubject && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSubject(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    onSelectSubject(null);
                  }
                }}
                className="p-1 rounded-md hover:bg-primary/20 text-primary transition-colors cursor-pointer"
                title="Xóa bộ lọc môn"
              >
                <X className="size-3.5" />
              </span>
            )}
            <ChevronsUpDown className="size-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="z-150 w-(--radix-popover-trigger-width) min-w-70 p-0 rounded-xl shadow-lg border border-border"
        align="start"
      >
        <Command shouldFilter={false} className="rounded-xl">
          <CommandInput
            placeholder="Tìm theo mã môn (IT001...) hoặc tên môn..."
            value={search}
            onValueChange={setSearch}
            className="h-10 text-xs"
          />
          <CommandList className="max-h-64">
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

            {/* Reset / All Subjects Option */}
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => {
                  onSelectSubject(null);
                  setOpen(false);
                }}
                className={cn(
                  'flex items-center justify-between px-3 py-2 text-xs rounded-lg cursor-pointer transition-colors',
                  !selectedSubjectId && 'bg-primary/10 text-primary font-bold',
                )}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="size-3.5 text-muted-foreground" />
                  <span>Tất cả môn học (Xem toàn bộ)</span>
                </div>
                {!selectedSubjectId && <Check className="size-4 text-primary ml-2 shrink-0" />}
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            {/* Individual Subjects List */}
            <CommandGroup heading="Danh mục môn học">
              {subjects.map((sub: Subject) => {
                const isSelected = selectedSubjectId === sub.id;
                return (
                  <CommandItem
                    key={sub.id}
                    value={sub.id}
                    onSelect={() => {
                      onSelectSubject(sub.id);
                      setOpen(false);
                    }}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 text-xs rounded-lg cursor-pointer transition-colors',
                      isSelected && 'bg-primary/10 text-primary font-bold',
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono font-bold text-primary shrink-0">
                        [{sub.code}]
                      </span>
                      <span className="truncate text-foreground">{sub.name}</span>
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        ({sub.credits} TC)
                      </span>
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
  );
}
