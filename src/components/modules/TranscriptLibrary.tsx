'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store-zustand/useAppStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Transcript } from '@/types';
import { formatDuration } from '@/lib/audioUtils';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Trash2, 
  Save,
  Edit,
  Play,
  Pause,
  Volume2
} from 'lucide-react';

export function TranscriptLibrary() {
  const { transcripts, updateTranscript, deleteTranscript } = useAppStore();
  const [selectedTranscript, setSelectedTranscript] = useState<Transcript | null>(null);
  const [editedText, setEditedText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleOpenSheet = (transcript: Transcript) => {
    setSelectedTranscript(transcript);
    setEditedText(transcript.text);
    setIsEditing(false);
    setConfirmDelete(null);
  };

  const handleSaveEdit = () => {
    if (selectedTranscript && editedText.trim()) {
      updateTranscript(selectedTranscript.id, { text: editedText.trim() });
      setIsEditing(false);
      // Update the selected transcript to reflect changes
      setSelectedTranscript({ ...selectedTranscript, text: editedText.trim() });
    }
  };

  const handleDelete = (transcriptId: string) => {
    deleteTranscript(transcriptId);
    setConfirmDelete(null);
    // Close sheet if this transcript was selected
    if (selectedTranscript?.id === transcriptId) {
      setSelectedTranscript(null);
    }
  };

  const handlePlayPause = (transcript: Transcript) => {
    if (!transcript.audioBlob && !transcript.audioUrl) return;

    const audioSrc = transcript.audioUrl || (transcript.audioBlob ? URL.createObjectURL(transcript.audioBlob) : '');
    if (!audioSrc) return;

    if (isPlaying === transcript.id) {
      // Pause current audio
      const existingAudio = document.querySelector(`audio[data-transcript-id="${transcript.id}"]`) as HTMLAudioElement;
      if (existingAudio) {
        existingAudio.pause();
      }
      setIsPlaying(null);
    } else {
      // Stop any currently playing audio
      const playingAudio = document.querySelector('audio:not([paused])') as HTMLAudioElement;
      if (playingAudio) {
        playingAudio.pause();
      }

      // Play new audio
      const audio = new Audio(audioSrc);
      audio.setAttribute('data-transcript-id', transcript.id);
      audio.onended = () => setIsPlaying(null);
      audio.play();
      setIsPlaying(transcript.id);
    }
  };

  const truncateText = (text: string, maxLength: number = 100) => {
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

  if (transcripts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-white/40" />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">No transcripts yet</h3>
        <p className="text-white/60 max-w-md mx-auto">
          Start recording to create your first transcript and build your library.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transcripts.map((transcript) => (
          <Sheet key={transcript.id}>
            <SheetTrigger asChild>
              <Card 
                className="glass-secondary p-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => handleOpenSheet(transcript)}
              >
                <div className="space-y-3">
                  {/* Transcript Preview */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm leading-relaxed">
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

                  {/* Audio duration if available */}
                  {transcript.duration && (
                    <div className="flex items-center space-x-2 text-xs text-white/60">
                      <Volume2 className="w-3 h-3" />
                      <span>{formatDuration(transcript.duration)}</span>
                    </div>
                  )}
                </div>
              </Card>
            </SheetTrigger>

            <SheetContent className="w-full sm:max-w-2xl">
              <SheetHeader>
                <SheetTitle>Transcript Details</SheetTitle>
                <SheetDescription>
                  Created on {formatDate(transcript.createdAt)} at {formatTime(transcript.createdAt)}
                  {transcript.duration && ` • ${formatDuration(transcript.duration)}`}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                {/* Audio Controls */}
                {(transcript.audioBlob || transcript.audioUrl) && (
                  <div className="flex items-center space-x-2 p-3 bg-white/5 rounded-lg">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePlayPause(transcript)}
                      className="w-8 h-8 p-0 bg-white/10 hover:bg-white/15"
                    >
                      {isPlaying === transcript.id ? (
                        <Pause className="w-4 h-4 text-white" />
                      ) : (
                        <Play className="w-4 h-4 text-white" />
                      )}
                    </Button>
                    <span className="text-sm text-white/70">
                      {isPlaying === transcript.id ? 'Playing' : 'Play recording'}
                    </span>
                  </div>
                )}

                {/* Transcript Content */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white">Transcript</label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (isEditing) {
                          handleSaveEdit();
                        } else {
                          setIsEditing(true);
                        }
                      }}
                      className="text-xs bg-white/10 hover:bg-white/15"
                    >
                      {isEditing ? (
                        <>
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </>
                      ) : (
                        <>
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </>
                      )}
                    </Button>
                  </div>

                  {isEditing ? (
                    <Textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="min-h-32 bg-white/5 border-white/20 text-white placeholder:text-white/50 resize-none"
                      rows={6}
                    />
                  ) : (
                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                      <p className="text-white leading-relaxed whitespace-pre-wrap">
                        {selectedTranscript?.text || transcript.text}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-4 border-t border-white/10">
                  <div>
                    {confirmDelete === transcript.id ? (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(transcript.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Confirm Delete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setConfirmDelete(null)}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/15"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setConfirmDelete(transcript.id)}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/15"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>

                  <div className="text-xs text-white/50">
                    Last updated: {formatDate(transcript.updatedAt)} at {formatTime(transcript.updatedAt)}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </div>
  );
}