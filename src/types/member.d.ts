import { EnrollmentStatus, Role } from './enum';
import { User } from './user';

export interface ClassMember {
  id: string;
  userId: string;
  identityCode?: string;
  studentCode?: string;
  user: User;
  role: Role;
  status: EnrollmentStatus;
  joinedAt: string;
}

export type MemberFilterTab = 'all' | 'students' | 'pending';
