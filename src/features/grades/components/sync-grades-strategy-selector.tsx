'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface SyncGradesStrategySelectorProps {
  strategy: 'average' | 'highest' | 'threshold';
  setStrategy: (s: 'average' | 'highest' | 'threshold') => void;
  thresholdCount: number;
  setThresholdCount: (n: number) => void;
  itemCount: number;
}

export function SyncGradesStrategySelector({
  strategy,
  setStrategy,
  thresholdCount,
  setThresholdCount,
  itemCount,
}: SyncGradesStrategySelectorProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-foreground">Chiến lược tổng hợp điểm</Label>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <button
          type="button"
          onClick={() => setStrategy('average')}
          className={`p-2 rounded-xl border text-center transition-all ${
            strategy === 'average'
              ? 'border-blue-500 bg-blue-500/10 font-bold text-blue-600 dark:text-blue-400'
              : 'border-border bg-background text-muted-foreground hover:bg-muted/40'
          }`}
        >
          <div>Trung bình cộng</div>
          <div className="text-[10px] font-normal opacity-75 mt-0.5">Tính điểm TB các bài chọn</div>
        </button>
        <button
          type="button"
          onClick={() => setStrategy('highest')}
          className={`p-2 rounded-xl border text-center transition-all ${
            strategy === 'highest'
              ? 'border-purple-500 bg-purple-500/10 font-bold text-purple-600 dark:text-purple-400'
              : 'border-border bg-background text-muted-foreground hover:bg-muted/40'
          }`}
        >
          <div>Lấy điểm cao nhất</div>
          <div className="text-[10px] font-normal opacity-75 mt-0.5">Lấy điểm bài cao nhất</div>
        </button>
        <button
          type="button"
          onClick={() => setStrategy('threshold')}
          className={`p-2 rounded-xl border text-center transition-all ${
            strategy === 'threshold'
              ? 'border-amber-500 bg-amber-500/10 font-bold text-amber-600 dark:text-amber-400'
              : 'border-border bg-background text-muted-foreground hover:bg-muted/40'
          }`}
        >
          <div>Đạt ngưỡng số bài</div>
          <div className="text-[10px] font-normal opacity-75 mt-0.5">Đạt tối thiểu X bài làm</div>
        </button>
      </div>

      {strategy === 'threshold' && (
        <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-center justify-between text-xs gap-3 mt-2">
          <div className="space-y-0.5">
            <span className="font-semibold text-foreground">Ngưỡng số bài tối thiểu:</span>
            <p className="text-[10px] text-muted-foreground">
              Sinh viên hoàn thành đủ số bài này sẽ đạt 10 điểm
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Input
              type="number"
              min={1}
              max={Math.max(1, itemCount)}
              value={thresholdCount}
              onChange={(e) =>
                setThresholdCount(
                  Math.min(Math.max(1, itemCount), Math.max(1, parseInt(e.target.value, 10) || 1)),
                )
              }
              className="h-8 w-16 text-center text-xs font-bold rounded-lg"
            />
            <span className="text-xs text-muted-foreground font-medium">/ {itemCount} bài</span>
          </div>
        </div>
      )}
    </div>
  );
}
