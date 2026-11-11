'use client';

import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Loader2, Plus, Sliders, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { GradeCategory } from '@/types/grade';

interface CategoryManagementModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  categories: GradeCategory[];
  onSaveCategories: (
    updated: {
      id?: string;
      name: string;
      weightPercent: number;
      orderIndex?: number;
      isDeleted?: boolean;
    }[],
  ) => Promise<void>;
}

interface LocalCategoryItem {
  id: string;
  name: string;
  weightPercent: number;
  orderIndex?: number;
  isNew?: boolean;
  isDeleted?: boolean;
}

// Maps and sorts category array by orderIndex ascending
const mapCategories = (cats: GradeCategory[]): LocalCategoryItem[] =>
  [...cats]
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    .map((c, idx) => ({
      id: c.id,
      name: c.name,
      weightPercent: Math.round(c.weight > 1 ? c.weight : c.weight * 100),
      orderIndex: c.orderIndex ?? idx + 1,
    }));

// Dialog for managing classroom grade categories, weights, and chronological order
export function CategoryManagementModal({
  isOpen,
  onOpenChange,
  categories,
  onSaveCategories,
}: CategoryManagementModalProps) {
  const [items, setItems] = useState<LocalCategoryItem[]>(() => mapCategories(categories));
  const [isSaving, setIsSaving] = useState(false);

  // Sync when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setItems(mapCategories(categories));
    }
    onOpenChange(open);
  };

  const activeItems = items.filter((i) => !i.isDeleted);
  const totalWeight = activeItems.reduce((sum, i) => sum + (Number(i.weightPercent) || 0), 0);
  const isBalanced = totalWeight === 100;

  const handleAddCategory = () => {
    const remaining = Math.max(0, 100 - totalWeight);
    setItems((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        name: 'Cột điểm mới',
        weightPercent: remaining,
        orderIndex: activeItems.length + 1,
        isNew: true,
      },
    ]);
  };

  const handleRemoveCategory = (id: string) => {
    if (activeItems.length <= 1) {
      toast.error('Bảng điểm phải có ít nhất 1 loại điểm!');
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isDeleted: true } : i)));
  };

  const handleItemChange = (id: string, field: 'name' | 'weightPercent', val: string | number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: val } : i)));
  };

  // Move category position up or down in the display sequence
  const handleMove = (activeIdx: number, direction: -1 | 1) => {
    const targetIdx = activeIdx + direction;
    if (targetIdx < 0 || targetIdx >= activeItems.length) return;

    const currentItem = activeItems[activeIdx];
    const targetItem = activeItems[targetIdx];

    setItems((prev) => {
      const next = [...prev];
      const curPos = next.findIndex((i) => i.id === currentItem.id);
      const tarPos = next.findIndex((i) => i.id === targetItem.id);
      if (curPos !== -1 && tarPos !== -1) {
        const temp = next[curPos];
        next[curPos] = next[tarPos];
        next[tarPos] = temp;
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!isBalanced) {
      toast.warning(`Tổng trọng số hiện tại là ${totalWeight}%. Vui lòng điều chỉnh về đúng 100%!`);
      return;
    }

    const invalidName = activeItems.some((i) => !i.name.trim());
    if (invalidName) {
      toast.error('Tên loại điểm không được để trống!');
      return;
    }

    setIsSaving(true);
    try {
      let activeOrder = 1;
      const payload = items.map((i) => {
        const orderIndex = i.isDeleted ? undefined : activeOrder++;
        return {
          id: i.isNew ? undefined : i.id,
          name: i.name.trim(),
          weightPercent: Number(i.weightPercent),
          orderIndex,
          isDeleted: i.isDeleted,
        };
      });

      await onSaveCategories(payload);
      toast.success('Cập nhật cấu hình loại điểm thành công!');
      onOpenChange(false);
    } catch {
      toast.error('Không thể lưu cấu hình loại điểm.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            <Sliders className="size-5 text-primary" />
            <span>Quản lý loại điểm & Trọng số</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Thiết lập thứ tự hiển thị và trọng số các cột điểm. Tổng trọng số bắt buộc phải bằng đúng 100%.
          </DialogDescription>
        </DialogHeader>

        {/* List of categories */}
        <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
          {activeItems.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-3 rounded-xl border border-border/80 bg-muted/20"
            >
              {/* Reorder Buttons */}
              <div className="flex flex-col items-center justify-center shrink-0 -space-y-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, -1)}
                  title="Di chuyển lên trên"
                  className="h-5 w-6 p-0 text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:pointer-events-none rounded"
                >
                  <ChevronUp className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={idx === activeItems.length - 1}
                  onClick={() => handleMove(idx, 1)}
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

              <div className="flex-1">
                <Input
                  value={item.name}
                  onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                  placeholder="Tên loại điểm..."
                  className="h-9 text-xs font-semibold rounded-lg"
                />
              </div>

              <div className="w-24 flex items-center gap-1">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={item.weightPercent}
                  onChange={(e) =>
                    handleItemChange(item.id, 'weightPercent', parseInt(e.target.value, 10) || 0)
                  }
                  className="h-9 text-xs text-center font-bold rounded-lg"
                />
                <span className="text-xs font-semibold text-muted-foreground">%</span>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveCategory(item.id)}
                className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddCategory}
            className="w-full h-9 text-xs rounded-xl border-dashed border-primary/40 text-primary hover:bg-primary/5 gap-1.5 font-semibold"
          >
            <Plus className="size-4" />
            <span>Thêm loại điểm mới</span>
          </Button>
        </div>

        {/* Total Weight Status */}
        <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground">Tổng trọng số:</span>
          <Badge
            variant="outline"
            className={`font-bold px-2.5 py-0.5 text-xs ${
              isBalanced
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
            }`}
          >
            {totalWeight}%{' '}
            {isBalanced
              ? '✓ Chuẩn'
              : `(Cần ${100 - totalWeight > 0 ? '+' : ''}${100 - totalWeight}%)`}
          </Badge>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-border/70">
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
            className="rounded-xl h-9 text-xs"
          >
            Hủy
          </Button>
          <Button
            type="button"
            disabled={isSaving || !isBalanced}
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-9 text-xs gap-1.5 shadow-xs"
          >
            {isSaving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Check className="size-3.5" />
            )}
            <span>Lưu cấu hình</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
