'use client';

import { motion } from 'motion/react';
import { Calendar, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Class } from '@/types/class';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getGradientFromTitle } from '@/lib/ui/utils';

interface ClassHeroProps {
  classData: Class;
}

export function ClassHero({ classData }: ClassHeroProps) {
  const router = useRouter();
  const gradient = getGradientFromTitle(classData.title);

  return (
    <div className="relative overflow-hidden bg-background border-b">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 ${gradient} bg-linear-to-br opacity-50`} />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-8 py-10 md:py-14">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.replace('/classes')}
            className="cursor-pointer gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden md:inline">Quay lại</span>
          </Button>
        </div>

        {/* Main content */}
        <div className="flex flex-col justify-between gap-6">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Badge
              variant="secondary"
              className={`font-semibold py-1 ${gradient} text-white bg-linear-to-b`}
            >
              {classData.subject}
            </Badge>

            <span className="text-foreground text-xs font-medium tracking-widest uppercase">
              {classData.courseCode}
            </span>
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 text-wrap"
          >
            {classData.title}
          </motion.h1>

          {/* Info row */}
          <div className="flex flex-wrap items-center gap-6 text-sm">
            {/* Teacher */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 text-[10px]">
                {classData.teacher.fullName.charAt(0)}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{classData.teacher.fullName}</span>
              </div>
              <Badge
                variant="outline"
                className="bg-red-500 text-slate-50 border-gray-200 text-[9px] px-1.5 uppercase tracking-widest"
              >
                Giảng viên
              </Badge>
            </div>

            {/* Semester */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-bold text-gray-600">{classData.semester}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none" />
    </div>
  );
}
