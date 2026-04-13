import { Class } from './class';
import { EnrollmentStatus, Role } from './enum';
import { User } from './user';

export interface Enrollment {
  classId: string;
  userId: string;
  id: string;
  roleIn: Role;
  isStarred: boolean;
  joinedAt: Date | null;
  status: EnrollmentStatus;

  class: Class;
  user: User;
}

export interface JoinClassDto {
  userId: string;
  classId: string;
  roleIn: Role;
  isStarred?: boolean;
}

export interface JoinClassResponse {
  id: string;
  roleIn: Role;
  status: EnrollmentStatus;
}
