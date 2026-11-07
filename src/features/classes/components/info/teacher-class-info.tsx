'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Calendar,
  Globe,
  GraduationCap,
  Info,
  LogOut,
  Pencil,
  Trash2,
  User2,
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDeleteModal } from '@/components/common/confirm-delete-modal';
import { InfoItem } from '@/features/classes/components/items/info-item';
import { EditClassModal } from '../modals/edit-class-modal';
import { getClassTheme, getSubjectTheme } from '@/lib/ui/utils';
import type { Class } from '@/types/class';
import type { User } from '@/types/user';

interface TeacherClassInfoProps {
  classData: Class;
  userData: User;
  onClassUpdated?: (updated: Class) => void;
}

/**
 * Info page view for class teachers.
 * Displays class details, teacher profile, and management controls (Edit, Delete, Conditional Leave).
 */
export function TeacherClassInfo({ classData, userData, onClassUpdated }: TeacherClassInfoProps) {
  const router = useRouter();
  const [currentClass, setCurrentClass] = useState<Class>(classData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const classTheme = getClassTheme(currentClass);
  const subjectTheme = getSubjectTheme(currentClass?.subject);
  const studentCount = (currentClass as unknown as { totalStudents?: number }).totalStudents ?? 12;

  const handleClassUpdated = (updated: Class) => {
    setCurrentClass(updated);
    onClassUpdated?.(updated);
  };

  const handleDeleteClass = async () => {
    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success('Lớp học đã được xóa vĩnh viễn thành công.');
      setIsDeleteModalOpen(false);
      router.push('/classes?tab=created');
    } catch {
      toast.error('Xóa lớp học thất bại. Vui lòng thử lại sau.');
      setIsDeleting(false);
    }
  };

  const handleTeacherLeave = () => {
    // Safety requirement: Teacher can only leave if class has 0 students and has replacement
    if (studentCount > 0) {
      toast.error('Không thể rời lớp học!', {
        description: `Lớp học hiện vẫn còn ${studentCount} học sinh. Giảng viên chỉ có thể rời lớp khi lớp không còn học sinh và đã bàn giao cho giảng viên thay thế, hoặc thực hiện Xóa lớp học.`,
      });
      return;
    }

    toast.info('Yêu cầu chuyển giao quyền giảng viên đang được xử lý.');
  };

  const classInfoItems = [
    {
      icon: Calendar,
      label: 'Học kỳ & Năm học',
      value: currentClass.semester,
      subtleBg: classTheme.subtleBg,
      iconClass: classTheme.icon,
    },
    {
      icon: BookOpen,
      label: 'Mã lớp học',
      value: currentClass.courseCode,
      subtleBg: classTheme.subtleBg,
      iconClass: classTheme.icon,
    },
    {
      icon: GraduationCap,
      label: 'Môn học',
      value: currentClass.subject,
      subtleBg: subjectTheme.subtleBg,
      iconClass: subjectTheme.icon,
    },
    {
      icon: Globe,
      label: 'Chế độ lớp học',
      value: currentClass.isPrivate ? 'Riêng tư' : 'Công khai',
      subtleBg: classTheme.subtleBg,
      iconClass: classTheme.icon,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Teacher Management Control Center */}
      <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="space-y-0.5 text-center sm:text-left">
          <h3 className="font-bold text-foreground">Bảng quản trị lớp học</h3>
          <p className="text-sm text-muted-foreground">
            Bạn đang quản lý lớp với vai trò{' '}
            <strong className="text-foreground font-semibold">Giảng viên phụ trách</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-9 px-4 text-sm rounded-xl gap-1.5 shadow-xs"
          >
            <Pencil className="size-3.5" />
            <span>Sửa thông tin lớp</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleTeacherLeave}
            className="border-border text-foreground hover:bg-muted text-sm font-semibold h-9 px-3 rounded-xl gap-1.5"
          >
            <LogOut className="size-3.5" />
            <span>Rời lớp</span>
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={() => setIsDeleteModalOpen(true)}
            className="font-semibold h-9 px-3 text-sm rounded-xl gap-1.5 shadow-xs"
          >
            <Trash2 className="size-3.5" />
            <span>Xóa lớp</span>
          </Button>
        </div>
      </div>

      {/* 2. Teacher Profile Card */}
      <Card className="rounded-2xl border border-border shadow-xs overflow-hidden pt-0">
        <CardHeader className="bg-slate-100 dark:bg-slate-800/80 border-b border-border/80 px-5 h-14">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2 py-4">
            <User2 className="size-4 text-primary" />
            <span>Thông tin bản thân tại lớp</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-bold border border-primary/20 shrink-0 overflow-hidden">
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
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">{userData.fullName}</h3>
                <p className="text-xs text-muted-foreground">{userData.email}</p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-semibold">
                  Vai trò: Giảng viên chủ nhiệm
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground font-medium">
                  Mã lớp: <strong>{currentClass.courseCode}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-muted text-muted-foreground">
                  Sĩ số: {studentCount} sinh viên
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Class Overview Details Card */}
      <Card className="rounded-2xl border border-border shadow-xs overflow-hidden pt-0">
        <CardHeader className="bg-slate-100 dark:bg-slate-800/80 border-b border-border/80 px-5 h-14">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2 py-4">
            <Info className="size-4 text-primary" />
            <span>Thông tin chi tiết môn học</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {currentClass.description && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Mô tả môn học
              </h4>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {currentClass.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
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

      {/* Edit Class Modal */}
      <EditClassModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        classData={currentClass}
        onSuccess={handleClassUpdated}
      />

      {/* Delete Class Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Xác nhận xóa lớp học vĩnh viễn"
        description={`Hành động này không thể hoàn tác. Toàn bộ dữ liệu bài giảng, tài liệu, bài tập và bảng điểm của lớp "${currentClass.title}" sẽ bị xóa vĩnh viễn.`}
        itemTypeLabel="lớp học"
        itemName={currentClass.title}
        isDeleting={isDeleting}
        onConfirm={handleDeleteClass}
      />
    </div>
  );
}
