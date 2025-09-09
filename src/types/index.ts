export interface Transcript {
  id: string;
  title: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'processing' | 'completed' | 'error';
}

export interface GeneratedDesign {
  id: string;
  url: string;
  prompt: string;
  createdAt: Date;
}

export interface AppState {
  transcripts: Transcript[];
  currentTranscript: Transcript | null;
  isRecording: boolean;
  isPaused: boolean;
  isProcessing: boolean;
  error: string | null;
  selectedContextCards: string[];
  activeTab: 'transcript' | 'generate-prd' | 'ui-designs';
  // UI Designs specific state
  uploadedImages: File[];
  generatedJsonPrompt: string | null;
  generatedDesigns: GeneratedDesign[];
  designGenerationCount: number;
  isGeneratingJson: boolean;
  isGeneratingDesigns: boolean;
}