import { FileType } from './enum';
import type { Assignment } from './assignment';
import type { Quiz } from './quiz';

export interface Reference {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  topicId: string;
  createdAt?: string;
}

export interface Material {
  id: string;
  title: string;
  materialType: FileType;
  fileUrl: string | null;
  externalUrl: string | null;
  topicId: string;
  createdAt: string;
}

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

export interface CreateMaterialPayload {
  title: string;
  materialType: FileType;
  fileUrl?: string;
  externalUrl?: string;
}

export type UnifiedResource =
  | { kind: 'material'; data: Material }
  | { kind: 'reference'; data: Reference }
  | { kind: 'assignment'; data: Assignment }
  | { kind: 'quiz'; data: Quiz };

export type MaterialWithTopic = Material & {
  topicTitle?: string;
};

export interface MaterialBadgeConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
}
