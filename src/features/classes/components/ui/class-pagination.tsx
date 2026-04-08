'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from '@/components/ui/pagination';
import { useSearchParams } from 'next/navigation';

interface Props {
  total: number;
  page: number;
  limit: number;
}

export function ClassPagination({ total, page, limit }: Props) {
  const params = useSearchParams();

  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  const createPageLink = (p: number) => {
    const query = new URLSearchParams(params.toString());
    query.set('page', String(p));
    return `?${query.toString()}`;
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            href={createPageLink(page - 1)}
            aria-disabled={page <= 1}
            className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {/* Pages */}
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;

          return (
            <PaginationItem key={p}>
              <PaginationLink href={createPageLink(p)} isActive={p === page}>
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href={createPageLink(page + 1)}
            aria-disabled={page >= totalPages}
            className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
