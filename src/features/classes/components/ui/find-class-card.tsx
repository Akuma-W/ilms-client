import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Class } from '@/types/class';
import { ArrowRight, BookOpen, User } from 'lucide-react';

interface FindClassCardProps {
  classItem: Class;
  onNavigate: (id: string) => void;
}

export function FindClassCard({ classItem, onNavigate }: FindClassCardProps) {
  return (
    <div className="rounded-xl border bg-muted/40 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5 min-w-0">
          <h4 className="font-semibold text-sm leading-snug truncate">{classItem.title}</h4>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3 shrink-0" />
            <span className="truncate">{classItem.subject}</span>
          </div>
        </div>
        <Badge variant="outline" className="shrink-0 font-mono text-xs">
          {classItem.courseCode}
        </Badge>
      </div>

      {/* Description */}
      {classItem.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{classItem.description}</p>
      )}

      {/* Teacher */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <User className="h-3 w-3 shrink-0" />
        <span>{classItem.teacher.fullName}</span>
      </div>

      {/* CTA — Link đến /classes/[id]/info */}
      <Button className="cursor-pointer w-full mt-1" onClick={() => onNavigate(classItem.id)}>
        Tham gia
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
