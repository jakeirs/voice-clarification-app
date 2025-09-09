'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store-zustand/useAppStore';
import { TranscriptCard } from './TranscriptCard';
import { TranscriptDetails } from './TranscriptDetails';
import { Transcript } from '@/types';
import { FileText, ChevronDown, Calendar, Clock } from 'lucide-react';

type SortOption = 'newest' | 'oldest' | 'title';

export function Library() {
  const { transcripts } = useAppStore();
  const [selectedTranscript, setSelectedTranscript] = useState<Transcript | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const sortedTranscripts = [...transcripts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'newest':
        return 'Newest First';
      case 'oldest':
        return 'Oldest First';
      case 'title':
        return 'By Title';
      default:
        return 'Newest First';
    }
  };

  const handleTranscriptSelect = (transcript: Transcript) => {
    setSelectedTranscript(transcript);
  };

  const handleCloseDetails = () => {
    setSelectedTranscript(null);
  };

  if (transcripts.length === 0) {
    return (
      <Card className="glass-secondary p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white/40" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No transcripts yet</h3>
          <p className="text-white/60 max-w-md mx-auto">
            Start recording to create your first transcript and build your library.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="glass-secondary p-6">
        <div className="space-y-6">
          {/* Header with sorting */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-medium text-white mb-1">Transcript Library</h2>
              <p className="text-white/60 text-sm">
                {transcripts.length} transcript{transcripts.length !== 1 ? 's' : ''} saved
              </p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/15"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {getSortLabel(sortBy)}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black/90 border-white/20">
                <DropdownMenuItem 
                  onClick={() => setSortBy('newest')}
                  className="text-white hover:bg-white/10"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('oldest')}
                  className="text-white hover:bg-white/10"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Oldest First
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('title')}
                  className="text-white hover:bg-white/10"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  By Title
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Transcripts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTranscripts.map((transcript) => (
              <TranscriptCard
                key={transcript.id}
                transcript={transcript}
                onClick={() => handleTranscriptSelect(transcript)}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Transcript Details Sheet */}
      {selectedTranscript && (
        <TranscriptDetails
          transcript={selectedTranscript}
          isOpen={!!selectedTranscript}
          onClose={handleCloseDetails}
        />
      )}
    </>
  );
}