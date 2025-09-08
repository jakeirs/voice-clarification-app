'use client';

import { useAppStore } from '@/lib/store-zustand/useAppStore';
import { VoiceRecorder } from '@/components/modules/VoiceRecorder';
import { FileUploader } from '@/components/modules/FileUploader';
import { RecordingsList } from '@/components/modules/RecordingsList';
import { ProcessingStatus } from '@/components/modules/ProcessingStatus';
import { ErrorDisplay } from '@/components/modules/ErrorDisplay';
import { Card } from '@/components/ui/card';
import { Mic, Upload, FileAudio, Settings } from 'lucide-react';

export default function Home() {
  const { recordings, error, isProcessing, isRecording } = useAppStore();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Voice Clarification App
          </h1>
          <p className="text-white/80 text-base md:text-lg">
            Record, upload, and clarify your audio with AI
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <ErrorDisplay />
          </div>
        )}

        {/* Processing Status */}
        {isProcessing && (
          <div className="mb-6">
            <ProcessingStatus />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Voice Recorder */}
          <Card className="glass-card p-6 col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Record Voice</h2>
                <p className="text-sm text-white/70">Start a new recording</p>
              </div>
            </div>
            <VoiceRecorder />
          </Card>

          {/* File Uploader */}
          <Card className="glass-card p-6 col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Upload Audio</h2>
                <p className="text-sm text-white/70">Drop or select files</p>
              </div>
            </div>
            <FileUploader />
          </Card>

          {/* Quick Stats */}
          <Card className="glass-card p-6 col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <FileAudio className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Statistics</h2>
                <p className="text-sm text-white/70">Your recordings</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Total Recordings</span>
                <span className="text-white font-medium">{recordings.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Completed</span>
                <span className="text-white font-medium">
                  {recordings.filter(r => r.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Processing</span>
                <span className="text-white font-medium">
                  {recordings.filter(r => r.status === 'processing').length}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Recordings List */}
        {recordings.length > 0 && (
          <div className="mt-8">
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <FileAudio className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Your Recordings</h2>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors text-white text-sm">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
              <RecordingsList />
            </Card>
          </div>
        )}

        {/* Empty State */}
        {recordings.length === 0 && !isRecording && !isProcessing && (
          <div className="mt-12 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-white/40" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No recordings yet</h3>
            <p className="text-white/60 max-w-md mx-auto">
              Start by recording your voice or uploading an audio file to get AI-powered 
              clarifications and transcriptions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}