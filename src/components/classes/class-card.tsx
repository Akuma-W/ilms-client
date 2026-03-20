import { Class } from "@/types/class.type";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Calendar, User } from "lucide-react";
import { Button } from "../ui/button";

interface ClassCardProps {
  classItem: Class;
  onAction?: (id: string) => void;
  actionLabel?: string;
}

export function ClassCard({ classItem, onAction, actionLabel }: ClassCardProps) {
  const handleActionLabel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAction?.(classItem.id);
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-gray-100 overflow-hidden relative h-full cursor-pointer">
      <Link href={`/class/${classItem.id}`}>
        <div className="absolute top-0 left-0 w-1 h-full bg-galaxy opacity-0 group-hover:opacity-100 transition-opacity" />

        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-galaxy-blue transition-colors">
                  {classItem.title}
                </CardTitle>
                {/* Star */}
              </div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {classItem.subject}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 line-clamp-2 min-h-10">
            {classItem.description}
          </p>

          <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-2 border-t border-gray-50">
            <div className="flex items-center gap-1 5">
              <Calendar className="w-3 5 h-3 5" />
              <span>{classItem.semester ?? 'Đang mở'}</span>
            </div>
            <div className="flex items-center gap-1 5">
              <User className="w-3 5 h-3 5" />
              <span>{classItem.teacher.fullName}</span>
            </div>
          </div>
        </CardContent>
      </Link>

      {onAction && actionLabel && (
        <Button
          onClick={(e) => handleActionLabel(e)}
          className="w-full mt-2 py-2 text-sm font-bold text-white bg-galaxy rounded-lg hover:opacity-90 transition-opacity"
        >
          {actionLabel}
        </Button>
      )}
    </Card>
  )
}
