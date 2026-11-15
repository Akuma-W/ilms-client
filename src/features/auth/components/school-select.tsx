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
    <div id="schoolId" className="relative w-full min-w-0">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start h-10 pl-9 pr-3 relative bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:text-slate-900 rounded-xl shadow-xs min-w-0 max-w-full overflow-hidden"
          >
            <SchoolIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 shrink-0" />
            <span className="pl-6 font-normal text-xs sm:text-sm truncate block w-full text-left min-w-0">
              {selectedSchool
                ? `(${selectedSchool.shortname}) ${selectedSchool.name}`
                : 'Chọn trường học'}
            </span>
          </Button>
        </PopoverTrigger>

        {/* Full width dropdown content on expansion to easily read long university names */}
        <PopoverContent
          align="start"
          className="w-[calc(100vw-2.5rem)] sm:w-115 md:w-125 max-w-[94vw] p-0 bg-white border-slate-200 text-slate-800 shadow-2xl rounded-2xl z-50"
        >
          <Command className="bg-white text-slate-800">
            <CommandInput
              placeholder="Tìm kiếm theo tên hoặc mã viết tắt của trường..."
              className="text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm h-11"
            />
            <CommandEmpty className="py-5 text-center text-xs text-slate-500">
              {isLoading ? 'Đang tải danh sách...' : 'Không tìm thấy trường phù hợp'}
            </CommandEmpty>
            <CommandGroup className="max-h-72 overflow-auto p-1.5">
              {schools.map((school) => (
                <CommandItem
                  key={school.id}
                  value={`${school.name} ${school.shortname}`}
                  className="cursor-pointer py-2.5 px-3 text-slate-700 hover:bg-indigo-50 focus:bg-indigo-50 aria-selected:bg-indigo-50/80 aria-selected:text-indigo-700 rounded-xl text-xs sm:text-sm transition-colors"
                  onSelect={() => {
                    onChange(school.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2.5 h-4 w-4 text-indigo-600 shrink-0',
                      value === school.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <div className="flex items-center gap-2.5 min-w-0 w-full">
                    <span className="font-mono text-indigo-600 font-bold shrink-0 bg-indigo-50/80 px-2 py-0.5 rounded-md border border-indigo-100 text-xs">
                      {school.shortname}
                    </span>
                    <span className="truncate text-slate-800 font-medium">{school.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {error && <p className="text-xs text-rose-500 font-medium mt-1">{error}</p>}
    </div>
  );
}
