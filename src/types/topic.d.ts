import type { Assignment } from './assignment';
import type { Quiz } from './quiz';
import type { Material } from './material';
import type { Reference } from './reference';

export interface Topic {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number | null;
  classId: string;
  createdBy: string;
  createdAt: string;
  materials?: Material[];
  references?: Reference[];
  assignments?: Assignment[];
  quizzes?: Quiz[];
}

export interface CreateTopicPayload {
  title: string;
  description?: string;
}

export type UpdateTopicPayload = Partial<CreateTopicPayload>;

export type UnifiedResource =
  | { kind: 'material'; data: Material }
  | { kind: 'reference'; data: Reference }
  | { kind: 'assignment'; data: Assignment }
  | { kind: 'quiz'; data: Quiz };

export type ResourceCreationType = 'material' | 'reference' | 'assignment' | 'quiz';
