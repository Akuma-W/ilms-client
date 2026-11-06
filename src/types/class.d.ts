import { Enrollment } from './enrollment';
import { School } from './school';
import { User } from './user';
import { ClassTabs } from './enum';
import type { LucideIcon } from 'lucide-react';

export interface Class {
  id: string;
  title: string;
  subject: string;
  description: string | null;
  courseCode: string;
  semester: string | null;
  isPrivate: boolean;
  meetingUri?: string | null;
  meetingSpaceId?: string | null;
  isArchived?: boolean;
  schoolId: string;
  teacherId: string;
  createdAt: Date;

  school: School;
  teacher: User;
  enrollment: Enrollment | null;
}

export interface ClassClient extends Class {
  schoolName: string;
  teacherName: string;
  status: string;
  isOwner: boolean;
}

export interface ClassParams {
  tab: ClassTabs;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateClassPayload {
  title: string;
  subject: string;
  description?: string;
  semester?: string;
  isPrivate: boolean;
}

export interface ClassroomTabColors {
  border: string;
  icon: string;
  activeText: string;
}

export interface ClassroomTabConfig {
  value: string;
  icon: LucideIcon;
  label: string;
  joinedOnly: boolean;
  colors: ClassroomTabColors;
}

export interface ClassTheme {
  name: string;
  hex: string;
  gradient: string;
  gradientClass: string;
  border: string;
  subtleBg: string;
  badgeBg: string;
  text: string;
  icon: string;
  hoverText: string;
}

export type SearchStatus = 'idle' | 'loading' | 'found' | 'not_found' | 'error';
