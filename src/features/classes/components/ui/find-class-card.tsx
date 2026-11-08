import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Class } from '@/types/class';
import { ArrowRight, User, Users } from 'lucide-react';
import { getSubjectTheme } from '@/lib/ui/utils';
import { cn } from '@/lib/utils';

interface FindClassCardProps {
  classItem: Class;
  onNavigate: (id: string) => void;
}

export function FindClassCard({ classItem, onNavigate }: FindClassCardProps) {
  const subjectTheme = getSubjectTheme(classItem.subject);

  return (
    <div className="rounded-xl border bg-muted/40 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <h4 className="font-semibold text-sm leading-snug truncate">{classItem.title}</h4>
          {classItem.subject && (
            <div className="flex items-center gap-1.5 text-xs">
              <span
                className={cn(
                  'inline-flex items-center font-semibold py-0.5 px-2 text-[10px] text-white rounded shadow-xs bg-linear-to-r',
                  subjectTheme.gradient,
                )}
              >
                {classItem.subject}
              </span>
            </div>
          )}
        </div>
        <Badge variant="outline" className="shrink-0 font-mono text-xs">
          {classItem.courseCode}
        </Badge>
      </div>

      {/* Description */}
      {classItem.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{classItem.description}</p>
      )}

      {/* Teacher and Total Students */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <User className="h-3 w-3 shrink-0" />
          <span>{classItem.teacher.fullName}</span>
        </div>
        {classItem.totalStudents !== undefined && (
          <div className="flex items-center gap-1 font-medium">
            <Users className="h-3 w-3 shrink-0 text-muted-foreground" />
            <span>{classItem.totalStudents} sinh viên</span>
          </div>
        )}
      </div>

      {/* CTA — Link đến /classes/[id]/info */}
      <Button className="cursor-pointer w-full mt-1" onClick={() => onNavigate(classItem.id)}>
        Tham gia
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
