import { UserPlus, BookOpen, CheckCircle, ShieldAlert, LucideIcon } from 'lucide-react';

// Formats numerical count values with locale thousand separators
export function formatNumber(value?: number | null): string {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return value.toLocaleString('vi-VN');
}

// Formats timestamp strings into localized Vietnamese date format
export function formatDate(date?: string | Date | null): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Formats timestamp strings into localized time and calendar date
export function formatDateTime(date?: string | Date | null): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Returns badge label and visual styling classes for user roles
export function getRoleBadgeConfig(roleName?: string): { label: string; className: string } {
  switch (roleName) {
    case 'admin':
      return {
        label: 'Quản trị viên',
        className:
          'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 text-[10px] font-semibold',
      };
    case 'teacher':
      return {
        label: 'Giảng viên',
        className:
          'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800 text-[10px] font-semibold',
      };
    default:
      return {
        label: 'Sinh viên',
        className:
          'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800 text-[10px] font-semibold',
      };
  }
}

// Returns badge label and styling classes for user account status
export function getUserStatusBadgeConfig(statusName?: string): {
  label: string;
  className: string;
} {
  switch (statusName) {
    case 'active':
      return {
        label: 'Hoạt động',
        className:
          'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 text-[10px]',
      };
    case 'locked':
      return {
        label: 'Đã khóa',
        className:
          'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800 text-[10px]',
      };
    default:
      return {
        label: 'Đình chỉ',
        className:
          'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 text-[10px]',
      };
  }
}

// Returns badge label and styling classes for institutional school status
export function getSchoolStatusBadgeConfig(isActive: boolean): {
  label: string;
  className: string;
} {
  return isActive
    ? {
        label: 'Đang hoạt động',
        className:
          'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 text-[11px]',
      }
    : {
        label: 'Tạm dừng',
        className:
          'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 text-[11px]',
      };
}

// Returns badge label and styling classes for classroom archive state
export function getClassArchiveBadgeConfig(isArchived: boolean): {
  label: string;
  className: string;
} {
  return isArchived
    ? {
        label: 'Đã lưu trữ',
        className:
          'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800 text-[11px] font-medium',
      }
    : {
        label: 'Đang mở',
        className:
          'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 text-[11px] font-medium',
      };
}

// Returns badge label and styling classes for examination publication status
export function getQuizStatusBadgeConfig(status?: string): { label: string; className: string } {
  return status === 'published'
    ? {
        label: 'Đã xuất bản',
        className:
          'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800 text-[11px]',
      }
    : {
        label: 'Bản nháp',
        className:
          'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 text-[11px]',
      };
}

// Returns icon and color classification for recent platform audit activities
export function getActivityIconConfig(type: string): { icon: LucideIcon; colorClass: string } {
  switch (type) {
    case 'user_registered':
      return { icon: UserPlus, colorClass: 'text-emerald-500' };
    case 'class_created':
      return { icon: BookOpen, colorClass: 'text-indigo-500' };
    case 'quiz_submitted':
      return { icon: CheckCircle, colorClass: 'text-blue-500' };
    default:
      return { icon: ShieldAlert, colorClass: 'text-amber-500' };
  }
}
