export interface Reference {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  topicId: string;
  createdAt?: string;
}

export interface CreateReferencePayload {
  title: string;
  url: string;
  description?: string | null;
}

export type UpdateReferencePayload = Partial<CreateReferencePayload>;

export interface StagedReferenceItem {
  id: string;
  file?: File;
  title: string;
  url: string;
  description?: string | null;
  isFile?: boolean;
  subtitle?: string;
  fileSizeFormatted?: string;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}
