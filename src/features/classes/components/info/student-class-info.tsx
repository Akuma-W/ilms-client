'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Globe,
  GraduationCap,
  HelpCircle,
  Info,
  LogOut,
  User2,
  Video,
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDeleteModal } from '@/components/common/confirm-delete-modal';
import { InfoItem } from '@/features/classes/components/items/info-item';
import { enrollmentService } from '@/features/classes/services/enrollment.service';
import {
  studentProgressService,
  type StudentClassProgress,
} from '@/features/classes/services/student-progress.service';
import { getClassTheme, getSubjectTheme } from '@/lib/ui/utils';
import type { Class } from '@/types/class';
import type { Enrollment } from '@/types/enrollment';
import type { User } from '@/types/user';

interface StudentClassInfoProps {
  classData: Class;
  userData: User;
  relation: Enrollment;
}

/**
 * Info page view for enrolled students.
 * Displays class details, student profile, learning progress stats, and leave class action.
 */
export function StudentClassInfo({ classData, userData, relation }: StudentClassInfoProps) {
  const router = useRouter();
  const [progress, setProgress] = useState<StudentClassProgress | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    studentProgressService.getStudentProgress(classData.id, userData.id).then(setProgress);
  }, [classData.id, userData.id]);

  const classTheme = getClassTheme(classData);
  const subjectTheme = getSubjectTheme(classData?.subject);

  const handleConfirmLeave = async () => {
    setIsLeaving(true);
    try {
      const res = await enrollmentService.leaveClass(classData.id);
      if (res && res.success === false) {
        throw new Error(res.message || 'Rời lớp thất bại');
      }
      toast.success('Bạn đã rời khỏi lớp học thành công.');
      setIsLeaveModalOpen(false);
      router.push('/classes?tab=joined');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Rời lớp thất bại. Vui lòng thử lại sau.',
      );
      setIsLeaving(false);
    }
  };

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
      {/* 1. Student Personal Profile & Enrollment Status */}
      <Card className="rounded-2xl border border-border shadow-xs overflow-hidden">
        <CardHeader className="bg-slate-100 dark:bg-slate-800/80 border-b border-border/80 px-5 py-4">
          <CardTitle className="text-base font-bold text-foreground flex items-center justify-between">
            <span className="flex items-center gap-2">
              <User2 className="size-4 text-primary" />
              Thông tin bản thân tại lớp
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="size-3.5" />
              Đã tham gia lớp học
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-bold border border-primary/20 shrink-0">
              {userData.avatarUrl ? (
                <Image
                  src={userData.avatarUrl}
                  alt={userData.fullName}
                  width={64}
                  height={64}
                  className="rounded-2xl object-cover size-full"
                />
              ) : (
                userData.fullName.charAt(0)
              )}
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-foreground">{userData.fullName}</h3>
                <p className="text-xs text-muted-foreground">{userData.email}</p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-muted font-medium text-foreground">
                  MSSV: <strong>22520101</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
                  Vai trò: Học sinh
                </span>
                {relation.joinedAt && (
                  <span className="px-2.5 py-1 rounded-lg bg-muted text-muted-foreground">
                    Tham gia từ: {new Date(relation.joinedAt).toLocaleDateString('vi-VN')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Student Progress Statistics Dashboard */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Tiến độ học tập cá nhân
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Average Score */}
          <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Điểm trung bình</span>
              <Award className="size-4" />
            </div>
            <p className="text-2xl font-black text-foreground">
              {progress ? progress.averageScore.toFixed(1) : '8.5'}{' '}
              <span className="text-xs font-normal text-muted-foreground">/ 10</span>
            </p>
            <p className="text-[11px] text-muted-foreground">Xếp loại tạm tính: Giỏi</p>
          </div>

          {/* Assignments Rate */}
          <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span>Bài tập về nhà</span>
              <ClipboardList className="size-4" />
            </div>
            <p className="text-2xl font-black text-foreground">
              {progress ? `${progress.assignmentRate}%` : '80%'}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Đã làm{' '}
              {progress ? `${progress.assignmentsCompleted}/${progress.totalAssignments}` : '4/5'}{' '}
              bài
            </p>
          </div>

          {/* Quizzes Rate */}
          <div className="p-4 rounded-2xl border border-purple-500/20 bg-purple-500/5 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
              <span>Trắc nghiệm</span>
              <HelpCircle className="size-4" />
            </div>
            <p className="text-2xl font-black text-foreground">
              {progress ? `${progress.quizRate}%` : '60%'}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Đã làm {progress ? `${progress.quizzesCompleted}/${progress.totalQuizzes}` : '3/5'}{' '}
              bài
            </p>
          </div>

          {/* Google Meet Attendance */}
          <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>Chuyên cần Meet</span>
              <Video className="size-4" />
            </div>
            <p className="text-2xl font-black text-foreground">
              {progress ? `${progress.meetRate}%` : '90%'}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Tham gia {progress ? `${progress.meetAttended}/${progress.totalMeetings}` : '9/10'}{' '}
              buổi
            </p>
          </div>
        </div>
      </div>

      {/* 3. Class Details Card */}
      <Card className="rounded-2xl border border-border shadow-xs overflow-hidden">
        <CardHeader className="bg-slate-100 dark:bg-slate-800/80 border-b border-border/80 px-5 py-4">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Info className="size-4 text-primary" />
            <span>Thông tin chi tiết lớp học</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {classData.description && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Mô tả môn học
              </h4>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {classData.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-card border border-border shadow-2xs">
              <div className="relative size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary overflow-hidden shrink-0">
                {classData.teacher?.avatar ? (
                  <Image
                    src={classData.teacher.avatar}
                    alt={classData.teacher.fullName}
                    fill
                    sizes="44px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User2 className="size-5" />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                  Giảng viên phụ trách
                </span>
                <span className="text-sm font-bold text-foreground truncate">
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

      {/* 4. Danger Zone: Leave Class Button */}
      <div className="p-5 rounded-2xl border border-destructive/20 bg-destructive/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <h4 className="text-sm font-bold text-foreground">Rời khỏi lớp học</h4>
          <p className="text-xs text-muted-foreground">
            Bạn sẽ không còn nhận được thông báo, nộp bài tập hay tham gia kiểm tra trong lớp học
            này.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsLeaveModalOpen(true)}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 text-xs font-semibold h-9 rounded-xl gap-2 shrink-0"
        >
          <LogOut className="size-3.5" />
          <span>Rời khỏi lớp học</span>
        </Button>
      </div>

      {/* Leave Class Confirmation Dialog */}
      <ConfirmDeleteModal
        isOpen={isLeaveModalOpen}
        onOpenChange={setIsLeaveModalOpen}
        title="Xác nhận rời lớp học"
        description={`Bạn có chắc chắn muốn rời khỏi lớp "${classData.title}"? Dữ liệu bài nộp và điểm số của bạn có thể sẽ không còn truy cập được.`}
        itemTypeLabel="lớp học"
        itemName={classData.title}
        isDeleting={isLeaving}
        onConfirm={handleConfirmLeave}
      />
    </div>
  );
}
