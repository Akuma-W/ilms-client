'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { MoreVertical, Plus, BookOpen, Edit2, Power, Building2, Users, Layers } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DebouncedSearchBar } from '@/components/shared/debounced-search-bar';
import { DataPagination } from '@/components/shared/data-pagination';
import { adminSchoolService } from '@/features/admin/services/admin-schools.service';
import { AdminSchool } from '@/types/admin';
import { getSchoolStatusBadgeConfig } from '@/features/admin/utils/admin-formatters';

interface AdminSchoolsTableProps {
  schools: AdminSchool[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  search: string;
  status?: 'active' | 'inactive';
  onSearchChange: (search: string) => void;
  onStatusChange: (status?: 'active' | 'inactive') => void;
  onPageChange: (page: number) => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (school: AdminSchool) => void;
  onOpenSubjectsSheet: (school: AdminSchool) => void;
  onRefresh: () => void;
}

export function AdminSchoolsTable({
  schools,
  total,
  page,
  limit,
  totalPages,
  search,
  status,
  onSearchChange,
  onStatusChange,
  onPageChange,
  onOpenCreateModal,
  onOpenEditModal,
  onOpenSubjectsSheet,
  onRefresh,
}: AdminSchoolsTableProps) {
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const handleToggleStatus = async (school: AdminSchool) => {
    const nextStatus = school.status === 'active' ? 'inactive' : 'active';
    setActionLoadingId(school.id);
    try {
      await adminSchoolService.updateSchool(school.id, { status: nextStatus });
      toast.success(
        nextStatus === 'active'
          ? 'Đã kích hoạt lại trường học thành công'
          : 'Đã chuyển trường học sang trạng thái ngừng hoạt động',
      );
      onRefresh();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Thao tác thất bại';
      toast.error(errorMsg);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Action Toolbar: Full-width responsive flex container */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3 min-w-0">
          <DebouncedSearchBar
            value={search}
            onSearch={onSearchChange}
            placeholder="Tìm theo tên hoặc mã trường..."
            className="flex-1 min-w-50"
          />

          <Select
            value={status || 'all'}
            onValueChange={(val) =>
              onStatusChange(val === 'all' ? undefined : (val as 'active' | 'inactive'))
            }
          >
            <SelectTrigger className="w-40 shrink-0 rounded-2xl h-11 border-border/80 text-xs">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={onOpenCreateModal}
          className="shrink-0 rounded-2xl h-11 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm"
        >
          <Plus className="size-4 mr-1.5" />
          Thêm trường học
        </Button>
      </div>

      {/* Schools Data Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-2xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/70 dark:bg-slate-800/50">
            <TableRow>
              <TableHead className="w-24 font-bold text-xs">Mã trường</TableHead>
              <TableHead className="font-bold text-xs">Tên trường & Trụ sở</TableHead>
              <TableHead className="font-bold text-xs text-center">Sinh viên</TableHead>
              <TableHead className="font-bold text-xs text-center">Giảng viên</TableHead>
              <TableHead className="font-bold text-xs text-center">Lớp học</TableHead>
              <TableHead className="font-bold text-xs">Trạng thái</TableHead>
              <TableHead className="w-16 text-right font-bold text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-xs text-slate-500">
                  Không tìm thấy trường học nào phù hợp với bộ lọc
                </TableCell>
              </TableRow>
            ) : (
              schools.map((school) => {
                const isActive = school.status === 'active';

                return (
                  <TableRow
                    key={school.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                  >
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs font-bold px-2 py-0.5">
                        {school.shortname}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs md:text-sm">
                          {school.name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {school.address
                            ? `${school.address}, ${school.city || ''}`
                            : school.city || 'Chưa cập nhật địa chỉ'}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                        <Users className="size-3.5 text-blue-500" />
                        {school.totalStudents}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                        <Building2 className="size-3.5 text-indigo-500" />
                        {school.totalTeachers}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                        <Layers className="size-3.5 text-emerald-500" />
                        {school.totalClasses}
                      </span>
                    </TableCell>

                    <TableCell>
                      {(() => {
                        const { label, className } = getSchoolStatusBadgeConfig(isActive);
                        return (
                          <Badge variant="outline" className={className}>
                            {label}
                          </Badge>
                        );
                      })()}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8 rounded-lg">
                            <MoreVertical className="size-4 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl w-44">
                          <DropdownMenuItem
                            onClick={() => onOpenSubjectsSheet(school)}
                            className="text-xs"
                          >
                            <BookOpen className="size-3.5 mr-2 text-blue-500" />
                            Xem môn học
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onOpenEditModal(school)}
                            className="text-xs"
                          >
                            <Edit2 className="size-3.5 mr-2 text-amber-500" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(school)}
                            disabled={actionLoadingId === school.id}
                            className="text-xs text-rose-600 dark:text-rose-400"
                          >
                            <Power className="size-3.5 mr-2" />
                            {isActive ? 'Ngừng hoạt động' : 'Kích hoạt lại'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <DataPagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={total}
        limit={limit}
        itemLabel="trường học"
      />
    </div>
  );
}
