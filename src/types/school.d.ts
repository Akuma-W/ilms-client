import { SchoolStatus } from './enum';

export interface School {
  id: string;
  name: string;
  shortname: string | null;
  address: string | null;
  city: string;
  status?: SchoolStatus;
  createdAt?: Date | string;
  updatedAt?: Date | string | null;
}

export interface SchoolTeacherItem {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
}
