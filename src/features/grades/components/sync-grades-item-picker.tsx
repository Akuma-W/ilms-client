'use client';

import { useState } from 'react';
import { CheckSquare, FileText, HelpCircle, Search, Square } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Assignment } from '@/types/assignment';
import type { QuizClassItem } from '@/types/quiz';

interface SyncGradesItemPickerProps {
  assignments: Assignment[];
  quizzes: QuizClassItem[];
  selectedItems: Array<{ id: string; type: 'assignment' | 'quiz'; title?: string }>;
  onToggleItem: (id: string, type: 'assignment' | 'quiz', title?: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function SyncGradesItemPicker({
  assignments,
  quizzes,
  selectedItems,
  onToggleItem,
  onSelectAll,
  onDeselectAll,
}: SyncGradesItemPickerProps) {
  const [tab, setTab] = useState<'all' | 'assignment' | 'quiz'>('all');
  const [search, setSearch] = useState('');

  const isAssignSelected = (id: string) => selectedItems.some((item) => item.id === id);
  const isQuizSelected = (q: QuizClassItem) =>
    selectedItems.some((item) => item.id === q.publicationId || item.id === q.id);

  const filteredAssignments = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredQuizzes = quizzes.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase()),
  );

  const showAssignments = tab === 'all' || tab === 'assignment';
  const showQuizzes = tab === 'all' || tab === 'quiz';

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-foreground">
          Chọn bài thành phần ({selectedItems.length} bài đã chọn):
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSelectAll}
            className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
          >
            Chọn tất cả
          </button>
          <span className="text-muted-foreground">•</span>
          <button
            type="button"
            onClick={onDeselectAll}
            className="text-[11px] text-muted-foreground hover:underline cursor-pointer"
          >
            Bỏ chọn
          </button>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 border border-border/80 bg-background p-0.5 rounded-lg shrink-0">
          <Button
            type="button"
            size="xs"
            variant={tab === 'all' ? 'secondary' : 'ghost'}
            onClick={() => setTab('all')}
            className="text-[11px] h-6 px-2 font-medium"
          >
            Tất cả ({assignments.length + quizzes.length})
          </Button>
          <Button
            type="button"
            size="xs"
            variant={tab === 'assignment' ? 'secondary' : 'ghost'}
            onClick={() => setTab('assignment')}
            className="text-[11px] h-6 px-2 font-medium"
          >
            Bài tập ({assignments.length})
          </Button>
          <Button
            type="button"
            size="xs"
            variant={tab === 'quiz' ? 'secondary' : 'ghost'}
            onClick={() => setTab('quiz')}
            className="text-[11px] h-6 px-2 font-medium"
          >
            Quiz ({quizzes.length})
          </Button>
        </div>

        <div className="relative flex-1">
          <Search className="size-3 text-muted-foreground absolute left-2.5 top-2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên bài..."
            className="h-7 text-xs pl-7 rounded-lg"
          />
        </div>
      </div>

      {/* Scrollable list */}
      <div className="max-h-52 overflow-y-auto space-y-2 rounded-lg border border-border/80 bg-background p-2">
        {/* Nhóm Bài tập */}
        {showAssignments && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-1 py-0.5 text-[11px] font-semibold text-muted-foreground">
              <FileText className="size-3 text-blue-500" />
              <span>Bài tập ({filteredAssignments.length})</span>
            </div>
            {filteredAssignments.length === 0 ? (
              <p className="text-[11px] text-muted-foreground px-2 py-1 italic">
                {search ? 'Không tìm thấy bài tập phù hợp.' : 'Chưa có bài tập nào.'}
              </p>
            ) : (
              filteredAssignments.map((a) => {
                const checked = isAssignSelected(a.id);
                return (
                  <div
                    key={`assign-${a.id}`}
                    onClick={() => onToggleItem(a.id, 'assignment', a.title)}
                    className="flex items-center justify-between p-1.5 rounded-md hover:bg-muted/50 cursor-pointer text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      {checked ? (
                        <CheckSquare className="size-4 text-blue-500 shrink-0" />
                      ) : (
                        <Square className="size-4 text-muted-foreground shrink-0" />
                      )}
                      <span className="truncate text-foreground font-medium">{a.title}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0 font-mono">
                      {a.maxScore || 10} điểm
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Nhóm Trắc nghiệm Quiz */}
        {showQuizzes && (
          <div className="space-y-1 pt-1 border-t border-border/50">
            <div className="flex items-center gap-1.5 px-1 py-0.5 text-[11px] font-semibold text-muted-foreground">
              <HelpCircle className="size-3 text-purple-500" />
              <span>Trắc nghiệm Quiz ({filteredQuizzes.length})</span>
            </div>
            {filteredQuizzes.length === 0 ? (
              <p className="text-[11px] text-muted-foreground px-2 py-1 italic">
                {search ? 'Không tìm thấy bài quiz phù hợp.' : 'Chưa có đợt thi Quiz nào.'}
              </p>
            ) : (
              filteredQuizzes.map((q) => {
                const checked = isQuizSelected(q);
                const quizId = q.publicationId || q.id;
                return (
                  <div
                    key={`quiz-${quizId}`}
                    onClick={() => onToggleItem(quizId, 'quiz', q.title)}
                    className="flex items-center justify-between p-1.5 rounded-md hover:bg-muted/50 cursor-pointer text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      {checked ? (
                        <CheckSquare className="size-4 text-purple-500 shrink-0" />
                      ) : (
                        <Square className="size-4 text-muted-foreground shrink-0" />
                      )}
                      <span className="truncate text-foreground font-medium">{q.title}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0 font-mono">
                      {q.questionCount || 0} câu
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
