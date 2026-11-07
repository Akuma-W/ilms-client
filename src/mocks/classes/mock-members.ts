import { EnrollmentStatus, Role, UserStatus } from '@/types/enum';
import type { User } from '@/types/user';
import { MOCK_PENDING_USERS, MOCK_STUDENTS, MOCK_TEACHER } from './mock-users';

export interface ClassMemberItem {
  id: string;
  userId: string;
  user: User;
  role: Role;
  status: EnrollmentStatus;
  joinedAt: string;
}

export const MOCK_TEACHING_ASSISTANT: User = {
  id: '11111111-1111-4111-8111-111111111112',
  email: 'huy.le@uit.edu.vn',
  fullName: 'ThS. Lê Quang Huy (Trợ giảng)',
  role: Role.teacher,
  status: UserStatus.active,
  avatarUrl:
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  schoolId: '99999999-9999-4999-8999-999999999999',
  createdAt: new Date('2024-03-01'),
};

export const MOCK_MEMBERS: ClassMemberItem[] = [
  // Giảng viên chính
  {
    id: 'mem10001-0000-4000-8000-000000000001',
    userId: MOCK_TEACHER.id,
    user: MOCK_TEACHER,
    role: Role.teacher,
    status: EnrollmentStatus.approved,
    joinedAt: '2026-02-10T08:00:00Z',
  },
  // Trợ giảng
  {
    id: 'mem10001-0000-4000-8000-000000000002',
    userId: MOCK_TEACHING_ASSISTANT.id,
    user: MOCK_TEACHING_ASSISTANT,
    role: Role.teacher,
    status: EnrollmentStatus.approved,
    joinedAt: '2026-02-12T09:00:00Z',
  },
  // Danh sách sinh viên chính thức
  ...MOCK_STUDENTS.map((student, index) => ({
    id: `mem10002-0000-4000-8000-00000000000${index + 1}`,
    userId: student.id,
    user: student,
    role: Role.student,
    status: EnrollmentStatus.approved,
    joinedAt: '2026-02-15T10:00:00Z',
  })),
  // Yêu cầu chờ duyệt vào lớp
  ...MOCK_PENDING_USERS.map((student, index) => ({
    id: `mem10003-0000-4000-8000-00000000000${index + 1}`,
    userId: student.id,
    user: student,
    role: Role.student,
    status: EnrollmentStatus.pending,
    joinedAt: '2026-03-05T14:30:00Z',
  })),
];

let mutableMockMembers = MOCK_MEMBERS.map((m, idx) => ({
  id: m.id,
  userId: m.userId,
  user: m.user,
  role: m.role,
  status: m.status,
  joinedAt: m.joinedAt,
  studentCode: m.role === Role.student ? `2252${(1001 + idx).toString()}` : undefined,
}));

export const getMockMembers = () => [...mutableMockMembers];

export const approveMockMember = (memberId: string) => {
  mutableMockMembers = mutableMockMembers.map((m) =>
    m.id === memberId ? { ...m, status: EnrollmentStatus.approved } : m,
  );
};

export const rejectMockMember = (memberId: string) => {
  mutableMockMembers = mutableMockMembers.filter((m) => m.id !== memberId);
};

export const removeMockMember = (memberId: string) => {
  mutableMockMembers = mutableMockMembers.filter((m) => m.id !== memberId);
};

export const updateMockMemberRole = (memberId: string, newRole: Role) => {
  mutableMockMembers = mutableMockMembers.map((m) =>
    m.id === memberId ? { ...m, role: newRole } : m,
  );
};
