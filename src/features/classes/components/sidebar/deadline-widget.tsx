'use client';

import { AnimatePresence } from 'motion/react';
import { Calendar } from 'lucide-react';

interface DeadlineWidgetProps {
  classId?: string;
}

export function DeadlineWidget({ classId }: DeadlineWidgetProps) {
  return (
    <div className="space-y-3" data-class-id={classId}>
      <AnimatePresence mode="popLayout">
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Chưa có hạn nộp
          </p>
        </div>
      </AnimatePresence>
    </div>
  );
}
