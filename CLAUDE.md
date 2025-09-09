# Voice Transcription App - Claude Development Guide

## 🎯 Project Overview

This is a **Voice Transcription App** built with Next.js that allows users to record audio with pause/resume functionality and get AI-powered transcriptions via Fal AI. The app has been completely rebuilt from a complex "voice clarification" system to a clean, focused transcription tool.

## 🏗️ Current Architecture

### **Tech Stack**
- **Framework**: Next.js 15.5.2 (with Turbopack)
- **Frontend**: React 19.1.0, TypeScript
- **State Management**: Zustand with persistence
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
  "@radix-ui/react-slot": "^1.2.3",
  "@radix-ui/react-tabs": "^1.1.13",
  "@uiw/react-md-editor": "^4.0.8",
  "zustand": "^5.0.8"
}
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── transcribe/route.ts       # Fal AI transcription endpoint
│   │   ├── gemini/route.ts           # Google Gemini 2.5 Pro API endpoint
│   │   └── prompt-content/route.ts   # Markdown content serving endpoint
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Main app page with markdown preloading
├── components/
│   ├── ui/
│   │   ├── button.tsx               # shadcn Button component
│   │   ├── card.tsx                 # shadcn Card component  
│   │   ├── textarea.tsx             # shadcn Textarea component
│   │   ├── sheet.tsx                # shadcn Sheet component
│   │   ├── tabs.tsx                 # shadcn Tabs component
│   │   └── dropdown-menu.tsx        # shadcn Dropdown component
│   └── modules/
│       ├── VoiceRecorder.tsx        # Main recording component with pause/resume & title generation
│       ├── Library.tsx              # Large Card with sorting dropdown & responsive grid
│       ├── TranscriptCard.tsx       # Individual transcript cards with title/metadata
│       ├── TranscriptDetails.tsx    # Sheet with editable title & tabs (Raw Transcript | Generate PRD)
│       ├── ContextCard.tsx          # Checkable cards with three-dot menu for PRD context
│       ├── PromptDetails.tsx        # Nested Sheet for markdown display with localStorage caching
│       └── MarkdownViewer.tsx       # Reusable markdown component with dark theme styling
├── lib/
│   ├── store-zustand/
│   │   └── useAppStore.ts           # Enhanced Zustand store with tab/context management
│   ├── storage/
│   │   └── localStorage.ts          # Storage keys
│   ├── audioUtils.ts                # Audio utility functions
│   └── utils.ts                     # General utilities (cn function)
├── types/
│   └── index.ts                     # Enhanced TypeScript types with title field & tab state
└── public/
    └── MASTER_PROMPTS/
        └── Description_of_app.md    # Markdown content for prompt display
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

### **4. Enhanced Library System**
- **Library Component** (`Library.tsx`): Large Card with sorting dropdown (newest first by default)
- **TranscriptCard** (`TranscriptCard.tsx`): Individual cards showing editable titles, truncated text, metadata
- **TranscriptDetails** (`TranscriptDetails.tsx`): Sheet with editable title and dual tabs
  - **Raw Transcript Tab**: Editable textarea with original functionality
  - **Generate PRD Tab**: Context selection cards with Generate button
- **ContextCard** (`ContextCard.tsx`): Checkable cards with three-dot menu for "Show Prompt"
- **PromptDetails** (`PromptDetails.tsx`): Nested Sheet displaying markdown content with caching

### **5. Enhanced State Management (`useAppStore.ts`)**
- **Simplified Structure**: Focus on transcripts vs complex recordings
- **Pause State**: Tracks recording pause/resume state
- **Tab Management**: Active tab state for TranscriptDetails (transcript | generate-prd)
- **Context Selection**: Selected context cards for PRD generation
- **Title Support**: Handles transcript titles with auto-generation
- **Persistence**: Auto-saves transcripts with new fields to localStorage
- **Date Handling**: Proper serialization/deserialization of Date objects

### **6. Markdown & Content System**
- **MarkdownViewer** (`MarkdownViewer.tsx`): Dark theme markdown display with custom CSS
- **Content API** (`/api/prompt-content/route.ts`): Serves markdown from public folder
- **Caching Strategy**: localStorage with 1-hour expiration for instant loading
- **Preloading**: App preloads markdown content on startup for seamless UX

## 📊 Data Types

### **Core Types (`types/index.ts`)**
```typescript
interface Transcript {
  id: string;
  title: string;                    // NEW: Auto-generated from first 6 words
  text: string;
  audioUrl?: string;
  audioBlob?: Blob;
  createdAt: Date;
  updatedAt: Date;
  duration?: number;
  status: 'processing' | 'completed' | 'error';
}

interface AppState {
  transcripts: Transcript[];
  currentTranscript: Transcript | null;
  isRecording: boolean;
  isPaused: boolean;
  isProcessing: boolean;
  error: string | null;
  selectedContextCards: string[];   // NEW: Context cards for PRD generation
  activeTab: 'transcript' | 'generate-prd'; // NEW: Tab state management
}
```

## 🎨 UI/UX Design

### **Design System**
- **Theme**: Glass morphism with dark background
- **Colors**: White text with opacity variations, blue/green accents
- **Layout**: Centered content, max-width containers
- **Responsive**: Mobile-first design with responsive grids

### **Key Components**
- **Record Voice Card**: Central recording interface with title auto-generation
- **Library Card**: Large container with sorting dropdown and responsive grid
- **TranscriptCard**: Individual previews showing titles, truncated text, metadata
- **TranscriptDetails Sheet**: Editable title, dual tabs (Raw Transcript | Generate PRD)
- **ContextCard**: Checkable cards with dropdown menu for prompt viewing
- **PromptDetails Sheet**: Nested markdown viewer with dark theme styling
- **Error Display**: Inline error messages with icons

## 🔄 Enhanced User Flow

### **Recording Flow**
1. **Start Recording**: Click microphone button
2. **Pause/Resume**: Use yellow pause button (toggles icons)
3. **Stop Recording**: Red stop button triggers transcription
4. **Processing**: Loading spinner during Fal AI processing
5. **Review**: Editable textarea with transcript results (auto-generated title)
6. **Save/Discard**: Add to library or discard with confirmation

### **Library Management Flow**
7. **Browse Library**: View transcripts in sortable grid (newest first by default)
8. **Sort Options**: Newest First, Oldest First, By Title (dropdown menu)
9. **View Details**: Click transcript card to open detailed Sheet view
10. **Edit Title/Text**: In-place editing of titles and transcript content
11. **Tab Navigation**: Switch between Raw Transcript and Generate PRD tabs
12. **Context Selection**: Check/uncheck context cards for PRD generation
13. **View Prompts**: Click three-dot menu → "Show Prompt" to view markdown content
14. **Generate PRD**: Use selected context cards with transcript for AI generation

## 🐛 Known Issues & Recent Fixes

### **Recently Resolved**
- ✅ **Major UI/UX Refactor**: Complete rebuild of library and transcript management system
- ✅ **Component Architecture**: Separated concerns into modular, reusable components  
- ✅ **Zustand State Management**: Enhanced with tab navigation and context selection
- ✅ **Markdown Display**: Fixed dark theme styling with proper contrast for code blocks
- ✅ **Content Loading**: Resolved 404 errors with proper API route and localStorage caching
- ✅ **Type Safety**: Updated TypeScript types for new title field and tab management

### **Recently Updated**
- ✅ **Library System**: Replaced single TranscriptLibrary with modular Library + TranscriptCard + TranscriptDetails
- ✅ **Tab Interface**: Added dual-tab system (Raw Transcript | Generate PRD) with shadcn tabs
- ✅ **Context Management**: Implemented checkable context cards for PRD generation workflow
- ✅ **Markdown Integration**: Added @uiw/react-md-editor with custom dark theme styling
- ✅ **Sorting & Filtering**: Date-based sorting with shadcn dropdown (newest, oldest, by title)
- ✅ **Title Auto-generation**: Automatic title creation from first 6 words of transcript

## 🛠️ Development Commands

```bash
npm run dev          # Start development server (Turbopack)
npm run build        # Production build
npm run typecheck    # TypeScript validation
npm run lint         # ESLint checking
```

**Current Dev Server**: Running on `http://localhost:3004`

## 🔍 Debugging & Logging

### **Comprehensive Logging Added**
- **Client Side**: Browser console logs for recording, chunking, API calls
- **Server Side**: Detailed API endpoint logs with emojis for easy identification
- **Error Tracking**: Specific error messages with full context

### **Debug Patterns**
- 🎙️ Recording format selection
- 📦 Audio chunk processing  
- 🎯 API request details
- 📁 File validation
- 🤖 Fal AI processing steps
- 🧠 Gemini AI processing steps
- 📄 Markdown content loading and caching
- 🗂️ Context card selection and tab navigation
- ❌ Error details with stack traces

## 📋 TODO for Next AI Agent

### **Immediate Priority**
1. **PRD Generation**: Implement actual AI processing for Generate PRD functionality using Gemini API
2. **Context Integration**: Connect selected context cards with transcript for PRD generation
3. **Enhanced Sorting**: Add more sorting options (by date modified, by title length, etc.)
4. **Performance**: Optimize for large transcript libraries and markdown caching

### **Future Enhancements**
1. **Multiple Context Cards**: Add more context card types beyond "Entire App PRD"
2. **Export Options**: PDF, TXT, DOCX export functionality for transcripts and generated PRDs
3. **Search & Filter**: Full-text search through transcript library and content
4. **Batch Operations**: Select multiple transcripts for bulk actions (delete, export, etc.)
5. **Advanced Markdown**: Support for multiple markdown files and dynamic content loading
6. **Cloud Sync**: Optional cloud storage integration with conflict resolution

## 🚀 Getting Started (for New AI Agent)

1. **Environment**: Ensure `.env.local` has valid `FAL_KEY` and `GOOGLE_GENERATIVE_AI_API_KEY`
2. **Dependencies**: Run `npm install` 
3. **Development**: Start with `npm run dev`
4. **Testing**: Test complete flow: recording → transcription → library browsing → PRD workflow
5. **Components**: Test all new UI components (tabs, dropdowns, nested sheets, markdown display)
6. **Debugging**: Check browser console and server logs for API calls and caching
7. **Validation**: Run `npm run typecheck` for TS errors

## 🧪 API Testing

### **Gemini API Endpoints**
```bash
# Connectivity test
curl http://localhost:3006/api/gemini

# Simple prompt
curl -X POST http://localhost:3006/api/gemini \
  -H "Content-Type: application/json" \
  -d '{"prompt":"What is the capital of France?"}'

# Test mode
curl -X POST http://localhost:3006/api/gemini \
  -H "Content-Type: application/json" \
  -d '{"test":true}'
```

## 📝 Recent Changes Log

### **2025-01-08 - Major Rebuild & Whisper Integration**
- Completely rebuilt app from complex "voice clarification" to focused transcription
- Removed: FileUploader, ProcessingStatus, ErrorDisplay, RecordingsList components  
- Added: Enhanced pause/resume recording, Fal AI integration, Sheet component
- Updated: Simplified data structure, improved error handling
- Fixed: Audio format compatibility, TypeScript errors, state persistence
- Upgraded: FAL Whisper model integration for improved transcription accuracy

### **2025-09-09 - Major UI/UX Refactor & Enhanced Components**
- **Complete Library Overhaul**: Replaced TranscriptLibrary with modular component system
- **New Components**: Library, TranscriptCard, TranscriptDetails, ContextCard, PromptDetails, MarkdownViewer (6 new components)
- **Enhanced Features**: Editable titles, auto-generation, sorting dropdown, dual-tab system, context selection
- **Dependencies**: Added `@uiw/react-md-editor`, `@radix-ui/react-tabs`, `@radix-ui/react-dropdown-menu`
- **State Management**: Enhanced Zustand with tab navigation, context card selection, title support
- **Markdown System**: Dark theme styling, localStorage caching, preloading, proper API routes
- **Type Safety**: Updated TypeScript interfaces with new fields and comprehensive type coverage

### **Key Metrics (Latest Refactor)**
- **Code Changes**: +723 lines added, -22 lines removed (major UI/UX overhaul)
- **Components**: 1 removed (TranscriptLibrary), 6 new components added, 2 enhanced (VoiceRecorder, main page)
- **New Dependencies**: 3 major packages (@uiw/react-md-editor, tabs, dropdown-menu)
- **API Integration**: Added markdown content serving with caching strategy
- **User Experience**: Enhanced from basic library to sophisticated transcript management system

---

**Last Updated**: September 9, 2025  
**Status**: ✅ Core functionality complete, ✅ Major UI/UX refactor complete, ✅ Enhanced library system, ✅ Markdown integration  
**Next Session**: Implement PRD generation using Gemini API with selected context cards and transcripts