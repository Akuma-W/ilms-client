'use client';

import { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { GradeCategory } from '@/types/grade';

interface GradeStructureRibbonProps {
  categories: GradeCategory[];
  isArchived?: boolean;
  onOpenManagement: () => void;
}

export function GradeStructureRibbon({
  categories,
  isArchived = false,
  onOpenManagement,
}: GradeStructureRibbonProps) {
  // Default to collapsed as explicitly requested by user
  const [isExpanded, setIsExpanded] = useState(false);

  const totalWeightPercent = Math.round(
    categories.reduce((sum, c) => sum + (c.weight > 1 ? c.weight : c.weight * 100), 0),
  );
  const isComplete = totalWeightPercent === 100;

  const getSourceBadge = (cat: GradeCategory) => {
    switch (cat.sourceType) {
      case 'attendance':
        return (
          <Badge
            variant="outline"
            className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
          >
            Loại 1: Chuyên cần
          </Badge>
        );
      case 'assignment':
      case 'quiz':
        return (
          <Badge
            variant="outline"
            className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
          >
            Loại 2: Theo bài tập & quiz
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="text-[10px] bg-muted/50 text-muted-foreground border-border"
          >
            Loại 3: Nhập tay
          </Badge>
        );
    }
  };

  const getMechanismDescription = (cat: GradeCategory) => {
    if (cat.sourceType === 'attendance') {
      return 'Tự động tính từ 4 thành phần: Buổi học trực tuyến, Bài giảng, Bài tập và Quiz.';
    }
    if (cat.sourceType === 'assignment' || cat.sourceType === 'quiz') {
      const config = cat.config as { strategy?: string; items?: unknown[] } | null;
      const strategyLabel = config?.strategy === 'highest' ? 'Điểm cao nhất' : 'Trung bình cộng';
      const itemCount = config?.items?.length || 0;
      return itemCount > 0
        ? `Tự động nạp từ ${itemCount} bài tập & quiz (${strategyLabel}).`
        : `Tự động đồng bộ từ các bài tập & quiz được chọn (${strategyLabel}).`;
    }
    return 'Giảng viên trực tiếp nhập hoặc điều chỉnh điểm số.';
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xs transition-all overflow-hidden">
      {/* 1. COMPACT RIBBON HEADER (Always visible) */}
      <div className="p-3.5 sm:px-4.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 min-w-0">
          <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Layers className="size-4" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-foreground">
              Cấu trúc Điểm ({categories.length} cột):
            </span>

            <Badge
              variant="secondary"
              className={`text-[11px] font-bold px-2 py-0.5 ${
                isComplete
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
              }`}
            >
              Tổng trọng số: {totalWeightPercent}%
            </Badge>

            {/* Category summary chips */}
            <div className="hidden md:flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <span
                  key={cat.id}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-muted/50 border border-border/60 text-muted-foreground flex items-center gap-1"
                >
                  <span className="font-medium text-foreground">{cat.name}</span>
                  <span className="text-primary font-mono font-semibold">
                    {Math.round(cat.weight > 1 ? cat.weight : cat.weight * 100)}%
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isArchived && (
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenManagement}
              className="text-xs h-8 gap-1.5 border-border"
              title="Thêm hoặc chỉnh sửa các cột điểm trong lớp"
            >
              <Settings className="size-3.5 text-muted-foreground" />
              <span className="hidden sm:inline">Thiết lập Cấu trúc</span>
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-xs h-8 px-2.5 gap-1 text-muted-foreground hover:text-foreground"
            title={isExpanded ? 'Thu hẹp cấu trúc điểm' : 'Mở rộng xem chi tiết'}
          >
            <span>{isExpanded ? 'Thu gọn' : 'Xem chi tiết'}</span>
            {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          </Button>
        </div>
      </div>

      {/* 2. EXPANDED VIEW (When user clicks expand) */}
      {isExpanded && (
        <div className="p-4 pt-1 border-t border-border/60 bg-muted/20 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="p-3.5 rounded-xl border border-border/80 bg-card/80 flex flex-col justify-between gap-2.5 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-muted-foreground">
                        #{idx + 1}
                      </span>
                      <h5 className="text-xs font-bold text-foreground truncate">{cat.name}</h5>
                    </div>
                    <div>{getSourceBadge(cat)}</div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-primary">
                      {Math.round(cat.weight > 1 ? cat.weight : cat.weight * 100)}%
                    </span>
                    <span className="text-[10px] text-muted-foreground block">Trọng số</span>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground line-clamp-2 pt-1 border-t border-border/40">
                  {getMechanismDescription(cat)}
                </p>
              </div>
            ))}
          </div>

          {!isComplete && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400">
              * Lưu ý: Tổng trọng số các cột điểm hiện tại chưa đạt 100%. Vui lòng điều chỉnh lại để
              điểm tổng kết môn học tính chính xác.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
