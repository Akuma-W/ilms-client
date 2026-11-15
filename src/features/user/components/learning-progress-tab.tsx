'use client';

import { useEffect, useState } from 'react';
import type { User } from '@/types/user';
import type { Class } from '@/types/class';
import { userService } from '../services/user.service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookOpen, ExternalLink, Loader2 } from 'lucide-react';
import { ProfileClassCard } from './profile-class-card';

interface LearningProgressTabProps {
  user: User;
}

export function LearningProgressTab({ user }: LearningProgressTabProps) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const isStudent = user.role === 'student';

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      try {
        const res = await userService.getProfileClasses();
        if (isMounted && res?.data) {
          const list = (Array.isArray(res.data) ? res.data : Object.values(res.data)) as Class[];
          setClasses(list);
        } else if (isMounted) {
          setClasses([]);
        }
      } catch {
        if (isMounted) setClasses([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [isStudent]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-xs">
        <Loader2 className="size-8 animate-spin text-indigo-600 mb-3" />
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          {isStudent
            ? 'Đang tổng hợp dữ liệu lớp học đã đăng ký...'
            : 'Đang tải danh sách lớp học quản lý...'}
        </p>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <Card className="p-8 sm:p-12 text-center rounded-3xl border border-slate-200/90 bg-white shadow-xs">
        <div className="size-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
          <BookOpen className="size-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          {isStudent ? 'Chưa tham gia lớp học nào' : 'Chưa có lớp học được tạo'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
          {isStudent
            ? 'Bạn chưa tham gia lớp học nào. Hãy sử dụng mã khóa học để đăng ký và bắt đầu lộ trình học tập.'
            : 'Tạo lớp học mới trên hệ thống để phân quyền tài nguyên, bài tập và chấm điểm tương tác.'}
        </p>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold">
          <Link href="/classes">
            <span>{isStudent ? 'Khám phá lớp học' : 'Tạo lớp học mới'}</span>
          </Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stat Ribbon */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            {isStudent ? 'Tiến độ học tập theo từng lớp' : 'Danh sách lớp học đang phụ trách'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isStudent
              ? `Bạn đang tham gia ${classes.length} lớp học trên hệ thống`
              : `Bạn đang quản lý ${classes.length} lớp học với vai trò giảng viên`}
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="rounded-xl border-slate-200 text-xs font-semibold gap-1.5">
          <Link href="/classes">
            <span>Xem tất cả lớp</span>
            <ExternalLink className="size-3.5" />
          </Link>
        </Button>
      </div>

      {/* Grid of Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classes.map((cls) => (
          <ProfileClassCard key={cls.id} classItem={cls} isStudent={isStudent} />
        ))}
      </div>
    </div>
  );
}
