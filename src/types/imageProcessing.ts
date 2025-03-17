
export type UploadState = 'idle' | 'uploading' | 'uploaded' | 'analyzing' | 'complete' | 'error';

export interface ImageProcessState {
  state: UploadState;
  file: File | null;
  previewUrl: string | null;
  uploadProgress: number;
  uploadError: string | null;
  analysisError: string | null;
  isAnalyzing: boolean;
}
