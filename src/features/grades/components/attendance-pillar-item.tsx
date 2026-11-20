'use client';

import { Input } from '@/components/ui/input';

interface AttendancePillarItemProps {
  label: string;
  unit: string;
  weight: number;
  threshold: number;
  totalCount?: number;
  onWeightChange: (val: number) => void;
  onThresholdChange: (val: number) => void;
}

export function AttendancePillarItem({
  label,
  unit,
  weight,
  threshold,
  totalCount = 10,
  onWeightChange,
  onThresholdChange,
}: AttendancePillarItemProps) {
  const effectiveMax = Math.max(threshold, totalCount, 1);
  const percentage =
    totalCount > 0 ? Math.min(100, Math.round((threshold / totalCount) * 100)) : 100;

  return (
    <div className="p-3 rounded-xl border border-border/80 bg-muted/20 space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-0.5 min-w-0">
          <span className="text-xs font-bold text-foreground truncate block">{label}</span>
          <p className="text-[10px] text-muted-foreground">
            Hiện có:{' '}
            <span className="font-semibold text-foreground">
              {totalCount} {unit}
            </span>{' '}
            trong lớp
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Input
            type="number"
            min={0}
            max={100}
            value={weight}
            onChange={(e) => onWeightChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="h-8 w-18 text-xs text-center font-bold rounded-lg"
          />
          <span className="text-xs font-semibold text-muted-foreground">%</span>
        </div>
      </div>

      {weight > 0 && (
        <div className="space-y-2 pt-2 border-t border-border/40">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground text-[11px]">
              Ngưỡng đạt đủ điểm ({percentage}%):
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">Tối thiểu</span>
              <Input
                type="number"
                min={0}
                max={effectiveMax}
                value={threshold}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 0;
                  onThresholdChange(Math.max(0, val));
                }}
                className="h-7 w-16 text-xs text-center font-semibold rounded-md"
              />
              <span className="text-[11px] text-muted-foreground font-medium">
                / {totalCount} {unit}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={effectiveMax}
              value={Math.min(threshold, effectiveMax)}
              onChange={(e) => onThresholdChange(parseInt(e.target.value, 10) || 0)}
              className="w-full accent-purple-600 h-1.5 bg-muted rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
