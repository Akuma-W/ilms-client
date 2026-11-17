'use client';

import { useEffect, useState } from 'react';
import type { User } from '@/types/user';
import type { Class } from '@/types/class';
import { enrollmentService } from '@/features/classes/services/enrollment.service';
import { classService } from '@/features/classes/services/class.service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Archive, BookOpen, ExternalLink, Loader2 } from 'lucide-react';
import { ProfileClassCard } from './profile-class-card';
import { cn } from '@/lib/utils';

interface LearningProgressTabProps {
  user: User;
}

export function LearningProgressTab({ user }: LearningProgressTabProps) {
  const [activeClasses, setActiveClasses] = useState<Class[]>([]);
  const [archivedClasses, setArchivedClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'active' | 'archived'>('active');
  const isStudent = user.role === 'student';

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      try {
        if (isStudent) {
          const [activeRes, archivedRes] = await Promise.all([
            enrollmentService.getMyEnrollments({
              isArchived: false,
              status: 'approved',
              limit: 100,
            }),
            enrollmentService.getMyEnrollments({
              isArchived: true,
              status: 'approved',
              limit: 100,
            }),
          ]);
          if (isMounted) {
            setActiveClasses(activeRes?.data || []);
            setArchivedClasses(archivedRes?.data || []);
          }
        } else {
          const [activeCreated, activeAssistant, archivedCreated, archivedAssistant] =
            await Promise.all([
              classService.getMyCreatedClasses({ isArchived: false, limit: 100 }),
              enrollmentService.getMyEnrollments({
                isArchived: false,
                status: 'approved',
                limit: 100,
              }),
              classService.getMyCreatedClasses({ isArchived: true, limit: 100 }),
              enrollmentService.getMyEnrollments({
                isArchived: true,
                status: 'approved',
                limit: 100,
              }),
            ]);

          const mergeClasses = (created: Class[], enrolled: Class[]) => {
            const list = [...created];
            for (const item of enrolled) {
              if (!list.some((c) => c.id === item.id)) {
                list.push(item);
              }
            }
            return list;
          };

          if (isMounted) {
            setActiveClasses(mergeClasses(activeCreated?.data || [], activeAssistant?.data || []));
            setArchivedClasses(
              mergeClasses(archivedCreated?.data || [], archivedAssistant?.data || []),
            );
          }
        }
      } catch {
        if (isMounted) {
          setActiveClasses([]);
          setArchivedClasses([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [isStudent]);

  const displayedClasses = filterTab === 'active' ? activeClasses : archivedClasses;

  return (
    <div className="space-y-6">
      {/* Overview Stat & Filter Ribbon */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">
            {isStudent ? 'Tiến độ học tập theo từng lớp' : 'Danh sách lớp học đang phụ trách'}
          </h3>
          <p className="text-xs text-slate-500">
            {isStudent
              ? `Hiển thị ${displayedClasses.length} lớp học trên hệ thống`
              : `Hiển thị ${displayedClasses.length} lớp học với vai trò giảng viên`}
          </p>
        </div>

        {/* Filter Toggle Buttons & View All */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterTab('active')}
              className={cn(
                'px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5',
                filterTab === 'active'
                  ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900',
              )}
            >
              <span>{isStudent ? 'Đang học' : 'Đang phụ trách'}</span>
              <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-200/70 text-slate-700">
                {activeClasses.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('archived')}
              className={cn(
                'px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5',
                filterTab === 'archived'
                  ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900',
              )}
            >
              <Archive className="size-3.5" />
              <span>Đã lưu trữ</span>
              <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-200/70 text-slate-700">
                {archivedClasses.length}
              </span>
            </button>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-200 text-xs font-semibold gap-1.5"
          >
            <Link href="/classes">
              <span>Xem tất cả lớp</span>
              <ExternalLink className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-xs">
          <Loader2 className="size-8 animate-spin text-indigo-600 mb-3" />
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {filterTab === 'archived'
              ? 'Đang tải danh sách lớp học đã lưu trữ...'
              : 'Đang tải danh sách lớp học...'}
          </p>
        </div>
      ) : displayedClasses.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center rounded-3xl border border-slate-200/90 bg-white shadow-xs">
          <div className="size-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            {filterTab === 'archived' ? (
              <Archive className="size-7" />
            ) : (
              <BookOpen className="size-7" />
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {filterTab === 'archived'
              ? 'Chưa có lớp học nào được lưu trữ'
              : isStudent
                ? 'Chưa tham gia lớp học nào'
                : 'Chưa có lớp học được tạo'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
            {filterTab === 'archived'
              ? 'Các lớp học khi được lưu trữ sẽ xuất hiện tại đây và chuyển sang chế độ chỉ đọc.'
              : isStudent
                ? 'Bạn chưa tham gia lớp học nào. Hãy sử dụng mã khóa học để đăng ký và bắt đầu lộ trình học tập.'
                : 'Tạo lớp học mới trên hệ thống để phân quyền tài nguyên, bài tập và chấm điểm tương tác.'}
          </p>
          {filterTab !== 'archived' && (
            <Button
              asChild
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
            >
              <Link href="/classes">
                <span>{isStudent ? 'Khám phá lớp học' : 'Tạo lớp học mới'}</span>
              </Link>
            </Button>
          )}
        </Card>
      ) : (
        /* Grid of Classes */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedClasses.map((cls) => (
            <ProfileClassCard key={cls.id} classItem={cls} isStudent={isStudent} />
          ))}
        </div>
      )}
    </div>
  );
}
