import { QuizStatus, ReviewMode, Role, SchoolStatus, UserStatus, Visibility } from './enum';
import { School } from './school';
import { Subject } from './subject';
import { User } from './user';

export interface AdminOverviewStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;
  lockedUsers: number;
  totalSchools: number;
  activeSchools: number;
  inactiveSchools: number;
  totalClasses: number;
  activeClasses: number;
  archivedClasses: number;
  totalEnrollments: number;
  totalQuizzes: number;
  publicQuizzes: number;
  privateQuizzes: number;
  totalAttempts: number;
  totalAIRequests: number;
}

export interface AdminGrowthMetric {
  date: string;
  newUsers: number;
  newClasses: number;
  quizAttempts: number;
}

export interface AdminTopSchool {
  id: string;
  name: string;
  shortname: string | null;
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  status: SchoolStatus;
  activityScore: number;
  studentsCount?: number;
  teachersCount?: number;
  classesCount?: number;
}

export interface AdminRecentActivity {
  id: string;
  type: string;
  description: string;
  actorName: string;
  createdAt: string;
}

export interface AdminStats {
  overview: AdminOverviewStats;
  growth: AdminGrowthMetric[];
  topSchools: AdminTopSchool[];
  recentActivities: AdminRecentActivity[];
}

export interface AdminSchool extends School {
  status: SchoolStatus;
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSubjects?: number;
}

export interface AdminSubject extends Pick<Subject, 'id' | 'name' | 'code'> {
  credits?: number;
}

export interface AdminClass {
  id: string;
  title: string;
  description?: string | null;
  courseCode?: string | null;
  semester?: string | null;
  isPrivate: boolean;
  isArchived: boolean;
  totalStudents: number;
  maxStudents?: number | null;
  createdAt: string;
  teacher: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
  };
  subjectRef: {
    id: string;
    code: string;
    name: string;
    credits?: number;
  };
  school: {
    id: string;
    name: string;
    shortname: string | null;
  };
}

export interface AdminQuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface AdminQuizQuestion {
  id: string;
  text: string;
  points: number;
  orderIndex: number;
  options: AdminQuizOption[];
}

export interface AdminQuiz {
  id: string;
  title: string;
  description?: string | null;
  timeLimit: number;
  visibility: Visibility;
  status: QuizStatus;
  reviewMode: ReviewMode;
  totalQuestions: number;
  totalAttempts: number;
  creator: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
  };
  createdAt: string;
  updatedAt: string;
  questions?: AdminQuizQuestion[];
}

export interface AdminUser extends Omit<User, 'school' | 'createdAt' | 'updatedAt' | 'status'> {
  status: UserStatus;
  schoolId?: string | null;
  school?: Pick<School, 'id' | 'name' | 'shortname'> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AdminActionResult {
  success: boolean;
  message: string;
}

export interface AdminResetPasswordResult extends AdminActionResult {
  temporaryPassword?: string;
}

export interface CreateAdminSchoolInput {
  name: string;
  shortname: string;
  address?: string;
  city?: string;
}

export interface UpdateAdminSchoolInput {
  name?: string;
  shortname?: string;
  address?: string;
  city?: string;
  status?: 'active' | 'inactive';
}

export interface CreateAdminSubjectInput {
  name: string;
  code: string;
  schoolId: string;
}

export interface UpdateAdminSubjectInput {
  name?: string;
  code?: string;
}

export interface CreateAdminClassInput {
  name: string;
  code?: string;
  schoolId: string;
  subjectId: string;
  teacherId: string;
  maxStudents?: number;
  isPrivate?: boolean;
}

export interface UpdateAdminClassInput {
  name?: string;
  code?: string;
  teacherId?: string;
  maxStudents?: number;
  isPrivate?: boolean;
}

export interface CreateAdminUserInput {
  email: string;
  fullName: string;
  role: Role;
  schoolId: string;
  identityCode?: string;
  password?: string;
}

export interface UpdateAdminUserInput {
  fullName?: string;
  role?: Role;
  status?: UserStatus;
  schoolId?: string;
  identityCode?: string;
}
