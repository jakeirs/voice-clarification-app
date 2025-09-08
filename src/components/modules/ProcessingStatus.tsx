'use client';

import { useAppStore } from '@/lib/store-zustand/useAppStore';
import { Card } from '@/components/ui/card';
import { Loader2, Zap } from 'lucide-react';

export function ProcessingStatus() {
  const { isProcessing, recordings } = useAppStore();
  
  if (!isProcessing) return null;

  const processingRecordings = recordings.filter(r => r.status === 'processing');

  return (
    <Card className="glass p-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-white">Processing Audio</h3>
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-sm text-white/70">
            {processingRecordings.length > 0 
              ? `Processing ${processingRecordings.length} recording${processingRecordings.length > 1 ? 's' : ''}...`
              : 'AI is analyzing your audio...'
            }
          </p>
        </div>
        
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </Card>
  );
}