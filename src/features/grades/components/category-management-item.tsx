'use client';

import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { GradeSourceType } from '@/types/grade';

export interface LocalCategoryItem {
  id: string;
  name: string;
  weightPercent: number;
  orderIndex?: number;
  isNew?: boolean;
  isDeleted?: boolean;
  sourceType?: GradeSourceType;
  sourceId?: string | null;
  config?: Record<string, unknown> | null;
}

interface CategoryManagementItemProps {
  item: LocalCategoryItem;
  idx: number;
  totalActive: number;
  onMove: (idx: number, direction: -1 | 1) => void;
  onChange: (id: string, field: keyof LocalCategoryItem, val: unknown) => void;
  onRemove: (id: string) => void;
}

export function CategoryManagementItem({
  item,
  idx,
  totalActive,
  onMove,
  onChange,
  onRemove,
}: CategoryManagementItemProps) {
  return (
    <div className="p-3 rounded-xl border border-border/80 bg-muted/20 flex flex-wrap items-center gap-2.5">
      {/* Reorder Buttons */}
      <div className="flex flex-col items-center justify-center shrink-0 -space-y-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={idx === 0}
          onClick={() => onMove(idx, -1)}
          title="Di chuyển lên trên"
          className="h-5 w-6 p-0 text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:pointer-events-none rounded"
        >
          <ChevronUp className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={idx === totalActive - 1}
          onClick={() => onMove(idx, 1)}
          title="Di chuyển xuống dưới"
          className="h-5 w-6 p-0 text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:pointer-events-none rounded"
        >
          <ChevronDown className="size-3.5" />
        </Button>
      </div>

      {/* Order index badge */}
      <div className="size-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
        {idx + 1}
      </div>

      {/* Name input */}
      <div className="flex-1 min-w-36">
        <Input
          value={item.name}
          onChange={(e) => onChange(item.id, 'name', e.target.value)}
          placeholder="Tên loại điểm..."
          className="h-9 text-xs font-semibold rounded-lg"
        />
      </div>

      {/* Weight percent input */}
      <div className="w-22 flex items-center gap-1 shrink-0">
        <Input
          type="number"
          min={0}
          max={100}
          value={item.weightPercent}
          onChange={(e) => onChange(item.id, 'weightPercent', parseInt(e.target.value, 10) || 0)}
          className="h-9 text-xs text-center font-bold rounded-lg"
        />
        <span className="text-xs font-semibold text-muted-foreground">%</span>
      </div>

      {/* Calculation Mechanism Dropdown */}
      <div className="w-44 shrink-0">
        <select
          value={
            item.sourceType === 'attendance'
              ? 'attendance'
              : item.sourceType === 'assignment' || item.sourceType === 'quiz'
                ? 'assignment'
                : 'manual'
          }
          onChange={(e) => {
            const newSource = e.target.value as GradeSourceType;
            onChange(item.id, 'sourceType', newSource);
            if (newSource === 'manual') {
              onChange(item.id, 'sourceId', null);
              onChange(item.id, 'config', null);
            } else if (newSource === 'attendance') {
              onChange(item.id, 'sourceId', null);
              const prevCfg = { ...(item.config || {}) };
              delete prevCfg.items;
              onChange(item.id, 'config', { ...prevCfg, strategy: 'attendance_threshold' });
            } else if (newSource === 'assignment') {
              const prevCfg = { ...(item.config || {}) };
              delete prevCfg.pillars;
              delete prevCfg.thresholds;
              onChange(item.id, 'config', { ...prevCfg, strategy: 'average' });
            }
          }}
          className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary font-medium"
        >
          <option value="manual">Nhập tay (Mặc định)</option>
          <option value="attendance">Điểm chuyên cần</option>
          <option value="assignment">Điểm bài tập & quiz</option>
        </select>
      </div>

      {/* Delete Button */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(item.id)}
        className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
        title="Xóa cột điểm này"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
