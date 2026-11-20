import { User } from './user';

export type GradeSourceType = 'manual' | 'assignment' | 'quiz' | 'attendance';

export interface PillarConfig {
  weight?: number;
  minRate?: number;
  strictThreshold?: boolean;
}

export interface DirectGradeItemConfig {
  type: 'assignment' | 'quiz';
  id: string;
  weight: number;
}

export interface CompositeGradeItemConfig {
  type: 'assignment' | 'quiz';
  id: string;
}

export interface GradeCategoryConfig {
  strategy?: 'manual' | 'attendance_threshold' | 'composite_average' | 'progress_unified' | string;
  pillars?: {
    meetings?: PillarConfig;
    materials?: PillarConfig;
    assignments?: PillarConfig;
    quizzes?: PillarConfig;
  };
  directItems?: DirectGradeItemConfig[];
  items?: CompositeGradeItemConfig[];
  [key: string]: unknown;
}

export interface GradeCategory {
  id: string;
  name: string;
  weight: number; // e.g. 0.2 (20%), 0.3 (30%), 0.5 (50%)
  orderIndex?: number;
  classId: string;
  sourceType?: GradeSourceType;
  sourceId?: string | null;
  config?: GradeCategoryConfig | null;
}

export interface GradeItem {
  id: string;
  score: number;
  categoryId: string;
  studentId: string;
  isOverridden?: boolean;
  overrideScore?: number | null;
  overrideReason?: string | null;
  category?: GradeCategory;
  student?: User;
}

export interface StudentCategoryGrade {
  categoryId: string;
  categoryName: string;
  weight: number;
  score: number | null;
  weightedScore: number | null;
  isOverridden?: boolean;
}

export interface DetailedGradeItem {
  id: string;
  title: string;
  type: 'assignment' | 'quiz' | 'attendance';
  maxScore: number;
  rawScore?: number | null;
  originalMaxScore?: number | null;
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
  finalScore: number | null;
  letterGrade: string | null;
  gpa4: number | null;
  isPassed: boolean | null;
  completionRate: number; // percentage
  attendanceSummary?: AttendanceStudentItem | null;
}

export interface GradeOverrideInfo {
  isOverridden: boolean;
  overrideScore?: number | null;
  reason?: string | null;
}

export interface ClassGradeMatrixRow {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCode: string;
  avatarUrl?: string | null;
  scores: Record<string, number | null>; // categoryId -> score
  overrides?: Record<string, GradeOverrideInfo>; // categoryId -> override info
  finalScore: number | null;
  letterGrade: string | null;
  gpa4?: number | null;
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

export interface AttendanceStudentItem {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCode: string;
  avatarUrl?: string | null;
  completedMaterials: number;
  totalMaterials: number;
  materialRate: number;
  attendedSessions: number;
  totalSessions: number;
  sessionRate: number;
  submittedAssignments: number;
  totalAssignments: number;
  assignmentRate: number;
  attemptedQuizzes: number;
  totalQuizzes: number;
  quizRate: number;
  calculatedScore: number;
  currentScore?: number | null;
}

export interface AttendanceSummaryEntity {
  totalMaterials: number;
  totalSessions: number;
  totalAssignments?: number;
  totalQuizzes?: number;
  materialWeight: number;
  meetingWeight: number;
  assignmentWeight?: number;
  quizWeight?: number;
  categoryId: string;
  students: AttendanceStudentItem[];
}

export interface GradeBreakdownItem {
  id: string;
  title: string;
  type: string;
  score: number;
  maxScore: number;
  rate?: number;
  weight?: number;
  status?: string;
}

export interface GradeCategoryBreakdown {
  categoryId: string;
  categoryName: string;
  weight: number;
  strategy: string;
  rawScore?: number | null;
  overrideScore?: number | null;
  finalScore: number;
  isOverridden: boolean;
  overrideReason?: string | null;
  items: GradeBreakdownItem[];
}

export interface CreateGradeCategoryInput {
  name: string;
  weight: number;
  orderIndex?: number;
  sourceType?: GradeSourceType;
  sourceId?: string;
  config?: GradeCategoryConfig;
}

export interface UpdateGradeCategoryInput {
  name?: string;
  weight?: number;
  orderIndex?: number;
  sourceType?: GradeSourceType;
  sourceId?: string;
  config?: GradeCategoryConfig;
}

export interface CalculateAttendanceInput {
  materialWeight?: number;
  meetingWeight?: number;
  assignmentWeight?: number;
  quizWeight?: number;
  categoryId?: string;
  preserveOverrides?: boolean;
  meetingMinRate?: number;
  materialMinRate?: number;
  meetingThreshold?: number;
  materialThreshold?: number;
  assignmentThreshold?: number;
  quizThreshold?: number;
}

export interface SyncGradesInput {
  categoryId?: string;
}

export interface OverrideGradeInput {
  studentId: string;
  categoryId: string;
  score: number;
  reason?: string;
}

export interface BatchUpdateGradeUpdateItem {
  studentId: string;
  categoryId: string;
  score: number;
}

export interface BatchUpdateGradeInput {
  updates: BatchUpdateGradeUpdateItem[];
}
