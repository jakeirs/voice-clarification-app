'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store-zustand/useAppStore';
import { VoiceRecorder } from '@/components/modules/VoiceRecorder';
import { Library } from '@/components/modules/Library';
import { Card } from '@/components/ui/card';
import { ClientOnlyProvider } from '@/components/ClientOnlyProvider';
import { Mic, AlertCircle } from 'lucide-react';
import '@/lib/cache-utils'; // Clear incorrect cached data
import { runMigrationIfNeeded } from '@/lib/migration-utils';

export default function Home() {
  const { error } = useAppStore();

  // Run data migration on app startup
  useEffect(() => {
    runMigrationIfNeeded();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Voice Transcription App
          </h1>
          <p className="text-white/80 text-base md:text-lg">
            Record your voice and get AI-powered transcriptions instantly
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <Card className="glass-card p-4 border-l-4 border-red-500">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-100">{error}</p>
              </div>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          {/* Voice Recorder Card */}
          <Card className="glass-card p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Record Voice</h2>
                <p className="text-sm text-white/70">Start recording and get instant transcription</p>
              </div>
            </div>
            <ClientOnlyProvider>
              <VoiceRecorder />
            </ClientOnlyProvider>
          </Card>

          {/* Transcript Library */}
          <ClientOnlyProvider>
            <Library />
          </ClientOnlyProvider>
        </div>
      </div>
    </div>
  );
}