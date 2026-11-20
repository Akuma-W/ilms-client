'use client';

import { SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface AttendancePresetsBarProps {
  totalWeight: number;
  isBalanced: boolean;
  onApplyPreset: (meet: number, mat: number, assign: number, quiz: number) => void;
}

export function AttendancePresetsBar({
  totalWeight,
  isBalanced,
  onApplyPreset,
}: AttendancePresetsBarProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <SlidersHorizontal className="size-3.5" />
          <span>Mẫu phân bổ nhanh:</span>
        </Label>
        <Badge
          variant="outline"
          className={`text-[10px] px-2 py-0.5 font-bold ${
            isBalanced
              ? 'border-emerald-500/30 text-emerald-600 bg-emerald-500/10'
              : 'border-amber-500/30 text-amber-600 bg-amber-500/10'
          }`}
        >
          Tổng: {totalWeight}%
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Đều 4 phần (25%)', vals: [25, 25, 25, 25] as const },
          { label: 'Họp & Bài giảng (40%)', vals: [40, 40, 10, 10] as const },
          { label: 'Họp & Tài liệu (50%)', vals: [50, 50, 0, 0] as const },
        ].map((preset) => (
          <Button
            key={preset.label}
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onApplyPreset(preset.vals[0], preset.vals[1], preset.vals[2], preset.vals[3])
            }
            className="h-8 text-xs hover:bg-purple-500/10 hover:border-purple-500/40 border-border"
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
