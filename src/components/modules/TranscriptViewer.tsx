'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Copy, Download, X } from 'lucide-react';

interface TranscriptViewerProps {
  isOpen: boolean;
  onClose: () => void;
  transcriptText: string;
  transcriptTitle: string;
}

export function TranscriptViewer({ isOpen, onClose, transcriptText, transcriptTitle }: TranscriptViewerProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcriptText);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([transcriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Transcript_${transcriptTitle.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full max-w-4xl bg-black/95 border-white/10">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white text-lg">
              Raw Transcription: {transcriptTitle}
            </SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-white/60 text-sm">
              <div>{transcriptText.length} characters</div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDownload}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="text-white/90 text-sm whitespace-pre-wrap leading-relaxed">
              {transcriptText}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}