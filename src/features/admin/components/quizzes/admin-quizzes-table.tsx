'use client';

import {
  Eye,
  ShieldAlert,
  Trash2,
  Clock,
  HelpCircle,
  CheckCircle2,
  Globe,
  Lock,
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
import { AdminQuiz } from '@/types/admin';
import { getQuizStatusBadgeConfig } from '@/features/admin/utils/admin-formatters';

interface AdminQuizzesTableProps {
  quizzes: AdminQuiz[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  search: string;
  visibility?: 'public' | 'private';
  status?: 'published' | 'draft';
  onSearchChange: (search: string) => void;
  onVisibilityChange: (val?: 'public' | 'private') => void;
  onStatusChange: (val?: 'published' | 'draft') => void;
  onPageChange: (page: number) => void;
  onPreview: (quiz: AdminQuiz) => void;
  onTakedown: (quiz: AdminQuiz) => void;
  onForceDelete: (quiz: AdminQuiz) => void;
}

export function AdminQuizzesTable({
  quizzes,
  total,
  page,
  limit,
  totalPages,
  search,
  visibility,
  status,
  onSearchChange,
  onVisibilityChange,
  onStatusChange,
  onPageChange,
  onPreview,
  onTakedown,
  onForceDelete,
}: AdminQuizzesTableProps) {
  return (
    <div className="space-y-4">
      {/* Search and Filters Toolbar: Auto-expanding Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3 min-w-0">
          <DebouncedSearchBar
            value={search}
            onSearch={onSearchChange}
            placeholder="Tìm theo tiêu đề đề thi..."
            className="flex-1 min-w-50"
          />

          <Select
            value={visibility || 'all'}
            onValueChange={(val) =>
              onVisibilityChange(val === 'all' ? undefined : (val as 'public' | 'private'))
            }
          >
            <SelectTrigger className="w-40 shrink-0 rounded-2xl h-11 border-border/80 text-xs">
              <SelectValue placeholder="Phạm vi" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Tất cả phạm vi</SelectItem>
              <SelectItem value="public">Công khai</SelectItem>
              <SelectItem value="private">Riêng tư</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={status || 'all'}
            onValueChange={(val) =>
              onStatusChange(val === 'all' ? undefined : (val as 'published' | 'draft'))
            }
          >
            <SelectTrigger className="w-40 shrink-0 rounded-2xl h-11 border-border/80 text-xs">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="published">Đã xuất bản</SelectItem>
              <SelectItem value="draft">Bản nháp</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quizzes Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-2xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/70 dark:bg-slate-800/50">
            <TableRow>
              <TableHead className="font-bold text-xs">Tên đề thi & Tác giả</TableHead>
              <TableHead className="font-bold text-xs text-center">Thời lượng</TableHead>
              <TableHead className="font-bold text-xs text-center">Số câu</TableHead>
              <TableHead className="font-bold text-xs text-center">Lượt thi</TableHead>
              <TableHead className="font-bold text-xs">Phạm vi</TableHead>
              <TableHead className="font-bold text-xs">Trạng thái</TableHead>
              <TableHead className="w-32 text-right font-bold text-xs">Kiểm duyệt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-xs text-slate-500">
                  Không tìm thấy đề thi nào phù hợp với bộ lọc
                </TableCell>
              </TableRow>
            ) : (
              quizzes.map((quiz) => (
                <TableRow key={quiz.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs md:text-sm">
                        {quiz.title}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Bởi {quiz.creator.fullName} ({quiz.creator.email})
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                      <Clock className="size-3.5 text-blue-500" />
                      {quiz.timeLimit}p
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                      <HelpCircle className="size-3.5 text-indigo-500" />
                      {quiz.totalQuestions}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                      {quiz.totalAttempts}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-[10px] py-0 px-1.5 flex items-center gap-1 w-fit border-slate-300 dark:border-slate-700"
                    >
                      {quiz.visibility === 'public' ? (
                        <>
                          <Globe className="size-3 text-emerald-500" />
                          <span>Công khai</span>
                        </>
                      ) : (
                        <>
                          <Lock className="size-3 text-amber-500" />
                          <span>Riêng tư</span>
                        </>
                      )}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {(() => {
                      const { label, className } = getQuizStatusBadgeConfig(quiz.status);
                      return (
                        <Badge variant="outline" className={className}>
                          {label}
                        </Badge>
                      );
                    })()}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onPreview(quiz)}
                        className="size-8 rounded-lg text-slate-600 hover:text-blue-600"
                        title="Xem toàn bộ câu hỏi và đáp án"
                      >
                        <Eye className="size-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onTakedown(quiz)}
                        className="size-8 rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                        title="Khóa công khai do vi phạm bản quyền"
                      >
                        <ShieldAlert className="size-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onForceDelete(quiz)}
                        className="size-8 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Gỡ bỏ cưỡng chế đề thi"
                      >
                        <Trash2 className="size-4" />
                      </Button>
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
        itemLabel="đề thi"
      />
    </div>
  );
}
