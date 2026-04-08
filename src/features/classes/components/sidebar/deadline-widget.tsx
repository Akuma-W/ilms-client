'use client';

import { AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface DeadlineWidgetProps {
  classId?: string;
}

export function DeadlineWidget({ classId }: DeadlineWidgetProps) {
  const [isMounted, setIsMounted] = useState(false);
  // const { data: assignments, error, isLoading } = useSWR<Assignment[]>(
  //   `/api/assignments/upcoming?scope=${classId ? 'class' : 'global'}&classId=${classId || ''}`,
  //   fetcher
  // );

  // if (isLoading) {
  //   return (
  //     <div className="space-y-3">
  //       {[1, 2, 3].map((i) => (
  //         <Skeleton key={i} className="h-14 w-full rounded-xl bg-white/5" />
  //       ))}
  //     </div>
  //   );
  // }

  // if (error || !assignments || assignments.length === 0) {
  //   return (
  //     <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
  //       <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-600">
  //         <Calendar className="w-5 h-5" />
  //       </div>
  //       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No Deadlines</p>
  //     </div>
  //   );
  // }

  const getUrgencyColor = (dueAt: string) => {
    if (!isMounted) return 'border-white/10 bg-white/5 text-slate-400';
    const now = new Date();
    const due = new Date(dueAt);
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 3) return 'border-red-500/50 bg-red-500/10 text-red-400';
    if (diffHours < 24) return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400';
    return 'border-white/10 bg-white/5 text-slate-400';
  };

  const getUrgencyIndicator = (dueAt: string) => {
    if (!isMounted) return 'bg-slate-500';
    const now = new Date();
    const due = new Date(dueAt);
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 3) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
    if (diffHours < 24) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]';
    return 'bg-slate-500';
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {/* {assignments.map((assignment, index) => (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "group relative p-3 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer",
              getUrgencyColor(assignment.dueAt)
            )}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full overflow-hidden">
              <div className={cn("w-full h-full", getUrgencyIndicator(assignment.dueAt))} />
            </div>
            
            <div className="flex flex-col gap-1 pl-2">
              <span className="text-xs font-bold text-white truncate">{assignment.title}</span>
              <div className="flex items-center gap-2 text-[10px] font-medium opacity-70">
                <Clock className="w-3 h-3" />
                <span>
                  {isMounted 
                    ? new Date(assignment.dueAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : 'Loading time...'}
                </span>
              </div>
              {assignment.className && (
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-50">{assignment.className}</span>
              )}
            </div>
          </motion.div>
        ))} */}
      </AnimatePresence>
    </div>
  );
}
