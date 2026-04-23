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
    <div className="relative h-64 flex items-end overflow-hidden bg-white border-b border-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className={`absolute inset-0 ${gradient} bg-linear-to-br`} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-8 pb-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                {classData.subject}
              </Badge>
              <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">
                {classData.courseCode}
              </span>
            </div>

            <div className="space-y-1">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 text-wrap"
              >
                {classData.title}
              </motion.h1>
              <div className="flex flex-wrap gap-6 text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 text-[10px]">
                    {classData.teacher.fullName.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {classData.teacher.fullName}
                  </span>
                  <Badge className="bg-gray-100 text-gray-500 border-gray-200 text-[9px] h-4 px-1.5 uppercase tracking-widest">
                    Giảng viên
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-bold text-gray-600">{classData.semester}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none" />
    </div>
  );
}
