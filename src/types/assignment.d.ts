import { FileType } from './enum';
import { User } from './user';

export interface AssignmentMaterial {
  id: string;
  fileUrl: string;
  fileType: FileType | null;
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
