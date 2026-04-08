import { ClassTabs } from '@/types';
import { BookOpen } from 'lucide-react';

export function ClassEmpty({ tab }: { tab: ClassTabs }) {
  const map: Record<ClassTabs, string> = {
    discovery: 'Không tìm thấy lớp học',
    joined: 'Bạn chưa tham gia lớp nào',
    pending: 'Không có yêu cầu nào',
    created: 'Bạn chưa tạo lớp nào',
  };

  return (
    <div className="flex flex-col items-center py-20 text-gray-500">
      <BookOpen className="w-10 h-10 mb-3" />
      <p>{map[tab]}</p>
    </div>
  );
}
