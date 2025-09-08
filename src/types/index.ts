export interface Transcript {
  id: string;
  text: string;
  audioUrl?: string;
  audioBlob?: Blob;
  createdAt: Date;
  updatedAt: Date;
  duration?: number;
  status: 'processing' | 'completed' | 'error';
}

export interface AppState {
  transcripts: Transcript[];
  currentTranscript: Transcript | null;
  isRecording: boolean;
  isPaused: boolean;
  isProcessing: boolean;
  error: string | null;
}