# Voice Transcription App - Claude Development Guide

## 🎯 Project Overview

This is a **Voice Transcription App** built with Next.js that allows users to record audio with pause/resume functionality and get AI-powered transcriptions via Fal AI. The app has been completely rebuilt from a complex "voice clarification" system to a clean, focused transcription tool with comprehensive data persistence.

## 🏗️ Current Architecture

### **Tech Stack**
- **Framework**: Next.js 15.5.2 (with Turbopack)
- **Frontend**: React 19.1.0, TypeScript
- **State Management**: Zustand with complete localStorage persistence
- **Styling**: Tailwind CSS with glass morphism theme
- **UI Components**: Custom components + shadcn/ui (Button, Card, Textarea, Sheet)
- **AI Integration**: Fal AI speech-to-text API + Google Gemini 2.5 Pro
- **Icons**: Lucide React

### **Key Dependencies**
```json
{
  "@fal-ai/client": "^1.6.2",
  "@google/generative-ai": "^0.24.1",
  "@radix-ui/react-dialog": "^1.1.15", 
  "@radix-ui/react-dropdown-menu": "^2.1.16",
  "@radix-ui/react-portal": "^1.1.9",
  "@radix-ui/react-slider": "^1.3.6",
  "@radix-ui/react-slot": "^1.2.3",
  "@radix-ui/react-tabs": "^1.1.13",
  "@uiw/react-md-editor": "^4.0.8",
  "react-dropzone": "^14.3.8",
  "zustand": "^5.0.8"
}
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── transcribe/route.ts          # Fal AI transcription endpoint
│   │   ├── gemini/route.ts              # Google Gemini 2.5 Pro API endpoint (enhanced with structured prompts)
│   │   ├── generate-json-prompt/route.ts # UI design JSON prompt generation with structured format
│   │   ├── generate-design/route.ts     # Fal AI image generation for UI mockups
│   │   └── prompt-content/route.ts      # Markdown content serving endpoint
│   ├── layout.tsx                       # Root layout with hydration handling
│   └── page.tsx                         # Main app page with data migration
├── components/
│   ├── ui/
│   │   ├── button.tsx                  # shadcn Button component
│   │   ├── card.tsx                    # shadcn Card component  
│   │   ├── textarea.tsx                # shadcn Textarea component
│   │   ├── sheet.tsx                   # shadcn Sheet component
│   │   ├── tabs.tsx                    # shadcn Tabs component
│   │   ├── slider.tsx                  # shadcn Slider component
│   │   └── dropdown-menu.tsx           # shadcn Dropdown component
│   ├── BodyAttributeHandler.tsx        # Post-hydration browser extension cleanup
│   ├── HydrationErrorBoundary.tsx      # Graceful hydration error handling
│   ├── ClientOnlyProvider.tsx          # SSR-safe client-only wrapper
│   └── modules/
│       ├── VoiceRecorder.tsx           # Main recording component with pause/resume & title generation
│       ├── Library.tsx                 # Large Card with sorting dropdown & hydration-aware loading
│       ├── TranscriptCard.tsx          # Individual transcript cards with title/metadata
│       ├── TranscriptDetails.tsx       # Sheet with editable title & triple tabs (Raw | Generate PRD | UI Designs)
│       ├── ContextCard.tsx             # Checkable cards with PRD/prompt support
│       ├── PromptDetails.tsx           # Unified content viewer with markdown display, copy functionality, and optional character count
│       ├── MarkdownViewer.tsx          # Reusable markdown component with dark theme styling
│       ├── GeneratePRDTab.tsx          # Dedicated PRD generation tab with auto-save
│       ├── UIDesignsTab.tsx            # UI design generation tab with per-transcript storage
│       ├── ImageReferencesCard.tsx     # Context card with thumbnail display & Sheet-based upload
│       ├── ImageUploadSheet.tsx        # Dedicated Sheet for drag & drop + click-to-browse image upload
│       ├── ImageViewerDialog.tsx       # Full-screen image viewer with zoom/download
│       └── ExamplesModal.tsx           # Reference examples gallery modal
├── lib/
│   ├── store-zustand/
│   │   └── useAppStore.ts              # Enhanced Zustand store with complete persistence
│   ├── storage/
│   │   └── localStorage.ts             # Storage keys and utilities
│   ├── promptBuilder.ts                # Structured prompt builder with conditional XML sections
│   ├── audioUtils.ts                   # Audio utility functions
│   ├── file-serialization.ts          # File to Base64 conversion for localStorage
│   ├── migration-utils.ts              # Data migration from old storage keys
│   ├── cache-utils.ts                  # Prompt content cache management
│   └── utils.ts                        # General utilities (cn function)
├── types/
│   └── index.ts                        # Complete TypeScript types with PRD & UI design storage
└── public/
    ├── MASTER_PROMPTS/
    │   ├── Description_of_app.md       # App description context
    │   ├── GENERATE_PRD.md             # PRD generation master prompt
    │   ├── GEN_DESIGN.md               # UI design generation master prompt
    │   └── PRD_TEMPLATE.md             # PRD template reference
    └── examples/
        ├── exampleApp1.jpg             # Reference design examples
        ├── exampleApp2.jpg
        └── exampleApp3.jpg
```

## 🎙️ Key Features Implemented

### **1. Enhanced Voice Recorder (`VoiceRecorder.tsx`)**
- **Pause/Resume**: Users can pause recording and resume to the same audio file
- **Audio Format Selection**: Prioritizes Fal AI compatible formats (wav, mp4, ogg, mp3)
- **Quality Settings**: 44.1kHz sample rate, echo cancellation, noise suppression
- **Visual States**: Different UI states for recording, paused, and stopped
- **Audio Chunks**: Combines multiple recording segments into single file

### **2. Fal AI Integration (`/api/transcribe/route.ts`)**
- **File Upload**: Uploads audio to Fal AI storage
- **Speech-to-Text**: Uses `fal-ai/whisper` model (Whisper v3)
- **Error Handling**: Comprehensive error logging and debugging
- **Format Validation**: Checks for supported formats (mp3, mp4, mpeg, mpga, m4a, wav, webm)

### **3. Google Gemini Integration (`/api/gemini/route.ts`)**
- **Model**: Uses Google Gemini 2.5 Pro for AI text processing
- **Connectivity Test**: GET endpoint for API health checks
- **Prompt Processing**: POST endpoint for text generation
- **Test Mode**: Built-in test functionality with `{"test": true}`
- **Error Handling**: Comprehensive error logging with API-specific error detection
- **Processing Metrics**: Response time tracking and metadata

### **4. Complete Data Persistence System**
- **Zustand Store**: Enhanced with proper hydration and complete transcript storage
- **LocalStorage**: All transcript data persists across browser sessions
- **Data Migration**: Automatic migration from old storage keys to new structure
- **Hydration Handling**: SSR-safe with loading states until data loads
- **File Serialization**: Images converted to Base64 for localStorage compatibility

### **5. Enhanced Library System**
- **Library Component** (`Library.tsx`): Large Card with sorting dropdown, hydration-aware loading
- **TranscriptCard** (`TranscriptCard.tsx`): Individual cards showing editable titles, truncated text, metadata
- **TranscriptDetails** (`TranscriptDetails.tsx`): Sheet with editable title and triple tabs
  - **Raw Transcript Tab**: Editable textarea (single source of truth)
  - **Generate PRD Tab**: Structured prompt context with auto-save PRD functionality
  - **UI Designs Tab**: Comprehensive design generation with per-transcript image storage
- **ContextCard** (`ContextCard.tsx`): Supports both prompt viewing and PRD display
- **PromptDetails** (`PromptDetails.tsx`): Unified content viewer for all content types with markdown rendering, character count, and copy functionality

### **6. Unified Content Viewing System**
- **PromptDetails Component**: Single component for viewing all content types (prompts, transcripts, PRDs)
- **Markdown Rendering**: All content displayed with proper markdown formatting via MarkdownViewer
- **Copy Functionality**: Built-in copy button for all content types
- **Character Count**: Optional metadata display showing content length
- **Direct Content Support**: Can display both file-based content and direct content via `directContent` prop
- **Consistent UI**: Unified viewing experience across all content types with proper Sheet sizing

### **7. UI Design Generation System**
- **Per-Transcript Storage**: Images, JSON prompts, designs stored per transcript
- **Image Persistence**: File → Base64 conversion for localStorage storage
- **Sheet-Based Upload**: Clean upload interface with drag & drop + click-to-browse
- **Context Selection**: Multiple context card types (App Description, PRDs, Master Prompts, Images)
- **JSON Prompt Generation**: Structured prompts using Gemini 2.5 Pro for design specifications
- **Design Generation**: Fal AI Flux Schnell model for UI mockup creation (1-3 variations)
- **Full-Screen Viewer**: Image viewer with zoom controls and download functionality

### **8. Hydration & Browser Compatibility**
- **BodyAttributeHandler**: Removes browser extension attributes that cause hydration mismatches
- **HydrationErrorBoundary**: Graceful error handling with user-friendly fallbacks
- **Extension Compatibility**: Handles password managers, Grammarly, and other extensions
- **SSR Safety**: Proper client-side rendering for components that need browser APIs

## 📊 Enhanced Data Types

### **Complete Transcript Storage (`types/index.ts`)**
```typescript
interface GeneratedPRD {
  content: string;
  generatedAt: Date;
  contextUsed: string[];
}

interface SerializableImageRef {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string; // Base64 for persistence
  uploadedAt: Date;
}

interface TranscriptUIDesigns {
  uploadedImages: SerializableImageRef[];
  generatedJsonPrompt: string | null;
  generatedDesigns: GeneratedUIDesign[];
  designGenerationCount: number;
  lastModified: Date;
}

interface Transcript {
  id: string;
  title: string;
  text: string; // Single source of truth
  createdAt: Date;
  updatedAt: Date;
  status: 'processing' | 'completed' | 'error';
  generatedPRD?: GeneratedPRD; // Auto-saved PRDs
  uiDesigns?: TranscriptUIDesigns; // Per-transcript UI data
}
```

## 🗄️ Storage Architecture

### **Storage Keys**
- `voice-transcription-transcripts` - All transcript data including PRDs and UI designs
- `prompt-content-{filename}.md` - Cached master prompts (1-hour expiry)
- `transcript-migration-attempted` - Migration tracking (sessionStorage)

### **Data Persistence**
- ✅ **Transcript Cards**: All basic data (title, text, dates, status)
- ✅ **Generated PRDs**: Content, metadata, context used
- ✅ **UI Design Data**: Images (Base64), JSON prompts, generated designs
- ✅ **Raw Transcript Edits**: Changes in Raw Transcript tab persist
- ✅ **Upload Images**: Files converted to Base64 for storage
- ✅ **Generation Counts**: Per-transcript design generation tracking

## 🔄 User Flow

### **Recording & Transcription Flow**
1. **Start Recording**: Click microphone button
2. **Pause/Resume**: Use yellow pause button (toggles icons)
3. **Stop Recording**: Red stop button triggers transcription
4. **Processing**: Loading spinner during Fal AI processing
5. **Review**: Editable textarea with transcript results (auto-generated title)
6. **Save**: Transcript automatically persists to localStorage

### **Library & Management Flow**
7. **Loading**: Shows loading spinner until data hydrates from localStorage
8. **Browse Library**: View transcripts in sortable grid (newest first by default)
9. **Sort Options**: Newest First, Oldest First, By Title (dropdown menu)
10. **View Details**: Click transcript card to open detailed Sheet view
11. **Edit Content**: In-place editing of titles and transcript content (single source of truth)

### **Enhanced PRD Generation Flow**
12. **Tab Navigation**: Switch to Generate PRD tab
13. **Context Selection**: Check Ready PRD, App Description, Raw Transcription, Master Prompts
14. **Generate PRD**: Automatically saves to transcript.generatedPRD
15. **Generated Results Display**: New ContextCard appears in "Generated Results" section with timestamp and character count
16. **View Generated Content**: Click "..." → "Show Prompt" to view full PRD content in enhanced PromptDetails sheet
17. **Ready PRD Card**: Also appears as reusable context for future generations
18. **Full-Screen Viewer**: Click "Show PRD" button for dedicated PRD viewer with copy/download

### **UI Design Generation Flow**
19. **Upload Images**: Sheet-based interface with drag & drop
20. **Generate JSON Prompt**: Creates structured design prompt with selected context
21. **Generate Designs**: Creates 1-3 design variations using Fal AI
22. **View Results**: Full-screen image viewer with zoom and download
23. **Persistence**: All data saved per transcript and survives browser refresh

## 🚀 Key Architectural Benefits

### **✅ Unified Content System**
- **Single Component**: PromptDetails handles all content viewing (markdown files, transcripts, PRDs)
- **Consistent Experience**: Same UI/UX for all content types with proper Sheet sizing
- **Copy Functionality**: Built-in copy button for easy content sharing
- **Markdown Rendering**: All content properly formatted with dark theme styling
- **Reduced Code**: Eliminated duplicate viewer components (TranscriptViewer, PRDViewer)

### **✅ Complete Data Persistence**
- **Enhanced Storage**: Complete per-transcript data storage including images and PRDs
- **Hydration Management**: Proper SSR handling with loading states
- **Browser Compatibility**: Handles extension attributes gracefully
- **File Management**: Base64 serialization for localStorage persistence

## 🛠️ Development Commands

```bash
npm run dev          # Start development server (Turbopack)
npm run build        # Production build
npm run typecheck    # TypeScript validation
npm run lint         # ESLint checking
```

**Current Dev Server**: Running on `http://localhost:3010` (or next available port)

## 🐛 Known Issues & Solutions

### **✅ Recently Resolved**
- ✅ **Persistence Failure**: Fixed `skipHydration: true` that prevented data loading
- ✅ **Hydration Mismatches**: Browser extension attributes handled gracefully
- ✅ **PRD Storage**: Generated PRDs now persist and are reusable
- ✅ **Raw Transcript Source**: Content from Raw Transcript tab is single source of truth
- ✅ **UI Design Persistence**: Images and designs now saved per transcript
- ✅ **File Serialization**: Images properly converted for localStorage storage

### **Current Status**
- ✅ All transcript data persists across browser refresh
- ✅ Hydration works without console errors
- ✅ PRD generation with auto-save functionality
- ✅ Per-transcript UI design storage
- ✅ Browser extension compatibility
- ✅ Complete data migration system

## 🎯 Next Steps & Future Enhancements

### **Immediate Opportunities**
1. **Performance Optimization**: Optimize for large transcript libraries
2. **Export Features**: PDF, DOCX export for transcripts and PRDs
3. **Search Functionality**: Advanced filtering across transcripts
4. **Batch Operations**: Select multiple transcripts for bulk actions

### **Advanced Features**
1. **Design Refinement**: Allow users to refine generated designs
2. **Cloud Sync**: Optional cloud storage with conflict resolution
3. **Collaboration**: Share PRDs and designs with team members
4. **Analytics**: Track generation success rates and preferences

## 🧪 API Testing

### **Gemini API Endpoints**
```bash
# Connectivity test
curl http://localhost:3010/api/gemini

# Simple prompt
curl -X POST http://localhost:3010/api/gemini \
  -H "Content-Type: application/json" \
  -d '{"prompt":"What is the capital of France?"}'

# Test mode
curl -X POST http://localhost:3010/api/gemini \
  -H "Content-Type: application/json" \
  -d '{"test":true}'
```

## 📝 Recent Updates

### **2025-09-09 - Unified Content Viewing System**
- **Component Unification**: Replaced TranscriptViewer and PRDViewer with enhanced PromptDetails
- **Copy Functionality**: Added copy button to PromptDetails header for all content types
- **Character Count**: Added optional character count metadata display
- **Consistent Sizing**: All Sheets now use standard `sm:max-w-3xl` width
- **Markdown Rendering**: All content (transcripts, PRDs, prompts) now rendered as markdown
- **Code Cleanup**: Removed duplicate viewer components and simplified architecture

### **Key Benefits**
- **Reduced Complexity**: Single component for all content viewing needs
- **Consistent UX**: Same interface and functionality across all content types
- **Better Maintainability**: Less code duplication and easier updates
- **Enhanced Functionality**: Copy and character count features now available for all content

---

**Last Updated**: September 9, 2025  
**Status**: ✅ Unified content viewing system, ✅ Enhanced PromptDetails with copy functionality, ✅ Consistent Sheet sizing, ✅ Markdown rendering for all content types, ✅ Simplified architecture with reduced code duplication  
**Next Session**: Performance optimization, export features, and advanced search functionality