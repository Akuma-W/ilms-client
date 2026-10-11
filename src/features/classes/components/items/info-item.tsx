'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface InfoItemProps {
  key?: number;
  icon: LucideIcon;
  label: string;
  value: string | null;
  color: string;
}

export function InfoItem({ key, icon: Icon, label, value, color }: InfoItemProps) {
  return (
    <Card
      key={key}
      className="group border-gray-100 shadow-sm transition-all hover:border-galaxy-blue hover:shadow-md"
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center text-galaxy-blue group-hover:bg-galaxy group-hover:text-white transition-colors',
            color,
          )}
        >
          <Icon className="w-6 h-6" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</h2>
          <div className="mt-1 flex items-center gap-2">
            <span className="truncate text-sm font-bold text-gray-900">{value}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
