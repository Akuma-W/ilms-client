'use client';

import React from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  itemName?: string;
  itemTypeLabel?: string;
  isDeleting?: boolean;
  onConfirm: () => void | Promise<void>;
}

/**
 * Universal delete confirmation modal built on Radix/Shadcn AlertDialog.
 * Features destructive alert styling, item preview badge, and real-time loading spinner.
 */
export function ConfirmDeleteModal({
  isOpen,
  onOpenChange,
  title = 'Xác nhận xóa',
  description,
  itemName,
  itemTypeLabel = 'mục này',
  isDeleting = false,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const defaultDescription = `Bạn có chắc chắn muốn xóa ${itemTypeLabel}? Hành động này không thể hoàn tác và dữ liệu sẽ bị xóa vĩnh viễn khỏi hệ thống.`;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !isDeleting && onOpenChange(open)}>
      <AlertDialogContent className="sm:max-w-md rounded-xl border border-border/80 bg-card text-card-foreground shadow-2xl p-6">
        <AlertDialogHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-3 space-y-0">
          <div className="flex items-center justify-center size-10 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 shrink-0">
            <Trash2 className="size-5" />
          </div>
          <div>
            <AlertDialogTitle className="text-base font-semibold text-foreground">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground mt-0.5">
              {description || defaultDescription}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {itemName && (
          <div className="my-2 p-3 rounded-lg bg-muted/60 border border-border/60 text-sm">
            <span className="text-xs text-muted-foreground block mb-0.5">Đối tượng sẽ bị xóa:</span>
            <span className="font-semibold text-foreground break-words line-clamp-2">
              {itemName}
            </span>
          </div>
        )}

        <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
          <AlertDialogCancel disabled={isDeleting} className="rounded-lg h-9 text-sm">
            Hủy bỏ
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={async (e) => {
              e.preventDefault();
              await onConfirm();
            }}
            className="rounded-lg h-9 text-sm font-medium gap-1.5 bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Đang xóa...</span>
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                <span>Xóa vĩnh viễn</span>
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
