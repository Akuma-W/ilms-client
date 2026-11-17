'use client';

import { BarChart3 } from 'lucide-react';
import { calcScoreBins } from '../../utils/quiz-scoring.utils';

interface ClassQuizScoreChartProps {
  attempts: Array<{ score: number | null }>;
  totalPoints: number;
}

export function ClassQuizScoreChart({ attempts, totalPoints }: ClassQuizScoreChartProps) {
  const bins = calcScoreBins(attempts, totalPoints);
  const totalSubmitted = attempts.filter((a) => a.score !== null && a.score !== undefined).length;

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-500" />
          <h3 className="text-base font-bold text-foreground">Phổ điểm bài thi của lớp</h3>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          Dựa trên {totalSubmitted} bài đã nộp
        </span>
      </div>

      {totalSubmitted === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground">
          Chưa có học sinh nào nộp bài để tổng hợp phổ điểm.
        </div>
      ) : (
        <div className="space-y-3.5">
          {bins.map((bin) => (
            <div key={bin.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: bin.color }}
                  />
                  {bin.label}
                </span>
                <span className="text-muted-foreground font-medium">
                  <strong className="text-foreground">{bin.count}</strong> học sinh (
                  {bin.percentage}%)
                </span>
              </div>

              {/* Bar */}
              <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${bin.percentage}%`,
                    backgroundColor: bin.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
