import { User } from './user';

export interface GradeCategory {
  id: string;
  name: string;
  weight: number; // e.g. 0.2 (20%), 0.3 (30%), 0.5 (50%)
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

export interface StudentCategoryGrade {
  categoryId: string;
  categoryName: string;
  weight: number;
  score: number | null;
  weightedScore: number | null;
}

export interface DetailedGradeItem {
  id: string;
  title: string;
  type: 'assignment' | 'quiz' | 'attendance';
  maxScore: number;
  earnedScore: number | null;
  status: 'graded' | 'pending' | 'unsubmitted';
  feedback?: string | null;
  submittedAt?: string | null;
}

export interface StudentGradeRecord {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCode?: string;
  avatarUrl?: string | null;
  categoryGrades: StudentCategoryGrade[];
  detailedItems: DetailedGradeItem[];
  finalScore: number;
  letterGrade: string;
  isPassed: boolean;
  completionRate: number; // percentage
}

export interface ClassGradeMatrixRow {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCode: string;
  avatarUrl?: string | null;
  scores: Record<string, number | null>; // categoryId -> score
  finalScore: number;
  letterGrade: string;
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
  rank: number;
}
