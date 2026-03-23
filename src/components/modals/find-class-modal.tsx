'use client';

import { Class, ClassClient } from '@/types/class.type';
import { Search, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { DialogTrigger, DialogContent, DialogHeader, DialogTitle, Dialog } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface FindClassModalProps {
  onJoinClass: (classItem: Class) => void;
  classes: ClassClient[];
}

export const FindClassModal: React.FC<FindClassModalProps> = ({
  onJoinClass,
  classes: mockClasses,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [courseCodeInput, setCourseCodeInput] = useState('');
  const [findResult, setFindResult] = useState<ClassClient | null>(null);
  const [findError, setFindError] = useState('');

  const handleFindClass = () => {
    const code = courseCodeInput.trim().toUpperCase();
    if (code.length !== 6) {
      setFindError('Mã lớp phải gồm 6 ký tự.');
      setFindResult(null);
      return;
    }

    const found = mockClasses.find((c) => c.courseCode === code);
    if (found) {
      setFindResult(found);
      setFindError('');
    } else {
      setFindError('Không tìm thấy lớp học với mã này.');
      setFindResult(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-11 px-6 border-galaxy-blue text-galaxy-blue hover:bg-galaxy-blue/5"
        >
          <Search className="w-4 h-4 mr-2" />
          Tìm lớp học
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-galaxy-blue">
            Tìm lớp học theo mã
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="courseCode" className="font-bold">
              Nhập mã lớp (6 ký tự, viết hoa)
            </Label>
            <div className="flex gap-2">
              <Input
                id="courseCode"
                placeholder="VD: IT4440"
                value={courseCodeInput}
                onChange={(e) => setCourseCodeInput(e.target.value.toUpperCase())}
                maxLength={6}
              />
              <Button onClick={handleFindClass} className="bg-galaxy text-white">
                Tìm kiếm
              </Button>
            </div>
            {findError && <p className="text-sm text-red-500 mt-1">{findError}</p>}
          </div>

          {findResult && (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900">{findResult.title}</h4>
                  <p className="text-xs text-gray-500">
                    {findResult.subject} • {findResult.courseCode}
                  </p>
                </div>
                {/* <Star className={cn("w-4 h-4", findResult.isStarred ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} /> */}
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{findResult.description}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <User className="w-3.5 h-3.5" />
                <span>{findResult.teacherName}</span>
              </div>
              <Button
                className="w-full bg-galaxy text-white mt-2"
                onClick={() => {
                  onJoinClass(findResult);
                  setIsOpen(false);
                }}
              >
                Tham gia lớp học
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
