'use client';

import * as React from 'react';
import { AlertTriangle, Info, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export interface AdminActionReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void> | void;
  title: string;
  description?: string;
  actionLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  requireReason?: boolean;
  targetName?: string;
  placeholder?: string;
  isSubmitting?: boolean;
}

export function AdminActionReasonModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionLabel = 'Xác nhận',
  variant = 'danger',
  requireReason = false,
  targetName,
  placeholder = 'Nhập lý do thực hiện hành động này...',
  isSubmitting = false,
}: AdminActionReasonModalProps) {
  const [reason, setReason] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setReason('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requireReason && !reason.trim()) {
      setError('Vui lòng nhập lý do để tiếp tục');
      return;
    }
    setError(null);
    await onConfirm(reason.trim());
  };

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <Trash2 className="size-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="size-5 text-amber-500" />;
      default:
        return <Info className="size-5 text-blue-500" />;
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case 'danger':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                {getIcon()}
              </div>
              <div>
                <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
                {description && (
                  <DialogDescription className="text-xs">{description}</DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>

          {targetName && (
            <div className="rounded-lg border bg-muted/40 p-3 text-sm">
              <span className="text-muted-foreground">Đối tượng: </span>
              <span className="font-medium text-foreground">{targetName}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="admin-action-reason" className="text-xs font-medium">
              {requireReason ? (
                <>
                  Lý do thực hiện <span className="text-destructive">*</span>
                </>
              ) : (
                'Lý do thực hiện (tùy chọn)'
              )}
            </Label>
            <textarea
              id="admin-action-reason"
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              placeholder={placeholder}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" variant={getButtonVariant()} disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : actionLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
