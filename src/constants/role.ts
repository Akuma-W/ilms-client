import { Role } from '@/types/enum';

export const ROLE_CONFIG: Record<Role, { label: string; className: string }> = {
  [Role.admin]: {
    label: 'Quản trị viên',
    className: 'bg-red-100 text-red-600',
  },
  [Role.teacher]: {
    label: 'Giảng viên',
    className: 'bg-green-100 text-green-600',
  },
  [Role.student]: {
    label: 'Sinh viên',
    className: 'bg-blue-100 text-blue-600',
  },
};
