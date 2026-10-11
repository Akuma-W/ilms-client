import { FileType } from './enum';

export interface Topic {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number | null;
  classId: string;
  createdBy: string;
  createdAt: string;
  materials?: Material[];
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
