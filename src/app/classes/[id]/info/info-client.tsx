'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ROLE_CONFIG } from '@/config';
import { InfoItem } from '@/features/classes/components/items/info-item';
import { getClassTheme, getSubjectTheme } from '@/lib/ui/utils';
import type { Class } from '@/types/class';
import type { Enrollment } from '@/types/enrollment';
import type { User } from '@/types/user';
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Globe,
  GraduationCap,
  Info,
  LogIn,
  Trash2,
  User2,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

interface InfoClientProps {
  classData: Class | null;
  userData: User | null;
  relation: Enrollment | null;
}

export function InfoClient({ classData, userData, relation }: InfoClientProps) {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isTeacher = relation?.roleIn === 'teacher';
  const isJoined = !!relation;
  const classTheme = getClassTheme(classData);
  const subjectTheme = getSubjectTheme(classData?.subject);

  if (!classData || !userData) return null;

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

  const handleJoinClass = () => {
    toast.success('Yêu cầu tham gia lớp học đã được gửi đi! Vui lòng chờ giảng viên phê duyệt.');
    setIsJoinModalOpen(false);
  };

  const handleDeleteClass = () => {
    toast.success('Lớp học đã được xóa thành công!');
    setIsDeleteModalOpen(false);
    // router.push('/classes');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Class Details */}
      <Card className="border-gray-100 shadow-sm overflow-hidden rounded-3xl">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-6 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Thông tin lớp học
          </CardTitle>
          {/* Teacher CTA: Delete Class */}
          {isTeacher && (
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm" className="rounded-xl gap-2">
                  <Trash2 className="w-4 h-4" />
                  Xóa lớp học
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    Xác nhận xóa lớp học
                  </DialogTitle>
                  <DialogDescription>
                    Hành động này không thể hoàn tác. Toàn bộ dữ liệu bài giảng, bài tập và điểm số
                    sẽ bị xóa vĩnh viễn.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                    Hủy
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteClass}>
                    Xóa lớp học
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>

        {/* Class Description */}
        <CardContent className="p-8 space-y-8">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Mô tả tổng quan
            </h3>
            <p className="text-gray-600 leading-relaxed text-base">{classData.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-primary transition-all group">
              <div className="relative w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary overflow-hidden">
                {classData.teacher?.avatar ? (
                  <Image
                    src={classData.teacher.avatar}
                    alt={classData.teacher.fullName}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User2 className="w-6 h-6" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Giảng viên phụ trách
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {classData.teacher.fullName}
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

      {/* User Info */}
      <Card className="border-gray-100 shadow-sm overflow-hidden rounded-3xl">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-6">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <User2 className="w-5 h-5 text-primary" />
            Thông tin người dùng
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-black border-4 border-white shadow-lg">
              {userData.fullName.charAt(0)}
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-gray-900">{userData.fullName}</h3>
                <p className="text-gray-500 font-medium">
                  Vai trò:{' '}
                  <span className="text-primary font-bold">{ROLE_CONFIG[userData.role].label}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                {!isJoined && !isTeacher && (
                  <>
                    <p>Bạn chưa tham gia lớp học</p>
                    <Dialog open={isJoinModalOpen} onOpenChange={setIsJoinModalOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-galaxy text-white rounded-xl px-8 h-12 font-bold gap-2 shadow-lg shadow-blue-200">
                          <LogIn className="w-5 h-5" />
                          Tham gia lớp học
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Xác nhận tham gia lớp học</DialogTitle>
                          <DialogDescription>
                            Bạn đang yêu cầu tham gia lớp <strong>{classData.title}</strong>. Yêu
                            cầu của bạn sẽ được gửi tới giảng viên để phê duyệt.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsJoinModalOpen(false)}>
                            Hủy
                          </Button>
                          <Button className="bg-galaxy text-white" onClick={handleJoinClass}>
                            Xác nhận tham gia
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}

                {isJoined && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl border border-green-100 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Đã tham gia lớp học
                  </div>
                )}
                {/* {userData.role === 'student' && (
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/5 rounded-2xl border border-primary/10">
                    <span className="text-sm font-bold text-gray-600 uppercase tracking-widest">Điểm trung bình:</span>
                    <span className="text-2xl font-black text-primary">{userData.averageGrade}</span>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
