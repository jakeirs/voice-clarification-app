# Voice Clarification App

A modern, mobile-first web application for recording, uploading, and AI-powered clarification of voice recordings. Built with Next.js 15, TypeScript, and a beautiful glass morphism design.

## ✨ Features

- **Voice Recording**: High-quality audio recording with real-time duration tracking
- **File Upload**: Drag & drop interface supporting multiple audio formats
- **AI Processing**: OpenAI integration for transcription and text clarification (coming soon)
- **Mobile-First Design**: Responsive glass morphism UI optimized for mobile devices
- **State Management**: Zustand store with LocalStorage persistence
- **Error Handling**: Comprehensive error system with retry functionality

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom glass morphism utilities
- **UI Components**: shadcn/ui + Lucide React icons
- **State Management**: Zustand with LocalStorage persistence
- **File Handling**: react-dropzone with drag & drop support
- **AI Integration**: OpenAI SDK (ready for implementation)

## 📁 Project Structure

```
voice-clarification-app/
├── src/
│   ├── app/
│   │   ├── page.tsx                     # Main portal page
│   │   ├── globals.css                  # Global styles with glass morphism
│   │   └── api/                         # API routes for transcription/clarification
│   ├── components/
│   │   ├── ui/                          # shadcn/ui components
│   │   └── modules/                     # Custom feature components
│   ├── lib/
│   │   ├── utils.ts                     # Tailwind utility functions
│   │   ├── audioUtils.ts                # Audio processing utilities
│   │   ├── store-zustand/               # Zustand store configuration
│   │   └── storage/                     # LocalStorage utilities
│   └── types/                           # TypeScript interfaces
├── tests/                               # API and functionality tests
└── public/                              # Static assets
```

## 🛠️ Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

## 📱 Usage

1. **Record Voice**: Click the microphone button to start recording
2. **Upload Files**: Drag and drop audio files or click to browse
3. **View Recordings**: All recordings are saved locally and displayed in the list
4. **Play/Download**: Use controls to play back or download recordings

## 🔧 Development Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run test suites
- `npm run typecheck` - Run TypeScript compiler check

## 🎨 Design Features

- **Glass Morphism**: Modern UI with backdrop blur effects
- **Responsive Grid**: 1-5 column adaptive layout
- **Mobile-First**: Optimized for touch interfaces
- **Dark Theme**: Beautiful gradient backgrounds
- **Smooth Animations**: Micro-interactions and loading states

## 🔮 Future Enhancements

- OpenAI Whisper integration for speech-to-text
- GPT integration for text clarification and enhancement
- User authentication and cloud storage
- Advanced audio processing features
- Export to multiple formats
- Batch processing capabilities

## 📝 License

This project is created for demonstration purposes.

---

Built with ❤️ using Next.js 15 and modern web technologies.
