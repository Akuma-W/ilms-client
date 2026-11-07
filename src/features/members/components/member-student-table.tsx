'use client';

import { Users } from 'lucide-react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { MemberRow } from './member-row';
import { Role } from '@/types/enum';
import type { ClassMember } from '@/types/member';

interface MemberStudentTableProps {
  members: ClassMember[];
  isTeacher: boolean;
  canEditRole?: boolean;
  page: number;
  pageSize?: number;
  onPageChange: (newPage: number) => void;
  onApprove?: (memberId: string) => Promise<void>;
  onReject?: (memberId: string) => Promise<void>;
  onRemove?: (memberId: string) => Promise<void>;
  onChangeRole?: (memberId: string, newRole: Role) => Promise<void>;
}

/**
 * Responsive table displaying student members using shadcn Table and Pagination.
 */
export function MemberStudentTable({
  members,
  isTeacher,
  canEditRole = false,
  page,
  pageSize = 10,
  onPageChange,
  onApprove,
  onReject,
  onRemove,
  onChangeRole,
}: MemberStudentTableProps) {
  const totalPages = Math.ceil(members.length / pageSize) || 1;
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginatedMembers = members.slice((safePage - 1) * pageSize, safePage * pageSize);

  if (members.length === 0) {
    return (
      <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-border bg-card/60 space-y-2">
        <Users className="size-10 text-muted-foreground mx-auto stroke-1" />
        <h4 className="text-base font-bold text-foreground">Không tìm thấy thành viên nào</h4>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Chưa có thành viên nào trong danh sách hoặc không khớp với từ khóa tìm kiếm của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Container using shadcn Table */}
      <div className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-primary/5 dark:bg-primary/10 border-b border-primary/20">
            <TableRow className="border-b border-primary/20 text-xs font-bold uppercase tracking-wider">
              <TableHead className="py-3 px-4 font-bold text-foreground">Thành viên</TableHead>
              <TableHead className="py-3 px-4 font-bold text-foreground">Mã số SV</TableHead>
              <TableHead className="py-3 px-4 font-bold text-foreground">Vai trò</TableHead>
              <TableHead className="py-3 px-4 font-bold text-foreground">Ngày tham gia</TableHead>
              <TableHead className="py-3 px-4 font-bold text-foreground">Trạng thái</TableHead>
              {isTeacher && (
                <TableHead className="py-3 px-4 text-right font-bold text-foreground">
                  Thao tác
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMembers.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                isTeacher={isTeacher}
                canEditRole={canEditRole}
                onApprove={onApprove}
                onReject={onReject}
                onRemove={onRemove}
                onChangeRole={onChangeRole}
              />
            ))}
          </TableBody>
        </Table>

        {/* Pagination using shadcn Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>
              Hiển thị {(safePage - 1) * pageSize + 1} -{' '}
              {Math.min(safePage * pageSize, members.length)} trên tổng số {members.length} thành
              viên
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
        )}
      </div>
    </div>
  );
}
