'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, LucideIcon } from 'lucide-react';
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

export interface AdminFormComboboxOption {
  value: string;
  label: string;
  badge?: string;
  sublabel?: string;
}

interface AdminFormComboboxProps {
  options: AdminFormComboboxOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
}

export function AdminFormCombobox({
  options,
  value,
  onChange,
  placeholder = 'Chọn một mục...',
  searchPlaceholder = 'Tìm kiếm...',
  emptyText = 'Không tìm thấy kết quả phù hợp',
  icon: Icon,
  disabled = false,
  className,
}: AdminFormComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={cn('relative w-full min-w-0', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'w-full h-10 justify-between rounded-xl border-border/80 bg-background text-xs font-normal shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800/60 px-3 min-w-0 max-w-full overflow-hidden',
              !selectedOption && 'text-muted-foreground',
            )}
          >
            <div className="flex items-center gap-2 truncate min-w-0 flex-1 mr-1">
              {Icon && <Icon className="size-3.5 text-slate-400 shrink-0" />}
              {selectedOption?.badge && (
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] px-1.5 py-0 border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-300 shrink-0"
                >
                  {selectedOption.badge}
                </Badge>
              )}
              <span className="truncate text-left text-slate-800 dark:text-slate-200">
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </div>
            <ChevronsUpDown className="size-3.5 shrink-0 opacity-50 ml-1" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[calc(100vw-3rem)] sm:w-96 max-w-[90vw] p-0 rounded-2xl shadow-xl z-150 bg-popover"
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} className="text-xs h-10" />
            <CommandList className="max-h-60 p-1">
              <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                {emptyText}
              </CommandEmpty>
              <CommandGroup>
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
                      className="text-xs py-2 px-2.5 rounded-xl flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                        {opt.badge && (
                          <Badge
                            variant="outline"
                            className="font-mono text-[10px] px-1.5 py-0 shrink-0 border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-300"
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
    </div>
  );
}
