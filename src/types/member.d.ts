import { EnrollmentStatus, Role } from './enum';
import { User } from './user';

export interface ClassMember {
  id: string;
  userId: string;
  user: User;
  role: Role;
  status: EnrollmentStatus;
  joinedAt: string;
  studentCode?: string;
}

export type MemberFilterTab = 'all' | 'students' | 'pending';
