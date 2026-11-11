export interface PreviewItem {
  id?: string;
  title: string;
  fileUrl?: string | null;
  externalUrl?: string | null;
  fileType?: string | null;
  fileName?: string;
  fileSize?: number;
  description?: string | null;
  badgeLabel?: string;
  badgeBg?: string;
  badgeText?: string;
  badgeBorder?: string;
  topicTitle?: string;
  createdAt?: string | Date | null;
  materials?: PreviewItem[];
}
