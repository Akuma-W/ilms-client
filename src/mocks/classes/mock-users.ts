import { Role, UserStatus } from '@/types/enum';
import type { User } from '@/types/user';

export const MOCK_TEACHER: User = {
  id: '11111111-1111-4111-8111-111111111111',
  email: 'nguyenvanan@uit.edu.vn',
  fullName: 'TS. Nguyễn Văn An',
  role: Role.teacher,
  status: UserStatus.active,
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  schoolId: '99999999-9999-4999-8999-999999999999',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2026-02-10'),
};

export const MOCK_CURRENT_USER: User = {
  id: '22222222-2222-4222-8222-222222222221',
  email: 'tuan.tran@student.uit.edu.vn',
  fullName: 'Trần Minh Tuấn',
  role: Role.student,
  status: UserStatus.active,
  avatarUrl:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  schoolId: '99999999-9999-4999-8999-999999999999',
  createdAt: new Date('2025-09-01'),
  updatedAt: new Date('2026-03-01'),
};

export const MOCK_STUDENTS: User[] = [
  MOCK_CURRENT_USER,
  {
    id: '22222222-2222-4222-8222-222222222222',
    email: 'mai.le@student.uit.edu.vn',
    fullName: 'Lê Thị Mai',
    role: Role.student,
    status: UserStatus.active,
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    schoolId: '99999999-9999-4999-8999-999999999999',
    createdAt: new Date('2025-09-01'),
  },
  {
    id: '22222222-2222-4222-8222-222222222223',
    email: 'nam.pham@student.uit.edu.vn',
    fullName: 'Phạm Hoàng Nam',
    role: Role.student,
    status: UserStatus.active,
    avatarUrl:
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    schoolId: '99999999-9999-4999-8999-999999999999',
    createdAt: new Date('2025-09-01'),
  },
  {
    id: '22222222-2222-4222-8222-222222222224',
    email: 'anh.nguyen@student.uit.edu.vn',
    fullName: 'Nguyễn Quỳnh Anh',
    role: Role.student,
    status: UserStatus.active,
    avatarUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    schoolId: '99999999-9999-4999-8999-999999999999',
    createdAt: new Date('2025-09-01'),
  },
  {
    id: '22222222-2222-4222-8222-222222222225',
    email: 'trong.vu@student.uit.edu.vn',
    fullName: 'Vũ Đức Trọng',
    role: Role.student,
    status: UserStatus.active,
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    schoolId: '99999999-9999-4999-8999-999999999999',
    createdAt: new Date('2025-09-01'),
  },
  {
    id: '22222222-2222-4222-8222-222222222226',
    email: 'linh.hoang@student.uit.edu.vn',
    fullName: 'Hoàng Khánh Linh',
    role: Role.student,
    status: UserStatus.active,
    avatarUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    schoolId: '99999999-9999-4999-8999-999999999999',
    createdAt: new Date('2025-09-01'),
  },
];

export const MOCK_PENDING_USERS: User[] = [
  {
    id: '33333333-3333-4333-8333-333333333331',
    email: 'long.dang@student.uit.edu.vn',
    fullName: 'Đặng Bảo Long',
    role: Role.student,
    status: UserStatus.active,
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    schoolId: '99999999-9999-4999-8999-999999999999',
    createdAt: new Date('2026-03-05'),
  },
  {
    id: '33333333-3333-4333-8333-333333333332',
    email: 'thao.bui@student.uit.edu.vn',
    fullName: 'Bùi Phương Thảo',
    role: Role.student,
    status: UserStatus.active,
    avatarUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    schoolId: '99999999-9999-4999-8999-999999999999',
    createdAt: new Date('2026-03-05'),
  },
];
