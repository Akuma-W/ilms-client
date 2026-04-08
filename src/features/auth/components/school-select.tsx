'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { School } from '@/types/school';
import { Check, SchoolIcon } from 'lucide-react';
import { useState } from 'react';

interface SchoolSelectProps {
  schools?: School[];
  isLoading: boolean;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

export function SchoolSelect({
  schools = [],
  isLoading,
  value,
  onChange,
  error,
}: SchoolSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedSchool = schools?.find((s) => s.id === value);

  return (
    <div id="schoolId" className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="cursor-pointer w-full justify-between h-11 pl-10 relative"
          >
            <SchoolIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <span className="pl-8 font-normal truncate">
              {selectedSchool
                ? `(${selectedSchool.shortname}) ${selectedSchool.name}`
                : 'Chọn trường học'}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Tìm trường ..." />
            <CommandEmpty>{isLoading ? 'Đang tải' : 'Không tìm thấy trường'}</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {schools.map((school) => (
                <CommandItem
                  key={school.id}
                  value={`${school.name} ${school.shortname}`}
                  className="cursor-pointer"
                  onSelect={() => {
                    onChange(school.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === school.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <div className="grid grid-cols-[80px_1fr] gap-2 w-full">
                    <span className="font-mono">{school.shortname}</span>
                    <span>{school.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
}
