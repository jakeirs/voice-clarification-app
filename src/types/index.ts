export interface VoiceRecording {
  id: string;
  title: string;
  audioBlob?: Blob;
  audioUrl?: string;
  transcript?: string;
  clarifiedText?: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'recording' | 'processing' | 'completed' | 'error';
  duration?: number;
  fileSize?: number;
}

export interface AppState {
  recordings: VoiceRecording[];
  currentRecording: VoiceRecording | null;
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
}

export interface AudioSettings {
  sampleRate: number;
  bitDepth: number;
  channels: number;
  format: string;
}

export interface AppError {
  id: string;
  message: string;
  type: 'network' | 'audio' | 'processing' | 'storage' | 'unknown';
  timestamp: Date;
  retryable: boolean;
}

export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}