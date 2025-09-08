import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VoiceRecording, AppState, AppError } from '@/types';
import { STORAGE_KEYS } from '@/lib/storage/localStorage';

interface AppStore extends AppState {
  // Recording actions
  startRecording: () => void;
  stopRecording: () => void;
  setCurrentRecording: (recording: VoiceRecording | null) => void;
  
  // Recording management
  addRecording: (recording: VoiceRecording) => void;
  updateRecording: (id: string, updates: Partial<VoiceRecording>) => void;
  deleteRecording: (id: string) => void;
  
  // Processing state
  setProcessing: (isProcessing: boolean) => void;
  
  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Utility actions
  clearAllRecordings: () => void;
  retryProcessing: (recordingId: string) => void;
}

const initialState: AppState = {
  recordings: [],
  currentRecording: null,
  isRecording: false,
  isProcessing: false,
  error: null,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Recording actions
      startRecording: () => {
        set({ isRecording: true, error: null });
      },
      
      stopRecording: () => {
        set({ isRecording: false });
      },
      
      setCurrentRecording: (recording) => {
        set({ currentRecording: recording });
      },
      
      // Recording management
      addRecording: (recording) => {
        set((state) => ({
          recordings: [...state.recordings, recording],
        }));
      },
      
      updateRecording: (id, updates) => {
        set((state) => ({
          recordings: state.recordings.map((recording) =>
            recording.id === id 
              ? { ...recording, ...updates, updatedAt: new Date() }
              : recording
          ),
          currentRecording: 
            state.currentRecording?.id === id
              ? { ...state.currentRecording, ...updates, updatedAt: new Date() }
              : state.currentRecording,
        }));
      },
      
      deleteRecording: (id) => {
        set((state) => ({
          recordings: state.recordings.filter((recording) => recording.id !== id),
          currentRecording: 
            state.currentRecording?.id === id ? null : state.currentRecording,
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
      clearAllRecordings: () => {
        set({ recordings: [], currentRecording: null });
      },
      
      retryProcessing: (recordingId) => {
        const recording = get().recordings.find(r => r.id === recordingId);
        if (recording) {
          get().updateRecording(recordingId, { status: 'processing' });
          get().setError(null);
        }
      },
    }),
    {
      name: STORAGE_KEYS.RECORDINGS,
      partialize: (state) => ({
        recordings: state.recordings,
      }),
    }
  )
);