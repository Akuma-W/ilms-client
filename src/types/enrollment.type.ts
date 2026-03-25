import { Class } from './class.type';
import { EnrollmentStatus, Role } from './enum';
import { User } from './user.type';

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
