'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface AdminComboboxOption {
  value: string;
  label: string;
  badge?: string;
  sublabel?: string;
}

interface AdminComboboxProps {
  options: AdminComboboxOption[];
  value?: string;
  onChange: (value?: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  allLabel?: string;
  className?: string;
  popoverWidth?: string;
  disabled?: boolean;
}

export function AdminCombobox({
  options,
  value,
  onChange,
  placeholder = 'Chọn một mục...',
  searchPlaceholder = 'Tìm kiếm...',
  emptyText = 'Không tìm thấy kết quả phù hợp',
  allLabel = 'Tất cả',
  className,
  popoverWidth = 'w-72',
  disabled = false,
}: AdminComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={cn('relative inline-flex items-center', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'h-9 justify-between rounded-xl border-border/80 bg-background text-xs font-normal shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800/60 min-w-44 max-w-64 px-3',
              !selectedOption && 'text-muted-foreground',
            )}
          >
            <div className="flex items-center gap-1.5 truncate">
              {selectedOption?.badge && (
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] px-1 py-0 border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-300 shrink-0"
                >
                  {selectedOption.badge}
                </Badge>
              )}
              <span className="truncate">
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </div>
            <ChevronsUpDown className="size-3.5 shrink-0 opacity-50 ml-1.5" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className={cn('p-0 rounded-xl shadow-lg z-[150]', popoverWidth)}
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} className="text-xs h-9" />
            <CommandList className="max-h-60 p-1">
              <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                {emptyText}
              </CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="__all__"
                  onSelect={() => {
                    onChange(undefined);
                    setOpen(false);
                  }}
                  className="text-xs py-2 px-2.5 rounded-lg flex items-center justify-between"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-300">{allLabel}</span>
                  {!value && <Check className="size-3.5 text-indigo-600" />}
                </CommandItem>

                {options.map((opt) => {
                  const isSelected = value === opt.value;
                  return (
                    <CommandItem
                      key={opt.value}
                      value={`${opt.badge || ''} ${opt.label} ${opt.sublabel || ''}`}
                      onSelect={() => {
                        onChange(opt.value);
                        setOpen(false);
                      }}
                      className="text-xs py-2 px-2.5 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                        {opt.badge && (
                          <Badge
                            variant="outline"
                            className="font-mono text-[10px] px-1 py-0 shrink-0 border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-300"
                          >
                            {opt.badge}
                          </Badge>
                        )}
                        <span className="truncate text-slate-800 dark:text-slate-200">
                          {opt.label}
                        </span>
                      </div>
                      {isSelected && <Check className="size-3.5 text-indigo-600 shrink-0" />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value && (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="absolute right-7 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          title="Xóa bộ lọc"
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  );
}
