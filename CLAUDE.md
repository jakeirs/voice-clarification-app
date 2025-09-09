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
│   ├── layout.tsx                       # Root layout
│   └── page.tsx                         # Main app page with markdown preloading
├── components/
│   ├── ui/
│   │   ├── button.tsx                  # shadcn Button component
│   │   ├── card.tsx                    # shadcn Card component  
│   │   ├── textarea.tsx                # shadcn Textarea component
│   │   ├── sheet.tsx                   # shadcn Sheet component
│   │   ├── tabs.tsx                    # shadcn Tabs component
│   │   ├── slider.tsx                  # shadcn Slider component
│   │   └── dropdown-menu.tsx           # shadcn Dropdown component
│   └── modules/
│       ├── VoiceRecorder.tsx           # Main recording component with pause/resume & title generation
│       ├── Library.tsx                 # Large Card with sorting dropdown & responsive grid
│       ├── TranscriptCard.tsx          # Individual transcript cards with title/metadata
│       ├── TranscriptDetails.tsx       # Sheet with editable title & triple tabs (Raw | Generate PRD | UI Designs)
│       ├── ContextCard.tsx             # Checkable cards with three-dot menu for context prompts
│       ├── PromptDetails.tsx           # Nested Sheet for markdown display with localStorage caching
│       ├── MarkdownViewer.tsx          # Reusable markdown component with dark theme styling
│       ├── GeneratePRDTab.tsx          # Dedicated PRD generation tab with structured prompts
│       ├── UIDesignsTab.tsx            # UI design generation tab with context selection
│       ├── ImageReferencesCard.tsx     # Context card with thumbnail display & Sheet-based upload
       ├── ImageUploadSheet.tsx        # Dedicated Sheet for drag & drop + click-to-browse image upload
│       ├── ImageViewerDialog.tsx       # Full-screen image viewer with zoom/download
│       └── ExamplesModal.tsx           # Reference examples gallery modal
├── lib/
│   ├── store-zustand/
│   │   └── useAppStore.ts              # Enhanced Zustand store with UI designs state management
│   ├── storage/
│   │   └── localStorage.ts             # Storage keys
│   ├── promptBuilder.ts                # Structured prompt builder with conditional XML sections
│   ├── audioUtils.ts                   # Audio utility functions
│   └── utils.ts                        # General utilities (cn function)
├── types/
│   └── index.ts                        # Enhanced TypeScript types with UI designs & structured prompts
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

### **4. Enhanced Library System**
- **Library Component** (`Library.tsx`): Large Card with sorting dropdown (newest first by default)
- **TranscriptCard** (`TranscriptCard.tsx`): Individual cards showing editable titles, truncated text, metadata
- **TranscriptDetails** (`TranscriptDetails.tsx`): Sheet with editable title and triple tabs
  - **Raw Transcript Tab**: Editable textarea with original functionality
  - **Generate PRD Tab**: Structured prompt context selection with Raw Transcription & Master Prompt cards
  - **UI Designs Tab**: Comprehensive design generation workflow with image uploads
- **ContextCard** (`ContextCard.tsx`): Checkable cards with three-dot menu for "Show Prompt"
- **PromptDetails** (`PromptDetails.tsx`): Nested Sheet displaying markdown content with caching

### **5. Enhanced State Management (`useAppStore.ts`)**
- **Simplified Structure**: Focus on transcripts vs complex recordings
- **Pause State**: Tracks recording pause/resume state
- **Tab Management**: Active tab state for TranscriptDetails (transcript | generate-prd | ui-designs)
- **Context Selection**: Selected context cards for both PRD and UI design generation
- **Title Support**: Handles transcript titles with auto-generation
- **UI Designs State**: Image uploads, JSON prompts, generated designs, generation counts
- **Persistence**: Auto-saves transcripts with new fields to localStorage
- **Date Handling**: Proper serialization/deserialization of Date objects

### **6. Structured Prompt System**
- **Prompt Builder** (`promptBuilder.ts`): Conditional XML section generation for structured prompts
- **Markdown & Content System**: Enhanced markdown display with multiple master prompts
- **MarkdownViewer** (`MarkdownViewer.tsx`): Dark theme markdown display with custom CSS
- **Content API** (`/api/prompt-content/route.ts`): Serves markdown from public folder
- **Caching Strategy**: localStorage with 1-hour expiration for instant loading
- **Structured Format**: Conditional XML-like sections (`<App-description>`, `<PRD>`, `<Provided-image-references>`)

### **7. UI Design Generation System**
- **Image Management**: Sheet-based upload system with thumbnail display in context cards
- **ImageReferencesCard**: Displays thumbnails when images uploaded, click-to-upload button when empty
- **ImageUploadSheet**: Dedicated Sheet with drag & drop + click-to-browse functionality
- **Context Selection**: Multiple context card types (App Description, PRDs, Master Prompts, Images)
- **JSON Prompt Generation**: Structured prompts using Gemini 2.5 Pro for design specifications
- **Design Generation**: Fal AI Flux Schnell model for UI mockup creation (1-3 variations)
- **Image Viewer**: Full-screen modal with zoom controls and download functionality
- **Examples Gallery**: Reference design inspiration with modal viewing

## 📊 Data Types

### **Core Types (`types/index.ts`)**
```typescript
interface Transcript {
  id: string;
  title: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'processing' | 'completed' | 'error';
}

interface GeneratedDesign {
  id: string;
  url: string;
  prompt: string;
  createdAt: Date;
}

interface AppState {
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
- **TranscriptDetails Sheet**: Editable title, triple tabs (Raw Transcript | Generate PRD | UI Designs)
- **ContextCard**: Checkable cards with dropdown menu for prompt viewing
- **ImageReferencesCard**: Context card showing image thumbnails with Sheet-based upload
- **ImageViewerDialog**: Full-screen image viewer with zoom/download controls
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
11. **Tab Navigation**: Switch between Raw Transcript, Generate PRD, and UI Designs tabs
12. **Context Selection**: Check/uncheck context cards for generation (App Description, PRDs, Master Prompts, Images)
13. **View Prompts**: Click three-dot menu → "Show Prompt" to view markdown content
14. **Generate PRD**: Use structured prompts with selected context cards
15. **UI Design Workflow**: Upload images → Generate JSON prompt → Generate 1-3 design variations → View/download results

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
- ✅ **Tab Interface**: Enhanced to triple-tab system (Raw Transcript | Generate PRD | UI Designs)
- ✅ **Structured Prompts**: Implemented conditional XML sections for both PRD and UI design generation
- ✅ **Context Management**: Enhanced context cards with Raw Transcription, Master Prompts, and PRD selection
- ✅ **UI Design Generation**: Complete workflow from image upload to design generation with Fal AI
- ✅ **Image Management**: Sheet-based upload system with thumbnail display and full-screen viewer
- ✅ **Markdown Integration**: Multiple master prompts (GENERATE_PRD.md, GEN_DESIGN.md) with caching
- ✅ **Sorting & Filtering**: Date-based sorting with shadcn dropdown (newest, oldest, by title)
- ✅ **Title Auto-generation**: Automatic title creation from first 6 words of transcript

## 🛠️ Development Commands

```bash
npm run dev          # Start development server (Turbopack)
npm run build        # Production build
npm run typecheck    # TypeScript validation
npm run lint         # ESLint checking
```

**Current Dev Server**: Running on `http://localhost:3007`

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
- 🗂️ Context card selection and triple-tab navigation
- 🏗️ Structured prompt building with conditional XML sections
- 🎨 UI design generation workflow and image management
- 📸 Sheet-based image upload system with thumbnail display and viewer functionality
- ❌ Error details with stack traces

## 📋 TODO for Next AI Agent

### **Immediate Priority**
1. **Performance Optimization**: Optimize for large transcript libraries and image caching
2. **Error Handling**: Enhanced error states for API failures and network issues
3. **Export Features**: PDF, TXT, DOCX export for transcripts, PRDs, and generated designs
4. **Advanced Filtering**: Add search functionality across transcripts and generated content

### **Future Enhancements**
1. **Design Refinement**: Allow users to refine generated designs with additional prompts
2. **Batch Operations**: Select multiple transcripts for bulk actions (delete, export, etc.)
3. **Advanced Context**: More context card types (competitor analysis, user research, etc.)
4. **Design Templates**: Pre-built design templates for common app types
5. **Collaboration**: Share generated PRDs and designs with team members
6. **Cloud Sync**: Optional cloud storage integration with conflict resolution
7. **Analytics**: Track generation success rates and user preferences

## 🚀 Getting Started (for New AI Agent)

1. **Environment**: Ensure `.env.local` has valid `FAL_KEY` and `GOOGLE_GENERATIVE_AI_API_KEY`
2. **Dependencies**: Run `npm install` 
3. **Development**: Start with `npm run dev`
4. **Testing**: Test complete flows:
   - Recording → transcription → library browsing
   - PRD generation with structured prompts
   - UI design generation with image uploads
5. **Components**: Test all UI components (triple tabs, image upload, design viewer, structured prompts)
6. **Debugging**: Check browser console and server logs for API calls, caching, and image processing
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
- **Enhanced Features**: Editable titles, auto-generation, sorting dropdown, triple-tab system, context selection
- **Dependencies**: Added `@uiw/react-md-editor`, `@radix-ui/react-tabs`, `@radix-ui/react-dropdown-menu`
- **State Management**: Enhanced Zustand with tab navigation, context card selection, title support
- **Markdown System**: Dark theme styling, localStorage caching, preloading, proper API routes
- **Type Safety**: Updated TypeScript interfaces with new fields and comprehensive type coverage

### **2025-09-09 - Structured Prompts & UI Design Generation System**
- **Structured Prompt Builder**: Conditional XML sections with prompt builder utility
- **UI Designs Tab**: Complete design generation workflow with image uploads
- **Enhanced Generate PRD**: Raw Transcription and Master Prompt context cards
- **New Components**: GeneratePRDTab, UIDesignsTab, ImageReferencesCard, ImageUploadSheet, ImageViewerDialog, ExamplesModal (6 new components)
- **File Upload System**: Sheet-based upload with drag & drop + click-to-browse functionality
- **API Enhancements**: generate-json-prompt and generate-design routes with Fal AI integration
- **Image Management**: Full-screen viewer with zoom, download, and gallery functionality
- **Dependencies**: Added `@radix-ui/react-slider`, `react-dropzone` for enhanced UI controls

### **2025-09-09 - Enhanced Image Upload UX**
- **Sheet-based Upload**: Moved drag & drop functionality from inline to dedicated Sheet
- **Thumbnail Display**: ImageReferencesCard now shows uploaded images as thumbnails
- **Click-to-Upload**: Clean upload button interface when no images present
- **New Component**: ImageUploadSheet with enhanced file management
- **Better UX**: Separation of viewing (thumbnails) from uploading (Sheet)
- **File Management**: Preview, remove individual files, clear all functionality
- **Responsive Design**: Grid layout with overflow indication (+count for >5 images)

### **Key Metrics (Complete Implementation)**
- **Code Changes**: +1927 lines added, -203 lines removed (comprehensive system overhaul)
- **Components**: 12 new components added, 6 existing components enhanced  
- **New Dependencies**: 5 major packages (markdown editor, tabs, dropdown, slider, dropzone)
- **API Integration**: 4 API routes (transcribe, gemini, generate-json-prompt, generate-design)
- **User Experience**: Evolved from basic transcription to full AI-powered design generation platform
- **Structured Prompts**: Conditional XML format for both PRD and UI design generation
- **Image Management**: Complete Sheet-based upload, thumbnail display, generation, and viewing system

---

**Last Updated**: September 9, 2025  
**Status**: ✅ Core functionality complete, ✅ Structured prompt system complete, ✅ UI design generation complete, ✅ Enhanced PRD generation, ✅ Sheet-based image upload system  
**Next Session**: Performance optimization, error handling improvements, and export functionality