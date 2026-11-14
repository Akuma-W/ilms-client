import { QuestionType, QuizStatus, ReviewMode, Visibility } from './enum';
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
  explanation?: string | null;
  quizId?: string;
  options: Option[];
}

export interface QuizAttempt {
  id: string;
  score: number | null;
  startedAt: string;
  submittedAt: string | null;
  quizId: string;
  publicationId?: string | null;
  studentId: string;
  student?: User;
}

export interface QuizTakeOption {
  id: string;
  content: string;
}

export interface QuizTakeQuestion {
  id: string;
  content: string;
  questionType: QuestionType;
  points: number;
  orderIndex: number;
  options: QuizTakeOption[];
}

export interface QuizAttemptSession {
  attemptId: string;
  quizId: string;
  title: string;
  timeLimit: number;
  startedAt: string;
  publicationId?: string | null;
  questions: QuizTakeQuestion[];
}

export interface CheckedAnswerResult {
  questionId: string;
  isCorrect: boolean;
  correctOptionIds: string[];
  explanation?: string | null;
  pointsEarned: number;
}

export interface QuizAttemptResult {
  attemptId: string;
  quizId: string;
  title?: string;
  studentId?: string;
  publicationId?: string | null;
  score: number | null;
  totalPoints?: number;
  startedAt?: string;
  submittedAt: string | null;
  totalQuestions: number;
  correctCount: number;
  reviewMode?: ReviewMode;
  canViewAnswers?: boolean;
  message?: string;
  details: {
    questionId: string;
    isCorrect: boolean;
    pointsEarned: number;
    maxPoints: number;
    explanation?: string | null;
    selectedOptionIds: string[];
    correctOptionIds: string[];
  }[];
}

export interface SubmitQuizAnswer {
  questionId: string;
  selectedOptionIds: string[];
}

export interface QuizPublication {
  id: string;
  openAt?: string | null;
  closeAt?: string | null;
  isPublic: boolean;
  reviewMode?: ReviewMode;
  publishedAt?: string;
  quizId: string;
  classId?: string | null;
  topicId?: string | null;
  quiz?: Pick<Quiz, 'id' | 'title' | 'description' | 'timeLimit'> & {
    totalQuestions?: number;
    totalPoints?: number;
    _count?: { questions: number };
  };
  topic?: { id: string; title: string } | null;
  totalAttemptsCount?: number;
  submittedCount?: number;
  totalStudents?: number;
  latestUserAttempt?: Pick<QuizAttempt, 'id' | 'score' | 'startedAt' | 'submittedAt'> | null;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string | null;
  timeLimit: number;
  visibility: Visibility;
  status: QuizStatus;
  reviewMode?: ReviewMode;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  creator?: User;
  questions?: Question[];
  totalQuestions?: number;
  totalPoints?: number;
  questionCount?: number;
  attemptCount?: number;
  publications?: QuizPublication[];
  attempts?: QuizAttempt[];
}

export type QuizFilterTab = 'all' | 'open' | 'upcoming' | 'completed' | 'closed';

export interface QuizClassItem extends Pick<Quiz, 'id' | 'title' | 'timeLimit'> {
  description?: string | null;
  publicationId: string;
  classId: string;
  topicId?: string | null;
  topicName?: string | null;
  openAt?: string | null;
  closeAt?: string | null;
  reviewMode?: ReviewMode;
  questionCount?: number;
  totalQuestions?: number;
  totalPoints?: number;
  submittedCount?: number;
  totalStudents?: number;
  currentUserAttempt?:
    | (Pick<QuizAttempt, 'id' | 'score' | 'startedAt' | 'submittedAt'> &
        Partial<Pick<QuizAttempt, 'quizId' | 'studentId'>>)
    | null;
  visibility?: Visibility;
  status?: QuizStatus;
  createdAt?: string;
  createdBy?: string;
}

export interface PublishQuizInput {
  quizId: string;
  classId?: string;
  topicId?: string | null;
  openAt?: string | null;
  closeAt?: string | null;
  reviewMode?: ReviewMode;
  isPublic?: boolean;
}

export interface UpdatePublicationInput {
  topicId?: string | null;
  openAt?: string | null;
  closeAt?: string | null;
  reviewMode?: ReviewMode;
  isPublic?: boolean;
}

export interface QuizStudentStatItem {
  studentId: string;
  name: string;
  email: string;
  identityCode?: string | null;
  avatar: string | null;
  isSubmitted: boolean;
  score: number | null;
  startedAt: string | null;
  submittedAt: string | null;
  attemptId: string | null;
}

export interface QuizClassStatsDistribution {
  under5: number;
  from5To6_5: number;
  from6_5To8: number;
  from8To10: number;
}

export interface QuizClassStats {
  publicationId: string;
  submittedCount: number;
  notSubmittedCount: number;
  totalStudents: number;
  averageScore: number;
  highestScore: number | null;
  lowestScore: number | null;
  distribution: QuizClassStatsDistribution;
  students: QuizStudentStatItem[];
}

export interface ParsedOption {
  content: string;
  isCorrect: boolean;
}

export interface ParsedQuestion {
  id?: string;
  content: string;
  questionType: QuestionType;
  points: number;
  orderIndex?: number;
  explanation?: string;
  options: ParsedOption[];
  choiceOptions?: ParsedOption[];
}

export interface ParsedQuizDocx {
  title?: string;
  timeLimit?: number;
  description?: string;
  questions: ParsedQuestion[];
}

export interface CreateQuizInput {
  title: string;
  description?: string;
  timeLimit: number;
  visibility?: Visibility;
  status?: QuizStatus;
  reviewMode?: ReviewMode;
}

export interface UpdateQuizInput {
  title?: string;
  description?: string;
  timeLimit?: number;
  visibility?: Visibility;
  status?: QuizStatus;
  reviewMode?: ReviewMode;
}

export interface CreateQuestionInput {
  content: string;
  questionType: QuestionType;
  points?: number;
  orderIndex?: number;
  explanation?: string;
  options: ParsedOption[];
}

export interface ReorderQuestionsInput {
  orders: {
    questionId: string;
    orderIndex: number;
  }[];
}

export interface QueryQuizInput {
  scope?: 'my' | 'all';
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedQuizzesResult<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
