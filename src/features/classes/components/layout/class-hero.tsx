'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowLeft, Video, ExternalLink, Copy, Check, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Class } from '@/types/class';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { enrollmentService } from '@/features/classes/services/enrollment.service';
import { getClassTheme, getSubjectTheme } from '@/lib/ui/utils';
import { cn } from '@/lib/utils';

interface ClassHeroProps {
  classData: Class;
}

/**
 * Seamless Classroom Hero banner without rounded corners,
 * integrating Google Meet direct connection, Star/Favorite toggle, and course code copy.
 */
export function ClassHero({ classData }: ClassHeroProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isStarred, setIsStarred] = useState(classData.enrollment?.isStarred ?? false);

  const classTheme = getClassTheme(classData);
  const subjectTheme = getSubjectTheme(classData.subject);

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!classData.courseCode) return;
    try {
      await navigator.clipboard.writeText(classData.courseCode);
      setCopied(true);
      toast.success('Đã sao chép mã lớp vào bộ nhớ tạm!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Không thể sao chép mã lớp.');
    }
  };

  const handleToggleStar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStarred = !isStarred;
    setIsStarred(nextStarred);

    if (nextStarred) {
      toast.success('Đã thêm lớp vào danh sách yêu thích!');
    } else {
      toast.info('Đã bỏ lưu lớp khỏi danh sách yêu thích.');
    }

    if (classData.enrollment?.id) {
      try {
        await enrollmentService.toggleStar(classData.enrollment.id);
      } catch {
        setIsStarred(!nextStarred);
        toast.error('Không thể cập nhật trạng thái lưu lớp.');
      }
    }
  };

  return (
    <div className="relative overflow-hidden bg-background border-b border-border/60 w-full">
      {/* Background Accent Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className={cn(
            'absolute inset-0 opacity-25 dark:opacity-15 bg-linear-to-br',
            classTheme.gradient,
          )}
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-7 relative z-10 space-y-4">
        {/* Top bar: Back Navigation & Actions (Star + Google Meet) */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.replace('/classes')}
            className="gap-1.5 text-sm text-muted-foreground hover:text-foreground h-8.5 px-3"
          >
            <ArrowLeft className="size-4" />
            <span>Quay lại danh sách</span>
          </Button>

          <div className="flex items-center gap-2 shrink-0">
            {/* Star / Favorite Class Action Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleStar}
                  className={cn(
                    'size-9 rounded-lg transition-all bg-background/60',
                    isStarred
                      ? 'border-amber-500/50 text-amber-500 hover:bg-amber-500/20'
                      : 'border-border/80 text-muted-foreground hover:text-amber-500 hover:border-amber-500/40',
                  )}
                >
                  <Star
                    className={cn(
                      'size-4.5 transition-transform active:scale-90',
                      isStarred && 'fill-amber-400 text-amber-400',
                    )}
                  />
                  <span className="sr-only">
                    {isStarred ? 'Bỏ lưu lớp học' : 'Lưu vào danh sách lớp yêu thích'}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {isStarred ? 'Đã lưu vào danh sách yêu thích' : 'Lưu lớp vào mục yêu thích'}
              </TooltipContent>
            </Tooltip>

            {/* Google Meet Connection */}
            {classData.meetingUri && (
              <Button
                asChild
                size="sm"
                variant="outline"
                className={cn(
                  'group rounded-lg text-sm h-9 px-3.5 font-medium shadow-xs shrink-0 transition-all border',
                  'bg-background/60 dark:bg-card/90 hover:bg-background/90 dark:hover:bg-card',
                  'border-border/80',
                  classTheme.border,
                )}
              >
                <a href={classData.meetingUri} target="_blank" rel="noopener noreferrer">
                  <Video
                    className={cn(
                      'size-4 mr-2 transition-transform group-hover:scale-110',
                      classTheme.icon,
                    )}
                  />
                  <span
                    className={cn(
                      'text-foreground transition-colors font-medium',
                      classTheme.hoverText,
                    )}
                  >
                    Phòng học Google Meet
                  </span>
                  <ExternalLink
                    className={cn(
                      'size-3.5 ml-1.5 opacity-60 group-hover:opacity-100 transition-all',
                      classTheme.hoverText,
                    )}
                  />
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-3">
          {/* Metadata Badges & Course Code */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Subject badge with vivid gradient */}
            {classData.subject && (
              <span
                className={cn(
                  'inline-flex items-center font-semibold py-1 px-3 text-sm text-white rounded-md shadow-xs bg-linear-to-r',
                  subjectTheme.gradient,
                )}
              >
                {classData.subject}
              </span>
            )}

            {classData.courseCode && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className={cn(
                      'group inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-mono transition-all border cursor-pointer',
                      copied
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'bg-muted/60 hover:bg-muted/90 border-border/70 hover:border-cyan-500/50 text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <span>{classData.courseCode}</span>
                    {copied ? (
                      <Check className="size-3.5 text-emerald-500 animate-in zoom-in-50" />
                    ) : (
                      <Copy className="size-3.5 text-muted-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {copied ? 'Đã sao chép mã lớp!' : 'Nhấp để sao chép mã lớp'}
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Course Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
          >
            {classData.title}
          </motion.h1>

          {/* Info Details Row */}
          <div className="flex flex-wrap items-center gap-5 sm:gap-7 text-sm text-muted-foreground pt-1">
            {/* Teacher Details */}
            {classData.teacher && (
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                  {classData.teacher.fullName?.charAt(0) || 'G'}
                </div>
                <span className="font-semibold text-foreground">{classData.teacher.fullName}</span>
                <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400 font-medium">
                  Giảng viên
                </span>
              </div>
            )}

            {/* Semester */}
            {classData.semester && (
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="font-medium text-foreground/80">{classData.semester}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
