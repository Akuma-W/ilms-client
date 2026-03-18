import { Role, UserStatus } from "./enum";

export interface User {
  id: string;
  email: string;
  password: string | null;
  fullName: string;
  role: Role;
  schoolId: string;
  googleId: string | null;
  avatarUrl: string | null;
  identityCode: string | null;
  status: UserStatus | null;
}
