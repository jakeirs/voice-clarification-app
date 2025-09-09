export interface GeneratedPRD {
  content: string;
  generatedAt: Date;
  contextUsed: string[];
}

export interface SerializableImageRef {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string; // Base64 data URL for localStorage persistence
  uploadedAt: Date;
}

export interface GeneratedUIDesign {
  id: string;
  url: string;
  prompt: string;
  createdAt: Date;
  generationCount: number;
}

export interface TranscriptUIDesigns {
  uploadedImages: SerializableImageRef[];
  generatedJsonPrompt: string | null;
  generatedDesigns: GeneratedUIDesign[];
  designGenerationCount: number;
  lastModified: Date;
}

export interface Transcript {
  id: string;
  title: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'processing' | 'completed' | 'error';
  generatedPRD?: GeneratedPRD;
  uiDesigns?: TranscriptUIDesigns;
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