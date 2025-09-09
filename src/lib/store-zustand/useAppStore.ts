import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transcript, AppState, GeneratedDesign, GeneratedPRD, SerializableImageRef, TranscriptUIDesigns, GeneratedUIDesign } from '@/types';
import { STORAGE_KEYS } from '@/lib/storage/localStorage';
import { fileToSerializable, serializableToFile } from '@/lib/file-serialization';

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
  
  // Tab and context management
  setActiveTab: (tab: 'transcript' | 'generate-prd' | 'ui-designs') => void;
  toggleContextCard: (cardId: string) => void;
  clearContextCards: () => void;
  
  // UI Designs actions
  addUploadedImage: (file: File) => void;
  removeUploadedImage: (index: number) => void;
  clearUploadedImages: () => void;
  setGeneratedJsonPrompt: (prompt: string | null) => void;
  addGeneratedDesign: (design: GeneratedDesign) => void;
  clearGeneratedDesigns: () => void;
  setDesignGenerationCount: (count: number) => void;
  setIsGeneratingJson: (isGenerating: boolean) => void;
  setIsGeneratingDesigns: (isGenerating: boolean) => void;
  
  // PRD actions
  savePRDToTranscript: (transcriptId: string, prdContent: string, contextUsed: string[]) => void;
  clearPRDFromTranscript: (transcriptId: string) => void;
  getPRDByTranscriptId: (transcriptId: string) => GeneratedPRD | null;
  
  // Per-transcript UI Design actions
  addImageToTranscript: (transcriptId: string, file: File) => Promise<void>;
  removeImageFromTranscript: (transcriptId: string, imageId: string) => void;
  clearImagesFromTranscript: (transcriptId: string) => void;
  saveJsonPromptToTranscript: (transcriptId: string, jsonPrompt: string) => void;
  addUIDesignToTranscript: (transcriptId: string, design: GeneratedUIDesign) => void;
  clearUIDesignsFromTranscript: (transcriptId: string) => void;
  updateDesignGenerationCount: (transcriptId: string, count: number) => void;
  getUIDesignsByTranscriptId: (transcriptId: string) => TranscriptUIDesigns | null;
  
  // Hydration state management
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  
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
  selectedContextCards: [],
  activeTab: 'transcript',
  // UI Designs initial state
  uploadedImages: [],
  generatedJsonPrompt: null,
  generatedDesigns: [],
  designGenerationCount: 1,
  isGeneratingJson: false,
  isGeneratingDesigns: false,
};

const initialStoreState = {
  ...initialState,
  _hasHydrated: false,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialStoreState,
      
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
      
      // Tab and context management
      setActiveTab: (tab) => {
        set({ activeTab: tab });
      },
      
      toggleContextCard: (cardId) => {
        set((state) => ({
          selectedContextCards: state.selectedContextCards.includes(cardId)
            ? state.selectedContextCards.filter(id => id !== cardId)
            : [...state.selectedContextCards, cardId]
        }));
      },
      
      clearContextCards: () => {
        set({ selectedContextCards: [] });
      },
      
      // UI Designs actions
      addUploadedImage: (file) => {
        set((state) => ({
          uploadedImages: [...state.uploadedImages, file]
        }));
      },
      
      removeUploadedImage: (index) => {
        set((state) => ({
          uploadedImages: state.uploadedImages.filter((_, i) => i !== index)
        }));
      },
      
      clearUploadedImages: () => {
        set({ uploadedImages: [] });
      },
      
      setGeneratedJsonPrompt: (prompt) => {
        set({ generatedJsonPrompt: prompt });
      },
      
      addGeneratedDesign: (design) => {
        set((state) => ({
          generatedDesigns: [...state.generatedDesigns, design]
        }));
      },
      
      clearGeneratedDesigns: () => {
        set({ generatedDesigns: [] });
      },
      
      setDesignGenerationCount: (count) => {
        set({ designGenerationCount: count });
      },
      
      setIsGeneratingJson: (isGenerating) => {
        set({ isGeneratingJson: isGenerating });
      },
      
      setIsGeneratingDesigns: (isGenerating) => {
        set({ isGeneratingDesigns: isGenerating });
      },
      
      // PRD actions
      savePRDToTranscript: (transcriptId, prdContent, contextUsed) => {
        const generatedPRD: GeneratedPRD = {
          content: prdContent,
          generatedAt: new Date(),
          contextUsed
        };
        
        set((state) => ({
          transcripts: state.transcripts.map((transcript) =>
            transcript.id === transcriptId 
              ? { ...transcript, generatedPRD, updatedAt: new Date() }
              : transcript
          ),
          currentTranscript: 
            state.currentTranscript?.id === transcriptId
              ? { ...state.currentTranscript, generatedPRD, updatedAt: new Date() }
              : state.currentTranscript,
        }));
      },
      
      clearPRDFromTranscript: (transcriptId) => {
        set((state) => ({
          transcripts: state.transcripts.map((transcript) =>
            transcript.id === transcriptId 
              ? { ...transcript, generatedPRD: undefined, updatedAt: new Date() }
              : transcript
          ),
          currentTranscript: 
            state.currentTranscript?.id === transcriptId
              ? { ...state.currentTranscript, generatedPRD: undefined, updatedAt: new Date() }
              : state.currentTranscript,
        }));
      },
      
      getPRDByTranscriptId: (transcriptId): GeneratedPRD | null => {
        const state = useAppStore.getState();
        const transcript = state.transcripts.find((t: Transcript) => t.id === transcriptId);
        return transcript?.generatedPRD || null;
      },
      
      // Per-transcript UI Design actions
      addImageToTranscript: async (transcriptId: string, file: File) => {
        try {
          console.log(`🖼️ [UI Designs] Adding image to transcript ${transcriptId}:`, file.name);
          const serializedImage = await fileToSerializable(file);
          
          set((state) => ({
            transcripts: state.transcripts.map((transcript) =>
              transcript.id === transcriptId 
                ? { 
                    ...transcript, 
                    uiDesigns: transcript.uiDesigns ? {
                      ...transcript.uiDesigns,
                      uploadedImages: [
                        ...transcript.uiDesigns.uploadedImages,
                        serializedImage
                      ],
                      lastModified: new Date()
                    } : {
                      uploadedImages: [serializedImage],
                      generatedJsonPrompt: null,
                      generatedDesigns: [],
                      designGenerationCount: 1,
                      lastModified: new Date()
                    },
                    updatedAt: new Date() 
                  }
                : transcript
            ),
          }));
          
          console.log('✅ [UI Designs] Image added successfully');
        } catch (error) {
          console.error('❌ [UI Designs] Failed to add image:', error);
          throw error;
        }
      },

      removeImageFromTranscript: (transcriptId: string, imageId: string) => {
        console.log(`🗑️ [UI Designs] Removing image ${imageId} from transcript ${transcriptId}`);
        
        set((state) => ({
          transcripts: state.transcripts.map((transcript) =>
            transcript.id === transcriptId && transcript.uiDesigns
              ? { 
                  ...transcript, 
                  uiDesigns: {
                    ...transcript.uiDesigns,
                    uploadedImages: transcript.uiDesigns.uploadedImages.filter(img => img.id !== imageId),
                    lastModified: new Date()
                  },
                  updatedAt: new Date() 
                }
              : transcript
          ),
        }));
      },

      clearImagesFromTranscript: (transcriptId: string) => {
        console.log(`🧹 [UI Designs] Clearing all images from transcript ${transcriptId}`);
        
        set((state) => ({
          transcripts: state.transcripts.map((transcript) =>
            transcript.id === transcriptId && transcript.uiDesigns
              ? { 
                  ...transcript, 
                  uiDesigns: {
                    ...transcript.uiDesigns,
                    uploadedImages: [],
                    lastModified: new Date()
                  },
                  updatedAt: new Date() 
                }
              : transcript
          ),
        }));
      },

      saveJsonPromptToTranscript: (transcriptId: string, jsonPrompt: string) => {
        console.log(`💾 [UI Designs] Saving JSON prompt to transcript ${transcriptId}`);
        
        set((state) => ({
          transcripts: state.transcripts.map((transcript) =>
            transcript.id === transcriptId 
              ? { 
                  ...transcript, 
                  uiDesigns: transcript.uiDesigns ? {
                    ...transcript.uiDesigns,
                    generatedJsonPrompt: jsonPrompt,
                    lastModified: new Date()
                  } : {
                    uploadedImages: [],
                    generatedJsonPrompt: jsonPrompt,
                    generatedDesigns: [],
                    designGenerationCount: 1,
                    lastModified: new Date()
                  },
                  updatedAt: new Date() 
                }
              : transcript
          ),
        }));
      },

      addUIDesignToTranscript: (transcriptId: string, design: GeneratedUIDesign) => {
        console.log(`🎨 [UI Designs] Adding UI design to transcript ${transcriptId}:`, design.id);
        
        set((state) => ({
          transcripts: state.transcripts.map((transcript) =>
            transcript.id === transcriptId 
              ? { 
                  ...transcript, 
                  uiDesigns: transcript.uiDesigns ? {
                    ...transcript.uiDesigns,
                    generatedDesigns: [...transcript.uiDesigns.generatedDesigns, design],
                    lastModified: new Date()
                  } : {
                    uploadedImages: [],
                    generatedJsonPrompt: null,
                    generatedDesigns: [design],
                    designGenerationCount: 1,
                    lastModified: new Date()
                  },
                  updatedAt: new Date() 
                }
              : transcript
          ),
        }));
      },

      clearUIDesignsFromTranscript: (transcriptId: string) => {
        console.log(`🗑️ [UI Designs] Clearing UI designs from transcript ${transcriptId}`);
        
        set((state) => ({
          transcripts: state.transcripts.map((transcript) =>
            transcript.id === transcriptId && transcript.uiDesigns
              ? { 
                  ...transcript, 
                  uiDesigns: {
                    ...transcript.uiDesigns,
                    generatedDesigns: [],
                    lastModified: new Date()
                  },
                  updatedAt: new Date() 
                }
              : transcript
          ),
        }));
      },

      updateDesignGenerationCount: (transcriptId: string, count: number) => {
        set((state) => ({
          transcripts: state.transcripts.map((transcript) =>
            transcript.id === transcriptId 
              ? { 
                  ...transcript, 
                  uiDesigns: transcript.uiDesigns ? {
                    ...transcript.uiDesigns,
                    designGenerationCount: count,
                    lastModified: new Date()
                  } : {
                    uploadedImages: [],
                    generatedJsonPrompt: null,
                    generatedDesigns: [],
                    designGenerationCount: count,
                    lastModified: new Date()
                  },
                  updatedAt: new Date() 
                }
              : transcript
          ),
        }));
      },

      getUIDesignsByTranscriptId: (transcriptId: string): TranscriptUIDesigns | null => {
        const state = useAppStore.getState();
        const transcript = state.transcripts.find((t: Transcript) => t.id === transcriptId);
        return transcript?.uiDesigns || null;
      },
      
      // Hydration state management
      setHasHydrated: (hasHydrated: boolean) => {
        set({ _hasHydrated: hasHydrated });
      },
      
      // Utility actions
      clearAllTranscripts: () => {
        set({ transcripts: [], currentTranscript: null });
      },
    }),
    {
      name: STORAGE_KEYS.TRANSCRIPTS,
      partialize: (state) => ({
        transcripts: state.transcripts,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('🚨 [Store Hydration] Failed to rehydrate store:', error);
          // Still mark as hydrated to prevent loading screen
          state?.setHasHydrated?.(true);
          return;
        }
        
        console.log('💧 [Store Hydration] Starting data rehydration...');
        
        try {
          if (state?.transcripts) {
            console.log(`📊 [Store Hydration] Rehydrating ${state.transcripts.length} transcripts`);
            
            state.transcripts = state.transcripts.map((transcript: any) => ({
              ...transcript,
              createdAt: new Date(transcript.createdAt),
              updatedAt: new Date(transcript.updatedAt),
              generatedPRD: transcript.generatedPRD ? {
                ...transcript.generatedPRD,
                generatedAt: new Date(transcript.generatedPRD.generatedAt),
              } : undefined,
              uiDesigns: transcript.uiDesigns ? {
                ...transcript.uiDesigns,
                uploadedImages: transcript.uiDesigns.uploadedImages?.map((img: any) => ({
                  ...img,
                  uploadedAt: new Date(img.uploadedAt),
                })) || [],
                generatedDesigns: transcript.uiDesigns.generatedDesigns?.map((design: any) => ({
                  ...design,
                  createdAt: new Date(design.createdAt),
                })) || [],
                lastModified: new Date(transcript.uiDesigns.lastModified),
              } : undefined,
            }));
            
            console.log('✅ [Store Hydration] Successfully rehydrated transcript data');
          } else {
            console.log('📭 [Store Hydration] No transcript data to rehydrate');
          }
        } catch (hydrationError) {
          console.error('❌ [Store Hydration] Error during date conversion:', hydrationError);
        } finally {
          // Always mark as hydrated
          state?.setHasHydrated?.(true);
          console.log('🎯 [Store Hydration] Hydration complete');
        }
      },
    }
  )
);