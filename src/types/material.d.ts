import { FileType } from './enum';

export interface Material {
  id: string;
  title: string;
  materialType: FileType;
  fileUrl: string | null;
  externalUrl: string | null;
  topicId: string;
  createdAt: string;
}

export interface CreateMaterialPayload {
  title: string;
  materialType: FileType;
  fileUrl?: string;
  externalUrl?: string;
}

export type UpdateMaterialPayload = Partial<CreateMaterialPayload>;

export interface MaterialWithTopic extends Material {
  topicTitle?: string;
}

export interface MaterialBadgeConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
}

export interface StagedMaterialItem {
  id: string;
  file?: File;
  title: string;
  materialType: FileType;
  fileUrl?: string;
  externalUrl?: string;
  subtitle?: string;
  fileSizeFormatted?: string;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}
