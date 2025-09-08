'use client';

import { useAppStore } from '@/lib/store-zustand/useAppStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

export function ErrorDisplay() {
  const { error, clearError, retryProcessing } = useAppStore();
  
  if (!error) return null;

  return (
    <Card className="glass border-red-500/30 p-4">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5 text-red-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-red-400 mb-1">Error</h3>
          <p className="text-sm text-white/80 break-words">
            {error}
          </p>
        </div>
        
        <div className="flex items-center space-x-1 flex-shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={clearError}
            className="w-7 h-7 p-0 hover:bg-red-500/20 text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}