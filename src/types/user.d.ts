import { Role, UserStatus } from './enum';
import { School } from './school';

export interface User {
  id: string;
  email: string;
  password?: string | null;
  fullName: string;
  role: Role;
  schoolId: string;
  googleId?: string | null;
  avatarUrl?: string | null;
  identityCode?: string | null;
  status?: UserStatus | null;
  avatar?: string | null;
  createdAt: Date;
  updatedAt?: Date;

  school?: School;
}
