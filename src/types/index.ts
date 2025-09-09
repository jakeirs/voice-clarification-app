export interface Transcript {
  id: string;
  title: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'processing' | 'completed' | 'error';
}

export interface AppState {
  transcripts: Transcript[];
  currentTranscript: Transcript | null;
  isRecording: boolean;
  isPaused: boolean;
  isProcessing: boolean;
  error: string | null;
  selectedContextCards: string[];
  activeTab: 'transcript' | 'generate-prd';
}