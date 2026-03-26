import { Role } from './enum';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  role: Role;
  schoolId: string;
  identityCode?: string;
}

export interface GoogleRegisterDto {
  fullName?: string;
  role: Role;
  schoolId: string;
  identityCode?: string;
}
