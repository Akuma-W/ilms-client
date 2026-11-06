'use client';

import { useState } from 'react';
import { Tag, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ResourceBatchToolbarProps {
  itemCount: number;
  onApplyBatchTitle: (title: string, numbered: boolean) => void;
  disabled?: boolean;
}

/**
 * Batch title applicator toolbar for resources in the staging queue.
 */
export function ResourceBatchToolbar({
  itemCount,
  onApplyBatchTitle,
  disabled = false,
}: ResourceBatchToolbarProps) {
  const [commonTitle, setCommonTitle] = useState('');
  const [isNumbered, setIsNumbered] = useState(false);

  const handleApply = () => {
    const clean = commonTitle.trim();
    if (!clean) {
      toast.error('Vui lòng nhập tiêu đề chung cần áp dụng');
      return;
    }
    onApplyBatchTitle(clean, isNumbered);
    toast.success(`Đã áp dụng tiêu đề cho ${itemCount} tài nguyên`);
  };

  if (itemCount <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl border border-border/70 bg-muted/30">
      <div className="flex items-center gap-1.5 min-w-0">
        <Tag className="size-3.5 text-muted-foreground shrink-0" />
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          Đặt tên hàng loạt ({itemCount} mục):
        </span>
      </div>

      <div className="flex items-center gap-2 flex-1 max-w-md">
        <Input
          type="text"
          value={commonTitle}
          onChange={(e) => setCommonTitle(e.target.value)}
          placeholder="Nhập tên chung (vd: Bài giảng Chương 1)..."
          disabled={disabled}
          className="text-xs h-7.5 rounded-lg bg-background"
        />

        <label className="flex items-center gap-1 text-[11px] text-muted-foreground cursor-pointer select-none whitespace-nowrap">
          <input
            type="checkbox"
            checked={isNumbered}
            onChange={(e) => setIsNumbered(e.target.checked)}
            disabled={disabled}
            className="size-3.5 rounded border-border"
          />
          Đánh số (1, 2...)
        </label>

        <Button
          type="button"
          size="sm"
          onClick={handleApply}
          disabled={disabled || !commonTitle.trim()}
          className="h-7.5 px-2.5 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shrink-0"
        >
          <Check className="size-3 mr-1" />
          Áp dụng
        </Button>
      </div>
    </div>
  );
}
