export interface Subject {
  id: string;
  schoolId: string;
  code: string;
  name: string;
  credits: number;
  description: string | null;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string | null;
  _count?: {
    classes: number;
  };
}

export interface SubjectClassItem {
  id: string;
  title: string;
  subject: string;
  courseCode: string | null;
  semester: string | null;
  isPrivate: boolean;
  totalStudents: number;
  maxStudents: number | null;
  createdAt: Date | string | null;
  teacher: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
}

export interface QuerySubjectParams {
  search?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
}
