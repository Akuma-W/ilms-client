'use client';

import { SearchBar } from '@/components/shared/search-bar';
import { useDebounce } from '@/hooks/use-debounce';
import { useEffect, useState } from 'react';

interface ClassSearchProps {
  value: string;
  onSearch: (value: string) => void;
}

export function ClassSearch({ value, onSearch }: ClassSearchProps) {
  const [searchValue, setSearchValue] = useState(value);
  const debouncedValue = useDebounce(searchValue, 500);

  // Sync when tab changes
  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  // Just call onSearch when debounced value changes
  useEffect(() => {
    if (debouncedValue !== value) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch, value]);

  return (
    <SearchBar
      value={searchValue}
      onChange={setSearchValue}
      onDelete={() => setSearchValue('')}
      placeholder="Tìm lớp học bằng tên lớp, tên giảng viên, môn học ..."
      className="md:min-w-100 min-w-50"
    />
  );
}
