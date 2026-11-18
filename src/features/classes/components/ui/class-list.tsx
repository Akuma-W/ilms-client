'use client';

import { ClassTabs } from '@/types/enum';
import { Class } from '@/types/class';
import { useClasses } from '../../hooks/use-classes';
import { PaginatedResult } from '@/types/api';
import ClassListSkeleton from './class-list-skeleton';
import { ClassCard } from './class-card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen } from 'lucide-react';
import { DataPagination } from '@/components/shared/data-pagination';
import { useStarredClasses } from '../../hooks/use-starred-classes';
import { enrollmentService } from '../../services/enrollment.service';

interface ClassListProps {
  initialData: PaginatedResult<Class> | null;
  params: {
    tab: ClassTabs;
    search?: string;
    page?: number;
    limit?: number;
    subjectId?: string;
    role?: string;
  };
  onPageChange: (page: number) => void;
}

export function ClassList({ initialData, params, onPageChange }: ClassListProps) {
  const { classes, meta, isLoading, error, mutateClasses } = useClasses({
    ...params,
    initialData,
  });

  const { mutateStar } = useStarredClasses();

  const toggleStar = async (enrollmentId: string) => {
    try {
      await enrollmentService.toggleStar(enrollmentId);
      mutateStar();
      mutateClasses();
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  if (isLoading && !classes) return <ClassListSkeleton />;

  if (error) {
    console.log('SWR error: ', error);
    return (
      <Alert variant="destructive">
        <AlertDescription>Không thể tải danh sách lớp. Vui lòng thử lại.</AlertDescription>
      </Alert>
    );
  }

  if (classes.length === 0) {
    const map: Record<ClassTabs, string> = {
      discovery: 'Không tìm thấy lớp học',
      joined: 'Bạn chưa tham gia lớp nào',
      pending: 'Không có yêu cầu nào',
      created: 'Bạn chưa tạo lớp nào',
      archived: 'Không có lớp học nào được lưu trữ',
    };

    return (
      <div className="flex flex-col items-center py-20 text-muted-foreground">
        <BookOpen className="w-10 h-10 mb-3" />
        <p>{map[params.tab] || 'Không tìm thấy lớp học'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {classes.map((cls, index) => (
          <ClassCard key={cls.id} classData={cls} index={index} toggleStar={toggleStar} />
        ))}
      </div>
      {meta && (
        <DataPagination
          totalPages={meta.totalPages}
          page={meta.page}
          totalItems={meta.total}
          limit={params.limit || 12}
          itemLabel="lớp học"
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
