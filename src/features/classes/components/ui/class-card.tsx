'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Archive, Ban, BookOpen, ChevronRight, Clock, Lock, Star, Users } from 'lucide-react';
import type { Class } from '@/types/class';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { getClassTheme, getSubjectTheme } from '@/lib/ui/utils';

interface ClassCardProps {
  classData: Class;
  index: number;
  toggleStar: (enrollmentId: string) => void;
}

export function ClassCard({ classData, index, toggleStar }: ClassCardProps) {
  const classTheme = getClassTheme(classData);
  const subjectTheme = getSubjectTheme(classData.subject);

  let ctaText = 'Tham gia';
  let ctaVariant: 'default' | 'outline' | 'secondary' | 'destructive' = 'outline';
  let isCtaDisabled = false;

  if (classData.isArchived && classData.enrollment?.status !== 'approved') {
    ctaText = 'Đã lưu trữ';
    ctaVariant = 'outline';
    isCtaDisabled = true;
  } else if (classData.enrollment?.status === 'suspended') {
    ctaText = 'Bị cấm';
    ctaVariant = 'destructive';
    isCtaDisabled = true;
  } else if (classData.enrollment?.status === 'pending') {
    ctaText = 'Chờ duyệt';
    ctaVariant = 'secondary';
  } else if (classData.enrollment?.status === 'approved') {
    ctaText = 'Vào học';
    ctaVariant = 'default';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group relative border border-gray-200 rounded-3xl overflow-hidden flex flex-col h-full transition-all hover:shadow-lg"
    >
      {/* Card Header / Banner */}
      <div className={cn('h-28 relative overflow-hidden bg-linear-to-br', classTheme.gradient)}>
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />

        {/* Badges on Top Left */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 flex-wrap">
          {classData.isPrivate && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-[10px] font-semibold text-white border border-white/20 shadow-2xs">
              <Lock className="w-3 h-3" />
              <span>Riêng tư</span>
            </span>
          )}
          {classData.isArchived && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-600/80 backdrop-blur-md text-[10px] font-semibold text-white border border-white/20 shadow-2xs">
              <Archive className="w-3 h-3" />
              <span>Lưu trữ</span>
            </span>
          )}
        </div>

        {/* Starred */}
        <div className="absolute top-4 right-4 z-10">
          {classData.enrollment?.status === 'approved' && (
            <Button
              variant="ghost"
              size="icon"
              className="size-7 rounded-lg bg-white/80 hover:bg-white/80 text-gray-900 shadow-sm"
              onClick={() => toggleStar(classData.enrollment!.id)}
            >
              <Star
                className={cn(
                  'w-4 h-4',
                  classData.enrollment?.isStarred && 'fill-yellow-400 text-yellow-400',
                )}
              />
            </Button>
          )}
        </div>

        {/* Title */}
        <div className="absolute bottom-4 left-6 z-10">
          {(classData.subjectRef || classData.subject) && (
            <span
              className={cn(
                'inline-flex items-center font-semibold py-1 px-2.5 text-xs text-white rounded-md shadow-xs mb-2 bg-white/40 truncate max-w-50 line-clamp-2',
                subjectTheme.text,
              )}
            >
              {classData.subjectRef
                ? `[${classData.subjectRef.code}] ${classData.subjectRef.name}`
                : classData.subject}
            </span>
          )}
          <h3 className="text-lg font-bold text-white truncate max-w-55 line-clamp-2">
            {classData.title}
          </h3>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col space-y-2">
        <div className="flex items-center justify-between text-gray-500 text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{classData.courseCode}</span>
          </div>

          {classData.semester && (
            <div className="flex items-center gap-2">
              <span>{classData.semester}</span>
            </div>
          )}
        </div>

        {classData.description && (
          <p className="text-xs text-gray-500 line-clamp-2 min-h-8">
            {classData.description.length > 100
              ? `${classData.description.substring(0, 100)}...`
              : classData.description}
          </p>
        )}

        <div className="flex items-center gap-3">
          <Avatar className="size-8 rounded-xl bg-gray-50 text-gray-900 font-bold border border-gray-200 overflow-hidden shrink-0">
            <AvatarImage
              src={classData.teacher.avatar || undefined}
              alt={classData.teacher.fullName}
              className="object-cover size-full rounded-xl"
            />
            <AvatarFallback className="rounded-xl text-xs font-semibold text-gray-700">
              {classData.teacher.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-900">{classData.teacher.fullName}</span>
            <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">
              Giảng viên
            </span>
          </div>
          {classData.totalStudents !== undefined && (
            <div
              className={cn(
                'ml-auto flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border',
                classData.maxStudents && classData.totalStudents >= classData.maxStudents
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200',
              )}
            >
              <Users className="w-3.5 h-3.5" />
              <span>
                {classData.totalStudents}
                {classData.maxStudents ? `/${classData.maxStudents}` : ''}
              </span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="pt-4 mt-auto flex items-center justify-between">
          {isCtaDisabled ? (
            <Button
              variant={ctaVariant}
              disabled
              className={cn(
                'w-full font-bold rounded-xl px-6 h-10 shadow-xs cursor-not-allowed opacity-60',
                ctaVariant === 'destructive' &&
                  'bg-destructive/10 text-destructive border border-destructive/20',
              )}
            >
              {classData.enrollment?.status === 'suspended' && (
                <Ban className="w-4 h-4 mr-1 text-red-600" />
              )}
              <span>{ctaText}</span>
            </Button>
          ) : (
            <Link href={`/classes/${classData.id}`} className="w-full">
              <Button
                variant={ctaVariant}
                className={cn(
                  'w-full font-bold rounded-xl px-6 h-10 group/btn shadow-xs',
                  ctaVariant === 'default' && 'bg-primary hover:bg-primary/90 text-white',
                  ctaVariant === 'secondary' &&
                    'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20',
                )}
              >
                {classData.enrollment?.status === 'pending' && (
                  <Clock className="w-4 h-4 mr-1 text-amber-600" />
                )}
                <span>{ctaText}</span>
                {classData.enrollment?.status !== 'pending' && (
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform ml-1" />
                )}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-0 bg-linear-to-br from-white/0 to-black/5" />
      </div>
    </motion.div>
  );
}
