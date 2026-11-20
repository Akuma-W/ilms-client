'use client';

import { useState, useEffect } from 'react';
import { Check, Loader2, Plus, Sliders } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CategoryManagementItem, type LocalCategoryItem } from './category-management-item';
import type { GradeCategory } from '@/types/grade';

interface CategoryManagementModalProps {
  classId?: string;
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
      sourceType?: GradeCategory['sourceType'];
      sourceId?: string | null;
      config?: GradeCategory['config'];
    }[],
  ) => Promise<void>;
}

const mapCategories = (cats: GradeCategory[]): LocalCategoryItem[] =>
  [...cats]
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    .map((c, idx) => ({
      id: c.id,
      name: c.name,
      weightPercent: Math.round(c.weight > 1 ? c.weight : c.weight * 100),
      orderIndex: c.orderIndex ?? idx + 1,
      sourceType: c.sourceType || 'manual',
      sourceId: c.sourceId,
      config: c.config,
    }));

export function CategoryManagementModal({
  isOpen,
  onOpenChange,
  categories,
  onSaveCategories,
}: CategoryManagementModalProps) {
  const [items, setItems] = useState<LocalCategoryItem[]>(() => mapCategories(categories));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setItems(mapCategories(categories));
    }
  }, [isOpen, categories]);

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
        sourceType: 'manual',
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

  const handleItemChange = (id: string, field: keyof LocalCategoryItem, val: unknown) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: val } : i)));
  };

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
          sourceType: i.sourceType || 'manual',
          sourceId: i.sourceId || null,
          config: i.config || null,
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-2xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            <Sliders className="size-5 text-primary" />
            <span>Quản lý Cột điểm & Nguồn tính tự động</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Thiết lập trọng số (tổng 100%) và gắn nguồn điểm tự động (Bài tập, Quiz, Chuyên cần, Họp
            trực tuyến).
          </DialogDescription>
        </DialogHeader>

        {/* List of categories */}
        <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
          {activeItems.map((item, idx) => (
            <CategoryManagementItem
              key={item.id}
              item={item}
              idx={idx}
              totalActive={activeItems.length}
              onMove={handleMove}
              onChange={handleItemChange}
              onRemove={handleRemoveCategory}
            />
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddCategory}
            className="w-full h-9 border-dashed border-primary/40 text-primary hover:bg-primary/5 text-xs font-semibold rounded-xl gap-1.5"
          >
            <Plus className="size-4" />
            <span>Thêm cột điểm mới</span>
          </Button>
        </div>

        {/* Weight Balance Status Bar */}
        <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Tổng trọng số:</span>
          <div className="flex items-center gap-2">
            <span
              className={`font-bold ${isBalanced ? 'text-emerald-500' : 'text-amber-500 font-black'}`}
            >
              {totalWeight}% / 100%
            </span>
            {isBalanced ? (
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0">
                Cân bằng
              </Badge>
            ) : (
              <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] px-2 py-0 animate-pulse">
                {totalWeight > 100 ? `Thừa ${totalWeight - 100}%` : `Thiếu ${100 - totalWeight}%`}
              </Badge>
            )}
          </div>
        </div>

        <DialogFooter className="pt-2 gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Hủy
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !isBalanced}
            className="bg-primary text-primary-foreground font-semibold gap-1.5"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Check className="size-4" />
                <span>Lưu cấu hình</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
