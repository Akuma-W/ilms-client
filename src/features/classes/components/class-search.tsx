'use client';

import { SearchBar } from "@/components/common/search-bar";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function ClassSearch() {
  const router = useRouter();
  const params = useSearchParams();

  const searchParam = params.get('search') || '';
  
  const [value, setValue] = useState(searchParam);

  useEffect(() => {
    const handleSearch = () => {
      const timeout = setTimeout(() => {
        const query = new URLSearchParams(params.toString());

        if (value) {
          query.set('search', value);
        } else {
          query.delete('search');
        }

        query.set('page', '1'); // reset page

        router.push(`?${query.toString()}`);
      }, 1000);

      return () => clearTimeout(timeout);
    }

    handleSearch();
  }, [value, params, router]);

  return (
    <SearchBar
      value={value}
      onChange={setValue}
      onDelete={() => setValue('')}
      placeholder="Tìm lớp học..."
    />
  );
}
