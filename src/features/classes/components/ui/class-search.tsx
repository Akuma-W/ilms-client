'use client';

import { SearchBar } from '@/components/shared/search-bar';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function ClassSearch() {
  const router = useRouter();
  const params = useSearchParams();

  const search = params.get('search') || '';
  const paramsString = params.toString();

  const [value, setValue] = useState(search);

  useEffect(() => {
    const handleSearch = () => {
      const timeout = setTimeout(() => {
        const query = new URLSearchParams(paramsString);

        if (value) {
          query.set('search', value);
        } else {
          query.delete('search');
        }

        query.set('page', '1'); // reset page
        const newUrl = `?${query.toString()}`;
        const currentUrl = `?${paramsString}`;

        // ✅ tránh push loop
        if (newUrl !== currentUrl) {
          router.push(newUrl);
        }
      }, 500); // 500ms debounce

      return () => clearTimeout(timeout);
    };

    handleSearch();
  }, [value, paramsString, router]);

  return (
    <SearchBar
      value={value}
      onChange={setValue}
      onDelete={() => setValue('')}
      placeholder="Tìm lớp học..."
    />
  );
}
