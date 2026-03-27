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
      }}
    >
      {children}
    </SWRConfig>
  );
}
