'use client';

import { DataPagination } from '@/components/shared/data-pagination';

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

  return (
    <div className="p-4 border-t border-border/50">
      <DataPagination
        page={safePage}
        totalPages={totalPages}
        totalItems={totalItems}
        limit={itemsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}
