import { Class } from '@/types/class.type';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

interface JoinConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClass: Class | null;
  onConfirm: () => void;
}

export function JoinConfirmModal({
  isOpen,
  onOpenChange,
  selectedClass,
  onConfirm,
}: JoinConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Xác nhận tham gia</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-600">
            Bạn có chắc chắn muốn gửi yêu cầu tham gia lớp học
            <span className="font-bold text-galaxy-blue">&quot;{selectedClass?.title}</span>?
          </p>
          <p className="text-xs text-gray-400 mt-4 italic">
            * Yêu cầu của bạn sẽ được gửi đến giảng viên để phê duyệt.
          </p>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button className="bg-galaxy text-white" onClick={onConfirm}>
            Xác nhận tham gia
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
