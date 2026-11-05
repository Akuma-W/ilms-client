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
