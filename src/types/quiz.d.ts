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
