import { User } from './user';

export interface GradeCategory {
  id: string;
  name: string;
  weight: number;
  classId: string;
}

export interface GradeItem {
  id: string;
  score: number;
  categoryId: string;
  studentId: string;
  category?: GradeCategory;
  student?: User;
}

export interface StudentGradeSummary {
  studentId: string;
  studentName: string;
  studentEmail: string;
  avatarUrl?: string | null;
  attendanceScore: number;
  assignmentScore: number;
  quizScore: number;
  finalScore: number;
  rank?: number;
}
