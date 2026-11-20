'use client';

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { GradeCategory } from '@/types/grade';
import type { GradeSortField, GradeSortOrder } from '../utils/grade-sort.utils';
import { TeacherGradesCategoryPopover } from './teacher-grades-category-popover';

interface TeacherGradesTableHeaderProps {
  categories: GradeCategory[];
  classId?: string;
  sortField: GradeSortField;
  sortOrder: GradeSortOrder;
  isArchived?: boolean;
  onSort: (field: GradeSortField) => void;
  onConfigureColumn?: (category: GradeCategory) => void;
  onColumnSync?: (categoryId: string) => void;
  onColumnAttendance?: (categoryId: string) => void;
}

export function TeacherGradesTableHeader({
  categories,
  classId,
  sortField,
  sortOrder,
  isArchived = false,
  onSort,
  onConfigureColumn,
  onColumnSync,
  onColumnAttendance,
}: TeacherGradesTableHeaderProps) {
  return (
    <TableHeader className="bg-muted/30">
      <TableRow className="border-b border-border/60">
        <TableHead
          className="w-12 text-center text-xs font-semibold cursor-pointer select-none"
          onClick={() => onSort('index')}
        >
          <div className="flex items-center justify-center gap-1">
            <span>#</span>
            {sortField === 'index' &&
              (sortOrder === 'asc' ? (
                <ArrowUp className="size-3" />
              ) : (
                <ArrowDown className="size-3" />
              ))}
          </div>
        </TableHead>

        <TableHead
          className="w-28 text-xs font-semibold cursor-pointer select-none"
          onClick={() => onSort('studentCode')}
        >
          <div className="flex items-center gap-1">
            <span>MSSV</span>
            {sortField === 'studentCode' &&
              (sortOrder === 'asc' ? (
                <ArrowUp className="size-3" />
              ) : (
                <ArrowDown className="size-3" />
              ))}
          </div>
        </TableHead>

        <TableHead
          className="min-w-48 text-xs font-semibold cursor-pointer select-none"
          onClick={() => onSort('studentName')}
        >
          <div className="flex items-center gap-1">
            <span>Họ và tên</span>
            {sortField === 'studentName' &&
              (sortOrder === 'asc' ? (
                <ArrowUp className="size-3" />
              ) : (
                <ArrowDown className="size-3" />
              ))}
          </div>
        </TableHead>

        {categories.map((cat) => (
          <TableHead key={cat.id} className="text-center text-xs font-semibold w-36 p-1.5">
            <div className="flex items-center justify-center gap-1">
              <div className="flex-1 min-w-0">
                <TeacherGradesCategoryPopover
                  cat={cat}
                  classId={classId}
                  isArchived={isArchived}
                  onConfigureColumn={onConfigureColumn}
                  onColumnSync={onColumnSync}
                  onColumnAttendance={onColumnAttendance}
                  onSort={onSort}
                />
              </div>
              <button
                type="button"
                onClick={() => onSort(cat.id)}
                className={cn(
                  'shrink-0 p-1 rounded-md hover:bg-muted/80 transition-colors cursor-pointer',
                  sortField === cat.id
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground/60 hover:text-foreground',
                )}
                title={`Sắp xếp theo cột ${cat.name}`}
              >
                {sortField === cat.id ? (
                  sortOrder === 'asc' ? (
                    <ArrowUp className="size-3" />
                  ) : (
                    <ArrowDown className="size-3" />
                  )
                ) : (
                  <ArrowUpDown className="size-3" />
                )}
              </button>
            </div>
          </TableHead>
        ))}

        <TableHead
          className="w-28 text-center text-xs font-semibold cursor-pointer select-none"
          onClick={() => onSort('finalScore')}
        >
          <div className="flex items-center justify-center gap-1">
            <span>Tổng kết</span>
            {sortField === 'finalScore' ? (
              sortOrder === 'asc' ? (
                <ArrowUp className="size-3" />
              ) : (
                <ArrowDown className="size-3" />
              )
            ) : (
              <ArrowUpDown className="size-3 text-muted-foreground/60" />
            )}
          </div>
        </TableHead>

        <TableHead className="w-36 text-center text-xs font-semibold">Xếp loại</TableHead>
      </TableRow>
    </TableHeader>
  );
}
