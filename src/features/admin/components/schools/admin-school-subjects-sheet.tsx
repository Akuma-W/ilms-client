'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { BookOpen, ExternalLink, GraduationCap } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminSchool, AdminSubject } from '@/types/admin';
import { adminSchoolService } from '../../services/admin-schools.service';

interface AdminSchoolSubjectsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  school: AdminSchool | null;
}

export function AdminSchoolSubjectsSheet({
  open,
  onOpenChange,
  school,
}: AdminSchoolSubjectsSheetProps) {
  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSubjects = useCallback(async () => {
    if (!school) return;
    setLoading(true);
    try {
      const data = await adminSchoolService.getSchoolSubjects(school.id);
      setSubjects(data);
    } finally {
      setLoading(false);
    }
  }, [school]);

  useEffect(() => {
    if (open && school) {
      fetchSubjects();
    }
  }, [open, school, fetchSubjects]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-6 flex flex-col">
        <SheetHeader className="pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs">
            <GraduationCap className="size-4" />
            <span>{school?.shortname}</span>
          </div>
          <SheetTitle className="text-lg font-bold text-slate-900 dark:text-white">
            Danh mục Môn học
          </SheetTitle>
          <SheetDescription className="text-xs text-slate-500">
            Các môn học được đào tạo tại trường {school?.name}
          </SheetDescription>
        </SheetHeader>

        {/* Subjects List Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : subjects.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              Chưa có môn học nào được đăng ký cho trường này
            </div>
          ) : (
            subjects.map((sub) => (
              <div
                key={sub.id}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:border-blue-500/40 transition-colors flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-[10px] py-0 px-1.5 font-mono font-semibold"
                    >
                      {sub.code}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {sub.name}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/admin/classes?schoolId=${school?.id}&subjectId=${sub.id}`}
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400 transition-colors"
                  title="Xem các lớp học mở môn này"
                >
                  <BookOpen className="size-3.5" />
                  <span>Xem lớp</span>
                  <ExternalLink className="size-3" />
                </Link>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
