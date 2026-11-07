import { FileType } from './enum';
import { User } from './user';

export interface AssignmentMaterial {
  id: string;
  fileUrl: string;
  fileType: FileType | null;
  fileName?: string;
  fileSize?: number;
  createdAt?: string;
  assignmentId: string;
}

export interface SubmissionFile {
  id: string;
  fileUrl: string;
  fileType: FileType | null;
  fileName?: string;
  fileSize?: number;
  createdAt?: string;
  submissionId: string;
}

export interface Submission {
  id: string;
  textAnswer?: string | null;
  score?: number | null;
  feedback?: string | null;
  isLate: boolean;
  submittedAt: string;
  assignmentId: string;
  studentId: string;
  student?: User;
  files?: SubmissionFile[];
}

export interface Assignment {
  id: string;
  title: string;
  description?: string | null;
  dueAt: string | null;
  maxScore: number;
  createdAt: string;
  updatedAt?: string;
  classId: string;
  topicId?: string | null;
  createdBy: string;
  materials?: AssignmentMaterial[];
  submissions?: Submission[];
  submissionCount?: number;
  totalStudents?: number;
}

export type AssignmentFilterStatus = 'all' | 'pending' | 'submitted' | 'graded' | 'overdue';

export interface CreateAssignmentPayload {
  title: string;
  description?: string | null;
  dueAt?: string | null;
  maxScore?: number;
  topicId?: string | null;
  materials?: {
    fileUrl: string;
    fileType: FileType | null;
    fileName?: string;
    fileSize?: number;
  }[];
}

export interface SubmitAssignmentPayload {
  textAnswer?: string | null;
  files?: {
    id?: string;
    fileUrl: string;
    fileType: FileType | null;
    fileName?: string;
    fileSize?: number;
  }[];
}

export interface GradeSubmissionPayload {
  score: number;
  feedback?: string | null;
}
