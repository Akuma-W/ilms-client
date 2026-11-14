'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, ExternalLink, Loader2, Search, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatQuizDateTime } from '../../utils/quiz.utils';
import type { QuizStudentStatItem } from '@/types/quiz';

interface ClassQuizStudentsTableProps {
  students: QuizStudentStatItem[];
  classId: string;
  publicationId: string;
  totalPoints: number;
  isLoading?: boolean;
}

export function ClassQuizStudentsTable({
  students,
  classId,
  publicationId,
  totalPoints,
  isLoading = false,
}: ClassQuizStudentsTableProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'submitted' | 'unsubmitted'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'score' | 'name' | 'mssv'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const safeTotal = totalPoints > 0 ? totalPoints : 10;

  const submittedCount = students.filter((s) => s.isSubmitted).length;
  const unsubmittedCount = students.length - submittedCount;

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let result = students.filter((student) => {
      const query = searchTerm.toLowerCase();
      const matchSearch =
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        (student.identityCode && student.identityCode.toLowerCase().includes(query));
      if (!matchSearch) return false;

      if (activeTab === 'submitted') return student.isSubmitted;
      if (activeTab === 'unsubmitted') return !student.isSubmitted;
      return true;
    });

    result = [...result].sort((a, b) => {
      if (sortField === 'score') {
        const scoreA = a.score ?? -1;
        const scoreB = b.score ?? -1;
        return sortOrder === 'asc' ? scoreA - scoreB : scoreB - scoreA;
      }
      if (sortField === 'name') {
        const nameA = a.name || '';
        const nameB = b.name || '';
        return sortOrder === 'asc'
          ? nameA.localeCompare(nameB, 'vi')
          : nameB.localeCompare(a.name, 'vi');
      }
      if (sortField === 'mssv') {
        const codeA = a.identityCode || '';
        const codeB = b.identityCode || '';
        return sortOrder === 'asc'
          ? codeA.localeCompare(codeB, 'vi')
          : codeB.localeCompare(codeA, 'vi');
      }
      return 0;
    });

    return result;
  }, [students, searchTerm, activeTab, sortField, sortOrder]);

  const handleSort = (field: 'score' | 'name' | 'mssv') => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortOrder(field === 'score' ? 'desc' : 'asc');
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm space-y-4">
      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-muted/60 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-background text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Tất cả ({students.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('submitted')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'submitted'
                ? 'bg-background text-emerald-600 shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Đã nộp ({submittedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('unsubmitted')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'unsubmitted'
                ? 'bg-background text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Chưa nộp ({unsubmittedCount})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm theo tên, email, MSSV..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-xs rounded-md"
          />
        </div>
      </div>

      {/* Table Content */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
          Đang tải dữ liệu kết quả học sinh...
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground">
          Không tìm thấy học sinh nào phù hợp.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                <th className="py-3 px-3">
                  <button
                    type="button"
                    onClick={() => handleSort('name')}
                    className="inline-flex items-center gap-1 hover:text-foreground cursor-pointer font-semibold"
                    title={
                      sortField === 'name'
                        ? sortOrder === 'asc'
                          ? 'Sắp xếp: Tên A -> Z'
                          : 'Sắp xếp: Tên Z -> A'
                        : 'Bấm để sắp xếp theo tên'
                    }
                  >
                    <span>Học sinh</span>
                    {sortField === 'name' ? (
                      sortOrder === 'asc' ? (
                        <ArrowUp className="w-3 h-3 text-indigo-500" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-indigo-500" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-muted-foreground/60" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3">
                  <button
                    type="button"
                    onClick={() => handleSort('mssv')}
                    className="inline-flex items-center gap-1 hover:text-foreground cursor-pointer font-semibold"
                    title={
                      sortField === 'mssv'
                        ? sortOrder === 'asc'
                          ? 'Sắp xếp: MSSV tăng dần'
                          : 'Sắp xếp: MSSV giảm dần'
                        : 'Bấm để sắp xếp theo MSSV'
                    }
                  >
                    <span>MSSV</span>
                    {sortField === 'mssv' ? (
                      sortOrder === 'asc' ? (
                        <ArrowUp className="w-3 h-3 text-indigo-500" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-indigo-500" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-muted-foreground/60" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3">Trạng thái</th>
                <th className="py-3 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleSort('score')}
                    className="inline-flex items-center gap-1 hover:text-foreground cursor-pointer font-semibold"
                    title={
                      sortField === 'score'
                        ? sortOrder === 'desc'
                          ? 'Sắp xếp: Điểm cao -> thấp'
                          : 'Sắp xếp: Điểm thấp -> cao'
                        : 'Bấm để sắp xếp theo điểm'
                    }
                  >
                    <span>Điểm số</span>
                    {sortField === 'score' ? (
                      sortOrder === 'desc' ? (
                        <ArrowDown className="w-3 h-3 text-indigo-500" />
                      ) : (
                        <ArrowUp className="w-3 h-3 text-indigo-500" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-muted-foreground/60" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3 text-right">Thời gian nộp</th>
                <th className="py-3 px-3 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredStudents.map((st) => (
                <tr key={st.studentId} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="w-7 h-7">
                        {st.avatar && <AvatarImage src={st.avatar} alt={st.name} />}
                        <AvatarFallback className="text-[10px] font-bold">
                          {st.name?.slice(0, 2).toUpperCase() || 'HS'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate">{st.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{st.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-muted-foreground">
                    {st.identityCode || '—'}
                  </td>
                  <td className="py-3 px-3">
                    {st.isSubmitted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-sm">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Đã nộp
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-sm">
                        <XCircle className="w-3 h-3" /> Chưa làm
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-sm">
                    {st.score !== null ? (
                      <span
                        className={
                          st.score >= safeTotal * 0.5 ? 'text-emerald-500' : 'text-rose-500'
                        }
                      >
                        {Math.round(st.score * 100) / 100}/{safeTotal}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/60">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right text-muted-foreground">
                    {st.submittedAt ? formatQuizDateTime(st.submittedAt) : 'Chưa có'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {st.isSubmitted && st.attemptId ? (
                      <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 text-indigo-500">
                        <Link
                          href={`/classes/${classId}/quizzes/${publicationId}/attempts/${st.attemptId}`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Xem bài</span>
                        </Link>
                      </Button>
                    ) : (
                      <span className="text-muted-foreground/40 text-[11px]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
