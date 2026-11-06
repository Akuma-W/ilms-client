export interface UploadResponse {
  url: string;
  key: string;
}

export interface UploadResult {
  success: boolean;
  message?: string;
  data: UploadResponse | null;
}
