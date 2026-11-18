'use client';

import Link from 'next/link';
import {
  MoreVertical,
  Plus,
  ExternalLink,
  Edit2,
  Archive,
  ArchiveRestore,
  Trash2,
  Users,
  Lock,
  Globe,
} from 'lucide-react';
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
import { AdminClass, AdminSchool } from '@/types/admin';
import { getClassArchiveBadgeConfig } from '@/features/admin/utils/admin-formatters';

interface AdminClassesTableProps {
  classes: AdminClass[];
  schools: AdminSchool[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  search: string;
  selectedSchoolId?: string;
  isArchivedFilter?: boolean;
  actionLoadingId: string | null;
  onSearchChange: (search: string) => void;
  onSchoolChange: (schoolId?: string) => void;
  onArchiveFilterChange: (isArchived?: boolean) => void;
  onPageChange: (page: number) => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (cls: AdminClass) => void;
  onToggleArchive: (cls: AdminClass) => void;
  onDeleteClass: (cls: AdminClass) => void;
}

export function AdminClassesTable({
  classes,
  schools,
  total,
  page,
  limit,
  totalPages,
  search,
  selectedSchoolId,
  isArchivedFilter,
  actionLoadingId,
  onSearchChange,
  onSchoolChange,
  onArchiveFilterChange,
  onPageChange,
  onOpenCreateModal,
  onOpenEditModal,
  onToggleArchive,
  onDeleteClass,
}: AdminClassesTableProps) {
  return (
    <div className="space-y-4">
      {/* Search and Composite Filter Strip with Auto-expanding Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3 min-w-0">
          <DebouncedSearchBar
            value={search}
            onSearch={onSearchChange}
            placeholder="Tìm theo tên hoặc mã lớp..."
            className="flex-1 min-w-50"
          />

          <Select
            value={selectedSchoolId || 'all'}
            onValueChange={(val) => onSchoolChange(val === 'all' ? undefined : val)}
          >
            <SelectTrigger className="w-48 shrink-0 rounded-2xl h-11 border-border/80 text-xs">
              <SelectValue placeholder="Lọc theo trường" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Tất cả trường học</SelectItem>
              {schools.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.shortname} - {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={
              isArchivedFilter === undefined ? 'all' : isArchivedFilter ? 'archived' : 'active'
            }
            onValueChange={(val) =>
              onArchiveFilterChange(val === 'all' ? undefined : val === 'archived')
            }
          >
            <SelectTrigger className="w-40 shrink-0 rounded-2xl h-11 border-border/80 text-xs">
              <SelectValue placeholder="Trạng thái mở" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Đang mở</SelectItem>
              <SelectItem value="archived">Đã lưu trữ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={onOpenCreateModal}
          className="shrink-0 rounded-2xl h-11 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm self-start sm:self-auto"
        >
          <Plus className="size-4 mr-1.5" />
          Tạo lớp học
        </Button>
      </div>

      {/* Classes Data Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-2xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/70 dark:bg-slate-800/50">
            <TableRow>
              <TableHead className="w-24 font-bold text-xs">Mã lớp</TableHead>
              <TableHead className="font-bold text-xs">Tên lớp & Cơ sở</TableHead>
              <TableHead className="font-bold text-xs">Môn học</TableHead>
              <TableHead className="font-bold text-xs">Giảng viên phụ trách</TableHead>
              <TableHead className="font-bold text-xs text-center">Sĩ số</TableHead>
              <TableHead className="font-bold text-xs">Chế độ</TableHead>
              <TableHead className="font-bold text-xs">Trạng thái</TableHead>
              <TableHead className="w-24 text-right font-bold text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-xs text-slate-500">
                  Không tìm thấy lớp học nào phù hợp với bộ lọc
                </TableCell>
              </TableRow>
            ) : (
              classes.map((cls) => (
                <TableRow key={cls.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs font-bold px-2 py-0.5">
                      {cls.courseCode || (cls as unknown as { code?: string }).code}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs md:text-sm">
                        {cls.title || (cls as unknown as { name?: string }).name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {cls.school?.name} {cls.school?.shortname && `(${cls.school.shortname})`}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {cls.subjectRef?.name ||
                          (cls as unknown as { subject?: { name?: string } }).subject?.name ||
                          'Chưa phân môn'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {cls.subjectRef?.code ||
                          (cls as unknown as { subject?: { code?: string } }).subject?.code ||
                          ''}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {cls.teacher?.fullName}
                      </span>
                      <span className="text-[10px] text-slate-400">{cls.teacher?.email}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-medium">
                      <Users className="size-3.5 text-blue-500" />
                      {cls.totalStudents ??
                        (cls as unknown as { currentStudents?: number }).currentStudents ??
                        0}{' '}
                      / {cls.maxStudents}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-[10px] py-0 px-1.5 flex items-center gap-1 w-fit border-slate-300 dark:border-slate-700"
                    >
                      {cls.isPrivate ? (
                        <>
                          <Lock className="size-3 text-amber-500" />
                          <span>Riêng tư</span>
                        </>
                      ) : (
                        <>
                          <Globe className="size-3 text-emerald-500" />
                          <span>Công khai</span>
                        </>
                      )}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {(() => {
                      const { label, className } = getClassArchiveBadgeConfig(cls.isArchived);
                      return (
                        <Badge variant="outline" className={className}>
                          {label}
                        </Badge>
                      );
                    })()}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/classes/${cls.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:text-blue-400 transition-colors"
                        title="Vào hỗ trợ lớp học này"
                      >
                        <ExternalLink className="size-4" />
                      </Link>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8 rounded-lg">
                            <MoreVertical className="size-4 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl w-44">
                          <DropdownMenuItem
                            onClick={() => onOpenEditModal(cls)}
                            className="text-xs"
                          >
                            <Edit2 className="size-3.5 mr-2 text-amber-500" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onToggleArchive(cls)}
                            disabled={actionLoadingId === cls.id}
                            className="text-xs"
                          >
                            {cls.isArchived ? (
                              <>
                                <ArchiveRestore className="size-3.5 mr-2 text-emerald-500" />
                                Mở lại lớp
                              </>
                            ) : (
                              <>
                                <Archive className="size-3.5 mr-2 text-slate-500" />
                                Lưu trữ lớp
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteClass(cls)}
                            disabled={
                              actionLoadingId === cls.id ||
                              (cls.totalStudents ??
                                (cls as unknown as { currentStudents?: number }).currentStudents ??
                                0) > 0
                            }
                            className="text-xs text-rose-600 dark:text-rose-400"
                          >
                            <Trash2 className="size-3.5 mr-2" />
                            Xóa lớp
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
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
        itemLabel="lớp học"
      />
    </div>
  );
}
