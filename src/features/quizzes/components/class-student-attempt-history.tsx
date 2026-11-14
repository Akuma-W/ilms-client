'use client';

import Link from 'next/link';
import { Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatQuizDateTime } from '../utils/quiz.utils';
import type { QuizAttempt } from '@/types/quiz';

interface ClassStudentAttemptHistoryProps {
  userAttempts: QuizAttempt[];
  totalPoints: number;
  classId: string;
  publicationId: string;
}

// Student past attempts list in classroom quiz publication view
export function ClassStudentAttemptHistory({
  userAttempts,
  totalPoints,
  classId,
  publicationId,
}: ClassStudentAttemptHistoryProps) {
  const submittedAttempts = userAttempts.filter((att) => att.submittedAt !== null);

  return (
    <div className="p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-500" />
          Lịch sử làm bài của bạn trong đợt thi này
        </h3>
        <span className="text-xs text-muted-foreground font-medium">
          Tổng số lượt nộp: <strong>{submittedAttempts.length}</strong>
        </span>
      </div>

      {submittedAttempts.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-border/60 rounded-xl bg-muted/20">
          <p className="text-xs text-muted-foreground">
            Bạn chưa có lượt nộp bài nào trong đợt thi này.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground font-semibold text-left">
                <th className="pb-2.5 pl-2">Lần thi</th>
                <th className="pb-2.5">Điểm số</th>
                <th className="pb-2.5">Bắt đầu lúc</th>
                <th className="pb-2.5">Nộp lúc</th>
                <th className="pb-2.5">Trạng thái</th>
                <th className="pb-2.5 text-right pr-2">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {submittedAttempts.map((att, idx) => (
                <tr key={att.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 pl-2 font-medium">#{submittedAttempts.length - idx}</td>
                  <td className="py-2.5">
                    <span className="font-bold text-emerald-500">
                      {att.score !== null ? `${att.score}/${totalPoints} đ` : 'Đang chấm'}
                    </span>
                  </td>
                  <td className="py-2.5 text-muted-foreground">
                    {formatQuizDateTime(att.startedAt)}
                  </td>
                  <td className="py-2.5 text-muted-foreground">
                    {formatQuizDateTime(att.submittedAt)}
                  </td>
                  <td className="py-2.5">
                    <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Đã nộp bài
                    </Badge>
                  </td>
                  <td className="py-2.5 text-right pr-2">
                    <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-indigo-600 dark:text-indigo-400 gap-1 hover:text-indigo-700">
                      <Link href={`/classes/${classId}/quizzes/${publicationId}/attempts/${att.id}`}>
                        <span>Xem lại</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </Button>
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
