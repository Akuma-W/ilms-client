'use client';

import { SWRConfig } from 'swr';

// Global SWR configuration provider with unified fetcher and cache policies
export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: async (url: string) => {
          const res = await fetch(url, { credentials: 'include' });

          if (res.status === 401) {
            throw new Error('Unauthorized');
          }

          if (!res.ok) {
            const error = new Error('API Error') as Error & { status: number };
            error.status = res.status;
            throw error;
          }

          return res.json();
        },
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 5000,
        keepPreviousData: true,
        errorRetryCount: 3,
      }}
    >
      {children}
    </SWRConfig>
  );
}
