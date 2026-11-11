'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface TeacherGradesPaginationProps {
  safePage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

// Pagination controls footer for the teacher grade matrix view
export function TeacherGradesPagination({
  safePage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: TeacherGradesPaginationProps) {
  if (totalPages <= 1) return null;

  const startIdx = (safePage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(safePage * itemsPerPage, totalItems);

  return (
    <div className="p-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
      <span>
        Hiển thị {startIdx} - {endIdx} trên tổng số {totalItems} sinh viên
      </span>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent className="gap-1">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (safePage > 1) onPageChange(safePage - 1);
              }}
              className={safePage <= 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={p === safePage}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (safePage < totalPages) onPageChange(safePage + 1);
              }}
              className={safePage >= totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
