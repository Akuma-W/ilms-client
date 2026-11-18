'use client';

import {
  MoreVertical,
  Plus,
  Edit2,
  Lock,
  Unlock,
  KeyRound,
  UserX,
  ShieldAlert,
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DebouncedSearchBar } from '@/components/shared/debounced-search-bar';
import { DataPagination } from '@/components/shared/data-pagination';
import { AdminSchool, AdminUser } from '@/types/admin';
import {
  getRoleBadgeConfig,
  getUserStatusBadgeConfig,
} from '@/features/admin/utils/admin-formatters';

interface AdminUsersTableProps {
  users: AdminUser[];
  schools: AdminSchool[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  search: string;
  role?: 'admin' | 'teacher' | 'student';
  status?: 'active' | 'locked' | 'banned';
  schoolId?: string;
  actionLoadingId: string | null;
  onSearchChange: (search: string) => void;
  onRoleChange: (role?: 'admin' | 'teacher' | 'student') => void;
  onStatusChange: (status?: 'active' | 'locked' | 'banned') => void;
  onSchoolChange: (schoolId?: string) => void;
  onPageChange: (page: number) => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (user: AdminUser) => void;
  onOpenResetPasswordModal: (user: AdminUser) => void;
  onToggleLock: (user: AdminUser) => void;
  onBanUser: (user: AdminUser) => void;
}

export function AdminUsersTable({
  users,
  schools,
  total,
  page,
  limit,
  totalPages,
  search,
  role,
  status,
  schoolId,
  actionLoadingId,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onSchoolChange,
  onPageChange,
  onOpenCreateModal,
  onOpenEditModal,
  onOpenResetPasswordModal,
  onToggleLock,
  onBanUser,
}: AdminUsersTableProps) {
  return (
    <div className="space-y-4">
      {/* Search and Filters Toolbar: Full-width responsive flex container */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3 min-w-0">
          <DebouncedSearchBar
            value={search}
            onSearch={onSearchChange}
            placeholder="Tìm theo tên, email, MSSV/MGV..."
            className="flex-1 min-w-50"
          />

          <Select
            value={role || 'all'}
            onValueChange={(val) =>
              onRoleChange(val === 'all' ? undefined : (val as 'admin' | 'teacher' | 'student'))
            }
          >
            <SelectTrigger className="w-36 shrink-0 rounded-2xl h-11 border-border/80 text-xs">
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="student">Sinh viên</SelectItem>
              <SelectItem value="teacher">Giảng viên</SelectItem>
              <SelectItem value="admin">Quản trị viên</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={status || 'all'}
            onValueChange={(val) =>
              onStatusChange(val === 'all' ? undefined : (val as 'active' | 'locked' | 'banned'))
            }
          >
            <SelectTrigger className="w-36 shrink-0 rounded-2xl h-11 border-border/80 text-xs">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="locked">Bị khóa</SelectItem>
              <SelectItem value="banned">Bị cấm</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={schoolId || 'all'}
            onValueChange={(val) => onSchoolChange(val === 'all' ? undefined : val)}
          >
            <SelectTrigger className="w-44 shrink-0 rounded-2xl h-11 border-border/80 text-xs">
              <SelectValue placeholder="Trường trực thuộc" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Tất cả trường</SelectItem>
              {schools.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.shortname} - {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={onOpenCreateModal}
          className="shrink-0 rounded-2xl h-11 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm self-start sm:self-auto"
        >
          <Plus className="size-4 mr-1.5" />
          Thêm người dùng
        </Button>
      </div>

      {/* Users Data Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-2xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/70 dark:bg-slate-800/50">
            <TableRow>
              <TableHead className="font-bold text-xs">Người dùng</TableHead>
              <TableHead className="font-bold text-xs">Mã định danh</TableHead>
              <TableHead className="font-bold text-xs">Trường trực thuộc</TableHead>
              <TableHead className="font-bold text-xs">Vai trò</TableHead>
              <TableHead className="font-bold text-xs">Trạng thái</TableHead>
              <TableHead className="w-20 text-right font-bold text-xs">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-xs text-slate-500">
                  Không tìm thấy người dùng nào phù hợp với bộ lọc
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => {
                const isAdmin = u.role === 'admin';

                return (
                  <TableRow key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8.5 ring-1 ring-slate-200 dark:ring-slate-700">
                          <AvatarImage src={u.avatarUrl || ''} alt={u.fullName} />
                          <AvatarFallback className="text-xs font-semibold bg-slate-100 dark:bg-slate-800">
                            {u.fullName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs md:text-sm">
                            {u.fullName}
                          </span>
                          <span className="text-[11px] text-slate-400">{u.email}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
                        {u.identityCode || '—'}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-slate-700 dark:text-slate-300">
                        {u.school ? `${u.school.shortname} - ${u.school.name}` : 'Chưa phân bổ'}
                      </span>
                    </TableCell>

                    <TableCell>
                      {(() => {
                        const { label, className } = getRoleBadgeConfig(u.role);
                        return (
                          <Badge variant="outline" className={className}>
                            {label}
                          </Badge>
                        );
                      })()}
                    </TableCell>

                    <TableCell>
                      {(() => {
                        const { label, className } = getUserStatusBadgeConfig(u.status);
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
                        <DropdownMenuContent align="end" className="rounded-xl w-48">
                          <DropdownMenuItem onClick={() => onOpenEditModal(u)} className="text-xs">
                            <Edit2 className="size-3.5 mr-2 text-amber-500" />
                            Cập nhật thông tin
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onOpenResetPasswordModal(u)}
                            className="text-xs"
                          >
                            <KeyRound className="size-3.5 mr-2 text-blue-500" />
                            Đặt lại mật khẩu
                          </DropdownMenuItem>

                          {!isAdmin && (
                            <DropdownMenuItem
                              onClick={() => onToggleLock(u)}
                              disabled={actionLoadingId === u.id}
                              className="text-xs"
                            >
                              {u.status === 'locked' ? (
                                <>
                                  <Unlock className="size-3.5 mr-2 text-emerald-500" />
                                  Mở khóa tài khoản
                                </>
                              ) : (
                                <>
                                  <Lock className="size-3.5 mr-2 text-amber-500" />
                                  Khóa tài khoản
                                </>
                              )}
                            </DropdownMenuItem>
                          )}

                          {/* Protected Admin Account Rule */}
                          {isAdmin ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="px-2 py-1.5 text-xs text-slate-400 flex items-center gap-2 cursor-not-allowed select-none">
                                  <ShieldAlert className="size-3.5 text-slate-400" />
                                  <span>Tài khoản được bảo vệ</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="text-[11px]">
                                Không thể xóa hoặc vô hiệu hóa tài khoản quản trị viên
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => onBanUser(u)}
                              disabled={actionLoadingId === u.id}
                              className="text-xs text-rose-600 dark:text-rose-400"
                            >
                              <UserX className="size-3.5 mr-2" />
                              Vô hiệu hóa tài khoản
                            </DropdownMenuItem>
                          )}
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
        itemLabel="người dùng"
      />
    </div>
  );
}
