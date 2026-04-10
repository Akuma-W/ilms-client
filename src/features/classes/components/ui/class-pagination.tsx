'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';

interface Props {
  totalPages: number;
  page: number;
  onPageChange: (page: number) => void;
}

export function ClassPagination({ totalPages, page, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(page - 1)}
            aria-disabled={page <= 1}
            className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {/* Pages */}
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;

          return (
            <PaginationItem
              key={p}
              onClick={() => {
                if (p === page) onPageChange(p);
              }}
            >
              {p}
            </PaginationItem>
          );
        })}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(page + 1)}
            aria-disabled={page >= totalPages}
            className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
