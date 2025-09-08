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
- **AI Integration**: Fal AI speech-to-text API
- **Icons**: Lucide React

### **Key Dependencies**
```json
{
  "@fal-ai/client": "^1.6.2",
  "@radix-ui/react-dialog": "^1.1.15", 
  "@radix-ui/react-portal": "^1.1.9",
  "@radix-ui/react-slot": "^1.2.3",
  "zustand": "^5.0.8"
}
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── transcribe/route.ts       # Fal AI transcription endpoint
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Main app page
├── components/
│   ├── ui/
│   │   ├── button.tsx               # shadcn Button component
│   │   ├── card.tsx                 # shadcn Card component  
│   │   ├── textarea.tsx             # shadcn Textarea component
│   │   └── sheet.tsx                # shadcn Sheet component (for transcript details)
│   └── modules/
│       ├── VoiceRecorder.tsx        # Main recording component with pause/resume
│       └── TranscriptLibrary.tsx    # Grid library with Sheet integration
├── lib/
│   ├── store-zustand/
│   │   └── useAppStore.ts           # Zustand state management
│   ├── storage/
│   │   └── localStorage.ts          # Storage keys
│   ├── audioUtils.ts                # Audio utility functions
│   └── utils.ts                     # General utilities (cn function)
└── types/
    └── index.ts                     # TypeScript type definitions
```

## 🔧 Environment Configuration

### **Required Environment Variables (.env.local)**
```env
FAL_KEY=your_fal_ai_api_key_here
```

**Current FAL_KEY**: `dd171c26-b20a-4239-9d85-95b47900b819:5220783fba12c20a813e9e65d63844cf`

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

### **3. Transcript Library (`TranscriptLibrary.tsx`)**  
- **Grid Layout**: Responsive 3-column grid of transcript cards
- **Sheet Integration**: Detailed view using shadcn Sheet component
- **Edit Functionality**: In-place editing of transcripts
- **Audio Playback**: Play original recording from library
- **Metadata Display**: Creation date, time, duration with icons

### **4. State Management (`useAppStore.ts`)**
- **Simplified Structure**: Focus on transcripts vs complex recordings
- **Pause State**: Tracks recording pause/resume state
- **Persistence**: Auto-saves transcripts to localStorage
- **Date Handling**: Proper serialization/deserialization of Date objects

## 📊 Data Types

### **Core Types (`types/index.ts`)**
```typescript
interface Transcript {
  id: string;
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
}
```

## 🎨 UI/UX Design

### **Design System**
- **Theme**: Glass morphism with dark background
- **Colors**: White text with opacity variations, blue/green accents
- **Layout**: Centered content, max-width containers
- **Responsive**: Mobile-first design with responsive grids

### **Key Components**
- **Record Voice Card**: Central recording interface
- **Transcript Library**: Grid of transcript previews  
- **Sheet Details**: Full transcript view with editing
- **Error Display**: Inline error messages with icons

## 🔄 User Flow

1. **Start Recording**: Click microphone button
2. **Pause/Resume**: Use yellow pause button (toggles icons)
3. **Stop Recording**: Red stop button triggers transcription
4. **Processing**: Loading spinner during Fal AI processing
5. **Review**: Editable textarea with transcript results
6. **Save/Discard**: Add to library or discard with confirmation
7. **Library Management**: View, edit, play, delete transcripts

## 🐛 Known Issues & Recent Fixes

### **Recently Resolved**
- ✅ **Zustand Persistence**: Fixed Date object serialization
- ✅ **Type Errors**: Resolved Fal AI client TypeScript issues  
- ✅ **Audio Format Compatibility**: Added support for Fal AI formats
- ✅ **Error Handling**: Comprehensive logging and user feedback

### **Recently Updated**
- ✅ **FAL Whisper Integration**: Upgraded from `fal-ai/speech-to-text` to `fal-ai/whisper` model
- ✅ **Audio Format Compatibility**: Updated supported formats for Whisper compatibility
- ✅ **API Response Handling**: Fixed response parsing for Whisper's output format

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
- ❌ Error details with stack traces

## 📋 TODO for Next AI Agent

### **Immediate Priority**
1. **Test Current Audio Fixes**: Verify Fal AI compatibility improvements work
2. **Handle Edge Cases**: Empty recordings, network failures, permission issues
3. **Performance**: Optimize for large transcript libraries

### **Future Enhancements**
1. **Export Options**: PDF, TXT, DOCX export functionality
2. **Search & Filter**: Search through transcript library
3. **Batch Operations**: Select multiple transcripts for actions
4. **Audio Quality**: Waveform visualization, audio trimming
5. **Cloud Sync**: Optional cloud storage integration

## 🚀 Getting Started (for New AI Agent)

1. **Environment**: Ensure `.env.local` has valid `FAL_KEY`
2. **Dependencies**: Run `npm install` 
3. **Development**: Start with `npm run dev`
4. **Testing**: Test recording → transcription flow
5. **Debugging**: Check browser console and server logs
6. **Validation**: Run `npm run typecheck` for TS errors

## 📝 Recent Changes Log

### **2025-01-08 - Major Rebuild & Whisper Integration**
- Completely rebuilt app from complex "voice clarification" to focused transcription
- Removed: FileUploader, ProcessingStatus, ErrorDisplay, RecordingsList components  
- Added: Enhanced pause/resume recording, Fal AI integration, Sheet component
- Updated: Simplified data structure, improved error handling
- Fixed: Audio format compatibility, TypeScript errors, state persistence
- Upgraded: FAL Whisper model integration for improved transcription accuracy

### **Key Metrics**
- **Code Changes**: +1,092 lines added, -365 lines removed
- **Components**: 4 removed, 2 enhanced, 1 added (Sheet)
- **API Integration**: Switched from mock to real Fal AI implementation, upgraded to Whisper model
- **User Experience**: Streamlined from complex multi-step to simple record→edit→save flow

---

**Last Updated**: January 8, 2025  
**Status**: ✅ Core functionality complete, ✅ FAL Whisper model integrated  
**Next Session**: Test Whisper integration, verify improved transcription quality