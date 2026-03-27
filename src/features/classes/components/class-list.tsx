'use client';

import { useClasses } from "../hooks/use-classes";
import { ClassSearch } from "./class-search";
import { ClassSkeleton } from "./modals/class-skeleton";
import { ClassCard } from "./class-card";
import { ClassPagination } from "./class-pagination";

interface ClassListProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
  };
}

export function ClassList({ searchParams }: ClassListProps) {
  const page = parseInt(searchParams.page || '1', 10);
  const limit = parseInt(searchParams.limit || '9', 10);
  const search = searchParams.search || '';

  const { classes, meta, isLoading } = useClasses({ page, limit, search });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Lớp học của tôi</h2>
          <p className="text-gray-500 font-medium">Quản lý và tham gia các khóa học trực tuyến</p>
        </div>
        {/* Search bar for class */}
        <ClassSearch />
      </div>

      {/* Loading */}
      {isLoading ? (
        <ClassSkeleton />
      ) : classes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((c) => (
              <ClassCard key={c.id} classData={c} />
            ))}
          </div>
          
          {meta && (
            <ClassPagination total={meta?.total} page={meta?.page} limit={meta?.limit} />
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            Không tìm thấy lớp học nào
          </h3>
          <p className="text-gray-500">
            Thử tìm kiếm với từ khóa khác hoặc tham gia lớp học mới
          </p>
        </div>
      )}
    </div>
  );
}
