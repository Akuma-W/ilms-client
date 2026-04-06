'use client';

import { SWRConfig } from 'swr';

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url, { credentials: 'include' }).then((res) => {
            if (res.status === 401) return null;
            if (!res.ok) throw new Error('Error');
            return res.json();
          }),
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        refreshInterval: 10000, // 10 seconds
        dedupingInterval: 10000, // 10 seconds
        keepPreviousData: true,
      }}
    >
      {children}
    </SWRConfig>
  );
}
