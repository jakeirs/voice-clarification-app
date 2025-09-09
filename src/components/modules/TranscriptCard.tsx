'use client';

import { Card } from '@/components/ui/card';
import { Transcript } from '@/types';
import { FileText, Calendar, Clock } from 'lucide-react';

interface TranscriptCardProps {
  transcript: Transcript;
  onClick?: () => void;
}

export function TranscriptCard({ transcript, onClick }: TranscriptCardProps) {
  const truncateText = (text: string, maxLength: number = 80) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card 
      className="glass-secondary p-4 cursor-pointer hover:bg-white/5 transition-colors"
      onClick={onClick}
    >
      <div className="space-y-3">
        {/* Title and Icon */}
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-sm mb-1 truncate">
              {transcript.title}
            </h3>
            <p className="text-white/70 text-xs leading-relaxed">
              {truncateText(transcript.text)}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center space-x-2">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(transcript.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3" />
            <span>{formatTime(transcript.createdAt)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}