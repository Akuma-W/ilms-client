'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import {
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Dialog,
} from '../../../../components/ui/dialog';
import { Input } from '../../../../components/ui/input';
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from '../../../../components/ui/select';
import { Textarea } from '../../../../components/ui/textarea';
import { Class } from '@/types/class';
import { Label } from '../../../../components/ui/label';

interface CreateClassModalProps {
  onCreateClass?: (data: Class) => void;
}

export const CreateClassModal: React.FC<CreateClassModalProps> = ({ onCreateClass }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCreate = () => {
    // Logic for creating class would go here
    // if (onCreateClass) onCreateClass({});
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-galaxy hover:opacity-90 text-white h-11 px-6 shadow-lg shadow-blue-500/20">
          <Plus className="w-4 h-4 mr-2" />
          Tạo lớp mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-galaxy-blue">Tạo lớp học mới</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="font-bold">
              Tiêu đề lớp học <span className="text-red-500">*</span>
            </Label>
            <Input id="title" placeholder="VD: Lập trình Web nâng cao" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject" className="font-bold">
              Môn học <span className="text-red-500">*</span>
            </Label>
            <Input id="subject" placeholder="VD: Công nghệ thông tin" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="privacy" className="font-bold">
              Chế độ hiển thị <span className="text-red-500">*</span>
            </Label>
            <Select defaultValue="public">
              <SelectTrigger>
                <SelectValue placeholder="Chọn chế độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Công khai</SelectItem>
                <SelectItem value="private">Riêng tư</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="font-bold">
              Mô tả (Tùy chọn)
            </Label>
            <Textarea id="description" placeholder="Mô tả ngắn gọn về lớp học..." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="semester" className="font-bold">
              Học kỳ (Tùy chọn)
            </Label>
            <Input id="semester" placeholder="VD: Học kỳ 2 - 2024" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button className="bg-galaxy text-white" onClick={handleCreate}>
            Tạo lớp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
