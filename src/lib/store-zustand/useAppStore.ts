import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transcript, AppState } from '@/types';
import { STORAGE_KEYS } from '@/lib/storage/localStorage';

interface AppStore extends AppState {
  // Recording actions
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  setCurrentTranscript: (transcript: Transcript | null) => void;
  
  // Transcript management
  addTranscript: (transcript: Transcript) => void;
  updateTranscript: (id: string, updates: Partial<Transcript>) => void;
  deleteTranscript: (id: string) => void;
  
  // Processing state
  setProcessing: (isProcessing: boolean) => void;
  
  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Utility actions
  clearAllTranscripts: () => void;
}

const initialState: AppState = {
  transcripts: [],
  currentTranscript: null,
  isRecording: false,
  isPaused: false,
  isProcessing: false,
  error: null,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      // Recording actions
      startRecording: () => {
        set({ isRecording: true, isPaused: false, error: null });
      },
      
      pauseRecording: () => {
        set({ isPaused: true });
      },
      
      resumeRecording: () => {
        set({ isPaused: false });
      },
      
      stopRecording: () => {
        set({ isRecording: false, isPaused: false });
      },
      
      setCurrentTranscript: (transcript) => {
        set({ currentTranscript: transcript });
      },
      
      // Transcript management
      addTranscript: (transcript) => {
        set((state) => ({
          transcripts: [...state.transcripts, transcript],
        }));
      },
      
      updateTranscript: (id, updates) => {
        set((state) => ({
          transcripts: state.transcripts.map((transcript) =>
            transcript.id === id 
              ? { ...transcript, ...updates, updatedAt: new Date() }
              : transcript
          ),
          currentTranscript: 
            state.currentTranscript?.id === id
              ? { ...state.currentTranscript, ...updates, updatedAt: new Date() }
              : state.currentTranscript,
        }));
      },
      
      deleteTranscript: (id) => {
        set((state) => ({
          transcripts: state.transcripts.filter((transcript) => transcript.id !== id),
          currentTranscript: 
            state.currentTranscript?.id === id ? null : state.currentTranscript,
        }));
      },
      
      // Processing state
      setProcessing: (isProcessing) => {
        set({ isProcessing });
      },
      
      // Error handling
      setError: (error) => {
        set({ error });
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      // Utility actions
      clearAllTranscripts: () => {
        set({ transcripts: [], currentTranscript: null });
      },
    }),
    {
      name: STORAGE_KEYS.RECORDINGS, // Keep same key for backward compatibility
      partialize: (state) => ({
        transcripts: state.transcripts,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.transcripts) {
          state.transcripts = state.transcripts.map(transcript => ({
            ...transcript,
            createdAt: new Date(transcript.createdAt),
            updatedAt: new Date(transcript.updatedAt),
          }));
        }
      },
    }
  )
);