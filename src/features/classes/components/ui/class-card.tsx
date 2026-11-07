'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { BookOpen, ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';
import type { Class } from '@/types/class';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getClassTheme, getSubjectTheme } from '@/lib/ui/utils';

interface ClassCardProps {
  classData: Class;
  index: number;
  toggleStar: (enrollmentId: string) => void;
}

export function ClassCard({ classData, index, toggleStar }: ClassCardProps) {
  const ctaText = classData.enrollment?.status === 'approved' ? 'Vào học' : 'Tham gia';
  const classTheme = getClassTheme(classData);
  const subjectTheme = getSubjectTheme(classData.subject);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className={
        'group relative border border-gray-200 rounded-3xl overflow-hidden flex flex-col h-full transition-all hover:shadow-lg'
      }
    >
      {/* Card Header / Banner */}
      <div className={cn('h-28 relative overflow-hidden bg-linear-to-br', classTheme.gradient)}>
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />

        {/* Starred */}
        <div className="absolute top-4 right-4 z-10">
          {classData.enrollment?.status === 'approved' && (
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer size-7 rounded-lg bg-white/80 hover:bg-white/80 text-gray-900 shadow-sm"
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
          {classData.subject && (
            <span
              className={cn(
                'inline-flex items-center font-semibold py-1 px-2.5 text-xs text-white rounded-md shadow-xs mb-2 bg-white/40 truncate max-w-50 line-clamp-2',
                subjectTheme.text,
              )}
            >
              {classData.subject}
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
          <div className="relative w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-900 font-bold border border-gray-200 overflow-hidden">
            {classData.teacher.avatar ? (
              <Image
                src={classData.teacher.avatar}
                alt={classData.teacher.fullName}
                fill
                sizes="32px"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-700">
                {classData.teacher.fullName.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-900">{classData.teacher.fullName}</span>
            <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">
              Giảng viên
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4 mt-auto flex items-center justify-between">
          <Link href={`/classes/${classData.id}`} className="w-full">
            <Button className="cursor-pointer w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-6 h-10 group/btn">
              {ctaText}
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-0 bg-linear-to-br from-white/0 to-black/5" />
      </div>
    </motion.div>
  );
}
