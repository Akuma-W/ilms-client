'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

interface DataPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  limit?: number;
  itemLabel?: string;
  className?: string;
}

export function DataPagination({
  page,
  totalPages,
  onPageChange,
  totalItems,
  limit,
  itemLabel = 'kết quả',
  className,
}: DataPaginationProps) {
  const hasRangeInfo = totalItems !== undefined && limit !== undefined && totalItems > 0;
  const startItem = hasRangeInfo ? (page - 1) * limit + 1 : 0;
  const endItem = hasRangeInfo ? Math.min(page * limit, totalItems) : 0;

  const getPageNumbers = (current: number, total: number): (number | 'ellipsis')[] => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, 'ellipsis', total];
    }
    if (current >= total - 3) {
      return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
  };

  if (totalPages <= 1 && !hasRangeInfo) {
    return null;
  }

  const pages = getPageNumbers(page, totalPages);

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 w-full pt-4',
        className,
      )}
    >
      {hasRangeInfo ? (
        <p className="text-xs text-muted-foreground font-medium">
          Hiển thị <span className="text-foreground font-semibold">{startItem}</span> -{' '}
          <span className="text-foreground font-semibold">{endItem}</span> trên tổng số{' '}
          <span className="text-foreground font-semibold">{totalItems}</span> {itemLabel}
        </p>
      ) : (
        <div />
      )}

      {totalPages > 1 && (
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) onPageChange(page - 1);
                }}
                className={cn('text-xs h-9', page <= 1 && 'pointer-events-none opacity-50')}
              />
            </PaginationItem>

            {pages.map((p, idx) => {
              if (p === 'ellipsis') {
                return (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={(e) => {
                      e.preventDefault();
                      if (p !== page) onPageChange(p);
                    }}
                    className="text-xs size-9"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) onPageChange(page + 1);
                }}
                className={cn(
                  'text-xs h-9',
                  page >= totalPages && 'pointer-events-none opacity-50',
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
