import { QuestionType, QuizStatus, Visibility } from './enum';
import { User } from './user';

export interface Option {
  id: string;
  content: string;
  isCorrect: boolean;
  questionId?: string;
}

export interface Question {
  id: string;
  content: string;
  questionType: QuestionType;
  points: number;
  orderIndex: number;
  quizId?: string;
  options: Option[];
}

export interface QuizAttempt {
  id: string;
  score: number | null;
  startedAt: string;
  submittedAt: string | null;
  quizId: string;
  studentId: string;
  student?: User;
}

export interface QuizPublication {
  id: string;
  openAt: string | null;
  closeAt: string | null;
  isPublic: boolean;
  publishedAt: string;
  quizId: string;
  classId?: string | null;
  topicId?: string | null;
  quiz?: Quiz;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string | null;
  timeLimit: number;
  visibility: Visibility;
  status: QuizStatus;
  openAt?: string | null;
  closeAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  creator?: User;
  questions?: Question[];
  questionCount?: number;
  publications?: QuizPublication[];
  attempts?: QuizAttempt[];
}

export type QuizFilterTab = 'all' | 'open' | 'completed' | 'closed';

export interface QuizClassItem extends Quiz {
  publicationId: string;
  classId: string;
  topicId?: string | null;
  topicName?: string | null;
  openAt: string;
  closeAt: string;
  submittedCount: number;
  totalStudents: number;
  currentUserAttempt?: QuizAttempt | null;
}

export interface PublishQuizInput {
  quizId: string;
  topicId?: string | null;
  openAt: string;
  closeAt: string;
}

export interface QuizStudentStatItem {
  studentId: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  isSubmitted: boolean;
  score: number | null;
  submittedAt?: string | null;
}

export interface QuizClassStats {
  quizId: string;
  quizTitle: string;
  submittedCount: number;
  unsubmittedCount: number;
  totalStudents: number;
  averageScore: number;
  passRatePercent: number;
  students: QuizStudentStatItem[];
}
