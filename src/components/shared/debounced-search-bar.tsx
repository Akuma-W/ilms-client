'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

interface DebouncedSearchBarProps {
  value: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function DebouncedSearchBar({
  value,
  onSearch,
  placeholder = 'Tìm kiếm...',
  debounceMs = 400,
  className,
}: DebouncedSearchBarProps) {
  const [internalValue, setInternalValue] = useState(value);
  const debounced = useDebounce(internalValue, debounceMs);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    if (debounced !== value) {
      onSearch(debounced);
    }
  }, [debounced, onSearch, value]);

  const handleClear = () => {
    setInternalValue('');
    onSearch('');
  };

  return (
    <div className={cn('relative w-full', className)}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
      <Input
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10 h-11 rounded-2xl bg-background border-border/80 text-sm focus-visible:ring-primary/20 shadow-2xs"
      />
      {internalValue && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 size-7 rounded-lg text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
