'use client';

import { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  Globe,
  GraduationCap,
  Info,
  LogIn,
  User2,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoItem } from '@/features/classes/components/items/info-item';
import { JoinClassModal } from '../modals/join-class-modal';
import { getClassTheme, getSubjectTheme } from '@/lib/ui/utils';
import { EnrollmentStatus } from '@/types/enum';
import type { Class } from '@/types/class';
import type { Enrollment } from '@/types/enrollment';

interface GuestClassInfoProps {
  classData: Class;
  relation?: Enrollment | null;
}

/**
 * Info page view for guests/non-enrolled students.
 * Provides class overview and enrollment request CTA or status feedback.
 */
export function GuestClassInfo({ classData, relation }: GuestClassInfoProps) {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [requestStatus, setRequestStatus] = useState<EnrollmentStatus | 'none'>(
    relation?.status || 'none',
  );

  const classTheme = getClassTheme(classData);
  const subjectTheme = getSubjectTheme(classData?.subject);

  const classInfoItems = [
    {
      icon: Calendar,
      label: 'Học kỳ & Năm học',
      value: classData.semester,
      subtleBg: classTheme.subtleBg,
      iconClass: classTheme.icon,
    },
    {
      icon: BookOpen,
      label: 'Mã lớp học',
      value: classData.courseCode,
      subtleBg: classTheme.subtleBg,
      iconClass: classTheme.icon,
    },
    {
      icon: GraduationCap,
      label: 'Môn học',
      value: classData.subject,
      subtleBg: subjectTheme.subtleBg,
      iconClass: subjectTheme.icon,
    },
    {
      icon: Globe,
      label: 'Chế độ lớp học',
      value: classData.isPrivate ? 'Riêng tư' : 'Công khai',
      subtleBg: classTheme.subtleBg,
      iconClass: classTheme.icon,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Action Banner / Status Callout */}
      {requestStatus === EnrollmentStatus.pending ? (
        <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="size-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Clock className="size-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">
                  Yêu cầu tham gia đang được phê duyệt
                </h3>
                <Badge
                  variant="outline"
                  className="border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10 text-xs font-semibold"
                >
                  Chờ duyệt
                </Badge>
              </div>
              <p className="text-sm text-foreground/90 font-medium">
                Yêu cầu tham gia lớp học của bạn đã được gửi tới giảng viên.
              </p>
              <p className="text-xs text-muted-foreground">
                Vui lòng chờ giảng viên phê duyệt để truy cập toàn bộ tài liệu và bài tập.
              </p>
            </div>
          </div>
        </div>
      ) : requestStatus === EnrollmentStatus.rejected ? (
        <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="size-10 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
              <XCircle className="size-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">
                  Yêu cầu tham gia đã bị từ chối
                </h3>
                <Badge
                  variant="outline"
                  className="border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-500/10 text-xs font-semibold"
                >
                  Bị từ chối
                </Badge>
              </div>
              <p className="text-sm text-foreground/90 font-medium">
                Yêu cầu gia nhập lớp học của bạn chưa được chấp thuận.
              </p>
              <p className="text-xs text-muted-foreground">
                Bạn có thể gửi lại yêu cầu mới nếu có sự nhầm lẫn.
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => setIsJoinModalOpen(true)}
            variant="outline"
            className="border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 font-semibold px-4 h-10 rounded-xl shadow-xs gap-2 shrink-0"
          >
            <LogIn className="size-4" />
            <span>Gửi lại yêu cầu</span>
          </Button>
        </div>
      ) : (
        <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-foreground">Bạn chưa tham gia lớp học này</h3>
            <p className="text-sm text-muted-foreground max-w-xl">
              Hãy gửi yêu cầu tham gia để được giảng viên xét duyệt, truy cập toàn bộ bài giảng, tài
              liệu, nộp bài tập và tham gia kiểm tra trực tuyến.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setIsJoinModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 h-11 rounded-xl shadow-xs gap-2 shrink-0"
          >
            <LogIn className="size-4" />
            <span>Yêu cầu tham gia lớp</span>
          </Button>
        </div>
      )}

      {/* 2. Class Overview Card */}
      <Card className="rounded-2xl border border-border/80 bg-card/90 shadow-xs overflow-hidden">
        <CardHeader className="bg-slate-100 dark:bg-slate-800/80 border-b border-border/80 px-5 py-4">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Info className="size-4 text-primary" />
            <span>Thông tin chi tiết môn học</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 sm:p-6 space-y-5">
          {classData.description && (
            <div className="space-y-1.5 p-4 rounded-xl bg-muted/30 border border-border/60">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Mô tả môn học
              </h4>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {classData.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* Teacher In Charge */}
            <div className="flex items-center gap-3.5 p-3 sm:p-3.5 rounded-xl bg-card border border-border/80 shadow-2xs">
              <div className="relative size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary overflow-hidden shrink-0 border border-primary/20">
                {classData.teacher?.avatar ? (
                  <Image
                    src={classData.teacher.avatar}
                    alt={classData.teacher.fullName}
                    fill
                    sizes="40px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User2 className="size-5" />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
                  GIẢNG VIÊN PHỤ TRÁCH
                </span>
                <span className="text-sm sm:text-base font-bold text-foreground truncate">
                  {classData.teacher?.fullName || 'Chưa cập nhật'}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {classData.teacher?.email}
                </span>
              </div>
            </div>

            {classInfoItems.map((item, index) => (
              <InfoItem
                key={index}
                icon={item.icon}
                label={item.label}
                value={item.value}
                subtleBg={item.subtleBg}
                iconClass={item.iconClass}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Join Request Modal */}
      <JoinClassModal
        isOpen={isJoinModalOpen}
        onOpenChange={setIsJoinModalOpen}
        classData={classData}
        onSuccess={() => setRequestStatus(EnrollmentStatus.pending)}
      />
    </div>
  );
}
